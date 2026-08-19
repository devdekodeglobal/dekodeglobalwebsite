import { createCalendarBooking, readCalendarConfig } from '../_calendar/googleCalendar.js';

const MAX_BODY_BYTES = 16_000;
const sanitize = (value, limit) => [...String(value ?? '')]
  .map((character) => character.charCodeAt(0) < 32 ? ' ' : character)
  .join('')
  .replace(/[<>]/g, ' ')
  .trim()
  .slice(0, limit);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validPhone = (value) => /^\+?[0-9][0-9\s().-]{6,24}$/.test(value);

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  if (Number(request.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return response.status(413).json({ ok: false, error: 'Request is too large.' });
  }

  const payload = request.body || {};
  const booking = {
    visitorName: sanitize(payload.visitorName, 120),
    visitorEmail: sanitize(payload.visitorEmail, 254),
    company: sanitize(payload.company, 160),
    phone: sanitize(payload.phone, 30),
    projectSummary: sanitize(payload.projectSummary, 2000),
    startIso: sanitize(payload.startIso, 40),
    visitorTimezone: sanitize(payload.timezone, 100) || 'UTC',
  };
  if (booking.visitorName.length < 2 || !validEmail(booking.visitorEmail) || booking.company.length < 2 || !validPhone(booking.phone) || booking.projectSummary.length < 4 || !Number.isFinite(Date.parse(booking.startIso))) {
    return response.status(400).json({ ok: false, error: 'Name, valid email, company, phone number, project summary, and meeting time are required.' });
  }
  if (payload.website) return response.status(400).json({ ok: false, error: 'The booking could not be submitted.' });

  try {
    const result = await createCalendarBooking(readCalendarConfig(), booking);
    console.info('[DEKODE Calendar] Meeting booked.', { eventId: result.eventId, startIso: result.startIso });

    // Send internal notification email
    try {
      const startDate = new Date(result.startIso).toLocaleString('en-AU', {
        timeZone: 'Australia/Melbourne',
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      });
      const transporter = (await import('nodemailer')).default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"DEKODE Website" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        replyTo: booking.visitorEmail,
        subject: `📅 New Meeting Booked: ${booking.visitorName} from ${booking.company}`,
        html: `
          <h2>New Discovery Call Booked</h2>
          <p><strong>Name:</strong> ${booking.visitorName}</p>
          <p><strong>Email:</strong> ${booking.visitorEmail}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Company:</strong> ${booking.company}</p>
          <br/>
          <p><strong>Meeting Time:</strong> ${startDate}</p>
          ${result.meetLink ? `<p><strong>Google Meet Link:</strong> <a href="${result.meetLink}">${result.meetLink}</a></p>` : ''}
          <br/>
          <p><strong>Project Summary:</strong><br/>${booking.projectSummary.replace(/\n/g, '<br/>')}</p>
        `,
      });
    } catch (mailError) {
      console.error('[DEKODE Calendar] Booking notification email failed.', mailError.message);
    }

    return response.status(201).json({
      ok: true,
      booked: true,
      startIso: result.startIso,
      endIso: result.endIso,
      meetLink: result.meetLink,
      message: 'Your discovery call is booked. A calendar invitation has been sent to your email.',
    });
  } catch (error) {
    if (error.code === 'SLOT_UNAVAILABLE') return response.status(409).json({ ok: false, error: error.message });
    if (error.code === 'CALENDAR_NOT_CONFIGURED') return response.status(503).json({ ok: false, error: 'Live calendar booking is not configured yet.' });
    console.error('[DEKODE Calendar] Booking failed.', { message: error.message, status: error.status });
    return response.status(502).json({ ok: false, error: 'The meeting could not be booked. Please try again.' });
  }
}
