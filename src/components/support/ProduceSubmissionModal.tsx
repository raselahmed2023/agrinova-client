
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { X, Upload, Sprout } from "lucide-react";

interface ProduceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

interface FormData {
  farmerName: string;
  phone: string;
  produceName: string;
  category: string;
  quantity: string;
  unit: string;
  expectedPrice: string;
  location: string;
  notes: string;
  images: File[];
}

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Pulses & Seeds",
  "Spices",
  "Others",
];

const UNITS = ["Kg", "Mound", "Ton", "Bag", "Box"];

export default function ProduceSubmissionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: ProduceSubmissionModalProps) {
  const [formData, setFormData] = useState<FormData>({
    farmerName: "",
    phone: "",
    produceName: "",
    category: "",
    quantity: "",
    unit: "Kg",
    expectedPrice: "",
    location: "",
    notes: "",
    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Farmer Produce Submission Data:", formData);

      // Form Reset
      setFormData({
        farmerName: "",
        phone: "",
        produceName: "",
        category: "",
        quantity: "",
        unit: "Kg",
        expectedPrice: "",
        location: "",
        notes: "",
        images: [],
      });
      setPreviews([]);

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#053225] text-white">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-[#b2f2bb]" />
            <div>
              <h2 className="text-lg font-bold">Produce Selling Assistance</h2>
              <p className="text-xs text-gray-200">
                AgriNova helps sell your unsold farm produce directly to buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Farmer Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Farmer Name *
              </label>
              <input
                type="text"
                name="farmerName"
                required
                value={formData.farmerName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
              />
            </div>
          </div>

          {/* Produce Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Produce Name *
              </label>
              <input
                type="text"
                name="produceName"
                required
                value={formData.produceName}
                onChange={handleChange}
                placeholder="e.g. Red Tomatoes, Potatoes, Rice"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden bg-white"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Expected Price (৳) *
              </label>
              <input
                type="number"
                name="expectedPrice"
                required
                value={formData.expectedPrice}
                onChange={handleChange}
                placeholder="Price per unit"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Farm Location / Address *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Village, Union, Upazila, District"
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Additional Details / Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Mention produce quality, harvest date, or special details..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#053225] focus:border-transparent outline-hidden resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload Produce Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-[#053225] transition-colors relative bg-gray-50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                Click or drag images here to upload
              </p>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto py-1">
                {previews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#053225] hover:bg-[#032018] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}