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
    <div className={tool.cardPadded}>
      <div className={tool.headerRow}>
        <div className={tool.iconWrap}>
          <Users className={tool.iconClass} />
        </div>
        <h3 className={tool.title}>Takım Oluşturucu</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
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

        <div className={`${tool.panel} max-h-[400px]`}>
           {teams.length > 0 ? (
             <div className="space-y-4">
               {teams.map((team, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${idx * 150}ms`}}>
                   <h4 className="font-bold text-orange-800 mb-2 border-b border-orange-100 pb-1">
                     {idx + 1}. Takım
                   </h4>
                   <ul className="space-y-1">
                     {team.map((player, pIdx) => (
                       <li key={pIdx} className="text-gray-700 text-sm flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                         {player}
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </div>
           ) : (
             <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 gap-2">
               <Users size={48} className="opacity-20 text-orange-300" />
               <p className="text-sm text-center">İsimleri girin ve takımları oluşturun</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
