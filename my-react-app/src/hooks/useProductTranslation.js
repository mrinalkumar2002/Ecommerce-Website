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
  "General": "सामान्य",
  "Premium Brand": "प्रीमियम ब्रांड",
  "Phones": "फोन",
  "Laptops": "लैपटॉप",
  "Headphones": "हेडफोन",
  "Tablets": "टैबलेट",
  "Gaming": "गेमिंग",
  "Watches": "घड़ियां",
  "Cameras": "कैमरे",
  "TVs": "टीवी",
  "Speakers": "स्पीकर",
  "1 Year Brand Warranty": "1 वर्ष ब्रांड वारंटी",
  "1 Year Official Manufacturer Warranty": "1 वर्ष आधिकारिक निर्माता वारंटी",
  "30 Days Quality Guarantee & Easy Return": "30 दिनों की गुणवत्ता गारंटी और आसान वापसी",
  "6 Months Manufacturer Warranty": "6 महीने की निर्माता वारंटी",

  // Profile Security & Form Phrases
  "Password & Security": "पासवर्ड और सुरक्षा",
  "Keep your account safe by updating your password and managing security authentications.": "अपने पासवर्ड को अपडेट करके और सुरक्षा प्रमाणीकरण प्रबंधित करके अपना खाता सुरक्षित रखें।",
  "Change Password": "पासवर्ड बदलें",
  "Current Password": "वर्तमान पासवर्ड",
  "Current Password *": "वर्तमान पासवर्ड *",
  "CURRENT PASSWORD *": "वर्तमान पासवर्ड *",
  "Enter your current password": "अपना वर्तमान पासवर्ड दर्ज करें",
  "New Password": "नया पासवर्ड",
  "New Password *": "नया पासवर्ड *",
  "NEW PASSWORD *": "नया पासवर्ड *",
  "Minimum 6 characters": "न्यूनतम 6 अक्षर",
  "Confirm New Password": "नए पासवर्ड की पुष्टि करें",
  "Confirm New Password *": "नए पासवर्ड की पुष्टि करें *",
  "CONFIRM NEW PASSWORD *": "नए पासवर्ड की पुष्टि करें *",
  "Re-enter new password": "नया पासवर्ड पुनः दर्ज करें",
  "Update Password": "पासवर्ड अपडेट करें",
  "Updating Password...": "पासवर्ड अपडेट हो रहा है...",
  "Two-Factor Authentication (2FA)": "दो-चरणीय प्रमाणीकरण (2FA)",
  "Add an extra layer of security. We send a verification OTP whenever you log in from an unknown device.": "सुरक्षा की एक अतिरिक्त परत जोड़ें। जब भी आप किसी अज्ञात डिवाइस से लॉग इन करेंगे, हम एक सत्यापन ओटीपी भेजेंगे।",
  "Active Login Sessions": "सक्रिय लॉगिन सत्र",
  "Windows PC • Chrome Browser": "विंडोज पीसी • क्रोम ब्राउजर",
  "Active Now • Current Device": "अभी सक्रिय • वर्तमान डिवाइस",
  "This Device": "यह डिवाइस",
  "ShoppyGlobe Mobile App (iOS)": "ShoppyGlobe मोबाइल ऐप (iOS)",
  "Log Out of All Other Sessions": "अन्य सभी सत्रों से लॉग आउट करें",
  "Personal Information": "व्यक्तिगत जानकारी",
  "Manage your profile identification, contact phone, and personal details.": "अपनी प्रोफ़ाइल पहचान, संपर्क फ़ोन और व्यक्तिगत विवरण प्रबंधित करें।",
  "Edit Details": "विवरण संपादित करें",
  "Full Name": "पूरा नाम",
  "Full Name *": "पूरा नाम *",
  "Email Address": "ईमेल पता",
  "Mobile Phone Number": "मोबाइल फोन नंबर",
  "Alternate Mobile": "वैकल्पिक मोबाइल",
  "Gender": "लिंग",
  "Date of Birth": "जन्म तिथि",
  "Edit Personal Information": "व्यक्तिगत जानकारी संपादित करें",
  "Save Changes": "परिवर्तन सहेजें",
  "Cancel": "रद्द करें",
  "Verified": "सत्यापित",
  "Select Gender": "लिंग चुनें",
  "Male": "पुरुष",
  "Female": "महिला",
  "Other": "अन्य",
  "Prefer not to say": "कहना नहीं चाहते",
  "10-digit mobile number": "10 अंकों का मोबाइल नंबर",
  "Alternate contact number": "वैकल्पिक संपर्क नंबर",
  "Email cannot be edited directly.": "ईमेल को सीधे संपादित नहीं किया जा सकता।",
  "Account Linked": "खाता लिंक किया गया",
  "Enter your full name": "अपना पूरा नाम दर्ज करें",
  "Default Delivery Address": "डिफ़ॉल्ट डिलीवरी का पता",
  "Change": "बदलें",
  "Default": "डिफ़ॉल्ट",
  "No address saved yet.": "अभी तक कोई पता सहेजा नहीं गया है।",
  "+ Add Address": "+ पता जोड़ें",
  "Account Security Status: High": "खाता सुरक्षा स्थिति: उच्च",
  "Two-factor authentication is active and your session is encrypted.": "दो-चरणीय प्रमाणीकरण सक्रिय है और आपका सत्र एन्क्रिप्टेड है।",
  "Security Settings": "सुरक्षा सेटिंग्स",

  // Profile Addresses Tab
  "Manage Addresses": "पते प्रबंधित करें",
  "Add, edit, or set default delivery addresses for seamless express checkout.": "सहज एक्सप्रेस चेकआउट के लिए डिलीवरी पते जोड़ें, संपादित करें या डिफ़ॉल्ट सेट करें।",
  "+ Add New Address": "+ नया पता जोड़ें",
  "Add New Address": "नया पता जोड़ें",
  "No Addresses Saved": "कोई पता सहेजा नहीं गया",
  "Save your delivery locations to place orders in one click.": "एक क्लिक में ऑर्डर देने के लिए अपने डिलीवरी स्थान सहेजें।",
  "+ Add Your First Address": "+ अपना पहला पता जोड़ें",
  "Default Address": "डिफ़ॉल्ट पता",
  "Set as Default": "डिफ़ॉल्ट रूप से सेट करें",
  "Edit Address": "पता संपादित करें",
  "Delete Address": "पता हटाएं",

  // Profile Orders Tab
  "My Orders": "मेरे ऑर्डर",
  "View recent purchases, track live shipping status, or download tax invoices.": "हाल की खरीदारी देखें, लाइव शिपिंग स्थिति ट्रैक करें, या टैक्स चालान डाउनलोड करें।",
  "Full Tracking Hub": "पूर्ण ट्रैकिंग हब",
  "All": "सभी",
  "In Progress": "प्रगति पर है",
  "Delivered": "वितरित",
  "No Orders Placed Yet": "अभी तक कोई ऑर्डर नहीं दिया गया",
  "Looks like you haven't placed any orders yet. Discover our premium collection!": "लगता है आपने अभी तक कोई ऑर्डर नहीं दिया है। हमारा प्रीमियम संग्रह खोजें!",
  "Explore Products": "उत्पादों का अन्वेषण करें",
  "Track Order & Invoice": "ऑर्डर और चालान ट्रैक करें",
  "Total Paid:": "कुल भुगतान:",

  // Profile Wishlist Tab
  "Wishlist & Saved Items": "विशलिस्ट और सहेजे गए सामान",
  "Your curated personal collection of saved favourite luxury items.": "आपकी पसंदीदा लग्जरी वस्तुओं का व्यक्तिगत संग्रह।",
  "Full Wishlist View": "पूर्ण विशलिस्ट दृश्य",
  "Your Wishlist is Empty": "आपकी विशलिस्ट खाली है",
  "Save items you love by clicking the heart icon while browsing products.": "उत्पादों को ब्राउज़ करते समय दिल के आइकन पर क्लिक करके अपनी पसंदीदा वस्तुओं को सहेजें।",
  "Discover Products": "उत्पादों की खोज करें",
  "Move to Cart": "कार्ट में भेजें",

  // Profile Payments Tab
  "Saved Payment Methods": "सहेजी गई भुगतान विधियां",
  "Manage your saved credit/debit cards and UPI IDs for 1-click checkout.": "1-क्लिक चेकआउट के लिए अपने सहेजे गए क्रेडिट/डेबिट कार्ड और यूपीआई आईडी प्रबंधित करें।",
  "Add Payment Method": "भुगतान विधि जोड़ें",
  "+ Add Payment Method": "+ भुगतान विधि जोड़ें",
  "100% Secure & PCI-DSS Compliant Storage": "100% सुरक्षित और PCI-DSS अनुपालन भंडारण",
  "Your card details are tokenized and protected with 256-bit encryption. We never store CVV.": "आपके कार्ड के विवरण टोकनयुक्त हैं और 256-बिट एन्क्रिप्शन के साथ सुरक्षित हैं। हम कभी भी सीवीवी संग्रहीत नहीं करते हैं।",
  "No Payment Methods Saved": "कोई भुगतान विधि सहेजी नहीं गई",
  "Save cards or UPI handles for lightning fast checkouts.": "तेज़ चेकआउट के लिए कार्ड या यूपीआई हैंडल सहेजें।",
  "CARDHOLDER": "कार्डधारक",
  "EXPIRES": "समाप्ति",

  // Profile Notifications Tab
  "Notification Settings": "अधिसूचना सेटिंग्स",
  "Control which notifications and alerts you receive across SMS, WhatsApp, and Email.": "नियंत्रित करें कि आपको एसएमएस, व्हाट्सएप और ईमेल पर कौन सी सूचनाएं और अलर्ट प्राप्त होते हैं।",
  "Order Status & Tracking (SMS & Email)": "ऑर्डर स्थिति और ट्रैकिंग (एसएमएस और ईमेल)",
  "Receive order confirmation, invoice copy, and milestone progress alerts.": "ऑर्डर की पुष्टि, चालान की प्रतिलिपि, और प्रगति अलर्ट प्राप्त करें।",
  "WhatsApp Shipment Updates": "व्हाट्सएप शिपमेंट अपडेट",
  "Receive live delivery tracking and out-for-delivery alerts directly on WhatsApp.": "व्हाट्सएप पर सीधे लाइव डिलीवरी ट्रैकिंग और अलर्ट प्राप्त करें।",
  "Price Drop & Wishlist Alerts": "कीमत में गिरावट और विशलिस्ट अलर्ट",
  "Be the first to know when items in your Wishlist go on sale or restock.": "अपनी विशलिस्ट की वस्तुओं की बिक्री या पुनः स्टॉक होने पर सबसे पहले जानें।",
  "Exclusive Member Deals & Promotions": "विशेष सदस्य सौदे और प्रचार",
  "VIP early access to festival sales, exclusive promo codes, and brand launches.": "त्योहारों की बिक्री, विशेष प्रोमो कोड और ब्रांड लॉन्च के लिए वीआईपी पहुंच।",
  "Weekly Editorial Newsletter": "साप्ताहिक न्यूजलैटर",
  "Curated luxury style guides, seasonal lookbooks, and fashion highlights.": "संपादित लक्जरी स्टाइल गाइड, मौसमी लुकबुक और फैशन हाइलाइट्स।",

  // Profile Privacy Tab
  "Privacy & Data Settings": "गोपनीयता और डेटा सेटिंग्स",
  "Manage your data portability, clear browsing logs, and exercise your privacy rights.": "अपनी डेटा पोर्टेबिलिटी प्रबंधित करें, ब्राउज़िंग लॉग साफ़ करें, और अपने गोपनीयता अधिकारों का उपयोग करें।",
  "Download Account Data": "खाता डेटा डाउनलोड करें",
  "Download a machine-readable JSON copy of your personal profile, addresses, orders, and preferences.": "अपनी व्यक्तिगत प्रोफ़ाइल, पते, ऑर्डर और प्राथमिकताओं की एक प्रति डाउनलोड करें।",
  "Download Data": "डेटा डाउनलोड करें",
  "Clear Search & Browsing Activity": "खोज और ब्राउज़िंग गतिविधि साफ़ करें",
  "Erase your recent searches and browsing cache stored in your current browser.": "अपने वर्तमान ब्राउज़र में संग्रहीत अपनी हाल की खोजों और ब्राउज़िंग कैश को मिटाएं।",
  "Clear Activity": "गतिविधि साफ़ करें",
  "Account Deactivation": "खाता निष्क्रियता",
  "Permanently close your ShoppyGlobe account and delete all associated personal profile records.": "अपना ShoppyGlobe खाता स्थायी रूप से बंद करें और सभी संबद्ध प्रोफ़ाइल रिकॉर्ड हटाएं।",
  "Request Deactivation": "निष्क्रिय करने का अनुरोध करें",

  // Profile Support Tab
  "Help & Customer Support": "सहायता और ग्राहक सहायता",
  "Find instant answers to common questions or reach out to our dedicated 24x7 support team.": "सामान्य प्रश्नों के त्वरित उत्तर खोजें या हमारी 24x7 सहायता टीम से संपर्क करें।",
  "24x7 Helpline": "24x7 हेल्पलाइन",
  "Instant Voice Support": "त्वरित वॉयस सपोर्ट",
  "Email Assistance": "ईमेल सहायता",
  "Response within 2 hours": "2 घंटे के भीतर उत्तर",
  "AI Shopping Assistant": "एआई शॉपिंग सहायक",
  "Instant answers & recommendations": "त्वरित उत्तर और सिफारिशें",
  "Online 24/7": "ऑनलाइन 24/7",
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "📩 Raise a Support Ticket": "📩 सहायता टिकट दर्ज करें",
  "Have an order issue or question? Submit a ticket to our support team.": "कोई ऑर्डर समस्या या प्रश्न है? हमारी सहायता टीम को टिकट सबमिट करें।",
  "Select Related Product (Optional)": "संबंधित उत्पाद चुनें (वैकल्पिक)",
  "-- General Inquiry / Account Issue --": "-- सामान्य पूछताछ / खाता समस्या --",
  "Subject / Issue Title *": "विषय / समस्या का शीर्षक *",
  "Detailed Description *": "विस्तृत विवरण *",
  "Submit Support Ticket": "सहायता टिकट सबमिट करें",
  "Submitting Ticket...": "टिकट सबमिट हो रहा है...",

  // Profile Terms Tab
  "Terms & Policies": "शर्तें और नीतियां",
  "Review our authentic service agreements, user privacy, and customer return policies.": "हमारे प्रामाणिक सेवा समझौतों, उपयोगकर्ता गोपनीयता और वापसी नीतियों की समीक्षा करें।",
  "Terms of Service": "सेवा की शर्तें",
  "Privacy Policy": "गोपनीयता नीति",
  "Returns & Refunds": "वापसी और रिफंड",
  "Authenticity Guarantee": "प्रामाणिकता की गारंटी"
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

