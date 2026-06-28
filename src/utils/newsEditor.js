/** Haber içerik editörü yardımcıları */

export const NEWS_CONTENT_TEMPLATES = [
  {
    id: 'lead',
    label: 'Giriş paragrafı',
    content:
      'Bu paragraf haberin giriş cümlesidir. Okuyucuya konuyu hızlıca özetler ve devamını okumaya teşvik eder. **Önemli kelimeler** kalın yazılabilir.',
  },
  {
    id: 'h2-section',
    label: 'Bölüm (H2 + metin)',
    content:
      '## Bölüm başlığı\n\nBu bölümde konuyu detaylandırın. Bir veya birkaç paragraf yazabilirsiniz.',
  },
  {
    id: 'h3-sub',
    label: 'Alt başlık (H3)',
    content: '### Alt başlık\n\nAlt bölüm açıklaması buraya gelir.',
  },
  {
    id: 'quote',
    label: 'Alıntı / vurgu',
    content: '> "Buraya alıntı veya dikkat çekici bir cümle yazın."\n>\n> — Kaynak veya açıklama',
  },
  {
    id: 'bullets',
    label: 'Madde listesi',
    content: '- Birinci madde\n- İkinci madde\n- Üçüncü madde',
  },
  {
    id: 'numbered',
    label: 'Numaralı liste',
    content: '1. İlk adım veya bilgi\n2. İkinci adım\n3. Üçüncü adım',
  },
  {
    id: 'faq',
    label: 'SSS bloğu',
    content:
      '### Ne zaman çıkacak?\n\nÇıkış tarihi hakkında bilinenler burada.\n\n### Fiyat ne kadar?\n\nFiyatlandırma detayları burada.',
  },
  {
    id: 'image-block',
    label: 'Görsel + açıklama',
    content:
      '![Görsel açıklaması](https://)\n\nGörselin altında yer alacak kısa açıklama paragrafı.',
  },
  {
    id: 'source',
    label: 'Kaynak linki',
    content: '**Kaynak:** [Resmi duyuru / site adı](https://example.com)',
  },
  {
    id: 'divider',
    label: 'Bölüm ayırıcı',
    content: '---',
  },
];

export function countWords(text) {
  return String(text || '')
    .replace(/^#{1,6}\s+/gm, '')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function countHeadings(text) {
  return String(text || '')
    .split('\n')
    .filter((line) => line.trim().startsWith('## ')).length;
}

/** Metni imleç konumuna ekler, imleci eklenen metnin sonuna taşır */
export function insertAtCursor(textarea, currentValue, insertion, onChange) {
  if (!textarea) {
    onChange(currentValue ? `${currentValue}\n\n${insertion}` : insertion);
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = currentValue.slice(0, start);
  const after = currentValue.slice(end);

  let prefix = '';
  if (before.length > 0) {
    if (before.endsWith('\n\n')) prefix = '';
    else if (before.endsWith('\n')) prefix = '\n';
    else prefix = '\n\n';
  }

  let suffix = '';
  if (after.length > 0 && !after.startsWith('\n')) suffix = '\n\n';

  const next = before + prefix + insertion + suffix + after;
  onChange(next);

  const cursorPos = before.length + prefix.length + insertion.length;
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorPos, cursorPos);
  });
}

/** Seçili metni sarmalar veya boş şablon ekler */
export function wrapSelection(textarea, currentValue, before, after, onChange, placeholder = '') {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end);
  const inner = selected || placeholder;
  const wrapped = `${before}${inner}${after}`;

  const next = currentValue.slice(0, start) + wrapped + currentValue.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    if (selected) {
      textarea.setSelectionRange(start + wrapped.length, start + wrapped.length);
    } else {
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + inner.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }
  });
}

/** Satır başına prefix ekler (liste vb.) */
export function prefixLines(textarea, currentValue, prefix, onChange) {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end);

  const block = selected || 'Madde metni';
  const lines = block.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return prefix;
    if (trimmed.startsWith(prefix.trim())) return trimmed;
    return `${prefix}${trimmed}`;
  });

  const transformed = lines.join('\n');
  const next = currentValue.slice(0, start) + transformed + currentValue.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start, start + transformed.length);
  });
}

/** Numaralı liste prefix */
export function prefixNumberedList(textarea, currentValue, onChange) {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = currentValue.slice(start, end) || 'Birinci madde\nİkinci madde\nÜçüncü madde';

  const lines = selected.split('\n').map((line, i) => {
    const trimmed = line.replace(/^\d+\.\s*/, '').trim() || `Madde ${i + 1}`;
    return `${i + 1}. ${trimmed}`;
  });

  const transformed = lines.join('\n');
  const next = currentValue.slice(0, start) + transformed + currentValue.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start, start + transformed.length);
  });
}
