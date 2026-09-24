/**
 * Araç landing SEO kopyası — title/FAQ/bölümler tek kaynak.
 * Sayfalar ToolSeoArticle ile render eder.
 */

export const TOOL_LANDING = {
  'okey-sayaci': {
    seoTitle: 'Okey Sayacı Online — Düşmeli Okey Puan Hesaplama',
    seoDescription:
      'Okey sayacı online: düşmeli okeyde ceza puanını otomatik düşün. Ücretsiz, kayıtsız, mobil — kağıt kalem bırak.',
    h2: 'Okey Sayacı Online — Düşmeli Okey Puan Hesaplama',
    intro:
      'Düşmeli okey oynarken “kaç kaldı?” tartışmasını bitirin. Bu okey puan sayacı başlangıç puanından ceza düşer; normal bitiş ve okey/çift bitiş için hazır düğmeler sunar. Ücretsiz, kayıt yok, telefonda da açılır.',
    bullets: [
      'Başlangıç puanını sen seç (20 / 30 / 40…)',
      'Normal bitişte kaybedenden 2, okey/çiftte 4 puan düş',
      'Anlık kalan puan — kazanan net',
      'Uygulama indirme yok',
    ],
    steps: [
      'Oyuncu isimlerini ekleyin ve başlangıç puanını ayarlayın.',
      'El bitince normal veya okey/çift bitişi seçin.',
      'Kalan puanları kontrol edin; sıfırlanan elenir.',
    ],
    related: [
      { to: '/oyun/duz-okey', label: 'Düz Okey kuralları' },
      { to: '/araclar/101-yazboz', label: '101 okey yazboz' },
      { to: '/araclar', label: 'Tüm oyun araçları' },
    ],
    faqs: [
      {
        question: 'Okey sayacı ne işe yarar?',
        answer:
          'Düşmeli okeyde her oyuncunun kalan puanını tutar. Ceza puanları otomatik düşülür; kağıt kalem gerekmez.',
      },
      {
        question: '101 okey ile aynı mı?',
        answer:
          'Hayır. Bu araç düşmeli okey içindir. 101 okey ceza yazbozu için 101 Yazboz sayfasını kullanın.',
      },
      {
        question: 'Okey sayacı ücretsiz mi?',
        answer: 'Evet. Kayıt ve indirme olmadan tarayıcıda ücretsiz kullanılır.',
      },
    ],
  },

  'batak-yazboz': {
    seoTitle: 'Batak Yazboz Online — İhaleli Batak & King Puan Tablosu',
    seoDescription:
      'Batak yazboz online: ihaleli batak, eşli batak ve king için dijital puan tablosu. Otomatik toplam, ücretsiz, mobil.',
    h2: 'Batak Yazboz Online — İhaleli Batak & King',
    intro:
      'Batak veya king masasında puantajı dijitale taşıyın. Her elin puanını girin, tur ekleyin; alt toplam otomatik gelsin. İhaleli batak, gömmeli batak ve king için uygundur.',
    bullets: [
      'Tur bazlı giriş + otomatik toplam',
      'İhaleli / eşli batak ve king uyumlu',
      'El geçmişi takip',
      'Kayıtsız ve ücretsiz',
    ],
    steps: [
      'Oyuncu isimlerini yazın.',
      'El bitince puanları girip turu ekleyin.',
      'Toplamı ve sıralamayı anlık görün.',
    ],
    related: [
      { to: '/oyun/batak', label: 'Batak kuralı ne?' },
      { to: '/araclar/101-yazboz', label: '101 okey yazboz' },
      { to: '/araclar/skor-tablosu', label: 'Genel skor tablosu' },
    ],
    faqs: [
      {
        question: 'Batak yazboz nasıl tutulur?',
        answer:
          'Her el sonunda alınan el veya ceza puanını kutuya girip turu ekleyin. Araç toplamı otomatik hesaplar.',
      },
      {
        question: 'King için de kullanılır mı?',
        answer: 'Evet. King ve batak varyasyonlarında tur bazlı yazboz olarak kullanılabilir.',
      },
      {
        question: 'Batak yazboz ücretsiz mi?',
        answer: 'Evet — kayıt yok, uygulama yok, mobil uyumlu.',
      },
    ],
  },

  'takim-olusturucu': {
    seoTitle: 'Takım Oluşturucu Online — Rastgele Adil Kura',
    seoDescription:
      'Takım oluşturucu: isimleri yaz, takım sayısını seç, rastgele böl. Halı saha ve oyun gecesi için ücretsiz online kura.',
    h2: 'Takım Oluşturucu — Rastgele ve Adil Kura',
    intro:
      'Arkadaş grubunu saniyeler içinde adil takımlara bölün. İsimleri yapıştırın, kaç takım olacağını seçin; rastgele dağıtım hazır. Halı saha, voleybol, sınıf etkinliği veya oyun gecesi için ideal.',
    bullets: [
      'Rastgele adil dağıtım',
      'İstediğin takım sayısı',
      'Yeniden karıştır',
      'Kayıt / indirme yok',
    ],
    steps: [
      'İsimleri satır satır ekleyin.',
      'Takım sayısını seçin.',
      'Oluştur’a basın; beğenmezseniz yeniden karıştırın.',
    ],
    related: [
      { to: '/araclar/halisaha-takim-olusturucu', label: 'Halı saha diziliş oluşturucu' },
      { to: '/araclar/kura-cek', label: 'Tek isim kura çek' },
      { to: '/araclar', label: 'Tüm araçlar' },
    ],
    faqs: [
      {
        question: 'Takım oluşturucu nasıl çalışır?',
        answer:
          'İsim listesini karıştırıp seçtiğiniz sayıda takıma dengeli böler. Sonuç rastgeledir; tekrar üretebilirsiniz.',
      },
      {
        question: 'Halı saha için mi?',
        answer:
          'Evet, sık kullanılır. Sahada diziliş de istiyorsanız Halı Saha Takım Oluşturucu’yu deneyin.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet, tamamen ücretsiz ve kayıtsız.',
      },
    ],
  },

  'zar-at': {
    seoTitle: 'Online Zar At — Tek ve Çift Zar (Ücretsiz)',
    seoDescription:
      'Online zar at: tek veya çift zar, animasyonlu sonuç. Tavla ve masa oyunları için ücretsiz dijital zar — kayıt yok.',
    h2: 'Online Zar At — Tek & Çift Zar',
    intro:
      'Zar kaybolduysa veya yanınızda yoksa online zar atın. Tek zar veya çift zar seçin; sonucu geçmişte görün. Tavla, kutu oyunları ve “kim başlasın?” kararları için pratik.',
    bullets: ['Tek / çift zar', 'Sonuç geçmişi', 'Mobil uyumlu', 'Ücretsiz'],
    steps: ['Zar sayısını seçin.', 'At’a basın.', 'Sonucu okuyun veya geçmişten kontrol edin.'],
    related: [
      { to: '/araclar/karar-carki', label: 'Karar çarkı' },
      { to: '/araclar/kura-cek', label: 'Kura çek' },
      { to: '/araclar', label: 'Tüm araçlar' },
    ],
    faqs: [
      {
        question: 'Online zar adil mi?',
        answer: 'Tarayıcı rastgeleliği kullanılır; eğlence ve masa oyunları için uygundur.',
      },
      {
        question: 'Çift zar atabilir miyim?',
        answer: 'Evet, tek veya çift zar seçenekleri vardır.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet, kayıt olmadan kullanırsınız.',
      },
    ],
  },

  'skor-tablosu': {
    seoTitle: 'Skor Tablosu Online — Dijital Puan Tutucu',
    seoDescription:
      'Skor tablosu online: oyuncu ekle, puan güncelle, sıralama otomatik. Her oyun için ücretsiz dijital puan tutucu.',
    h2: 'Skor Tablosu Online — Her Oyuna Uygun',
    intro:
      'Oyun gecesinde evrensel bir puan tutucu lazımsa bu skor tablosu işini görür. Oyuncu ekleyin, puanları artırın/azaltın; sıralama otomatik güncellenir. Yazboz kadar özel kural gerekmeyen oyunlar için ideal.',
    bullets: ['Sınırsız oyuncu (pratik kullanım)', 'Anlık sıralama', 'Mobil uyumlu', 'Kayıtsız'],
    steps: [
      'Oyuncu isimlerini ekleyin.',
      'Her turda puanları güncelleyin.',
      'Sıralamayı tablodan takip edin.',
    ],
    related: [
      { to: '/araclar/101-yazboz', label: '101 yazboz' },
      { to: '/araclar/batak-yazboz', label: 'Batak yazboz' },
      { to: '/araclar', label: 'Tüm araçlar' },
    ],
    faqs: [
      {
        question: 'Hangi oyunlarda kullanılır?',
        answer:
          'Puan tutulan hemen her masa / kutu oyununda. Özel 101 veya batak kuralları için ilgili yazbozları tercih edin.',
      },
      {
        question: 'Skor tablosu ücretsiz mi?',
        answer: 'Evet, tamamen ücretsiz.',
      },
    ],
  },

  'karar-carki': {
    seoTitle: 'Karar Çarkı Online — Şans Çarkı Çevir',
    seoDescription:
      'Karar çarkı online: seçenekleri yaz, çarkı çevir. Kura, ceza ve “kim başlasın?” için ücretsiz şans çarkı.',
    h2: 'Karar Çarkı — Online Şans Çarkı',
    intro:
      'Seçenekleri yazın, çarkı çevirin. Oyun gecelerinde kimin başlayacağı, ceza seçimi veya rastgele kararlar için eğlenceli ve hızlı bir araç.',
    bullets: ['Özel seçenek listesi', 'Animasyonlu çevirme', 'Mobil uyumlu', 'Ücretsiz'],
    steps: ['Seçenekleri ekleyin.', 'Çarkı çevirin.', 'Sonucu uygulayın.'],
    related: [
      { to: '/araclar/kura-cek', label: 'Kura çekme' },
      { to: '/araclar/zar-at', label: 'Zar at' },
      { to: '/araclar', label: 'Tüm araçlar' },
    ],
    faqs: [
      {
        question: 'Karar çarkı ne için kullanılır?',
        answer: 'Rastgele seçim, kura, ceza ve eğlence kararları için.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet, kayıtsız ve ücretsiz.',
      },
    ],
  },

  'kura-cek': {
    seoTitle: 'Kura Çek Online — Rastgele İsim Çekilişi',
    seoDescription:
      'Kura çek online: isimleri yaz, rastgele kazananı seç. Sınıf, etkinlik ve oyun gecesi için ücretsiz çekiliş aracı.',
    h2: 'Kura Çek — Online İsim Çekilişi',
    intro:
      'Listeden tek kazanan (veya sırayla isimler) çekmek için online kura. Sınıf temsilcisi, hediye çekilişi, “kim ödesin?” gibi anlık kararlarda işe yarar.',
    bullets: ['İsim listesi', 'Rastgele çekiliş', 'Hızlı ve kayıtsız', 'Mobil'],
    steps: ['İsimleri ekleyin.', 'Kura çek’e basın.', 'Kazananı görün.'],
    related: [
      { to: '/araclar/takim-olusturucu', label: 'Takım oluşturucu' },
      { to: '/araclar/karar-carki', label: 'Karar çarkı' },
      { to: '/araclar', label: 'Tüm araçlar' },
    ],
    faqs: [
      {
        question: 'Online kura nasıl çekilir?',
        answer: 'İsimleri listeye yazıp kura butonuna basın; rastgele bir isim seçilir.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet.',
      },
    ],
  },
};

export const TOOLS_HUB_FAQS = [
  {
    question: 'Kuralı Ne? oyun araçları ücretsiz mi?',
    answer:
      'Evet. 101 yazboz, okey sayacı, batak yazboz, halı saha takım oluşturucu, zar, kura ve skor tablosu dahil tüm araçlar ücretsizdir; kayıt gerektirmez.',
  },
  {
    question: '101 yazboz online nerede?',
    answer:
      '101 Okey Yazboz sayfasında: tarayıcıda açılır, -101/-202 kısayolları ve otomatik toplam vardır.',
  },
  {
    question: 'Halı saha takım oluşturucu var mı?',
    answer:
      'Evet. 5v5’ten 11v11’e diziliş kurup PNG indirebileceğiniz Halı Saha Takım Oluşturucu aracı mevcuttur.',
  },
  {
    question: 'Uygulama indirmek gerekir mi?',
    answer:
      'Hayır. Tüm araçlar web üzerinden çalışır; telefon veya bilgisayarda linki açmanız yeterlidir.',
  },
];
