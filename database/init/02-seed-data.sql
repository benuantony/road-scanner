-- Tamil Nadu Bus & Train Routes - Seed Data

-- =====================================================
-- STOPS (Major cities and towns in Tamil Nadu)
-- =====================================================

INSERT INTO stops (name, name_tamil, latitude, longitude, district, stop_type) VALUES
-- Chennai
('Chennai Koyambedu (CMBT)', 'சென்னை கோயம்பேடு', 13.0694, 80.1948, 'Chennai', 'bus'),
('Chennai Central', 'சென்னை சென்ட்ரல்', 13.0827, 80.2707, 'Chennai', 'both'),
('Chennai Egmore', 'சென்னை எழும்பூர்', 13.0732, 80.2609, 'Chennai', 'train'),
('Chennai Mofussil Bus Terminus', 'சென்னை புறநகர் பேருந்து நிலையம்', 13.0711, 80.1969, 'Chennai', 'bus'),
('Tambaram', 'தாம்பரம்', 12.9249, 80.1000, 'Chengalpattu', 'both'),

-- Coimbatore
('Coimbatore Gandhipuram', 'கோயம்புத்தூர் காந்திபுரம்', 11.0168, 76.9558, 'Coimbatore', 'bus'),
('Coimbatore Junction', 'கோயம்புத்தூர் சந்திப்பு', 11.0018, 76.9629, 'Coimbatore', 'train'),
('Coimbatore Ukkadam', 'கோயம்புத்தூர் உக்கடம்', 10.9925, 76.9614, 'Coimbatore', 'bus'),

-- Madurai
('Madurai Periyar', 'மதுரை பெரியார்', 9.9195, 78.1193, 'Madurai', 'bus'),
('Madurai Mattuthavani', 'மதுரை மாட்டுதாவணி', 9.9403, 78.1450, 'Madurai', 'bus'),
('Madurai Junction', 'மதுரை சந்திப்பு', 9.9201, 78.1245, 'Madurai', 'train'),

-- Trichy (Tiruchirappalli)
('Trichy Central Bus Stand', 'திருச்சி மைய பேருந்து நிலையம்', 10.8055, 78.6856, 'Tiruchirappalli', 'bus'),
('Trichy Chatram', 'திருச்சி சத்திரம்', 10.8150, 78.6970, 'Tiruchirappalli', 'bus'),
('Trichy Junction', 'திருச்சி சந்திப்பு', 10.8189, 78.6912, 'Tiruchirappalli', 'train'),

-- Salem
('Salem New Bus Stand', 'சேலம் புதிய பேருந்து நிலையம்', 11.6643, 78.1460, 'Salem', 'bus'),
('Salem Junction', 'சேலம் சந்திப்பு', 11.6550, 78.1422, 'Salem', 'train'),

-- Erode
('Erode Bus Stand', 'ஈரோடு பேருந்து நிலையம்', 11.3410, 77.7172, 'Erode', 'bus'),
('Erode Junction', 'ஈரோடு சந்திப்பு', 11.3428, 77.7145, 'Erode', 'train'),

-- Tirunelveli
('Tirunelveli New Bus Stand', 'திருநெல்வேலி புதிய பேருந்து நிலையம்', 8.7139, 77.7567, 'Tirunelveli', 'bus'),
('Tirunelveli Junction', 'திருநெல்வேலி சந்திப்பு', 8.7093, 77.7263, 'Tirunelveli', 'train'),

-- Thanjavur
('Thanjavur New Bus Stand', 'தஞ்சாவூர் புதிய பேருந்து நிலையம்', 10.7870, 79.1378, 'Thanjavur', 'bus'),
('Thanjavur Junction', 'தஞ்சாவூர் சந்திப்பு', 10.7900, 79.1370, 'Thanjavur', 'train'),

-- Vellore
('Vellore Bus Stand', 'வேலூர் பேருந்து நிலையம்', 12.9165, 79.1325, 'Vellore', 'bus'),
('Katpadi Junction', 'காட்பாடி சந்திப்பு', 12.9757, 79.1453, 'Vellore', 'train'),

-- Pondicherry
('Pondicherry Bus Stand', 'புதுச்சேரி பேருந்து நிலையம்', 11.9340, 79.8306, 'Pondicherry', 'bus'),

