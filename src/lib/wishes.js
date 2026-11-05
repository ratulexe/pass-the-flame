import { hashString } from './random';

export const RELATIONS = [
  { value: 'maa', label: 'Maa' },
  { value: 'papa', label: 'Papa' },
  { value: 'bestie', label: 'Best friend' },
  { value: 'sibling', label: 'Brother or sister' },
  { value: 'partner', label: 'Partner' },
  { value: 'teacher', label: 'Teacher or mentor' },
  { value: 'friend', label: 'Friend' },
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'bn', label: 'বাংলা' },
];

export const LANGUAGE_NAMES = { en: 'English', hi: 'Hindi', bn: 'Bengali' };

export const relationLabel = (relation) =>
  RELATIONS.find(({ value }) => value === relation)?.label ?? 'Friend';

const TEXT = {
  en: {
    title: (name) => `Happy Diwali, ${name}`,
    sign: (name) => `With love and light, ${name}`,
    relation: {
      maa: 'To the one who lights up every Diwali before anyone else wakes up.',
      papa: 'To the one who always kept the crackers safe and the sweets plenty.',
      bestie: 'To my partner in every crazy plan, and every plate of kaju katli.',
      sibling: 'To my forever rival for the last laddoo.',
      partner: "To the light I'd choose on every night, not just this one.",
      teacher: 'To the one who taught me that light only grows when you share it.',
      friend: 'To someone who makes every festival brighter just by showing up.',
    },
    wishes: [
      'May this Diwali fill your home with a light that stays all year.',
      'May every lamp tonight brighten a corner of the year ahead of you.',
      "Wishing you sweets without counting, laughter without pause, and a year as bright as tonight's sky.",
      'May your home stay full of warmth, and your heart fuller still, long after the lamps go out.',
      'One diya can light a hundred more and never lose its flame. Thank you for being that diya for me.',
      'May the rangoli at your door welcome only good news this year.',
    ],
  },
  hi: {
    title: (name) => `शुभ दीपावली, ${name}`,
    sign: (name) => `ढेर सारे प्यार के साथ, ${name}`,
    relation: {
      maa: 'उस माँ के लिए, जो हर दीवाली सबसे पहले जागकर घर रोशन करती है।',
      papa: 'उन पापा के लिए, जिन्होंने पटाखे हमेशा सुरक्षित और मिठाइयाँ भरपूर रखीं।',
      bestie: 'मेरे हर पागल प्लान और हर काजू कतली के साथी के लिए।',
      sibling: 'आख़िरी लड्डू के लिए मेरे हमेशा के प्रतिद्वंद्वी के लिए।',
      partner: 'उस रोशनी के लिए, जिसे मैं हर रात चुनूँ, सिर्फ़ आज नहीं।',
      teacher: 'जिन्होंने सिखाया कि रोशनी बाँटने से बढ़ती है।',
      friend: 'उस दोस्त के लिए, जिसके आने भर से हर त्योहार रोशन हो जाता है।',
    },
    wishes: [
      'यह दीवाली आपके घर को ऐसी रोशनी से भर दे, जो पूरे साल जगमगाती रहे।',
      'आज रात का हर दीया आपके आने वाले साल का एक कोना रोशन करे।',
      'मिठाइयाँ बेहिसाब हों, हँसी बेशुमार हो, और आपका साल आज के आसमान जितना रोशन हो।',
      'दीये बुझने के बाद भी आपका घर अपनेपन से और आपका दिल ख़ुशियों से भरा रहे।',
      'एक दीया सौ दीये जला सकता है, फिर भी उसकी लौ कम नहीं होती। मेरी ज़िंदगी में वह दीया बनने के लिए शुक्रिया।',
      'आपके दरवाज़े की रंगोली इस साल सिर्फ़ ख़ुशख़बरियों का स्वागत करे।',
    ],
  },
  bn: {
    title: (name) => `শুভ দীপাবলি, ${name}`,
    sign: (name) => `অনেক ভালোবাসা সহ, ${name}`,
    relation: {
      maa: 'মায়ের জন্য, যে প্রতি দীপাবলিতে সবার আগে ঘর আলো করে তোলে।',
      papa: 'বাবার জন্য, যে সবসময় বাজি নিরাপদে আর মিষ্টি ভরপুর রেখেছে।',
      bestie: 'আমার সব পাগলামির আর সব মিষ্টির সঙ্গীর জন্য।',
      sibling: 'শেষ লাড্ডুর জন্য আমার চিরকালের প্রতিদ্বন্দ্বীর জন্য।',
      partner: 'সেই আলোর জন্য, যাকে আমি প্রতি রাতে বেছে নেব, শুধু আজ নয়।',
      teacher: 'যিনি শিখিয়েছেন, আলো ভাগ করলে তা বাড়ে।',
      friend: 'সেই বন্ধুর জন্য, যে এলেই সব উৎসব আলোয় ভরে যায়।',
    },
    wishes: [
      'এই দীপাবলি তোমার ঘর এমন আলোয় ভরিয়ে দিক, যা সারা বছর জ্বলে থাকে।',
      'আজ রাতের প্রতিটি প্রদীপ তোমার আগামী বছরের এক একটি কোণ আলোকিত করুক।',
      'মিষ্টি হোক অগুনতি, হাসি হোক অফুরান, আর বছরটা হোক আজকের আকাশের মতো উজ্জ্বল।',
      'শুভ দীপাবলি! তোমার জীবনে আসুক সুখ, শান্তি আর সমৃদ্ধি।',
      'একটা প্রদীপ শত প্রদীপ জ্বালাতে পারে, তবু তার শিখা কমে না। আমার জীবনে সেই প্রদীপ হওয়ার জন্য ধন্যবাদ।',
      'তোমার দরজার আলপনা এ বছর শুধু সুখবরকেই স্বাগত জানাক।',
    ],
  },
};

/** Handwritten wish, stable for a given sender and recipient. */
export function fallbackWish({ from, to, lang }) {
  const { wishes } = TEXT[lang] ?? TEXT.en;
  return wishes[hashString(`${from}|${to}`) % wishes.length];
}

/** The fixed lines around the wish on a message card. */
export function cardLines({ from, to, relation, lang }) {
  const text = TEXT[lang] ?? TEXT.en;
  return {
    title: text.title(to),
    relationLine: text.relation[relation] ?? text.relation.friend,
    sign: text.sign(from),
  };
}
