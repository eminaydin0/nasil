/**
 * Araç sayfası altı: nasıl kullanılır, SSS ve ilgili rehberler.
 * Başlık seoMeta.toolTitle içinden gelir; buradaki seoTitle belge başlığı değildir.
 */

export const TOOL_LANDING = {
  '101-yazboz': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      '101 masasında yazboz kâğıdı elden ele gezer, bir el yanlış işlenir, toplam tutmaz. Bu sayfa o kâğıdın yerine geçer. Oyuncu ya da takım adını yaz, el bitince ceza puanını kutuya gir. Alttaki toplam kendi kendine gelir; el geçmişi de durur, “bir önceki eli kim yazdı?” diye geri dönersin.',
      'En çok kullanılan sayılar hazır düğmede. Eli bitiren için −101, okeyle bitiş için −202. Açamayan tek oyuncuya +202, eşli oyunda açamayan çifte +404. İşler cezası +101. Düğme o sayıyı o anki kutuya yazar; masanın kendi cezası farklıysa kutuya elle de yazılır, düğme zorunlu değil.',
      'Tekli ve eşli aynı tabloda durur. Eşlide iki kişi bir satırda toplanır, ceza ortak yazılır. Sıra sende değilken de ekranı masaya çevirip göstermek yeter; kimse uygulamaya girmez. Skor telefonda kalır, sayfayı kapatınca o oturum silinir. Kalıcı hesap yok.',
      'Kazanan en düşük toplamdır. Yüksek ceza yiyen geride kalır; −101 ve −202 toplamı aşağı çeker, artı cezalar yukarı. Düşmeli okey bu tabloya uymaz: orada puandan düşülür, bitiş 2 veya 4 puandır. Onun sayacı ayrı sayfadadır.',
      'Kısayol yanlış oyuncuya gittiyse o kutuyu sil, sayıyı yeniden yaz. Diğer ellerin satırı durur. Kuralların açılış, işleme ve ceza dökümü 101 Okey rehberinde; 51’in eli daha kısadır, yazboz aynı mantıkla tutulur ama ceza cetveli o rehbere bakar.',
    ],
    steps: [
      'Oyuncu veya takım adlarını ekle.',
      'El bitince cezayı yaz ya da −101, −202, +202, +404 düğmesine bas.',
      'Toplama bak. En düşük puan öndedir.',
    ],
    related: [
      { to: '/oyun/101-okey', label: '101 Okey nasıl oynanır' },
      { to: '/oyun/51-okey', label: '51 Okey kuralları' },
      { to: '/araclar/okey-sayaci', label: 'Düşmeli okey sayacı' },
    ],
    faqs: [
      {
        question: '101 yazboz nasıl tutulur?',
        answer:
          'Her el sonunda ceza puanını kutuya yaz. Bitiren için −101, okeyle bitiş için −202 kısayolu var. Toplam otomatik iner.',
      },
      {
        question: 'Eşli 101 ile tekli aynı tabloda mı?',
        answer:
          'Evet. Aynı yazbozda tek oyuncu veya eşli takım satırı açılır. Açamama cezası tekli +202, eşli +404 olarak hazırdır.',
      },
      {
        question: 'Uygulama indirmek gerekir mi?',
        answer: 'Hayır. Sayfa tarayıcıda açılır, ücretsizdir, hesap istemez.',
      },
      {
        question: '101 okeyde kim kazanır?',
        answer: 'En düşük toplam puana inen kazanır. Eksi puan öne geçirir, artı ceza geriye atar.',
      },
    ],
  },

  'okey-sayaci': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Düşmeli okeyde herkes aynı sayıdan başlar, el bitince kaybedenlerden puan düşer, sıfırlanan çıkar. Kâğıtta “kaç kaldı” hesabı üçüncü elden sonra karışır. Sayaç başlangıç puanını tutar, sen yalnızca bu elin bitiş türünü seçersin.',
      'Önce isimleri yaz, başlangıcı ayarla. Masada 20 ile oynanıyorsa 20 kalsın; 30 veya 40’tan inen masalar kutudan değiştirir. Kazananın puanına dokunulmaz. Normal bitişte kaybedenlerden 2 düşer. Okey ya da çift ile bitişte kaybedenlerden 4 düşer. Kalan anında görünür.',
      'Sıfıra inen o partiden düşer. Eksiye zorlama yok; sayaç kalanı gösterir, masanın “sıfır olan biter” kuralı durur. Bir eli yanlış seçtiysen puanı elle düzelt, bir sonraki ele öyle devam et. 101 cezası burada yok: −101, +202, açamama bu sayfanın işi değil.',
      'Telefonu masanın ortasına koymak yeterli. Dört kişi de aynı ekrana bakar, kimse kendi notunu tutmaz. Sayfa kapanınca skor kaydolmaz; uzun bir geceyi yarıda bırakacaksan ekran görüntüsü almak sende.',
      'Sayaç eli kimin dağıtacağını bilmez, taşı da dizmez. Perişan okeyde ceza hesabı düz okeyden farklıdır; bu sayfa ikisinde de yalnızca kalan puanı düşer. Taş dizme, okey gösterme ve bitişin ne sayıldığı düz okey ile perişan okey rehberlerinde. Bir eli yanlış türe bastıysan puanı elle geri yaz, sonraki ele düzeltilmiş kalanla gir.',
    ],
    steps: [
      'İsimleri yaz, başlangıç puanını seç.',
      'El bitince normal (2) ya da okey/çift (4) de.',
      'Kalanı oku. Sıfırlanan elenir.',
    ],
    related: [
      { to: '/oyun/düz-okey', label: 'Düz Okey kuralları' },
      { to: '/oyun/perişan-okey', label: 'Perişan Okey nasıl oynanır' },
      { to: '/araclar/101-yazboz', label: '101 okey yazboz' },
    ],
    faqs: [
      {
        question: 'Okey sayacı ne işe yarar?',
        answer:
          'Düşmeli okeyde kalan puanı tutar. Normal bitişte kaybedenden 2, okey veya çift bitişte 4 puan düşer.',
      },
      {
        question: '101 okey ile aynı mı?',
        answer:
          'Hayır. Bu sayfa düşmeli okey içindir. 101 ceza yazbozu için 101 Okey Yazboz kullanılır.',
      },
      {
        question: 'Başlangıç puanını değiştirebilir miyim?',
        answer: 'Evet. 20, 30, 40 ya da masanın kendi sayısı kutudan seçilir.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda açılır, kayıt gerekmez.',
      },
    ],
  },

  'batak-yazboz': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Batak ve king masasında yazboz, alınan el ya da ceza hanesine yazılır, dört el sonra toplam zihinden tutulmaz. Bu tablo tur tur işler. İsimleri bir kez yazarsın; her elin sayısını kutuya koyup turu eklersin. Alt toplam o anda çıkar.',
      'İhaleli batakta ihale tutan ile tutmayan aynı satırda durmaz: herkesin o elde yazdığı sayı kendi kutusuna gider. Gömmeli, eşli ve ihalesiz elde de aynı. King’de koz ve el puanı masanın kendi cetveline göredir; araç o cetveli ezbere dayatmaz, senin girdiğin sayıyı toplar. Eksi ceza varsa kutuya eksi yaz.',
      'Turu eklemeden kutudaki sayı o ele işlenmez. Yanlış turu görürsen o satırdaki sayıyı düzelt, toplam yeniden iner. Gece boyu kaç el oynandığı liste halinde kalır; “bu eli kim 3 yazdı?” sorusu kaybolmaz.',
      'Kağıt kalem hâlâ masada duruyorsa bu sayfa onun kopyasıdır, kural kitabının yerine geçmez. İhale sırası, gömme ve king’in koz hesabı ilgili rehberlerde. Burada yalnızca puan tutulur.',
      'Dört kişi tek telefona bakar. Biri “ben 7 aldım” der, kutuya 7 yazılır, tur eklenir. Sonraki el boş kutularla açılır. İhaleyi kimin aldığı, kozun ne olduğu, gömmenin kaç el sayıldığı batak, ihaleli batak ve king sayfalarında ayrı ayrı yazılıdır. Yazboz o tartışmayı bitirmez, sadece yazılan sayıyı biriktirir.',
    ],
    steps: [
      'Oyuncu adlarını yaz.',
      'El bitince herkesin puanını kutuya gir.',
      'Turu ekle, alttaki toplama bak.',
    ],
    related: [
      { to: '/oyun/batak', label: 'Batak nasıl oynanır' },
      { to: '/oyun/ihaleli-batak', label: 'İhaleli Batak kuralları' },
      { to: '/oyun/king', label: 'King kuralları' },
    ],
    faqs: [
      {
        question: 'Batak yazboz nasıl tutulur?',
        answer:
          'Her elin puanını kutuya yazıp turu ekle. Toplam otomatik hesaplanır. Eksi ceza da kutuya yazılır.',
      },
      {
        question: 'King için kullanılır mı?',
        answer:
          'Evet. King, ihaleli, gömmeli ve eşli batakta tur bazlı yazboz olarak kullanılır. Puan cetvelini masa belirler.',
      },
      {
        question: 'Kaç kişi yazılır?',
        answer: 'Masadaki kadar isim eklenir. Dört kişilik batak da, eşli oturum da aynı tabloda durur.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda açılır, hesap gerekmez.',
      },
    ],
  },

  'takim-olusturucu': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Kalabalık bir oyun gecesinde “kim kimle?” sorusu isim listesi bitene kadar sürer. İsimleri alta alta yaz, kaç takım olacağını seç, dağıt. Liste karışır, kişiler takımlara olabildiğince eşit bölünür. Beğenmezsen aynı listeyle yeniden karıştırırsın; birini elle ötekine taşımak için tekrar basmak yeter, sabit kaptan yok.',
      'İki takım halı saha öncesi iş görür, üç dört takım da tabu veya vampir köylü masasını böler. Tek sayıda kişi varsa bir takım bir kişi fazla kalır; araç kimseyi dışarıda bırakmaz, fazlayı takımlardan birine koyar. Boş satır ve aynı ismin iki kez yazılması senin elinde: listeye ne yazarsan o bölünür.',
      'Sonuç ekranda durur. Gruba okumak için telefonu uzatman yeterli. Diziliş, forma rengi veya saha şeması burada yok; onları isteyen halı saha sayfasına geçer. Tek bir isim çekilecekse kura sayfası daha kısa yoludur, bütün listeyi takıma bölmez.',
      'Tabu’da anlatan ile bilen aynı takıma düşer; vampir köylüde köylü ve vampir rolü bu bölmeden sonra ayrıca çekilir. Araç rol dağıtmaz, sadece oturan kişileri ayırır. Oyunun sırası, yasak kelime ve gece oylaması ilgili rehberde kalır. İsimde yazım hatası varsa dağıtmadan düzelt; karışan liste, yazdığın harfi esas alır. Takım sayısı kişi sayısından büyükse boş takım çıkar, sayıyı düşür. Boş satır kişi sayılmaz.',
    ],
    steps: [
      'İsimleri satır satır yaz.',
      'Takım sayısını seç.',
      'Dağıt. Olmazsa yeniden karıştır.',
    ],
    related: [
      { to: '/oyun/tabu', label: 'Tabu nasıl oynanır' },
      { to: '/oyun/vampir-koylu', label: 'Vampir Köylü kuralları' },
      { to: '/araclar/halisaha-takim-olusturucu', label: 'Halı saha dizilişi' },
    ],
    faqs: [
      {
        question: 'Takımlar nasıl bölünür?',
        answer:
          'Liste karıştırılır ve seçtiğin sayıda takıma bölünür. Kişi sayısı eşit bölünmüyorsa bir takım bir kişi fazla olur.',
      },
      {
        question: 'Aynı listeyle tekrar bölünebilir mi?',
        answer: 'Evet. Yeniden karıştır aynı isimlerle yeni bir dağılım verir.',
      },
      {
        question: 'Halı saha dizilişi de kurar mı?',
        answer:
          'Hayır. Bu sayfa yalnızca isimleri böler. Sahadaki yer için Halı Saha Takım Oluşturucu var.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda çalışır, kayıt yok.',
      },
    ],
  },

  'halisaha-takim-olusturucu': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Maç saatine on kala grupta hâlâ “takımları kim yazacak” yazışması döner. İsimleri kadroya ekle, saha formatını seç. 5v5’ten 11v11’e kadar aynı sayfa. Format değişince hazır dizilişler de değişir: 5v5’te 2-1-1 ve 1-2-1, 7v7’de 3-2-1, 11v11’de 4-4-2 ile 4-3-3 gibi duran taktikler listelenir.',
      'Diziliş seçilince isimler mevkilere oturur. Biri kaleci olmasın dersen oyuncuyu sürükleyip yerini değiştirirsin. Kaptanı işaretle, forma rengini seç. İki takım yan yana durur; eksik isim varsa kadro o kişi gelene kadar boş mevkiyle kalır, araç sahaya hayali oyuncu koymaz.',
      'PNG indir, gruba at. WhatsApp’ta uzun yazı yerine tek görsel gider. Yeniden bölmek istersen isimler durur, dağılım değişir. Bu sayfa futbol kuralı anlatmaz; ofsayt, penaltı veya hakem burada yok. Yalnızca o akşamın kadrosu ve dizilişi çıkar.',
      'Sadece “ikiye böl, şema istemem” dersen takım oluşturucu daha kısa. Tek isim, örneğin formayı kim getirecek, kura sayfasında çekilir.',
      'Eksik gelen olursa adını kadrodan çıkar, diziliş kalan isimlerle yeniden oturur. Yedek kulübede yazılmaz; yedek girecekse onu da listeye ekle, formatın istediği sayı dolsun. Maç bitince aynı grup Tabu açarsa o oyunun anlatma sırası ayrı sayfadadır, bu kadro oraya taşınmaz. PNG’de görünen ad, kutuya yazdığın addır.',
    ],
    steps: [
      'Oyuncu adlarını yaz, 5v5 ile 11v11 arasında format seç.',
      'Hazır dizilişi seç veya oyuncuyu sürükle.',
      'Kaptanı ve rengi belirle, PNG indir.',
    ],
    related: [
      { to: '/araclar/takim-olusturucu', label: 'Düz takım bölme' },
      { to: '/araclar/kura-cek', label: 'Tek isim kura' },
      { to: '/oyun/tabu', label: 'Maç sonrası Tabu' },
    ],
    faqs: [
      {
        question: 'Hangi saha formatları var?',
        answer:
          '5v5, 6v6, 7v7, 8v8, 9v9, 10v10 ve 11v11. Her formatın kendi hazır dizilişi vardır.',
      },
      {
        question: 'Oyuncunun yerini değiştirebilir miyim?',
        answer: 'Evet. Diziliş seçildikten sonra isim sürüklenerek başka mevkiye alınır.',
      },
      {
        question: 'Kadroyu nasıl paylaşırım?',
        answer: 'PNG indirilir ve mesaj grubuna atılır. Hesap açılmaz.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda açılır, uygulama yok.',
      },
    ],
  },

  'karar-carki': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'İki seçenek arasında kalan masa “hadi sen seç” diye uzar. Seçenekleri tek tek yaz, çarkı çevir. Dilimlerden biri üstte kalır; o yazı o turun kararıdır. Liste sende: kim başlasın, hangi ceza, hangi kutu oyunu, çay mı kahve mi. Hazır örnek gelmez, boş çarkla açılır, ilk dilimi sen eklersin.',
      'Kısa yaz. Uzun cümle dilime sığmaz, ekranda kırpılır. Aynı seçeneği iki kez yazarsan o dilim iki kez çıkar, olasılık artar; bunu bilerek kullan, kazara tekrar etme. Bir dilimi silmek listenin o satırını silmektir, çark yeniden çizilir.',
      'Çevirme animasyonu biter bitmez sonuç yazısı durur. Beğenmezsen tekrar çevirirsin; önceki sonuç saklanmaz, tek tur geçerlidir. İsim listesinden tek kişi çekmek daha sade bir işse kura sayfası var. Zar üstü sayı lazımsa zar sayfası. Çark, üzerinde yazdığın sözcükler arasından birini seçer, sayı üretmez.',
      'Tabu’da anlatma sırası, vampir köylüde ilk konuşan, kutu oyununda başlangıç oyuncusu bu şekilde çıkar. Oyun kurallarının yerine geçmez; sıra bir kez belli olunca rehberdeki akışa dönersin.',
      'Çark durunca dilimin yazdığı sözcüğü yüksek sesle oku, itiraz “bir daha” ise yeniden çevir. Listeyi masada bir kişi tutsun; herkes kendi telefonundan ayrı çark açarsa iki farklı sonuç çıkar. Tabu’nun tur sayısı ve vampir köylünün gece gündüz sırası çarkta değil, o rehberlerde.',
    ],
    steps: [
      'Seçenekleri tek tek ekle.',
      'Çarkı çevir.',
      'Kalan dilimi uygula. Olmazsa bir daha çevir.',
    ],
    related: [
      { to: '/oyun/tabu', label: 'Tabu nasıl oynanır' },
      { to: '/oyun/vampir-koylu', label: 'Vampir Köylü kuralları' },
      { to: '/araclar/kura-cek', label: 'İsimden kura çek' },
    ],
    faqs: [
      {
        question: 'Çarka ne yazılır?',
        answer:
          'O tur karar vereceğin sözcükler: isim, ceza, oyun adı. Liste boş açılır, seçenekleri sen eklersin.',
      },
      {
        question: 'Aynı seçenek iki kez yazılırsa?',
        answer: 'O sözcük iki dilim olur, çıkma şansı artar.',
      },
      {
        question: 'Sonuç saklanır mı?',
        answer: 'Hayır. Ekranda son çevirme durur. Sayfa kapanınca liste de gider.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda çalışır, hesap yok.',
      },
    ],
  },

  'kura-cek': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Listeden bir kişi seçilecekse çark fazla gelir. İsimleri alta alta yaz, kura çek. Kutudan bir ad çıkar, ekrana basılır. Sınıfta nöbetçi, evde hesabı kim öder, oyunda kimi elemiş sayarsın: hepsi aynı düğme.',
      'Çekilen isim listede kalır. İkinci çekilişte yine çıkabilir; “çıkan bir daha çıkmasın” istiyorsan o adı sen silersin, araç kendiliğinden elemez. Boş satır çekilmez. Aynı adı iki kez yazdıysan o kişi iki kez adaydır.',
      'Takıma bölmek bu sayfanın işi değil. On kişi ikiye ayrılacaksa takım oluşturucu listeyi böler. Sözcükler arasında dönen bir seçim istiyorsan karar çarkı dilim dilim gösterir. Kura tek bir ad söyler.',
      'Tabu ekibinin ilk anlatıcısı, vampir köylüde ortaya konan ilk isim bu şekilde belirlenir. Çekiliş bitince oyunun kendi sırası rehberdeki gibi yürür. Sonuç paylaşılacaksa ekranı göster; dosya inmez, hesap açılmaz.',
      'Üç kişi “ben çekmeyeyim” derse o adları çekilişten önce sil. Kalan listeyle çek. Çıkan kişi itiraz ederse yeni çekiliş yeni bir addır, eskisi iptal sayılır, bunu masa söyler. Araç itirazı hatırlamaz. İsimler bitişik yazılırsa tek satır sayılır; her kişi kendi satırında durmalı. Çekilişten önce listeyi sesli okumak, eksik adı ortaya çıkarır. Çıkan ad ekranda kalır, yenisi onun üstüne yazar. Liste kendiliğinden kısalmaz.',
    ],
    steps: [
      'İsimleri satır satır ekle.',
      'Kura çek.',
      'Çıkan adı uygula. Tekrarı istemezsen o adı sil.',
    ],
    related: [
      { to: '/oyun/tabu', label: 'Tabu nasıl oynanır' },
      { to: '/oyun/vampir-koylu', label: 'Vampir Köylü kuralları' },
      { to: '/araclar/takim-olusturucu', label: 'Takıma böl' },
    ],
    faqs: [
      {
        question: 'Çekilen isim listeden düşer mi?',
        answer: 'Hayır. Yeniden çıkabilsin diye listede kalır. Düşmesini istiyorsan adı sen silersin.',
      },
      {
        question: 'Kaç isim yazılır?',
        answer: 'Listeye sığan kadar. İki kişi de olur, bütün sınıf da.',
      },
      {
        question: 'Takım da kurar mı?',
        answer: 'Hayır. Tek ad çeker. Takım bölmek için Takım Oluşturucu var.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda açılır, kayıt gerekmez.',
      },
    ],
  },

  'zar-at': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Tavla pulu durur, zar kaybolur. Tek zar veya çift zar seç, at. Üst yüz ekranda kalır; çift zarda iki sayı ayrı ayrı ve toplamı birlikte görünür. Animasyon bitmeden sonucu sayma, durunca oku.',
      'Kaç atış oldu diye tutmak için geçmiş altta birikir. Tavla’da kapı, mars hesabı burada yapılmaz; araç yalnızca zarı döndürür. Monopoly’de gittiğin kare, Jenga’da “kim çeker” sırası senin işin. Zar 1 ile 6 arasındadır, hileli yüz yok.',
      'Üçüncü bir zar eklenmez. Masa üç zar istiyorsa aynı sayfadan bir atış daha yapılır, geçmişten toplanır. “Kim başlasın” için yüksek atan başlar kuralını masa koyar; sayfa yüksek olanı ilan etmez, sayıları gösterir.',
      'Karar sözcükler arasındaysa çark, tek isimse kura daha uygun. Zar, üstünde sayı olan oyunlar içindir. Telefonu masaya koy, herkes aynı atışı görsün.',
      'Tavla’da kapı açmak, pul kırmak ve mars saymak rehberdeki hesaptır; burası sadece 1–6 üretir. Monopoly’de çift atınca bir tur daha oynamak da oyunun kuralıdır, sayfa seni otomatik ilerletmez. İki zarı okur, kareyi sen sayarsın. Yüksek atan başlasın denirse sayıları yan yana koyun, kararı masa verir. Aynı sayı gelirse bir kez daha atın; sayfa beraberliği bozmaz. Geçmişteki atış silinmez. Yeni atış listenin başına gelir. Eski atış durur.',
    ],
    steps: [
      'Tek zar veya çift zar seç.',
      'At.',
      'Üst yüzü oku. Gerekirse geçmişe bak.',
    ],
    related: [
      { to: '/oyun/tavla', label: 'Tavla nasıl oynanır' },
      { to: '/oyun/monopoly', label: 'Monopoly kuralları' },
      { to: '/araclar/karar-carki', label: 'Sözcük seçmek için çark' },
    ],
    faqs: [
      {
        question: 'Çift zar atılır mı?',
        answer: 'Evet. Tek zar veya çift zar seçilir. Çiftte iki sayı ve toplamı görünür.',
      },
      {
        question: 'Sonuçlar durur mu?',
        answer: 'O sayfa açıkken geçmiş altta kalır. Sayfa kapanınca silinir.',
      },
      {
        question: 'Tavla puanı da hesaplar mı?',
        answer: 'Hayır. Yalnızca zarı atar. Kapı ve mars tavla rehberindeki hesaptır.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda çalışır, hesap yok.',
      },
    ],
  },

  'skor-tablosu': {
    h2: 'Nasıl kullanılır?',
    paragraphs: [
      'Her oyunun yazbozu ayrı kural ister. El puanı, ceza, artı eksi karışık bir gece varsa nötr bir tablo yeter. İsim ekle, tur bitince puanı artır veya azalt. Sıralama o anda yeniden dizilir; en yüksek üstte durur. Düşük puanın kazandığı oyunda sıralamayı ters okursun, tablo “kazanan bu” diye ilan etmez.',
      '101 cezası, batak ihalesi, okeyde 2 ve 4 puan burada hazır düğme değildir. Onlar kendi sayfalarında. Bu tablo, kuralı masa koyduğu oyunlar içindir: UNO eli, Jenga dışı bir sayma, evdeki “on puana kim varır”. Sayıyı sen yazarsın.',
      'Yanlış basılan puan aynı kutudan geri alınır. Oyuncu eklemek oyunun ortasında da olur; yeni isim sıfırdan girer, eski turlar ona yazılmaz. Gece bitince ekran görüntüsü dışında kayıt yok.',
      'Hangi sayının ne anlama geldiği oyunun rehberinde. Tablo yalnızca tutar. 101 veya batak oynuyorsan o yazboza geç, yoksa ceza kısayolları burada aranır da bulunmaz.',
      'UNO’da eli bitiren ile kartı elde kalanın puanı bu tabloya elle yazılır. Kart değerini sayfa bilmez; rehberdeki puana bakıp kutuya o sayıyı girersin. Gece birden fazla oyun değişirse isimler kalsın, puanları sıfırla, yeni oyunun cetveline geç. Eksik bir turu sonradan eklemek, o sayıyı ilgili kişinin kutusuna yazmaktır. Sıralama her yazışta yeniden dizilir.',
    ],
    steps: [
      'Oyuncu adlarını ekle.',
      'Tur bitince puanı artır veya azalt.',
      'Sıralamayı üstten oku.',
    ],
    related: [
      { to: '/oyun/uno', label: 'UNO nasıl oynanır' },
      { to: '/araclar/101-yazboz', label: '101 ceza yazbozu' },
      { to: '/araclar/batak-yazboz', label: 'Batak tur yazbozu' },
    ],
    faqs: [
      {
        question: 'Hangi oyunlarda kullanılır?',
        answer:
          'Puanı masanın kendisinin saydığı oyunlarda. 101, düşmeli okey ve batak için ayrı yazboz var.',
      },
      {
        question: 'Düşük puan kazanıyorsa?',
        answer: 'Tablo yüksek puanı üste alır. Düşük puanın kazandığı oyunda listenin altına bak.',
      },
      {
        question: 'Skor kaydolur mu?',
        answer: 'Hayır. Sayfa açıkken durur. Kapanınca gider.',
      },
      {
        question: 'Ücretsiz mi?',
        answer: 'Evet. Tarayıcıda açılır, kayıt gerekmez.',
      },
    ],
  },
};

export const TOOLS_HUB_FAQS = [
  {
    question: 'Kuralı Ne? oyun araçları ücretsiz mi?',
    answer:
      'Evet. Yazboz, sayaç, takım, çark, kura, zar ve skor tablosu tarayıcıda açılır. Hesap gerekmez.',
  },
  {
    question: '101 yazboz ile okey sayacı aynı mı?',
    answer:
      'Hayır. 101 yazboz ceza puanı tutar. Okey sayacı düşmeli okeyde kalan puanı düşer.',
  },
  {
    question: 'Halı saha kadrosu paylaşılır mı?',
    answer: 'Evet. Diziliş PNG olarak inder, mesaj grubuna atılır.',
  },
  {
    question: 'Uygulama indirmek gerekir mi?',
    answer: 'Hayır. Araçlar bu sitede, telefon veya bilgisayar tarayıcısında çalışır.',
  },
];
