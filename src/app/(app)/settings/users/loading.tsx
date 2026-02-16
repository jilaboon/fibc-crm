export default function Loading() {
  return (
    <div dir="rtl" className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-36" />
          <div className="h-4 bg-gray-200 rounded w-52 mt-2" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-28" />
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white border border-[#e6e9ef] overflow-hidden">
        <div className="bg-[#f6f7fb] h-10" />
        <div className="divide-y divide-[#e6e9ef]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-36" />
              <div className="h-5 bg-gray-200 rounded w-14" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-12" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
