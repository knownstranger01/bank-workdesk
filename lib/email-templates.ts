export const emailTemplates = {
  customerUpdate: {
    name: 'Customer Update',
    subject: 'Follow-up on your {{Purpose}} request',
    body: `Dear {{CustomerName}},\n\nThank you for your patience while we process your {{Purpose}} request. We are currently reviewing the required information and will share the next update shortly.\n\nPlease let us know if there are any changes to your contact details or supporting documents.\n\nRegards,\nBank WorkDesk Team`,
  },
  kycFollowUp: {
    name: 'KYC Follow-up',
    subject: 'Required document update for {{Purpose}}',
    body: `Dear {{CustomerName}},\n\nWe would like to request the following documents to complete your {{Purpose}} onboarding review:\n\n- Updated identification document\n- Address proof\n- Any additional supporting document requested by the compliance team\n\nPlease send the files at your earliest convenience so we can proceed without delay.\n\nRegards,\nBank WorkDesk Team`,
  },
  swiftReminder: {
    name: 'SWIFT Reminder',
    subject: 'SWIFT transfer follow-up for {{Purpose}}',
    body: `Dear {{CustomerName}},\n\nThis is a reminder regarding your SWIFT transfer request for {{Purpose}}. Please confirm the beneficiary details and purpose of payment before we proceed to final processing.\n\nOnce confirmed, we will continue with the required review and notify you of the next step.\n\nRegards,\nBank WorkDesk Team`,
  },
} as const;

export function buildEmailDraft(
  templateKey: keyof typeof emailTemplates,
  values: Record<string, string>,
) {
  const template = emailTemplates[templateKey];

  return {
    subject: template.subject.replace(/\{\{(.*?)\}\}/g, (_, key: string) => values[key.trim()] ?? `{{${key.trim()}}}`),
    body: template.body.replace(/\{\{(.*?)\}\}/g, (_, key: string) => values[key.trim()] ?? `{{${key.trim()}}}`),
  };
}
