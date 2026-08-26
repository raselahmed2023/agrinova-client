'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, MapPin, Edit3, Sprout, Loader2 } from 'lucide-react';
import { IFarm } from '@/types/farm';
import AddFarmDrawer from '@/components/farm/AddFarmDrawer';
import EditFarmDrawer from '@/components/farm/EditFarmDrawer';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function FarmsPage() {
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<IFarm | null>(null);
  const [search, setSearch] = useState('');

  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/farms?search=${search}`);
      const data = await res.json();
      if (data.success) setFarms(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const handleEditClick = (farm: IFarm) => {
    setSelectedFarm(farm);
    setIsEditOpen(true);
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 bg-slate-50/50 min-h-screen text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Farms</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor all your agricultural properties.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-emerald-950 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-emerald-900 transition"
        >
          <Plus className="w-4 h-4" /> Add Farm
        </button>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search farms by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm w-full focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div key={farm._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-44">
                <img src={farm.coverImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'} alt={farm.name} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  farm.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  • {farm.status}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{farm.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {farm.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Area</span>
                    <p className="text-sm font-bold text-slate-800">{farm.landArea} {farm.unit}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Soil</span>
                    <p className="text-sm font-bold text-slate-800">{farm.soilType}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Sprout className="w-4 h-4 text-emerald-600" /> {farm.activeCropsCount || 0} active crops
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(farm)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/farmer/farms/${farm._id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFarmDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchFarms}
      />

      <EditFarmDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchFarms}
        farmData={selectedFarm}
      />
    </div>
  );
}