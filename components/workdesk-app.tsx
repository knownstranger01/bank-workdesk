'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calculator,
  CheckCircle2,
  Command,
  FileCheck,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Lock,
  Mail,
  Menu,
  Moon,
  NotePencil,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Trash,
  Upload,
  UserCircle2,
  Wallet,
  Zap,
} from 'lucide-react';

import { buildEmailDraft, emailTemplates } from '@/lib/email-templates';
import { demoBankDocuments, demoNotes, demoQuickTools, demoRequirements, demoTasks } from '@/lib/demo-data';
import type { BankDocumentItem, Note, Requirement, Task } from '@/types';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Zap },
  { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
  { id: 'notes', label: 'Notes', icon: NotePencil },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'pdf', label: 'PDF Studio', icon: FileText },
  { id: 'images', label: 'Image Studio', icon: ImageIcon },
  { id: 'documents', label: 'Bank Documents', icon: BookOpen },
  { id: 'requirements', label: 'Required Documents', icon: FileCheck },
  { id: 'email', label: 'Email Writer', icon: Mail },
  { id: 'templates', label: 'Email Templates', icon: Sparkles },
  { id: 'calculators', label: 'Calculators', icon: Calculator },
  { id: 'vault', label: 'Credential Vault', icon: Lock },
  { id: 'activity', label: 'Activity', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const commandPaletteItems = [
  'New Task',
  'New Note',
  'Upload File',
  'Open PDF Studio',
  'Open Image Studio',
  'Open Email Writer',
  'Open Email Templates',
  'Open Calculators',
  'Open Required Documents',
  'Open Bank Documents',
  'Open Credential Vault',
  'Ask WorkDesk AI',
];

export default function WorkdeskApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [search, setSearch] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState<Note[]>(demoNotes);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [requirements, setRequirements] = useState<Requirement[]>(demoRequirements);
  const [documents, setDocuments] = useState<BankDocumentItem[]>(demoBankDocuments);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiConversation, setAiConversation] = useState([
    { role: 'assistant', text: 'AI provider not configured — using local WorkDesk Assistant' },
  ]);
  const [dateText, setDateText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [emailTemplateKey, setEmailTemplateKey] = useState<keyof typeof emailTemplates>('customerUpdate');
  const [emailValues, setEmailValues] = useState({
    CustomerName: 'Customer',
    Purpose: 'bank account opening',
    Subject: 'Account onboarding',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setDateText(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      );
      setTimeText(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };

    updateClock();
    const interval = setInterval(updateClock, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
      if ((event.ctrlKey || event.metaKey) && key === 'n') {
        event.preventDefault();
        setActiveView('notes');
      }
      if ((event.ctrlKey || event.metaKey) && key === 't') {
        event.preventDefault();
        setActiveView('tasks');
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
        setAiOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const todayStats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const overdue = pending;
    const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    return { completed, pending, overdue, pct };
  }, [tasks]);

  const query = search.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    if (!query) return tasks;
    return tasks.filter((task) =>
      [task.title, task.description, task.category].join(' ').toLowerCase().includes(query),
    );
  }, [query, tasks]);

  const filteredNotes = useMemo(() => {
    if (!query) return notes;
    return notes.filter((note) =>
      [note.title, note.content, note.tags.join(' ')].join(' ').toLowerCase().includes(query),
    );
  }, [notes, query]);

  const searchResults = useMemo(() => {
    if (!query) return null;

    return {
      tasks: filteredTasks.map((item) => item.title),
      notes: filteredNotes.map((item) => item.title),
      documents: documents
        .filter((item) => `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(query))
        .map((item) => item.title),
      templates: ['SWIFT Customer Email', 'Missing Documents', 'Transaction Pending'],
      requirements: requirements
        .filter((item) => item.service.toLowerCase().includes(query) || item.title.toLowerCase().includes(query))
        .map((item) => item.service),
    };
  }, [documents, filteredNotes, filteredTasks, query, requirements]);

  const emailDraft = useMemo(
    () => buildEmailDraft(emailTemplateKey, emailValues),
    [emailTemplateKey, emailValues],
  );

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task,
      ),
    );
  };

  const addNote = () => {
    if (!noteDraft.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Quick Note',
      content: noteDraft,
      tags: ['quick'],
      category: 'General',
      pinned: false,
    };
    setNotes((current) => [newNote, ...current]);
    setNoteDraft('');
  };

  const addTask = () => {
    const title = search.trim() || 'New task';
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: 'Added from quick task',
      status: 'pending',
      priority: 'normal',
      category: 'Operations',
    };
    setTasks((current) => [newTask, ...current]);
    setSearch('');
  };

  const handleCommand = (cmd: string) => {
    setCommandOpen(false);
    if (cmd === 'New Task') addTask();
    if (cmd === 'New Note') setActiveView('notes');
    if (cmd === 'Open PDF Studio') setActiveView('pdf');
    if (cmd === 'Open Email Writer') setActiveView('email');
    if (cmd === 'Open Email Templates') setActiveView('templates');
    if (cmd === 'Open Calculators') setActiveView('calculators');
    if (cmd === 'Open Required Documents') setActiveView('requirements');
    if (cmd === 'Open Bank Documents') setActiveView('documents');
    if (cmd === 'Ask WorkDesk AI') setAiOpen(true);
  };

  const handleAiSubmit = () => {
    if (!aiInput.trim()) return;
    const userText = aiInput.trim();
    const responses = [
      `Local WorkDesk Assistant: I found ${tasks.filter((task) => task.status === 'pending').length} pending tasks and ${notes.length} notes in your workspace.`,
      'Local WorkDesk Assistant: The SWIFT transaction and corporate compliance items are the most active work items right now.',
      'Local WorkDesk Assistant: I can help summarize notes, find documents, or draft a customer email when you send a prompt.',
    ];
    setAiConversation((current) => [
      ...current,
      { role: 'user', text: userText },
      { role: 'assistant', text: responses[Math.floor(Math.random() * responses.length)] },
    ]);
    setAiInput('');
  };

  const activeSection = useMemo(() => {
    if (activeView === 'dashboard') return 'Dashboard';
    if (activeView === 'tasks') return 'Tasks';
    if (activeView === 'notes') return 'Notes';
    if (activeView === 'documents') return 'Bank Documents';
    if (activeView === 'requirements') return 'Required Documents';
    if (activeView === 'pdf') return 'PDF Studio';
    if (activeView === 'images') return 'Image Studio';
    if (activeView === 'email') return 'Email Writer';
    if (activeView === 'templates') return 'Email Templates';
    if (activeView === 'calculators') return 'Calculators';
    return activeView.charAt(0).toUpperCase() + activeView.slice(1);
  }, [activeView]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800 bg-slate-950/80 p-5">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bank-500/20 text-lg font-bold text-bank-100">
              B
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">BANK</div>
              <div className="text-xl font-semibold">WORKDESK</div>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveView(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  activeView === id
                    ? 'bg-bank-500/20 text-white ring-1 ring-bank-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Security</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-sm text-slate-300">Vault is locked automatically after inactivity.</div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200"
            >
              <Lock className="h-4 w-4" /> Lock Vault
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-[#0f172a]">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-xl border border-slate-700 p-2 text-slate-300 md:hidden">
                <Menu className="h-4 w-4" />
              </button>
              <div className="relative hidden w-[440px] lg:block">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks, notes, templates, documents..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 md:block">
                {dateText}
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
                {timeText}
              </div>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200"
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">Ctrl + K</span>
              </button>
              <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/80 p-2 text-slate-200">
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className="rounded-xl border border-slate-700 bg-slate-900/80 p-2 text-slate-200"
              >
                {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200"
              >
                <UserCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sunil</span>
              </button>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</div>
                <h1 className="mt-1 text-3xl font-semibold text-white">{activeSection}</h1>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={addTask} className="rounded-xl bg-bank-500 px-4 py-2 text-sm font-medium text-white">
                  Quick Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200"
                >
                  Ask WorkDesk AI
                </button>
              </div>
            </div>

            {search.trim() && searchResults && (
              <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 text-sm font-medium text-slate-200">Search results for “{search}”</div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(searchResults).map(([group, items]) => (
                    <div key={group}>
                      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">{group}</div>
                      <ul className="space-y-1 text-sm text-slate-300">
                        {(items as string[]).length ? (
                          (items as string[]).slice(0, 4).map((item) => (
                            <li key={item} className="rounded-lg bg-slate-900/80 px-2 py-1">
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500">No matches</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Today's Work</h2>
                      <span className="rounded-full bg-bank-500/15 px-2.5 py-1 text-xs text-bank-100">
                        {todayStats.completed} of {tasks.length} completed
                      </span>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${todayStats.pct}%` }} />
                      </div>
                      <span className="text-sm text-slate-300">{todayStats.pct}%</span>
                    </div>

                    <ul className="space-y-3">
                      {filteredTasks.slice(0, 5).map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleTask(task.id)}
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                task.status === 'completed'
                                  ? 'bg-emerald-500 text-white'
                                  : 'border-slate-500 bg-slate-800'
                              }`}
                            >
                              {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            </button>
                            <div>
                              <div className="font-medium text-slate-100">{task.title}</div>
                              <div className="text-xs text-slate-400">{task.category}</div>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                              task.priority === 'high'
                                ? 'bg-rose-500/15 text-rose-200'
                                : task.priority === 'normal'
                                  ? 'bg-amber-500/15 text-amber-200'
                                  : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Quick Notes</h3>
                        <button type="button" onClick={addNote} className="text-xs text-bank-100">
                          Save
                        </button>
                      </div>
                      <textarea
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.target.value)}
                        placeholder="Capture a quick note..."
                        className="h-28 w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <div className="mb-3 text-lg font-semibold text-white">Quick Tools</div>
                      <div className="grid grid-cols-2 gap-2">
                        {demoQuickTools.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 hover:border-bank-500/40 hover:text-white"
                          >
                            {tool}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Recent Files</h3>
                      <button type="button" className="text-xs text-slate-400">
                        View all
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-300">
                      {['SWIFT_remittance.pdf', 'kyc_documents.pdf', 'customer_form.jpg', 'salary_report.xlsx'].map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-bank-100" /> {file}
                          </div>
                          <button type="button" className="text-xs text-slate-400">
                            Open
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Favorites</h3>
                      <Star className="h-4 w-4 text-amber-300" />
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {['Corporate Account Opening', 'SWIFT Customer Email', 'KYC Checklist', 'Loan EMI Calculator'].map((item) => (
                        <li key={item} className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Workload</h3>
                      <Wallet className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Pending</span>
                        <strong>{todayStats.pending}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Completed</span>
                        <strong>{todayStats.completed}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Overdue</span>
                        <strong>{todayStats.overdue}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'tasks' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Task Management</h2>
                  <button type="button" onClick={addTask} className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                    New Task
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            task.status === 'completed' ? 'bg-emerald-500 text-white' : 'border-slate-500 bg-slate-800'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>
                        <div>
                          <div className="font-medium text-slate-100">{task.title}</div>
                          <div className="text-xs text-slate-400">
                            {task.category} · {task.dueDate ?? 'No due date'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] uppercase ${
                            task.priority === 'high'
                              ? 'bg-rose-500/15 text-rose-200'
                              : task.priority === 'normal'
                                ? 'bg-amber-500/15 text-amber-200'
                                : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <button type="button" className="rounded-lg border border-slate-700 p-2 text-slate-300">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'notes' && (
              <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Notes</h2>
                    <button type="button" onClick={addNote} className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                      Create Note
                    </button>
                  </div>
                  <div className="space-y-4">
                    {filteredNotes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="font-medium text-slate-100">{note.title}</div>
                          {note.pinned && <Star className="h-4 w-4 text-amber-300" />}
                        </div>
                        <div className="whitespace-pre-wrap text-sm text-slate-300">{note.content}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-700 px-2 py-1 text-[10px] uppercase text-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <h3 className="mb-3 text-lg font-semibold text-white">Quick Note</h3>
                  <textarea
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    className="h-52 w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100 outline-none"
                    placeholder="Write down policy, customer follow-up, or internal notes..."
                  />
                  <button type="button" onClick={addNote} className="mt-3 w-full rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                    Save Note
                  </button>
                </div>
              </div>
            )}

            {activeView === 'requirements' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Required Documents</h2>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">DEMO / EDITABLE</div>
                  </div>
                  <button type="button" className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                    Print Requirements
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {requirements.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium text-slate-100">{item.service}</div>
                        <button type="button" className="text-slate-400">
                          <Star className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-300">{item.title}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-400">
                        {item.optional ? 'Optional' : 'Mandatory'}
                      </div>
                      <div className="mt-2 text-xs text-slate-400">{item.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'email' && (
              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Email Writer</h2>
                    <span className="rounded-full bg-bank-500/15 px-2 py-1 text-[10px] uppercase text-bank-100">
                      Draft
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Template</label>
                      <select
                        value={emailTemplateKey}
                        onChange={(event) => setEmailTemplateKey(event.target.value as keyof typeof emailTemplates)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none"
                      >
                        {Object.entries(emailTemplates).map(([key, template]) => (
                          <option key={key} value={key}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(emailValues).map(([field, value]) => (
                        <div key={field}>
                          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">{field}</label>
                          <input
                            value={value}
                            onChange={(event) =>
                              setEmailValues((current) => ({ ...current, [field]: event.target.value }))
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Prepared draft</h3>
                    <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">
                      Copy
                    </button>
                  </div>

                  <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Subject</div>
                      <div className="text-sm text-white">{emailDraft.subject}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Body</div>
                      <div className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{emailDraft.body}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'templates' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Email Templates</h2>
                  <button type="button" className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                    New Template
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setEmailTemplateKey(key as keyof typeof emailTemplates);
                        setActiveView('email');
                      }}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left"
                    >
                      <div className="mb-2 text-base font-medium text-white">{template.name}</div>
                      <div className="text-sm text-slate-300">{template.subject}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'calculators' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <h2 className="mb-4 text-xl font-semibold text-white">Calculators</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {['EMI', 'FD', 'SIP', 'Percentage', 'Loan', 'Tax'].map((calc) => (
                    <div key={calc} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                      <div className="mb-2 text-sm font-medium text-slate-200">{calc}</div>
                      <div className="text-xs text-slate-400">Ready for quick estimate.</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'documents' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Bank Document Library</h2>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Official page: kumaribank.com/download</div>
                  </div>
                  <a
                    href="https://www.kumaribank.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white"
                  >
                    Open Kumari Bank Download Page
                  </a>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium text-slate-100">{doc.title}</div>
                        {doc.favorite && <Star className="h-4 w-4 text-amber-300" />}
                      </div>
                      <div className="text-sm text-slate-300">{doc.description}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-700 px-2 py-1 text-[10px] uppercase text-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-bank-100">
                        <ArrowRight className="h-4 w-4" /> Open URL
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'pdf' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <h2 className="mb-3 text-xl font-semibold text-white">PDF Studio</h2>
                <div className="mb-4 flex flex-wrap gap-2">
                  {['Merge', 'Split', 'Extract Pages', 'Delete Pages', 'Rotate', 'Compress', 'Watermark', 'Print'].map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-9 text-center text-slate-300">
                  <Upload className="mx-auto mb-3 h-8 w-8 text-slate-500" />
                  Drag and drop a PDF here, or select a file to begin processing.
                </div>
              </div>
            )}

            {activeView === 'images' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <h2 className="mb-3 text-xl font-semibold text-white">Image Studio</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <div className="mb-3 text-sm text-slate-300">Original size</div>
                    <div className="text-2xl font-semibold text-white">1,920 × 1,080</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <div className="mb-3 text-sm text-slate-300">Output size</div>
                    <div className="text-2xl font-semibold text-white">1,400 × 900</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Resize', 'Crop', 'Rotate', 'Flip', 'Blur', 'Brightness', 'Contrast', 'Grayscale'].map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'settings' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <h2 className="mb-4 text-xl font-semibold text-white">Settings</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <div className="mb-2 text-sm font-medium text-slate-200">Appearance</div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <SunMedium className="h-4 w-4" /> Light
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                      <Moon className="h-4 w-4" /> Dark
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <div className="mb-2 text-sm font-medium text-slate-200">AI</div>
                    <div className="text-sm text-slate-300">Provider: Local WorkDesk Assistant</div>
                    <div className="mt-2 text-sm text-slate-300">Local only mode: Enabled</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {commandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-6 pt-24">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none"
                placeholder="Type a command or search..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {commandPaletteItems
                .filter((item) => item.toLowerCase().includes(search.toLowerCase()) || !search.trim())
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCommand(item)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-slate-200 hover:bg-slate-900"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Action</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {aiOpen && (
        <div className="fixed bottom-5 right-5 z-40 w-[420px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4 text-bank-100" /> Ask WorkDesk AI
            </div>
            <button type="button" onClick={() => setAiOpen(false)} className="text-slate-400">
              ✕
            </button>
          </div>
          <div className="max-h-[350px] space-y-3 overflow-y-auto p-4">
            {aiConversation.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm ${
                  item.role === 'assistant' ? 'bg-slate-900 text-slate-200' : 'bg-bank-500/15 text-bank-50'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 p-3">
            <textarea
              value={aiInput}
              onChange={(event) => setAiInput(event.target.value)}
              rows={3}
              placeholder="Ask anything about your work..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100 outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button type="button" onClick={handleAiSubmit} className="rounded-xl bg-bank-500 px-3 py-2 text-sm text-white">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
