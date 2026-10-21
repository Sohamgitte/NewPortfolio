import React, { useState } from 'react';
import { Mail, Trash2, Reply, Search, Clock } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const AdminMessages: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = messages
    .filter((m) => {
      const matchFilter = filter === 'all' || !m.is_read;
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message permanently?')) {
      await deleteMessage(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Inbound Inquiries Inbox</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Private inquiries sent via your public portfolio contact form. Strictly protected with RLS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'unread' ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900'
            }`}
          >
            Unread ({messages.filter((m) => !m.is_read).length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by sender or text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans shadow-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-2">
          <Mail className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-neutral-800 font-heading">No Inquiries Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
            {messages.length === 0
              ? 'When visitors submit the contact form on your portfolio, their messages will arrive securely here.'
              : 'No messages match your active search filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all space-y-3 ${
                msg.is_read
                  ? 'bg-white border-neutral-200 shadow-xs'
                  : 'bg-white border-neutral-300 shadow-md ring-1 ring-neutral-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 font-heading">{msg.name}</h3>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-sans text-neutral-600 hover:text-neutral-900 hover:underline font-semibold"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.created_at || Date.now()).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {msg.subject && (
                <p className="text-xs font-sans text-neutral-600">
                  Subject: <span className="text-neutral-900 font-bold">{msg.subject}</span>
                </p>
              )}

              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50 p-4 rounded-xl border border-neutral-200 font-sans">
                {msg.message}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 shadow-xs font-sans"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markMessageRead(msg.id, !msg.is_read)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold font-sans"
                  >
                    {msg.is_read ? 'Mark Unread' : 'Mark as Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-xs"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
