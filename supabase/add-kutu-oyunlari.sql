-- Kutu Oyunları Ekleme
-- Bu dosyayı Supabase SQL Editor'de çalıştırın

-- Popüler Kutu/Masa Oyunları
INSERT INTO games (slug, name, category, players, difficulty, image, short_description, description, rules, tips) VALUES

-- 1. Monopoly
('monopoly', 'Monopoly', 'Kutu Oyunları', '2-8 oyuncu', 'Orta', '/images/games/monopoly.jpg',
'Dünyaca ünlü emlak ve strateji oyunu. Mülk alın, ev ve otel inşa edin, zengin olun!',
'Monopoly, oyuncuların zarlar atarak tahtada ilerledikleri, mülkler satın aldıkları ve kira topladıkları klasik bir emlak oyunudur. Amaç, rakiplerinizi iflas ettirerek tek başına zengin olmaktır. Oyun, strateji, pazarlık ve şans unsurlarını bir araya getirir.',
'["Oyun 2-8 oyuncu ile oynanır", "Her oyuncu bir figür ve başlangıç parası alır", "Sırayla zar atılır ve tahtada ilerlenir", "Üzerine gelinen mülkler satın alınabilir", "Başkasının mülküne gelinirse kira ödenir", "Tüm renk grubunu toplayanlar ev/otel inşa edebilir", "START üzerinden her geçişte 200 lira alınır", "Hapse düşenler 3 tur veya para ödeyerek çıkabilir", "Son kalan oyuncu kazanır"]'::jsonb,
'["Demiryolları ve elektrik/su şirketi stratejiktir", "Turuncu ve kırmızı renkler en karlıdır", "Evleri dengeli yayın, tek mülke yığmayın", "Nakit tükenmemeye dikkat edin", "Pazarlık yapmaktan çekinmeyin", "Hapis bazen avantajdır (kira ödemezsiniz)", "Erken aşamada mülk almaya odaklanın", "Rakiplerin para durumunu takip edin"]'::jsonb),

-- 2. Tabu
('tabu', 'Tabu', 'Kutu Oyunları', '4+ oyuncu (takımlar)', 'Kolay', '/images/games/tabu.jpg',
'Kelimeyi açıklayın ama tabu kelimeleri kullanmayın! Heyecanlı kelime tahmin oyunu.',
'Tabu, oyuncuların kartlarda yazan kelimeleri takım arkadaşlarına tabu (yasak) kelimeleri kullanmadan açıklamaya çalıştığı eğlenceli bir kelime oyunudur. Zamana karşı yarışarak en fazla doğru tahmini yapan takım kazanır.',
'["2 veya daha fazla takım oluşturulur", "Takımlar sırayla kelime açıklar", "Açıklayıcı kartı alır, tabu kelimelere bakmadan açıklar", "Takım arkadaşları kelimeyi tahmin etmeye çalışır", "Tabu kelime kullanılırsa rakip takım vızıldatır ve puan kaybedilir", "Geçmek istersen kartı geç", "1 dakika içinde en fazla kelimeyi açıklayan kazanır", "Doğru tahmin = 1 puan, tabu = -1 puan"]'::jsonb,
'["El hareketleri ve mimikler kullanın", "Zıt anlamlı kelimelerle açıklayın", "Eş anlamlı kelime bulmaya çalışın", "Cümle kurun, örnekler verin", "Telaffuzlara dikkat edin", "Hızlı düşünmeyi öğrenin", "Takım oyunu önemlidir, birbirinizi anlayın", "Zor geleni geçin, zamandan kazanın"]'::jsonb),

-- 3. Activity
('activity', 'Activity', 'Kutu Oyunları', '4+ oyuncu (takımlar)', 'Kolay', '/images/games/activity.jpg',
'Anlat, çiz veya canlandır! 3 farklı yöntemle kelime açıklama oyunu.',
'Activity, Tabu''ya benzer bir kelime oyunudur ancak kelimeleri 3 farklı şekilde açıklayabilirsiniz: Anlatarak, çizerek veya pantomim yaparak. Daha dinamik ve eğlencelidir.',
'["2-4 takım halinde oynanır", "Kartlarda 3 bölüm var: Anlat, Çiz, Canlandır", "Sıra gelen takım zarı atar, hangi bölüme geleceğini öğrenir", "Anlat: Sözlü açıklama (tabu yok)", "Çiz: Tahta üzerinde çizim (yazı/sayı/sembol yok)", "Canlandır: Sessiz pantomim (ses yok)", "60 saniye içinde takım tahminde bulunur", "Doğru tahmin edilirse tahtada ilerlenir", "Bitişe ilk ulaşan takım kazanır"]'::jsonb,
'["Çizerken basit şekiller kullanın", "Canlandırmada abartılı mimikler işe yarar", "Anlatırken örnekler verin", "Takım olarak kod geliştirin", "Zor kartları stratejik kullanın", "Rakip takımları geride bırakma taktiği yapın", "Hızlı düşünün, vakit önemli", "Önceden pratik yapın"]'::jsonb),

