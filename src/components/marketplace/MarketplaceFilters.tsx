import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface MarketplaceFiltersProps {
  search: string;
  category: string;
  sort: string;

  onSearchChange: (
    value: string
  ) => void;

  onCategoryChange: (
    value: string
  ) => void;

  onSortChange: (
    value: string
  ) => void;
}

const categories = [
  "all",
  "crops",
  "seeds",
  "fertilizers",
  "equipment",
];

const formatCategory = (
  category: string
) => {
  if (category === "all") {
    return "All Products";
  }

  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

export default function MarketplaceFilters({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search products..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <select
            value={category}
            onChange={(event) =>
              onCategoryChange(
                event.target.value
              )
            }
            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {formatCategory(item)}
                </option>
              )
            )}
          </select>
        </div>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target.value
            )
          }
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
        >
          <option value="newest">
            Newest First
          </option>

          <option value="price_asc">
            Price: Low to High
          </option>

          <option value="price_desc">
            Price: High to Low
          </option>
        </select>
      </div>
    </div>
  );
}