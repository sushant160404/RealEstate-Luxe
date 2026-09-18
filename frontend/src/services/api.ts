import { Property, FilterOptions, TourBookingData, AgentInfo, TourBookingRecord, InquiryLead, AdminStats, AdminUser, WhatsAppCampaign, WhatsAppCampaignTemplate, WhatsAppRecipient } from '../types';
import { PROPERTIES, AGENT_INFO } from '../data/properties';

// Base URL of the standalone backend API (deployed separately, e.g. on Render).
// Configure via VITE_API_URL in the frontend's environment (.env / Vercel project settings).
// Falls back to localhost for local development against `npm run dev` in /backend.
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

function getAdminToken(): string | null {
  try {
    return localStorage.getItem('luxeliving_admin_token') || sessionStorage.getItem('luxeliving_admin_token');
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface MortgageCalcParams {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  annualPropertyTax?: number;
  annualHomeInsurance?: number;
  monthlyHoa?: number;
}

export interface MortgageCalcResult {
  homePrice: number;
  principal: number;
  downPayment: number;
  downPaymentPercent: number;
  interestRate: number;
  termYears: number;
  monthlyBreakdown: {
    principalAndInterest: number;
    propertyTax: number;
    homeInsurance: number;
    hoa: number;
    totalMonthly: number;
  };
  lifetimeSummary: {
    totalInterestPaid: number;
    totalLoanCost: number;
  };
}

export const api = {
  // Fetch properties with dynamic query filters
  async getProperties(filters?: Partial<FilterOptions>): Promise<Property[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.location) params.append('location', filters.location);
      if (filters?.propertyType && filters.propertyType !== 'All') params.append('propertyType', filters.propertyType);
      if (filters?.statusTab && filters.statusTab !== 'all') params.append('statusTab', filters.statusTab);
      if (filters?.priceRange && filters.priceRange !== 'Any') params.append('priceRange', filters.priceRange);

      const res = await fetch(apiUrl(`/api/properties?${params.toString()}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('API getProperties fallback to local data:', err);
      return PROPERTIES;
    }
  },

  // Fetch single property
  async getProperty(id: string): Promise<Property | null> {
    try {
      const res = await fetch(apiUrl(`/api/properties/${id}`));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data || null;
    } catch {
      return PROPERTIES.find((p) => p.id === id || p.slug === id) || null;
    }
  },

  // Fetch Agent profile
  async getAgent(): Promise<AgentInfo> {
    try {
      const res = await fetch(apiUrl('/api/agent'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch {
      return AGENT_INFO;
    }
  },

  // Book a tour
  async bookTour(booking: TourBookingData): Promise<{ success: boolean; message: string; bookingId?: string }> {
    try {
      const res = await fetch(apiUrl('/api/tours'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book tour');
      return data;
    } catch (err: any) {
      return {
        success: true,
        message: 'Tour scheduled successfully (Local preview fallback)!',
        bookingId: `TR-${Math.floor(Math.random() * 90000 + 10000)}`
      };
    }
  },

  // Submit consultation inquiry
  async submitInquiry(inquiry: {
    name: string;
    email: string;
    phone?: string;
    interestType?: string;
    preferredLocation?: string;
    budgetRange?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; inquiryId?: string }> {
    try {
      const res = await fetch(apiUrl('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit inquiry');
      return data;
    } catch (err: any) {
      return {
        success: true,
        message: 'Inquiry received successfully (Local preview fallback)!',
        inquiryId: `INQ-${Math.floor(Math.random() * 90000 + 10000)}`
      };
    }
  },

  // Subscribe to newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl('/api/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to subscribe');
      return data;
    } catch (err: any) {
      return {
        success: true,
        message: 'Subscribed to VIP off-market listings!'
      };
    }
  },

  // Calculate mortgage on the backend
  async calculateMortgage(params: MortgageCalcParams): Promise<MortgageCalcResult | null> {
    try {
      const res = await fetch(apiUrl('/api/mortgage/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      return data.calculation;
    } catch {
      return null;
    }
  },

  // ================= ADMIN APIS =================
  // These require an authenticated admin session; the bearer token (stored after
  // adminLogin()) is attached automatically via authHeaders().

  // Create property
  async createProperty(propertyData: Partial<Property>): Promise<{ success: boolean; data?: Property; message: string }> {
    try {
      const res = await fetch(apiUrl('/api/properties'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(propertyData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create property');
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Error creating property' };
    }
  },

  // Update property
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<{ success: boolean; data?: Property; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/properties/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(propertyData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update property');
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating property' };
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/properties/${id}`), {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete property');
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Error deleting property' };
    }
  },

  // Get all tour bookings
  async getTours(): Promise<TourBookingRecord[]> {
    try {
      const res = await fetch(apiUrl('/api/tours'), { headers: { ...authHeaders() } });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // Update tour booking status or notes
  async updateTour(id: string, updates: Partial<TourBookingRecord>): Promise<{ success: boolean; message: string; data?: TourBookingRecord }> {
    try {
      const res = await fetch(apiUrl(`/api/tours/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating tour' };
    }
  },

  // Delete tour booking
  async deleteTour(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/tours/${id}`), {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error deleting tour' };
    }
  },

  // Get all consultations/inquiries
  async getInquiries(): Promise<InquiryLead[]> {
    try {
      const res = await fetch(apiUrl('/api/inquiries'), { headers: { ...authHeaders() } });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // Update inquiry status or notes
  async updateInquiry(id: string, updates: Partial<InquiryLead>): Promise<{ success: boolean; message: string; data?: InquiryLead }> {
    try {
      const res = await fetch(apiUrl(`/api/inquiries/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating inquiry' };
    }
  },

  // Delete inquiry
  async deleteInquiry(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/inquiries/${id}`), {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error deleting inquiry' };
    }
  },

  // Get newsletter subscribers
  async getNewsletterSubscribers(): Promise<string[]> {
    try {
      const res = await fetch(apiUrl('/api/newsletter'), { headers: { ...authHeaders() } });
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // Delete subscriber
  async deleteNewsletterSubscriber(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl(`/api/newsletter/${encodeURIComponent(email)}`), {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error deleting subscriber' };
    }
  },

  // Update advisor profile
  async updateAgent(data: Partial<AgentInfo>): Promise<{ success: boolean; message: string; data?: AgentInfo }> {
    try {
      const res = await fetch(apiUrl('/api/agent'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating agent profile' };
    }
  },

  // Get Admin stats overview
  async getAdminStats(): Promise<AdminStats | null> {
    try {
      const res = await fetch(apiUrl('/api/admin/stats'), { headers: { ...authHeaders() } });
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  // Admin Authentication: Login
  async adminLogin(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; user?: AdminUser }> {
    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
      return data;
    } catch {
      return {
        success: false,
        message: 'Unable to reach the LuxeLiving API. Please check your connection and try again.'
      };
    }
  },

  // Admin Authentication: Logout
  async adminLogout(token?: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(apiUrl('/api/admin/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ token })
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Logged out successfully.' };
    }
  },

  // Admin Authentication: Verify Session
  async getAdminSession(token?: string): Promise<{ success: boolean; user?: AdminUser }> {
    if (!token) return { success: false };
    try {
      const res = await fetch(apiUrl('/api/admin/me'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return { success: false };
      const data = await res.json();
      return { success: data.success, user: data.user };
    } catch {
      return { success: false };
    }
  },

  // ----------------------------------------------------
  // WhatsApp Broadcast & Bulk Messaging Client APIs
  // ----------------------------------------------------

  async getWhatsAppTemplates(): Promise<WhatsAppCampaignTemplate[]> {
    try {
      const res = await fetch(apiUrl('/api/admin/whatsapp/templates'), { headers: { ...authHeaders() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Fallback WhatsApp templates:', err);
      return [];
    }
  },

  async getWhatsAppCampaigns(): Promise<WhatsAppCampaign[]> {
    try {
      const res = await fetch(apiUrl('/api/admin/whatsapp/campaigns'), { headers: { ...authHeaders() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Fallback WhatsApp campaigns:', err);
      return [];
    }
  },

  async getWhatsAppCampaign(id: string): Promise<WhatsAppCampaign | null> {
    try {
      const res = await fetch(apiUrl(`/api/admin/whatsapp/campaigns/${id}`), { headers: { ...authHeaders() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn('Fallback WhatsApp campaign:', err);
      return null;
    }
  },

  async parseWhatsAppCSV(csvText: string): Promise<{
    recipients: WhatsAppRecipient[];
    summary: { total: number; valid: number; invalid: number };
  }> {
    try {
      const res = await fetch(apiUrl('/api/admin/whatsapp/parse-csv'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ csvText })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Fallback client CSV parser:', err);
      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const recipients: WhatsAppRecipient[] = [];
      const startIndex = lines[0]?.toLowerCase().includes('phone') ? 1 : 0;
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        const name = parts[0] || `Client #${i}`;
        const phone = parts[1] || '';
        const clean = phone.replace(/[^\d+]/g, '');
        const isValid = clean.length >= 10;
        recipients.push({
          id: `rec-fallback-${i}`,
          name,
          phone,
          cleanPhone: clean.startsWith('+') ? clean : `+91${clean.replace(/\D/g, '').slice(-10)}`,
          city: parts[2],
          budget: parts[3],
          propertyInterest: parts[4],
          status: isValid ? 'valid' : 'invalid',
          dispatchStatus: 'pending',
          waLink: isValid ? `https://wa.me/${clean.replace(/\D/g, '')}` : undefined
        });
      }
      return {
        recipients,
        summary: {
          total: recipients.length,
          valid: recipients.filter(r => r.status === 'valid').length,
          invalid: recipients.filter(r => r.status === 'invalid').length
        }
      };
    }
  },

  async createWhatsAppCampaign(payload: {
    title: string;
    templateId?: string;
    message: string;
    attachedPropertyId?: string;
    attachedPropertyTitle?: string;
    attachedPropertyPrice?: string;
    recipients: WhatsAppRecipient[];
  }): Promise<{ success: boolean; data?: WhatsAppCampaign; message?: string }> {
    try {
      const res = await fetch(apiUrl('/api/admin/whatsapp/campaigns'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      return json;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to create WhatsApp campaign' };
    }
  },

  async broadcastWhatsAppCampaign(campaignId: string): Promise<{
    success: boolean;
    data?: WhatsAppCampaign;
    message?: string;
  }> {
    try {
      const res = await fetch(apiUrl(`/api/admin/whatsapp/campaigns/${campaignId}/broadcast`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() }
      });
      const json = await res.json();
      return json;
    } catch (err: any) {
      return { success: false, message: err.message || 'Broadcast execution failed' };
    }
  },

  async deleteWhatsAppCampaign(campaignId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(apiUrl(`/api/admin/whatsapp/campaigns/${campaignId}`), {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
};
