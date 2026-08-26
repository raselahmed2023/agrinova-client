'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Layers, Sprout, Calendar, Edit3, Trash2, Loader2, Info, User, Phone } from 'lucide-react';
import { IFarm } from '@/types/farm';
import EditFarmDrawer from '@/components/farm/EditFarmDrawer';
import Image from 'next/image';
import DeleteConfirmationModal from '@/components/farm/DeleteConfirmationModal';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function FarmDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: farmId } = use(params);
  const router = useRouter();

  const [farm, setFarm] = useState<IFarm | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFarmDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/farms/${farmId}`);
      const data = await res.json();
      if (data.success) {
        setFarm(data.data);
      }
    } catch (err) {
      console.error('Fetch Farm Details Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmId) fetchFarmDetails();
  }, [farmId]);

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`${BACKEND_URL}/farms/${farmId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setIsDeleteOpen(false);
        router.push('/dashboard/farmer/farms');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen p-8 max-w-[1200px] mx-auto text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Farm Not Found!</h2>
        <Link href="/dashboard/farmer/farms" className="text-emerald-600 hover:underline inline-block text-sm font-semibold">
          Back to Farms List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 bg-slate-50/50 min-h-screen text-slate-800">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/farmer/farms"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Farms
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 shadow-sm transition"
          >
            <Edit3 className="w-4 h-4" /> Edit Farm
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 shadow-sm transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Main Farm Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
        {/* Cover Hero Image */}
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={farm.coverImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'}
            alt={farm.name}
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-1.5">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                farm.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
              }`}
            >
              • {farm.status}
            </span>
            <h1 className="text-3xl font-bold">{farm.name}</h1>
            <p className="text-sm text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" /> {farm.district}, {farm.division}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Land Area</p>
              <h4 className="text-xl font-bold text-slate-900">{farm.landArea} {farm.unit}</h4>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Soil Type</p>
              <h4 className="text-xl font-bold text-slate-900">{farm.soilType}</h4>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Active Crops</p>
              <h4 className="text-xl font-bold text-slate-900">{farm.activeCropsCount || 0}</h4>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Created At</p>
              <h4 className="text-sm font-bold text-slate-900">
                {new Date(farm.createdAt).toLocaleDateString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Extended Details Section */}
        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About / Synopsis */}
          <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" /> Farm Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {farm.description || 'No additional details provided for this farm location. Update farm details using the edit button above.'}
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Location Details</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">Division</span>
                <span className="font-semibold text-slate-800">{farm.division}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">District</span>
                <span className="font-semibold text-slate-800">{farm.district}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-600">{farm.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers & Modals */}
      <EditFarmDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchFarmDetails}
        farmData={farm}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={farm.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}