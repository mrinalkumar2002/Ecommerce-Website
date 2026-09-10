const REVIEW_POOL = {
  "elec-001": { rating: 4.8, reviewCount: 2341, reviews: [
    {
      id: 1,
      name: "Aryan Sharma",
      nameHi: "आर्यन शर्मा",
      avatar: "AS",
      date: "Aug 2, 2026",
      dateHi: "2 अगस्त, 2026",
      rating: 5,
      text: "Absolutely stunning phone. The titanium build feels premium and camera quality is unreal. Worth every rupee!",
      textHi: "बिल्कुल शानदार फोन है। टाइटेनियम बॉडी बेहद प्रीमियम लगती है और कैमरा क्वालिटी लाजवाब है। हर रुपया वसूल!"
    },
    {
      id: 2,
      name: "Priya Verma",
      nameHi: "प्रिया वर्मा",
      avatar: "PV",
      date: "Jul 28, 2026",
      dateHi: "28 जुलाई, 2026",
      rating: 5,
      text: "Switched from Android and blown away. A17 Pro handles everything effortlessly. Battery life is great too.",
      textHi: "एंड्रॉयड से आईफोन पर स्विच किया और बहुत खुश हूँ। A17 Pro प्रोसेसर सब कुछ बहुत तेजी से संभालता है। बैटरी लाइफ भी बेहतरीन है।"
    },
    {
      id: 3,
      name: "Rohit Nair",
      nameHi: "रोहित नायर",
      avatar: "RN",
      date: "Jul 20, 2026",
      dateHi: "20 जुलाई, 2026",
      rating: 4,
      text: "Excellent phone overall. 5x telephoto is a game-changer. Slightly pricey but quality is top-notch.",
      textHi: "कुल मिलाकर बेहतरीन फोन। 5x टेलीफ़ोटो लेंस कमाल का है। थोड़ा महंगा है लेकिन क्वालिटी अव्वल दर्जे की है।"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      nameHi: "स्नेहा गुप्ता",
      avatar: "SG",
      date: "Jul 15, 2026",
      dateHi: "15 जुलाई, 2026",
      rating: 5,
      text: "Best iPhone ever. Action button is super useful and FaceID is blazingly fast.",
      textHi: "अब तक का सबसे बेहतरीन iPhone। एक्शन बटन काफी उपयोगी है और FaceID बहुत तेज़ काम करता है।"
    },
  ]},
  "elec-002": { rating: 2.7, reviewCount: 1876, reviews: [
    {
      id: 1,
      name: "Karan Mehta",
      nameHi: "करण मेहता",
      avatar: "KM",
      date: "Aug 5, 2026",
      dateHi: "5 अगस्त, 2026",
      rating: 3,
      text: "Phone gets warm very quickly during charging and battery backup is average for the price.",
      textHi: "चार्जिंग के दौरान फोन जल्दी गर्म हो जाता है और इस कीमत के हिसाब से बैटरी बैकअप सामान्य है।"
    },
    {
      id: 2,
      name: "Divya Singh",
      nameHi: "दिव्या सिंह",
      avatar: "DS",
      date: "Jul 30, 2026",
      dateHi: "30 जुलाई, 2026",
      rating: 2,
      text: "Camera is decent but low-light performance disappointed me. Expected better.",
      textHi: "कैमरा ठीक है लेकिन लो-लाइट परफॉर्मेंस ने निराश किया। इससे बेहतर की उम्मीद थी।"
    },
    {
      id: 3,
      name: "Amit Patel",
      nameHi: "अमित पटेल",
      avatar: "AP",
      date: "Jul 22, 2026",
      dateHi: "22 जुलाई, 2026",
      rating: 3,
      text: "S Pen is good but overall phone feels very heavy in hand.",
      textHi: "S Pen बहुत अच्छा है लेकिन हाथ में फोन काफी भारी लगता है।"
    },
    {
      id: 4,
      name: "Neha Kapoor",
      nameHi: "नेहा कपूर",
      avatar: "NK",
      date: "Jul 10, 2026",
      dateHi: "10 जुलाई, 2026",
      rating: 3,
      text: "Overpriced considering the heating issues during gaming.",
      textHi: "गेमिंग के दौरान हीटिंग की समस्या को देखते हुए कीमत थोड़ी ज्यादा लगती है।"
    },
  ]},
  "elec-003": { rating: 4.9, reviewCount: 987, reviews: [
    {
      id: 1,
      name: "Vikram Rao",
      nameHi: "विक्रम राव",
      avatar: "VR",
      date: "Aug 1, 2026",
      dateHi: "1 अगस्त, 2026",
      rating: 5,
      text: "M3 Max is an absolute powerhouse. Video editing and 3D rendering - handles everything effortlessly.",
      textHi: "M3 Max एक पावरहाउस है। वीडियो एडिटिंग और 3D रेंडरिंग - सब कुछ चुटकियों में हो जाता है।"
    },
    {
      id: 2,
      name: "Ananya Joshi",
      nameHi: "अनन्या जोशी",
      avatar: "AJ",
      date: "Jul 25, 2026",
      dateHi: "25 जुलाई, 2026",
      rating: 5,
      text: "Display is breathtaking. Colors are accurate and battery lasts all day.",
      textHi: "डिस्प्ले बेहद खूबसूरत है। रंग एकदम सटीक हैं और बैटरी पूरा दिन चलती है।"
    },
    {
      id: 3,
      name: "Siddharth K",
      nameHi: "सिद्धार्थ के",
      avatar: "SK",
      date: "Jul 18, 2026",
      dateHi: "18 जुलाई, 2026",
      rating: 5,
      text: "Best laptop for developers. Xcode builds run in seconds with zero fan noise.",
      textHi: "डेवलपर्स के लिए सबसे बेहतरीन लैपटॉप। बिना किसी फैन नॉइज़ के सेकंडों में कोड कंपाइल होता है।"
    },
    {
      id: 4,
      name: "Meera Pillai",
      nameHi: "मीरा पिल्लई",
      avatar: "MP",
      date: "Jul 9, 2026",
      dateHi: "9 जुलाई, 2026",
      rating: 4,
      text: "Keyboard and trackpad are class apart. Premium build throughout.",
      textHi: "कीबोर्ड और ट्रैकपैड लाजवाब हैं। पूरी तरह से प्रीमियम बिल्ड क्वालिटी।"
    },
  ]},
  "elec-004": { rating: 3.2, reviewCount: 3120, reviews: [
    {
      id: 1,
      name: "Rahul Tiwari",
      nameHi: "राहुल तिवारी",
      avatar: "RT",
      date: "Aug 3, 2026",
      dateHi: "3 अगस्त, 2026",
      rating: 3,
      text: "Noise cancellation is okay, but ear cushions get sweaty after 1 hour.",
      textHi: "नॉइज़ कैंसिलेशन ठीक है, लेकिन 1 घंटे बाद कानों में पसीना आने लगता है।"
    },
    {
      id: 2,
      name: "Pooja Yadav",
      nameHi: "पूजा यादव",
      avatar: "PY",
      date: "Jul 29, 2026",
      dateHi: "29 जुलाई, 2026",
      rating: 3,
      text: "Sound quality is average. Bluetooth disconnects occasionally.",
      textHi: "साउंड क्वालिटी सामान्य है। कभी-कभार ब्लूटूथ भी डिस्कनेक्ट हो जाता है।"
    },
    {
      id: 3,
      name: "Nikhil Bose",
      nameHi: "निखिल बोस",
      avatar: "NB",
      date: "Jul 21, 2026",
      dateHi: "21 जुलाई, 2026",
      rating: 4,
      text: "Decent battery life but build quality could be more sturdy.",
      textHi: "बैटरी लाइफ अच्छी है लेकिन बिल्ड क्वालिटी थोड़ी और मजबूत होनी चाहिए थी।"
    },
    {
      id: 4,
      name: "Tanvi Saxena",
      nameHi: "तन्वी सक्सेना",
      avatar: "TS",
      date: "Jul 14, 2026",
      dateHi: "14 जुलाई, 2026",
      rating: 3,
      text: "Okay headphones, but overpriced for what they offer.",
      textHi: "हेडफोन ठीक हैं, लेकिन फीचर्स के हिसाब से कीमत ज्यादा है।"
    },
  ]},
  "elec-005": { rating: 4.8, reviewCount: 5432, reviews: [
    {
      id: 1,
      name: "Aakash Dubey",
      nameHi: "आकाश दुबे",
      avatar: "AD",
      date: "Aug 4, 2026",
      dateHi: "4 अगस्त, 2026",
      rating: 5,
      text: "PS5 Slim is sleek and quiet. Games load in seconds. DualSense haptics are amazing.",
      textHi: "PS5 स्लिम काफी स्लीक और शांत है। गेम्स सेकंडों में लोड होते हैं। डुअलसेंस का फीडबैक कमाल का है।"
    },
    {
      id: 2,
      name: "Riya Chopra",
      nameHi: "रिया चोपड़ा",
      avatar: "RC",
      date: "Jul 27, 2026",
      dateHi: "27 जुलाई, 2026",
      rating: 5,
      text: "Haptic feedback in Spider-Man 2 is insane. Immersive experience.",
      textHi: "स्पाइडर-मैन 2 में हैप्टिक फीडबैक का अनुभव बेहद शानदार और रोमांचक है।"
    },
    {
      id: 3,
      name: "Gaurav Mishra",
      nameHi: "गौरव मिश्रा",
      avatar: "GM",
      date: "Jul 19, 2026",
      dateHi: "19 जुलाई, 2026",
      rating: 4,
      text: "Great console. Games run at solid 60fps.",
      textHi: "शानदार कंसोल। सभी गेम्स बिना रुके 60fps पर स्मूथ चलते हैं।"
    },
    {
      id: 4,
      name: "Swati Reddy",
      nameHi: "स्वाति रेड्डी",
      avatar: "SR",
      date: "Jul 11, 2026",
      dateHi: "11 जुलाई, 2026",
      rating: 5,
      text: "PlayStation exclusives make this a must-buy.",
      textHi: "PlayStation के एक्सक्लूसिव गेम्स के लिए इसे खरीदना बिल्कुल सही फैसला है।"
    },
  ]},
  "elec-006": { rating: 3.4, reviewCount: 650, reviews: [
    {
      id: 1,
      name: "Manish Kumar",
      nameHi: "मनीष कुमार",
      avatar: "MK",
      date: "Aug 1, 2026",
      dateHi: "1 अगस्त, 2026",
      rating: 3,
      text: "Good screen but battery drains fast when watching 4K content.",
      textHi: "स्क्रीन बहुत अच्छी है लेकिन 4K वीडियो देखने पर बैटरी तेजी से खत्म होती है।"
    },
    {
      id: 2,
      name: "Deepa Shah",
      nameHi: "दीपा शाह",
      avatar: "DS",
      date: "Jul 24, 2026",
      dateHi: "24 जुलाई, 2026",
      rating: 4,
      text: "Performance is smooth for daily tasks.",
      textHi: "रोज़मर्रा के कामों के लिए परफॉर्मेंस काफी स्मूथ और तेज़ है।"
    },
  ]},
  "elec-008": { rating: 2.5, reviewCount: 430, reviews: [
    {
      id: 1,
      name: "Vikrant Singh",
      nameHi: "विक्रांत सिंह",
      avatar: "VS",
      date: "Aug 2, 2026",
      dateHi: "2 अगस्त, 2026",
      rating: 2,
      text: "Too bulky on wrist and battery lasts less than 24 hours. Disappointed.",
      textHi: "कलाई पर काफी भारी लगता है और बैटरी 24 घंटे भी नहीं चलती। निराशा हुई।"
    },
    {
      id: 2,
      name: "Neha Roy",
      nameHi: "नेहा रॉय",
      avatar: "NR",
      date: "Jul 20, 2026",
      dateHi: "20 जुलाई, 2026",
      rating: 3,
      text: "Features are nice but not worth the high price tag.",
      textHi: "फीचर्स अच्छे हैं लेकिन इस कीमत पर बिल्कुल भी वैल्यू फॉर मनी नहीं है।"
    },
  ]},
  "shoe-001": { rating: 3.1, reviewCount: 890, reviews: [
    {
      id: 1,
      name: "Sameer Joshi",
      nameHi: "समीर जोशी",
      avatar: "SJ",
      date: "Aug 3, 2026",
      dateHi: "3 अगस्त, 2026",
      rating: 3,
      text: "Looks stylish but sole is quite stiff for running long distances.",
      textHi: "दिखने में स्टाइलिश है लेकिन लंबी दूरी की दौड़ के लिए सोल थोड़ा सख्त है।"
    },
    {
      id: 2,
      name: "Raman Kant",
      nameHi: "रमन कांत",
      avatar: "RK",
      date: "Jul 18, 2026",
      dateHi: "18 जुलाई, 2026",
      rating: 3,
      text: "Sizing runs small. Recommend ordering 1 size larger.",
      textHi: "साइज़ थोड़ा छोटा आता है। 1 साइज़ बड़ा मंगाने की सलाह दूंगा।"
    },
  ]},
  "shoe-002": { rating: 2.8, reviewCount: 654, reviews: [
    {
      id: 1,
      name: "Kavita Rao",
      nameHi: "कविता राव",
      avatar: "KR",
      date: "Aug 1, 2026",
      dateHi: "1 अगस्त, 2026",
      rating: 2,
      text: "Stitching started coming off within 3 weeks of usage. Not happy.",
      textHi: "3 हफ़्तों में ही सिलाई खुलने लगी। मुझे बिल्कुल पसंद नहीं आया।"
    },
    {
      id: 2,
      name: "Abhay Sharma",
      nameHi: "अभय शर्मा",
      avatar: "AS",
      date: "Jul 15, 2026",
      dateHi: "15 जुलाई, 2026",
      rating: 3,
      text: "Comfortable for walking, but mesh material feels cheap.",
      textHi: "चलने-फिरने के लिए आरामदायक है, लेकिन मेश मटेरियल सामान्य लगता है।"
    },
  ]},
  "clot-001": { rating: 3.3, reviewCount: 1420, reviews: [
    {
      id: 1,
      name: "Alok Gupta",
      nameHi: "आलोक गुप्ता",
      avatar: "AG",
      date: "Aug 4, 2026",
      dateHi: "4 अगस्त, 2026",
      rating: 3,
      text: "Color faded slightly after first wash. Fit is decent.",
      textHi: "पहली धुलाई के बाद रंग हल्का फीका पड़ गया। फिटिंग ठीक-ठाक है।"
    },
    {
      id: 2,
      name: "Sunil Mehra",
      nameHi: "सुनील मेहरा",
      avatar: "SM",
      date: "Jul 22, 2026",
      dateHi: "22 जुलाई, 2026",
      rating: 4,
      text: "Good fit for slim guys.",
      textHi: "स्लिम लोगों के लिए बहुत अच्छी फिटिंग है।"
    },
  ]},
  "clot-002": { rating: 2.4, reviewCount: 945, reviews: [
    {
      id: 1,
      name: "Tarun Bajaj",
      nameHi: "तरुण बजाज",
      avatar: "TB",
      date: "Aug 2, 2026",
      dateHi: "2 अगस्त, 2026",
      rating: 2,
      text: "Fabric feels thin and collar lost shape quickly.",
      textHi: "कपड़ा पतला लगता है और कॉलर का आकार जल्दी बिगड़ गया।"
    },
    {
      id: 2,
      name: "Preeti Jain",
      nameHi: "प्रीति जैन",
      avatar: "PJ",
      date: "Jul 19, 2026",
      dateHi: "19 जुलाई, 2026",
      rating: 3,
      text: "Average quality t-shirt.",
      textHi: "औसत दर्जे की टी-शर्ट है।"
    },
  ]},
  "spor-001": { rating: 3.5, reviewCount: 420, reviews: [
    {
      id: 1,
      name: "Girish Nath",
      nameHi: "गिरीश नाथ",
      avatar: "GN",
      date: "Aug 3, 2026",
      dateHi: "3 अगस्त, 2026",
      rating: 4,
      text: "Good grip and weight distribution.",
      textHi: "ग्रिप और वेट डिस्ट्रीब्यूशन बहुत बढ़िया है।"
    },
    {
      id: 2,
      name: "Manoj Paul",
      nameHi: "मनोज पॉल",
      avatar: "MP",
      date: "Jul 17, 2026",
      dateHi: "17 जुलाई, 2026",
      rating: 3,
      text: "Rubber coating smells a bit strong initially.",
      textHi: "शुरुआत में रबर कोटिंग की गंध थोड़ी तेज़ लगती है।"
    },
  ]},
};

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Aryan Sharma",
    nameHi: "आर्यन शर्मा",
    avatar: "AS",
    date: "Aug 1, 2026",
    dateHi: "1 अगस्त, 2026",
    rating: 4,
    text: "Good product. Works well and meets expectations.",
    textHi: "बहुत बढ़िया उत्पाद। उम्मीद के मुताबिक काम करता है।"
  },
  {
    id: 2,
    name: "Priya Verma",
    nameHi: "प्रिया वर्मा",
    avatar: "PV",
    date: "Jul 25, 2026",
    dateHi: "25 जुलाई, 2026",
    rating: 3,
    text: "Average build quality. Delivery was fast.",
    textHi: "औसत दर्जे की बनावट। डिलीवरी बहुत तेज़ थी।"
  },
  {
    id: 3,
    name: "Rahul Tiwari",
    nameHi: "राहुल तिवारी",
    avatar: "RT",
    date: "Jul 18, 2026",
    dateHi: "18 जुलाई, 2026",
    rating: 4,
    text: "Satisfied with purchase. Good value for money.",
    textHi: "खरीदारी से संतुष्ट हूँ। पैसे की पूरी कीमत वसूल।"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    nameHi: "स्नेहा गुप्ता",
    avatar: "SG",
    date: "Jul 10, 2026",
    dateHi: "10 जुलाई, 2026",
    rating: 3,
    text: "Decent product overall.",
    textHi: "कुल मिलाकर अच्छा और संतोषजनक उत्पाद।"
  },
];

export function getProductReviews(productId, lang = "en") {
  const id = String(productId);
  let baseData = REVIEW_POOL[id];
  if (!baseData) {
    const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const rating = 2.3 + (hash % 27) / 10;
    const roundedRating = Math.min(4.9, Math.round(rating * 10) / 10);
    baseData = { rating: roundedRating, reviewCount: DEFAULT_REVIEWS.length, reviews: [...DEFAULT_REVIEWS] };
  } else {
    baseData = { ...baseData, reviewCount: baseData.reviews.length, reviews: [...baseData.reviews] };
  }

  // Load custom user submitted reviews from localStorage
  try {
    const userReviews = JSON.parse(localStorage.getItem("pvx_user_reviews") || "{}");
    const itemReviews = userReviews[id] || [];
    if (itemReviews.length > 0) {
      const combinedReviews = [...itemReviews, ...baseData.reviews];
      const totalRatingSum = combinedReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
      const avgRating = Math.min(5, Math.max(1, Math.round((totalRatingSum / combinedReviews.length) * 10) / 10));
      return {
        rating: avgRating,
        reviewCount: combinedReviews.length,
        reviews: combinedReviews,
      };
    }
  } catch (e) {}

  return baseData;
}
