import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Award, ShieldCheck, Check, AlertCircle, Plus, X } from 'lucide-react';
import { AgentInfo } from '../../types';

interface AdminAgentSettingsProps {
  agent: AgentInfo;
  onSave: (updated: Partial<AgentInfo>) => Promise<boolean>;
}

export const AdminAgentSettings: React.FC<AdminAgentSettingsProps> = ({
  agent,
  onSave
}) => {
  const [name, setName] = useState(agent.name);
  const [role, setRole] = useState(agent.role);
  const [experienceYears, setExperienceYears] = useState(agent.experienceYears);
  const [rank, setRank] = useState(agent.rank);
  const [salesVolume, setSalesVolume] = useState(agent.salesVolume);
  const [licenseNumber, setLicenseNumber] = useState(agent.licenseNumber);
  const [phone, setPhone] = useState(agent.phone);
  const [email, setEmail] = useState(agent.email);
  const [image, setImage] = useState(agent.image);
  const [bio, setBio] = useState(agent.bio);
  const [fullBio, setFullBio] = useState(agent.fullBio);
  const [specialties, setSpecialties] = useState<string[]>(agent.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setName(agent.name);
    setRole(agent.role);
    setExperienceYears(agent.experienceYears);
    setRank(agent.rank);
    setSalesVolume(agent.salesVolume);
    setLicenseNumber(agent.licenseNumber);
    setPhone(agent.phone);
    setEmail(agent.email);
    setImage(agent.image);
    setBio(agent.bio);
    setFullBio(agent.fullBio);
    setSpecialties(agent.specialties || []);
  }, [agent]);

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage('');

    try {
      const success = await onSave({
        name,
        role,
        experienceYears: Number(experienceYears),
        rank,
        salesVolume,
        licenseNumber,
        phone,
        email,
        image,
        bio,
        fullBio,
        specialties
      });

      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setErrorMessage('Failed to save advisor settings.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Managing Broker & Advisor Profile
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure the public advisor spotlight, MahaRERA accreditation details, and client contact channels.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-[#16a34a]" />
            Settings saved and live on website!
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-sm bg-neutral-100">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
              />
            </div>
          </div>

          {/* Core Info */}
          <div className="sm:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Advisor Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Professional Title / Designation *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Industry Rank Badge
                </label>
                <input
                  type="text"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. Top 1% Luxury Producer"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Cumulative Sales Volume
                </label>
                <input
                  type="text"
                  value={salesVolume}
                  onChange={(e) => setSalesVolume(e.target.value)}
                  placeholder="e.g. ₹850+ Cr Sales Volume"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  MahaRERA Registration #
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bios */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Short Spotlight Bio (Homepage card)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              required
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Complete Curriculum Vitae & Experience Statement (Full Modal)
            </label>
            <textarea
              value={fullBio}
              onChange={(e) => setFullBio(e.target.value)}
              rows={4}
              required
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
            />
          </div>
        </div>

        {/* Advisory Specialties */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-700">
            Advisory Specialties & Practice Areas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSpecialty();
                }
              }}
              placeholder="e.g. NRI Wealth Structuring & Remittance Compliance"
              className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
            />
            <button
              type="button"
              onClick={handleAddSpecialty}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {specialties.map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialty(idx)}
                  className="text-neutral-400 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Advisor Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
