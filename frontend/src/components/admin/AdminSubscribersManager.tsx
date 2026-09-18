import React, { useState } from 'react';
import { Mail, Copy, Check, Trash2, Search, Users, Download } from 'lucide-react';

interface AdminSubscribersManagerProps {
  subscribers: string[];
  onDeleteSubscriber: (email: string) => Promise<void>;
}

export const AdminSubscribersManager: React.FC<AdminSubscribersManagerProps> = ({
  subscribers,
  onDeleteSubscriber
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = subscribers.filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAll = () => {
    navigator.clipboard.writeText(subscribers.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Email\n' + subscribers.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'luxeliving_vip_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            VIP Off-Market Subscribers
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Investors and buyers subscribed to receive unlisted architectural previews and private off-market listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Emails' : 'Copy All Emails'}
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and stats bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
          />
        </div>

        <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#22c55e]" />
          Total Audience: {subscribers.length} High-Intent Buyers
        </span>
      </div>

      {/* Subscribers Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center">
          <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No subscribers found</h3>
          <p className="text-xs text-neutral-500 mt-1">Users who subscribe via the website banner will show up here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-neutral-100">
            {filtered.map((email, idx) => (
              <div
                key={email}
                className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 font-mono">
                      {email}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Tier: Ultra-High-Net-Worth VIP Access List
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${email}`}
                    className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Send individual email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onDeleteSubscriber(email)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
