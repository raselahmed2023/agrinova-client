const resources = [
  {
    image:
      "./images/home/rice-cultivation-guide.png",
    category: "GUIDE",
    title: "Comprehensive Rice Cultivation Guide for Beginners",
  },
  {
    image:
      "./images/home/tomato-disease-control.png",
    category: "DISEASE CONTROL",
    title: "Identifying and Treating Early Blight in Tomatoes",
  },
  {
    image:
      "./images/home/irrigation-tips.png",
    category: "EFFICIENCY",
    title: "Top 10 Irrigation Tips to Save Water and Money",
  },
];

export default function EducationalResources() {
  return (
    <section className="w-full bg-[#f8f9fc] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-[#003b2b] sm:text-4xl">
          Educational Resources
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.title} className="group">
              {/* Image */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="h-[190px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              {/* Category */}
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#60756d]">
                {resource.category}
              </p>

              {/* Title */}
              <h3 className="mt-2 max-w-[390px] text-lg font-bold leading-7 text-[#003b2b]">
                {resource.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}