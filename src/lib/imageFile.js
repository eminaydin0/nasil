/** Admin yüklemelerinde jfif/avif/png/jpg dosyasını webp'e çevirir. Tarayıcı dışında dosyayı olduğu gibi bırakır. */
export async function toWebpFile(file) {
  if (!file || typeof document === 'undefined') return file;
  if (!String(file.type || '').startsWith('image/')) return file;
  if (file.type === 'image/webp' || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  if (typeof bitmap.close === 'function') bitmap.close();

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.82);
  });
  if (!blob) return file;

  const base = String(file.name || 'gorsel').replace(/\.[^.]+$/, '') || 'gorsel';
  return new File([blob], `${base}.webp`, { type: 'image/webp' });
}
