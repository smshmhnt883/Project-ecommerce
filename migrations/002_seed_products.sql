-- Seed 10 Authentic Patanjali Products

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-001',
  'Patanjali Dant Kanti Natural Toothpaste',
  'dant-kanti-natural-toothpaste',
  'Patanjali Dant Kanti Natural Toothpaste is formulated with Babool, Neem, Akarkara, Bakul, and Clove oil. Designed to cleanse teeth, strengthen sensitive gums, prevent plaque buildup, and deliver long-lasting botanical freshness.',
  'Time-tested herbal dental cream enriched with 13 potent Ayurvedic herbs for total oral protection and gum health.',
  'Oral Care',
  'Herbal Toothpaste',
  60,
  65,
  8,
  'PAT-ORAL-001',
  450,
  '100 g',
  'g',
  '[{"name":"Akarkara","botanicalName":"Anacyclus pyrethrum","purpose":"Supports gum sensitivity reduction"},{"name":"Neem","botanicalName":"Azadirachta indica","purpose":"Natural antibacterial agent"},{"name":"Babool","botanicalName":"Acacia arabica","purpose":"Astringent for firm gum tissue"},{"name":"Tomar Seed","botanicalName":"Zanthoxylum alatum","purpose":"Tooth enamel defense"},{"name":"Laung (Clove)","botanicalName":"Syzygium aromaticum","purpose":"Traditional soothing agent & fresh aroma"},{"name":"Pudina","botanicalName":"Mentha spicata","purpose":"Natural breath freshener"},{"name":"Bakul","botanicalName":"Mimusops elengi","purpose":"Oral tissue toning"},{"name":"Vajradanti","botanicalName":"Barleria prionitis","purpose":"Enamel strengthening"}]',
  'Brush thoroughly at least twice daily, or as directed by a dentist or physician. Children under 6 should use a pea-sized amount under adult supervision.',
  '{"benefits":["Helps maintain clean and healthy teeth without harsh chemical abrasives","Promotes firm gums through traditional astringent botanicals","Provides invigorating botanical freshness with natural spearmint and clove","Suitable for daily morning and bedtime oral care for the entire family"],"storage":"Store in a cool, dry place away from direct sunlight.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Unit-III, Patanjali Food & Herbal Park, Vill. Padartha, Laksar Road, Haridwar - 249404, Uttarakhand, India","license":"A-2878/99","shelfLife":"24 Months from packaging","countryOfOrigin":"India"},"hindiName":"दन्त कान्ति प्राकृतिक टूथपेस्ट","concernSlugs":["oral-care","daily-wellness"],"availableSizes":["100 g","200 g"]}',
  true,
  true,
  4.8,
  428
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-001', '/products/patanjali-dant-kanti.jpg', 0, 'Patanjali Dant Kanti Natural Toothpaste Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-002',
  'Patanjali Kesh Kanti Aloe Vera Hair Cleanser',
  'kesh-kanti-aloe-vera-hair-cleanser',
  'Patanjali Kesh Kanti Aloe Vera Hair Cleanser combines pure Aloe Vera gel with classical Ayurvedic herbs like Shikakai, Reetha, and Bhringraj. It gently cleanses dirt and excess sebum without stripping the natural lipid barrier of the scalp.',
  'Gentle Ayurvedic hair cleanser enriched with pure Aloe Vera, Shikakai, and Bhringraj for soft, silky, hydrated hair.',
  'Hair Care',
  'Herbal Shampoo',
  110,
  120,
  8,
  'PAT-HAIR-002',
  380,
  '200 ml',
  'ml',
  '[{"name":"Ghritkumari (Aloe Vera)","botanicalName":"Aloe barbadensis","purpose":"Hydrates hair shaft and calms scalp"},{"name":"Shikakai","botanicalName":"Acacia concinna","purpose":"Gentle natural foaming agent"},{"name":"Bhringraj","botanicalName":"Eclipta alba","purpose":"Strengthens roots and reduces breakage"},{"name":"Reetha","botanicalName":"Sapindus mukorossi","purpose":"Removes impurities naturally"},{"name":"Methi (Fenugreek)","botanicalName":"Trigonella foenum-graecum","purpose":"Conditions and softens coarse strands"}]',
  'Apply 2-5 ml to wet hair and scalp. Massage gently for 1-2 minutes to form a rich herbal lather, then rinse thoroughly with cool water.',
  '{"benefits":["Nourishes dry, brittle hair with moisture-rich Aloe Vera phyto-nutrients","Maintains healthy scalp sebum balance and natural shine","Free from harsh synthetic foaming agents and heavy silicones","Safe for regular daily or alternate-day wash routines"],"storage":"Store in a cool dry place away from heat.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Padartha, Haridwar - 249404, Uttarakhand, India","license":"UK.AY-274/2013","shelfLife":"24 Months from packaging","countryOfOrigin":"India"},"hindiName":"केश कान्ति एलोवेरा हेयर क्लींजर","concernSlugs":["hair-care"],"availableSizes":["200 ml","400 ml"]}',
  true,
  true,
  4.7,
  318
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-002', '/products/patanjali-kesh-kanti-aloe-vera.jpg', 0, 'Patanjali Kesh Kanti Aloe Vera Hair Cleanser Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-003',
  'Patanjali Saundarya Aloe Vera Gel',
  'saundarya-aloe-vera-gel',
  'Patanjali Saundarya Aloe Vera Gel is formulated from pure processed pulp of Aloe barbadensis. Enriched with natural cooling properties, this lightweight non-greasy gel replenishes moisture, calms skin after sun exposure, and helps maintain a clear, radiant complexion.',
  'Multi-purpose soothing natural aloe vera gel for face, skin nourishment, and calming scalp hydration.',
  'Skin Care',
  'Gel Moisturizer',
  95,
  110,
  14,
  'PAT-SKIN-003',
  620,
  '150 ml',
  'ml',
  '[{"name":"Ghritkumari (Aloe Vera)","botanicalName":"Aloe barbadensis","purpose":"Natural humectant and skin soother (90%)"},{"name":"Vitamin E","botanicalName":"Tocopherol","purpose":"Antioxidant skin protector"},{"name":"Purified Water base","botanicalName":"Aqua","purpose":"Hydrating vehicle"}]',
  'Apply gently on cleansed face, neck, or body twice daily. For scalp care, massage into roots 30 minutes before washing.',
  '{"benefits":["Provides instant lightweight hydration without clogging pores","Soothes skin redness, environmental distress, and minor irritation","Acts as an effective pre-shave soother and post-cleansing moisturizer","Can be applied to scalp to calm dryness and nourish roots"],"storage":"Store in a cool dry place. Keep cap tightly closed after use.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Padartha, Haridwar - 249404, Uttarakhand, India","license":"UK.AY-274/2013","shelfLife":"18 Months from packaging","countryOfOrigin":"India"},"hindiName":"सौन्दर्य एलोवेरा जेल","concernSlugs":["skin-care","daily-wellness"],"availableSizes":["60 ml","150 ml"]}',
  true,
  true,
  4.9,
  684
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-003', '/products/patanjali-aloe-vera-gel.jpg', 0, 'Patanjali Saundarya Aloe Vera Gel Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-004',
  'Patanjali 100% Pure Honey',
  'patanjali-100-percent-pure-honey',
  'Patanjali 100% Pure Honey is ethically gathered from Himalayan flora and natural apiaries across India. Cold-filtered to preserve active pollen, enzymes, and natural micronutrients, this unadulterated honey acts as a classical Ayurvedic Anupana (carrier) and natural sweetener.',
  'Naturally sourced multi-flora honey rich in natural minerals, vitamins, and bio-enzymes to support stamina.',
  'Food & Beverages',
  'Natural Honey',
  115,
  130,
  12,
  'PAT-FOOD-004',
  520,
  '250 g',
  'g',
  '[{"name":"Pure Multi-Flora Honey","botanicalName":"Apis mellifera honey","purpose":"Natural bio-active sweetener and energy booster"}]',
  'Consume 1-2 teaspoons directly or mix with warm water/milk. Do not boil honey or mix into boiling liquids as per classical Ayurvedic guidelines.',
  '{"benefits":["Rich in naturally occurring antioxidants, enzymes, and trace minerals","Acts as an effective Ayurvedic vehicle (Anupana) for herbal medicines","Excellent natural alternative to refined sugar for warm drinks and breakfast","Promotes digestive wellness and soothing throat relief"],"storage":"Store at room temperature. Honey may naturally crystallize; place jar in warm water to reliquefy.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Haridwar - 249404, Uttarakhand, India","license":"FSSAI 10014012000266","shelfLife":"18 Months from packaging","countryOfOrigin":"India"},"hindiName":"पतंजलि शुद्ध शहद","concernSlugs":["immunity-nutrition","daily-wellness"],"availableSizes":["250 g","500 g","1 kg"]}',
  true,
  true,
  4.8,
  512
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-004', '/products/patanjali-honey.jpg', 0, 'Patanjali 100% Pure Honey Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-005',
  'Patanjali Pure Cow Desi Ghee',
  'pure-cow-desi-ghee',
  'Patanjali Pure Cow Desi Ghee is churned from wholesome cow milk fat following traditional clarifying processes. Golden in color with a characteristic granular (danedaar) texture, this pure ghee is rich in short-chain fatty acids, CLA, and fat-soluble vitamins (A, D, E, K).',
  'Prepared from cow milk with authentic danedaar texture and rich aroma. Promotes vitality, digestion, and memory.',
  'Food & Beverages',
  'Vedic Ghee',
  340,
  365,
  7,
  'PAT-FOOD-005',
  390,
  '500 ml',
  'ml',
  '[{"name":"Pure Cow Milk Fat","botanicalName":"Clarified Butter","purpose":"Vedic nutrient fat source with Vitamin A, D, and CLA"}]',
  'Add a spoonful to hot cooked rice, rotis, or dal. Also suitable for traditional Ayurvedic home remedies and lamp lighting.',
  '{"benefits":["Stimulates digestive fire (Agni) and enhances nutrient absorption","Supports healthy joint lubrication and cellular longevity (Ojas)","High smoke point ideal for authentic Indian culinary preparation and tempering","Free from artificial flavors, preservatives, or adulterants"],"storage":"Store in a clean, dry place at room temperature. Keep container tightly sealed.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Haridwar - 249404, Uttarakhand, India","license":"FSSAI 10014012000266","shelfLife":"12 Months from packaging","countryOfOrigin":"India"},"hindiName":"गाय का शुद्ध देशी घी","concernSlugs":["daily-wellness","immunity-nutrition"],"availableSizes":["500 ml","1 L"]}',
  true,
  true,
  4.9,
  840
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-005', '/products/patanjali-cow-ghee.jpg', 0, 'Patanjali Pure Cow Desi Ghee Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-006',
  'Patanjali Traditional Whole Wheat Chakki Atta',
  'traditional-whole-wheat-chakki-atta',
  'Patanjali Whole Wheat Chakki Atta is made from heavy, golden wheat grains selected from the finest harvest regions of India. Ground slowly between traditional stone chakkis to prevent high heat friction, retaining the germ and bran layer for soft, nourishing rotis.',
  '100% whole wheat flour milled slowly using traditional stone chakki to retain natural dietary fiber, bran, and nutrients.',
  'Food & Beverages',
  'Staple Grains',
  48,
  52,
  8,
  'PAT-FOOD-006',
  260,
  '1 kg',
  'kg',
  '[{"name":"Whole Wheat Grain","botanicalName":"Triticum aestivum","purpose":"Complex carbohydrates, dietary fiber, and plant proteins"}]',
  'Knead with lukewarm water and let rest for 15-20 minutes before rolling out rotis, chapatis, or parathas.',
  '{"benefits":["High in natural soluble and insoluble dietary fiber to support gut motility","Produces consistently soft, aromatic rotis that remain tender for hours","Zero maida adulteration, zero artificial bleaching, and zero chemical additives","Wholesome low-glycemic daily staple for the entire family"],"storage":"Transfer into an airtight container and store in a dry, ventilated pantry.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Haridwar - 249404, Uttarakhand, India","license":"FSSAI 10014012000266","shelfLife":"3 Months from packaging","countryOfOrigin":"India"},"hindiName":"पारंपरिक सम्पूर्ण चक्की आटा","concernSlugs":["daily-wellness","digestive-wellness"],"availableSizes":["1 kg","5 kg","10 kg"]}',
  false,
  true,
  4.7,
  195
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-006', '/products/patanjali-whole-wheat-atta.jpg', 0, 'Patanjali Traditional Whole Wheat Chakki Atta Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-007',
  'Patanjali Special Chyawanprash with Saffron',
  'special-chyawanprash-with-saffron',
  'Patanjali Special Chyawanprash is an authentic classical Ayurvedic Rasayana prepared from fresh forest amla (Emblica officinalis) boiled in herbal decoctions and clarified butter. Fortified with pure Kashmiri saffron (Kesar), raw honey, and classical herbs to enhance seasonal immunity, stamina, and respiratory vitality.',
  'Ayurvedic revitalizer prepared with wild Amla pulp, saffron (kesar), raw honey, and over 40 therapeutic Himalayan botanicals.',
  'Health & Wellness',
  'Classical Rasayana',
  195,
  220,
  11,
  'PAT-WELL-007',
  410,
  '500 g',
  'g',
  '[{"name":"Fresh Amla Pulp","botanicalName":"Emblica officinalis","purpose":"Potent source of bio-available Vitamin C and tannins"},{"name":"Kesar (Saffron)","botanicalName":"Crocus sativus","purpose":"Rejuvenating antioxidant and complexion booster"},{"name":"Ashwagandha","botanicalName":"Withania somnifera","purpose":"Adaptogen for stamina and vitality"},{"name":"Pippali","botanicalName":"Piper longum","purpose":"Supports lung function and digestive bioavailability"},{"name":"Gokshura","botanicalName":"Tribulus terrestris","purpose":"Cellular endurance and strength"}]',
  'Take 1 teaspoon (approx. 10 g) twice daily, preferably followed by warm milk or water. Children may take half a teaspoon.',
  '{"benefits":["Helps build natural resistance against seasonal coughs, colds, and temperature shifts","Supports respiratory tract health and clear breathing passages","Rejuvenates tissues (Rasayana) and bolsters everyday physical energy","Suitable for adults, seniors, and growing children above 3 years"],"storage":"Store in a cool dry place. Keep jar tightly closed after each use.","manufacturer":{"name":"Divya Pharmacy / Patanjali Ayurved Limited","address":"A-1, Industrial Area, Haridwar - 249401, Uttarakhand, India","license":"Uttra.Ayu-56/2005","shelfLife":"36 Months from packaging","countryOfOrigin":"India"},"hindiName":"स्पेशल च्यवनप्राश केसर युक्त","concernSlugs":["immunity-nutrition","daily-wellness"],"availableSizes":["500 g","1 kg"]}',
  true,
  true,
  4.9,
  560
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-007', '/products/patanjali-chyawanprash.jpg', 0, 'Patanjali Special Chyawanprash with Saffron Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-008',
  'Divya Giloy Ghan Vati',
  'divya-giloy-ghan-vati',
  'Divya Giloy Ghan Vati contains concentrated aqueous extract (Ghan) of Guduchi stem (Tinospora cordifolia). Known reverently in classical Ayurveda as "Amrita" (nectar of life), Giloy helps purify the blood, balances Pitta and Kapha doshas, and supports the body''s natural immune surveillance.',
  'Pure aqueous extract of Giloy (Tinospora cordifolia). Classical Rasayana to bolster body defenses and balance Pitta.',
  'Health & Wellness',
  'Herbal Tablets',
  110,
  120,
  8,
  'PAT-WELL-008',
  580,
  '60 Tablets',
  'Tablets',
  '[{"name":"Giloy Stem Extract (Ghan)","botanicalName":"Tinospora cordifolia","purpose":"Standardized immunomodulator (500 mg per tablet)"}]',
  'Take 1 to 2 tablets twice daily with warm water after meals, or as directed by an Ayurvedic physician.',
  '{"benefits":["Assists in managing intermittent seasonal weakness and fatigue","Supports healthy platelet counts and natural detox pathways","Acts as a natural antioxidant to protect cellular resilience","Classical Tridoshic balancing supplement for daily vitality"],"storage":"Store in a cool, dark, and dry place. Keep bottle capped tightly.","manufacturer":{"name":"Divya Pharmacy","address":"Patanjali Yogpeeth, Maharishi Dayanand Gram, Haridwar - 249405, Uttarakhand, India","license":"Uttra.Ayu-117/2007","shelfLife":"24 Months from packaging","countryOfOrigin":"India"},"hindiName":"दिव्य गिलोय घन वटी","concernSlugs":["immunity-nutrition","daily-wellness"],"availableSizes":["60 Tablets"]}',
  true,
  true,
  4.8,
  380
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-008', '/products/patanjali-giloy-ghan-vati.jpg', 0, 'Divya Giloy Ghan Vati Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-009',
  'Patanjali Herbal Hand Wash with Aloe Vera',
  'herbal-hand-wash-with-aloe-vera',
  'Patanjali Herbal Hand Wash provides thorough hygienic cleansing through botanical antibacterial bio-actives. Formulated with pure Aloe Vera leaf gel and Neem extracts, it washes away grime and bacteria without stripping essential moisture from hardworking hands.',
  'Gentle botanical hand wash enriched with pure Aloe Vera, Neem, and Tulsi to cleanse effectively while preserving skin moisture.',
  'Personal Care',
  'Hand Hygiene',
  85,
  95,
  11,
  'PAT-CARE-009',
  340,
  '250 ml',
  'ml',
  '[{"name":"Ghritkumari (Aloe Vera)","botanicalName":"Aloe barbadensis","purpose":"Soothes and prevents hand roughness"},{"name":"Neem","botanicalName":"Azadirachta indica","purpose":"Natural germ protection"},{"name":"Tulsi (Holy Basil)","botanicalName":"Ocimum sanctum","purpose":"Purifying botanical essence"}]',
  'Dispense a small pump onto wet palms. Lather thoroughly for 20 seconds covering wrists, nails, and between fingers, then rinse cleanly with water.',
  '{"benefits":["Leaves hands thoroughly clean, refreshed, and subtly scented","Dermatologically gentle formulation suitable for frequent handwashing","Helps prevent the dryness often caused by harsh synthetic soaps","Convenient pump dispenser ideal for kitchen and bathroom vanities"],"storage":"Keep at room temperature away from freezing conditions.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Padartha, Haridwar - 249404, Uttarakhand, India","license":"UK.AY-274/2013","shelfLife":"24 Months from packaging","countryOfOrigin":"India"},"hindiName":"हर्बल हैंड वॉश एलोवेरा युक्त","concernSlugs":["daily-wellness"],"availableSizes":["250 ml","500 ml Refill"]}',
  false,
  false,
  4.6,
  160
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-009', '/products/patanjali-herbal-hand-wash.jpg', 0, 'Patanjali Herbal Hand Wash with Aloe Vera Packaging View 1');

