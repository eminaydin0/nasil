-- =====================================================
-- Dijital Oyunlar — 15 örnek oyun (PC / Konsol / Mobil)
-- Önce add-digital-games-fields.sql çalıştırılmış olmalı.
-- Supabase SQL Editor'da bu dosyayı çalıştırın.
-- =====================================================

INSERT INTO games (
  slug, name, category, players, difficulty, image,
  short_description, description, rules, tips,
  play_time_minutes, digital_info
) VALUES

-- ═══ PC OYUNLARI (6) ═══

(
  'minecraft',
  'Minecraft',
  'PC Oyunları',
  '1-10 oyuncu (çevrimiçi)',
  'Kolay',
  'https://images.unsplash.com/photo-1538488888590-32f4750213b5?q=80&w=2070&auto=format&fit=crop',
  'Bloklardan dünyalar inşa et, keşfet ve hayatta kal. Yaratıcılığın sınırı yok!',
  'Minecraft, Mojang tarafından geliştirilen sandbox türünde bir oyun. Oyuncular voxel tabanlı bir dünyada kaynak toplar, aletler üretir, yapılar inşa eder ve geceleri canavarlarla savaşır. Survival, Creative ve Adventure modlarıyla hem tek başına hem arkadaşlarla oynanabilir.',
  '["Dünyaya spawn olduktan sonra ağaç keserek tahta topla", "Crafting menüsünden tahta tahtası ve sopadan başlayarak alet yap", "Gece olmadan barınak veya mağara bul", "Madencilik yaparak demir, altın ve elmas topla", "Fırın kurarak yemek pişir ve zırh üret", "Nether ve End boyutlarına portal açarak ilerleme sağla", "Çok oyunculu sunucularda takım kurarak inşa et ve keşfet"]'::jsonb,
  '["İlk gece barınak yapmak hayati önem taşır", "Yatağı gece atlamak için kullan (mob spawn olmaz)", "Su altında nefes almak için tavanı kapat", "Elmasları en az zırh ve kazma için sakla", "Redstone ile otomatik çiftlik kur", "Haritada koordinatları not al, kaybolma", "Creative modda pratik yap, Survival''da uygula"]'::jsonb,
  NULL,
  '{
    "platforms": ["PC (Windows)", "PC (Mac)", "PC (Linux)", "Steam"],
    "downloadUrl": "https://store.steampowered.com/app/1672970/Minecraft/",
    "downloadLabel": "Steam",
    "fileSize": "~1.5 GB (launcher + temel paket)",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core i3-3210 / AMD A8-7600",
        "ram": "4 GB",
        "gpu": "Intel HD Graphics 4000 / AMD Radeon R5",
        "storage": "1 GB boş alan",
        "notes": "Java Edition için Java Runtime gerekir"
      },
      "recommended": {
        "os": "Windows 10/11 64-bit",
        "cpu": "Intel Core i5-4690 / AMD A10-7800",
        "ram": "8 GB",
        "gpu": "NVIDIA GeForce 700 Series / AMD Radeon Rx 200",
        "storage": "4 GB SSD",
        "notes": "Shader paketleri için daha güçlü GPU önerilir"
      }
    }
  }'::jsonb
),

(
  'counter-strike-2',
  'Counter-Strike 2',
  'PC Oyunları',
  '5v5 çevrimiçi',
  'Zor',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
  'Valve''ın efsanevi taktiksel FPS oyunu. Bomba kur, imha et, takımınla zafer kazan.',
  'Counter-Strike 2, Source 2 motoruyla yeniden yapılandırılmış klasik CS deneyimidir. Terörist ve anti-terörist takımları bomba kurma/imha etme, rehin kurtarma veya eleme modlarında karşı karşıya gelir. Ekonomi yönetimi, harita bilgisi ve takım oyunu kritiktir.',
  '["Steam üzerinden ücretsiz indir ve hesap oluştur", "Ana menüden Competitive, Casual veya Deathmatch seç", "Round başında silah alışverişi yap (B tuşu)", "Terörist: bomba kur (C4) veya rehinleri koru", "CT: bombayı imha et veya tüm düşmanları ele", "Her round sonunda performansa göre para kazanırsın", "16 round kazanan takım maçı alır (Competitive)"]'::jsonb,
  '["Crosshair placement: baş hizasında nişan al", "Ekonomi roundlarını takımınla planla (eco/force buy)", "Flash ve smoke''u entry öncesi kullan", "Harita callout''larını öğren (A long, B site vb.)", "Spray pattern''i aim map''lerde çalış", "Ses ayak izlerini dinle, kulaklık şart", "Demo izleyerek hataları analiz et"]'::jsonb,
  45,
  '{
    "platforms": ["PC (Windows)", "PC (Linux)", "Steam"],
    "downloadUrl": "https://store.steampowered.com/app/730/CounterStrike_2/",
    "downloadLabel": "Steam",
    "fileSize": "~85 GB",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core i5-750 / AMD FX-6300",
        "ram": "8 GB",
        "gpu": "GTX 1060 6GB / RX 580 8GB",
        "storage": "85 GB SSD",
        "notes": "DirectX 11, geniş bant internet"
      },
      "recommended": {
        "os": "Windows 11 64-bit",
        "cpu": "Intel Core i5-11400 / Ryzen 5 3600",
        "ram": "16 GB",
        "gpu": "RTX 2060 / RX 5700 XT",
        "storage": "85 GB NVMe SSD",
        "notes": "144 Hz monitör rekabetçi oyun için ideal"
      }
    }
  }'::jsonb
),

