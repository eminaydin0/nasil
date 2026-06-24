export default function EngagementCard({ icon: Icon, label, value, desc, warn }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-soft sm:p-5 ${
        warn ? 'border-rose-200/60 bg-rose-50/50' : 'border-warm-200/60 bg-white'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`grid h-8 w-8 place-items-center rounded-lg ${
            warn ? 'bg-rose-100 text-rose-600' : 'bg-warm-100 text-warm-600'
          }`}
        >
          <Icon size={15} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-warm-600">
          {label}
        </span>
      </div>
      <div
        className={`text-xl font-bold tracking-tight sm:text-2xl ${
          warn ? 'text-rose-600' : 'text-charcoal-900'
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-medium text-warm-500">{desc}</div>
    </div>
  );
}