-- Villupuram
('Villupuram Bus Stand', 'விழுப்புரம் பேருந்து நிலையம்', 11.9401, 79.4861, 'Villupuram', 'bus'),
('Villupuram Junction', 'விழுப்புரம் சந்திப்பு', 11.9332, 79.4942, 'Villupuram', 'train'),

-- Tiruppur
('Tiruppur New Bus Stand', 'திருப்பூர் புதிய பேருந்து நிலையம்', 11.1085, 77.3411, 'Tiruppur', 'bus'),
('Tiruppur Railway Station', 'திருப்பூர் ரயில் நிலையம்', 11.1089, 77.3425, 'Tiruppur', 'train'),

-- Kanyakumari
('Nagercoil Bus Stand', 'நாகர்கோவில் பேருந்து நிலையம்', 8.1833, 77.4119, 'Kanyakumari', 'bus'),
('Nagercoil Junction', 'நாகர்கோவில் சந்திப்பு', 8.1780, 77.4295, 'Kanyakumari', 'train'),
('Kanyakumari', 'கன்னியாகுமரி', 8.0883, 77.5385, 'Kanyakumari', 'both'),

-- Dindigul
('Dindigul Bus Stand', 'திண்டுக்கல் பேருந்து நிலையம்', 10.3624, 77.9695, 'Dindigul', 'bus'),
('Dindigul Junction', 'திண்டுக்கல் சந்திப்பு', 10.3570, 77.9750, 'Dindigul', 'train'),

-- Karur
('Karur Bus Stand', 'கரூர் பேருந்து நிலையம்', 10.9601, 78.0766, 'Karur', 'bus'),
('Karur Junction', 'கரூர் சந்திப்பு', 10.9571, 78.0801, 'Karur', 'train'),

-- Kumbakonam
('Kumbakonam Bus Stand', 'கும்பகோணம் பேருந்து நிலையம்', 10.9617, 79.3881, 'Thanjavur', 'bus'),
('Kumbakonam Railway Station', 'கும்பகோணம் ரயில் நிலையம்', 10.9625, 79.3919, 'Thanjavur', 'train'),

-- Chidambaram
('Chidambaram Bus Stand', 'சிதம்பரம் பேருந்து நிலையம்', 11.3992, 79.6900, 'Cuddalore', 'bus'),
('Chidambaram Railway Station', 'சிதம்பரம் ரயில் நிலையம்', 11.4008, 79.6962, 'Cuddalore', 'train');


-- =====================================================
-- ROUTES (Bus and Train routes)
-- =====================================================

INSERT INTO routes (route_number, route_name, transport_type, operator, frequency_mins) VALUES
-- SETC (State Express Transport Corporation) - Long distance buses
('S1', 'Chennai - Coimbatore (Via Salem)', 'bus', 'SETC', 60),
('S2', 'Chennai - Madurai (Via Trichy)', 'bus', 'SETC', 45),
('S3', 'Chennai - Tirunelveli (Via Madurai)', 'bus', 'SETC', 90),
('S4', 'Chennai - Kanyakumari (Via Madurai)', 'bus', 'SETC', 120),

-- TNSTC (Tamil Nadu State Transport Corporation) - Regular buses
('137', 'Chennai - Trichy', 'bus', 'TNSTC', 30),
('157', 'Chennai - Madurai', 'bus', 'TNSTC', 45),
('317', 'Coimbatore - Madurai', 'bus', 'TNSTC', 60),
('227', 'Trichy - Thanjavur - Kumbakonam', 'bus', 'TNSTC', 30),
('501', 'Salem - Erode - Coimbatore', 'bus', 'TNSTC', 45),
('389', 'Chennai - Pondicherry', 'bus', 'TNSTC', 30),

-- Trains
('12243', 'Shatabdi Express (Chennai - Coimbatore)', 'train', 'Southern Railway', NULL),
('12632', 'Vaigai Express (Chennai - Madurai)', 'train', 'Southern Railway', NULL),
('12633', 'Vaigai Express (Madurai - Chennai)', 'train', 'Southern Railway', NULL),
('16105', 'Tiruchendur Express (Chennai - Nagercoil)', 'train', 'Southern Railway', NULL),
('22625', 'Double Decker (Chennai - Bangalore)', 'train', 'Southern Railway', NULL),
('12635', 'Vaigai Superfast (Chennai - Madurai)', 'train', 'Southern Railway', NULL),
('16127', 'Guruvayur Express (Chennai - Trichy)', 'train', 'Southern Railway', NULL),

