const eventId = window.location.pathname.split('/').pop();

const titleEl = document.getElementById('event-title');
const dateEl = document.getElementById('event-date');
const button = document.getElementById('book-button');
const message = document.getElementById('message');
const confirmation = document.getElementById('confirmation');

async function loadEvent() {
  const res = await fetch(`/api/events/${eventId}`);
  if (res.status === 404) {
    titleEl.textContent = 'Event not found';
    return;
  }
  if (!res.ok) {
    titleEl.textContent = 'Sorry, we could not load this event';
    return;
  }
  const event = await res.json();
  titleEl.textContent = event.title;
  dateEl.textContent = event.date;
  button.disabled = false;
}

async function book() {

  button.disabled = true;
  message.textContent = '';

  const res = await fetch('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId }),
  });
  const body = await res.json().catch(() => ({}));

  if (res.status === 201) {
    document.getElementById('confirmation-title').textContent = body.eventTitle;
    document.getElementById('confirmation-date').textContent = body.eventDate;
    document.getElementById('confirmation-ref').textContent = body.bookingRef;
    confirmation.hidden = false;
    button.textContent = 'Booked';
  } else {
    message.textContent = body.message || 'Booking failed. Please try again.';
    button.disabled = false;
  }
}

button.addEventListener('click', book);
loadEvent();