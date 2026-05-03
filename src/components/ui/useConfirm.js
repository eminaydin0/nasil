import { useContext } from 'react';
import { ConfirmCtx } from './confirmContext';

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) {
    return async (opts) =>
      window.confirm(opts?.description || opts?.title || 'Emin misiniz?');
  }
  return ctx.confirm;
}

export default useConfirm;
