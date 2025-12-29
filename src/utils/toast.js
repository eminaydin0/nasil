import toast from 'react-hot-toast';

// Başarı bildirimi
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    ...options,
  });
};

// Hata bildirimi
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    ...options,
  });
};

// Bilgi bildirimi
export const showInfo = (message, options = {}) => {
  return toast(message, {
    icon: 'ℹ️',
    duration: 3000,
    ...options,
  });
};

// Yükleniyor bildirimi
export const showLoading = (message = 'Yükleniyor...') => {
  return toast.loading(message);
};

// Yükleniyor bildirimini güncelle/kapat
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Promise ile otomatik yönetim
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Yükleniyor...',
    success: messages.success || 'İşlem başarılı!',
    error: messages.error || 'İşlem başarısız!',
  });
};

// Özel toast
export const showCustom = (message, icon, options = {}) => {
  return toast(message, {
    icon: icon,
    duration: 3000,
    ...options,
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  loading: showLoading,
  dismiss: dismissToast,
  promise: showPromise,
  custom: showCustom,
};
