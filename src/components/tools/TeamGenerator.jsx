import { useState } from 'react';
import { Users, Shuffle, UserPlus, X } from 'lucide-react';

export default function TeamGenerator() {
  const [names, setNames] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTeams = () => {
    const nameList = names.split('\n').filter(n => n.trim().length > 0);
    
    if (nameList.length < 2) {
      alert('Lütfen en az 2 isim giriniz.');
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
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <Users className="text-green-600 w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Takım Oluşturucu</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oyuncu İsimleri (Her satıra bir isim)
            </label>
            <textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Ahmet&#10;Mehmet&#10;Ayşe&#10;Fatma..."
              className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Takım Sayısı: <span className="font-bold text-green-600">{teamCount}</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={teamCount} 
              onChange={(e) => setTeamCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2 Takım</span>
              <span>5 Takım</span>
            </div>
          </div>

          <button
            onClick={generateTeams}
            disabled={isGenerating}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <Shuffle className="animate-spin" /> : <Shuffle />}
            {isGenerating ? 'Oluşturuluyor...' : 'Takımları Kur'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 overflow-y-auto max-h-[400px]">
           {teams.length > 0 ? (
             <div className="space-y-4">
               {teams.map((team, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${idx * 150}ms`}}>
                   <h4 className="font-bold text-green-700 mb-2 border-b border-gray-100 pb-1">
                     {idx + 1}. Takım
                   </h4>
                   <ul className="space-y-1">
                     {team.map((player, pIdx) => (
                       <li key={pIdx} className="text-gray-700 text-sm flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                         {player}
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
               <Users size={48} className="opacity-20" />
               <p className="text-sm text-center">İsimleri girin ve takımları oluşturun</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