(
  'valorant',
  'Valorant',
  'PC Oyunları',
  '5v5 çevrimiçi',
  'Zor',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop',
  'Riot Games''in taktiksel ajan tabanlı FPS oyunu. Yetenekler + nişancılık bir arada.',
  'Valorant, CS tarzı round tabanlı FPS ile MOBA yeteneklerini birleştirir. Her ajanın benzersiz yetenekleri vardır: duman, flash, iyileştirme veya teleport. Spike kurma/imha etme hedefiyle 5v5 rekabetçi maçlar oynanır.',
  '["Riot Client üzerinden ücretsiz indir", "Hesap oluştur ve eğitim atış poligonunu tamamla", "Unranked veya Competitive mod seç", "Round başında yetenek ve silah al", "Saldırı: Spike''ı site''a kur ve patlat", "Savunma: Spike''ı imha et veya saldırıyı durdur", "13 round kazanan takım maçı alır"]'::jsonb,
  '["Ajan seçimini takım kompozisyonuna göre yap", "Ekonomi yönetimi CS''e benzer — eco roundları kaçırma", "Yetenekleri entry öncesi harca, solo peek yapma", "Harita kontrolü için smoke ve molly kullan", "Crosshair ve sensitivity''yi aim lab''de ayarla", "Ulti puanını kritik roundlarda sakla", "VOD izleyerek ajan yetenek kombinasyonlarını öğren"]'::jsonb,
  40,
  '{
    "platforms": ["PC (Windows)"],
    "downloadUrl": "https://playvalorant.com/tr-tr/download/",
    "downloadLabel": "Resmi site",
    "fileSize": "~23 GB",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core 2 Duo E8400 / AMD Athlon 200GE",
        "ram": "4 GB",
        "gpu": "Intel HD 4000",
        "storage": "23 GB",
        "notes": "Vanguard anti-cheat kernel sürücüsü gerektirir"
      },
      "recommended": {
        "os": "Windows 11 64-bit",
        "cpu": "Intel i3-4150 / AMD Ryzen 3 1200",
        "ram": "8 GB",
        "gpu": "GTX 1050 Ti",
        "storage": "23 GB SSD",
        "notes": "128 tick sunucular için stabil FPS önemli"
      }
    }
  }'::jsonb
),

(
  'cyberpunk-2077',
  'Cyberpunk 2077',
  'PC Oyunları',
  'Tek oyunculu',
  'Orta',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
  'Night City''de açık dünya aksiyon-RPG. Cyberware, hikaye seçimleri ve kehanet seni bekliyor.',
  'Cyberpunk 2077, CD Projekt RED''in distopik gelecek distopyasında geçen açık dünya RPG''sidir. V adlı paralı asker olarak Night City''de görevler yapar, cyberware takar ve ana hikayede kritik seçimler verir. Phantom Liberty DLC ile genişletilmiştir.',
  '["Steam veya GOG''dan oyunu indir ve kur", "Yeni oyun başlat, yaşam yolu seç (Nomad, Corpo, Street Kid)", "Ana görevleri takip ederek hikayeyi ilerlet", "Yan görevler ve NCPD aktiviteleriyle XP ve euro kazan", "Ripperdoc''tan cyberware ve implant satın al", "Silah ve netrunning yeteneklerini geliştir", "Farklı sonlar için hikaye seçimlerine dikkat et"]'::jsonb,
  '["Erken aşamada Sandevistan veya Kerenzikov al", "Crafting ve upgrade bench''leri kullan", "Quickhack''ler stealth oynanışta çok güçlü", "Araç ve motosikletle şehirde hızlı dolaş", "Overdrive modu ile performans/ görsel denge kur", "Save scum yapmadan önemli diyalogları düşün", "Phantom Liberty DLC ayrı satın alınır"]'::jsonb,
  60,
  '{
    "platforms": ["PC (Windows)", "Steam", "GOG"],
    "downloadUrl": "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
    "downloadLabel": "Steam",
    "fileSize": "~70 GB (Phantom Liberty hariç)",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core i7-6700 / Ryzen 5 1600",
        "ram": "12 GB",
        "gpu": "GTX 1060 6GB / RX 580 8GB",
        "storage": "70 GB SSD",
        "notes": "HDD desteklenmez, SSD zorunlu"
      },
      "recommended": {
        "os": "Windows 11 64-bit",
        "cpu": "Intel Core i7-12700 / Ryzen 7 7800X3D",
        "ram": "16 GB",
        "gpu": "RTX 4070 / RX 7800 XT",
        "storage": "70 GB NVMe SSD",
        "notes": "Ray tracing Ultra için RTX 40 serisi önerilir"
      }
    }
  }'::jsonb
),

