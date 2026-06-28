import { useRef, useState, useCallback } from 'react';
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link2,
  Quote,
  List,
  ListOrdered,
  ImagePlus,
  Minus,
  Eye,
  PenLine,
  Columns2,
  LayoutTemplate,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import NewsContent from '../news/NewsContent';
import { uploadNewsImage } from '../../lib/supabase';
import { calculateReadTimeMinutes } from '../../utils/newsContent';
import {
  NEWS_CONTENT_TEMPLATES,
  countWords,
  countHeadings,
  insertAtCursor,
  wrapSelection,
  prefixLines,
  prefixNumberedList,
} from '../../utils/newsEditor';

const MODES = [
  { id: 'write', label: 'Yaz', icon: PenLine },
  { id: 'preview', label: 'Önizle', icon: Eye },
  { id: 'split', label: 'Yan yana', icon: Columns2 },
];

function ToolbarButton({ icon: Icon, label, onClick, active, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`news-editor-tool ${active ? 'news-editor-tool-active' : ''}`}
    >
      <Icon size={16} aria-hidden />
      <span className="news-editor-tool-label">{label}</span>
    </button>
  );
}

function NewsContentEditor({ value, onChange, newsSlug = 'haber' }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('split');
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const apply = useCallback(
    (fn) => {
      fn(textareaRef.current, value, onChange);
    },
    [value, onChange]
  );

  const handleImageUpload = async (file) => {
    if (!file?.type.startsWith('image/')) {
      toast.error('Sadece görsel dosyası yüklenebilir');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Görsel en fazla 5MB olabilir');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadNewsImage(file, newsSlug);
      if (!url) throw new Error('upload failed');
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      insertAtCursor(
        textareaRef.current,
        value,
        `![${alt}](${url})`,
        onChange
      );
      toast.success('Görsel eklendi');
    } catch {
      toast.error('Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const openLinkForm = () => {
    const ta = textareaRef.current;
    const selected = ta ? value.slice(ta.selectionStart, ta.selectionEnd) : '';
    setLinkLabel(selected || '');
    setLinkUrl('https://');
    setLinkOpen(true);
  };

  const insertLink = () => {
    const url = linkUrl.trim();
    const label = linkLabel.trim() || url;
    if (!url) {
      toast.error('Link URL gerekli');
      return;
    }
    insertAtCursor(textareaRef.current, value, `[${label}](${url})`, onChange);
    setLinkOpen(false);
    setLinkLabel('');
    setLinkUrl('');
  };

  const insertTemplate = (template) => {
    insertAtCursor(textareaRef.current, value, template.content, onChange);
    toast.success(`"${template.label}" eklendi`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleKeyDown = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === 'b') {
      e.preventDefault();
      apply((ta, val, ch) => wrapSelection(ta, val, '**', '**', ch, 'kalın metin'));
    }
    if (e.key === 'i') {
      e.preventDefault();
      apply((ta, val, ch) => wrapSelection(ta, val, '*', '*', ch, 'italik metin'));
    }
    if (e.key === 'k') {
      e.preventDefault();
      openLinkForm();
    }
  };

  const wordCount = countWords(value);
  const headingCount = countHeadings(value);
  const readMin = calculateReadTimeMinutes(value);
  const charCount = (value || '').length;

  const showWrite = mode === 'write' || mode === 'split';
  const showPreview = mode === 'preview' || mode === 'split';

  return (
    <div className="news-editor">
      <div className="news-editor-top">
        <div>
          <p className="news-editor-heading">Haber içeriği *</p>
          <p className="news-editor-hint">
            Başlık, liste, alıntı ve görsel ekleyin. Klavye: Ctrl+B kalın, Ctrl+I italik, Ctrl+K link
          </p>
        </div>
        <div className="news-editor-mode-tabs">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`news-editor-mode-tab ${mode === id ? 'news-editor-mode-tab-active' : ''}`}
            >
              <Icon size={14} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="news-editor-toolbar">
        <div className="news-editor-toolbar-group">
          <ToolbarButton
            icon={Heading2}
            label="H2"
            onClick={() =>
              apply((ta, val, ch) =>
                insertAtCursor(ta, val, '## Bölüm başlığı\n\nParagraf metni...', ch)
              )
            }
          />
          <ToolbarButton
            icon={Heading3}
            label="H3"
            onClick={() =>
              apply((ta, val, ch) =>
                insertAtCursor(ta, val, '### Alt başlık\n\nAçıklama...', ch)
              )
            }
          />
          <ToolbarButton
            icon={Bold}
            label="Kalın"
            onClick={() =>
              apply((ta, val, ch) => wrapSelection(ta, val, '**', '**', ch, 'kalın metin'))
            }
          />
          <ToolbarButton
            icon={Italic}
            label="İtalik"
            onClick={() =>
              apply((ta, val, ch) => wrapSelection(ta, val, '*', '*', ch, 'italik metin'))
            }
          />
          <ToolbarButton icon={Link2} label="Link" onClick={openLinkForm} />
        </div>

        <span className="news-editor-toolbar-divider" aria-hidden />

        <div className="news-editor-toolbar-group">
          <ToolbarButton
            icon={Quote}
            label="Alıntı"
            onClick={() =>
              apply((ta, val, ch) =>
                insertAtCursor(ta, val, '> Alıntı metni buraya...', ch)
              )
            }
          />
          <ToolbarButton
            icon={List}
            label="Liste"
            onClick={() =>
              apply((ta, val, ch) => prefixLines(ta, val, '- ', ch))
            }
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numara"
            onClick={() =>
              apply((ta, val, ch) => prefixNumberedList(ta, val, ch))
            }
          />
          <ToolbarButton
            icon={Minus}
            label="Ayraç"
            onClick={() => apply((ta, val, ch) => insertAtCursor(ta, val, '---', ch))}
          />
        </div>

        <span className="news-editor-toolbar-divider" aria-hidden />

        <div className="news-editor-toolbar-group">
          <ToolbarButton
            icon={uploading ? Loader2 : ImagePlus}
            label={uploading ? 'Yükleniyor' : 'Görsel'}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />

          <div className="news-editor-template-wrap">
            <label className="news-editor-template-select">
              <LayoutTemplate size={14} aria-hidden />
              <span>Şablon</span>
              <select
                defaultValue=""
                onChange={(e) => {
                  const tpl = NEWS_CONTENT_TEMPLATES.find((t) => t.id === e.target.value);
                  if (tpl) insertTemplate(tpl);
                  e.target.value = '';
                }}
              >
                <option value="" disabled>
                  Hazır blok ekle…
                </option>
                {NEWS_CONTENT_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {linkOpen && (
        <div className="news-editor-link-popover">
          <p className="news-editor-link-title">Link ekle</p>
          <div className="news-editor-link-fields">
            <input
              type="text"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Görünen metin"
              className="news-editor-link-input"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="news-editor-link-input"
            />
          </div>
          <div className="news-editor-link-actions">
            <button type="button" onClick={() => setLinkOpen(false)} className="news-editor-link-cancel">
              İptal
            </button>
            <button type="button" onClick={insertLink} className="news-editor-link-confirm">
              Ekle
            </button>
          </div>
        </div>
      )}

      <div
        className={`news-editor-panes ${mode === 'split' ? 'news-editor-panes-split' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {showWrite && (
          <div className="news-editor-pane">
            {mode === 'split' && <p className="news-editor-pane-label">Düzenle</p>}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={18}
              className="news-editor-textarea"
              placeholder={'## Haberin ana konusu\n\nGiriş paragrafını buraya yazın. Okuyucuya ne anlatacağınızı özetleyin.\n\n### Alt başlık\n\n- Madde bir\n- Madde iki\n\n> Önemli bir alıntı veya vurgu\n\n![Görsel açıklaması](url)\n\n**Kaynak:** [Link metni](https://)'}
            />
            <p className="news-editor-drop-hint">Görseli sürükleyip bırakarak da ekleyebilirsin</p>
          </div>
        )}

        {showPreview && (
          <div className="news-editor-pane news-editor-pane-preview">
            {mode === 'split' && <p className="news-editor-pane-label">Önizleme</p>}
            <div className="news-editor-preview-inner">
              {value?.trim() ? (
                <NewsContent content={value} />
              ) : (
                <p className="news-editor-preview-empty">Önizleme için içerik yazmaya başla…</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="news-editor-stats">
        <span>{wordCount.toLocaleString('tr-TR')} kelime</span>
        <span>{charCount.toLocaleString('tr-TR')} karakter</span>
        <span>{headingCount} bölüm başlığı</span>
        <span className="news-editor-stat-highlight">~{readMin} dk okuma</span>
      </div>
    </div>
  );
}

export default NewsContentEditor;
