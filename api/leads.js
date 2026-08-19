const MAX_BODY_BYTES = 32_000;

const sanitize = (value, limit = 4000) =>
  [...String(value ?? '')]
    .map((character) => character.charCodeAt(0) < 32 ? ' ' : character)
    .join('')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, limit);

function validate(payload) {
  const errors = [];
  if (!payload.visitorName || sanitize(payload.visitorName, 120).length < 2) errors.push('A valid name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitize(payload.visitorEmail, 254))) errors.push('A valid email is required.');
  if (!payload.company || sanitize(payload.company, 160).length < 2) errors.push('A company is required.');
  if (!/^\+?[0-9][0-9\s().-]{6,24}$/.test(sanitize(payload.phone, 30))) errors.push('A valid phone number is required.');
  if (!payload.projectSummary || sanitize(payload.projectSummary).length < 4) errors.push('A project summary is required.');
  return errors;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  const rawLength = Number(request.headers['content-length'] || 0);
  if (rawLength > MAX_BODY_BYTES) return response.status(413).json({ ok: false, error: 'Request is too large.' });

  const payload = request.body || {};
  const errors = validate(payload);
  if (errors.length) return response.status(400).json({ ok: false, errors });

  const safePayload = {
    visitorName: sanitize(payload.visitorName, 120),
    visitorEmail: sanitize(payload.visitorEmail, 254),
    company: sanitize(payload.company, 160),
    phone: sanitize(payload.phone, 30),
    projectSummary: sanitize(payload.projectSummary),
    services: Array.isArray(payload.services) ? payload.services.slice(0, 10).map((item) => sanitize(item, 120)) : [],
    timeline: sanitize(payload.timeline, 160),
    budgetRange: sanitize(payload.budgetRange, 160),
    selectedMeetingPreference: sanitize(payload.selectedMeetingPreference, 240),
    timezone: sanitize(payload.timezone, 100),
    conversationSummary: sanitize(payload.conversationSummary),
    sourcePage: sanitize(payload.sourcePage, 500),
    submittedAt: new Date().toISOString(),
  };

  const htmlContent = `
    <h2>New Discovery Lead</h2>
    <p><strong>Name:</strong> ${safePayload.visitorName}</p>
    <p><strong>Email:</strong> ${safePayload.visitorEmail}</p>
    <p><strong>Phone:</strong> ${safePayload.phone}</p>
    <p><strong>Company:</strong> ${safePayload.company}</p>
    <br/>
    <p><strong>Project Summary:</strong><br/>${safePayload.projectSummary.replace(/\n/g, '<br/>')}</p>
    <p><strong>Timeline:</strong> ${safePayload.timeline || 'Not specified'}</p>
    <p><strong>Budget Range:</strong> ${safePayload.budgetRange || 'Not specified'}</p>
    <p><strong>Services:</strong> ${safePayload.services.join(', ') || 'Not specified'}</p>
    <br/>
    <p><strong>Meeting Preference:</strong> ${safePayload.selectedMeetingPreference || 'No specific time selected'}</p>
    <p><strong>Timezone:</strong> ${safePayload.timezone}</p>
    <br/>
    <p><strong>Conversation Summary:</strong><br/>${safePayload.conversationSummary?.replace(/\n/g, '<br/>') || 'No summary available'}</p>
  `;

  try {
    const transporter = (await import('nodemailer')).default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: \`"DEKODE Website" <\${process.env.SMTP_USER}>\`,
      to: process.env.SMTP_USER,
      replyTo: safePayload.visitorEmail,
      subject: \`New Lead: \${safePayload.company} - \${safePayload.visitorName}\`,
      html: htmlContent,
    });

    return response.status(200).json({
      ok: true,
      delivered: true,
      mode: 'live',
      message: 'Lead received and email sent successfully.',
    });
  } catch (error) {
    console.error('[Leads API] Email failed to send:', error);
    return response.status(500).json({
      ok: false,
      delivered: false,
      mode: 'error',
      message: 'Lead received but failed to send email notification.',
    });
  }
}
