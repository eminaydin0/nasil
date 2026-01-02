import React from 'react';

function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
          Hakkımızda
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Nasıl Oynanır, geleneksel Türk oyunlarını ve popüler kutu oyunlarını dijital dünyada yaşatmak, 
            yeni nesillere aktarmak ve oyun severlere rehberlik etmek amacıyla kurulmuş kapsamlı bir oyun kütüphanesidir.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Amacımız, unutulmaya yüz tutmuş sokak oyunlarından, strateji dolu kart oyunlarına kadar geniş bir yelpazede 
            doğru ve anlaşılır bilgiler sunmaktır. Her oyunun kurallarını, püf noktalarını ve oynanış şekillerini 
            detaylı bir şekilde inceleyerek ziyaretçilerimize sunuyoruz.
          </p>

          <div className="border-t border-orange-100 pt-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geliştirici Hakkında</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu proje, yazılım geliştirici <span className="font-bold text-orange-600">Emin Aydın</span> tarafından tasarlanmış ve geliştirilmiştir. 
              Kullanıcı deneyimini ön planda tutan, modern ve hızlı bir web deneyimi sunmayı hedefleyen bu platform, 
              sürekli güncellenen içeriğiyle oyun severlerin hizmetindedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
