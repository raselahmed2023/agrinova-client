import React from "react";
import Image from "next/image";
import { experts } from "@/data/mockData";

export default function ExpertSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8 bg-[#F5F8FF] dark:bg-zinc-900 rounded-3xl my-8">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Side: Expert Cards */}
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-1/2 justify-center">
          {experts.map((expert, index) => (
            <div 
              key={expert.id} 
              className={`bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col w-full sm:w-64 flex-shrink-0 ${
                index === 1 ? "sm:-mt-8" : "" // Slight offset for the second card as in design
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4 relative">
                <Image 
                  src={expert.image} 
                  alt={expert.name} 
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{expert.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">{expert.title}</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs mb-6 flex-1">{expert.description}</p>
              
              <button className="flex items-center text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:text-black dark:hover:text-white group">
                Contact
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#143B2E] dark:text-emerald-400 mb-4 leading-tight">
            Get Guidance from Agricultural Experts
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
            Connect with certified agronomists and specialists who can help you solve complex farm problems. From soil testing results to harvest strategies, we bring the experts to your phone.
          </p>
          <button className="flex items-center px-6 py-3 bg-[#0A3622] text-white font-medium rounded-lg hover:bg-[#072416] transition-colors shadow-md">
            Find an Expert
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