INSERT INTO public.products (
  id, name, slug, description, short_description, category, subcategory,
  price, mrp, discount_percentage, sku, stock_quantity, size, unit,
  ingredients, usage, product_information, featured, bestseller, rating, review_count
) VALUES (
  'pat-010',
  'Patanjali Pure Gulab Jal Rose Water',
  'pure-gulab-jal-rose-water',
  'Patanjali Pure Gulab Jal is prepared through classical steam hydro-distillation of fragrant Indian Rosa centifolia petals. Free from synthetic perfumes and alcohol, it hydrates the skin, tightens pores, balances facial pH, and delivers a rejuvenating natural floral aroma.',
  'Hydro-distilled from freshly plucked Desi rose petals. Natural toner, skin freshener, and cooling mist for sensitive skin.',
  'Skin Care',
  'Facial Mist & Toner',
  65,
  75,
  13,
  'PAT-SKIN-010',
  490,
  '250 ml',
  'ml',
  '[{"name":"Desi Gulab Petal Distillate","botanicalName":"Rosa centifolia aqua","purpose":"Pure hydro-distilled natural floral toner"}]',
  'Spray directly over face and neck, or dab with a clean cotton pad morning and evening after cleansing.',
  '{"benefits":["Immediately cools fatigued facial skin and soothes environmental irritation","Acts as a gentle alcohol-free toner before serums and moisturizers","Ideal base for preparing homemade herbal ubtans, clay packs, and masks","Can be applied onto cotton pads as a relaxing cooling eye compress"],"storage":"Store in a cool dry place. Can be refrigerated for an extra cooling sensation.","manufacturer":{"name":"Patanjali Ayurved Limited","address":"Patanjali Food & Herbal Park, Padartha, Haridwar - 249404, Uttarakhand, India","license":"UK.AY-274/2013","shelfLife":"18 Months from packaging","countryOfOrigin":"India"},"hindiName":"शुद्ध गुलाब जल","concernSlugs":["skin-care","daily-wellness"],"availableSizes":["120 ml","250 ml"]}',
  true,
  false,
  4.8,
  290
) ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  stock_quantity = EXCLUDED.stock_quantity;

INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text)
VALUES ('pat-010', '/products/patanjali-gulab-jal.jpg', 0, 'Patanjali Pure Gulab Jal Rose Water Packaging View 1');

