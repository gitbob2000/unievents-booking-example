const express = require('express');

function createEventsRouter({ eventQuery }) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const event = await eventQuery.getEvent(req.params.id);
      if (!event) return res.status(404).json({ error: 'EVENT_NOT_FOUND' });
      return res.json(event);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { createEventsRouter };