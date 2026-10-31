import { Sparkles } from 'lucide-react';

const PROMPTS = [
  'Okey nasıl oynanır?',
  '4 kişilik ev oyunu öner',
  'Pişti ile batak farkı ne?',
];

function openKurAli(prompt) {
  window.dispatchEvent(new CustomEvent('kurali:open', { detail: prompt ? { prompt } : {} }));
}

function HomeKurAli() {
  return (
    <section className="home-block" aria-labelledby="home-kurali-title">
      <div className="home-kurali">
      <div>
        <p className="home-kicker">KurAli</p>
        <h2 id="home-kurali-title">Kuralı sor, hemen cevaplasın</h2>
        <p>Okey, batak, “ne oynayalım?” — yaz, adım adım anlatsın.</p>
        <button type="button" className="home-kurali-open" onClick={() => openKurAli()}>
          <Sparkles size={16} aria-hidden />
          KurAli’yi aç
        </button>
      </div>
      <div className="home-kurali-prompts">
        {PROMPTS.map((prompt) => (
          <button key={prompt} type="button" onClick={() => openKurAli(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      </div>
    </section>
  );
}

export default HomeKurAli;