-- 4. Jenga
('jenga', 'Jenga', 'Kutu Oyunları', '1+ oyuncu', 'Kolay', '/images/games/jenga.jpg',
'Taşları dikkatle çıkarın ve üste koyun. Kuleyi yıkan kaybeder!',
'Jenga, 54 ahşap bloğun üst üste dizilmesiyle oluşan bir kulede, oyuncuların sırayla alt ve orta katlardan blok çıkarıp en üste koydukları denge ve el becerisi oyunudur. Kuleyi deviren oyuncu kaybeder.',
'["54 blok ile 18 katlı kule kurulur (her katta 3 blok)", "Oyuncular sırayla bir blok çıkarır", "Çıkarılan blok en üste yerleştirilir", "Tek elle çıkarılmalı", "Sadece bir blok test edilebilir, çıkarılamazsa başka birine geçilir", "Kuleyi devirene kadar oyun devam eder", "Kuleyi deviren oyuncu kaybeder", "2-3 saniye bekledikten sonra sıra geçer"]'::jsonb,
'["Gevşek blokları test edin", "Orta kattaki bloklar genellikle daha kolaydır", "Yanlardan çekin, ortadan değil", "Yavaş ve sakin olun", "Masanın titremediğinden emin olun", "Üstteki blokları dik koyun", "Nefes kontrolü önemli, heyecanlanmayın", "Rakibi yanıltmak için zor görüneni çekin"]'::jsonb),

-- 5. UNO
('uno', 'UNO', 'Kutu Oyunları', '2-10 oyuncu', 'Kolay', '/images/games/uno.jpg',
'Klasik kağıt oyunu! Renkler ve sayılar eşleştir, özel kartlar kullan, UNO de!',
'UNO, oyuncuların ellerindeki kağıtları renk veya sayı eşleştirerek atma yarışında oldukları, özel eylem kartlarıyla rakipleri zorlayan hızlı tempolu bir kart oyunudır.',
'["Her oyuncuya 7 kart dağıtılır", "İlk kart açılır, ona göre oynanır", "Sırayla elinizden renk veya sayı eşleşen kart atın", "Eşleşen yoksa desteden 1 kart çekin", "Özel kartlar: +2, +4, Ters Çevir, Atla, Renk Değiştir", "Son kartınızda UNO! demeyi unutmayın", "UNO demeyi unutana 2 kart ceza", "Elindeki kartları ilk bitiren kazanır"]'::jsonb,
'["+4 ve Renk Değiştir kartlarını strateji kullanın", "Rakiplerin renklerini ezberleyin", "UNO derken hazır olun, unutmayın", "+2 üstüne +2 atılabilir (ev kuralı)", "Yüksek sayılı kartları erkenden atın", "Eylem kartlarını son sıraya bırakmayın", "2 kişilik oyunda Ters Çevir = Atla", "Hızlı oynayın, tempo avantajdır"]'::jsonb),

-- 6. Catan (Yerleşimciler)
('catan', 'Catan (Yerleşimciler)', 'Kutu Oyunları', '3-4 oyuncu', 'Zor', '/images/games/catan.jpg',
'Strateji ve ticaret oyunu. Adada yerleşimler kurun, kaynakları yönetin ve kazanın!',
'Catan Adası''nda yerleşimler kurarak puan toplama yarışında olduğunuz stratejik bir oyun. Zarlarla kaynak üretin, ticaretler yapın, yollar ve şehirler inşa edin.',
'["Başlangıç yerleşimleri kurulur", "Zarlar atılır, sayılara göre kaynaklar üretilir", "Kaynakları kullanarak yol, yerleşim, şehir inşa edin", "Oyuncular arası ticaret yapılabilir", "Geliştirme kartları satın alınabilir", "Her yerleşim 1 puan, şehir 2 puan değerinde", "En uzun yol ve en büyük ordu ekstra puan", "10 puana ilk ulaşan kazanır"]'::jsonb,
'["İyi başlangıç noktası seçin (3 kaynak kesişimi)", "Buğday ve taş çok önemli", "Ticaret yapmaktan çekinmeyin", "Limanlara erken ulaşın", "Rakipleri bloke etme taktiği", "Geliştirme kartları zafer getirebilir", "En uzun yol hedefleyin", "Haydutları stratejik kullanın"]'::jsonb),