-- Nagercoil/Southern TN routes
('S5', 'Nagercoil - Coimbatore (Via Madurai)', 'bus', 'SETC', 90),
('S6', 'Nagercoil - Madurai Direct', 'bus', 'SETC', 60),
('S7', 'Madurai - Coimbatore Direct', 'bus', 'SETC', 45),
('S8', 'Tirunelveli - Coimbatore (Via Madurai)', 'bus', 'SETC', 90),
('NKL1', 'Nagercoil - Tirunelveli - Madurai', 'bus', 'TNSTC', 30),
('12633', 'Nellai Express (Tirunelveli - Chennai)', 'train', 'Southern Railway', NULL),
('16723', 'Ananthapuri Express (Nagercoil - Coimbatore)', 'train', 'Southern Railway', NULL);


-- =====================================================
-- ROUTE STOPS (Stop sequences for each route)
-- =====================================================

-- Route S1: Chennai - Coimbatore (Via Salem)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Koyambedu (CMBT)', 1, 0, 0),
    ('Vellore Bus Stand', 2, 140, 150),
    ('Salem New Bus Stand', 3, 290, 300),
    ('Erode Bus Stand', 4, 370, 390),
    ('Tiruppur New Bus Stand', 5, 420, 450),
    ('Coimbatore Gandhipuram', 6, 500, 540)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S1';

-- Route S2: Chennai - Madurai (Via Trichy)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Koyambedu (CMBT)', 1, 0, 0),
    ('Villupuram Bus Stand', 2, 160, 150),
    ('Trichy Central Bus Stand', 3, 330, 330),
    ('Dindigul Bus Stand', 4, 420, 420),
    ('Madurai Mattuthavani', 5, 480, 480)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S2';

-- Route 137: Chennai - Trichy
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Koyambedu (CMBT)', 1, 0, 0),
    ('Tambaram', 2, 25, 45),
    ('Villupuram Bus Stand', 3, 160, 180),
    ('Trichy Central Bus Stand', 4, 330, 360)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '137';

-- Route 157: Chennai - Madurai
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Koyambedu (CMBT)', 1, 0, 0),
    ('Villupuram Bus Stand', 2, 160, 180),
    ('Trichy Central Bus Stand', 3, 330, 390),
    ('Madurai Periyar', 4, 480, 540)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '157';

-- Route 317: Coimbatore - Madurai
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Coimbatore Gandhipuram', 1, 0, 0),
    ('Tiruppur New Bus Stand', 2, 50, 60),
    ('Erode Bus Stand', 3, 100, 120),
    ('Karur Bus Stand', 4, 160, 180),
    ('Dindigul Bus Stand', 5, 230, 270),
    ('Madurai Mattuthavani', 6, 290, 330)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '317';

-- Route 389: Chennai - Pondicherry
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Koyambedu (CMBT)', 1, 0, 0),
    ('Tambaram', 2, 25, 45),
    ('Chidambaram Bus Stand', 3, 120, 150),
    ('Pondicherry Bus Stand', 4, 170, 210)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '389';

-- Route 12243: Shatabdi Express (Chennai - Coimbatore)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Central', 1, 0, 0),
    ('Katpadi Junction', 2, 130, 90),
    ('Salem Junction', 3, 290, 180),
    ('Erode Junction', 4, 370, 240),
    ('Coimbatore Junction', 5, 495, 330)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '12243';

-- Route 12632: Vaigai Express (Chennai - Madurai)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Egmore', 1, 0, 0),
    ('Villupuram Junction', 2, 160, 120),
    ('Trichy Junction', 3, 330, 270),
    ('Dindigul Junction', 4, 420, 360),
    ('Madurai Junction', 5, 480, 450)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '12632';

-- Route 16105: Tiruchendur Express (Chennai - Nagercoil)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Chennai Egmore', 1, 0, 0),
    ('Villupuram Junction', 2, 160, 150),
    ('Trichy Junction', 3, 330, 330),
    ('Madurai Junction', 4, 480, 480),
    ('Tirunelveli Junction', 5, 600, 600),
    ('Nagercoil Junction', 6, 680, 680)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '16105';

-- Route S5: Nagercoil - Coimbatore (Via Madurai)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Nagercoil Bus Stand', 1, 0, 0),
    ('Tirunelveli New Bus Stand', 2, 80, 90),
    ('Madurai Mattuthavani', 3, 240, 270),
    ('Dindigul Bus Stand', 4, 310, 360),
    ('Karur Bus Stand', 5, 380, 420),
    ('Erode Bus Stand', 6, 450, 480),
    ('Tiruppur New Bus Stand', 7, 500, 530),
    ('Coimbatore Gandhipuram', 8, 560, 600)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S5';

