export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'normal' | 'high';
  category: string;
  dueDate?: string;
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
  description: string;
  category: string;
  tags: string[];
  url: string;
  favorite: boolean;
};
