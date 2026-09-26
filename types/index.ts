export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'normal' | 'high';
  category: string;
  dueDate?: string;
  completed?: boolean;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  pinned: boolean;
};

export type Requirement = {
  id: string;
  service: string;
  title: string;
  optional: boolean;
  notes: string;
};

export type BankDocumentItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  favorite: boolean;
};

export const demoTasks: Task[] = [
  { id: 'tsk-1', title: 'Verify corporate account documents', description: 'Review submitted KYC papers and confirm completeness.', status: 'pending', priority: 'high', category: 'Operations', dueDate: '2026-09-26' },
  { id: 'tsk-2', title: 'Follow up SWIFT transaction', description: 'Check intermediary bank response and send update to customer.', status: 'pending', priority: 'high', category: 'SWIFT', dueDate: '2026-09-27' },
  { id: 'tsk-3', title: 'Send customer confirmation', description: 'Share the final transaction confirmation and required documentation list.', status: 'completed', priority: 'normal', category: 'Customer', dueDate: '2026-09-25' },
  { id: 'tsk-4', title: 'Check pending KYC', description: 'Review all pending KYC files and escalate incomplete items.', status: 'pending', priority: 'normal', category: 'KYC', dueDate: '2026-09-28' },
  { id: 'tsk-5', title: 'Prepare branch compliance review', description: 'Collect required reports and checklist for monthly compliance review.', status: 'pending', priority: 'high', category: 'Compliance', dueDate: '2026-09-30' }
];

export const demoNotes: Note[] = [
  { id: 'note-1', title: 'SWIFT procedure note', content: 'Customer needs intermediary bank confirmation before final release. Escalate if no response within 48 hours.', tags: ['swift', 'operations'], category: 'Operations', pinned: true },
  { id: 'note-2', title: 'Daily customer follow-up', content: 'Always request updated passport copy and utility bill when KYC is incomplete.', tags: ['kyc', 'customer'], category: 'Customer', pinned: false },
  { id: 'note-3', title: 'Email tone reminder', content: 'For formal customer communication, keep subject short and include action requested by date.', tags: ['email', 'communication'], category: 'General', pinned: false }
];

export const demoRequirements: Requirement[] = [
  { id: 'req-1', service: 'Individual Account Opening', title: 'Citizen ID Copy', optional: false, notes: 'DEMO / EDITABLE requirement' },
  { id: 'req-2', service: 'Corporate Account Opening', title: 'Company Registration Certificate', optional: false, notes: 'DEMO / EDITABLE requirement' },
  { id: 'req-3', service: 'SWIFT', title: 'Purpose of transfer letter', optional: true, notes: 'DEMO / EDITABLE requirement' }
];

export const demoBankDocuments: BankDocumentItem[] = [
  { id: 'doc-1', title: 'Account Opening Form', category: 'Individual Account', description: 'Customer onboarding form for individual account opening.', tags: ['account', 'form'], url: 'https://www.kumaribank.com/download', favorite: true },
  { id: 'doc-2', title: 'Corporate KYC Checklist', category: 'KYC', description: 'Checklist for verifying corporate entity documentation.', tags: ['kyc', 'corporate'], url: 'https://www.kumaribank.com/download', favorite: false },
  { id: 'doc-3', title: 'SWIFT Transfer Request', category: 'SWIFT', description: 'Bank transfer request for international remittance.', tags: ['swift', 'transfer'], url: 'https://www.kumaribank.com/download', favorite: true }
];

export const demoQuickTools = [
  'PDF Studio', 'Image Studio', 'Required Documents', 'Email Writer', 'Templates', 'Calculators', 'Bank Documents', 'File Finder', 'Credential Vault'
];