-- Route S6: Nagercoil - Madurai Direct
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Nagercoil Bus Stand', 1, 0, 0),
    ('Tirunelveli New Bus Stand', 2, 80, 90),
    ('Madurai Mattuthavani', 3, 240, 270)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S6';

-- Route S7: Madurai - Coimbatore Direct
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Madurai Mattuthavani', 1, 0, 0),
    ('Dindigul Bus Stand', 2, 70, 90),
    ('Karur Bus Stand', 3, 140, 150),
    ('Erode Bus Stand', 4, 210, 240),
    ('Tiruppur New Bus Stand', 5, 260, 290),
    ('Coimbatore Gandhipuram', 6, 320, 360)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S7';

-- Route S8: Tirunelveli - Coimbatore (Via Madurai)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Tirunelveli New Bus Stand', 1, 0, 0),
    ('Madurai Mattuthavani', 2, 160, 180),
    ('Dindigul Bus Stand', 3, 230, 270),
    ('Karur Bus Stand', 4, 300, 330),
    ('Erode Bus Stand', 5, 370, 390),
    ('Tiruppur New Bus Stand', 6, 420, 450),
    ('Coimbatore Gandhipuram', 7, 480, 510)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'S8';

-- Route NKL1: Nagercoil - Tirunelveli - Madurai
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Nagercoil Bus Stand', 1, 0, 0),
    ('Tirunelveli New Bus Stand', 2, 80, 90),
    ('Madurai Periyar', 3, 240, 270)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'NKL1';

-- Route 16723: Ananthapuri Express (Nagercoil - Coimbatore)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Nagercoil Junction', 1, 0, 0),
    ('Tirunelveli Junction', 2, 80, 75),
    ('Madurai Junction', 3, 240, 210),
    ('Dindigul Junction', 4, 320, 280),
    ('Erode Junction', 5, 450, 390),
    ('Coimbatore Junction', 6, 560, 480)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '16723';


-- =====================================================
-- VEHICLES (Sample buses and trains)
-- =====================================================

-- Buses
INSERT INTO vehicles (vehicle_number, route_id, transport_type, current_stop_id, status)
SELECT 
    v.vehicle_number,
    r.id,
    'bus',
    s.id,
    'running'
FROM (VALUES
    ('TN-01-AB-1234', 'S1', 'Chennai Koyambedu (CMBT)'),
    ('TN-01-CD-5678', 'S1', 'Salem New Bus Stand'),
    ('TN-01-EF-9012', 'S2', 'Chennai Koyambedu (CMBT)'),
    ('TN-01-GH-3456', 'S2', 'Trichy Central Bus Stand'),
    ('TN-38-AB-7890', '137', 'Villupuram Bus Stand'),
    ('TN-38-CD-1234', '157', 'Chennai Koyambedu (CMBT)'),
    ('TN-36-AB-5678', '317', 'Coimbatore Gandhipuram'),
    ('TN-36-CD-9012', '317', 'Dindigul Bus Stand'),
    ('TN-01-XY-3456', '389', 'Tambaram')
) AS v(vehicle_number, route_number, stop_name)
JOIN routes r ON r.route_number = v.route_number
JOIN stops s ON s.name = v.stop_name;

-- Trains
INSERT INTO vehicles (vehicle_number, route_id, transport_type, current_stop_id, status)
SELECT 
    v.vehicle_number,
    r.id,
    'train',
    s.id,
    'running'
FROM (VALUES
    ('12243-A', '12243', 'Chennai Central'),
    ('12243-B', '12243', 'Salem Junction'),
    ('12632-A', '12632', 'Chennai Egmore'),
    ('12632-B', '12632', 'Trichy Junction'),
    ('16105-A', '16105', 'Chennai Egmore'),
    ('16105-B', '16105', 'Madurai Junction')
) AS v(vehicle_number, route_number, stop_name)
JOIN routes r ON r.route_number = v.route_number
JOIN stops s ON s.name = v.stop_name;

-- Update vehicle positions based on their current stops
UPDATE vehicles v
SET 
    current_latitude = s.latitude,
    current_longitude = s.longitude
FROM stops s
WHERE v.current_stop_id = s.id;