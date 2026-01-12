import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Plus, Save, Award, Trash2, Users, Settings, Check } from 'lucide-react';

export default function Okey101Score() {
  const [players, setPlayers] = useState(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4']);
  const [teamNames, setTeamNames] = useState(['1. Takım', '2. Takım']);
  
  // Separate history for modes
  const [individualRounds, setIndividualRounds] = useState([]);
  const [partnerRounds, setPartnerRounds] = useState([]);
  
  const [currentScores, setCurrentScores] = useState(['', '', '', '']); // For individual mode
  const [teamInputs, setTeamInputs] = useState(['', '']); // For partners mode
  const [isPartners, setIsPartners] = useState(false);
  const [partnerIdx, setPartnerIdx] = useState(2); // Default partner for Player 1 is Player 3 (index 2)
  const [gameLimit, setGameLimit] = useState(11); // Default game limit
  const [showSettings, setShowSettings] = useState(false);
  const [isPenaltyRound, setIsPenaltyRound] = useState(false);
  const historyRef = useRef(null);

  // Derived state for current mode
  const rounds = isPartners ? partnerRounds : individualRounds;
  const setRounds = (newRounds) => {
    if (isPartners) setPartnerRounds(newRounds);
    else setIndividualRounds(newRounds);
  };

  // Auto-scroll to bottom of history when round added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [rounds]);

  const PRESETS = {
    BITTI: -101,
    OKEY_BITTI: -202,
    ACMADI: 202,
    CEZA: 101,
    ISLER: 101,
  };

  const getTeamsIndices = () => {
    const team1 = [0, partnerIdx];
    const team2 = [1, 2, 3].filter(i => i !== partnerIdx);
    return [team1, team2];
  };

  const getTeamIndex = (pIdx) => {
    const [t1] = getTeamsIndices();
    return t1.includes(pIdx) ? 0 : 1;
  };

  const addRound = () => {
    const playedRounds = rounds.filter(r => !r.isPenalty).length;
    
    // Only check limit if it's NOT a penalty round
    if (!isPenaltyRound && playedRounds >= gameLimit) {
        alert('Oyun bitti! Yeni oyun başlatmak için sıfırlayın.');
        return;
    }
    
    if (isPartners) {
        if (teamInputs.every(v => v === '')) return;
        
        const [t1, t2] = getTeamsIndices();
        const roundValues = [0, 0, 0, 0];

        // Store team scores on the first player of each team
        if (teamInputs[0] !== '') {
            roundValues[t1[0]] = parseInt(teamInputs[0], 10) || 0;
            // t1[1] (partner) remains 0
        }
        if (teamInputs[1] !== '') {
             roundValues[t2[0]] = parseInt(teamInputs[1], 10) || 0;
             // t2[1] (partner) remains 0
        }

        setRounds([...rounds, { scores: roundValues, isPenalty: isPenaltyRound }]);
        setTeamInputs(['', '']);
    } else {
        if (currentScores.every(v => v === '')) return;
        
        const roundValues = currentScores.map(val => {
            if (val === '') return 0;
            return parseInt(val, 10) || 0; 
        });

        setRounds([...rounds, { scores: roundValues, isPenalty: isPenaltyRound }]);
        setCurrentScores(['', '', '', '']); 
    }
    setIsPenaltyRound(false); // Reset checkbox after save
  };

  const deleteRound = (index) => {
    if (window.confirm('Bu eli silmek istediğinize emin misiniz?')) {
      const newRounds = rounds.filter((_, i) => i !== index);
      setRounds(newRounds);
    }
  };

  const updateCurrentScore = (idx, value) => {
    const newScores = [...currentScores];
    newScores[idx] = value;
    setCurrentScores(newScores);
  };

  const setPreset = (playerIdx, value) => {
    // If ISLER preset is used, automatically mark as penalty round
    if (value === PRESETS.ISLER) {
        setIsPenaltyRound(true);
    } else if (value === PRESETS.BITTI || value === PRESETS.OKEY_BITTI) {
        // If someone finishes, it's definitely a normal round
        setIsPenaltyRound(false);
    }

    if (isPartners) {
        // playerIdx will be 0 or 1 representing Team 1 or Team 2 index
        const newInputs = [...teamInputs];
        newInputs[playerIdx] = value;
        setTeamInputs(newInputs);
    } else {
      updateCurrentScore(playerIdx, value);
    }
  };

  const updateName = (idx, value) => {
    const newPlayers = [...players];
    newPlayers[idx] = value;
    setPlayers(newPlayers);
  };

  const updateTeamName = (idx, value) => {
    const newTeams = [...teamNames];
    newTeams[idx] = value;
    setTeamNames(newTeams);
  };

  const resetGame = () => {
    if (window.confirm('Yeni oyun başlatmak istediğinize emin misiniz? Tüm skorlar silinecek.')) {
      setRounds([]);
      setCurrentScores(['', '', '', '']);
      setTeamInputs(['', '']);
      setIsPenaltyRound(false);
    }
  };

  const calculateTotals = () => {
    const individualTotals = players.map((_, pIdx) => {
      return rounds.reduce((sum, round) => {
          // Handle both legacy (array) and new (object) format for backward compatibility
          const scores = Array.isArray(round) ? round : round.scores;
          return sum + (scores[pIdx] || 0);
      }, 0);
    });

    if (isPartners) {
      const [t1, t2] = getTeamsIndices();
      const team1Total = individualTotals[t1[0]] + individualTotals[t1[1]];
      const team2Total = individualTotals[t2[0]] + individualTotals[t2[1]];
      return { individual: individualTotals, teams: [team1Total, team2Total] };
    }
    
    return { individual: individualTotals };
  };

  const { individual: totals, teams: teamTotals } = calculateTotals();
  
  // Determine winner score
  let minScore;
  if (isPartners) {
    minScore = Math.min(...teamTotals);
  } else {
    minScore = Math.min(...totals);
  }

  const getDisplayOrder = () => {
    // In Partners mode, we don't return 4 indices, we handle rendering separately
    // But keeping this compatible with non-partner mode
    if (!isPartners) return [0, 1, 2, 3];
    return []; 
  };

  const displayOrder = getDisplayOrder();

  // Pre-calculate winner status for display
  const getWinnerStatus = (idx) => {
    if (rounds.length === 0) return false;
    if (isPartners) {
      // Check if this player belongs to the winning team
      const teamIdx = getTeamIndex(idx);
      return teamTotals[teamIdx] === minScore;
    }
    return totals[idx] === minScore;
  };

  // Calculate played rounds (excluding penalties)
  const playedRoundsCount = rounds.filter(r => {
      // Handle legacy (array) - assume not penalty
      if (Array.isArray(r)) return true;
      // New format
      return !r.isPenalty;
  }).length;

  const isGameFinished = gameLimit > 0 && playedRoundsCount >= gameLimit;

  return (
    <div className="bg-slate-50 rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      {/* Top Navigation & Settings Bar */}
      <div className="bg-white border-b border-gray-100 p-3 shadow-sm z-10">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 text-sm">
                    101
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 text-base leading-tight">101 Yazboz</h3>
                   <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                      <span>Puan Tablosu</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${playedRoundsCount >= gameLimit ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {playedRoundsCount}/{gameLimit} El
                      </span>
                   </div>
                </div>
            </div>
            
            <div className="flex gap-1">
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-all active:scale-95 ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    title="Ayarlar"
                >
                    <Settings size={18} />
                </button>
                <button 
                    onClick={resetGame}
                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all active:scale-95"
                    title="Sıfırla"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
             <div className="bg-white rounded-xl p-3 mb-3 animate-in fade-in slide-in-from-top-2 border border-indigo-100 shadow-lg shadow-indigo-500/5 absolute top-16 left-4 right-4 z-50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Oyun Bitiş El Sayısı:</span>
                    <div className="flex flex-wrap gap-1 justify-end bg-gray-50 rounded-lg p-1">
                        {[5, 7, 9, 11, 13, 15].map(limit => (
                            <button
                                key={limit}
                                onClick={() => setGameLimit(limit)}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                                    gameLimit === limit 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                {limit}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Game Mode Toggle */}
        <div className="bg-gray-100 p-1 rounded-xl flex relative mb-2">
             <div 
               className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isPartners ? 'left-[calc(50%+2px)]' : 'left-1'}`}
             />
             <button 
               onClick={() => setIsPartners(false)}
               className={`flex-1 flex items-center justify-center gap-2 py-1.5 relative z-10 text-xs font-bold transition-colors ${!isPartners ? 'text-gray-900' : 'text-gray-500'}`}
             >
               <Users size={14} />
               Tekli
             </button>
             <button 
               onClick={() => setIsPartners(true)}
               className={`flex-1 flex items-center justify-center gap-2 py-1.5 relative z-10 text-xs font-bold transition-colors ${isPartners ? 'text-gray-900' : 'text-gray-500'}`}
             >
               <Users size={14} className="fill-current opacity-50" />
               Eşli
             </button>
        </div>

        {/* Score Cards Area */}
        {isPartners ? (
             /* PARTNERS Score Cards */
             <div className="grid grid-cols-2 gap-3 mt-2">
               {[0, 1].map((teamIdx) => {
                 const isTeamWinner = teamTotals[teamIdx] === minScore && rounds.length > 0;
                 const members = getTeamsIndices()[teamIdx];
                 const isTeam1 = teamIdx === 0;
                 
                 return (
                   <div key={teamIdx} className={`relative p-3 rounded-2xl border transition-all duration-300 group overflow-hidden ${
                       isTeamWinner 
                       ? 'bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' 
                       : 'bg-white border-gray-100 shadow-sm'
                   }`}>
                     {/* Glossy Effect */}
                     {isTeamWinner && <div className="absolute inset-0 bg-white/10 opacity-50 skew-x-12 -translate-x-full group-hover:animate-shimmer" />}
                     
                     {/* Team Name Header */}
                     <div className="mb-2 relative z-10">
                         <input 
                            type="text"
                            value={teamNames[teamIdx]}
                            onChange={(e) => updateTeamName(teamIdx, e.target.value)}
                            className={`w-full bg-transparent text-sm font-black uppercase tracking-wide mb-0.5 focus:outline-none focus:underline decoration-2 underline-offset-4 ${isTeamWinner ? 'text-white/90 placeholder:text-white/50 decoration-white/50' : isTeam1 ? 'text-indigo-600 decoration-indigo-200' : 'text-purple-600 decoration-purple-200'}`}
                            placeholder={`${teamIdx + 1}. TAKIM`}
                         />
                         {/* Player Names */}
                         <div className="flex flex-col">
                             {members.map(mIdx => (
                                 <input
                                    key={mIdx}
                                    type="text"
                                    value={players[mIdx]}
                                    onChange={(e) => updateName(mIdx, e.target.value)}
                                    className={`w-full bg-transparent text-[10px] font-bold focus:outline-none border-l-2 border-transparent pl-1 -ml-1 ${isTeamWinner ? 'text-indigo-100 focus:text-white' : 'text-gray-400 focus:text-gray-600 focus:border-gray-200'}`}
                                 />
                             ))}
                         </div>
                     </div>

                     <div className={`text-4xl font-black tracking-tighter text-right relative z-10 ${
                         isTeamWinner ? 'text-white' 
                         : teamTotals[teamIdx] > 0 ? 'text-rose-500' 
                         : 'text-gray-800'
                     }`}>
                       {teamTotals[teamIdx]}
                     </div>
                   </div>
                 );
               })}
             </div>
        ) : (
            /* INDIVIDUAL Score Cards */
            <div className="grid grid-cols-4 gap-2 mt-2">
            {[0, 1, 2, 3].map((idx) => {
                const player = players[idx];
                const isWinner = getWinnerStatus(idx);
                
                return (
                <div key={idx} className={`relative flex flex-col p-2 rounded-xl border transition-all duration-300 ${
                    isWinner 
                    ? 'bg-linear-to-b from-emerald-500 to-teal-600 border-transparent shadow-lg shadow-emerald-200/50 scale-105 z-10' 
                    : 'bg-white border-gray-100'
                }`}>
                    <input
                        type="text"
                        value={player}
                        onChange={(e) => updateName(idx, e.target.value)}
                        className={`w-full text-center bg-transparent text-[10px] font-bold mb-1 focus:outline-none pb-1 ${isWinner ? 'text-emerald-50 border-emerald-400' : 'text-gray-500 focus:text-black border-transparent focus:border-gray-200 border-b'}`}
                    />
                    <div className={`text-center text-xl font-black tracking-tight ${isWinner ? 'text-white' : totals[idx] > 0 ? 'text-rose-500' : 'text-gray-800'}`}>
                    {totals[idx]}
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>

      {/* History List */}
      <div className="flex-1 bg-slate-50 flex flex-col min-h-0 relative">
        {rounds.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 opacity-60">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
              <Plus size={32} className="text-gray-200" />
            </div>
            <p className="text-sm font-bold text-gray-600">Henüz el girilmedi</p>
          </div>
        ) : (
          <div className="flex flex-col h-full"> 
             {/* Sticky Header for History */}
             <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-gray-200 px-3 py-2 shadow-xs">
                {isPartners ? (
                    <div className="grid grid-cols-[1fr_1fr_24px] gap-3">
                        <div className="text-center font-black text-[9px] uppercase tracking-wider text-indigo-600 bg-indigo-50/50 py-1 rounded border border-indigo-100/50">{teamNames[0]}</div>
                        <div className="text-center font-black text-[9px] uppercase tracking-wider text-purple-600 bg-purple-50/50 py-1 rounded border border-purple-100/50">{teamNames[1]}</div>
                        <div></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_24px] gap-2">
                    {[0, 1, 2, 3].map((p, i) => (
                        <div key={i} className="text-center font-bold text-[9px] uppercase tracking-wider text-gray-500 truncate bg-white py-1 rounded border border-gray-100">
                            {players[i]}
                        </div>
                    ))}
                    <div></div>
                    </div>
                )}
             </div>

             <div ref={historyRef} className="overflow-y-auto px-3 py-2 space-y-1 flex-1">
                {rounds.map((roundData, rIdx) => {
                    // Normalize data structure
                    const isLegacy = Array.isArray(roundData);
                    const roundScores = isLegacy ? roundData : roundData.scores;
                    const isPenalty = !isLegacy && roundData.isPenalty;

                    let displayScores = [];
                    if (isPartners) {
                        const [t1, t2] = getTeamsIndices();
                        const s1 = (roundScores[t1[0]] || 0) + (roundScores[t1[1]] || 0);
                        const s2 = (roundScores[t2[0]] || 0) + (roundScores[t2[1]] || 0);
                        displayScores = [s1, s2];
                    } else {
                        displayScores = roundScores; 
                    }

                    return (
                    <div key={rIdx} className={`group flex items-center bg-white border rounded-lg p-1 transition-all ${isPenalty ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200/60'}`}>
                        <div className={`flex-1 grid gap-2 relative ${isPartners ? 'grid-cols-2 gap-3' : 'grid-cols-4'}`}>
                        {isPenalty && (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full pr-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" title="Ceza"></div>
                            </div>
                        )}
                        {displayScores.map((score, sIdx) => {
                            const isZero = score === 0;
                            const isPositive = score > 0;
                            const isNegative = score < 0;
                            
                            return (
                                <div key={sIdx} className={`text-center font-bold text-sm py-1 rounded-md ${
                                    isNegative ? 'text-emerald-600 bg-emerald-50/30' : 
                                    isPositive ? 'text-rose-500 bg-rose-50/30' : 
                                    'text-gray-300'
                                }`}>
                                {isZero ? '-' : score}
                                </div>
                            );
                        })}
                        </div>
                        <button 
                        onClick={() => deleteRound(rIdx)}
                        className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Eli Sil"
                        >
                        <Trash2 size={12} />
                        </button>
                    </div>
                    );
                })}
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-2 pb-3 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] z-20">
        
        {isPartners ? (
            /* PARTNERS INPUT (2 Columns) */
            <div className="grid grid-cols-2 gap-3 mb-3">
                {[0, 1].map((teamId) => (
                    <div key={teamId} className="flex flex-col gap-2">
                         {/* Team Indicator - Replaced with color line */}
                        <div className={`h-1 w-8 rounded-full mx-auto ${teamId === 0 ? 'bg-indigo-400' : 'bg-purple-400'}`}></div>
                        
                        <input
                            type="number"
                            value={teamInputs[teamId]}
                            placeholder="0"
                            onChange={(e) => {
                                const newInputs = [...teamInputs];
                                newInputs[teamId] = e.target.value;
                                setTeamInputs(newInputs);
                            }}
                            className={`w-full h-12 text-center font-black text-2xl rounded-xl border-2 transition-all outline-none shadow-sm focus:-translate-y-0.5 ${
                                Number(teamInputs[teamId]) < 0 ? 'text-emerald-600 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30' : 
                                Number(teamInputs[teamId]) > 0 ? 'text-rose-600 border-rose-100 focus:border-rose-400 bg-rose-50/30' : 
                                'text-gray-900 border-gray-100 focus:border-indigo-400 bg-gray-50 focus:bg-white'
                            }`}
                        />
                         {/* Quick Actions for Team - Cleaner Grid */}
                        <div className="grid grid-cols-2 gap-1.5">
                             {/* Bitti Group */}
                            <button onClick={() => setPreset(teamId, PRESETS.BITTI)} className="py-2 text-[10px] font-extrabold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors shadow-xs active:scale-95">Bitti</button>
                            <button onClick={() => setPreset(teamId, PRESETS.OKEY_BITTI)} className="py-2 text-[10px] font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors shadow-xs shadow-emerald-200 active:scale-95">Okeyli</button>
                            
                            {/* Penalties */}
                            <button onClick={() => setPreset(teamId, PRESETS.ISLER)} className="col-span-2 py-2 text-[10px] font-extrabold bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 active:scale-95">İşler</button>
                            
                            {/* Full Width */}
                            <button onClick={() => setPreset(teamId, PRESETS.ACMADI)} className="col-span-2 py-2 text-[10px] font-extrabold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg transition-colors shadow-sm active:scale-95">Açmadı</button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             /* INDIVIDUAL INPUT (4 Columns) */
            <div className="grid grid-cols-4 gap-2 mb-3">
            {displayOrder.map((idx) => {
                const score = currentScores[idx];
                return (
                <div key={idx} className="flex flex-col gap-1.5 relative">
                    <div className="text-center font-bold text-[10px] text-gray-400 truncate px-1">
                        {players[idx]}
                    </div>
                    
                    <input
                        type="number"
                        value={score}
                        placeholder="0"
                        onChange={(e) => updateCurrentScore(idx, e.target.value)}
                        className={`w-full h-11 text-center font-black text-xl rounded-lg border-2 transition-all outline-none shadow-sm focus:-translate-y-0.5 ${
                            Number(score) < 0 ? 'text-emerald-600 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30' : 
                            Number(score) > 0 ? 'text-rose-600 border-rose-100 focus:border-rose-400 bg-rose-50/30' : 
                            'text-gray-900 border-gray-100 focus:border-indigo-400 bg-gray-50 focus:bg-white'
                        }`}
                    />

                    {/* Compact Quick Actions for Individual (Since 4 cols is tight) */}
                    <div className="flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-1">
                             <button onClick={() => setPreset(idx, PRESETS.BITTI)} className="h-8 text-[9px] font-extrabold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg active:scale-95">Bitti</button>
                             <button onClick={() => setPreset(idx, PRESETS.OKEY_BITTI)} className="h-8 text-[9px] font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg active:scale-95">Okey</button>
                        </div>
                        <button onClick={() => setPreset(idx, PRESETS.ISLER)} className="h-8 text-[9px] font-extrabold bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg border border-orange-100 active:scale-95">İşler</button>
                        <button onClick={() => setPreset(idx, PRESETS.ACMADI)} className="h-8 w-full text-[9px] font-extrabold bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg active:scale-95">Açmadı</button>
                    </div>
                </div>
                );
            })}
            </div>
        )}

        <div className="flex items-center justify-between mb-2 px-1">
             <label className="flex items-center gap-2 cursor-pointer group select-none bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isPenaltyRound ? 'bg-orange-500 border-orange-600' : 'bg-white border-gray-300'}`}>
                    {isPenaltyRound && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <input 
                    type="checkbox" 
                    checked={isPenaltyRound} 
                    onChange={(e) => setIsPenaltyRound(e.target.checked)}
                    className="hidden"
                />
                <span className={`text-[10px] font-bold transition-colors ${isPenaltyRound ? 'text-orange-600' : 'text-gray-500'}`}>
                    Ceza Eli (Sayacı Etkilemez)
                </span>
             </label>

             {gameLimit > 0 && !isPenaltyRound && (
                <div className="text-[10px] font-black tracking-wide text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-100">
                    {playedRoundsCount + 1}. / {gameLimit} EL
                </div>
             )}
        </div>

        <button
          onClick={addRound}
          className={`w-full py-3.5 rounded-xl font-black text-base shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-safe ${
              isPenaltyRound 
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200' 
              : 'bg-gray-900 hover:bg-black text-white shadow-gray-300'
          }`}
        >
          <Save size={18} className="opacity-80" />
          {isPenaltyRound ? 'CEZAYI KAYDET' : 'KAYDET'}
        </button>
      </div>
    </div>
  );
}
