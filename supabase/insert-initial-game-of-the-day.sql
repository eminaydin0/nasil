-- Rastgele bir oyunu "Günün Oyunu" olarak seç
INSERT INTO daily_game_selection (game_id, custom_title, custom_description, is_active)
SELECT id, 'Günün Oyunu: ' || name, 'Bugün sizin için seçtiğimiz özel oyun! Hemen kuralları öğrenin ve oynamaya başlayın.', true
FROM games
ORDER BY random()
LIMIT 1;