(
  'gta-v',
  'Grand Theft Auto V',
  'PC Oyunları',
  '1-30 oyuncu (GTA Online)',
  'Orta',
  'https://images.unsplash.com/photo-1493711664972-8a8e9778441b?q=80&w=2070&auto=format&fit=crop',
  'Los Santos''ta üç karakterin hikayesi ve devasa GTA Online dünyası.',
  'Grand Theft Auto V, Rockstar''ın açık dünya aksiyon-macera oyunudur. Michael, Franklin ve Trevor''ın hikayelerini tek oyunculu modda yaşarken GTA Online''da arkadaşlarınızla soygunlar, yarışlar ve serbest mod aktiviteleri yapabilirsiniz.',
  '["Rockstar Games Launcher veya Epic/Steam''den indir", "Hikaye modunda üç karakter arasında geçiş yap (karakter değiştirme)", "Görevleri haritadan veya telefondan başlat", "Araç, silah ve mülk satın al", "GTA Online''a geçerek RP sunucularına veya resmi modlara katıl", "Heist''ler ve işletmelerle para kazan", "Wanted level''ı polisten kaçarak düşür"]'::jsonb,
  '["Hikaye modunu bitirmeden Online''a geçme — spoiler yok", "Franklin''in driving ability''sini kullan", "Borsada LCN/BCE hisselerini hikayeye göre al-sat", "Online''da CEO/MC işleri pasif gelir sağlar", "Mod kullanırken sadece single-player''da kal", "SSD''ye kur — yükleme süreleri kısalır", "FiveM için ayrı client gerekir (resmi değil)"]'::jsonb,
  NULL,
  '{
    "platforms": ["PC (Windows)", "Steam", "Epic Games", "Rockstar Games Launcher"],
    "downloadUrl": "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
    "downloadLabel": "Steam",
    "fileSize": "~110 GB",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core 2 Quad Q6600 / AMD Phenom 9850",
        "ram": "4 GB",
        "gpu": "GTX 980 / GTX 1650",
        "storage": "110 GB",
        "notes": "Rockstar Social Club hesabı gerekir"
      },
      "recommended": {
        "os": "Windows 11 64-bit",
        "cpu": "Intel Core i5-3470 / AMD FX-8350",
        "ram": "8 GB",
        "gpu": "GTX 1660 / RX 590",
        "storage": "110 GB SSD",
        "notes": "GTA Online için stabil internet bağlantısı"
      }
    }
  }'::jsonb
),

(
  'elden-ring',
  'Elden Ring',
  'PC Oyunları',
  '1-4 oyuncu (co-op)',
  'Zor',
  'https://images.unsplash.com/photo-1511886929836-354d827aae26?q=80&w=2070&auto=format&fit=crop',
  'FromSoftware''in açık dünya souls-like başyapıtı. Keşfet, öğren, boss''ları yen.',
  'Elden Ring, Dark Souls yaratıcılarından açık dünya aksiyon-RPG. Lands Between''de Tarnished olarak Elden Lord olmaya çalışırsınız. Zorlu boss savaşları, gizli zindanlar ve eşsiz build çeşitliliği sunar.',
  '["Steam''den indir, yeni oyun başlat", "Sınıf seç (Vagabond yeni başlayanlar için iyi)", "Site of Grace''lerde dinlen ve haritayı aç", "Düşman pattern''lerini öğrenerek savaş", "Runes kaybedersen cesetini geri al", "Spirit Ash ve büyü build''leri dene", "Multiplayer için Furled Finger veya Tarnished''s Wiz"]'::jsonb,
  '["Mounted combat Torrent ile avantaj sağla", "Level atlamadan önce vigor ve endurance yükselt", "Summon sign bırakan NPC''lere güven", "Haritada kuzey bölgeleri erken gitme — zor", "Wiki kullanmak normal, utanma", "Co-op''ta host düşmanlar daha güçlü olur", "NG+''da build''ini test et"]'::jsonb,
  80,
  '{
    "platforms": ["PC (Windows)", "Steam"],
    "downloadUrl": "https://store.steampowered.com/app/1245620/ELDEN_RING/",
    "downloadLabel": "Steam",
    "fileSize": "~60 GB",
    "requirements": {
      "minimum": {
        "os": "Windows 10 64-bit",
        "cpu": "Intel Core i5-8400 / Ryzen 3 3300X",
        "ram": "12 GB",
        "gpu": "GTX 1060 3GB / RX 580 4GB",
        "storage": "60 GB",
        "notes": "Online için Steam hesabı"
      },
      "recommended": {
        "os": "Windows 11 64-bit",
        "cpu": "Intel Core i7-8700K / Ryzen 5 3600X",
        "ram": "16 GB",
        "gpu": "GTX 1070 8GB / RX VEGA 56",
        "storage": "60 GB SSD",
        "notes": "60 FPS için orta-yüksek ayarlar"
      }
    }
  }'::jsonb
),

