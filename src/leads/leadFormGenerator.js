export function generateLeadForm(profile, selectedSlot = null) {
  return {
    name: profile.name || '',
    email: profile.email || '',
    company: profile.company || '',
    phone: profile.phone || '',
    projectType: profile.projectType || '',
    interestedServices: profile.recommendedServices || [],
    projectSummary: profile.projectSummary || '',
    businessProblem: profile.businessProblem || '',
    timeline: profile.timeline || '',
    budgetRange: profile.budgetRange || '',
    preferredMeetingDate: selectedSlot?.iso?.slice(0, 10) || '',
    preferredMeetingTime: selectedSlot?.label || '',
    preferredMeetingStart: selectedSlot?.iso || '',
    preferredMeetingEnd: selectedSlot?.endIso || '',
    meetingSlotIsMock: Boolean(selectedSlot?.isMock),
    timezone: selectedSlot?.visitorTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    additionalNotes: '',
    inferredFields: Object.entries(profile).filter(([, value]) => Array.isArray(value) ? value.length : Boolean(value)).map(([key]) => key),
  };
}

export function validateLeadForm(form, consent) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.';
  if (form.company.trim().length < 2) errors.company = 'Company is required.';
  if (!/^\+?[0-9][0-9\s().-]{6,24}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!form.projectSummary.trim()) errors.projectSummary = 'Add a short project summary.';
  if (!consent) errors.consent = 'Consent is required before submission.';
  return errors;
}
