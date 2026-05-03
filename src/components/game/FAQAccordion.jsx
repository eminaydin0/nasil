import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQAccordion({ game }) {
  const faqs = Array.isArray(game?.faq) ? game.faq.filter((item) => item?.question && item?.answer) : [];
  const [openIndex, setOpenIndex] = useState(0);

  if (faqs.length === 0) return null;

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      id="sik-sorulan-sorular"
      aria-labelledby="sss-baslik"
      itemScope
      itemType="https://schema.org/FAQPage"
      className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-6 border border-warm-200/70"
    >
      <header className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-warm-glow">
          <HelpCircle size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id="sss-baslik" className="text-2xl md:text-[1.625rem] font-extrabold text-warm-900 tracking-tight leading-tight">
            Sık Sorulan Sorular
          </h2>
          <p className="text-sm text-warm-500 mt-0.5">
            <span className="font-semibold text-warm-700">{game.name}</span> hakkında en çok merak edilenler
          </p>
        </div>
      </header>

      <div className="divide-y divide-warm-100 border border-warm-200/60 rounded-2xl overflow-hidden">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div
              key={index}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className={`transition-colors duration-300 ${isOpen ? 'bg-cream-100/60' : 'bg-white'}`}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 md:py-5 text-left transition-colors focus:outline-none focus-visible:bg-cream-100/80"
                >
                  <span
                    itemProp="name"
                    className={`text-[15px] md:text-base font-bold tracking-tight transition-colors ${
                      isOpen ? 'text-warm-900' : 'text-warm-800 group-hover:text-warm-900'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-spring ${
                      isOpen ? 'bg-orange-500 text-white shadow-warm-glow rotate-180' : 'bg-cream-200 text-orange-600'
                    }`}
                  >
                    <ChevronDown size={16} aria-hidden="true" />
                  </span>
                </button>
              </h3>

              {/* Yumuşak açılma animasyonu - grid-rows trick */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-400 ease-spring ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="px-5 pb-5 md:pb-6"
                  >
                    <p
                      itemProp="text"
                      className="text-[15px] text-warm-700 leading-[1.7] whitespace-pre-line tracking-[-0.005em]"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
