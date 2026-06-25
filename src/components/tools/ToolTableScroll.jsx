/**
 * Yatay kaydırılabilir tablo alanı — sayfa kaymasını önler
 */
export default function ToolTableScroll({ children, className = '', showHint = true }) {
  return (
    <div className={`tool-table-scroll ${className}`}>
      {showHint && (
        <p className="mb-2 px-1 text-center text-[10px] font-medium text-warm-400 sm:hidden">
          Tabloyu yatay kaydırabilirsiniz
        </p>
      )}
      {children}
    </div>
  );
}
