import React from "react";

const sampleScores = [
  { player: "Ali", score: 101 },
  { player: "Veli", score: 95 },
  { player: "Ayşe", score: 87 },
  { player: "Fatma", score: 80 },
];

const ScoreTable101 = () => (
  <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
    <h2 className="text-xl font-bold mb-4">101 Skor Tablosu</h2>
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Oyuncu</th>
          <th className="border px-2 py-1">Skor</th>
        </tr>
      </thead>
      <tbody>
        {sampleScores.map((row, i) => (
          <tr key={i}>
            <td className="border px-2 py-1">{row.player}</td>
            <td className="border px-2 py-1">{row.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScoreTable101;