-- ═══ KONSOL OYUNLARI (5) ═══

(
  'god-of-war-ragnarok',
  'God of War Ragnarök',
  'Konsol Oyunları',
  'Tek oyunculu',
  'Orta',
  'https://images.unsplash.com/photo-1486401899862-0fca89898f85?q=80&w=2070&auto=format&fit=crop',
  'Kratos ve Atreus''un Norse mitolojisi macerasının epik devamı. PS5''te sinematik aksiyon.',
  'God of War Ragnarök, Santa Monica Studio''nun aksiyon-macera oyunudur. Kratos ve oğlu Atreus, Fimbulwinter''ın ardından dokuz diyarı keşfeder, tanrılarla savaşır ve Ragnarök''ü engellemeye veya tetiklemeye çalışır.',
  '["PlayStation Store''dan indir veya disk tak", "Kayıt seç veya yeni oyun başlat", "Düşmanlara light/heavy saldırı kombinasyonları yap", "Leviathan Axe fırlat ve geri çağır", "Atreus''un ok yetenekleriyle combo kur", "Skill tree''den yetenek aç", "Yan görevler ve Niflheim zindanlarıyla loot topla"]'::jsonb,
  '["Shield parry timing''i boss savaşlarında kritik", "Runic attacks''i cooldown bitince kullan", "Upgrade bench''te zırh set bonuslarına bak", "Kratos ve Atreus skill ağaçlarını dengeli geliştir", "Accessibility ayarları zor boss''ları kolaylaştırır", "New Game+''da Zeus/Zeus zırh setleri açılır", "Photo mode ile epik anları yakala"]'::jsonb,
  50,
  '{
    "platforms": ["PlayStation 5", "PlayStation 4"],
    "downloadUrl": "https://store.playstation.com/tr-tr/concept/10002456",
    "downloadLabel": "PlayStation Store",
    "fileSize": "~90 GB (PS5)",
    "requirements": {
      "minimum": {
        "os": "PlayStation 4 (system software 9.0+)",
        "cpu": "PS4 APU (entegre)",
        "ram": "8 GB GDDR5",
        "gpu": "PS4 GPU (1.84 TFLOPS)",
        "storage": "90 GB",
        "notes": "PS4 Pro''da performans modu mevcut"
      },
      "recommended": {
        "os": "PlayStation 5 (system software 22.0+)",
        "cpu": "PS5 Zen 2 8 çekirdek",
        "ram": "16 GB GDDR6",
        "gpu": "PS5 GPU (10.28 TFLOPS)",
        "storage": "90 GB SSD",
        "notes": "DualSense haptic feedback destekli"
      }
    }
  }'::jsonb
),

