import { hashString } from './random';
import { firstName } from './sanitize';

export const RELATION_GROUPS = [
  {
    label: 'Elders in the family',
    options: [
      { value: 'maa', label: 'Mother' },
      { value: 'papa', label: 'Father' },
      { value: 'grandfather', label: 'Grandfather' },
      { value: 'grandmother', label: 'Grandmother' },
      { value: 'bhaiya', label: 'Elder brother' },
      { value: 'didi', label: 'Elder sister' },
      { value: 'uncle', label: 'Uncle' },
      { value: 'aunt', label: 'Aunt' },
      { value: 'brother_in_law', label: 'Brother-in-law' },
      { value: 'sister_in_law', label: 'Sister-in-law' },
      { value: 'father_in_law', label: 'Father-in-law' },
      { value: 'mother_in_law', label: 'Mother-in-law' },
      { value: 'elder', label: 'Another elder' },
    ],
  },
  {
    label: 'Family and loved ones',
    options: [
      { value: 'son', label: 'Son' },
      { value: 'daughter', label: 'Daughter' },
      { value: 'husband', label: 'Husband' },
      { value: 'wife', label: 'Wife' },
      { value: 'partner', label: 'Partner' },
      { value: 'sibling', label: 'Younger brother or sister' },
      { value: 'cousin', label: 'Cousin' },
      { value: 'nephew', label: 'Nephew' },
      { value: 'niece', label: 'Niece' },
      { value: 'grandchild', label: 'Grandchild' },
    ],
  },
  {
    label: 'Friends and others',
    options: [
      { value: 'bestie', label: 'Best friend' },
      { value: 'friend', label: 'Friend' },
      { value: 'teacher', label: 'Teacher or mentor' },
      { value: 'senior', label: 'Boss or senior' },
      { value: 'colleague', label: 'Colleague' },
      { value: 'neighbour', label: 'Neighbour' },
      { value: 'student', label: 'Student' },
    ],
  },
];

const RELATIONS = RELATION_GROUPS.flatMap((group) => group.options);

// Elders are never shown by name: it is disrespectful to address them that way.
const ELDER_RELATIONS = new Set([
  ...RELATION_GROUPS[0].options.map((option) => option.value),
  'teacher',
  'senior',
]);
const ELDER_TITLES = {
  maa: { en: 'Mom', hi: 'माँ', bn: 'মা' },
  papa: { en: 'Dad', hi: 'पापा', bn: 'বাবা' },
  grandfather: { en: 'Grandpa', hi: 'दादाजी', bn: 'দাদু' },
  grandmother: { en: 'Grandma', hi: 'दादीजी', bn: 'দিদা' },
  bhaiya: { en: 'Brother', hi: 'भैया', bn: 'দাদা' },
  didi: { en: 'Sister', hi: 'दीदी', bn: 'দিদি' },
  uncle: { en: 'Uncle', hi: 'अंकल', bn: 'কাকু' },
  aunt: { en: 'Aunt', hi: 'आंटी', bn: 'কাকিমা' },
  brother_in_law: { en: 'Brother', hi: 'जीजाजी', bn: 'জামাইবাবু' },
  sister_in_law: { en: 'Sister', hi: 'भाभी', bn: 'বৌদি' },
  father_in_law: { hi: 'पापाजी', bn: 'বাবা' },
  mother_in_law: { hi: 'मम्मीजी', bn: 'মা' },
};
// In Bengali these elders take the formal "your", where close family takes the familiar one.
const FORMAL_IN_BENGALI = new Set(['teacher', 'senior', 'elder', 'father_in_law', 'mother_in_law']);

export const isElder = (relation) => ELDER_RELATIONS.has(relation);

