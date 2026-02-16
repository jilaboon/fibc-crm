export default function Loading() {
  return (
    <div dir="rtl" className="space-y-8 animate-pulse">
      {/* Title */}
      <div className="h-9 bg-gray-200 rounded w-28" />

      {/* Table card */}
      <div className="rounded-lg bg-white border border-[#e6e9ef] p-6">
        <div className="h-6 bg-gray-200 rounded w-28 mb-4" />
        <div className="space-y-3">
          {/* Header row */}
          <div className="bg-[#f6f7fb] h-10 rounded" />
          {/* Data rows */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
