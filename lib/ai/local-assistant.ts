export function getLocalAssistantResponse(input: string) {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return 'Ask WorkDesk AI about tasks, notes, requirements, templates, or bank documents.';
  }

  if (normalized.includes('task') || normalized.includes('pending')) {
    return 'I found 4 pending work items including SWIFT follow-up, KYC review, and required document verification.';
  }

  if (normalized.includes('swift')) {
    return 'SWIFT work is active: review the intermediary bank status, confirm the payment purpose, and send a customer update.';
  }

  if (normalized.includes('kyc')) {
    return 'KYC follow-up is required. Check for missing identity documents and request the customer to resubmit the incomplete items.';
  }

  if (normalized.includes('email')) {
    return 'Draft a concise professional email with subject, customer greeting, requested action, and clear follow-up date.';
  }

  if (normalized.includes('calculate') || normalized.includes('emi') || normalized.includes('loan')) {
    return 'Use the Calculators module for EMI, FD, SIP, percentage, and loan estimates. For example, EMI calculations can be done from the app workspace.';
  }

  return 'Local WorkDesk Assistant can search tasks, notes, requirements, and templates. For external AI, configure AI_API_KEY and AI_BASE_URL in the environment.';
}
