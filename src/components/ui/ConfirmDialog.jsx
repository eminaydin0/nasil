import { useCallback, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle, Loader2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { ConfirmCtx } from './confirmContext';

const ICONS = {
  danger: { Icon: Trash2, tone: 'rose', confirmVariant: 'primary', defaultLabel: 'Sil' },
  warning: { Icon: AlertTriangle, tone: 'amber', confirmVariant: 'primary', defaultLabel: 'Devam Et' },
  info: { Icon: Info, tone: 'blue', confirmVariant: 'primary', defaultLabel: 'Tamam' },
  success: { Icon: CheckCircle, tone: 'emerald', confirmVariant: 'primary', defaultLabel: 'Tamam' },
};

/**
 * <ConfirmProvider> - uygulama kokune sar
 * Sonra: const confirm = useConfirm();
 *        const ok = await confirm({ title, description, type: 'danger', confirmText, cancelText });
 *        if (!ok) return;
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: 'Emin misiniz?',
    description: '',
    type: 'warning',
    confirmText: '',
    cancelText: 'İptal',
    requireText: '', // istege bagli: "EVET" yaz onay
    loading: false,
  });
  const resolverRef = useRef(null);
  const [requireInput, setRequireInput] = useState('');

  const close = useCallback((result) => {
    setState((s) => ({ ...s, open: false, loading: false }));
    setRequireInput('');
    resolverRef.current?.(result);
    resolverRef.current = null;
  }, []);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({
        open: true,
        title: opts.title || 'Emin misiniz?',
        description: opts.description || '',
        type: opts.type || 'warning',
        confirmText: opts.confirmText || '',
        cancelText: opts.cancelText || 'İptal',
        requireText: opts.requireText || '',
        loading: false,
      });
      setRequireInput('');
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  const meta = ICONS[state.type] || ICONS.warning;
  const confirmText = state.confirmText || meta.defaultLabel;
  const isDanger = state.type === 'danger';

  const requireOk =
    !state.requireText ||
    requireInput.trim().toUpperCase() === state.requireText.trim().toUpperCase();

  return (
    <ConfirmCtx.Provider value={value}>
      {children}
      <Modal
        open={state.open}
        onClose={() => close(false)}
        size="sm"
        icon={meta.Icon}
        iconTone={meta.tone}
        title={state.title}
        description={state.description}
        hideCloseButton={state.loading}
        closeOnOverlay={!state.loading}
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => close(false)}
              disabled={state.loading}
            >
              {state.cancelText}
            </Button>
            <Button
              size="md"
              onClick={() => close(true)}
              disabled={state.loading || !requireOk}
              className={
                isDanger
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_10px_30px_-10px_rgba(244,63,94,0.45)] hover:from-rose-600 hover:to-red-700'
                  : ''
              }
              iconLeft={state.loading ? Loader2 : null}
            >
              {confirmText}
            </Button>
          </>
        }
      >
        {state.requireText && (
          <div>
            <p className="mb-2 text-sm text-warm-700">
              Onaylamak için aşağıya{' '}
              <code className="rounded-md bg-warm-100 px-1.5 py-0.5 font-mono text-xs font-bold text-charcoal-900">
                {state.requireText}
              </code>{' '}
              yazın:
            </p>
            <input
              type="text"
              value={requireInput}
              onChange={(e) => setRequireInput(e.target.value)}
              autoFocus
              className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm font-mono uppercase text-charcoal-900 transition-all focus:border-rose-400 focus:bg-white focus:outline-none"
              placeholder={state.requireText}
            />
          </div>
        )}
      </Modal>
    </ConfirmCtx.Provider>
  );
}

export default ConfirmProvider;
