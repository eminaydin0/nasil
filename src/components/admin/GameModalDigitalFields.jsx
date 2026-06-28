import { Download, Monitor, Trash2, Plus } from 'lucide-react';
import {
  isDigitalGameCategory,
  DIGITAL_PLATFORMS,
  DOWNLOAD_STORES,
  emptyDigitalInfo,
} from '../../constants/digitalGames';

function ReqFields({ tier, tierKey, onChange }) {
  const fields = [
    { key: 'os', label: 'İşletim sistemi', placeholder: 'Windows 10 64-bit' },
    { key: 'cpu', label: 'İşlemci', placeholder: 'Intel i5-8400 / Ryzen 5 2600' },
    { key: 'ram', label: 'RAM', placeholder: '8 GB' },
    { key: 'gpu', label: 'Ekran kartı', placeholder: 'GTX 1060 3GB / RX 580' },
    { key: 'storage', label: 'Depolama', placeholder: '70 GB boş alan' },
    { key: 'notes', label: 'Not', placeholder: 'DirectX 12, internet gerekli...' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key} className={key === 'notes' ? 'sm:col-span-2' : ''}>
          <label className="mb-1 block text-xs font-bold text-gray-600">{label}</label>
          <input
            type="text"
            value={tier[key] || ''}
            onChange={(e) => onChange(tierKey, key, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>
  );
}

function GameModalDigitalFields({ category, digitalInfo, onChange }) {
  if (!isDigitalGameCategory(category)) return null;

  const info = digitalInfo || emptyDigitalInfo();
  const downloads = info.downloads || [];

  const setField = (field, value) => {
    onChange({ ...info, [field]: value });
  };

  const setReq = (tierKey, field, value) => {
    onChange({
      ...info,
      requirements: {
        ...info.requirements,
        [tierKey]: {
          ...info.requirements[tierKey],
          [field]: value,
        },
      },
    });
  };

  const togglePlatform = (platform) => {
    const set = new Set(info.platforms || []);
    if (set.has(platform)) set.delete(platform);
    else set.add(platform);
    setField('platforms', [...set]);
  };

  const toggleDownloadStore = (store) => {
    const list = [...downloads];
    const index = list.findIndex((d) => d.label === store);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push({ label: store, url: '' });
    }
    setField('downloads', list);
  };

  const updateDownload = (index, field, value) => {
    const list = downloads.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setField('downloads', list);
  };

  const removeDownload = (index) => {
    setField('downloads', downloads.filter((_, i) => i !== index));
  };

  const addCustomDownload = () => {
    setField('downloads', [...downloads, { label: 'Diğer', url: '' }]);
  };

  const isStoreSelected = (store) => downloads.some((d) => d.label === store);

  return (
    <div className="rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/40 p-4 space-y-5">
      <div className="flex items-center gap-2">
        <Monitor size={18} className="text-cyan-700" />
        <h3 className="font-bold text-gray-900">Dijital oyun bilgileri</h3>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-gray-600">Platformlar</p>
        <div className="flex flex-wrap gap-2">
          {DIGITAL_PLATFORMS.map((p) => {
            const active = (info.platforms || []).includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  active
                    ? 'bg-cyan-700 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-cyan-300'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1 text-xs font-bold text-gray-600">
          <Download size={13} />
          Nereden indirilir? (birden fazla seçebilirsin)
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {DOWNLOAD_STORES.map((store) => {
            const active = isStoreSelected(store);
            return (
              <button
                key={store}
                type="button"
                onClick={() => toggleDownloadStore(store)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                }`}
              >
                {store}
              </button>
            );
          })}
        </div>

        {downloads.length > 0 ? (
          <div className="space-y-2">
            {downloads.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:items-center">
                <div className="sm:w-40 shrink-0">
                  {DOWNLOAD_STORES.includes(item.label) ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {item.label}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateDownload(index, 'label', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Mağaza adı"
                    />
                  )}
                </div>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => updateDownload(index, 'url', e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => removeDownload(index)}
                  className="self-end rounded-lg p-2 text-red-600 hover:bg-red-50 sm:self-center"
                  title="Kaldır"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">Yukarıdan mağaza seç veya özel kaynak ekle.</p>
        )}

        <button
          type="button"
          onClick={addCustomDownload}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
        >
          <Plus size={14} />
          Özel kaynak ekle
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-gray-600">Dosya boyutu</label>
        <input
          type="text"
          value={info.fileSize || ''}
          onChange={(e) => setField('fileSize', e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="85 GB / 1.2 GB"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Minimum sistem gereksinimleri
        </p>
        <ReqFields tier={info.requirements.minimum} tierKey="minimum" onChange={setReq} />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          Önerilen sistem gereksinimleri
        </p>
        <ReqFields tier={info.requirements.recommended} tierKey="recommended" onChange={setReq} />
      </div>
    </div>
  );
}

export default GameModalDigitalFields;
