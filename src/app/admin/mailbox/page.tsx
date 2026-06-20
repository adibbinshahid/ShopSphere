'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Star, Trash2, Reply, ArrowLeft, Search, Inbox, Send, Archive } from 'lucide-react';

interface Email {
  id: number; from: string; email: string; subject: string; preview: string;
  body: string; time: string; read: boolean; starred: boolean; folder: 'inbox' | 'sent' | 'archive';
  tag?: string;
}

const initEmails: Email[] = [
  { id: 1, from: 'Sarah Johnson', email: 'sarah.j@gmail.com', subject: 'Question about my order #ORD-8921', preview: "Hi, I placed an order yesterday and haven't received a confirmation...", body: "Hi there,\n\nI placed an order yesterday (#ORD-8921) and haven't received a confirmation email yet. Could you please check on this for me?\n\nThe order was for AirPods Pro, and I'm worried it didn't go through properly.\n\nThank you,\nSarah", time: '2 min ago', read: false, starred: true, folder: 'inbox', tag: 'Order' },
  { id: 2, from: 'Michael Chen', email: 'mchen@outlook.com', subject: 'Return request for Smart Watch', preview: "The watch I received has a defect on the screen. I'd like to initiate a return...", body: "Hello,\n\nI received my Smart Watch X order (#ORD-8920) but unfortunately the screen has a small crack on the bottom corner.\n\nI would like to initiate a return and get a replacement. Could you please guide me through the process?\n\nBest regards,\nMichael Chen", time: '18 min ago', read: false, starred: false, folder: 'inbox', tag: 'Return' },
  { id: 3, from: 'Emily Davis', email: 'emily.davis@yahoo.com', subject: 'Amazing products! 5 stars review', preview: "Just wanted to say how happy I am with my Vitamin C Serum purchase...", body: "Hi ShopSphere team,\n\nI just wanted to take a moment to say how absolutely thrilled I am with the Vitamin C Serum I purchased last week!\n\nMy skin has already started glowing and I've received so many compliments. I've already recommended your store to 5 of my friends.\n\nKeep up the amazing work!\n\nEmily Davis", time: '1 hr ago', read: true, starred: true, folder: 'inbox', tag: 'Feedback' },
  { id: 4, from: 'James Wilson', email: 'j.wilson@business.com', subject: 'Wholesale partnership inquiry', preview: "We are a retail chain looking to partner with ShopSphere for bulk orders...", body: "Dear ShopSphere Team,\n\nI represent Wilson Retail Group, a chain of 12 stores across the East Coast. We are very interested in establishing a wholesale partnership with your brand.\n\nWe would be interested in placing monthly bulk orders across your Electronics and Sports categories.\n\nCould we schedule a call this week to discuss terms?\n\nBest,\nJames Wilson\nDirector of Procurement\nWilson Retail Group", time: '3 hr ago', read: true, starred: false, folder: 'inbox', tag: 'Business' },
  { id: 5, from: 'Olivia Martinez', email: 'olivia.m@email.com', subject: 'Where is my package?', preview: "My order was supposed to arrive 3 days ago but I still haven't received it...", body: "Hello,\n\nI ordered a Silk Slip Dress (#ORD-8917) 8 days ago and the tracking shows it's been 'In Transit' for 5 days. My estimated delivery was 3 days ago.\n\nCan you please investigate what happened to my package?\n\nThank you,\nOlivia", time: 'Yesterday', read: false, starred: false, folder: 'inbox', tag: 'Shipping' },
  { id: 6, from: 'Noah Garcia', email: 'noah.g@gmail.com', subject: 'Wrong item received', preview: "I ordered the Modern Accent Chair in grey but received a blue one...", body: "Hi,\n\nI received my Accent Chair order today but it's the wrong color. I ordered grey (#ORD-8914) but received blue.\n\nCould you please arrange an exchange? I need this for a home renovation project this weekend.\n\nNoah Garcia", time: 'Yesterday', read: true, starred: false, folder: 'inbox', tag: 'Order' },
  { id: 7, from: 'System', email: 'noreply@shopsphere.com', subject: 'Daily Sales Report — Jun 19, 2026', preview: 'Your store generated $4,231 in revenue today with 38 orders...', body: 'Daily Sales Summary — June 19, 2026\n\n✅ Revenue: $4,231\n📦 Orders: 38\n👥 New Customers: 12\n🔄 Returns Initiated: 2\n⭐ Avg Rating Today: 4.8\n\nTop Product: Vitamin C Serum (14 units)\n\nHave a great day!', time: '2 days ago', read: true, starred: false, folder: 'inbox', tag: 'Report' },
];

