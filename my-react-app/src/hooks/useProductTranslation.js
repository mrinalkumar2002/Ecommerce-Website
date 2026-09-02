import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const STATIC_DICT = {
  // Apple iPhone 15 Pro Max
  "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium": "एप्पल आईफोन 15 प्रो मैक्स (256 जीबी) - नेचुरल टाइटेनियम",
  "Forged in titanium with the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x Telephoto lens.": "ग्राउंडब्रेकिंग ए17 प्रो चिप, कस्टमाइज़ेबल एक्शन बटन और 5x टेलीफ़ोटो लेंस के साथ अब तक के सबसे शक्तिशाली आईफोन कैमरा सिस्टम के साथ टाइटेनियम में तैयार किया गया।",

  // Samsung Galaxy S24 Ultra
  "Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Storage)": "सैमसंग गैलेक्सी एस24 अल्ट्रा 5जी (12जीबी रैम, 512जीबी स्टोरेज)",
  "Meet Galaxy S24 Ultra with Galaxy AI, titanium frame, built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 for Galaxy processor.": "गैलेक्सी एआई, टाइटेनियम फ्रेम, इन-बिल्ट एस पेन, 200एमपी कैमरा और गैलेक्सी प्रोसेसर के लिए स्नैपड्रैगन 8 जेन 3 के साथ गैलेक्सी एस24 अल्ट्रा से मिलें।",

  // MacBook Pro
  "Apple MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD)": "एप्पल मैकबुक प्रो 16-इंच एम3 मैक्स (36जीबी यूनिफाइड मेमोरी, 1टीबी एसएसडी)",
  "The 16-inch MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance for demanding workflows.": "16-इंच मैकबुक प्रो एम3 मैक्स के साथ आगे बढ़ता है, जो एक असाधारण रूप से उन्नत चिप है जो मांग वाले वर्कफ़्लो के लिए भारी प्रदर्शन लाती है।",

  // Sony headphones
  "Sony WH-1000XM5 Wireless Noise Cancelling Headphones": "सोनी डब्ल्यूएच-1000एक्सएम5 वायरलेस नॉइज़ कैंसलिंग हेडफ़ोन",
  "Industry-leading noise canceling with two processors and 8 microphones, magnificent sound quality, crystal clear hands-free calling, and 30-hour battery life.": "दो प्रोसेसर और 8 माइक्रोफोन के साथ उद्योग-अग्रणी शोर रद्दीकरण, शानदार ध्वनि गुणवत्ता, क्रिस्टल स्पष्ट हैंड्स-फ्री कॉलिंग और 30 घंटे की बैटरी लाइफ।",

  // General categories & specifications
  "electronics": "इलेक्ट्रॉनिक्स",
  "clothes": "कपड़े",
  "sports": "खेल",
  "shoes": "जूते",
  "Footwear & Shoes": "जूते और फुटवियर",
  "Clothing & Fashion": "कपड़े और फैशन",
  "Sports & Fitness": "खेल और फिटनेस",
  "Smartphones & Mobiles": "स्मार्टफोन और मोबाइल",
  "Laptops & Computers": "लैपटॉप और कंप्यूटर",
  "Audio & Headphones": "ऑडियो और हेडफोन",
  "1 Year Brand Warranty": "1 वर्ष ब्रांड वारंटी",
  "1 Year Official Manufacturer Warranty": "1 वर्ष आधिकारिक निर्माता वारंटी",
  "30 Days Quality Guarantee & Easy Return": "30 दिनों की गुणवत्ता गारंटी और आसान वापसी",
  "6 Months Manufacturer Warranty": "6 महीने की निर्माता वारंटी",
};

// Global in-memory cache and in-flight request tracker for deduplication
const memoryCache = new Map();
const inFlightRequests = new Map();

function isValidTranslation(text) {
  if (!text || typeof text !== "string") return false;
  const upper = text.toUpperCase();
  if (
    upper.includes("MYMEMORY") ||
    upper.includes("WARNING:") ||
    upper.includes("QUOTA") ||
    upper.includes("TRANSLATE MORE") ||
    upper.includes("LIMIT REACHED")
  ) {
    return false;
  }
  return true;
}

async function fetchGoogleTranslation(text) {
  if (memoryCache.has(text)) {
    return memoryCache.get(text);
  }

  if (inFlightRequests.has(text)) {
    return inFlightRequests.get(text);
  }

  const promise = (async () => {
    try {
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(gUrl);
      if (!res.ok) throw new Error("Google translate request failed");
      const data = await res.json();

      if (Array.isArray(data?.[0])) {
        const translated = data[0].map((chunk) => chunk?.[0] || "").join("");
        if (translated && isValidTranslation(translated)) {
          memoryCache.set(text, translated);
          return translated;
        }
      }
      return text;
    } catch {
      return text;
    } finally {
      inFlightRequests.delete(text);
    }
  })();

  inFlightRequests.set(text, promise);
  return promise;
}

export function useProductTranslation(englishText) {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(englishText || "");
  const currentLang = i18n.language;

  useEffect(() => {
    if (!englishText) {
      setTranslatedText("");
      return;
    }

    if (currentLang !== "hi") {
      setTranslatedText(englishText);
      return;
    }

    // 1. Check static dictionary
    if (STATIC_DICT[englishText]) {
      setTranslatedText(STATIC_DICT[englishText]);
      return;
    }

    // Check case-insensitive static match
    const lowerText = englishText.toLowerCase().trim();
    const matchedKey = Object.keys(STATIC_DICT).find(
      (k) => k.toLowerCase().trim() === lowerText
    );
    if (matchedKey) {
      setTranslatedText(STATIC_DICT[matchedKey]);
      return;
    }

    // 2. Check in-memory cache
    if (memoryCache.has(englishText)) {
      setTranslatedText(memoryCache.get(englishText));
      return;
    }

    // 3. Check localStorage cache
    const cacheKey = `pvx_gt_trans_${englishText.slice(0, 60).replace(/[^a-zA-Z0-9]/g, "_")}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached && isValidTranslation(cached)) {
        memoryCache.set(englishText, cached);
        setTranslatedText(cached);
        return;
      }
    } catch {}

    let isMounted = true;

    fetchGoogleTranslation(englishText).then((result) => {
      if (isMounted && result) {
        try {
          localStorage.setItem(cacheKey, result);
        } catch {}
        setTranslatedText(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [englishText, currentLang]);

  return translatedText;
}

