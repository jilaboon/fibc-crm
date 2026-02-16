export default function Loading() {
  return (
    <div dir="rtl" className="space-y-8 animate-pulse">
      {/* Title */}
      <div className="h-9 bg-gray-200 rounded w-28" />

      {/* 4 stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white border border-[#e6e9ef] p-4">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-7 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Referral link card */}
      <div className="rounded-lg bg-white border border-[#e6e9ef] p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
            <div className="h-8 bg-gray-100 rounded w-72" />
          </div>
          <div className="h-9 bg-gray-200 rounded w-16" />
        </div>
      </div>

      {/* Recent leads table */}
      <div className="rounded-lg bg-white border border-[#e6e9ef] p-6">
        <div className="h-6 bg-gray-200 rounded w-28 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
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
