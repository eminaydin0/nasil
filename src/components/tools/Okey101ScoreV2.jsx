import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Save, Award, Trash2, Users } from 'lucide-react';
import { showSuccess, showError, showInfo } from '../../utils/toast';

export default function Okey101Score() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState(['', '', '', '']);
  const [teamNames, setTeamNames] = useState(['1. Takım', '2. Takım']);
  
  // Separate history for modes
  const [individualRounds, setIndividualRounds] = useState([]);
  const [partnerRounds, setPartnerRounds] = useState([]);
  
  const [currentScores, setCurrentScores] = useState(['', '', '', '']); // For individual mode
  const [teamInputs, setTeamInputs] = useState(['', '']); // For partners mode
  const [isPartners, setIsPartners] = useState(false);
  const [partnerIdx, setPartnerIdx] = useState(2); // Default partner for Player 1 is Player 3 (index 2)
  const [gameLimit, setGameLimit] = useState(11); // Default game limit
  const [isPenaltyRound, setIsPenaltyRound] = useState(false);
  const historyRef = useRef(null);
  const winnerShownRef = useRef(false);

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
    ACMADI_PARTNERS: 404, // Eşli modda açmadı (202 * 2 = 404)
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
        showInfo('Oyun bitti! Yeni oyun başlatmak için sıfırlayın.');
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
    const newRounds = rounds.filter((_, i) => i !== index);
    setRounds(newRounds);
    showSuccess('El silindi');
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
        // If ACMADI (Açmadı) is selected in partners mode, that team gets 404 (202 * 2)
        if (value === PRESETS.ACMADI) {
            newInputs[playerIdx] = PRESETS.ACMADI_PARTNERS;
        } else {
            newInputs[playerIdx] = value;
        }
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
    setIsGameStarted(false);
    setRounds([]);
    setCurrentScores(['', '', '', '']);
    setTeamInputs(['', '']);
    setIsPenaltyRound(false);
    showInfo('Oyun sıfırlandı');
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

  // Check for winner when game finishes
  useEffect(() => {
    if (isGameFinished && rounds.length > 0 && !winnerShownRef.current) {
      winnerShownRef.current = true;
      let winnerName = '';
      if (isPartners) {
        const winnerTeamIdx = teamTotals[0] < teamTotals[1] ? 0 : 1;
        winnerName = teamNames[winnerTeamIdx] || `${winnerTeamIdx + 1}. Takım`;
      } else {
        const winnerIdx = totals.indexOf(minScore);
        winnerName = players[winnerIdx] || `Oyuncu ${winnerIdx + 1}`;
      }
      showSuccess(`🎉 Oyun bitti! Kazanan: ${winnerName}`, { duration: 5000 });
    }
    // Reset when game is reset
    if (!isGameStarted) {
      winnerShownRef.current = false;
    }
  }, [isGameFinished, rounds.length, isPartners, teamTotals, totals, minScore, teamNames, players, isGameStarted]);

  const startGame = () => {
    // Validate inputs
    if (isPartners) {
      if (teamNames[0].trim() === '' || teamNames[1].trim() === '') {
        showError('Lütfen takım isimlerini giriniz.');
        return;
      }
    } else {
      if (players.filter(p => p.trim() !== '').length < 2) {
        showError('Lütfen en az 2 oyuncu ismini giriniz.');
        return;
      }
    }
    setIsGameStarted(true);
  };

  const updatePlayerName = (idx, value) => {
    const newPlayers = [...players];
    newPlayers[idx] = value;
    setPlayers(newPlayers);
  };

  // Setup Screen
  if (!isGameStarted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 sm:p-6 md:p-8 max-w-2xl w-full my-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Oyun Ayarları</h2>
          
          {/* Game Mode Selection */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Oyun Modu</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setIsPartners(false)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  !isPartners
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                <div className="font-bold text-sm sm:text-base">Tekli</div>
                <div className="text-xs mt-1 hidden sm:block">Herkes kendi başına</div>
              </button>
              <button
                onClick={() => setIsPartners(true)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  isPartners
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                <div className="font-bold text-sm sm:text-base">Eşli</div>
                <div className="text-xs mt-1 hidden sm:block">2 takım halinde</div>
              </button>
            </div>
          </div>

          {/* Game Limit */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Kaç El Oynanacak?</label>
            <div className="flex flex-wrap gap-2">
              {[5, 7, 9, 11, 13, 15].map(limit => (
                <button
                  key={limit}
                  onClick={() => setGameLimit(limit)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    gameLimit === limit
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {limit} El
                </button>
              ))}
            </div>
          </div>

          {/* Player Names (only for individual mode) */}
          {!isPartners && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Oyuncu İsimleri (En az 2 oyuncu)
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {players.map((player, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={player}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                    placeholder={`Oyuncu ${idx + 1}`}
                    className="p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Team Names (if partners) */}
          {isPartners && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Takım İsimleri</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {teamNames.map((team, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={team}
                    onChange={(e) => {
                      const newTeams = [...teamNames];
                      newTeams[idx] = e.target.value;
                      setTeamNames(newTeams);
                    }}
                    placeholder={`${idx + 1}. Takım`}
                    className="p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full py-3 sm:py-4 bg-orange-600 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            Oyunu Başlat
          </button>
        </div>
      </div>
    );
  }

  // Get winner info
  let winnerName = '';
  let winnerScore = null;
  if (isGameFinished && rounds.length > 0) {
    if (isPartners) {
      const winnerTeamIdx = teamTotals[0] < teamTotals[1] ? 0 : 1;
      winnerName = teamNames[winnerTeamIdx] || `${winnerTeamIdx + 1}. Takım`;
      winnerScore = teamTotals[winnerTeamIdx];
    } else {
      const winnerIdx = totals.indexOf(minScore);
      winnerName = players[winnerIdx] || `Oyuncu ${winnerIdx + 1}`;
      winnerScore = totals[winnerIdx];
    }
  }

  const thInputClass =
    'w-full text-center font-bold text-sm sm:text-base md:text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-xl px-2 py-2 sm:py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 placeholder:text-gray-400';

  return (
    <div className="h-full flex flex-col min-h-0 bg-gray-50 p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
        {/* Kurulum ekranıyla aynı dil: mod + el sayısı */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-50/60 to-white shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-2 rounded-xl border-2 border-orange-500 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              {isPartners ? 'Eşli' : 'Tekli'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Kaç el?</span>
              <span className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                {gameLimit} el
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={resetGame}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 py-1.5 rounded-xl transition-colors"
            title="Oyunu sıfırla"
          >
            <RotateCcw size={16} />
            Yeni oyun
          </button>
        </div>

        {/* Winner Banner */}
        {isGameFinished && rounds.length > 0 && winnerName && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 shrink-0">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div className="text-center">
                <div className="font-bold text-base sm:text-lg">Oyun Bitti!</div>
                <div className="text-xs sm:text-sm mt-1 opacity-95">
                  Kazanan: <span className="font-bold text-base sm:text-lg">{winnerName}</span>
                  {winnerScore !== null && <span className="ml-1 sm:ml-2">({winnerScore} puan)</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablo başlığı — kurulumdaki input kutularıyla aynı köşe/border */}
        <div className="border-b border-orange-100 bg-white overflow-x-auto shrink-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>
                <th className="p-2 sm:p-3 md:p-4 w-12 sm:w-16 md:w-20 text-center font-bold text-xs sm:text-sm md:text-base text-orange-800 border-r border-orange-100 bg-orange-50/40">
                  El
                </th>
                {isPartners ? (
                  <>
                    <th className="p-2 sm:p-3 md:p-4 text-center">
                      <input
                        type="text"
                        value={teamNames[0]}
                        onChange={(e) => updateTeamName(0, e.target.value)}
                        className={thInputClass}
                        placeholder="1. Takım"
                      />
                    </th>
                    <th className="p-2 sm:p-3 md:p-4 text-center">
                      <input
                        type="text"
                        value={teamNames[1]}
                        onChange={(e) => updateTeamName(1, e.target.value)}
                        className={thInputClass}
                        placeholder="2. Takım"
                      />
                    </th>
                  </>
                ) : (
                  players.map((player, idx) => (
                    <th key={idx} className="p-2 sm:p-3 md:p-4 text-center">
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updateName(idx, e.target.value)}
                        className={thInputClass}
                        placeholder={`Oyuncu ${idx + 1}`}
                      />
                    </th>
                  ))
                )}
                <th className="p-2 sm:p-3 md:p-4 w-12 sm:w-14 md:w-16 text-center text-gray-300">
                  <span className="sr-only">İşlem</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Geçmiş */}
        <div className="flex-1 min-h-0 overflow-auto bg-gray-50">
          {rounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-gray-400 px-4 py-8">
              <p className="text-sm font-medium text-gray-500">Henüz el girilmedi</p>
              <p className="text-xs text-gray-400 mt-1 text-center">Aşağıdan puanları girip kaydedin</p>
            </div>
          ) : (
            <div ref={historyRef} className="p-2 sm:p-3 overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <tbody>
                  {rounds.map((roundData, rIdx) => {
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

                    // Calculate el number (excluding penalty rounds)
                    const elNumber = rounds.slice(0, rIdx + 1).filter(r => {
                      if (Array.isArray(r)) return true;
                      return !r.isPenalty;
                    }).length;

                    return (
                      <tr key={rIdx} className={`border-b border-orange-100/80 hover:bg-orange-50/30 transition-colors ${isPenalty ? 'bg-orange-50/50' : 'bg-white'}`}>
                        <td className="p-2 sm:p-3 md:p-4 w-12 sm:w-16 md:w-20 text-center font-semibold text-xs sm:text-sm text-gray-600 border-r border-orange-100 bg-orange-50/30">
                          {isPenalty ? <span className="text-orange-500">-</span> : <span className="text-gray-700">{elNumber}</span>}
                        </td>
                        {displayScores.map((score, sIdx) => {
                          const isZero = score === 0;
                          const isPositive = score > 0;
                          const isNegative = score < 0;
                          
                          return (
                            <td key={sIdx} className={`p-2 sm:p-3 md:p-4 text-center font-bold text-sm sm:text-base md:text-lg ${
                              isNegative ? 'text-orange-600' : 
                              isPositive ? 'text-rose-600' : 
                              'text-gray-400'
                            }`}>
                              {isZero ? <span className="text-gray-300">-</span> : score}
                            </td>
                          );
                        })}
                        <td className="p-2 sm:p-3 md:p-4 text-center">
                          <button 
                            onClick={() => deleteRound(rIdx)}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-700 sm:p-1.5"
                            title="Eli Sil"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                          </button>
                        </td>
                      </tr>
                    );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-orange-200 bg-gradient-to-r from-orange-50/80 to-white">
                  <td className="p-2 sm:p-3 md:p-4 w-12 sm:w-16 md:w-20 text-center font-bold text-xs sm:text-sm md:text-base text-orange-900 border-r border-orange-100">Toplam</td>
                  {isPartners ? (
                    <>
                      <td className="p-2 sm:p-3 md:p-4 text-center font-black text-base sm:text-lg md:text-xl text-gray-900">{teamTotals[0]}</td>
                      <td className="p-2 sm:p-3 md:p-4 text-center font-black text-base sm:text-lg md:text-xl text-gray-900">{teamTotals[1]}</td>
                    </>
                  ) : (
                    totals.map((total, idx) => (
                      <td key={idx} className="p-2 sm:p-3 md:p-4 text-center font-black text-base sm:text-lg md:text-xl text-gray-900">{total}</td>
                    ))
                  )}
                  <td className="p-2 sm:p-3 md:p-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

        {/* Alt giriş — kurulumdaki input stilleri */}
        <div className="border-t border-orange-100 bg-gradient-to-b from-white to-orange-50/30 p-2 sm:p-3 md:p-4 shrink-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <tbody>
              <tr>
                {isPartners ? (
                  <>
                    <td className="p-2 sm:p-3">
                      <input
                        type="number"
                        value={teamInputs[0]}
                        placeholder="0"
                        onChange={(e) => {
                          const newInputs = [...teamInputs];
                          newInputs[0] = e.target.value;
                          setTeamInputs(newInputs);
                        }}
                        className="w-full rounded-xl border-2 border-gray-200 p-2 text-center text-base font-bold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:p-2.5 md:p-3 sm:text-lg md:text-xl"
                      />
                      <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                        <button onClick={() => setPreset(0, PRESETS.BITTI)} className="flex-1 rounded-lg bg-orange-100 px-1.5 py-1.5 text-[10px] font-bold text-orange-800 shadow-sm transition-colors hover:bg-orange-200 sm:px-2 sm:py-2 md:px-2.5 sm:text-xs">Bitti</button>
                        <button onClick={() => setPreset(0, PRESETS.OKEY_BITTI)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm">Okey</button>
                        <button onClick={() => setPreset(0, PRESETS.ISLER)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">İşler</button>
                        <button onClick={() => setPreset(0, PRESETS.ACMADI)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors shadow-sm">Açmadı</button>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <input
                        type="number"
                        value={teamInputs[1]}
                        placeholder="0"
                        onChange={(e) => {
                          const newInputs = [...teamInputs];
                          newInputs[1] = e.target.value;
                          setTeamInputs(newInputs);
                        }}
                        className="w-full rounded-xl border-2 border-gray-200 p-2 text-center text-base font-bold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:p-2.5 md:p-3 sm:text-lg md:text-xl"
                      />
                      <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                        <button onClick={() => setPreset(1, PRESETS.BITTI)} className="flex-1 rounded-lg bg-orange-100 px-1.5 py-1.5 text-[10px] font-bold text-orange-800 shadow-sm transition-colors hover:bg-orange-200 sm:px-2 sm:py-2 md:px-2.5 sm:text-xs">Bitti</button>
                        <button onClick={() => setPreset(1, PRESETS.OKEY_BITTI)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm">Okey</button>
                        <button onClick={() => setPreset(1, PRESETS.ISLER)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">İşler</button>
                        <button onClick={() => setPreset(1, PRESETS.ACMADI)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors shadow-sm">Açmadı</button>
                      </div>
                    </td>
                  </>
                ) : (
                  currentScores.map((score, idx) => (
                    <td key={idx} className="p-2 sm:p-3">
                      <input
                        type="number"
                        value={score}
                        placeholder="0"
                        onChange={(e) => updateCurrentScore(idx, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addRound()}
                        className="w-full rounded-xl border-2 border-gray-200 p-2 text-center text-base font-bold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 sm:p-2.5 md:p-3 sm:text-lg md:text-xl"
                      />
                      <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                        <button onClick={() => setPreset(idx, PRESETS.BITTI)} className="flex-1 rounded-lg bg-orange-100 px-1.5 py-1.5 text-[10px] font-bold text-orange-800 shadow-sm transition-colors hover:bg-orange-200 sm:px-2 sm:py-2 md:px-2.5 sm:text-xs">Bitti</button>
                        <button onClick={() => setPreset(idx, PRESETS.ACMADI)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors shadow-sm">Açmadı</button>
                        <button onClick={() => setPreset(idx, PRESETS.ISLER)} className="flex-1 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">İşler</button>
                      </div>
                    </td>
                  ))
                )}
                <td className="p-2 sm:p-3">
                  <button
                    onClick={addRound}
                    className="w-full py-2 sm:py-2.5 md:py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <Save size={16} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] mx-auto" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 pb-1 sm:pb-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors hover:bg-orange-50 sm:gap-2 sm:px-4 sm:py-2">
            <input 
              type="checkbox" 
              checked={isPenaltyRound} 
              onChange={(e) => setIsPenaltyRound(e.target.checked)}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 focus:ring-orange-500 rounded"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Ceza Eli</span>
          </label>
        </div>
      </div>
      </div>
    </div>
  );
}