// Single chunk translator (tries Google GTX, then MyMemory fallback)
async function fetchSingleChunkTranslation(text) {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  const clean = text.trim();
  if (memoryCache.has(clean)) return memoryCache.get(clean);

  // 1. Google GTX API
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(gUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.[0])) {
        const translated = data[0].map((chunk) => chunk?.[0] || "").join("");
        if (translated && isValidTranslation(translated)) {
          memoryCache.set(clean, translated);
          return translated;
        }
      }
    }
  } catch (e) {}

  // 2. Secondary API: MyMemory Translate
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|hi`;
    const res = await fetch(mmUrl);
    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && isValidTranslation(translated)) {
        memoryCache.set(clean, translated);
        return translated;
      }
    }
  } catch (e) {}

  return clean;
}

// Full text translation with automatic sentence splitting for long descriptions
async function fetchGoogleTranslation(text) {
  if (!text || typeof text !== "string") return text;
  const cleanText = text.trim();
  if (!cleanText) return text;

  if (memoryCache.has(cleanText)) {
    return memoryCache.get(cleanText);
  }

  if (inFlightRequests.has(cleanText)) {
    return inFlightRequests.get(cleanText);
  }

  const promise = (async () => {
    try {
      // Split long text into sentences for sentence-by-sentence precision
      if (cleanText.length > 150 && (cleanText.includes(".") || cleanText.includes("\n"))) {
        const sentences = cleanText.split(/(?<=\.)\s+|\n+/).filter((s) => s.trim().length > 0);
        if (sentences.length > 1) {
          const translatedChunks = await Promise.all(
            sentences.map((s) => fetchSingleChunkTranslation(s))
          );
          const fullTrans = translatedChunks.join(" ");
          if (fullTrans && isValidTranslation(fullTrans)) {
            memoryCache.set(cleanText, fullTrans);
            return fullTrans;
          }
        }
      }
      const singleRes = await fetchSingleChunkTranslation(cleanText);
      if (singleRes && isValidTranslation(singleRes)) {
        memoryCache.set(cleanText, singleRes);
        return singleRes;
      }
      return cleanText;
    } catch {
      return cleanText;
    } finally {
      inFlightRequests.delete(cleanText);
    }
  })();

  inFlightRequests.set(cleanText, promise);
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
    const lowerText = String(englishText).toLowerCase().trim();
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

    // 3. Check localStorage cache with unique key
    const strVal = String(englishText);
    const cacheKey = `pvx_gt_trans_${strVal.length}_${strVal.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}_${strVal.slice(-20).replace(/[^a-zA-Z0-9]/g, "_")}`;
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