(
  'ea-fc-25',
  'EA Sports FC 25',
  'Konsol Oyunları',
  '1-22 oyuncu (Ultimate Team online)',
  'Orta',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop',
  'FIFA''nın devamı: futbol simülasyonu, Ultimate Team ve kariyer modu.',
  'EA Sports FC 25, Electronic Arts''ın futbol simülasyon oyunudur. Ultimate Team, Kariyer Modu, Pro Clubs ve online maçlarla gerçekçi futbol deneyimi sunar. HyperMotion ve PlayStyles ile oyuncu hareketleri geliştirilmiştir.',
  '["PlayStation veya Xbox Store''dan indir", "Mod seç: Ultimate Team, Kariyer, Hızlı Maç", "Ultimate Team''de starter pack aç, kadro kur", "Maç öncesi taktik ve diziliş ayarla", "Pas, şut ve dribling kontrollerini öğren", "Online Division Rivals veya Weekend League oyna", "Kariyer modunda transfer ve genç yetenek geliştir"]'::jsonb,
  '["Defansif stil + yüksek pressing dengeli kullan", "Corner ve free kick''leri practice modda çalış", "Ultimate Team''de chemistry önemli — lig/ülke bonusu", "Meta formation''ları takip et (4-2-3-1 vb.)", "Goalkeeper rush timing''i kritik", "Controller deadzone ayarla", "SBC''leri coin kazanmak için değerlendir"]'::jsonb,
  20,
  '{
    "platforms": ["PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One"],
    "downloadUrl": "https://www.ea.com/tr/games/ea-sports-fc/fc-25",
    "downloadLabel": "Resmi site",
    "fileSize": "~50 GB",
    "requirements": {
      "minimum": {
        "os": "PS4 / Xbox One",
        "cpu": "Konsol APU",
        "ram": "8 GB",
        "gpu": "Konsol GPU",
        "storage": "50 GB",
        "notes": "EA Play veya EA app hesabı gerekir"
      },
      "recommended": {
        "os": "PS5 / Xbox Series X",
        "cpu": "Zen 2 / Jaguar",
        "ram": "16 GB",
        "gpu": "Ray tracing destekli",
        "storage": "50 GB SSD",
        "notes": "Online için EA Play aboneliği veya oyun satın alımı"
      }
    }
  }'::jsonb
),

(
  'the-last-of-us-part-ii',
  'The Last of Us Part II',
  'Konsol Oyunları',
  'Tek oyunculu',
  'Orta',
  'https://images.unsplash.com/photo-1493711664972-8a8e9778441b?q=80&w=2070&auto=format&fit=crop',
  'Naughty Dog''un duygusal aksiyon-macera devamı. Ellie''nin intikam yolculuğu.',
  'The Last of Us Part II, post-apokaliptik dünyada Ellie''nin intikam hikayesini anlatır. Stealth, yakın dövüş ve silahlı çatışma dengeli oynanış sunar. Güçlü anlatım ve sinematik kalite ile bilinir.',
  '["PlayStation Store''dan indir", "Zorluk seviyesi seç (Grounded en zor)", "Stealth ile düşmanları sessizce ele", "Crafting menüsünden silah, ilaç ve molotof yap", "Listen mode ile düşman konumlarını gör", "Köpek ve Shambler gibi yeni düşman tiplerine dikkat", "Hikayeyi spoiler''sız deneyimlemek için wiki''den uzak dur"]'::jsonb,
  '["Stealth her zaman savaştan avantajlı", "Upgrade bench''te silah modları aç", "Molotof ve duman bombası grubu ayır", "Accessibility ile aim assist artırılabilir", "Koleksiyon parçaları hikayeyi zenginleştirir", "New Game+''da yeni silahlar açılır", "Grounded modu permadeath — dikkatli ol"]'::jsonb,
  25,
  '{
    "platforms": ["PlayStation 5", "PlayStation 4"],
    "downloadUrl": "https://store.playstation.com/tr-tr/concept/232447",
    "downloadLabel": "PlayStation Store",
    "fileSize": "~100 GB",
    "requirements": {
      "minimum": {
        "os": "PlayStation 4 (7.55+)",
        "cpu": "PS4 APU",
        "ram": "8 GB",
        "gpu": "PS4 GPU",
        "storage": "100 GB",
        "notes": "DualShock 4 veya DualSense"
      },
      "recommended": {
        "os": "PlayStation 5",
        "cpu": "PS5 Zen 2",
        "ram": "16 GB",
        "gpu": "PS5 GPU",
        "storage": "100 GB SSD",
        "notes": "60 FPS performans modu PS5''te"
      }
    }
  }'::jsonb
),

