import { useState } from 'react';
import { Users, Shuffle, RefreshCw } from 'lucide-react';
import { showError } from '../../utils/toast';
import { tool } from './toolStyles';

const formations = {
  5: [
    // x,y positions (percent) for 5 players from top-left origin
    {x:50,y:90,role:'GK'},
    {x:20,y:60,role:'D'},
    {x:80,y:60,role:'D'},
    {x:35,y:35,role:'M'},
    {x:65,y:35,role:'F'},
  ],
  6: [
    {x:50,y:90,role:'GK'},
    {x:18,y:70,role:'D'},
    {x:82,y:70,role:'D'},
    {x:35,y:45,role:'M'},
    {x:65,y:45,role:'M'},
    {x:50,y:25,role:'F'},
  ],
  7: [
    {x:50,y:92,role:'GK'},
    {x:12,y:72,role:'D'},
    {x:50,y:72,role:'D'},
    {x:88,y:72,role:'D'},
    {x:30,y:45,role:'M'},
    {x:70,y:45,role:'M'},
    {x:50,y:20,role:'F'},
  ]
};

function colorToTextContrast(hex) {
  if (!hex) return '#000';
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const yiq = (r*299 + g*587 + b*114)/1000;
  return yiq >= 128 ? '#000' : '#fff';
}

export default function HalisahaGenerator() {
  const [names, setNames] = useState('');
  const [format, setFormat] = useState(5);
  const [teams, setTeams] = useState([]); // [{players: [{name, role}], color} , ...]
  const [isGenerating, setIsGenerating] = useState(false);
  const [teamAColor, setTeamAColor] = useState('#f59e0b');
  const [teamBColor, setTeamBColor] = useState('#06b6d4');

  const reset = () => {
    setNames('');
    setTeams([]);
  };

  const generate = () => {
    const list = names.split('\n').map(s => s.trim()).filter(Boolean);
    const playersNeeded = format * 2;
    if (list.length < playersNeeded) {
      showError(`Lütfen en az ${playersNeeded} oyuncu giriniz (format: ${format}v${format}).`);
      return;
    }

    setIsGenerating(true);
    setTeams([]);

    setTimeout(() => {
      const shuffled = [...list].sort(() => 0.5 - Math.random());

      const teamAplayers = [];
      const teamBplayers = [];

      // assign by formation roles
      const form = formations[format];

      for (let i = 0; i < format; i++) {
        const aName = shuffled.shift();
        const bName = shuffled.shift();
        const role = form[i] ? form[i].role : 'X';
        teamAplayers.push({ name: aName, role });
        teamBplayers.push({ name: bName, role });
      }

      setTeams([
        { players: teamAplayers, color: teamAColor, label: 'Takım A' },
        { players: teamBplayers, color: teamBColor, label: 'Takım B' }
      ]);

      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label className={tool.label}>Oyuncu İsimleri (Her satıra bir isim)</label>
            <textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={`Ahmet\nMehmet\nAyşe\nFatma...`}
              className={tool.textarea}
            />
          </div>

          <div>
            <label className={tool.label}>Format</label>
            <div className="flex items-center gap-3">
              {[5, 6, 7].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-xl px-4 py-2.5 font-bold transition-all ${format === f ? tool.toggleOn : `${tool.toggleOff} bg-white`}`}
                >
                  {f}v{f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-warm-700">Takım A Forması</label>
              <input type="color" value={teamAColor} onChange={e => setTeamAColor(e.target.value)} className="w-10 h-8 p-0 border-0" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-warm-700">Takım B Forması</label>
              <input type="color" value={teamBColor} onChange={e => setTeamBColor(e.target.value)} className="w-10 h-8 p-0 border-0" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              disabled={isGenerating}
              className={`flex-1 ${tool.primaryBtn}`}
            >
              {isGenerating ? <Shuffle className="animate-spin" /> : <Shuffle />}
              {isGenerating ? 'Oluşturuluyor...' : 'Takımları Kur'}
            </button>

            <button
              onClick={reset}
              className={tool.secondaryBtn}
            >
              <RefreshCw size={18} /> Sıfırla
            </button>
          </div>
        </div>

        <div className={`${tool.panel} max-h-none`}>
          <div className="relative overflow-hidden rounded-2xl p-3 shadow-inner ring-1 ring-white/10" style={{
            height: '460px',
            background:
              'radial-gradient(ellipse 140% 100% at 50% -10%,rgba(251,146,60,0.15),transparent 55%), linear-gradient(180deg,#020617,#0f172a 8%, #14532d 22%, #16a34a 48%, #14532d 78%, #0f172a 100%)',
          }}>
            <svg viewBox="0 0 100 100" className="relative z-[1] h-full w-full block rounded-xl">
              <defs>
                <linearGradient id="turfGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fde68a" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#14532d" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" rx="4" fill="url(#turfGlow)" />
              <rect x="5" y="8" width="90" height="84" rx="2" fill="#065f46" stroke="#34d399" strokeWidth="0.15" opacity="0.95" />
              <line x1="50" y1="8" x2="50" y2="92" stroke="#fef9c3" strokeWidth="0.35" opacity="0.85" />
              <circle cx="50" cy="50" r="8" stroke="#fef08a" fill="rgba(253,224,71,0.08)" strokeWidth="0.35" />
              <rect x="5" y="36" width="10" height="28" rx="1" stroke="#d1fae5" fill="none" strokeWidth="0.4" />
              <rect x="85" y="36" width="10" height="28" rx="1" stroke="#d1fae5" fill="none" strokeWidth="0.4" />
            </svg>

            {teams.length === 2 ? (
              <>
                <div className="pointer-events-none absolute inset-4 z-[2]">
                {teams.map((team, tIdx) => (
                  <div key={tIdx}>
                    {team.players.map((p, idx) => {
                      // position for team A uses formations as-is, team B mirrored vertically
                      const pos = formations[format][idx] || {x:50,y:50};
                      const x = tIdx === 0 ? pos.x : 100 - pos.x;
                      const y = tIdx === 0 ? pos.y : 100 - pos.y;
                      const left = `calc(${x}% - 32px)`;
                      const top = `calc(${y}% - 18px)`;

                      return (
                        <div key={`${tIdx}-${idx}`} className="absolute" style={{left, top}}>
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-lg ring-2 ring-black/15 sm:text-sm sm:normal-case sm:tracking-normal" style={{background: team.color, color: colorToTextContrast(team.color)}}>
                              {p.name.split(' ')[0]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                </div>

                {/* Legend */}
                <div className="absolute left-5 bottom-5 z-[3] flex items-center gap-3 rounded-xl border border-white/20 bg-charcoal-900/85 p-2.5 backdrop-blur-sm shadow-soft-xl ring-2 ring-orange-400/20">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg ring-2 ring-white/30" style={{ background: teamAColor }} />
                    <div className="text-[11px] font-bold uppercase tracking-wide text-orange-50">Takım A</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg ring-2 ring-white/30" style={{ background: teamBColor }} />
                    <div className="text-[11px] font-bold uppercase tracking-wide text-orange-50">Takım B</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-8 text-center text-orange-50/90">
                <Users size={52} className="animate-float text-white/55" aria-hidden />
                <p className="font-semibold tracking-tight opacity-95">İsimleri girin — sahada oluşumu görün.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
