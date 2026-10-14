const express = require('express');
const { book, ERRORS } = require('./bookingPolicy');

const MESSAGES = {
  [ERRORS.ALREADY_BOOKED]: 'You are already booked on this event',
  [ERRORS.EVENT_FULL]: 'This event is full',
};

function createBookingsRouter({ eventQuery, auth, notifier, bookingRepo }) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      const user = auth.authenticate(req);
      if (!user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
      if (user.role !== 'STUDENT') return res.status(403).json({ error: 'FORBIDDEN' });

      const event = await eventQuery.getEvent(req.body?.eventId);
      if (!event) return res.status(404).json({ error: 'EVENT_NOT_FOUND' });

      const result = book({
        event,
        studentId: user.userId,
        existingBookings: bookingRepo.all(),
      });
      if (!result.ok) {
        return res.status(409).json({ error: result.error, message: MESSAGES[result.error] });
      }

      bookingRepo.save(result.booking);
      await notifier.send(user.email, 'BOOKING_CONFIRMATION', {
        eventTitle: event.title,
        bookingRef: result.booking.reference,
      });

      return res.status(201).json({
        bookingRef: result.booking.reference,
        eventTitle: event.title,
        eventDate: event.date,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { createBookingsRouter };