-- 7. Ticket to Ride (Bilet İçin Yarış)
('ticket-to-ride', 'Ticket to Ride', 'Kutu Oyunları', '2-5 oyuncu', 'Orta', '/images/games/ticket-to-ride.jpg',
'Tren yolculuğu temalı strateji oyunu. Şehirleri bağlayın, biletleri tamamlayın!',
'Ticket to Ride''da oyuncular renkli tren vagonları kullanarak harita üzerindeki şehirleri birbirine bağlarlar. Hedef kartlarınızdaki şehir çiftlerini birleştirerek puan kazanırsınız.',
'["Her oyuncu başta 4 vagon kartı ve 3 hedef kartı alır", "Turda 3 seçenek: Vagon kartı çek, yol inşa et, yeni hedef kartı al", "Yol inşa etmek için aynı renkte gerekli sayıda kart atılır", "Her yol puan getirir (uzunluğa göre)", "Hedef kartlarını tamamlayın (şehirleri birleştirin)", "Oyun biten vagon kalınca son tur", "Tamamlanan hedefler +puan, tamamlanmayan -puan", "En yüksek puanlı oyuncu kazanır"]'::jsonb,
'["Uzun yolları erken alın", "Hedef kartlarınızı gizli tutun", "Kısa bağlantılarla çoklu hedef tamamlayın", "Rakiplerin rotalarını tahmin edin", "Joker (lokomotif) kartlarını iyi kullanın", "Tünellerde şansınızı deneyin", "Son tura dikkat, vagonlarınızı hesaplayın", "En uzun yol bonusu için plan yapın"]'::jsonb),

-- 8. Codenames
('codenames', 'Codenames', 'Kutu Oyunları', '4+ oyuncu (takımlar)', 'Orta', '/images/games/codenames.jpg',
'Kelimeleri ipuçlarıyla bulmaya çalışın! Casusluk temalı kelime ilişkilendirme oyunu.',
'Codenames''te iki takımın spymasterleri (liderler) tek kelime ipuçları vererek takım arkadaşlarının masadaki doğru kelimeleri bulmasını sağlamaya çalışır. Suikastçıyı seçmekten kaçının!',
'["25 kelime kartı 5x5 dizilir", "Her takımın 1 spymaster''ı vardır", "Spymaster kendi ajanlarının kelimelerini bilir", "Bir kelime ipucu + sayı verir (ör: Meyve 2)", "Takım arkadaşları kelimeleri tahmin eder", "Kırmızı/Mavi = takım ajanları, Bej = sivil, Siyah = suikastçı", "Suikastçıyı seçen takım anında kaybeder", "Tüm ajanlarını bulan takım kazanır"]'::jsonb,
'["Geniş ipuçları verin (birden fazla kelimeyi kapsayan)", "Çağrışımları önceden planlayın", "Rakip takımın kelimelerinden uzak durun", "Suikastçıdan kaçının, en tehlikeli kart", "Takım olarak kod dili geliştirin", "Risk almaktan çekinmeyin (çok kelime)", "Önceki turların ipuçlarını hatırlayın", "Zaman sınırı yoktur, düşünün"]'::jsonb),

-- 9. Dixit
('dixit', 'Dixit', 'Kutu Oyunları', '3-6 oyuncu', 'Kolay', '/images/games/dixit.jpg',
'Hayal gücü ve yaratıcılık oyunu. Karta uygun ipucu verin, oylamaları kazanın!',
'Dixit, oyuncuların soyut resimlere ipuçları verdiği ve diğer oyuncuların doğru kartı tahmin etmeye çalıştığı yaratıcı bir oyundur. Çok açık veya çok zor olmayan ipuçları vermek önemlidir.',
'["Her oyuncu 6 kart alır", "Anlatıcı bir kart seçer, ipucu verir (kelime/cümle/ses)", "Diğer oyuncular ellerinden benzer bir kart seçer", "Kartlar karıştırılır ve açılır", "Oyuncular anlatıcının kartını tahmin eder", "Herkes tahmin ederse veya kimse edemezse anlatıcı puan alamaz", "Doğru tahmin edenler ve anlatıcı puan alır", "30 puana ulaşan kazanır"]'::jsonb,
'["Çok açık ipuçları vermeyin (herkes bulur)", "Çok belirsiz ipuçları da kötü (kimse bulamaz)", "Şiirsel, metaforik düşünün", "Diğer oyuncuları tanıyın, neyi anlayacaklarını bilin", "Aldatıcı kartlar seçin (anlatıcı değilseniz)", "Yaratıcı olun, klişe ipuçları kötü", "Duygusal ipuçları çok işe yarar", "Grup dinamiğini yakalayın"]'::jsonb),

