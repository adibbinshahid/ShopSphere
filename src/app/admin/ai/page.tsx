'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Package, HeadphonesIcon, BarChart2, RefreshCw, Play, Pause, Settings, Send, User, Sparkles, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Workflow {
  id: string; name: string; description: string; status: 'running' | 'paused' | 'idle';
  icon: React.ElementType; color: string;
  stats: { label: string; value: string }[];
  lastRun: string; nextRun: string; tasksToday: number;
  log: string[];
}

const workflows: Workflow[] = [
  {
    id: 'order-processor',
    name: 'Order Processing AI',
    description: 'Automatically validates, assigns fulfillment centers, and notifies customers for incoming orders.',
    status: 'running', icon: Package, color: 'from-purple-500 to-indigo-600',
    stats: [{ label: 'Processed Today', value: '43' }, { label: 'Avg Time', value: '1.2s' }, { label: 'Success Rate', value: '99.8%' }, { label: 'Errors', value: '0' }],
    lastRun: '12 seconds ago', nextRun: 'Continuous', tasksToday: 43,
    log: ['[10:32:14] Order #ORD-8921 validated ✓', '[10:31:56] Assigned to Warehouse A', '[10:31:55] Customer notified via email', '[10:30:12] Order #ORD-8920 validated ✓', '[10:29:45] Payment confirmed for #ORD-8919', '[10:28:03] Fulfillment triggered for #ORD-8918'],
  },
  {
    id: 'customer-service',
    name: 'Customer Service AI',
    description: 'Handles tier-1 support tickets, answers FAQs, and escalates complex issues to human agents.',
    status: 'running', icon: HeadphonesIcon, color: 'from-blue-500 to-cyan-600',
    stats: [{ label: 'Tickets Resolved', value: '128' }, { label: 'Escalated', value: '7' }, { label: 'Avg Resolution', value: '3.4 min' }, { label: 'CSAT Score', value: '4.7★' }],
    lastRun: '2 min ago', nextRun: 'Continuous', tasksToday: 128,
    log: ['[10:30:01] Ticket #TK-4421 resolved — shipping inquiry', '[10:28:33] Auto-replied to return request', '[10:25:12] Escalated #TK-4418 to human agent', '[10:22:45] FAQ answered: payment methods', '[10:19:30] Ticket #TK-4415 closed — size guide'],
  },
  {
    id: 'inventory-manager',
    name: 'Inventory Management AI',
    description: 'Monitors stock levels, predicts demand, and auto-generates restock purchase orders.',
    status: 'running', icon: BarChart2, color: 'from-green-500 to-teal-600',
    stats: [{ label: 'Items Monitored', value: '10,200' }, { label: 'Low Stock Alerts', value: '6' }, { label: 'POs Generated', value: '3' }, { label: 'Accuracy', value: '97.2%' }],
    lastRun: '15 min ago', nextRun: 'In 45 min', tasksToday: 23,
    log: ['[10:15:00] Low stock alert: Vitamin C Serum (12 units)', '[10:00:00] PO #PO-331 generated — 200 units Yoga Mat', '[09:45:00] Demand spike detected: Sneakers +34%', '[09:30:00] Inventory sync complete — 10,200 SKUs', '[09:00:00] Daily restock report generated'],
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    description: 'Personalizes product recommendations using purchase history, browse behavior, and AI clustering.',
    status: 'paused', icon: Sparkles, color: 'from-orange-500 to-pink-600',
    stats: [{ label: 'Recommendations', value: '8,421' }, { label: 'Click-Through', value: '18.3%' }, { label: 'Conversion Lift', value: '+24%' }, { label: 'Models', value: '3 active' }],
    lastRun: '6 hr ago', nextRun: 'Paused', tasksToday: 0,
    log: ['[04:00:00] Nightly model retrain complete', '[04:00:00] Processed 3,241 customer profiles', '[03:45:00] Collaborative filter updated', '[03:30:00] A/B test variant B winning (+12%)', '[00:00:00] Daily batch recommendations generated'],
  },
];

interface Message { role: 'user' | 'ai'; text: string; time: string; }

const aiReplies = [
  "I've analyzed your store data. Revenue is up 18.2% YoY. Top performing category is Electronics at 35% of sales.",
  "Currently monitoring 10,200 SKUs. 6 items are below restock threshold. Shall I auto-generate purchase orders?",
  "The abandoned cart rate is 68.3%. I recommend sending a recovery email 2 hours after abandonment with a 10% coupon.",
  "Based on purchase patterns, I suggest featuring the Vitamin C Serum and Yoga Mat in this week's email campaign.",
  "Order processing is running at 99.8% accuracy. 43 orders processed today, average time 1.2 seconds per order.",
  "Your CSAT score is 4.7/5. Most common complaint is shipping delays (32% of tickets). Consider upgrading to express shipping.",
];

