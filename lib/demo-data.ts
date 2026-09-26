export const demoTasks = [
  {
    id: 'task-1',
    title: 'Verify corporate account documents',
    description: 'Review submitted account opening documents and confirm completeness.',
    status: 'pending',
    priority: 'high',
    category: 'Operations',
    dueDate: '2026-09-26',
  },
  {
    id: 'task-2',
    title: 'Follow up SWIFT transaction',
    description: 'Verify intermediary bank status and provide update to the customer.',
    status: 'pending',
    priority: 'high',
    category: 'SWIFT',
    dueDate: '2026-09-27',
  },
  {
    id: 'task-3',
    title: 'Send customer confirmation',
    description: 'Send the final confirmation letter with the completed transaction details.',
    status: 'completed',
    priority: 'normal',
    category: 'Customer',
    dueDate: '2026-09-25',
  },
  {
    id: 'task-4',
    title: 'Check pending KYC',
    description: 'Follow up with the customer for the missing identity documents.',
    status: 'pending',
    priority: 'normal',
    category: 'KYC',
    dueDate: '2026-09-28',
  },
];

export const demoNotes = [
  {
    id: 'note-1',
    title: 'SWIFT procedure note',
    content: 'Before releasing the transfer, confirm the purpose of payment and intermediary bank details.',
    tags: ['swift', 'operations'],
    category: 'Operations',
    pinned: true,
  },
  {
    id: 'note-2',
    title: 'Daily customer follow-up',
    content: 'Always request additional identity proof for incomplete KYC checks. Keep a clear timestamp trail.',
    tags: ['customer', 'kyc'],
    category: 'Customer',
    pinned: false,
  },
  {
    id: 'note-3',
    title: 'Email tone reminder',
    content: 'Use professional and concise tone for customer emails. Include requested follow-up date and action item.',
    tags: ['email', 'communication'],
    category: 'General',
    pinned: false,
  },
];

export const demoRequirements = [
  {
    id: 'req-1',
    service: 'Individual Account Opening',
    title: 'Citizen ID Copy',
    optional: false,
    notes: 'DEMO / EDITABLE requirement',
  },
  {
    id: 'req-2',
    service: 'Corporate Account Opening',
    title: 'Company Registration Certificate',
    optional: false,
    notes: 'DEMO / EDITABLE requirement',
  },
  {
    id: 'req-3',
    service: 'SWIFT',
    title: 'Purpose of transfer letter',
    optional: true,
    notes: 'DEMO / EDITABLE requirement',
  },
];

export const demoBankDocuments = [
  {
    id: 'doc-1',
    title: 'Account Opening Form',
    description: 'Customer onboarding form for individual account opening.',
    category: 'Individual Account',
    tags: ['account', 'form'],
    url: 'https://www.kumaribank.com/download',
    favorite: true,
  },
  {
    id: 'doc-2',
    title: 'Corporate KYC Checklist',
    description: 'Checklist for corporate customer document verification.',
    category: 'KYC',
    tags: ['kyc', 'corporate'],
    url: 'https://www.kumaribank.com/download',
    favorite: false,
  },
  {
    id: 'doc-3',
    title: 'SWIFT Transfer Request',
    description: 'Template and guidance for international remittance requests.',
    category: 'SWIFT',
    tags: ['swift', 'transfer'],
    url: 'https://www.kumaribank.com/download',
    favorite: true,
  },
];

export const demoQuickTools = [
  'PDF Studio',
  'Image Studio',
  'Required Documents',
  'Email Writer',
  'Templates',
  'Calculators',
  'Bank Documents',
  'File Finder',
  'Credential Vault',
];
