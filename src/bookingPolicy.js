// // Placeholder: real logic will be written later (Green).
// function book({ event, studentId, existingBookings }) {
//   return { ok: false, error: 'NOT_IMPLEMENTED', booked: event.booked };
// }

// module.exports = { book };

// function book({ event, studentId, existingBookings }) {
//   const alreadyBooked = existingBookings.some(
//     (b) => b.eventId === event.id && b.studentId === studentId
//   );
//   if (alreadyBooked) {
//     return { ok: false, error: 'ALREADY_BOOKED', booked: event.booked };
//   }

//   if (event.booked >= event.capacity) {
//     return { ok: false, error: 'EVENT_FULL', booked: event.booked };
//   }

//   const next = existingBookings.length + 1;
//   const reference = 'BK-' + String(next).padStart(4, '0');

//   return {
//     ok: true,
//     booked: event.booked + 1,
//     booking: { reference, eventId: event.id, studentId },
//   };
// }

// module.exports = { book };

// Refactor
const ERRORS = {
  ALREADY_BOOKED: 'ALREADY_BOOKED',
  EVENT_FULL: 'EVENT_FULL',
};

function hasBooking(existingBookings, eventId, studentId) {
  return existingBookings.some(
    (b) => b.eventId === eventId && b.studentId === studentId
  );
}

function isFull(event) {
  return event.booked >= event.capacity;
}

function nextReference(existingBookings) {
  const next = existingBookings.length + 1;
  return `BK-${String(next).padStart(4, '0')}`;
}

function reject(error, event) {
  return { ok: false, error, booked: event.booked };
}

function book({ event, studentId, existingBookings }) {
  if (hasBooking(existingBookings, event.id, studentId)) {
    return reject(ERRORS.ALREADY_BOOKED, event);
  }
  if (isFull(event)) {
    return reject(ERRORS.EVENT_FULL, event);
  }

  return {
    ok: true,
    booked: event.booked + 1,
    booking: {
      reference: nextReference(existingBookings),
      eventId: event.id,
      studentId,
    },
  };
}

module.exports = { book, ERRORS };