-- 10. Risk
('risk', 'Risk', 'Kutu Oyunları', '2-6 oyuncu', 'Zor', '/images/games/risk.jpg',
'Dünya hakimiyeti için strateji oyunu! Ordularınızı yönetin, kıtaları fethin!',
'Risk, oyuncuların dünya haritasında bölgeleri ele geçirmek için savaştığı klasik bir strateji oyunudur. Zar atarak savaşlar kazanın, kıtaları kontrol edin ve dünyaya hakim olun.',
'["Her oyuncu başlangıç ordularını yerleştirir", "Turda takviye asker alınır (bölge sayısına göre)", "Saldırı yapılır (komşu bölgeye zar atarak)", "Saldıran en fazla 3, savunan 2 zar atar", "En yüksek zarlar karşılaştırılır, kaybeden asker kaybeder", "Bölge fethedilirse kart alınır", "Kartlar setler yapılır, büyük takviye getirir", "Tüm dünyayı ele geçiren veya hedefi tamamlayan kazanır"]'::jsonb,
'["Avustralya ve Güney Amerika kolay savunulur", "Asya çok büyük, kontrolü zor", "Kıta bonusları büyük avantaj", "Sınırlarınızı güçlendirin", "Kartları stratejik kullanın", "Zayıf oyuncuları hedefleyin", "İttifaklar kurun ama dikkatli olun", "Uzun oyun, sabırlı olun (2-6 saat)"]'::jsonb),

-- 11. Scrabble
('scrabble', 'Scrabble', 'Kutu Oyunları', '2-4 oyuncu', 'Orta', '/images/games/scrabble.jpg',
'Kelime yapma oyunu! Harflerden yüksek puanlı kelimeler oluşturun.',
'Scrabble, oyuncuların ellerindeki harf taşlarını kullanarak tahtada çapraz kelimeler oluşturduğu klasik kelime oyunudur. Özel karelerdeki bonusları kullanarak yüksek puan hedefleyin.',
'["Her oyuncu 7 harf taşı alır", "İlk oyuncu ortadaki yıldızdan başlar", "Sırayla kelime oluşturulur (mevcut kelimelere bağlanarak)", "Her harf puan değerine sahip (A=1, K=4, Z=10)", "Renkli kareler puanı artırır (2x, 3x)", "Oluşturulan kelime Türkçe sözlükte olmalı", "7 harfi birden kullanana 50 bonus puan", "En yüksek puanlı oyuncu kazanır"]'::jsonb,
'["Yüksek puanlı harfleri (K, Z, J) 2x-3x karelerde kullanın", "7 harflik kelimeler büyük avantaj", "S harfi değerlidir, çoğul yapar", "2 kelime aynı anda oluşturun (çapraz)", "Şans faktörüne güvenmeyin, strateji yapın", "Rakibi bloke edin, 3x kareleri kapatın", "Kısa ama puanlı kelimeler (Kâr: KÂR)", "Kelime haznesi çalışın"]'::jsonb),

-- 12. Twister
('twister', 'Twister', 'Kutu Oyunları', '2-4 oyuncu', 'Kolay', '/images/games/twister.jpg',
'Acayip pozisyonlar, bol kahkaha! El ve ayakları renkli dairelere koyun.',
'Twister, oyuncuların vücutlarıyla renkli dairelerden oluşan bir mat üzerinde çeşitli pozisyonlar aldığı fiziksel bir denge oyunudır. Düşen veya yer ile temas eden oyuncu elenir.',
'["Twister mat zemine serilir", "Çark çevrilir: Sol El - Kırmızı gibi", "Oyuncu belirtilen el/ayağı o renge koyar", "Önceki pozisyonlar korunur, sadece yeni ekleniri", "Dirsek veya diz yere değerse elenirsiniz", "2 oyuncu aynı daireyi kullanabilir", "Son ayakta kalan kazanır", "3-4 oyuncu idealdir"]'::jsonb,
'["Esneklik çalışmaları yapın", "Dengeli duruşa odaklanın", "Rakipleri zorlayacak pozisyonlar alın", "Merkeze yakın durmaya çalışın", "Büyük adımlar atmayın, düşersiniz", "Nefes kontrolü önemli", "Gülerek oynamak kaybettirir, ciddiye alın", "Rahat kıyafetler giyin"]'::jsonb);

-- Kategoriye Kutu Oyunları ekle (eğer yoksa)
-- Kullanıcı arayüzünde categories array'ine "Kutu Oyunları" eklemeniz gerekebilir

-- Başarı mesajı
SELECT 'Kutu oyunları başarıyla eklendi! Toplam 12 oyun.' as message;
