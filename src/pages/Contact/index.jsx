import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
          İletişim
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
            <p className="text-gray-600 mb-8">
              Önerileriniz, sorularınız veya işbirliği talepleriniz için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">E-posta</h3>
                  <a href="mailto:eminaydinyazilim@gmail.com" className="text-gray-600 hover:text-orange-600 transition-colors">
                    eminaydinyazilim@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Telefon</h3>
                  <a href="tel:5538827646" className="text-gray-600 hover:text-orange-600 transition-colors">
                    0553 882 76 46
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Konum</h3>
                  <p className="text-gray-600">
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                <input 
                  type="text" 
                  id="name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                <input 
                  type="email" 
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                <textarea 
                  id="message"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-linear-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
