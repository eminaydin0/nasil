import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { buildGameFaqs } from '../../lib/seoEngine';

export default function FAQAccordion({ game }) {
  const faqs = useMemo(() => buildGameFaqs(game), [game]);
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
      className="bg-white rounded-2xl border border-warm-200/80 overflow-hidden w-full"
    >
      <div className="px-4 sm:px-6 pt-5 pb-3">
        <h2 id="sss-baslik" className="text-lg sm:text-xl font-bold text-warm-900">
          Sık Sorulan Sorular
        </h2>
        <p className="text-sm text-warm-500 mt-1">
          <span className="font-medium text-warm-700">{game.name}</span> hakkında en çok merak edilenler
        </p>
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <div className="divide-y divide-warm-100 border border-warm-200/60 rounded-xl overflow-hidden">
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
                className={`transition-colors duration-200 ${isOpen ? 'bg-cream-50' : 'bg-white'}`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-left transition-colors focus:outline-none focus-visible:bg-cream-100"
                  >
                    <span
                      itemProp="name"
                      className={`text-sm sm:text-[15px] font-semibold tracking-tight transition-colors ${
                        isOpen ? 'text-warm-900' : 'text-warm-800'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
                        isOpen ? 'bg-warm-200 text-warm-800 rotate-180' : 'bg-cream-100 text-warm-600'
                      }`}
                    >
                      <ChevronDown size={16} aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
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
                      className="px-4 pb-4 sm:px-5 sm:pb-5"
                    >
                      <p
                        itemProp="text"
                        className="text-sm sm:text-[15px] text-warm-700 leading-relaxed whitespace-pre-line"
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
      </div>
    </section>
  );
}
