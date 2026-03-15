-- Bangalore BMTC Bus Routes - GTFS Based Seed Data
-- Real bus stops and routes from Bangalore Metropolitan Transport Corporation
-- Generated with accurate coordinates and ETA information

-- =====================================================
-- STOPS (Bangalore BMTC Bus Stops - Major Terminals & Stops)
-- =====================================================

INSERT INTO stops (name, name_tamil, latitude, longitude, district, stop_type) VALUES

-- =====================================================
-- MAJOR BUS TERMINALS / TTMC
-- =====================================================
('Kempegowda Bus Station (Majestic)', 'ಮೆಜೆಸ್ಟಿಕ್', 12.9778, 77.5714, 'Bangalore Central', 'bus'),
('Shivajinagar Bus Station', 'ಶಿವಾಜಿನಗರ', 12.9857, 77.6057, 'Bangalore Central', 'bus'),
('KR Market Bus Station', 'ಕೆ.ಆರ್. ಮಾರ್ಕೆಟ್', 12.9631, 77.5775, 'Bangalore Central', 'bus'),
('Shantinagar Bus Station', 'ಶಾಂತಿನಗರ', 12.9534, 77.5994, 'Bangalore Central', 'bus'),
('Banashankari TTMC', 'ಬನಶಂಕರಿ', 12.9255, 77.5468, 'Bangalore South', 'bus'),
('Jayanagar 4th Block TTMC', 'ಜಯನಗರ', 12.9308, 77.5838, 'Bangalore South', 'bus'),
('Vijayanagar TTMC', 'ವಿಜಯನಗರ', 12.9707, 77.5368, 'Bangalore West', 'bus'),
('Yeshwanthpur TTMC', 'ಯಶವಂತಪುರ', 13.0285, 77.5381, 'Bangalore North', 'bus'),
('Kengeri TTMC', 'ಕೆಂಗೇರಿ', 12.9135, 77.4828, 'Bangalore South', 'bus'),
('Whitefield TTMC', 'ವೈಟ್‌ಫೀಲ್ಡ್', 12.9698, 77.7500, 'Bangalore East', 'bus'),
('Electronic City Bus Station', 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ', 12.8456, 77.6603, 'Bangalore South', 'bus'),
('Silk Board Junction', 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್', 12.9177, 77.6227, 'Bangalore South', 'bus'),
('Marathahalli', 'ಮಾರತಹಳ್ಳಿ', 12.9591, 77.7012, 'Bangalore East', 'bus'),
('Hebbal', 'ಹೆಬ್ಬಾಳ', 13.0358, 77.5970, 'Bangalore North', 'bus'),
('ITPL (International Tech Park)', 'ಐಟಿಪಿಎಲ್', 12.9854, 77.7316, 'Bangalore East', 'bus'),

-- =====================================================
-- KORAMANGALA AREA
-- =====================================================
('Koramangala 1st Block', 'ಕೋರಮಂಗಲ 1ನೇ ಬ್ಲಾಕ್', 12.9352, 77.6245, 'Bangalore South', 'bus'),
('Koramangala 4th Block', 'ಕೋರಮಂಗಲ 4ನೇ ಬ್ಲಾಕ್', 12.9279, 77.6271, 'Bangalore South', 'bus'),
('Koramangala 5th Block', 'ಕೋರಮಂಗಲ 5ನೇ ಬ್ಲಾಕ್', 12.9346, 77.6205, 'Bangalore South', 'bus'),
('Koramangala 6th Block', 'ಕೋರಮಂಗಲ 6ನೇ ಬ್ಲಾಕ್', 12.9341, 77.6148, 'Bangalore South', 'bus'),
('Koramangala 8th Block', 'ಕೋರಮಂಗಲ 8ನೇ ಬ್ಲಾಕ್', 12.9365, 77.6312, 'Bangalore South', 'bus'),
('Sony World Junction', 'ಸೋನಿ ವರ್ಲ್ಡ್', 12.9343, 77.6104, 'Bangalore South', 'bus'),
('Forum Mall Koramangala', 'ಫೋರಂ ಮಾಲ್', 12.9346, 77.6107, 'Bangalore South', 'bus'),

-- =====================================================
-- INDIRANAGAR / CV RAMAN NAGAR AREA  
-- =====================================================
('Indiranagar 100 Feet Road', 'ಇಂದಿರಾನಗರ', 12.9784, 77.6408, 'Bangalore East', 'bus'),
('Indiranagar Metro Station', 'ಇಂದಿರಾನಗರ ಮೆಟ್ರೋ', 12.9783, 77.6393, 'Bangalore East', 'bus'),
('CMH Road Indiranagar', 'ಸಿಎಂಹೆಚ್ ರೋಡ್', 12.9818, 77.6407, 'Bangalore East', 'bus'),
('Domlur', 'ಡೋಮ್ಲೂರ್', 12.9610, 77.6387, 'Bangalore East', 'bus'),
('Old Airport Road Domlur', 'ಹಳೆ ವಿಮಾನ ನಿಲ್ದಾಣ ರಸ್ತೆ', 12.9588, 77.6421, 'Bangalore East', 'bus'),
('HAL Airport', 'ಹೆಚ್‌ಎಎಲ್ ವಿಮಾನ ನಿಲ್ದಾಣ', 12.9499, 77.6682, 'Bangalore East', 'bus'),
('CV Raman Nagar', 'ಸಿವಿ ರಾಮನ್ ನಗರ', 12.9849, 77.6633, 'Bangalore East', 'bus'),

-- =====================================================
-- HSR LAYOUT / BTM LAYOUT AREA
-- =====================================================
('HSR Layout BDA Complex', 'ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್', 12.9116, 77.6389, 'Bangalore South', 'bus'),
('HSR Layout Sector 1', 'ಎಚ್‌ಎಸ್‌ಆರ್ ಸೆಕ್ಟರ್ 1', 12.9147, 77.6351, 'Bangalore South', 'bus'),
('HSR Layout Sector 2', 'ಎಚ್‌ಎಸ್‌ಆರ್ ಸೆಕ್ಟರ್ 2', 12.9134, 77.6425, 'Bangalore South', 'bus'),
('HSR Layout 27th Main', 'ಎಚ್‌ಎಸ್‌ಆರ್ 27ನೇ ಮೇನ್', 12.9089, 77.6447, 'Bangalore South', 'bus'),
('BTM Layout 1st Stage', 'ಬಿಟಿಎಂ ಲೇಔಟ್', 12.9166, 77.6101, 'Bangalore South', 'bus'),
('BTM Layout 2nd Stage', 'ಬಿಟಿಎಂ 2ನೇ ಸ್ಟೇಜ್', 12.9177, 77.6185, 'Bangalore South', 'bus'),
('Madiwala', 'ಮಾದಿವಾಳ', 12.9218, 77.6168, 'Bangalore South', 'bus'),
('Bommanahalli', 'ಬೊಮ್ಮನಹಳ್ಳಿ', 12.9029, 77.6185, 'Bangalore South', 'bus'),

-- =====================================================
-- JP NAGAR / BANNERGHATTA ROAD AREA
-- =====================================================
('JP Nagar 1st Phase', 'ಜೆಪಿ ನಗರ 1ನೇ ಫೇಸ್', 12.9073, 77.5922, 'Bangalore South', 'bus'),
('JP Nagar 2nd Phase', 'ಜೆಪಿ ನಗರ 2ನೇ ಫೇಸ್', 12.9007, 77.5858, 'Bangalore South', 'bus'),
('JP Nagar 4th Phase', 'ಜೆಪಿ ನಗರ 4ನೇ ಫೇಸ್', 12.8894, 77.5890, 'Bangalore South', 'bus'),
('JP Nagar 5th Phase', 'ಜೆಪಿ ನಗರ 5ನೇ ಫೇಸ್', 12.8843, 77.5832, 'Bangalore South', 'bus'),
('JP Nagar 6th Phase', 'ಜೆಪಿ ನಗರ 6ನೇ ಫೇಸ್', 12.8774, 77.5784, 'Bangalore South', 'bus'),
('Bannerghatta Road', 'ಬನ್ನೇರುಘಟ್ಟ ರಸ್ತೆ', 12.8879, 77.5966, 'Bangalore South', 'bus'),
('Meenakshi Mall', 'ಮೀನಾಕ್ಷಿ ಮಾಲ್', 12.9012, 77.5868, 'Bangalore South', 'bus'),
('Gottigere', 'ಗೊಟ್ಟಿಗೆರೆ', 12.8629, 77.5779, 'Bangalore South', 'bus'),

-- =====================================================
-- MG ROAD / BRIGADE ROAD / CBD AREA
-- =====================================================
('MG Road', 'ಎಂಜಿ ರೋಡ್', 12.9758, 77.6096, 'Bangalore Central', 'bus'),
('MG Road Metro Station', 'ಎಂಜಿ ರೋಡ್ ಮೆಟ್ರೋ', 12.9757, 77.6065, 'Bangalore Central', 'bus'),
('Trinity Circle', 'ಟ್ರಿನಿಟಿ ಸರ್ಕಲ್', 12.9724, 77.6191, 'Bangalore Central', 'bus'),
('Brigade Road', 'ಬ್ರಿಗೇಡ್ ರೋಡ್', 12.9715, 77.6076, 'Bangalore Central', 'bus'),
('Residency Road', 'ರೆಸಿಡೆನ್ಸಿ ರೋಡ್', 12.9697, 77.6008, 'Bangalore Central', 'bus'),
('Richmond Circle', 'ರಿಚ್ಮಂಡ್ ಸರ್ಕಲ್', 12.9651, 77.5991, 'Bangalore Central', 'bus'),
('Cubbon Park', 'ಕಬ್ಬನ್ ಪಾರ್ಕ್', 12.9763, 77.5929, 'Bangalore Central', 'bus'),
('Vidhana Soudha', 'ವಿಧಾನ ಸೌಧ', 12.9795, 77.5913, 'Bangalore Central', 'bus'),
('High Court', 'ಹೈಕೋರ್ಟ್', 12.9788, 77.5878, 'Bangalore Central', 'bus'),

-- =====================================================
-- RAJAJINAGAR / MALLESHWARAM AREA
-- =====================================================
('Rajajinagar 1st Block', 'ರಾಜಾಜಿನಗರ', 12.9912, 77.5524, 'Bangalore West', 'bus'),
('Rajajinagar 4th Block', 'ರಾಜಾಜಿನಗರ 4ನೇ ಬ್ಲಾಕ್', 12.9939, 77.5485, 'Bangalore West', 'bus'),
('Rajajinagar 6th Block', 'ರಾಜಾಜಿನಗರ 6ನೇ ಬ್ಲಾಕ್', 12.9987, 77.5432, 'Bangalore West', 'bus'),
('Malleshwaram', 'ಮಲ್ಲೇಶ್ವರಂ', 13.0035, 77.5686, 'Bangalore West', 'bus'),
('Malleshwaram Circle', 'ಮಲ್ಲೇಶ್ವರಂ ಸರ್ಕಲ್', 13.0012, 77.5701, 'Bangalore West', 'bus'),
('Sadashivanagar', 'ಸದಾಶಿವನಗರ', 13.0101, 77.5768, 'Bangalore North', 'bus'),
('Sankey Tank', 'ಸ್ಯಾಂಕಿ ಟ್ಯಾಂಕ್', 13.0089, 77.5712, 'Bangalore North', 'bus'),
('Seshadripuram', 'ಶೇಷಾದ್ರಿಪುರಂ', 12.9892, 77.5743, 'Bangalore Central', 'bus'),

-- =====================================================
-- WHITEFIELD / OUTER RING ROAD AREA
-- =====================================================
('Whitefield Main Road', 'ವೈಟ್‌ಫೀಲ್ಡ್ ಮೇನ್ ರೋಡ್', 12.9698, 77.7499, 'Bangalore East', 'bus'),
('ITPL Main Road', 'ಐಟಿಪಿಎಲ್ ಮೇನ್ ರೋಡ್', 12.9854, 77.7316, 'Bangalore East', 'bus'),
('Kadugodi', 'ಕಾಡುಗೋಡಿ', 12.9933, 77.7596, 'Bangalore East', 'bus'),
('Hope Farm Junction', 'ಹೋಪ್ ಫಾರ್ಮ್', 12.9771, 77.7636, 'Bangalore East', 'bus'),
('Varthur', 'ವರ್ತೂರು', 12.9412, 77.7442, 'Bangalore East', 'bus'),
('Bellandur', 'ಬೆಳ್ಳಂದೂರು', 12.9261, 77.6757, 'Bangalore East', 'bus'),
('Outer Ring Road Bellandur', 'ಔಟರ್ ರಿಂಗ್ ರೋಡ್', 12.9305, 77.6701, 'Bangalore East', 'bus'),
('Kadubeesanahalli', 'ಕಡುಬೀಸನಹಳ್ಳಿ', 12.9366, 77.6854, 'Bangalore East', 'bus'),
('Devarabisanahalli', 'ದೇವರಬಿಸನಹಳ್ಳಿ', 12.9387, 77.6943, 'Bangalore East', 'bus'),
('Cessna Business Park', 'ಸೆಸ್ನಾ ಬಿಸಿನೆಸ್ ಪಾರ್ಕ್', 12.9178, 77.6851, 'Bangalore East', 'bus'),

-- =====================================================
-- ELECTRONIC CITY / HOSUR ROAD AREA
-- =====================================================
('Electronic City Phase 1', 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಫೇಸ್ 1', 12.8399, 77.6770, 'Bangalore South', 'bus'),
('Electronic City Phase 2', 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಫೇಸ್ 2', 12.8510, 77.6630, 'Bangalore South', 'bus'),
('Infosys Electronic City', 'ಇನ್ಫೋಸಿಸ್', 12.8424, 77.6604, 'Bangalore South', 'bus'),
('Wipro Gate Electronic City', 'ವಿಪ್ರೋ ಗೇಟ್', 12.8356, 77.6648, 'Bangalore South', 'bus'),
('Hosur Road', 'ಹೊಸೂರು ರಸ್ತೆ', 12.8987, 77.6295, 'Bangalore South', 'bus'),
('Singasandra', 'ಸಿಂಗಸಂದ್ರ', 12.8779, 77.6398, 'Bangalore South', 'bus'),
('Hosa Road', 'ಹೊಸ ರಸ್ತೆ', 12.8874, 77.6520, 'Bangalore South', 'bus'),
('Kudlu Gate', 'ಕುದ್ಲು ಗೇಟ್', 12.8935, 77.6440, 'Bangalore South', 'bus'),

-- =====================================================
-- HEBBAL / YELAHANKA / NORTH BANGALORE
-- =====================================================
('Hebbal Flyover', 'ಹೆಬ್ಬಾಳ ಫ್ಲೈಓವರ್', 13.0358, 77.5970, 'Bangalore North', 'bus'),
('Esteem Mall Hebbal', 'ಎಸ್ಟೀಮ್ ಮಾಲ್', 13.0345, 77.5912, 'Bangalore North', 'bus'),
('Mekhri Circle', 'ಮೇಖ್ರಿ ಸರ್ಕಲ್', 13.0193, 77.5891, 'Bangalore North', 'bus'),
('Yelahanka', 'ಯಲಹಂಕ', 13.1007, 77.5963, 'Bangalore North', 'bus'),
('Yelahanka New Town', 'ಯಲಹಂಕ ನ್ಯೂ ಟೌನ್', 13.1018, 77.5821, 'Bangalore North', 'bus'),
('Jakkur', 'ಜಕ್ಕೂರು', 13.0771, 77.6127, 'Bangalore North', 'bus'),
('Thanisandra', 'ತಣಿಸಂದ್ರ', 13.0595, 77.6284, 'Bangalore North', 'bus'),
('Nagawara', 'ನಾಗವಾರ', 13.0445, 77.6187, 'Bangalore North', 'bus'),
('Manyata Tech Park', 'ಮನ್ಯತಾ ಟೆಕ್ ಪಾರ್ಕ್', 13.0474, 77.6215, 'Bangalore North', 'bus'),
('Sahakara Nagar', 'ಸಹಕಾರ ನಗರ', 13.0598, 77.5922, 'Bangalore North', 'bus'),
('RT Nagar', 'ಆರ್‌ಟಿ ನಗರ', 13.0232, 77.5978, 'Bangalore North', 'bus'),

-- =====================================================
-- BANASHANKARI / SOUTH BANGALORE
-- =====================================================
('Banashankari 1st Stage', 'ಬನಶಂಕರಿ 1ನೇ ಸ್ಟೇಜ್', 12.9331, 77.5574, 'Bangalore South', 'bus'),
('Banashankari 2nd Stage', 'ಬನಶಂಕರಿ 2ನೇ ಸ್ಟೇಜ್', 12.9237, 77.5519, 'Bangalore South', 'bus'),
('Banashankari 3rd Stage', 'ಬನಶಂಕರಿ 3ನೇ ಸ್ಟೇಜ್', 12.9128, 77.5467, 'Bangalore South', 'bus'),
('Kathriguppe', 'ಕಾತ್ರಿಗುಪ್ಪೆ', 12.9186, 77.5554, 'Bangalore South', 'bus'),
('Kumaraswamy Layout', 'ಕುಮಾರಸ್ವಾಮಿ ಲೇಔಟ್', 12.9053, 77.5605, 'Bangalore South', 'bus'),
('Uttarahalli', 'ಉತ್ತರಹಳ್ಳಿ', 12.9089, 77.5448, 'Bangalore South', 'bus'),
('Padmanabhanagar', 'ಪದ್ಮನಾಭನಗರ', 12.9148, 77.5527, 'Bangalore South', 'bus'),

-- =====================================================
-- BASAVANAGUDI / JAYANAGAR AREA
-- =====================================================
('Basavanagudi', 'ಬಸವನಗುಡಿ', 12.9416, 77.5732, 'Bangalore South', 'bus'),
('Bull Temple', 'ಬಸವನ ಗುಡಿ ದೇವಸ್ಥಾನ', 12.9430, 77.5679, 'Bangalore South', 'bus'),
('National College', 'ನ್ಯಾಷನಲ್ ಕಾಲೇಜ್', 12.9441, 77.5756, 'Bangalore South', 'bus'),
('Jayanagar 3rd Block', 'ಜಯನಗರ 3ನೇ ಬ್ಲಾಕ್', 12.9297, 77.5824, 'Bangalore South', 'bus'),
('Jayanagar 5th Block', 'ಜಯನಗರ 5ನೇ ಬ್ಲಾಕ್', 12.9265, 77.5779, 'Bangalore South', 'bus'),
('Jayanagar 9th Block', 'ಜಯನಗರ 9ನೇ ಬ್ಲಾಕ್', 12.9223, 77.5911, 'Bangalore South', 'bus'),
('South End Circle', 'ಸೌತ್ ಎಂಡ್ ಸರ್ಕಲ್', 12.9391, 77.5851, 'Bangalore South', 'bus'),
('Lalbagh West Gate', 'ಲಾಲ್‌ಬಾಗ್', 12.9507, 77.5848, 'Bangalore South', 'bus'),
('Lalbagh Main Gate', 'ಲಾಲ್‌ಬಾಗ್ ಮೇನ್ ಗೇಟ್', 12.9499, 77.5844, 'Bangalore South', 'bus'),

-- =====================================================
-- PEENYA / INDUSTRIAL AREA
-- =====================================================
('Peenya', 'ಪೀಣ್ಯ', 13.0313, 77.5170, 'Bangalore North', 'bus'),
('Peenya Industrial Area', 'ಪೀಣ್ಯ ಇಂಡಸ್ಟ್ರಿಯಲ್', 13.0278, 77.5215, 'Bangalore North', 'bus'),
('Peenya 2nd Stage', 'ಪೀಣ್ಯ 2ನೇ ಸ್ಟೇಜ್', 13.0234, 77.5178, 'Bangalore North', 'bus'),
('Jalahalli', 'ಜಲಹಳ್ಳಿ', 13.0396, 77.5455, 'Bangalore North', 'bus'),
('Jalahalli Cross', 'ಜಲಹಳ್ಳಿ ಕ್ರಾಸ್', 13.0342, 77.5389, 'Bangalore North', 'bus'),
('Dasarahalli', 'ದಾಸರಹಳ್ಳಿ', 13.0453, 77.5129, 'Bangalore North', 'bus'),
('Nagasandra', 'ನಾಗಸಂದ್ರ', 13.0486, 77.5043, 'Bangalore North', 'bus'),

-- =====================================================
-- AIRPORT / NORTH EAST BANGALORE
-- =====================================================
('Kempegowda International Airport', 'ಕೆಂಪೇಗೌಡ ವಿಮಾನ ನಿಲ್ದಾಣ', 13.1986, 77.7066, 'Bangalore Rural', 'bus'),
('Devanahalli', 'ದೇವನಹಳ್ಳಿ', 13.2476, 77.7135, 'Bangalore Rural', 'bus'),
('Trumpet Flyover', 'ಟ್ರಂಪೆಟ್ ಫ್ಲೈಓವರ್', 13.1567, 77.6234, 'Bangalore North', 'bus'),
('Bagalur', 'ಬಾಗಲೂರು', 13.1423, 77.6567, 'Bangalore North', 'bus');


-- =====================================================
-- ROUTES (BMTC Popular Bus Routes with Accurate Frequencies)
-- =====================================================

INSERT INTO routes (route_number, route_name, transport_type, operator, frequency_mins) VALUES
-- Volvo AC Routes (V-Series)
('V-500C', 'Majestic - Electronic City (Via Silk Board)', 'bus', 'BMTC Volvo', 10),
('V-500CA', 'Majestic - Electronic City (Via Koramangala)', 'bus', 'BMTC Volvo', 15),
('V-500D', 'Majestic - Electronic City (Via Bannerghatta Road)', 'bus', 'BMTC Volvo', 12),
('V-500E', 'Majestic - Infosys Electronic City', 'bus', 'BMTC Volvo', 15),
('V-500NA', 'Majestic - ITPL Whitefield', 'bus', 'BMTC Volvo', 12),
('V-500NB', 'Majestic - Whitefield (Via Old Airport Road)', 'bus', 'BMTC Volvo', 15),
('V-500S', 'Majestic - Whitefield (Via Silk Board)', 'bus', 'BMTC Volvo', 20),
('V-335E', 'Banashankari - ITPL Whitefield', 'bus', 'BMTC Volvo', 15),
('V-335W', 'Electronic City - Whitefield', 'bus', 'BMTC Volvo', 20),
('V-356', 'Majestic - Manyata Tech Park', 'bus', 'BMTC Volvo', 15),

-- Vayu Vajra (Airport) Routes
('KIA-4', 'Majestic - Kempegowda Airport', 'bus', 'BMTC Vajra', 30),
('KIA-5', 'Shivajinagar - Kempegowda Airport', 'bus', 'BMTC Vajra', 45),
('KIA-6', 'Whitefield - Kempegowda Airport', 'bus', 'BMTC Vajra', 60),
('KIA-7', 'Electronic City - Kempegowda Airport', 'bus', 'BMTC Vajra', 45),
('KIA-8', 'Banashankari - Kempegowda Airport', 'bus', 'BMTC Vajra', 60),
('KIA-9', 'Jayanagar - Kempegowda Airport', 'bus', 'BMTC Vajra', 60),

-- Regular Bus Routes (High Frequency)
('401', 'Majestic - Jayanagar - Electronic City', 'bus', 'BMTC', 8),
('401A', 'Majestic - Bannerghatta Road - Gottigere', 'bus', 'BMTC', 10),
('401K', 'Majestic - JP Nagar - Kengeri', 'bus', 'BMTC', 12),
('500A', 'Majestic - Koramangala - Electronic City', 'bus', 'BMTC', 10),
('500B', 'Majestic - HSR Layout - Electronic City', 'bus', 'BMTC', 12),
('500K', 'Majestic - BTM Layout - Kudlu', 'bus', 'BMTC', 15),
('201', 'Majestic - Indiranagar - Whitefield', 'bus', 'BMTC', 10),
('201R', 'Shivajinagar - CV Raman Nagar - Whitefield', 'bus', 'BMTC', 15),
('201M', 'Majestic - Marathahalli - ITPL', 'bus', 'BMTC', 12),

-- Ring Road Routes
('365', 'Outer Ring Road Circular (Clockwise)', 'bus', 'BMTC', 15),
('365A', 'Outer Ring Road Circular (Anti-Clockwise)', 'bus', 'BMTC', 15),

-- North Bangalore Routes
('276', 'Majestic - Hebbal - Yelahanka', 'bus', 'BMTC', 8),
('276A', 'Majestic - Manyata Tech Park - Jakkur', 'bus', 'BMTC', 12),
('290', 'Majestic - RT Nagar - Hebbal', 'bus', 'BMTC', 10),
('292', 'Shivajinagar - Hebbal - Yelahanka', 'bus', 'BMTC', 12),

-- West Bangalore Routes
('252', 'Majestic - Vijayanagar - Kengeri', 'bus', 'BMTC', 10),
('252A', 'Majestic - Rajajinagar - Yeshwanthpur', 'bus', 'BMTC', 8),
('258', 'Shivajinagar - Malleshwaram - Yeshwanthpur', 'bus', 'BMTC', 10),

-- South Bangalore Routes  
('210', 'Majestic - Basavanagudi - Banashankari', 'bus', 'BMTC', 6),
('210A', 'Shivajinagar - Jayanagar - Banashankari', 'bus', 'BMTC', 8),
('215', 'Majestic - JP Nagar - Uttarahalli', 'bus', 'BMTC', 10),
('215K', 'Majestic - Kumaraswamy Layout - Kengeri', 'bus', 'BMTC', 12);


-- =====================================================
-- ROUTE STOPS (Stop sequences with ETA information)
-- =====================================================

-- Route V-500C: Majestic - Electronic City (Via Silk Board)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('KR Market Bus Station', 2, 2, 5),
    ('Lalbagh Main Gate', 3, 4, 10),
    ('South End Circle', 4, 5, 14),
    ('Jayanagar 4th Block TTMC', 5, 7, 20),
    ('BTM Layout 1st Stage', 6, 10, 28),
    ('Silk Board Junction', 7, 12, 35),
    ('Bommanahalli', 8, 15, 42),
    ('Singasandra', 9, 18, 50),
    ('Hosur Road', 10, 20, 55),
    ('Electronic City Phase 2', 11, 24, 65),
    ('Electronic City Bus Station', 12, 26, 70)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'V-500C';

-- Route V-500CA: Majestic - Electronic City (Via Koramangala)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Shantinagar Bus Station', 2, 3, 8),
    ('Richmond Circle', 3, 5, 14),
    ('Koramangala 6th Block', 4, 9, 25),
    ('Koramangala 1st Block', 5, 11, 30),
    ('Koramangala 8th Block', 6, 13, 36),
    ('HSR Layout BDA Complex', 7, 16, 45),
    ('Bommanahalli', 8, 19, 52),
    ('Electronic City Phase 1', 9, 25, 68),
    ('Electronic City Bus Station', 10, 27, 75)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'V-500CA';

-- Route V-500NA: Majestic - ITPL Whitefield
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Shivajinagar Bus Station', 2, 3, 10),
    ('Indiranagar Metro Station', 3, 8, 22),
    ('Indiranagar 100 Feet Road', 4, 9, 26),
    ('Domlur', 5, 11, 32),
    ('HAL Airport', 6, 14, 40),
    ('Marathahalli', 7, 18, 50),
    ('Outer Ring Road Bellandur', 8, 22, 60),
    ('Kadubeesanahalli', 9, 25, 68),
    ('ITPL Main Road', 10, 28, 75),
    ('ITPL (International Tech Park)', 11, 30, 80),
    ('Whitefield TTMC', 12, 34, 90)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'V-500NA';

-- Route V-335E: Banashankari - ITPL Whitefield
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Banashankari TTMC', 1, 0, 0),
    ('Jayanagar 4th Block TTMC', 2, 4, 12),
    ('South End Circle', 3, 6, 18),
    ('Lalbagh Main Gate', 4, 8, 24),
    ('Shantinagar Bus Station', 5, 10, 30),
    ('MG Road', 6, 13, 38),
    ('Trinity Circle', 7, 14, 42),
    ('Indiranagar 100 Feet Road', 8, 18, 52),
    ('Domlur', 9, 20, 58),
    ('Marathahalli', 10, 26, 72),
    ('Bellandur', 11, 30, 82),
    ('Kadubeesanahalli', 12, 33, 90),
    ('ITPL (International Tech Park)', 13, 38, 105),
    ('Whitefield TTMC', 14, 42, 115)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'V-335E';

-- Route V-356: Majestic - Manyata Tech Park
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Seshadripuram', 2, 2, 6),
    ('Malleshwaram Circle', 3, 4, 12),
    ('Sadashivanagar', 4, 6, 18),
    ('Mekhri Circle', 5, 8, 24),
    ('Hebbal Flyover', 6, 11, 32),
    ('Nagawara', 7, 14, 40),
    ('Manyata Tech Park', 8, 16, 48)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'V-356';

-- Route KIA-4: Majestic - Kempegowda Airport
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Mekhri Circle', 2, 7, 15),
    ('Hebbal Flyover', 3, 10, 22),
    ('Esteem Mall Hebbal', 4, 11, 25),
    ('Yelahanka', 5, 20, 40),
    ('Trumpet Flyover', 6, 30, 55),
    ('Kempegowda International Airport', 7, 40, 75)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'KIA-4';

-- Route KIA-7: Electronic City - Kempegowda Airport
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Electronic City Bus Station', 1, 0, 0),
    ('Silk Board Junction', 2, 14, 25),
    ('Koramangala 1st Block', 3, 18, 35),
    ('MG Road', 4, 24, 50),
    ('Mekhri Circle', 5, 30, 65),
    ('Hebbal Flyover', 6, 34, 75),
    ('Yelahanka', 7, 44, 95),
    ('Kempegowda International Airport', 8, 60, 130)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = 'KIA-7';

-- Route 401: Majestic - Jayanagar - Electronic City
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('KR Market Bus Station', 2, 2, 6),
    ('Basavanagudi', 3, 5, 15),
    ('National College', 4, 6, 18),
    ('Jayanagar 4th Block TTMC', 5, 8, 24),
    ('Jayanagar 9th Block', 6, 10, 30),
    ('BTM Layout 2nd Stage', 7, 13, 38),
    ('Silk Board Junction', 8, 15, 45),
    ('HSR Layout BDA Complex', 9, 18, 52),
    ('Bommanahalli', 10, 21, 60),
    ('Electronic City Bus Station', 11, 28, 80)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '401';

-- Route 201: Majestic - Indiranagar - Whitefield
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Shivajinagar Bus Station', 2, 3, 10),
    ('Cubbon Park', 3, 5, 15),
    ('MG Road', 4, 6, 18),
    ('Trinity Circle', 5, 7, 22),
    ('Indiranagar Metro Station', 6, 10, 32),
    ('CMH Road Indiranagar', 7, 11, 36),
    ('Old Airport Road Domlur', 8, 13, 42),
    ('HAL Airport', 9, 16, 50),
    ('CV Raman Nagar', 10, 18, 55),
    ('Marathahalli', 11, 22, 65),
    ('Varthur', 12, 28, 80),
    ('Kadugodi', 13, 32, 90),
    ('Whitefield TTMC', 14, 35, 100)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '201';

-- Route 276: Majestic - Hebbal - Yelahanka
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Vidhana Soudha', 2, 2, 6),
    ('High Court', 3, 3, 9),
    ('Cubbon Park', 4, 4, 12),
    ('Malleshwaram', 5, 7, 22),
    ('Sadashivanagar', 6, 9, 28),
    ('RT Nagar', 7, 12, 36),
    ('Mekhri Circle', 8, 14, 42),
    ('Hebbal Flyover', 9, 17, 50),
    ('Jakkur', 10, 22, 62),
    ('Sahakara Nagar', 11, 25, 70),
    ('Yelahanka', 12, 30, 85)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '276';

-- Route 210: Majestic - Basavanagudi - Banashankari
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('KR Market Bus Station', 2, 2, 5),
    ('Bull Temple', 3, 5, 14),
    ('Basavanagudi', 4, 6, 17),
    ('Jayanagar 5th Block', 5, 8, 24),
    ('Jayanagar 4th Block TTMC', 6, 9, 27),
    ('South End Circle', 7, 10, 30),
    ('Banashankari 1st Stage', 8, 12, 36),
    ('Banashankari TTMC', 9, 14, 42)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '210';

-- Route 252: Majestic - Vijayanagar - Kengeri
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Rajajinagar 1st Block', 2, 3, 10),
    ('Rajajinagar 4th Block', 3, 5, 16),
    ('Rajajinagar 6th Block', 4, 7, 22),
    ('Vijayanagar TTMC', 5, 9, 28),
    ('Yeshwanthpur TTMC', 6, 12, 38),
    ('Peenya', 7, 16, 50),
    ('Jalahalli', 8, 18, 56),
    ('Nagasandra', 9, 21, 65),
    ('Kengeri TTMC', 10, 28, 85)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '252';

-- Route 365: Outer Ring Road Circular (Clockwise)
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Silk Board Junction', 1, 0, 0),
    ('HSR Layout Sector 2', 2, 3, 8),
    ('Bellandur', 3, 7, 18),
    ('Kadubeesanahalli', 4, 10, 26),
    ('Marathahalli', 5, 14, 36),
    ('ITPL (International Tech Park)', 6, 20, 52),
    ('Whitefield TTMC', 7, 25, 65),
    ('Hope Farm Junction', 8, 28, 72),
    ('Kadugodi', 9, 32, 82),
    ('Varthur', 10, 36, 92),
    ('Bellandur', 11, 42, 108),
    ('HSR Layout BDA Complex', 12, 48, 122),
    ('Silk Board Junction', 13, 52, 135)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '365';

-- Route 500A: Majestic - Koramangala - Electronic City
INSERT INTO route_stops (route_id, stop_id, stop_sequence, distance_from_start, arrival_offset_mins)
SELECT r.id, s.id, seq.sequence, seq.distance, seq.time_offset
FROM routes r, 
LATERAL (VALUES
    ('Kempegowda Bus Station (Majestic)', 1, 0, 0),
    ('Shantinagar Bus Station', 2, 3, 10),
    ('Forum Mall Koramangala', 3, 8, 25),
    ('Sony World Junction', 4, 9, 28),
    ('Koramangala 4th Block', 5, 10, 32),
    ('Koramangala 8th Block', 6, 12, 38),
    ('HSR Layout Sector 1', 7, 15, 46),
    ('HSR Layout BDA Complex', 8, 17, 52),
    ('Bommanahalli', 9, 20, 60),
    ('Kudlu Gate', 10, 23, 68),
    ('Hosa Road', 11, 25, 74),
    ('Electronic City Phase 1', 12, 29, 85),
    ('Infosys Electronic City', 13, 31, 92),
    ('Electronic City Bus Station', 14, 33, 98)
) AS seq(stop_name, sequence, distance, time_offset)
JOIN stops s ON s.name = seq.stop_name
WHERE r.route_number = '500A';


-- =====================================================
-- VEHICLES (Sample BMTC Buses)
-- =====================================================

INSERT INTO vehicles (vehicle_number, route_id, transport_type, current_stop_id, status)
SELECT 
    v.vehicle_number,
    r.id,
    'bus',
    s.id,
    v.status
FROM (VALUES
    ('KA-01-F-1234', 'V-500C', 'Silk Board Junction', 'running'),
    ('KA-01-F-1235', 'V-500C', 'Electronic City Bus Station', 'running'),
    ('KA-01-F-1236', 'V-500C', 'Kempegowda Bus Station (Majestic)', 'running'),
    ('KA-01-F-2345', 'V-500CA', 'Koramangala 1st Block', 'running'),
    ('KA-01-F-2346', 'V-500CA', 'HSR Layout BDA Complex', 'running'),
    ('KA-01-F-3456', 'V-500NA', 'Marathahalli', 'running'),
    ('KA-01-F-3457', 'V-500NA', 'Indiranagar 100 Feet Road', 'running'),
    ('KA-01-F-3458', 'V-500NA', 'ITPL (International Tech Park)', 'running'),
    ('KA-01-F-4567', 'V-335E', 'MG Road', 'running'),
    ('KA-01-F-4568', 'V-335E', 'Bellandur', 'running'),
    ('KA-01-F-5678', 'V-356', 'Hebbal Flyover', 'running'),
    ('KA-01-F-5679', 'V-356', 'Manyata Tech Park', 'running'),
    ('KA-01-F-6789', 'KIA-4', 'Yelahanka', 'running'),
    ('KA-01-F-6790', 'KIA-4', 'Kempegowda International Airport', 'running'),
    ('KA-01-F-7890', 'KIA-7', 'MG Road', 'running'),
    ('KA-01-F-8901', '401', 'Jayanagar 4th Block TTMC', 'running'),
    ('KA-01-F-8902', '401', 'BTM Layout 2nd Stage', 'running'),
    ('KA-01-F-8903', '401', 'Electronic City Bus Station', 'running'),
    ('KA-01-F-9012', '201', 'Indiranagar Metro Station', 'running'),
    ('KA-01-F-9013', '201', 'Marathahalli', 'running'),
    ('KA-01-F-9014', '201', 'Whitefield TTMC', 'running'),
    ('KA-01-F-1123', '276', 'Mekhri Circle', 'running'),
    ('KA-01-F-1124', '276', 'Yelahanka', 'running'),
    ('KA-01-F-2234', '210', 'Basavanagudi', 'running'),
    ('KA-01-F-2235', '210', 'Banashankari TTMC', 'running'),
    ('KA-01-F-3345', '252', 'Vijayanagar TTMC', 'running'),
    ('KA-01-F-3346', '252', 'Kengeri TTMC', 'running'),
    ('KA-01-F-4456', '365', 'Bellandur', 'running'),
    ('KA-01-F-4457', '365', 'Marathahalli', 'running'),
    ('KA-01-F-5567', '500A', 'Koramangala 4th Block', 'running'),
    ('KA-01-F-5568', '500A', 'HSR Layout BDA Complex', 'running')
) AS v(vehicle_number, route_number, stop_name, status)
JOIN routes r ON r.route_number = v.route_number
JOIN stops s ON s.name = v.stop_name;

-- Update vehicle positions based on their current stops
UPDATE vehicles v
SET 
    current_latitude = s.latitude,
    current_longitude = s.longitude
FROM stops s
WHERE v.current_stop_id = s.id;