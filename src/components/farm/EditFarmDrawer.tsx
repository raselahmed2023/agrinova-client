'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { IFarm, IFarmFormData } from '@/types/farm';

const IMGBB_API_KEY = 'd3e4bc27d418ba7d094aa1df32884888';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface EditFarmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farmData: IFarm | null;
}

export default function EditFarmDrawer({ isOpen, onClose, onSuccess, farmData }: EditFarmDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Sync state during render pattern instead of useEffect
  const [prevFarmId, setPrevFarmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IFarmFormData>({
    name: farmData?.name || '',
    division: farmData?.division || '',
    district: farmData?.district || '',
    landArea: farmData?.landArea ? String(farmData.landArea) : '',
    unit: farmData?.unit || 'Bigha',
    soilType: farmData?.soilType || '',
    status: farmData?.status || 'Active',
    coverImage: farmData?.coverImage || '',
    description: farmData?.description || '',
  });

  // Updates form state synchronously when a new farmData prop is passed
  if (farmData && farmData._id !== prevFarmId) {
    setPrevFarmId(farmData._id);
    setFormData({
      name: farmData.name || '',
      division: farmData.division || '',
      district: farmData.district || '',
      landArea: farmData.landArea ? String(farmData.landArea) : '',
      unit: farmData.unit || 'Bigha',
      soilType: farmData.soilType || '',
      status: farmData.status || 'Active',
      coverImage: farmData.coverImage || '',
      description: farmData.description || '',
    });
  }

  if (!isOpen || !farmData) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImg(true);
      const imgFormData = new FormData();
      imgFormData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgFormData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, coverImage: data.data.url }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/farms/${farmData._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          landArea: Number(formData.landArea),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to update farm');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Edit Farm</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
              <select
                required
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="">Select...</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Dhaka">Dhaka</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
                required
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Land Area</label>
              <input
                required
                type="number"
                step="0.1"
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="Bigha">Bigha</option>
                <option value="Acre">Acre</option>
                <option value="Hectare">Hectare</option>
                <option value="Decimal">Decimal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
              <select
                required
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="Loamy">Loamy</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Silt">Silt</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a brief overview of this farm..."
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image</label>
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition relative">
              {uploadingImg ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              ) : formData.coverImage ? (
                <img src={formData.coverImage} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-500">Change cover image</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || uploadingImg}
            className="w-full py-2.5 bg-emerald-950 text-white rounded-lg text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Farm'}
          </button>
        </div>
      </div>
    </div>
  );
}