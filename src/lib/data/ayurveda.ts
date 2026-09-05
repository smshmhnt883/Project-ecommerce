export interface BotanicalIngredient {
  name: string;
  sanskritName: string;
  botanicalName: string;
  category: string;
  image: string;
  tagline: string;
  description: string;
  traditionalRole: string;
  foundInProducts: { name: string; slug: string }[];
}

export const INGREDIENTS_SPOTLIGHT: BotanicalIngredient[] = [
  {
    name: 'Amla (Indian Gooseberry)',
    sanskritName: 'Amalaki (धात्री)',
    botanicalName: 'Emblica officinalis',
    category: 'Rasayana & Vitamin C',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
    tagline: 'The supreme rejuvenating fruit of classical Ayurveda',
    description: 'Amla is one of the most revered fruits in the Charaka Samhita. Naturally packed with potent Vitamin C, polyphenols, and bio-flavonoids that remain stable even after gentle heating.',
    traditionalRole: 'Pacifies all three Tridoshas; extensively used in classical Rasayana formulations to support natural immunity, digestion, and hair follicle strength.',
    foundInProducts: [
      { name: 'Patanjali Special Chyawanprash', slug: 'special-chyawanprash' },
      { name: 'Kesh Kanti Hair Expert Oil', slug: 'kesh-kanti-herbal-hair-expert-oil' },
      { name: 'Divya Triphala Churna', slug: 'divya-triphala-churna' },
    ],
  },
  {
    name: 'Neem',
    sanskritName: 'Nimba (अरिष्ट)',
    botanicalName: 'Azadirachta indica',
    category: 'Purifying Botanical',
    image: 'https://images.unsplash.com/photo-1608248597359-5231c518b3ff?q=80&w=800&auto=format&fit=crop',
    tagline: 'Nature\'s bitter defender for deep skin cleansing',
    description: 'Revered in Indian folk medicine as the "village pharmacy". Neem contains nimbin and azadirachtin bio-compounds recognized for their astringent and antibacterial properties.',
    traditionalRole: 'Classified in Dravyaguna as Tikta (bitter) and Sheeta (cooling); traditionally utilized for cooling Pitta heat, clearing skin impurities, and supporting dental health.',
    foundInProducts: [
      { name: 'Saundarya Neem Tulsi Face Wash', slug: 'saundarya-neem-tulsi-face-wash' },
      { name: 'Dant Kanti Dental Cream', slug: 'dant-kanti-dental-cream' },
      { name: 'Kesh Kanti Anti-Dandruff Shampoo', slug: 'kesh-kanti-anti-dandruff-shampoo' },
    ],
  },
  {
    name: 'Aloe Vera',
    sanskritName: 'Ghritkumari (घृतकुमारी)',
    botanicalName: 'Aloe barbadensis',
    category: 'Hydration & Soothing',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    tagline: 'A succulent reservoir of soothing polysaccharides',
    description: 'Thriving in arid soil, Aloe leaves store a nutrient-dense inner gel composed of 99% structured water, mucilage, minerals, and restorative enzymes.',
    traditionalRole: 'A celebrated Pitta-pacifying herb known for its snigdha (unctuous) and sheeta (cooling) qualities, gently hydrating the dermal barrier and soothing redness.',
    foundInProducts: [
      { name: 'Saundarya Aloe Vera Gel', slug: 'saundarya-aloe-vera-gel' },
      { name: 'Saundarya Aloe Vera Kesar Chandan Gel', slug: 'saundarya-aloe-vera-kesar-chandan-gel' },
      { name: 'Saundarya Swarna Kanti Cream', slug: 'saundarya-swarna-kanti-cream' },
    ],
  },
  {
    name: 'Tulsi (Holy Basil)',
    sanskritName: 'Surasa (तुलसी)',
    botanicalName: 'Ocimum sanctum',
    category: 'Adaptogen & Elixir',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
    tagline: 'The fragrant queen of herbs for inner and outer balance',
    description: 'An aromatic holy herb laden with eugenol, camphor, and bio-terpenes. Cherished across Indian households for its invigorating aroma and balancing properties.',
    traditionalRole: 'Warming and Kapha-Vata balancing; celebrated for clearing prana channels, easing respiratory congestion, and providing topical antioxidant defense.',
    foundInProducts: [
      { name: 'Saundarya Neem Tulsi Face Wash', slug: 'saundarya-neem-tulsi-face-wash' },
      { name: 'Special Chyawanprash', slug: 'special-chyawanprash' },
    ],
  },
  {
    name: 'Haldi (Turmeric)',
    sanskritName: 'Haridra (हरिद्रा)',
    botanicalName: 'Curcuma longa',
    category: 'Golden Anti-Oxidant',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800&auto=format&fit=crop',
    tagline: 'Vedic golden rhizome with proven restorative power',
    description: 'The sun-colored root contains curcuminoids and essential volatile oils that impart deep golden color and multi-system cellular support.',
    traditionalRole: 'Varnya (complexion-illuminating) and Vishaghna (toxin-clearing); foundational to Ayurvedic wellness diets and traditional ubtan bathing pastes.',
    foundInProducts: [
      { name: 'Dant Kanti Dental Cream', slug: 'dant-kanti-dental-cream' },
      { name: 'Special Chyawanprash', slug: 'special-chyawanprash' },
    ],
  },
  {
    name: 'Sandalwood',
    sanskritName: 'Chandana (चन्दन)',
    botanicalName: 'Santalum album',
    category: 'Aromatic & Calming',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    tagline: 'The noble cooling heartwood of ancient forests',
    description: 'Prized for millennia for its serene woody scent and gentle skin-calming santalols, Sandalwood paste is an emblem of Indian ritual purity and serenity.',
    traditionalRole: 'Sheeta Virya (cold potency); traditionally applied to soothe excess body heat, cool irritated skin, and promote meditative peacefulness.',
    foundInProducts: [
      { name: 'Saundarya Aloe Vera Kesar Chandan Gel', slug: 'saundarya-aloe-vera-kesar-chandan-gel' },
      { name: 'Saundarya Swarna Kanti Cream', slug: 'saundarya-swarna-kanti-cream' },
    ],
  },
];
