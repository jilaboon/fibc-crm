export default function Loading() {
  return (
    <div dir="rtl" className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-9 bg-gray-200 rounded w-32" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>
      </div>

      {/* 5 stat cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white border border-[#e6e9ef] p-4">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-7 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Chart row 1: 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white border border-[#e6e9ef] p-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-48 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Chart row 2: 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white border border-[#e6e9ef] p-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-48 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Recent leads table */}
      <div className="rounded-lg bg-white border border-[#e6e9ef] p-6">
        <div className="h-6 bg-gray-200 rounded w-28 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
