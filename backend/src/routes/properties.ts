import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { formatINRPrice } from '../utils/format.js';

export const propertiesRouter = Router();

// GET /api/properties — multi-criteria search, filter, sort (public)
propertiesRouter.get('/', async (req, res) => {
  await db.read();
  const { location, propertyType, statusTab, priceRange, sort, featured } = req.query;

  let filtered = [...db.data.properties];

  if (featured === 'true') {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (location && typeof location === 'string' && location.trim() !== '') {
    const q = location.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
    );
  }

  if (propertyType && propertyType !== 'All') {
    filtered = filtered.filter((p) => p.type === propertyType);
  }

  if (statusTab && statusTab !== 'all') {
    const statusMap: Record<string, string> = {
      for_sale: 'For Sale',
      for_rent: 'For Rent',
      pending: 'Pending',
    };
    const targetStatus = statusMap[statusTab as string];
    if (targetStatus) {
      filtered = filtered.filter((p) => p.status === targetStatus);
    }
  }

  if (priceRange && priceRange !== 'Any') {
    if (priceRange === 'Under ₹5 Cr' || priceRange === 'Under $1M') {
      filtered = filtered.filter((p) => p.price < 50000000);
    } else if (priceRange === '₹5 Cr - ₹10 Cr' || priceRange === '$1M - $2M') {
      filtered = filtered.filter((p) => p.price >= 50000000 && p.price <= 100000000);
    } else if (priceRange === '₹10 Cr - ₹20 Cr' || priceRange === '$2M - $3M') {
      filtered = filtered.filter((p) => p.price > 100000000 && p.price <= 200000000);
    } else if (priceRange === '₹20 Cr+' || priceRange === '$3M+') {
      filtered = filtered.filter((p) => p.price > 200000000);
    }
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => b.yearBuilt - a.yearBuilt);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// GET /api/properties/:id (public)
propertiesRouter.get('/:id', async (req, res) => {
  await db.read();
  const property = db.data.properties.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!property) {
    res.status(404).json({ success: false, message: 'Property not found.' });
    return;
  }
  res.json({ success: true, data: property });
});

// POST /api/properties (admin only)
propertiesRouter.post('/', requireAdmin, async (req, res) => {
  await db.read();
  const data = req.body;
  if (!data.title || !data.price || !data.type || !data.location) {
    res.status(422).json({ success: false, message: 'Missing required listing fields: title, price, type, location.' });
    return;
  }

  const newProp = {
    id: `prop-${Date.now().toString().slice(-6)}`,
    title: data.title,
    slug: `${String(data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random() * 900 + 100)}`,
    price: Number(data.price),
    formattedPrice: formatINRPrice(Number(data.price), data.status),
    type: data.type,
    status: data.status || 'For Sale',
    location: data.location,
    city: data.city || 'Mumbai',
    state: data.state || 'MH',
    zip: data.zip || '400001',
    beds: Number(data.beds || 3),
    baths: Number(data.baths || 2.5),
    sqft: Number(data.sqft || 2500),
    yearBuilt: Number(data.yearBuilt || new Date().getFullYear()),
    description: data.description || 'Exclusive luxury residence offering premier bespoke living.',
    features: Array.isArray(data.features) ? data.features : ['Italian Marble', 'Smart Automation'],
    images:
      Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    isFeatured: !!data.isFeatured,
    hoaMonthly: Number(data.hoaMonthly || 0),
    propertyTaxAnnual: Number(data.propertyTaxAnnual || 0),
    createdAt: new Date().toISOString(),
  };

  db.data.properties.unshift(newProp);
  await db.write();

  res.status(201).json({ success: true, message: 'Property listing created successfully.', data: newProp });
});

// PUT /api/properties/:id (admin only)
propertiesRouter.put('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const { id } = req.params;
  const index = db.data.properties.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Property listing not found.' });
    return;
  }

  const current = db.data.properties[index];
  const update = req.body;
  const newPrice = update.price !== undefined ? Number(update.price) : current.price;
  const newStatus = update.status !== undefined ? update.status : current.status;

  const updated = {
    ...current,
    ...update,
    id: current.id,
    price: newPrice,
    status: newStatus,
    formattedPrice: update.formattedPrice || formatINRPrice(newPrice, newStatus),
    beds: update.beds !== undefined ? Number(update.beds) : current.beds,
    baths: update.baths !== undefined ? Number(update.baths) : current.baths,
    sqft: update.sqft !== undefined ? Number(update.sqft) : current.sqft,
    yearBuilt: update.yearBuilt !== undefined ? Number(update.yearBuilt) : current.yearBuilt,
    hoaMonthly: update.hoaMonthly !== undefined ? Number(update.hoaMonthly) : current.hoaMonthly,
    propertyTaxAnnual: update.propertyTaxAnnual !== undefined ? Number(update.propertyTaxAnnual) : current.propertyTaxAnnual,
    features: Array.isArray(update.features) ? update.features : current.features,
    images: Array.isArray(update.images) && update.images.length > 0 ? update.images : current.images,
    isFeatured: update.isFeatured !== undefined ? Boolean(update.isFeatured) : current.isFeatured,
  };

  db.data.properties[index] = updated;
  await db.write();

  res.json({ success: true, message: 'Property listing updated successfully.', data: updated });
});

// DELETE /api/properties/:id (admin only)
propertiesRouter.delete('/:id', requireAdmin, async (req, res) => {
  await db.read();
  const { id } = req.params;
  const index = db.data.properties.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Property listing not found.' });
    return;
  }
  const removed = db.data.properties.splice(index, 1)[0];
  await db.write();
  res.json({ success: true, message: `Property "${removed.title}" was successfully deleted.`, data: removed });
});
