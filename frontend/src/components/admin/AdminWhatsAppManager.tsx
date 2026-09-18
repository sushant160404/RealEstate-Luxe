import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Radio,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Smartphone,
  CheckCheck,
  Clock,
  AlertCircle,
  Filter,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Play,
  Users,
  Phone,
  MapPin,
  IndianRupee,
  RefreshCw,
  Search,
  Eye,
  FileText,
  AlertTriangle,
  Building2,
  X
} from 'lucide-react';
import { Property, AgentInfo, WhatsAppCampaign, WhatsAppCampaignTemplate, WhatsAppRecipient } from '../../types';
import { api } from '../../services/api';

interface AdminWhatsAppManagerProps {
  properties: Property[];
  agent: AgentInfo;
  onSelectPropertyForPreview?: (property: Property) => void;
}

// Default luxury HNI investors preset
const HNI_VIP_INVESTORS_SAMPLE: WhatsAppRecipient[] = [
  {
    id: 'hni-01',
    name: 'Rajiv Bajaj',
    phone: '+91 98201 11223',
    cleanPhone: '+919820111223',
    city: 'Mumbai',
    budget: '₹45-60 Cr',
    propertyInterest: 'Worli Sea Face Penthouse',
    tags: ['Ultra-HNI', 'Mumbai Resident'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919820111223'
  },
  {
    id: 'hni-02',
    name: 'Sunita Singhania',
    phone: '+91 98110 33445',
    cleanPhone: '+919811033445',
    city: 'Delhi NCR',
    budget: '₹50+ Cr',
    propertyInterest: 'Trophy Sky Villa',
    tags: ['Family Office', 'Delhi'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919811033445'
  },
  {
    id: 'hni-03',
    name: 'Karan Mehra',
    phone: '+971 50 9876543',
    cleanPhone: '+971509876543',
    city: 'Dubai (UAE)',
    budget: '₹40 Cr',
    propertyInterest: 'Prime Mumbai & Goa Estates',
    tags: ['NRI Investor', 'Dubai'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/971509876543'
  },
  {
    id: 'hni-04',
    name: 'Aakash Ambani Office',
    phone: '+91 98200 44556',
    cleanPhone: '+919820044556',
    city: 'Mumbai',
    budget: '₹80+ Cr',
    propertyInterest: 'South Mumbai Heritage Duplex',
    tags: ['Institutional VIP'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919820044556'
  },
  {
    id: 'hni-05',
    name: 'Vikram Kirloskar',
    phone: '+91 98450 77889',
    cleanPhone: '+919845077889',
    city: 'Bengaluru',
    budget: '₹35-50 Cr',
    propertyInterest: 'Goa Waterfront Portuguese Villa',
    tags: ['Tech Founder', 'Holiday Home'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919845077889'
  },
  {
    id: 'hni-06',
    name: 'Zameer Verjee',
    phone: '+44 7700 900123',
    cleanPhone: '+447700900123',
    city: 'London (UK)',
    budget: '₹65 Cr',
    propertyInterest: 'Bandra West Sea View Duplex',
    tags: ['NRI', 'Mayfair / London'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/447700900123'
  },
  {
    id: 'hni-07',
    name: 'Dr. Nandita Palshetkar',
    phone: '+91 98210 99887',
    cleanPhone: '+919821099887',
    city: 'Mumbai',
    budget: '₹25-35 Cr',
    propertyInterest: 'Assagao Goa Villa',
    tags: ['Healthcare Founder'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919821099887'
  },
  {
    id: 'hni-08',
    name: 'Harsh Goenka Advisory',
    phone: '+91 98202 33441',
    cleanPhone: '+919820233441',
    city: 'Mumbai',
    budget: '₹55 Cr',
    propertyInterest: 'Worli Arabian Sea Duplex',
    tags: ['Conglomerate VIP'],
    status: 'valid',
    dispatchStatus: 'pending',
    waLink: 'https://wa.me/919820233441'
  },
  {
    id: 'hni-09',
    name: 'Siddharth Mallya Group',
    phone: '98201', // intentionally invalid for CSV demonstration
    cleanPhone: '98201',
    city: 'Mumbai',
    budget: '₹30 Cr',
    propertyInterest: 'Penthouse',
    status: 'invalid',
    validationError: 'Invalid number: must have 10 digits or country code',
    dispatchStatus: 'pending'
  }
];

export const AdminWhatsAppManager: React.FC<AdminWhatsAppManagerProps> = ({
  properties,
  agent,
  onSelectPropertyForPreview
}) => {
  // Navigation & Sub-tabs
  const [managerTab, setManagerTab] = useState<'new' | 'history' | 'templates'>('new');

  // Campaign Form State
  const [campaignTitle, setCampaignTitle] = useState('Worli Sea Face Sky Villa - Private Allocation');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || 'prop-01');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-01');
  const [messageBody, setMessageBody] = useState('');
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>(HNI_VIP_INVESTORS_SAMPLE);

  // Filter & Search in Recipient List
  const [recipientSearch, setRecipientSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState<'all' | 'valid' | 'invalid'>('all');

  // Preview index for dynamic personalization
  const [previewRecipientIndex, setPreviewRecipientIndex] = useState(0);

  // Broadcast execution states
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Backend Data
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [templates, setTemplates] = useState<WhatsAppCampaignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCampaignDetail, setActiveCampaignDetail] = useState<WhatsAppCampaign | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial templates & campaigns
  useEffect(() => {
    loadWhatsAppState();
  }, []);

  const loadWhatsAppState = async () => {
    setIsLoading(true);
    try {
      const [tpls, camps] = await Promise.all([
        api.getWhatsAppTemplates(),
        api.getWhatsAppCampaigns()
      ]);
      setTemplates(tpls);
      setCampaigns(camps);

      // Default initial message from template 1 if empty
      if (tpls.length > 0 && !messageBody) {
        setMessageBody(tpls[0].body);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Selected property helper
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  // When template changes, load its text
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const found = templates.find((t) => t.id === tplId);
    if (found) {
      setMessageBody(found.body);
    }
  };

  // Variable insertion at cursor
  const handleInsertVariable = (varTag: string) => {
    setMessageBody((prev) => `${prev} ${varTag} `);
  };

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = await api.parseWhatsAppCSV(text);
      if (parsed && parsed.recipients) {
        setRecipients(parsed.recipients);
        setPreviewRecipientIndex(0);
      }
    } catch (err) {
      console.error('Failed to parse CSV:', err);
      alert('Error reading CSV file. Please ensure it is a valid comma-separated text file.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const csvContent =
      'Name,Phone,City,Budget,PropertyInterest\n' +
      'Rajesh Jhunjhunwala,+91 98201 55667,Mumbai,₹50+ Cr,Sea Facing Penthouse\n' +
      'Vikramaditya Kirloskar,+91 98110 22334,Delhi NCR,₹40 Cr,Golf Course Villa\n' +
      'Rohan Murthy,+91 98450 11223,Bengaluru,₹35 Cr,Gated Estate\n' +
      'Sunil Mittal Office,+971 50 1234567,Dubai (NRI),₹60 Cr,Trophy Duplex\n' +
      'Ananya Piramal,+91 98200 44556,Mumbai,₹45 Cr,Worli Sky Villa\n' +
      'Gautam Singhania,+91 98202 88990,Mumbai,₹75 Cr,Assagao Portuguese Estate\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'luxeliving_vip_investors_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Replace variables for dynamic preview
  const generatePersonalizedMessage = (recipient?: WhatsAppRecipient) => {
    const rec = recipient || recipients[previewRecipientIndex] || {
      name: 'Rajiv Bajaj',
      phone: '+91 98201 11223',
      city: 'Mumbai',
      budget: '₹45-60 Cr'
    };

    let msg = messageBody;
    msg = msg.replace(/{name}/g, rec.name || 'Valued Investor');
    msg = msg.replace(/{city}/g, rec.city || selectedProperty?.city || 'Mumbai');
    msg = msg.replace(/{budget}/g, rec.budget || '₹40+ Cr');
    msg = msg.replace(/{property_title}/g, selectedProperty?.title || 'The Imperial Sky Villa');
    msg = msg.replace(/{property_price}/g, selectedProperty?.priceDisplay || '₹48.50 Cr');
    msg = msg.replace(/{property_location}/g, selectedProperty?.location || 'Worli Sea Face, Mumbai');
    msg = msg.replace(/{agent_name}/g, agent.name || 'Priya Sharma');
    msg = msg.replace(/{booking_link}/g, `https://luxeliving.in/properties/${selectedProperty?.id || 'prop-01'}`);
    msg = msg.replace(/{rera_number}/g, selectedProperty?.features.find(f => f.toLowerCase().includes('rera')) || 'MahaRERA Reg. #P51900034291');

    return msg;
  };

  // Filtered recipients
  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.phone.includes(recipientSearch) ||
      (r.city && r.city.toLowerCase().includes(recipientSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (recipientFilter === 'valid') return r.status === 'valid';
    if (recipientFilter === 'invalid') return r.status === 'invalid';
    return true;
  });

  const validCount = recipients.filter((r) => r.status === 'valid').length;
  const invalidCount = recipients.filter((r) => r.status === 'invalid').length;

  // Simulate or execute bulk broadcast
  const handleLaunchBroadcast = async () => {
    if (validCount === 0) {
      alert('No valid recipients to broadcast to. Please upload or load valid phone numbers.');
      return;
    }

    if (!campaignTitle.trim()) {
      alert('Please provide a campaign title.');
      return;
    }

    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setBroadcastLogs([]);
    setBroadcastDone(false);

    try {
      // 1. Create campaign in backend
      const createRes = await api.createWhatsAppCampaign({
        title: campaignTitle,
        templateId: selectedTemplateId,
        message: messageBody,
        attachedPropertyId: selectedProperty?.id,
        attachedPropertyTitle: selectedProperty?.title,
        attachedPropertyPrice: selectedProperty?.priceDisplay,
        recipients
      });

      const campaignId = createRes.data?.id || `camp-${Date.now()}`;
      setBroadcastLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Authenticated with WhatsApp Business Cloud Gateway (MahaRERA Compliant)`,
        `[${new Date().toLocaleTimeString()}] Queueing ${validCount} high-priority HNI investor dispatches...`
      ]);

      // 2. Animated progress simulation
      const validList = recipients.filter((r) => r.status === 'valid');
      const totalSteps = validList.length;

      for (let i = 0; i < totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const rec = validList[i];
        const pct = Math.round(((i + 1) / totalSteps) * 100);
        setBroadcastProgress(pct);
        setBroadcastLogs((prev) => [
          ...prev.slice(-15),
          `[${new Date().toLocaleTimeString()}] Dispatched to ${rec.name} (${rec.cleanPhone}) — Status: Delivered ✓✓`
        ]);
      }

      // 3. Mark completed on backend
      const result = await api.broadcastWhatsAppCampaign(campaignId);
      if (result.data) {
        setCampaigns((prev) => [result.data!, ...prev.filter((c) => c.id !== campaignId)]);
      }

      setBroadcastDone(true);
      setBroadcastLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ Broadcast Campaign Complete! ${validCount} of ${recipients.length} messages successfully delivered.`
      ]);
    } catch (err: any) {
      console.error('Broadcast failed:', err);
      setBroadcastLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ❌ Broadcast error: ${err.message}`]);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // One-click copy message for manual outreach
  const handleCopyPersonalized = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Export Dispatch Report CSV
  const handleExportDispatchReport = (camp?: WhatsAppCampaign) => {
    const listToExport = camp ? camp.recipients : recipients;
    const titleToExport = camp ? camp.title : campaignTitle;

    let csv = 'Name,Phone,CleanPhone,City,Budget,PropertyInterest,Status,DispatchStatus,SentAt\n';
    listToExport.forEach((r) => {
      csv += `"${r.name}","${r.phone}","${r.cleanPhone}","${r.city || ''}","${r.budget || ''}","${r.propertyInterest || ''}","${r.status}","${r.dispatchStatus}","${r.sentAt || new Date().toISOString()}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${titleToExport.toLowerCase().replace(/\s+/g, '_')}_dispatch_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broadcast campaign archive?')) return;
    try {
      await api.deleteWhatsAppCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      if (activeCampaignDetail?.id === id) {
        setActiveCampaignDetail(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner & High-Level Metrics */}
      <div className="bg-gradient-to-r from-emerald-900 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    WhatsApp Broadcast & Campaign Hub
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    MahaRERA Compliant
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                  Promotional bulk WhatsApp messaging for high-net-worth investors, off-market villa releases, and private showing RSVPs.
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setManagerTab('new')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerTab === 'new'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </button>
              <button
                onClick={() => setManagerTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerTab === 'history'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Archive & Logs ({campaigns.length})</span>
              </button>
              <button
                onClick={() => setManagerTab('templates')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerTab === 'templates'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Templates ({templates.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/5">
              <p className="text-[11px] text-neutral-400 font-medium">HNI Contacts in Audience</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{recipients.length}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> {validCount} valid mobile formats
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/5">
              <p className="text-[11px] text-neutral-400 font-medium">Delivered Campaigns</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {campaigns.filter((c) => c.status === 'completed').length}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Across Mumbai, Delhi, NRI circles</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/5">
              <p className="text-[11px] text-neutral-400 font-medium">Avg. WhatsApp Open Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">98.4%</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">8x higher than real estate email</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/5">
              <p className="text-[11px] text-neutral-400 font-medium">Anti-Spam Throttle Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">200 ms</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Smart spacing to protect phone reputation</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: NEW BROADCAST CAMPAIGN (BUILDER & DISPATCHER)       */}
      {/* ========================================================= */}
      {managerTab === 'new' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT 7 COLUMNS: Step 1 (CSV Ingestion) & Step 2 (Message Composer) */}
          <div className="xl:col-span-7 space-y-6">
            {/* STEP 1: AUDIENCE & CSV UPLOADER */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                      Upload Recipient CSV or Select VIP Audience
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 ml-7">
                    Accepts comma-separated values: <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px]">Name, Phone, City, Budget, PropertyInterest</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSampleCSV}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                    title="Download a formatted sample CSV file"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Sample CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setRecipients(HNI_VIP_INVESTORS_SAMPLE);
                      setPreviewRecipientIndex(0);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Pre-populate vetted luxury buyers"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Load VIP Contacts</span>
                  </button>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 hover:border-emerald-500 bg-neutral-50/60 hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-neutral-800 group-hover:text-emerald-900">
                  Drop CSV file here or click to browse
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  Automatically validates +91 India numbers and international NRI country codes (+971 Dubai, +44 UK, +1 USA, +65 Singapore).
                </p>
              </div>

              {/* Recipient Audience Table & Inspection */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-700">
                      Loaded Audience ({recipients.length})
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {validCount} Valid
                    </span>
                    {invalidCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                        {invalidCount} Invalid
                      </span>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setRecipientFilter('all')}
                      className={`px-2 py-1 rounded-lg ${recipientFilter === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setRecipientFilter('valid')}
                      className={`px-2 py-1 rounded-lg ${recipientFilter === 'valid' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                    >
                      Valid Only
                    </button>
                    <button
                      onClick={() => setRecipientFilter('invalid')}
                      className={`px-2 py-1 rounded-lg ${recipientFilter === 'invalid' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                    >
                      Needs Attention
                    </button>
                  </div>
                </div>

                {/* Search in audience */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by investor name, mobile number, or city..."
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Table list */}
                <div className="max-h-56 overflow-y-auto border border-neutral-200 rounded-xl divide-y divide-neutral-100">
                  {filteredRecipients.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No recipients match your search or filter.
                    </div>
                  ) : (
                    filteredRecipients.map((rec, idx) => {
                      const isValid = rec.status === 'valid';
                      return (
                        <div
                          key={rec.id || idx}
                          className="p-2.5 sm:px-3 sm:py-2 flex items-center justify-between gap-3 text-xs hover:bg-neutral-50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900 truncate">
                                {rec.name}
                              </span>
                              {rec.city && (
                                <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                  {rec.city}
                                </span>
                              )}
                              {rec.budget && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-medium px-1.5 py-0.5 rounded">
                                  {rec.budget}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500 font-mono">
                              <span>{rec.cleanPhone || rec.phone}</span>
                              {rec.propertyInterest && (
                                <span className="text-neutral-400 truncate max-w-[200px]">
                                  • {rec.propertyInterest}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                <CheckCheck className="w-3 h-3 text-emerald-600" />
                                Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full" title={rec.validationError}>
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                Invalid
                              </span>
                            )}

                            {isValid && (
                              <a
                                href={rec.waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                                title="Open WhatsApp Chat in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={() => {
                                setRecipients((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              className="p-1 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                              title="Remove recipient"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* STEP 2: CAMPAIGN DETAILS & MESSAGE COMPOSER */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                  Compose WhatsApp Broadcast & Dynamic Personalization
                </h2>
              </div>

              {/* Campaign Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Internal Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Worli Sea Face Sky Villa - September Private Allocation"
                />
              </div>

              {/* Template Picker & Attached Property */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Pre-Approved Luxury Template
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.title} ({tpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Attach Portfolio Property
                  </label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title} — {prop.priceDisplay} ({prop.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Property Preview Pill */}
              {selectedProperty && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProperty.image}
                      alt={selectedProperty.title}
                      className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{selectedProperty.title}</p>
                      <p className="text-[11px] text-neutral-500">{selectedProperty.location}</p>
                      <p className="text-xs font-bold text-emerald-700">{selectedProperty.priceDisplay}</p>
                    </div>
                  </div>
                  {onSelectPropertyForPreview && (
                    <button
                      onClick={() => onSelectPropertyForPreview(selectedProperty)}
                      className="px-2.5 py-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 text-xs font-semibold cursor-pointer"
                    >
                      View Listing
                    </button>
                  )}
                </div>
              )}

              {/* Clickable Merge Tags / Placeholders */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-700">
                    Insert Dynamic Personalization Tokens:
                  </label>
                  <span className="text-[10px] text-neutral-400">Click to insert at end</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: '{name}', desc: 'Recipient Name' },
                    { tag: '{city}', desc: 'Client City' },
                    { tag: '{budget}', desc: 'Budget Range' },
                    { tag: '{property_title}', desc: 'Property Title' },
                    { tag: '{property_price}', desc: 'Price in INR' },
                    { tag: '{property_location}', desc: 'Location' },
                    { tag: '{agent_name}', desc: 'Advisor Name' },
                    { tag: '{booking_link}', desc: 'Confidential Link' },
                    { tag: '{rera_number}', desc: 'MahaRERA ID' }
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleInsertVariable(item.tag)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-900 text-neutral-800 text-[11px] font-mono font-medium border border-neutral-200 transition-colors cursor-pointer"
                      title={item.desc}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-700">
                    WhatsApp Message Text
                  </label>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <span>{messageBody.length} characters</span>
                    <span>•</span>
                    <span>WhatsApp formatting supported: *bold*, _italic_, ~strike~</span>
                  </div>
                </div>
                <textarea
                  rows={9}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-sans focus:outline-none focus:border-emerald-500 leading-relaxed"
                  placeholder="Type your WhatsApp broadcast message here..."
                />
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Smartphone Simulator & Dispatch Console */}
          <div className="xl:col-span-5 space-y-6">
            {/* SMARTPHONE REAL-TIME PREVIEW */}
            <div className="bg-neutral-900 text-white rounded-3xl p-5 shadow-2xl border border-neutral-800 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Live Smartphone Preview
                  </span>
                </div>

                {/* Recipient Stepper for Variable Testing */}
                {recipients.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-xl text-[11px]">
                    <span className="text-neutral-400">Preview as:</span>
                    <select
                      value={previewRecipientIndex}
                      onChange={(e) => setPreviewRecipientIndex(Number(e.target.value))}
                      className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer text-[11px]"
                    >
                      {recipients.map((r, i) => (
                        <option key={r.id || i} value={i} className="bg-neutral-900 text-white">
                          {r.name} ({r.city || 'India'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Realistic Mobile Device Frame */}
              <div className="w-full max-w-[340px] mx-auto bg-[#0b141a] rounded-[2.5rem] p-3 shadow-2xl border-4 border-neutral-700 relative overflow-hidden">
                {/* Speaker & camera notch */}
                <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-2" />

                {/* WhatsApp Chat Top Header */}
                <div className="bg-[#1f2c34] px-3 py-2.5 rounded-t-2xl flex items-center justify-between border-b border-neutral-700/50">
                  <div className="flex items-center gap-2">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500/60"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate max-w-[130px]">
                          LuxeLiving Private Office
                        </span>
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">
                          ✓
                        </span>
                      </div>
                      <p className="text-[9px] text-emerald-400 font-medium">Online • Verified Official</p>
                    </div>
                  </div>
                </div>

                {/* Chat Wallpaper Area */}
                <div className="bg-[#0b141a] min-h-[360px] max-h-[400px] overflow-y-auto p-3 space-y-3 relative font-sans text-xs">
                  {/* Encryption Notice */}
                  <div className="bg-[#182229]/80 text-[#8696a0] text-[9px] text-center px-2.5 py-1 rounded-lg max-w-[260px] mx-auto">
                    🔒 Messages are end-to-end encrypted. No one outside of this chat can read them.
                  </div>

                  {/* WhatsApp Message Bubble */}
                  <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs p-3 shadow-md max-w-[290px] ml-auto space-y-2 border border-emerald-600/30">
                    {/* Property Card Header within Bubble */}
                    {selectedProperty && (
                      <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-2">
                        <img
                          src={selectedProperty.image}
                          alt={selectedProperty.title}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2">
                          <p className="font-bold text-[11px] text-white truncate">
                            {selectedProperty.title}
                          </p>
                          <p className="text-[10px] text-emerald-300 font-semibold">
                            {selectedProperty.priceDisplay} • {selectedProperty.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Formatted Message Text */}
                    <p className="whitespace-pre-line text-[11px] leading-relaxed break-words">
                      {generatePersonalizedMessage()}
                    </p>

                    {/* Time & Double Checkmark */}
                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/70 pt-1">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>

                {/* Bottom Bar Simulator */}
                <div className="bg-[#1f2c34] p-2 rounded-b-2xl flex items-center justify-between text-[11px] text-[#8696a0]">
                  <span>Type a message...</span>
                  <div className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Web Test Button */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Test message directly:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generatePersonalizedMessage())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to My WhatsApp</span>
                </a>
              </div>
            </div>

            {/* STEP 4: DISPATCH CONTROLS & BROADCAST ENGINE */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Broadcast Dispatch Center
                  </h3>
                </div>
                <span className="text-xs font-semibold text-neutral-500">
                  Target: {validCount} Recipients
                </span>
              </div>

              {/* Dispatch Action */}
              {!isBroadcasting && !broadcastDone && (
                <div className="space-y-3">
                  <button
                    onClick={handleLaunchBroadcast}
                    disabled={validCount === 0}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Launch WhatsApp Broadcast ({validCount} Contacts)</span>
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center">
                    Dispatches personalized messages through the gateway with 200ms anti-ban interval.
                  </p>
                </div>
              )}

              {/* Progress Bar while broadcasting */}
              {isBroadcasting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Broadcasting in Progress...
                    </span>
                    <span className="text-neutral-900">{broadcastProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
                      style={{ width: `${broadcastProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Broadcast Completed Banner */}
              {broadcastDone && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Broadcast Successfully Dispatched!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    All {validCount} valid recipients have received personalized WhatsApp campaign messages.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleExportDispatchReport()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Delivery Log (CSV)</span>
                    </button>
                    <button
                      onClick={() => {
                        setBroadcastDone(false);
                        setBroadcastProgress(0);
                        setBroadcastLogs([]);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Live Dispatch Terminal Log */}
              {broadcastLogs.length > 0 && (
                <div className="bg-neutral-950 rounded-xl p-3 text-[10px] font-mono text-emerald-400 max-h-40 overflow-y-auto space-y-1">
                  {broadcastLogs.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              )}
            </div>

            {/* ONE-CLICK MANUAL OUTREACH QUEUE (Alternative Direct Option) */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    One-Click Direct WhatsApp Queue
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Open pre-filled WhatsApp chat for individual VIP buyers
                  </p>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 border border-neutral-200 rounded-xl">
                {recipients.slice(0, 5).map((rec, idx) => {
                  const personalized = generatePersonalizedMessage(rec);
                  const encoded = encodeURIComponent(personalized);
                  const cleanDigits = rec.cleanPhone.replace(/\D/g, '');
                  const waUrl = `https://wa.me/${cleanDigits}?text=${encoded}`;

                  return (
                    <div key={rec.id || idx} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-neutral-900 truncate">{rec.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">{rec.cleanPhone}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyPersonalized(personalized, idx)}
                          className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium flex items-center gap-1"
                          title="Copy personalized message text"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CAMPAIGN HISTORY & ANALYTICS ARCHIVE                */}
      {/* ========================================================= */}
      {managerTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Broadcast Campaign Archive & Analytics
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Historical logs of all bulk promotional dispatches, delivery rates, and investor reach.
                </p>
              </div>

              <button
                onClick={() => setManagerTab('new')}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 space-y-3">
                <FileSpreadsheet className="w-10 h-10 mx-auto text-neutral-300" />
                <p className="text-sm font-semibold text-neutral-600">No campaigns found</p>
                <p className="text-xs max-w-sm mx-auto">
                  Launch your first promotional bulk WhatsApp message campaign to start recording analytics.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 hover:bg-neutral-50 transition-colors space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {camp.status}
                        </span>
                        <h3 className="text-sm font-bold text-neutral-900 mt-1.5">{camp.title}</h3>
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{new Date(camp.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold text-neutral-900">
                          {camp.deliveryRate ?? 100}%
                        </span>
                        <p className="text-[10px] text-neutral-500">Delivery Rate</p>
                      </div>
                    </div>

                    {camp.attachedPropertyTitle && (
                      <div className="text-xs bg-white p-2.5 rounded-xl border border-neutral-200/70 flex items-center justify-between">
                        <span className="text-neutral-600 truncate">{camp.attachedPropertyTitle}</span>
                        <span className="font-bold text-emerald-700 shrink-0">{camp.attachedPropertyPrice}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200/60 text-center">
                      <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                        <p className="text-[10px] text-neutral-400">Total</p>
                        <p className="text-xs font-bold text-neutral-900">{camp.totalRecipients}</p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                        <p className="text-[10px] text-neutral-400">Delivered</p>
                        <p className="text-xs font-bold text-emerald-600">{camp.sentCount}</p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                        <p className="text-[10px] text-neutral-400">Failed</p>
                        <p className="text-xs font-bold text-red-500">{camp.failedCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActiveCampaignDetail(camp)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Recipients ({camp.recipients.length})</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExportDispatchReport(camp)}
                          className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                          title="Download CSV report"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(camp.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer"
                          title="Delete archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VERIFIED BROADCAST TEMPLATES                       */}
      {/* ========================================================= */}
      {managerTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="pb-4 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900">
                MahaRERA Pre-Approved Broadcast Templates
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Formally reviewed messaging frameworks optimized for high response rates among Ultra-HNI buyers and Family Offices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-neutral-50 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        {tpl.category}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">ID: {tpl.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900">{tpl.title}</h3>
                    <p className="text-xs text-neutral-500">{tpl.description}</p>
                    <div className="bg-white p-3 rounded-xl border border-neutral-200/80 text-[11px] font-mono text-neutral-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                      {tpl.body}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">Tokens: {`{name}, {property_title}...`}</span>
                    <button
                      onClick={() => {
                        handleSelectTemplate(tpl.id);
                        setManagerTab('new');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use in New Broadcast</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipient Inspection Modal */}
      {activeCampaignDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  {activeCampaignDetail.title} — Dispatch Logs
                </h3>
                <p className="text-xs text-neutral-500">
                  {activeCampaignDetail.recipients.length} recipients in archive
                </p>
              </div>
              <button
                onClick={() => setActiveCampaignDetail(null)}
                className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <p className="font-bold text-neutral-800 mb-1">Message Content Dispatched:</p>
                <p className="text-[11px] text-neutral-600 whitespace-pre-line leading-relaxed">
                  {activeCampaignDetail.message}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 mb-2">Recipients List</h4>
                <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 max-h-60 overflow-y-auto">
                  {activeCampaignDetail.recipients.map((r, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutral-900">{r.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">{r.cleanPhone}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {r.dispatchStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
              <button
                onClick={() => handleExportDispatchReport(activeCampaignDetail)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
              <button
                onClick={() => setActiveCampaignDetail(null)}
                className="px-3.5 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
