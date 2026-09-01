import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAQS } from '../../data/mockData';
import { formatDate } from '../../utils';

export const SupportView: React.FC = () => {
  const { supportTickets, transactions, createSupportTicket, replySupportTicket } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<string | null>(FAQS[0].id);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'data' | 'airtime' | 'electricity' | 'wallet' | 'other'>('data');
  const [linkedTxRef, setLinkedTxRef] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');

  // Selected ticket for viewing
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    supportTickets.length > 0 ? supportTickets[0].id : null
  );
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    createSupportTicket({
      subject,
      category,
      priority,
      description,
      linkedTransactionRef: linkedTxRef || undefined,
    });

    setShowCreateTicketModal(false);
    setSubject('');
    setDescription('');
    setLinkedTxRef('');
    setSuccessNotice('Support ticket submitted successfully! An agent will respond shortly.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyMessage.trim()) return;
    replySupportTicket(ticketId, replyMessage, 'user');
    setReplyMessage('');
  };

  const currentTicket = supportTickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            24/7 Help & Support Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Instant troubleshooting, ticketing system, and direct customer support channels
          </p>
        </div>

        <button
          onClick={() => setShowCreateTicketModal(true)}
          className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Direct Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 flex items-center gap-3 transition shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">WhatsApp Live Agent</h4>
            <p className="text-[11px] text-slate-500">Response in &lt; 2 minutes</p>
          </div>
        </a>

        <a
          href="tel:+2348007293539"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 flex items-center gap-3 transition shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Toll-Free Hotline</h4>
            <p className="text-[11px] text-slate-500">24/7 Customer Support</p>
          </div>
        </a>

        <a
          href="mailto:support@veltrivexaiglobal.com"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 flex items-center gap-3 transition shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Email Helpdesk</h4>
            <p className="text-[11px] text-slate-500">support@veltrivexaiglobal.com</p>
          </div>
        </a>
      </div>

      {/* Active Support Tickets Viewer */}
      {supportTickets.length > 0 && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 font-display">Your Support Tickets</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ticket Selector List */}
            <div className="space-y-2">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition text-left ${
                    selectedTicketId === t.id
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{t.id}</span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{t.subject}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(t.createdAt)}</p>
                </div>
              ))}
            </div>

            {/* Conversation Thread */}
            {currentTicket && (
              <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between h-96">
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-display">{currentTicket.subject}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        Priority: {currentTicket.priority}
                      </span>
                    </div>
                    {currentTicket.linkedTransactionRef && (
                      <span className="text-[10px] font-mono text-emerald-700">
                        Linked Ref: {currentTicket.linkedTransactionRef}
                      </span>
                    )}
                  </div>

                  {/* Messages Bubble */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
                    {currentTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl max-w-[85%] ${
                          msg.sender === 'user'
                            ? 'ml-auto bg-emerald-600 text-white font-medium'
                            : 'mr-auto bg-white border border-slate-200 text-slate-800 shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] opacity-75 block text-right mt-1 font-mono">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Input */}
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message to support..."
                    className="flex-1 h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
                  />
                  <button
                    onClick={() => handleSendReply(currentTicket.id)}
                    className="px-4 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-display">Frequently Asked Questions</h3>

        <div className="space-y-2">
          {FAQS.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition shadow-xs"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 hover:text-emerald-600 transition"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Submit Support Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
                >
                  <option value="data">Data Bundle Delivery</option>
                  <option value="airtime">Airtime Recharge</option>
                  <option value="electricity">Electricity Token / Meter</option>
                  <option value="wallet">Wallet Deposit / Transfer</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Delayed MTN Data Delivery"
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Linked Transaction Reference (Optional)
                </label>
                <select
                  value={linkedTxRef}
                  onChange={(e) => setLinkedTxRef(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 font-mono shadow-xs"
                >
                  <option value="">None / General Inquiry</option>
                  {transactions.slice(0, 5).map((t) => (
                    <option key={t.id} value={t.reference}>
                      {t.reference} — {t.type} ({formatDate(t.timestamp)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the problem in detail (recipient phone number, error message, etc.)..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 resize-none shadow-xs placeholder-slate-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-4 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