(
  'zelda-tears-of-the-kingdom',
  'The Legend of Zelda: Tears of the Kingdom',
  'Konsol Oyunları',
  'Tek oyunculu',
  'Orta',
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2070&auto=format&fit=crop',
  'Hyrule''un gökyüzüne ve yeraltına açılan açık dünya macerası. Ultrahand ile yarat.',
  'Tears of the Kingdom, Breath of the Wild''un devamıdır. Link, parçalanmış Hyrule''da gökyüzü adaları, yeraltı ve yüzeyi keşfeder. Ultrahand, Fuse ve Ascend yetenekleri yaratıcı çözümler sunar.',
  '["Nintendo eShop''tan dijital indir veya kartuş tak", "Prologue''u tamamla, yetenekleri öğren", "Ultrahand ile nesneleri birleştir (araç, köprü)", "Fuse ile silah ve kalkan güçlendir", "Ascend ile tavanın üstüne çık", "Sky islands ve Depths''i keşfet", "Ana görevleri takip ederek 4 tapınağı tamamla"]'::jsonb,
  '["Stamina ve kalp parçalarını önceliklendir", "Zonaite madeni ile battery ve device yap", "Autobuild ile blueprint kaydet", "Hava akımlarıyla uçmak yakıt tasarrufu sağlar", "Depths karanlık — meşale ve Lightroot bul", "Shield surf hızlı seyahat için kullan", "Amiibo ile kostüm ve ok alınabilir"]'::jsonb,
  60,
  '{
    "platforms": ["Nintendo Switch"],
    "downloadUrl": "https://www.nintendo.com/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/",
    "downloadLabel": "Nintendo eShop",
    "fileSize": "~18 GB (dijital)",
    "requirements": {
      "minimum": {
        "os": "Nintendo Switch system 16.0+",
        "cpu": "NVIDIA Tegra X1",
        "ram": "4 GB",
        "gpu": "Tegra X1 GPU",
        "storage": "18 GB (microSD önerilir)",
        "notes": "OLED ve Lite modellerinde oynanabilir"
      },
      "recommended": {
        "os": "Nintendo Switch (OLED)",
        "cpu": "Tegra X1",
        "ram": "4 GB",
        "gpu": "Tegra X1 GPU",
        "storage": "128 GB microSD",
        "notes": "Switch 2 uyumluluğu resmi duyuruya bağlı"
      }
    }
  }'::jsonb
),

(
  'spider-man-2',
  'Marvel''s Spider-Man 2',
  'Konsol Oyunları',
  'Tek oyunculu',
  'Kolay',
  'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=2070&auto=format&fit=crop',
  'Peter Parker ve Miles Morales olarak New York''ta sallan. Venom dahil epik boss savaşları.',
  'Marvel''s Spider-Man 2, Insomniac Games''in PS5 exclusive süper kahraman oyunudur. İki Spider-Man arasında geçiş yaparak New York''u korursunuz. Web wings, symbiote yetenekleri ve genişletilmiş harita sunar.',
  '["PlayStation Store''dan indir", "Peter veya Miles arasında anında geçiş yap", "Main story görevlerini takip et", "Web-swing ile şehirde hızlı seyahat", "Combat: combo, dodge ve finisher kullan", "Yan görevler ve koleksiyonlar skill puanı verir", "New Game+''da yeni suit''ler açılır"]'::jsonb,
  '["Web wings momentum ile hız kazanır", "Symbiote yetenekleri crowd control için güçlü", "Gadget''ları cooldown''da kullan", "Photo ops ve research station''ları kaçırma", "Accessibility combat zorluğunu ayarlar", "DualSense adaptive trigger hissi deneyimle", "Post-game symbiote suit''i unlock et"]'::jsonb,
  30,
  '{
    "platforms": ["PlayStation 5"],
    "downloadUrl": "https://store.playstation.com/tr-tr/concept/10002659",
    "downloadLabel": "PlayStation Store",
    "fileSize": "~98 GB",
    "requirements": {
      "minimum": {
        "os": "PlayStation 5",
        "cpu": "PS5 Zen 2",
        "ram": "16 GB",
        "gpu": "PS5 GPU",
        "storage": "98 GB SSD",
        "notes": "Sadece PS5''te oynanabilir"
      },
      "recommended": {
        "os": "PlayStation 5",
        "cpu": "PS5 Zen 2",
        "ram": "16 GB",
        "gpu": "PS5 GPU (Ray tracing)",
        "storage": "98 GB NVMe",
        "notes": "4K 60 FPS veya 4K 30 RT modu"
      }
    }
  }'::jsonb
),

-- ═══ MOBİL OYUNLAR (4) ═══

