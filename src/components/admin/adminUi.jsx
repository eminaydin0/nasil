import { Filter, Search } from 'lucide-react';

/**
 * Ortak admin yüzeyleri — kart / tablo / toolbar tutarlılığı
 */
export function AdminCard({ children, className = '', padding = true }) {
  return (
    <div
      className={`admin-card overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft ${
        padding ? 'p-5 sm:p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminTableWrap({ children, className = '' }) {
  return (
    <div
      className={`admin-table-wrap overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminEmpty({ icon: Icon, title, description, action }) {
  return (
    <AdminCard className="py-12 text-center" padding>
      {Icon && (
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cream-100 text-warm-400">
          <Icon size={22} />
        </div>
      )}
      {title && <h3 className="text-base font-bold text-charcoal-900">{title}</h3>}
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-warm-500">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </AdminCard>
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Ara…',
  className = '',
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`admin-search w-full rounded-xl border border-warm-200 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-colors focus:border-orange-400 focus:bg-white focus:outline-none ${className}`}
    />
  );
}

export function AdminFilterSelect({
  value,
  onChange,
  children,
  className = '',
  'aria-label': ariaLabel = 'Filtre',
}) {
  return (
    <div className={`relative min-w-[10.5rem] flex-1 sm:flex-none ${className}`}>
      <Filter
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
      />
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className="w-full appearance-none rounded-xl border border-warm-200 bg-cream-50 py-2.5 pl-9 pr-8 text-sm font-semibold text-charcoal-900 transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}

/**
 * Tek satır toolbar: arama | filtre(ler) | aksiyon butonları
 */
export function AdminToolbar({ search, filters, actions, className = '' }) {
  const hasSearch = Boolean(search);

  return (
    <AdminCard className={className}>
      <div
        className={`flex flex-col gap-2.5 lg:flex-row lg:items-center ${
          !hasSearch ? 'lg:justify-end' : ''
        }`}
      >
        {hasSearch && (
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400"
            />
            {search}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {filters}
          {actions}
        </div>
      </div>
    </AdminCard>
  );
}
