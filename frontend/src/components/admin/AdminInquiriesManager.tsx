import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Phone, 
  Mail, 
  Trash2, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileEdit, 
  Check, 
  Send,
  User
} from 'lucide-react';
import { InquiryLead } from '../../types';

interface AdminInquiriesManagerProps {
  inquiries: InquiryLead[];
  onUpdateStatus: (id: string, status: 'pending' | 'contacted' | 'negotiating' | 'closed', notes?: string) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

export const AdminInquiriesManager: React.FC<AdminInquiriesManagerProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'negotiating':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'closed':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const handleStartEditNote = (inq: InquiryLead) => {
    setEditingNotesId(inq.id);
    setNoteText(inq.notes || '');
  };

  const handleSaveNote = async (id: string, currentStatus: any) => {
    await onUpdateStatus(id, currentStatus, noteText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Advisory Consultations & High-Net-Worth Leads
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage incoming buyer mandates, NRI investor inquiries, and property seller representation requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200 flex items-center gap-1.5">
            <MessageSquareText className="w-4 h-4" />
            {inquiries.filter(i => i.status === 'pending').length} Inquiries Needing Follow-up
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs text-xs font-semibold">
        {[
          { key: 'all', label: `All Inquiries (${inquiries.length})` },
          { key: 'pending', label: `Pending Review (${inquiries.filter(i => i.status === 'pending').length})` },
          { key: 'contacted', label: `Contacted (${inquiries.filter(i => i.status === 'contacted').length})` },
          { key: 'negotiating', label: `In Negotiation (${inquiries.filter(i => i.status === 'negotiating').length})` },
          { key: 'closed', label: `Closed (${inquiries.filter(i => i.status === 'closed').length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === tab.key
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inquiry Leads List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center">
          <MessageSquareText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No leads in this category</h3>
          <p className="text-xs text-neutral-500 mt-1">Inquiries submitted by prospective buyers or sellers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Client info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-neutral-400" />
                      {inq.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {inq.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      Interest: {inq.interestType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {inq.email}
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="text-neutral-700 hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {inq.phone}
                      </a>
                    )}
                    {inq.preferredLocation && (
                      <span className="flex items-center gap-1 text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        Target: <strong>{inq.preferredLocation}</strong>
                      </span>
                    )}
                    {inq.budgetRange && (
                      <span className="flex items-center gap-1 text-[#16a34a] font-semibold">
                        Budget: {inq.budgetRange}
                      </span>
                    )}
                  </div>

                  {/* Message Quote */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-800 leading-relaxed mt-2">
                    "{inq.message}"
                  </div>

                  {/* Advisor Internal Follow-up Notes */}
                  <div className="pt-2">
                    {editingNotesId === inq.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add internal advisory notes (e.g. Sent brochure, client in London)..."
                          className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                        />
                        <button
                          onClick={() => handleSaveNote(inq.id, inq.status)}
                          className="px-3 py-1.5 bg-[#22c55e] text-white rounded-xl text-xs font-semibold hover:bg-[#16a34a] flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>
                          <strong>Internal Note:</strong> {inq.notes || <em className="text-neutral-400">No notes recorded yet.</em>}
                        </span>
                        <button
                          onClick={() => handleStartEditNote(inq)}
                          className="text-neutral-500 hover:text-neutral-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FileEdit className="w-3 h-3" />
                          {inq.notes ? 'Edit note' : '+ Add note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions Controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 shrink-0">
                  <select
                    value={inq.status}
                    onChange={(e) => onUpdateStatus(inq.id, e.target.value as any, inq.notes)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer focus:outline-hidden ${getStatusBadge(inq.status)}`}
                  >
                    <option value="pending">Pending Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="closed">Closed / Won</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${inq.email}?subject=Regarding LuxeLiving Portfolio Consultation`}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 text-xs font-semibold transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>

                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 text-xs font-semibold transition-colors"
                        title="Call Client"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
