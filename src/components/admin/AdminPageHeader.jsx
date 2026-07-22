/**
 * Admin sekme başlığı — Topbar ile çift H2 oluşmasını önler;
 * açıklama + aksiyon alanı standartlaştırır.
 */
function AdminPageHeader({ description, actions, stats }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {description && (
          <p className="text-sm text-warm-600">{description}</p>
        )}
        {stats && (
          <div className="mt-2 flex flex-wrap gap-2">{stats}</div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export default AdminPageHeader;
