"use client";

import { motion } from "motion/react";

const resources = [
  {
    image: "./images/home/rice-cultivation-guide.png",
    category: "GUIDE",
    title: "Comprehensive Rice Cultivation Guide for Beginners",
  },
  {
    image: "./images/home/tomato-disease-control.png",
    category: "DISEASE CONTROL",
    title: "Identifying and Treating Early Blight in Tomatoes",
  },
  {
    image: "./images/home/irrigation-tips.png",
    category: "EFFICIENCY",
    title: "Top 10 Irrigation Tips to Save Water and Money",
  },
];

export default function EducationalResources() {
  return (
    <section className="w-full bg-[#f8f9fc] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 text-3xl font-bold tracking-tight text-[#003b2b] sm:text-4xl"
        >
          Educational Resources
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {resources.map((resource, index) => (
            <motion.article
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="h-[190px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Category */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.12 + 0.2,
                }}
                className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#60756d]"
              >
                {resource.category}
              </motion.p>

              {/* Title */}
              <h3 className="mt-2 max-w-[390px] text-lg font-bold leading-7 text-[#003b2b] transition-colors duration-300 group-hover:text-[#176b4f]">
                {resource.title}
              </h3>

              {/* Read more */}
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#176b4f] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Read article
                <span>→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}