export type PropertyType = 'Single Family' | 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse';
export type ListingStatus = 'For Sale' | 'For Rent' | 'Pending' | 'Sold';

export interface PropertyData {
  id: string;
  title: string;
  slug: string;
  price: number;
  formattedPrice: string;
  type: PropertyType;
  status: ListingStatus;
  location: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  description: string;
  features: string[];
  images: string[];
  isFeatured?: boolean;
  hoaMonthly?: number;
  propertyTaxAnnual?: number;
  createdAt: string;
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tourType: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestType: string;
  preferredLocation: string;
  budgetRange: string;
  message: string;
  status: 'pending' | 'contacted' | 'negotiating' | 'closed';
  notes: string;
  createdAt: string;
}

export interface AgentInfo {
  name: string;
  role: string;
  experienceYears: number;
  rank: string;
  salesVolume: string;
  bio: string;
  fullBio: string;
  image: string;
  phone: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
  avatar: string;
  lastLogin: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  body: string;
}

export interface WhatsAppRecipient {
  id: string;
  name: string;
  phone: string;
  cleanPhone: string;
  city?: string;
  budget?: string;
  propertyInterest?: string;
  tags?: string[];
  status: 'valid' | 'invalid';
  validationError?: string;
  dispatchStatus: 'pending' | 'queued' | 'sending' | 'sent' | 'failed';
  sentAt?: string;
  error?: string;
  waLink?: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  templateId?: string;
  message: string;
  attachedPropertyId?: string;
  attachedPropertyTitle?: string;
  attachedPropertyPrice?: string;
  totalRecipients: number;
  validRecipients: number;
  sentCount: number;
  failedCount: number;
  status: 'draft' | 'scheduled' | 'broadcasting' | 'completed';
  createdAt: string;
  completedAt?: string;
  recipients: WhatsAppRecipient[];
  deliveryRate?: number;
}

export interface DbSchema {
  properties: PropertyData[];
  tourBookings: TourBooking[];
  inquiries: Inquiry[];
  newsletter: string[];
  agent: AgentInfo;
  admins: AdminAccount[];
  whatsappTemplates: WhatsAppTemplate[];
  whatsappCampaigns: WhatsAppCampaign[];
}
