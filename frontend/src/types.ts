export type PropertyType = 'All' | 'Single Family' | 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse';
export type ListingStatus = 'For Sale' | 'For Rent' | 'Pending' | 'Sold';

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  formattedPrice: string;
  type: 'Single Family' | 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse';
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
}

export interface FilterOptions {
  location: string;
  propertyType: string;
  priceRange: string;
  statusTab: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  verified: boolean;
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

export interface TourBookingData {
  id?: string;
  propertyId: string;
  propertyTitle: string;
  tourType: 'In-Person' | 'Video Call' | 'Live Video Walkthrough';
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status?: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt?: string;
}

export interface TourBookingRecord {
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

export interface InquiryLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestType: string;
  preferredLocation: string;
  budgetRange: string;
  message: string;
  status: 'pending' | 'contacted' | 'negotiating' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin?: string;
  token?: string;
}

export interface AdminStats {
  totalListings: number;
  activeListings: number;
  totalInventoryValue: number;
  formattedInventoryValue: string;
  totalTours: number;
  upcomingTours: number;
  totalInquiries: number;
  pendingInquiries: number;
  subscribersCount: number;
  recentActivity: Array<{
    type: 'tour' | 'inquiry' | 'listing';
    text: string;
    date: string;
  }>;
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

export interface WhatsAppCampaignTemplate {
  id: string;
  title: string;
  category: 'Off-Market Launch' | 'Private Viewing' | 'Price Revision' | 'NRI Investment' | 'Festival Privilege' | 'Custom';
  description: string;
  body: string;
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
