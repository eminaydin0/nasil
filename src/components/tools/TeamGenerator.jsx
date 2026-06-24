import { useState } from 'react';
import { Users, Shuffle } from 'lucide-react';
import { showError } from '../../utils/toast';
import { tool } from './toolStyles';

export default function TeamGenerator() {
  const [names, setNames] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTeams = () => {
    const nameList = names.split('\n').filter(n => n.trim().length > 0);
    
    if (nameList.length < 2) {
      showError('Lütfen en az 2 isim giriniz.');
      return;
    }

    setIsGenerating(true);
    setTeams([]);

    setTimeout(() => {
      const shuffled = [...nameList].sort(() => 0.5 - Math.random());
      const newTeams = Array.from({ length: teamCount }, () => []);
      
      shuffled.forEach((name, index) => {
        newTeams[index % teamCount].push(name.trim());
      });

      setTeams(newTeams);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label className={tool.label}>
              Oyuncu İsimleri (Her satıra bir isim)
            </label>
            <textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Ahmet&#10;Mehmet&#10;Ayşe&#10;Fatma..."
              className={tool.textarea}
            />
          </div>

          <div>
            <label className={tool.label}>
              Takım Sayısı: <span className="font-bold text-orange-600">{teamCount}</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={teamCount} 
              onChange={(e) => setTeamCount(Number(e.target.value))}
              className={tool.range}
            />
            <div className="flex justify-between text-xs text-warm-400 mt-1">
              <span>2 Takım</span>
              <span>5 Takım</span>
            </div>
          </div>

          <button
            onClick={generateTeams}
            disabled={isGenerating}
            className={tool.primaryBtn}
          >
            {isGenerating ? <Shuffle className="animate-spin" /> : <Shuffle />}
            {isGenerating ? 'Oluşturuluyor...' : 'Takımları Kur'}
          </button>
        </div>

        <div className={`${tool.panel} max-h-[420px]`}>
           {teams.length > 0 ? (
             <div className="space-y-4">
               {teams.map((team, idx) => {
                 const grad = [
                   'from-orange-500/[0.12] to-red-600/[0.08]',
                   'from-emerald-500/[0.12] to-teal-600/[0.08]',
                   'from-indigo-500/[0.12] to-purple-600/[0.08]',
                   'from-amber-500/[0.14] to-orange-600/[0.08]',
                   'from-pink-500/[0.1] to-rose-600/[0.08]',
                 ][idx % 5];
                 return (
                 <div
                   key={idx}
                   className="animate-fade-up relative overflow-hidden rounded-2xl border border-warm-200/70 bg-white p-[1px] shadow-soft"
                   style={{ animationDelay: `${idx * 90}ms` }}
                 >
                   <div className={`rounded-[calc(1rem-1px)] bg-gradient-to-br ${grad} p-4`}>
                   <div className="rounded-xl border border-white/60 bg-white/90 px-4 py-3 backdrop-blur-sm">
                   <div className="mb-3 flex items-center justify-between gap-2 border-b border-warm-200/70 pb-2">
                     <h4 className="font-display flex items-center gap-2 font-bold tracking-tight text-charcoal-900">
                       <span className="grid h-8 w-8 place-items-center rounded-xl bg-charcoal-900 text-[13px] font-black text-white">
                         {idx + 1}
                       </span>
                       Takım {idx + 1}
                     </h4>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-warm-400">
                       {team.length} kişi
                     </span>
                   </div>
                   <ul className="space-y-2.5">
                     {team.map((player, pIdx) => (
                       <li key={pIdx} className="flex items-center gap-3 text-[14px] font-semibold text-warm-800">
                         <span className="h-1.5 w-8 shrink-0 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                         <span>{player}</span>
                       </li>
                     ))}
                   </ul>
                   </div>
                   </div>
                 </div>
                 );
               })}
             </div>
           ) : (
             <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center text-warm-400">
               <Users size={52} className="animate-float text-orange-200" aria-hidden />
               <p className="max-w-[200px] text-sm font-semibold leading-relaxed">
                 İsimleri girin — takımlar saniyede hazır olur.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
