/**
 * Admin sekme başlığı — Topbar ile çift H2 oluşmasını önler;
 * açıklama + aksiyon alanı standartlaştırır.
 */
function AdminPageHeader({ description, actions, stats }) {
  return (
    <div className="admin-page-header mb-6 flex flex-col gap-3 border-b border-warm-200/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-warm-600">{description}</p>
        )}
        {stats && (
          <div className="mt-2.5 flex flex-wrap gap-2">{stats}</div>
        )}
      </div>
      {actions && (
        <div className="admin-page-actions flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;
