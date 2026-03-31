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
    <div className={tool.cardPadded}>
      <div className={tool.headerRow}>
        <div className={tool.iconWrap}>
          <Users className={tool.iconClass} />
        </div>
        <h3 className={tool.title}>Halısaha Takımı Oluşturucu</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
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
              {[5,6,7].map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2 px-3 rounded-xl font-bold transition-colors ${format===f? 'bg-orange-600 text-white shadow-sm': 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >{f}v{f}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Takım A Forması</label>
              <input type="color" value={teamAColor} onChange={e => setTeamAColor(e.target.value)} className="w-10 h-8 p-0 border-0" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Takım B Forması</label>
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

        <div className={`${tool.panel} max-h-[520px]`}>
          {/* Field + players visual */}
          <div className="relative bg-green-800 rounded-lg p-4" style={{height: '460px'}}>
            <svg viewBox="0 0 100 100" className="w-full h-full block rounded-md">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1e3a8a" stopOpacity="0.08" />
                  <stop offset="1" stopColor="#064e3b" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" rx="4" fill="#16a34a" />
              <rect x="5" y="8" width="90" height="84" rx="2" fill="#0f766e" />
              <line x1="50" y1="8" x2="50" y2="92" stroke="#d1fae5" strokeWidth="0.4" />
              <circle cx="50" cy="50" r="8" stroke="#d1fae5" fill="none" strokeWidth="0.4" />
              <rect x="5" y="36" width="10" height="28" rx="1" stroke="#d1fae5" fill="none" strokeWidth="0.4" />
              <rect x="85" y="36" width="10" height="28" rx="1" stroke="#d1fae5" fill="none" strokeWidth="0.4" />
            </svg>

            {teams.length === 2 ? (
              <>
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
                        <div key={idx} className="absolute" style={{left, top}}>
                          <div className="flex items-center gap-2">
                            <div className="rounded-md px-3 py-1 text-sm font-bold" style={{background: team.color, color: colorToTextContrast(team.color)}}>
                              {p.name.split(' ')[0]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute left-4 bottom-4 bg-white/90 rounded-lg p-2 flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm" style={{background: teamAColor}}></div>
                    <div className="text-xs font-semibold text-gray-700">Takım A</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="w-6 h-6 rounded-sm" style={{background: teamBColor}}></div>
                    <div className="text-xs font-semibold text-gray-700">Takım B</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/80 gap-2">
                <Users size={48} className="opacity-40" />
                <p className="text-sm text-center">Oyuncuları girin ve takımları oluşturun</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