export default function AIPage() {
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Workflow['status']>>(
    Object.fromEntries(workflows.map(w => [w.id, w.status]))
  );
  const [tab, setTab] = useState<'workflows' | 'instructions' | 'chat'>('workflows');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I\'m your ShopSphere AI Agent. I\'m currently managing order processing, customer service, inventory, and personalization. How can I help you today?', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [instructions, setInstructions] = useState(`# AI Agent Instructions

## Order Processing
- Auto-validate all orders within 2 seconds of placement
- Route to nearest fulfillment center based on customer location
- Send confirmation email immediately after validation
- Flag high-value orders (>$500) for manual review

## Customer Service
- Respond to shipping inquiries within 30 seconds
- Auto-resolve FAQ topics: returns, sizing, payments, tracking
- Escalate to human agent if: refund >$200, repeated contact, sentiment score <2
- Always use customer's first name

## Inventory
- Restock alert threshold: 15 units
- Auto-generate PO when stock drops below 10 units
- Predict demand 14 days ahead using rolling average
- Flag seasonal demand spikes >25%

## Recommendations
- Update models nightly at 3 AM
- Personalize homepage for logged-in users
- Show related products on product pages (max 4)
- A/B test new recommendation algorithms monthly`);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const toggleWorkflow = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: prev[id] === 'running' ? 'paused' : 'running' }));
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      setMessages(prev => [...prev, { role: 'ai', text: reply, time: 'Just now' }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const statusBadge: Record<Workflow['status'], { label: string; color: string; Icon: React.ElementType }> = {
    running: { label: 'Running', color: 'bg-green-100 text-green-700', Icon: CheckCircle },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700', Icon: Pause },
    idle: { label: 'Idle', color: 'bg-gray-100 text-gray-500', Icon: Clock },
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">AI Section</h1>
        <p className="text-gray-500 text-sm">AI workflows, agent instructions, and chatbot</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
        {([['workflows', 'AI Workflows'], ['instructions', 'Instructions'], ['chat', 'AI Chatbot']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === key ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'workflows' && (
        <div className="space-y-4">
          {/* Status overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Active Workflows', value: Object.values(statuses).filter(s => s === 'running').length.toString(), color: 'text-green-500' },
              { label: 'Tasks Today', value: workflows.reduce((s, w) => s + w.tasksToday, 0).toString(), color: 'text-purple-500' },
              { label: 'AI Uptime', value: '99.9%', color: 'text-blue-500' },
              { label: 'Avg Accuracy', value: '98.7%', color: 'text-orange-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Workflow cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workflows.map((w) => {
              const status = statuses[w.id];
              const { label, color, Icon } = statusBadge[status];
              return (
                <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`bg-gradient-to-r ${w.color} p-5`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <w.icon size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm">{w.name}</h3>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${color} mt-0.5`}>
                            {status === 'running' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                            {label}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveWorkflow(activeWorkflow?.id === w.id ? null : w)}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                          <Settings size={14} className="text-white" />
                        </button>
                        <button onClick={() => toggleWorkflow(w.id)}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                          {status === 'running' ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-4">{w.description}</p>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {w.stats.map(s => (
                        <div key={s.label} className="text-center">
                          <p className="text-sm font-black text-gray-900">{s.value}</p>
                          <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                      <span><RefreshCw size={10} className="inline mr-1" />Last: {w.lastRun}</span>
                      <span><Clock size={10} className="inline mr-1" />Next: {w.nextRun}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeWorkflow?.id === w.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
                        <div className="p-4 bg-gray-950 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                          {w.log.map((line, i) => (
                            <p key={i} className={i === 0 ? 'text-green-400' : 'text-gray-400'}>{line}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'instructions' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">AI Agent Instructions</h3>
              <p className="text-xs text-gray-500">These instructions govern how the AI agent behaves</p>
            </div>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
              <CheckCircle size={13} /> Save Changes
            </button>
          </div>
          <div className="p-6">
            <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">Changes take effect on next workflow cycle. Use markdown formatting.</p>
            </div>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={24}
              className="w-full font-mono text-xs border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 resize-none bg-gray-50 leading-relaxed"
            />
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">ShopSphere AI Agent</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs text-gray-500">Online · Managing 4 workflows</p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              {['Order AI', 'Inventory AI', 'Support AI'].map(tag => (
                <span key={tag} className="bg-purple-50 text-purple-600 text-xs font-medium px-2 py-1 rounded-lg hidden sm:block">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'ai' ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gray-200'}`}>
                  {m.role === 'ai' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-600" />}
                </div>
                <div className={`max-w-xs lg:max-w-md ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'ai' ? 'bg-gray-100 text-gray-800' : 'bg-purple-600 text-white'}`}>
                    {m.text}
                  </div>
                  <p className="text-xs text-gray-400">{m.time}</p>
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Show revenue stats', 'Check low stock', 'Review pending orders', 'Best products this week'].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask the AI agent anything..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button onClick={sendMessage} disabled={!input.trim() || typing}
                    className="w-11 h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
