"use client";

import React from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import type { DayAvailability, TimeSlot } from "@/types/expert";

interface AvailabilityDayRowProps {
  dayData: DayAvailability;
  onChange: (updated: DayAvailability) => void;
}

export default function AvailabilityDayRow({
  dayData,
  onChange,
}: AvailabilityDayRowProps) {
  const handleToggle = () => {
    const updated: DayAvailability = {
      ...dayData,
      isAvailable: !dayData.isAvailable,
      slots:
        !dayData.isAvailable && dayData.slots.length === 0
          ? [{ id: `slot-${Date.now()}`, start: "09:00", end: "17:00" }]
          : dayData.slots,
    };
    onChange(updated);
  };

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      start: "14:00",
      end: "17:00",
    };
    onChange({
      ...dayData,
      slots: [...dayData.slots, newSlot],
    });
  };

  const handleRemoveSlot = (index: number) => {
    const updatedSlots = dayData.slots.filter((_, i) => i !== index);
    onChange({
      ...dayData,
      slots: updatedSlots,
    });
  };

  const handleSlotChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updatedSlots = [...dayData.slots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    };
    onChange({
      ...dayData,
      slots: updatedSlots,
    });
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        dayData.isAvailable
          ? "border-slate-200/90 bg-white shadow-sm"
          : "border-slate-100 bg-slate-50/60 opacity-70"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle & Day Label */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={dayData.isAvailable}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>

          <div>
            <h4
              className={`text-sm font-bold capitalize ${
                dayData.isAvailable ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {dayData.label || dayData.day}
            </h4>
            <span className="text-[11px] text-slate-400">
              {dayData.isAvailable
                ? `${dayData.slots.length} time slot(s) active`
                : "Unavailable for bookings"}
            </span>
          </div>
        </div>

        {/* Time Slots Area */}
        {dayData.isAvailable ? (
          <div className="flex-1 max-w-xl space-y-2">
            <div className="flex flex-col gap-2">
              {dayData.slots.map((slot, index) => (
                <div
                  key={slot.id || index}
                  className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200"
                >
                  <Clock className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) =>
                        handleSlotChange(index, "start", e.target.value)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">to</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) =>
                        handleSlotChange(index, "end", e.target.value)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {dayData.slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 transition"
                      title="Remove Slot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline pt-1"
            >
              <Plus className="h-3 w-3" />
              Add Another Slot
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">Day off</div>
        )}
      </div>
    </div>
  );
}