(
  'pubg-mobile',
  'PUBG Mobile',
  'Mobil Oyunlar',
  '100 oyuncu battle royale',
  'Orta',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
  'Mobil battle royale klasiği. 100 kişilik adada hayatta kal, sona kalan kazanır.',
  'PUBG Mobile, Krafton''un mobil battle royale oyunudur. Uçaktan atlayarak haritada silah, zırh ve araç toplar, mavi bölge dışında kalmadan son hayatta kalan olmaya çalışırsınız.',
  '["Google Play veya App Store''dan ücretsiz indir", "Guest, Facebook veya Twitter ile giriş yap", "Classic, Arcade veya Arena modu seç", "Haritada iniş noktası işaretle ve paraşütle atla", "Binalarda loot topla (silah, mermi, zırh)", "Harita ve mini-map''i takip et, zone''a gir", "Son 1-2 kişi kalana kadar hayatta kal"]'::jsonb,
  '["Squad''da jump leader loot yoğun yerlere in", "Ses ayak izlerini dinle — kulaklık şart", "Peek and shoot köşe savaşlarında kullan", "Araç sesi uzaktan duyulur, dikkatli kullan", "Enerji içeceği + painkiller combo", "TDM modunda aim pratiği yap", "Gyrosensitivity ile recoil kontrol et"]'::jsonb,
  25,
  '{
    "platforms": ["Android", "iOS"],
    "downloadUrl": "https://play.google.com/store/apps/details?id=com.tencent.ig",
    "downloadLabel": "Google Play",
    "fileSize": "~2.5 GB",
    "requirements": {
      "minimum": {
        "os": "Android 5.1 / iOS 9.0",
        "cpu": "Snapdragon 430 / Apple A9",
        "ram": "2 GB",
        "gpu": "Adreno 505 / Mali-T720",
        "storage": "2.5 GB",
        "notes": "Düşük grafik modu eski cihazlarda"
      },
      "recommended": {
        "os": "Android 12+ / iOS 15+",
        "cpu": "Snapdragon 860 / Apple A14",
        "ram": "6 GB",
        "gpu": "Adreno 650 / Apple GPU",
        "storage": "4 GB",
        "notes": "90 FPS modu destekleyen cihazlarda"
      }
    }
  }'::jsonb
),

(
  'clash-royale',
  'Clash Royale',
  'Mobil Oyunlar',
  '1v1 / 2v2 çevrimiçi',
  'Orta',
  'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop',
  'Supercell''in gerçek zamanlı kart savaşı oyunu. Desteni kur, kuleleri yık, arena yükselt.',
  'Clash Royale, Clash of Clans evreninde geçen gerçek zamanlı strateji oyunudur. 8 kartlık desteyle rakibin kulelerini yıkmaya çalışırsınız. Elixir yönetimi ve kart sinerjisi kritiktir.',
  '["App Store veya Google Play''den indir", "Supercell ID ile hesap bağla", "Tutorial''u tamamla, starter deste al", "8 kartlık desteni oluştur (ortalama elixir 3.5-4.2)", "Maçta kartları elixir''e göre oyna", "İki veya üç kuleyi yıkarak kazan", "Sandıklardan kart ve altın toplayarak deste güçlendir"]'::jsonb,
  '["Win condition net olsun (Hog, Golem, X-Bow vb.)", "Spell''leri swarm''a karşı sakla", "Elixir advantage için düşük elixir kart ekle", "Bridge spam timing''i öğren", "Clan war ve challenges''dan kart kazan", "Overlevel kartlar düşük arenada avantaj", "Pro replays izleyerek meta desteleri kopyala"]'::jsonb,
  5,
  '{
    "platforms": ["Android", "iOS"],
    "downloadUrl": "https://play.google.com/store/apps/details?id=com.supercell.clashroyale",
    "downloadLabel": "Google Play",
    "fileSize": "~500 MB",
    "requirements": {
      "minimum": {
        "os": "Android 5.0 / iOS 11",
        "cpu": "Dual-core 1 GHz",
        "ram": "1 GB",
        "gpu": "OpenGL ES 2.0",
        "storage": "500 MB",
        "notes": "Neredeyse tüm modern telefonlarda çalışır"
      },
      "recommended": {
        "os": "Android 10+ / iOS 14+",
        "cpu": "Snapdragon 660+",
        "ram": "3 GB",
        "gpu": "Mid-range GPU",
        "storage": "1 GB",
        "notes": "Stabil internet bağlantısı gerekli"
      }
    }
  }'::jsonb
),