const tagColor: Record<string, string> = {
  Order: 'bg-blue-100 text-blue-600',
  Return: 'bg-red-100 text-red-600',
  Feedback: 'bg-green-100 text-green-600',
  Business: 'bg-purple-100 text-purple-600',
  Shipping: 'bg-orange-100 text-orange-600',
  Report: 'bg-gray-100 text-gray-600',
};

export default function MailboxPage() {
  const [emails, setEmails] = useState<Email[]>(initEmails);
  const [selected, setSelected] = useState<Email | null>(null);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'archive'>('inbox');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [showReply, setShowReply] = useState(false);

  const open = (e: Email) => {
    setSelected(e);
    setEmails(prev => prev.map(x => x.id === e.id ? { ...x, read: true } : x));
    setShowReply(false); setReply('');
  };

  const toggle = (id: number, field: 'starred') => setEmails(prev => prev.map(x => x.id === id ? { ...x, [field]: !x[field] } : x));
  const archive = (id: number) => { setEmails(prev => prev.map(x => x.id === id ? { ...x, folder: 'archive' } : x)); if (selected?.id === id) setSelected(null); };
  const del = (id: number) => { setEmails(prev => prev.filter(x => x.id !== id)); if (selected?.id === id) setSelected(null); };

  const visible = emails.filter(e => e.folder === folder && (search ? e.from.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()) : true));
  const unread = emails.filter(e => e.folder === 'inbox' && !e.read).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mailbox</h1>
        <p className="text-gray-500 text-sm">{unread} unread messages</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: 500 }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0 border-r border-gray-100 flex flex-col bg-gray-50">
            <div className="p-3 space-y-1">
              {[
                { key: 'inbox', icon: Inbox, label: 'Inbox', count: unread },
                { key: 'sent', icon: Send, label: 'Sent' },
                { key: 'archive', icon: Archive, label: 'Archive' },
              ].map(({ key, icon: Icon, label, count }) => (
                <button key={key} onClick={() => { setFolder(key as typeof folder); setSelected(null); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${folder === key ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {count ? <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${folder === key ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>{count}</span> : null}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 mt-auto">
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between"><span>Inbox</span><span className="font-semibold">{emails.filter(e => e.folder === 'inbox').length}</span></div>
                <div className="flex justify-between"><span>Starred</span><span className="font-semibold">{emails.filter(e => e.starred).length}</span></div>
              </div>
            </div>
          </div>

          {/* Email list */}
          <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {visible.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No messages</div>}
              {visible.map(e => (
                <div key={e.id} onClick={() => open(e)}
                  className={`p-4 cursor-pointer hover:bg-purple-50 transition-colors ${selected?.id === e.id ? 'bg-purple-50 border-r-2 border-purple-600' : ''} ${!e.read ? 'bg-blue-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-xs truncate ${!e.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{e.from}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{e.time}</span>
                  </div>
                  <p className={`text-xs truncate mb-1 ${!e.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{e.subject}</p>
                  <p className="text-xs text-gray-400 truncate">{e.preview}</p>
                  {e.tag && <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${tagColor[e.tag]}`}>{e.tag}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Email body */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
                <Mail size={40} className="text-gray-200" />
                <p className="text-sm">Select an email to read</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-xl md:hidden"><ArrowLeft size={16} /></button>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{selected.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">From: {selected.from} &lt;{selected.email}&gt;</p>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <button onClick={() => toggle(selected.id, 'starred')} className={`p-1.5 rounded-xl hover:bg-yellow-50 transition-colors ${selected.starred ? 'text-yellow-400' : 'text-gray-400'}`}>
                      <Star size={15} className={selected.starred ? 'fill-yellow-400' : ''} />
                    </button>
                    <button onClick={() => archive(selected.id)} className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-xl transition-colors"><Archive size={15} /></button>
                    <button onClick={() => del(selected.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="max-w-2xl">
                    <p className="text-xs text-gray-500 mb-4">{selected.time}</p>
                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selected.body}</div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100">
                  {!showReply ? (
                    <button onClick={() => setShowReply(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                      <Reply size={13} /> Reply
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder={`Reply to ${selected.from}...`} rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => { setShowReply(false); setReply(''); }} className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={() => {
                          setEmails(prev => [...prev, { id: Date.now(), from: 'Admin', email: 'admin@shopsphere.com', subject: `Re: ${selected.subject}`, preview: reply.slice(0, 60), body: reply, time: 'Just now', read: true, starred: false, folder: 'sent' }]);
                          setShowReply(false); setReply('');
                        }} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors">Send Reply</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