/** What an elder is called instead of their name, if the relation gives a title. */
export const elderTitle = ({ relation, lang }) => ELDER_TITLES[relation]?.[lang] ?? null;

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
    festival: 'Happy Diwali',
    title: (name) => `Happy Diwali, ${name}`,
    sign: (name) => `With love and light, ${name}`,
    relation: {
      maa: 'To the one who lights up every Diwali before anyone else wakes up.',
      papa: 'To the one who always kept the crackers safe and the sweets plenty.',
      bestie: 'To my partner in every crazy plan, and every plate of kaju katli.',
      sibling: 'To my forever rival for the last laddoo.',
      partner: "To the light I'd choose on every night, not just this one.",
      teacher: 'To the one who taught me that light only grows when you share it.',
      elder: 'To the one whose blessings make every Diwali feel like home.',
      bhaiya: 'To the brother who always looked out for me, and still lets me win the last sweet.',
      didi: 'To the sister who always looked out for me, and still saves me the last sweet.',
      friend: 'To someone who makes every festival brighter just by showing up.',
      grandfather: 'To the one whose stories make every Diwali feel timeless.',
      grandmother: 'To the one whose hands made every Diwali sweeter.',
      uncle: 'To the one who always made our family festivals more fun.',
      aunt: 'To the one who has always loved me like her own.',
      brother_in_law: 'To the one who made our family bigger and our festivals louder.',
      sister_in_law: 'To the one who brought new light into our home.',
      father_in_law: 'To the one who welcomed me into the family with open arms.',
      mother_in_law: 'To the one who made this home feel like mine.',
      senior: 'To the one whose guidance keeps lighting my way.',
      son: 'To my son, the brightest light of my every Diwali.',
      daughter: 'To my daughter, the brightest light of my every Diwali.',
      husband: 'To the one who makes an ordinary day feel like a festival.',
      wife: 'To the one who makes our home glow, every day of the year.',
      cousin: 'To my partner in every childhood Diwali adventure.',
      nephew: 'To the boy who brings joy wherever he goes.',
      niece: 'To the girl who brings joy wherever she goes.',
      grandchild: 'To the little light who makes all my festivals brighter.',
      colleague: 'To the one who makes even the busiest days brighter.',
      neighbour: 'To the neighbour who feels just like family.',
      student: 'To a bright flame I have been proud to watch grow.',
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
    festival: 'शुभ दीपावली',
    title: (name) => `शुभ दीपावली, ${name}`,
    sign: (name) => `ढेर सारे प्यार के साथ, ${name}`,
    relation: {
      maa: 'उस माँ के लिए, जो हर दीवाली सबसे पहले जागकर घर रोशन करती है।',
      papa: 'उन पापा के लिए, जिन्होंने पटाखे हमेशा सुरक्षित और मिठाइयाँ भरपूर रखीं।',
      bestie: 'मेरे हर पागल प्लान और हर काजू कतली के साथी के लिए।',
      sibling: 'आख़िरी लड्डू के लिए मेरे हमेशा के प्रतिद्वंद्वी के लिए।',
      partner: 'उस रोशनी के लिए, जिसे मैं हर रात चुनूँ, सिर्फ़ आज नहीं।',
      teacher: 'जिन्होंने सिखाया कि रोशनी बाँटने से बढ़ती है।',
      elder: 'उनके लिए, जिनके आशीर्वाद से हर दीपावली घर जैसी लगती है।',
      bhaiya: 'उस भैया के लिए, जिन्होंने हमेशा मेरा ख़याल रखा और आख़िरी मिठाई भी मुझे दी।',
      didi: 'उस दीदी के लिए, जिन्होंने हमेशा मेरा ख़याल रखा और आख़िरी मिठाई भी मुझे दी।',
      friend: 'उस दोस्त के लिए, जिसके आने भर से हर त्योहार रोशन हो जाता है।',
      grandfather: 'उनके लिए, जिनकी कहानियों से हर दीपावली यादगार बन जाती है।',
      grandmother: 'उनके लिए, जिनके हाथों से हर दीपावली और मीठी हो जाती है।',
      uncle: 'उनके लिए, जिनसे हमारे परिवार के हर त्योहार में रौनक आ जाती है।',
      aunt: 'उनके लिए, जिन्होंने मुझे हमेशा अपने बच्चे जैसा प्यार दिया।',
      brother_in_law: 'उनके लिए, जिनसे हमारा परिवार बड़ा और त्योहार और भी रंगीन हो गया।',
      sister_in_law: 'उनके लिए, जो हमारे घर में नई रोशनी लेकर आईं।',
      father_in_law: 'उनके लिए, जिन्होंने मुझे खुले दिल से परिवार में अपनाया।',
      mother_in_law: 'उनके लिए, जिन्होंने इस घर को मेरा अपना बना दिया।',
      senior: 'उनके लिए, जिनका मार्गदर्शन मेरी राह रोशन करता रहता है।',
      son: 'मेरे बेटे के लिए, जो मेरी हर दीपावली की सबसे प्यारी रोशनी है।',
      daughter: 'मेरी बेटी के लिए, जो मेरी हर दीपावली की सबसे प्यारी रोशनी है।',
      husband: 'उनके लिए, जिनके साथ हर आम दिन त्योहार जैसा लगता है।',
      wife: 'उनके लिए, जिनसे हमारा घर साल भर जगमगाता रहता है।',
      cousin: 'बचपन की हर दीपावली की शरारतों के मेरे साथी के लिए।',
      nephew: 'उसके लिए, जो जहाँ जाता है वहाँ ख़ुशियाँ ले आता है।',
      niece: 'उसके लिए, जो जहाँ जाती है वहाँ ख़ुशियाँ ले आती है।',
      grandchild: 'उस नन्ही रोशनी के लिए, जिससे मेरे सारे त्योहार रोशन हैं।',
      colleague: 'उनके लिए, जिनसे सबसे व्यस्त दिन भी अच्छे लगने लगते हैं।',
      neighbour: 'उस पड़ोसी के लिए, जो बिल्कुल परिवार जैसा है।',
      student: 'उस उजली लौ के लिए, जिसे बढ़ते देखकर मुझे गर्व होता है।',
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
    festival: 'শুভ দীপাবলি',
    title: (name) => `শুভ দীপাবলি, ${name}`,
    sign: (name) => `অনেক ভালোবাসা সহ, ${name}`,
    relation: {
      maa: 'মায়ের জন্য, যে প্রতি দীপাবলিতে সবার আগে ঘর আলো করে তোলে।',
      papa: 'বাবার জন্য, যে সবসময় বাজি নিরাপদে আর মিষ্টি ভরপুর রেখেছে।',
      bestie: 'আমার সব পাগলামির আর সব মিষ্টির সঙ্গীর জন্য।',
      sibling: 'শেষ লাড্ডুর জন্য আমার চিরকালের প্রতিদ্বন্দ্বীর জন্য।',
      partner: 'সেই আলোর জন্য, যাকে আমি প্রতি রাতে বেছে নেব, শুধু আজ নয়।',
      teacher: 'যিনি শিখিয়েছেন, আলো ভাগ করলে তা বাড়ে।',
      elder: 'তাঁর জন্য, যাঁর আশীর্বাদে প্রতিটি দীপাবলি ঘরের মতো লাগে।',
      bhaiya: 'সেই দাদার জন্য, যে সবসময় আমার খেয়াল রেখেছে আর শেষ মিষ্টিটাও আমাকে দিয়েছে।',
      didi: 'সেই দিদির জন্য, যে সবসময় আমার খেয়াল রেখেছে আর শেষ মিষ্টিটাও আমাকে দিয়েছে।',
      friend: 'সেই বন্ধুর জন্য, যে এলেই সব উৎসব আলোয় ভরে যায়।',
      grandfather: 'যাঁর গল্পে প্রতিটি দীপাবলি স্মরণীয় হয়ে ওঠে, তাঁর জন্য।',
      grandmother: 'যাঁর হাতের ছোঁয়ায় প্রতিটি দীপাবলি আরও মিষ্টি হয়ে ওঠে, তাঁর জন্য।',
      uncle: 'যাঁর জন্য আমাদের পরিবারের সব উৎসব আরও আনন্দের হয়, তাঁর জন্য।',
      aunt: 'যিনি আমাকে সবসময় নিজের সন্তানের মতো ভালোবেসেছেন, তাঁর জন্য।',
      brother_in_law: 'যাঁর জন্য আমাদের পরিবার বড় আর উৎসব আরও রঙিন হয়েছে, তাঁর জন্য।',
      sister_in_law: 'যিনি আমাদের বাড়িতে নতুন আলো নিয়ে এসেছেন, তাঁর জন্য।',
      father_in_law: 'যিনি আমাকে খোলা মনে পরিবারে গ্রহণ করেছেন, তাঁর জন্য।',
      mother_in_law: 'যিনি এই বাড়িটাকে আমার নিজের করে তুলেছেন, তাঁর জন্য।',
      senior: 'যাঁর পথনির্দেশ আমার পথ আলোকিত করে চলেছে, তাঁর জন্য।',
      son: 'আমার ছেলের জন্য, আমার প্রতিটি দীপাবলির সবচেয়ে উজ্জ্বল আলো।',
      daughter: 'আমার মেয়ের জন্য, আমার প্রতিটি দীপাবলির সবচেয়ে উজ্জ্বল আলো।',
      husband: 'যার সঙ্গে প্রতিটি সাধারণ দিন উৎসবের মতো লাগে, তার জন্য।',
      wife: 'যার জন্য আমাদের ঘর সারা বছর আলোয় ভরে থাকে, তার জন্য।',
      cousin: 'ছোটবেলার প্রতিটি দীপাবলির দুষ্টুমির সঙ্গীর জন্য।',
      nephew: 'যে যেখানে যায় সেখানেই আনন্দ নিয়ে আসে, তার জন্য।',
      niece: 'যে যেখানে যায় সেখানেই আনন্দ নিয়ে আসে, তার জন্য।',
      grandchild: 'সেই ছোট্ট আলোর জন্য, যার জন্য আমার সব উৎসব উজ্জ্বল।',
      colleague: 'যার জন্য সবচেয়ে ব্যস্ত দিনও ভালো লাগে, তার জন্য।',
      neighbour: 'সেই প্রতিবেশীর জন্য, যে একেবারে পরিবারের মতো।',
      student: 'সেই উজ্জ্বল শিখার জন্য, যাকে বেড়ে উঠতে দেখে আমি গর্বিত।',
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
export function fallbackWish({ from, to, relation, lang }) {
  const { wishes } = TEXT[lang] ?? TEXT.en;
  const wish = wishes[hashString(`${from}|${to}`) % wishes.length];
  const formal = lang === 'bn' && FORMAL_IN_BENGALI.has(relation);
  return formal ? wish.replaceAll('তোমার', 'আপনার') : wish;
}

/** How the greeting addresses its recipient: an elder's title, or else nothing, or their name. */
function addressFor({ to, relation, lang }) {
  return isElder(relation) ? elderTitle({ relation, lang }) : to;
}

/** The words the fireworks spell in the sky. */
export function skyText(greeting) {
  const address = addressFor(greeting);
  if (!address) return (TEXT[greeting.lang] ?? TEXT.en).festival;
  return isElder(greeting.relation) ? address : firstName(address);
}

/** The fixed lines around the wish on a message card. */
export function cardLines({ from, to, relation, lang }) {
  const text = TEXT[lang] ?? TEXT.en;
  const address = addressFor({ to, relation, lang });
  return {
    title: address ? text.title(address) : text.festival,
    relationLine: text.relation[relation] ?? text.relation.friend,
    sign: text.sign(from),
  };
}