(
  'genshin-impact',
  'Genshin Impact',
  'Mobil Oyunlar',
  '1-4 oyuncu (co-op)',
  'Orta',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
  'Açık dünya action-RPG. Element kombinasyonları, gacha karakterler ve Teyvat keşfi.',
  'Genshin Impact, miHoYo''nun anime tarzı açık dünya RPG''sidir. Farklı elementlere sahip karakterlerle savaşır, dünyayı keşfeder ve hikaye görevlerini tamamlarsınız. Ücretsiz oynanabilir, gacha sistemi ile karakter açılır.',
  '["Resmi siteden veya mağazadan indir", "miHoYo / HoYoverse hesabı oluştur", "Prologue görevlerini tamamla", "Party''de 4 karakter, element reaksiyonları kullan", "Stamina ile domain ve boss farm yap", "Haritada teleport waypoint aç", "Co-op''ta arkadaşının dünyasına katıl (AR 16+)"]'::jsonb,
  '["Element reaksiyonlarını öğren (Vaporize, Melt vb.)", "Günlük commission''ları kaçırma — primogem", "F2P olarak event karakterlerini değerlendir", "Resin''i boşa harcama, planlı domain farm", "Wish banner''da pity sistemini bil", "Mobile''da grafik ayarını cihaza göre düşür", "Redeem code''ları resmi Twitter''dan takip et"]'::jsonb,
  NULL,
  '{
    "platforms": ["Android", "iOS", "PC (Windows)"],
    "downloadUrl": "https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact",
    "downloadLabel": "Google Play",
    "fileSize": "~30 GB (tüm ses paketleri)",
    "requirements": {
      "minimum": {
        "os": "Android 7.0 / iOS 11",
        "cpu": "Snapdragon 845 / Apple A11",
        "ram": "4 GB",
        "gpu": "Adreno 630",
        "storage": "30 GB",
        "notes": "Düşük ayarlarda eski cihazlarda oynanabilir"
      },
      "recommended": {
        "os": "Android 12+ / iOS 15+",
        "cpu": "Snapdragon 8 Gen 1 / Apple A15",
        "ram": "8 GB",
        "gpu": "Adreno 730 / Apple GPU",
        "storage": "40 GB",
        "notes": "60 FPS için flagship cihaz önerilir"
      }
    }
  }'::jsonb
),

(
  'brawl-stars',
  'Brawl Stars',
  'Mobil Oyunlar',
  '3v3 / solo showdown',
  'Kolay',
  'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2070&auto=format&fit=crop',
  'Supercell''in hızlı tempolu 3v3 arena oyunu. Brawler seç, moda göre savaş, kupa topla.',
  'Brawl Stars, kısa maçlarla oynanan mobil arena oyunudur. Her brawler''ın unique yeteneği vardır. Gem Grab, Brawl Ball, Showdown ve daha birçok mod sunar.',
  '["Google Play veya App Store''dan indir", "Supercell ID ile kayıt ol", "Tutorial brawler''ları ve kontrolleri öğretir", "Mod seç: 3v3, Solo/Duo Showdown, Special Events", "Joystick ile hareket, sağ butonla saldırı", "Super yeteneği doldur ve kullan", "Kupa kazanarak yeni brawler ve mod aç"]'::jsonb,
  '["Tank + support + damage dengeli takım kur", "Bush''larda gizlenme Showdown''da işe yarar", "Super''ı kritik anda sakla", "Map awareness — duvar arkası ve spawn", "Quest''leri tamamla, mega box kazan", "Club''a katıl, friendly maçlarda pratik yap", "Meta brawler''ları Brawl Stars wiki''den takip et"]'::jsonb,
  5,
  '{
    "platforms": ["Android", "iOS"],
    "downloadUrl": "https://play.google.com/store/apps/details?id=com.supercell.brawlstars",
    "downloadLabel": "Google Play",
    "fileSize": "~1 GB",
    "requirements": {
      "minimum": {
        "os": "Android 5.0 / iOS 11",
        "cpu": "Dual-core 1.2 GHz",
        "ram": "1 GB",
        "gpu": "OpenGL ES 2.0",
        "storage": "1 GB",
        "notes": "Çok düşük sistem gereksinimi"
      },
      "recommended": {
        "os": "Android 10+ / iOS 14+",
        "cpu": "Snapdragon 660+",
        "ram": "3 GB",
        "gpu": "Mid-range",
        "storage": "2 GB",
        "notes": "Wi-Fi veya mobil veri ile online oynanır"
      }
    }
  }'::jsonb
)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  players = EXCLUDED.players,
  difficulty = EXCLUDED.difficulty,
  image = EXCLUDED.image,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  rules = EXCLUDED.rules,
  tips = EXCLUDED.tips,
  play_time_minutes = EXCLUDED.play_time_minutes,
  digital_info = EXCLUDED.digital_info,
  updated_at = TIMEZONE('utc'::text, NOW());

-- Görüntüleme sayaçları (yeni oyunlar için)
INSERT INTO game_views (game_id, view_count)
SELECT id, floor(random() * 500 + 50)::int
FROM games
WHERE slug IN (
  'minecraft', 'counter-strike-2', 'valorant', 'cyberpunk-2077', 'gta-v', 'elden-ring',
  'god-of-war-ragnarok', 'ea-fc-25', 'the-last-of-us-part-ii', 'zelda-tears-of-the-kingdom',
  'spider-man-2', 'pubg-mobile', 'clash-royale', 'genshin-impact', 'brawl-stars'
)
ON CONFLICT (game_id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
