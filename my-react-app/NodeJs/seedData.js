import Product from "./Model/products.model.js";

const initialProducts = [
  {
    "_id": "elec-001",
    "title": "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
    "description": "Forged in titanium with the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x Telephoto lens.",
    "price": 159900,
    "stock": 25,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-002",
    "title": "Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Storage)",
    "description": "Meet Galaxy S24 Ultra with Galaxy AI, titanium frame, built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 for Galaxy processor.",
    "price": 139999,
    "stock": 18,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-003",
    "title": "Apple MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD)",
    "description": "The 16-inch MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance for demanding workflows.",
    "price": 349900,
    "stock": 10,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-004",
    "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    "description": "Industry-leading noise canceling with two processors and 8 microphones, magnificent sound quality, crystal clear hands-free calling, and 30-hour battery life.",
    "price": 29990,
    "stock": 45,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-005",
    "title": "Sony PlayStation 5 Slim Console (Disc Edition)",
    "description": "Unleash new gaming possibilities with lightning fast loading via an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
    "price": 54990,
    "stock": 30,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-006",
    "title": "Apple iPad Pro 13-inch M4 (256GB, Wi-Fi) - Space Black",
    "description": "Thinpossible design with groundbreaking Ultra Retina XDR display, outrageously fast M4 chip performance, and next-gen AI capabilities.",
    "price": 129900,
    "stock": 15,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-007",
    "title": "Dell XPS 15 9530 Laptop (Intel Core i9 13th Gen, 32GB RAM, 1TB SSD, RTX 4060)",
    "description": "Immerse yourself in content with stunning 3.5K OLED touch display, premium machined aluminum chassis, and powerful NVIDIA GeForce RTX graphics.",
    "price": 249990,
    "stock": 12,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-008",
    "title": "Apple Watch Ultra 2 (GPS + Cellular, 49mm) - Titanium Case",
    "description": "The most capable and rugged Apple Watch ever. Designed for outdoor adventure and endurance workouts with a lightweight titanium case and up to 72 hours battery life.",
    "price": 89900,
    "stock": 22,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-009",
    "title": "Bose QuietComfort Ultra Wireless Earbuds",
    "description": "Breakthrough spatialized audio for more immersive listening, world-class noise cancellation, and CustomTune technology for personalized sound.",
    "price": 25900,
    "stock": 40,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-010",
    "title": "LG C3 55-inch 4K Smart OLED EVO TV (OLED55C3PSA)",
    "description": "Self-lit OLED pixels generate infinite contrast, 100% color fidelity, powered by the α9 AI Processor 4K Gen6 for extraordinary picture and sound.",
    "price": 119990,
    "stock": 8,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-011",
    "title": "Canon EOS R6 Mark II Mirrorless Camera (Body Only)",
    "description": "Full-frame 24.2 MP sensor, 40 fps continuous shooting, 4K 60p uncropped video recording, advanced Dual Pixel CMOS AF II with subject tracking.",
    "price": 215995,
    "stock": 7,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-012",
    "title": "ASUS ROG Zephyrus G16 Gaming Laptop (Intel Core Ultra 9, RTX 4080)",
    "description": "Ultra-thin 16-inch gaming laptop featuring Nebula OLED 240Hz display, CNC-machined aluminum body, and desktop-class gaming performance.",
    "price": 279990,
    "stock": 9,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-013",
    "title": "Samsung Galaxy Tab S9 Ultra (14.6-inch Dynamic AMOLED 2X, 12GB RAM)",
    "description": "Massive 14.6-inch AMOLED display, IP68 water resistance, Snapdragon 8 Gen 2 processor, included S Pen with ultra-low latency.",
    "price": 108999,
    "stock": 14,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-014",
    "title": "JBL Charge 5 Portable Waterproof Bluetooth Speaker",
    "description": "Delivers bold JBL Original Pro Sound with an optimized long excursion driver, separate tweeter, and dual pumping JBL bass radiators. 20 hours play time.",
    "price": 14999,
    "stock": 60,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-015",
    "title": "Google Pixel 8 Pro (12GB RAM, 128GB Storage) - Bay Blue",
    "description": "Powered by Google Tensor G3 chip, fully upgraded camera system with Pro controls, 6.7-inch Super Actua display, and 7 years of OS updates.",
    "price": 93999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-016",
    "title": "Logitech MX Master 3S Performance Wireless Mouse",
    "description": "Quiet Clicks technology, 8000 DPI track-on-glass sensor, MagSpeed electromagnetic scrolling, and ergonomic comfortable silhouette.",
    "price": 9495,
    "stock": 50,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-017",
    "title": "Keychron K2 Pro Wireless Mechanical Keyboard (RGB Backlit)",
    "description": "QMK/VIA wireless mechanical keyboard with hot-swappable switches, double-shot PBT keycaps, and seamless Bluetooth 5.1 connectivity.",
    "price": 10499,
    "stock": 35,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-018",
    "title": "GoPro HERO12 Black Action Camera",
    "description": "Incredible 5.3K60 video, HDR imaging, HyperSmooth 6.0 stabilization, rugged waterproof build up to 33ft, and Bluetooth audio support.",
    "price": 37990,
    "stock": 28,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-019",
    "title": "DJI Mini 4 Pro Drone (Fly More Combo with DJI RC 2)",
    "description": "Under 249g ultra-lightweight foldable drone with 4K/60fps HDR video, omnidirectional obstacle sensing, 34-min flight time, and 20km HD video transmission.",
    "price": 98990,
    "stock": 11,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-020",
    "title": "Sony Bravia 65-inch 4K Ultra HD Smart LED Google TV",
    "description": "4K HDR Processor X1 delivers smooth and clear pictures, Live Color technology for real-world colors, and immersive Dolby Atmos surround sound.",
    "price": 76990,
    "stock": 13,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-021",
    "title": "Anker MagGo 10000mAh Qi2 Certified Magnetic Power Bank",
    "description": "15W ultra-fast wireless charging for MagSafe iPhones, smart display monitoring battery status and charging times, fold-out kickstand.",
    "price": 6999,
    "stock": 80,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-022",
    "title": "Kindle Paperwhite (16 GB) - 6.8-inch Display & Adjustable Warm Light",
    "description": "Now with a 6.8-inch display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    "price": 14999,
    "stock": 42,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-023",
    "title": "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
    "description": "Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio, and precision tracking Precision Finding.",
    "price": 24900,
    "stock": 75,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-024",
    "title": "Marshall Stanmore III Bluetooth Home Speaker",
    "description": "Re-engineered for a wider soundstage, delivering room-filling Marshall signature sound, classic vintage design with brass control knobs.",
    "price": 31999,
    "stock": 19,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-025",
    "title": "Samsung Odyssey G9 49-inch Dual QHD Curved Gaming Monitor",
    "description": "Revolutionary 1000R curved screen with 240Hz refresh rate, 1ms response time, Quantum Mini-LED technology, and VESA DisplayHDR 2000.",
    "price": 139990,
    "stock": 6,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-026",
    "title": "Xbox Series X Console (1TB SSD)",
    "description": "The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles with 12 teraflops of raw graphic processing power.",
    "price": 49990,
    "stock": 24,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-027",
    "title": "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    "description": "Ultra-lightweight 63g ergonomic design, Focus Pro 30K Optical Sensor, Optical Mouse Switches Gen-3, and up to 90 hours battery life.",
    "price": 13999,
    "stock": 32,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-028",
    "title": "ASUS TUF Gaming F15 (Core i7 13th Gen, 16GB RAM, RTX 4060)",
    "description": "Military-grade durability gaming laptop featuring FHD 144Hz IPS display, Arc Flow Fans cooling system, and MUX Switch for high FPS gaming.",
    "price": 99990,
    "stock": 21,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-029",
    "title": "OnePlus 12 5G (16GB RAM, 512GB Storage) - Silky Black",
    "description": "Powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System for Mobile, 2K 120Hz ProXDR display, and 100W SUPERVOOC fast charging.",
    "price": 69999,
    "stock": 27,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-030",
    "title": "Nothing Phone (2) 5G (12GB RAM, 256GB Storage) - Dark Grey",
    "description": "Iconic Glyph Interface, 6.7-inch LTPO OLED 120Hz display, dual 50MP rear cameras, and Snapdragon 8+ Gen 1 chipset with Nothing OS 2.5.",
    "price": 39999,
    "stock": 33,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-031",
    "title": "Sony Alpha 7 IV Full-Frame Hybrid Camera (28-70mm Lens Kit)",
    "description": "33MP Exmor R CMOS sensor, BIONZ XR processing engine, 4K 60p video, real-time Eye AF for humans, animals, and birds.",
    "price": 242990,
    "stock": 5,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-032",
    "title": "Bose SoundLink Flex Bluetooth Portable Speaker",
    "description": "PositionIQ technology automatically detects orientation to optimize sound quality. IP67 waterproof and dustproof design with 12 hours battery.",
    "price": 15900,
    "stock": 48,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-033",
    "title": "Apple Studio Display 27-inch 5K Retina Display",
    "description": "27-inch 5K Retina display, 12MP Ultra Wide camera with Center Stage, studio-quality three-mic array, and six-speaker sound system with Spatial Audio.",
    "price": 159900,
    "stock": 8,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-034",
    "title": "HP Spectre x360 2-in-1 Laptop (Intel Core Ultra 7, 32GB RAM, 1TB SSD)",
    "description": "14-inch 2.8K OLED touch screen, 360-degree convertible hinge, 9MP AI camera with auto frame, and Intel Arc graphics.",
    "price": 164990,
    "stock": 11,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-035",
    "title": "Garmin Fenix 7X Pro Solar Multisport GPS Smartwatch",
    "description": "Solar charging lens for extended battery life, built-in LED flashlight, multi-band GPS, advanced training metrics, and preloaded TopoActive maps.",
    "price": 98990,
    "stock": 14,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-036",
    "title": "Lenovo Legion Pro 7i Gaming Laptop (Core i9 14th Gen, RTX 4090)",
    "description": "The ultimate gaming machine featuring 16-inch WQXGA 240Hz display, Coldfront 5.0 vapor chamber cooling, and peak RTX 4090 performance.",
    "price": 389990,
    "stock": 4,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-037",
    "title": "Sennheiser Momentum 4 Wireless ANC Headphones",
    "description": "Signature Sennheiser sound with audiophile 42mm transducer system, custom sound personalization, and unbelievable 60-hour battery life.",
    "price": 26990,
    "stock": 29,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-038",
    "title": "Shure SM7B Cardioid Dynamic Vocal Microphone",
    "description": "Legendary studio microphone with smooth, flat, wide-range frequency response for speech and music in professional broadcasting and recording.",
    "price": 34990,
    "stock": 17,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-039",
    "title": "Elgato Stream Deck MK.2 Studio Controller",
    "description": "15 customizable LCD keys to trigger actions, launch social posts, adjust audio, switch scenes, and optimize livestream production.",
    "price": 13999,
    "stock": 38,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-040",
    "title": "Samsung T7 Shield 2TB Portable External SSD",
    "description": "Rugged durable design with IP65 rating for water and dust resistance, lightning fast USB 3.2 Gen 2 read speeds up to 1050 MB/s.",
    "price": 18999,
    "stock": 44,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-041",
    "title": "Apple iPad Mini 6th Gen (Wi-Fi, 64GB) - Purple",
    "description": "Compact 8.3-inch Liquid Retina display, A15 Bionic chip with Neural Engine, Touch ID integrated into top button, and USB-C port.",
    "price": 49900,
    "stock": 23,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-042",
    "title": "Sony HT-A7000 7.1.2ch Dolby Atmos Soundbar",
    "description": "Flagship soundbar with 360 Spatial Sound Mapping, Sound Field Optimization, 8K HDR pass-through, and Hi-Res Audio wireless.",
    "price": 129990,
    "stock": 6,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-043",
    "title": "Nintendo Switch OLED Model Console (White Joy-Con)",
    "description": "Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN port dock, 64GB internal storage, and enhanced audio output.",
    "price": 32990,
    "stock": 31,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-044",
    "title": "Meta Quest 3 128GB VR Headset",
    "description": "Breakthrough mixed reality headset powered by Snapdragon XR2 Gen 2, 4K+ Infinite Display, Touch Plus controllers, and 3D spatial audio.",
    "price": 49990,
    "stock": 16,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-045",
    "title": "Xiaomi 14 Ultra 5G (16GB RAM, 512GB Storage) - White",
    "description": "Leica Quad Camera system with 1-inch sensor, Snapdragon 8 Gen 3, WQHD+ 120Hz AMOLED display, 90W HyperCharge fast charging.",
    "price": 99999,
    "stock": 12,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-046",
    "title": "Logitech C920 HD Pro Webcam 1080p",
    "description": "Full HD 1080p video calling and recording at 30 fps, dual stereo microphones, automatic light correction, and premium glass lens.",
    "price": 7495,
    "stock": 55,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1587483166702-bf9aa66bd791?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-047",
    "title": "SteelSeries Arctis Nova Pro Wireless Multi-System Gaming Headset",
    "description": "OmniPoint High-Fidelity drivers, Active Noise Cancellation, Infinity Power System dual hot-swappable batteries, 360 Spatial Audio.",
    "price": 36999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-048",
    "title": "Anker Soundcore Motion X600 Spatial Audio Portable Speaker",
    "description": "World's first portable spatial audio speaker with 5 drivers and 5 amplifiers, 50W output, LDAC audio certification, 12 hours playtime.",
    "price": 19999,
    "stock": 26,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-049",
    "title": "ASUS ROG Ally Handheld Gaming Console (AMD Z1 Extreme, 512GB SSD)",
    "description": "7-inch 120Hz FHD gaming handheld running Windows 11, ergonomic grip, ROG Intelligent Cooling, and expandable microSD storage.",
    "price": 59990,
    "stock": 18,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-050",
    "title": "Segway Ninebot KickScooter MAX G30P Electric Scooter",
    "description": "Gen 2 motor with 40-mile top range, 18.6 mph max speed, 10-inch pneumatic tires, built-in fast charging, and mobile app connectivity.",
    "price": 64990,
    "stock": 9,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-051",
    "title": "BenQ EW3280U 32-inch 4K UHD IPS Entertainment Monitor",
    "description": "4K UHD resolution, HDRi technology, 2.1 channel treVolo built-in speakers with subwoofer, USB-C connectivity, eye-care technology.",
    "price": 54990,
    "stock": 14,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-052",
    "title": "Nanoleaf Shapes Triangles Starter Kit (9 Light Panels)",
    "description": "Modular LED light panels with touch reactivity, music visualizer, dynamic RGB color scenes, and smart home hub compatibility.",
    "price": 19999,
    "stock": 35,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-053",
    "title": "Apple iPhone 16",
    "description": "Premium smartphone with powerful performance and advanced cameras.",
    "price": 79900,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-054",
    "title": "Samsung Galaxy S25",
    "description": "Flagship Android smartphone with AMOLED display and AI features.",
    "price": 80999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-055",
    "title": "OnePlus 13",
    "description": "High-performance smartphone with fast charging and smooth display.",
    "price": 69999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-056",
    "title": "Google Pixel 9",
    "description": "Google smartphone with excellent cameras and clean Android experience.",
    "price": 74999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-057",
    "title": "Nothing Phone (3a)",
    "description": "Stylish smartphone featuring a unique transparent-inspired design.",
    "price": 24999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-058",
    "title": "Apple MacBook Air",
    "description": "Lightweight laptop suitable for students and professionals.",
    "price": 99900,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-059",
    "title": "Dell Inspiron 15",
    "description": "Everyday laptop designed for productivity, study and entertainment.",
    "price": 55990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-060",
    "title": "HP Pavilion 15",
    "description": "Versatile laptop with strong performance and premium design.",
    "price": 62999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-061",
    "title": "ASUS Vivobook 15",
    "description": "Slim laptop ideal for coding, office work and everyday tasks.",
    "price": 49990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-062",
    "title": "Lenovo IdeaPad Slim 5",
    "description": "Portable productivity laptop with a modern slim design.",
    "price": 64990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-063",
    "title": "Apple iPad Air",
    "description": "Powerful tablet for studying, designing and entertainment.",
    "price": 59900,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-064",
    "title": "Samsung Galaxy Tab S10",
    "description": "Premium Android tablet with large display and productivity features.",
    "price": 74999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-065",
    "title": "OnePlus Pad 2",
    "description": "Fast Android tablet designed for entertainment and multitasking.",
    "price": 39999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-066",
    "title": "Apple Watch Series 10",
    "description": "Smartwatch with fitness, health and notification features.",
    "price": 46900,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-067",
    "title": "Samsung Galaxy Watch 7",
    "description": "Android smartwatch with health and activity tracking.",
    "price": 29999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-068",
    "title": "Noise ColorFit Pro",
    "description": "Affordable smartwatch with sports modes and health monitoring.",
    "price": 3499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-069",
    "title": "Apple AirPods Pro",
    "description": "Premium wireless earbuds with active noise cancellation.",
    "price": 24900,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-070",
    "title": "Samsung Galaxy Buds3 Pro",
    "description": "Wireless earbuds offering high-quality sound and noise cancellation.",
    "price": 19999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-071",
    "title": "OnePlus Buds Pro 3",
    "description": "Premium earbuds with powerful audio and comfortable fit.",
    "price": 11999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-072",
    "title": "boAt Airdopes 141",
    "description": "Budget-friendly wireless earbuds with long battery life.",
    "price": 1499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-073",
    "title": "Sony WH-1000XM5",
    "description": "Premium headphones with industry-leading noise cancellation.",
    "price": 29990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-074",
    "title": "JBL Tune 770NC",
    "description": "Wireless over-ear headphones with noise cancellation.",
    "price": 6999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-075",
    "title": "Sony Bravia 55-inch TV",
    "description": "Smart 4K television with excellent picture and sound quality.",
    "price": 69990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-076",
    "title": "Samsung 55-inch 4K TV",
    "description": "Smart television with vivid 4K display and streaming apps.",
    "price": 54990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-077",
    "title": "LG 50-inch 4K TV",
    "description": "UHD smart TV suitable for movies, sports and gaming.",
    "price": 45990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-078",
    "title": "JBL Flip 6",
    "description": "Portable Bluetooth speaker with powerful and clear audio.",
    "price": 9999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-079",
    "title": "boAt Stone 1200",
    "description": "Portable wireless speaker with strong bass and RGB lighting.",
    "price": 3999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-080",
    "title": "Sony SRS-XB100",
    "description": "Compact Bluetooth speaker designed for portable listening.",
    "price": 4990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-081",
    "title": "Canon EOS R50",
    "description": "Mirrorless camera suitable for photography and content creation.",
    "price": 69990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-082",
    "title": "Sony Alpha ZV-E10",
    "description": "Mirrorless camera designed especially for vloggers and creators.",
    "price": 61490,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-083",
    "title": "GoPro HERO13 Black",
    "description": "Rugged action camera for recording high-quality adventure videos.",
    "price": 44990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-084",
    "title": "PlayStation 5",
    "description": "Powerful gaming console with high-quality graphics and fast loading.",
    "price": 54990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-085",
    "title": "Xbox Series X",
    "description": "High-performance gaming console supporting 4K gaming.",
    "price": 54990,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-086",
    "title": "Nintendo Switch OLED",
    "description": "Hybrid handheld and home gaming console with OLED display.",
    "price": 32999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-087",
    "title": "Logitech G102 Mouse",
    "description": "Gaming mouse with programmable buttons and precise tracking.",
    "price": 1699,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-088",
    "title": "Logitech MX Master 3S",
    "description": "Premium wireless mouse designed for professional productivity.",
    "price": 9995,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-089",
    "title": "Redragon K552 Keyboard",
    "description": "Mechanical gaming keyboard with compact design and backlighting.",
    "price": 3299,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-090",
    "title": "Logitech K380 Keyboard",
    "description": "Compact Bluetooth keyboard supporting multiple devices.",
    "price": 2995,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-091",
    "title": "Samsung 27-inch Monitor",
    "description": "Full HD monitor suitable for work, study and entertainment.",
    "price": 14999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-092",
    "title": "LG UltraGear Gaming Monitor",
    "description": "High-refresh-rate gaming monitor for smooth gameplay.",
    "price": 24999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-093",
    "title": "SanDisk 1TB Portable SSD",
    "description": "Fast portable storage drive for files, photos and videos.",
    "price": 8999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-094",
    "title": "WD 2TB External HDD",
    "description": "Portable hard drive offering large storage capacity.",
    "price": 6499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-095",
    "title": "TP-Link Archer Router",
    "description": "Dual-band Wi-Fi router for fast home internet connectivity.",
    "price": 2499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-096",
    "title": "Amazon Echo Dot",
    "description": "Smart speaker with Alexa voice assistant and smart-home controls.",
    "price": 5499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-097",
    "title": "Google Nest Mini",
    "description": "Compact smart speaker powered by Google Assistant.",
    "price": 4499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-098",
    "title": "Epson EcoTank Printer",
    "description": "Ink-tank printer suitable for affordable home and office printing.",
    "price": 16999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "elec-099",
    "title": "HP LaserJet Printer",
    "description": "High-speed laser printer for home and office use.",
    "price": 12999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "/hpprinter.jpg"
    ]
  },
  {
    "_id": "elec-100",
    "title": "Anker PowerCore Power Bank",
    "description": "Portable power bank for charging smartphones and other devices.",
    "price": 3499,
    "stock": 20,
    "category": "electronics",
    "images": [
      "/powerbank.jpg"
    ]
  },
  {
    "_id": "elec-101",
    "title": "Mi 20000mAh Power Bank",
    "description": "High-capacity portable charger with multiple charging ports.",
    "price": 2199,
    "stock": 20,
    "category": "electronics",
    "images": [
      "/mipowerbank.jpg"
    ]
  },
  {
    "_id": "elec-102",
    "title": "Portronics USB-C Hub",
    "description": "Multi-port USB-C hub for connecting accessories and external displays.",
    "price": 1999,
    "stock": 20,
    "category": "electronics",
    "images": [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-001",
    "title": "Men's Premium Classic Denim Pants - Vintage Blue",
    "description": "Crafted from heavy-duty 100% cotton denim, featuring contrast stitching, classic five-pocket styling, zip fly with button closure, and a comfortable relaxed fit.",
    "price": 3499,
    "stock": 40,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-002",
    "title": "Women's Elegant Floral Print Summer Midi Dress",
    "description": "Breezy lightweight chiffon midi dress featuring a sweetheart neckline, puff sleeves, smocked waist, and vibrant floral pattern.",
    "price": 2799,
    "stock": 35,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-003",
    "title": "Unisex Heavyweight Fleece Pullover Hoodie - Charcoal",
    "description": "Ultra-soft 400 GSM organic cotton blend fleece hoodie with kangaroo pocket, double-lined drawstring hood, and ribbed cuffs.",
    "price": 2499,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-004",
    "title": "Men's Slim-Fit Formal Pure Cotton Dress Shirt",
    "description": "Wrinkle-resistant 100% Egyptian cotton dress shirt with spread collar, french cuffs, and clean tailored silhouette for executive business wear.",
    "price": 1999,
    "stock": 45,
    "category": "clothes",
    "images": [
      "/mens_formal_dress_shirt.jpg",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-005",
    "title": "Genuine Leather Biker Jacket - Onyx Black",
    "description": "100% lambskin leather moto jacket with asymmetrical front zipper, quilted shoulder pads, multiple zip pockets, and satin lining.",
    "price": 8999,
    "stock": 15,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-006",
    "title": "Women's High-Waisted Stretch Skinny Fit Jeans",
    "description": "Premium power-stretch denim jeans with tummy control waist, classical 5-pocket styling, and shape-retaining flex fabric.",
    "price": 2299,
    "stock": 60,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-007",
    "title": "Handcrafted Banarasi Silk Saree with Zari Embroidery",
    "description": "Luxurious pure silk saree woven with intricate golden zari motifs, traditional border, and matching unstitched blouse piece.",
    "price": 6499,
    "stock": 20,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-008",
    "title": "Men's Athletic Fit Quick-Dry Gym Shirt",
    "description": "Moisture-wicking 4-way stretch polyester performance shirt engineered for intense workouts with mesh ventilation panels.",
    "price": 999,
    "stock": 75,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-009",
    "title": "Women's Double-Breasted Classic Trench Coat - Beige",
    "description": "Timeless water-resistant twill trench coat with waist tie belt, storm flap, wide lapel collar, and deep side welt pockets.",
    "price": 5499,
    "stock": 22,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-010",
    "title": "Men's Stretch Cotton Chino Trousers - Olive Green",
    "description": "Versatile smart-casual chinos with comfort stretch fabric, flat-front design, coin pocket, and button-through back pockets.",
    "price": 1899,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-011",
    "title": "Vintage Graphic Printed Oversized Streetwear Shirt",
    "description": "Heavy 240 GSM drop-shoulder shirt featuring retro washed aesthetic and durable screen-printed graphic art.",
    "price": 1299,
    "stock": 65,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-012",
    "title": "Wool Blend Long Winter Overcoat - Camel",
    "description": "Tailored Italian wool-blend single-breasted coat with notched lapel collar, full inner lining, and back vent for movement.",
    "price": 7999,
    "stock": 18,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-013",
    "title": "Men's Casual Pure Linen Long Sleeve Button-Down Shirt",
    "description": "100% natural breathable flax linen shirt designed for warm summer days, featuring relaxed fit and pearl buttons.",
    "price": 2199,
    "stock": 40,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-014",
    "title": "Women's High-Rise Wide Leg Straight Jeans - Light Wash",
    "description": "90s inspired non-stretch rigid denim jeans with high waistline, wide leg opening, and raw hem detailing.",
    "price": 2599,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-015",
    "title": "Men's Classic Slim Fit Denim Pants - Navy Blue",
    "description": "Tailored slim fit denim pants made from stretch cotton blend for maximum flexibility, featuring deep navy wash and branded metal hardware.",
    "price": 4999,
    "stock": 25,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-016",
    "title": "Men's Relaxed Fit Cotton Denim Pants - Indigo",
    "description": "Comfortable relaxed fit denim pants crafted from pure breathable cotton with durable stitching and traditional five-pocket design.",
    "price": 4299,
    "stock": 28,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-017",
    "title": "Women's Premium Cashmere Blend Knit Crewneck Sweater",
    "description": "Sumptuously soft cashmere blend knit sweater with ribbed neckline, cuffs, and hem in a versatile relaxed cut.",
    "price": 3299,
    "stock": 35,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-018",
    "title": "Men's Athletic Jogger Sweatpants - Heather Grey",
    "description": "Tapered French terry cotton joggers with elastic drawstring waistband, zippered side pockets, and cuffed ankles.",
    "price": 1499,
    "stock": 55,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-019",
    "title": "Women's Satin Cowl Neck Evening Party Gown - Emerald",
    "description": "Luxe silky satin floor-length gown featuring a graceful cowl neckline, adjustable spaghetti straps, and thigh-high slit.",
    "price": 3999,
    "stock": 19,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-020",
    "title": "Men's Classic Pique Polo Shirt - Burgundy",
    "description": "Breathable 100% combed cotton pique polo shirt with two-button placket, flat knit collar, and side slit hem.",
    "price": 1199,
    "stock": 60,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-021",
    "title": "Men's Comfort Fit Stretch Denim Pants - Dark Wash",
    "description": "Stretchable and durable dark wash denim pants designed for all-day comfort, featuring flexible waistband and reinforced seams.",
    "price": 4599,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-022",
    "title": "Bohemian Tiered Printed Maxi Dress",
    "description": "Free-spirited tiered maxi dress crafted from breathable rayon with empire waist, tassel ties, and floral motifs.",
    "price": 2499,
    "stock": 40,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-023",
    "title": "Men's Multi-Pocket Tactical Cargo Pants",
    "description": "Durable ripstop cotton cargo pants with 6 reinforced utility pockets, articulated knees, and adjustable ankle cinch straps.",
    "price": 2299,
    "stock": 48,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-024",
    "title": "Men's Classic Stonewash Denim Pants - Light Wash",
    "description": "Vintage-inspired stonewashed light blue denim pants with authentic fading, sturdy rivets, and regular straight-leg cut.",
    "price": 3899,
    "stock": 25,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-025",
    "title": "Women's Power Blazer & Cropped Trousers Co-ord Set",
    "description": "Sophisticated 2-piece tailoring set including single-breasted blazer and high-waisted cigarette pants in crepe fabric.",
    "price": 4899,
    "stock": 22,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-026",
    "title": "Men's Relaxed Fit Utility Cargo Denim Pants",
    "description": "Rugged utility denim pants featuring spacious side cargo pockets, premium brass hardware, and heavy-duty denim fabric.",
    "price": 2999,
    "stock": 35,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-027",
    "title": "Unisex Classic Crewneck Cotton T-Shirt - Sage Green",
    "description": "Ultra-soft 100% combed cotton t-shirt with ribbed crew neck, breathable fabric, and tailored relaxed fit.",
    "price": 1899,
    "stock": 45,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-028",
    "title": "Soft Thermal Quarter-Zip Pullover Sweatshirt",
    "description": "Cozy waffle-knit thermal pullover with quarter-zip stand collar, perfect for layering during chilly evenings.",
    "price": 1799,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-029",
    "title": "Men's Printed Cuban Collar Resort Hawaiian Shirt",
    "description": "Tropical palm tree print short-sleeve shirt crafted from lightweight viscose with open Cuban collar.",
    "price": 1399,
    "stock": 55,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-030",
    "title": "Women's Chunky Cable Knit Button Cardigan",
    "description": "Relaxed fit vintage cable knit cardigan sweater featuring tortoise shell buttons and deep V-neckline.",
    "price": 2699,
    "stock": 38,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-031",
    "title": "Men's Stretch Cotton Chino Bermudas Shorts",
    "description": "Knee-length smart casual chino shorts with 9-inch inseam, slant front pockets, and belt loops.",
    "price": 1299,
    "stock": 60,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-032",
    "title": "Velvet Off-Shoulder Bodycon Party Dress",
    "description": "Luxe plush stretch velvet mini dress with folded off-shoulder neckline and body-hugging ruched silhouette.",
    "price": 2999,
    "stock": 25,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-033",
    "title": "Men's Tapered Fit Casual Denim Pants",
    "description": "Modern tapered denim pants offering a sharp silhouette, soft stretch cotton blend, and versatile everyday style.",
    "price": 2199,
    "stock": 42,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-034",
    "title": "Traditional Designer Anarkali Suit with Dupatta",
    "description": "Floor-length flared Georgette Anarkali dress embellished with sequins and zari work, paired with matching pants and net dupatta.",
    "price": 5299,
    "stock": 20,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-035",
    "title": "Men's Striped Organic Cotton Crewneck Shirt",
    "description": "Classic nautical Breton striped shirt made from 100% GOTS certified organic ring-spun cotton.",
    "price": 999,
    "stock": 70,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-036",
    "title": "Women's Faux Leather High-Waisted Leggings",
    "description": "Sleek coated faux leather leggings with high control waistband and smooth fleece-lined interior.",
    "price": 1799,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-037",
    "title": "Men's Casual Checkered Cotton Flannel Shirt",
    "description": "Soft brushed cotton plaid flannel shirt with dual chest patch pockets and adjustable button cuffs.",
    "price": 1699,
    "stock": 45,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-038",
    "title": "Women's Ribbed Knit Bodycon Midi Dress",
    "description": "Form-fitting ribbed stretch viscose midi dress with high mock neckline and long snug sleeves.",
    "price": 2199,
    "stock": 35,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-039",
    "title": "Unisex Pastel Tie-Dye Oversized Sweatshirt",
    "description": "Hand-dyed French terry cotton pullover featuring custom swirl pastel dye pattern and relaxed drop shoulders.",
    "price": 1999,
    "stock": 40,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-040",
    "title": "Men's Linen Blend Drawstring Trousers",
    "description": "Relaxed summer trousers with elasticated drawstring waist, breathable linen cotton fabric, and side pockets.",
    "price": 1999,
    "stock": 48,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-041",
    "title": "Unisex Casual High-Rise Denim Pants - Vintage Wash",
    "description": "Timeless high-rise vintage wash denim pants with straight leg silhouette, contrast stitching, and durable cotton build.",
    "price": 2299,
    "stock": 42,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-042",
    "title": "Men's Merino Wool V-Neck Pullover Sweater",
    "description": "Fine gauge 100% extra-fine Merino wool sweater, naturally thermoregulating and soft against skin.",
    "price": 2899,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-043",
    "title": "Women's Casual Ribbed Short Sleeve T-Shirt - Sage",
    "description": "Lightweight ribbed cotton blend t-shirt with a modern silhouette, soft stretch feel, and everyday comfort.",
    "price": 899,
    "stock": 65,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-044",
    "title": "Men's Athletic Performance Moisture-Wicking T-Shirt",
    "description": "Quick-drying athletic t-shirt made with breathable moisture-wicking fabric for intense workouts and everyday wear.",
    "price": 1599,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-045",
    "title": "Women's High-Waisted Distressed Denim Shorts",
    "description": "Classic vintage cut-off denim shorts with distressed frayed hem, high rise fit, and 5-pocket design.",
    "price": 1499,
    "stock": 55,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-046",
    "title": "Men's Italian Wool Double-Breasted Suit",
    "description": "Premium 2-piece double-breasted suit crafted from Super 130s Italian virgin wool, fully canvas construction.",
    "price": 12999,
    "stock": 12,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-047",
    "title": "Women's Premium Soft Jersey Casual T-Shirt",
    "description": "Silky soft jersey cotton t-shirt featuring a relaxed drape, clean neckline, and effortless casual style.",
    "price": 1699,
    "stock": 45,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-048",
    "title": "Men's Essential Organic Cotton Basic T-Shirt - Olive",
    "description": "Sustainable organic cotton crewneck t-shirt featuring reinforced stitching, fade-resistant color, and regular fit.",
    "price": 2499,
    "stock": 35,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-049",
    "title": "Women's Linen Shift Dress with Pockets",
    "description": "Effortless casual summer shift dress made from pre-washed pure flax linen with boat neckline and functional side pockets.",
    "price": 2399,
    "stock": 38,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-050",
    "title": "Men's Seamless Anti-Chafing Workout Shorts",
    "description": "Lightweight 2-in-1 running shorts with built-in compression liner, phone pocket, and towel loop.",
    "price": 1399,
    "stock": 60,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-051",
    "title": "Men's Slim Straight Dark Wash Denim Pants",
    "description": "Deep indigo dark wash denim pants with a clean slim-straight profile, perfect for both casual and semi-formal wear.",
    "price": 3699,
    "stock": 24,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-052",
    "title": "Unisex Minimalist Heavy Cotton Graphic Sweatshirt",
    "description": "350 GSM premium looped cotton crewneck sweatshirt with embroidered chest typography logo.",
    "price": 1899,
    "stock": 50,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-053",
    "title": "Men's Linen Casual Button-Down Shirt",
    "description": "100% breathable pure linen fabric with a relaxed spread collar, chest pocket, and lightweight texture.",
    "price": 2199,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-054",
    "title": "Women's Knitted Button-Up Cardigan",
    "description": "Warm ribbed knit cardigan crafted with soft blend fibers, dropped shoulders, and tortoiseshell buttons.",
    "price": 2499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-055",
    "title": "Unisex Oversized Heavyweight Graphic Tee",
    "description": "240 GSM combed cotton shirt with ribbed crew neckline, reinforced stitching, and drop-shoulder streetwear fit.",
    "price": 1299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-056",
    "title": "Classic Double-Breasted Trench Coat",
    "description": "Water-resistant cotton-gabardine trench coat with storm flaps, belted waist, and signature horn buttons.",
    "price": 7999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-057",
    "title": "Silk Formal Jacquard Tie Set with Pocket Square",
    "description": "100% pure mulberry silk necktie with matching woven pocket square and metal cufflinks.",
    "price": 1499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-058",
    "title": "100% Cashmere Winter Plaid Scarf",
    "description": "Ultra-luxurious brushed cashmere scarf with fringe trim, exceptional warmth, and soft touch feel.",
    "price": 3299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-059",
    "title": "Men's Slim-Fit Stretch Chino Trousers",
    "description": "Versatile stretch-cotton twill chinos with flat front design, slash pockets, and flexible comfort waistband.",
    "price": 2299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-060",
    "title": "Fleece-Lined Winter Track Pants",
    "description": "Heavyweight thermal jogger pants featuring soft fleece interior, drawstring elastic waist, and zipper pockets.",
    "price": 1899,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-061",
    "title": "Men's Washed Indigo Straight Leg Denim Pants",
    "description": "Classic straight-leg denim pants in washed indigo with soft hand-feel, reinforced pockets, and effortless fit.",
    "price": 2699,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-062",
    "title": "Merino Wool Crewneck Knit Sweater",
    "description": "Fine-gauge extra-fine Merino wool sweater with ribbed collar and cuffs, naturally temperature-regulating.",
    "price": 3499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-063",
    "title": "Men's Distressed Vintage Washed Denim Pants",
    "description": "Handcrafted distressed denim pants with authentic wash effects, whiskering details, and durable cotton construction.",
    "price": 3699,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-064",
    "title": "Floral Print Tiered Maxi Skirt",
    "description": "Flowing lightweight woven maxi skirt featuring tiered ruffles, elasticated smocked waistband, and allover floral motif.",
    "price": 2199,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-065",
    "title": "Cotton Twill Relaxed Utility Cargo Shorts",
    "description": "Durable multi-pocket cotton shorts with reinforced belt loops, side cargo flaps, and breathable comfort.",
    "price": 1699,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-066",
    "title": "Men's Casual Flannel Plaid Overshirt",
    "description": "Heavyweight yarn-dyed brushed flannel shirt with dual button-flap chest pockets and classic buffalo check pattern.",
    "price": 2399,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-067",
    "title": "Waterproof Hooded Windbreaker Rain Jacket",
    "description": "Seam-sealed water-repellent shell jacket with packable hood, storm flap, and adjustable drawcord hem.",
    "price": 3199,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-068",
    "title": "Lightweight Quilted Puffer Vest",
    "description": "Thermal synthetic down insulated gilet with stand collar, zippered hand pockets, and water-resistant outer finish.",
    "price": 2799,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-069",
    "title": "Men's Classic Denim Casual Button-Down Shirt",
    "description": "Premium lightweight cotton-denim button-down casual shirt with spread collar, chest flap pockets, and tailored modern fit.",
    "price": 1199,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-070",
    "title": "Tailored Italian Wool Blend Blazer",
    "description": "Structured two-button blazer with notch lapel, dual side vents, and functional interior welt pockets.",
    "price": 8499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-071",
    "title": "Velvet Sleeveless Evening Cocktail Gown",
    "description": "Sumptuous stretch-velvet formal evening dress with subtle side slit, scoop neckline, and graceful drape.",
    "price": 4999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-072",
    "title": "Thermal Compression Base Layer Top",
    "description": "Moisture-wicking four-way stretch athletic long sleeve top designed for thermal insulation during winter workouts.",
    "price": 1499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-073",
    "title": "Classic Pique Knit Cotton Polo Shirt",
    "description": "100% combed cotton pique polo shirt with two-button placket, ribbed collar, and tennis-tail hem.",
    "price": 1599,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-074",
    "title": "Vintage Corduroy Button-Down Shirt",
    "description": "Fine-wale pure cotton corduroy shirt with relaxed fit, buttoned cuffs, and rich garment-dyed wash.",
    "price": 2499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-075",
    "title": "Relaxed Fit Streetwear Fleece Joggers",
    "description": "350 GSM cotton fleece sweatpants with cuffed ankles, deep side pockets, and metal-tipped drawstrings.",
    "price": 1799,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-076",
    "title": "Hand-Embroidered Ethnic Kurti Top",
    "description": "Graceful pure cotton ethnic kurti with intricate Chikankari embroidery and side slits.",
    "price": 1999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-077",
    "title": "Casual Washed Chambray Shirt",
    "description": "Lightweight indigo chambray workshirt with double needle construction and pearlescent buttons.",
    "price": 2099,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-078",
    "title": "Ribbed Knit Turtleneck Pullover",
    "description": "Chunky ribbed knit rollneck sweater offering supreme warmth and snug winter comfort.",
    "price": 2899,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-079",
    "title": "Wool Felt Structured Fedora Hat",
    "description": "100% Australian wool felt wide-brim fedora hat with genuine leather hatband trim.",
    "price": 1899,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-080",
    "title": "Full Grain Leather Belt with Gunmetal Buckle",
    "description": "100% genuine Italian bridle leather belt with hand-burnished edges and solid zinc buckle.",
    "price": 1399,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-081",
    "title": "Heavy Canvas Utility Travel Duffle Bag",
    "description": "20 oz rugged waxed canvas weekend duffle with reinforced leather handles and brass zippers.",
    "price": 3999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-082",
    "title": "Polarized Classic Aviator Sunglasses",
    "description": "UV400 scratch-resistant polarized lenses housed in lightweight stainless steel frames.",
    "price": 2299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-083",
    "title": "Vintage RFID-Blocking Leather Bi-fold Wallet",
    "description": "Top-grain cowhide leather wallet with 8 card slots, dual currency compartments, and RFID shielding.",
    "price": 1299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-084",
    "title": "Combed Cotton Cushion Crew Socks (Pack of 3)",
    "description": "Breathable moisture-wicking crew socks with arch compression support and reinforced heel/toe.",
    "price": 699,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-085",
    "title": "Chunky Cable Knit Winter Beanie Cap",
    "description": "Soft thermal acrylic knit beanie with fold-over cuff and snug windproof coverage.",
    "price": 799,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-086",
    "title": "High-Rise Washed Denim Shorts",
    "description": "Classic non-stretch 100% cotton cut-off denim shorts with raw distressed hem.",
    "price": 1499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-087",
    "title": "Linen Blend Drawstring Lounge Pants",
    "description": "Relaxed summer trousers with elasticated drawstring waist, side slip pockets, and breezy linen weave.",
    "price": 1999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-088",
    "title": "Military Style MA-1 Bomber Flight Jacket",
    "description": "Nylon flight jacket with ribbed collar, utility sleeve pocket, and lightweight polyester polyfill.",
    "price": 4299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-089",
    "title": "Houndstooth Pattern Casual Tailored Blazer",
    "description": "Modern semi-formal blazer featuring classic micro houndstooth check weave and peak lapels.",
    "price": 6499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-090",
    "title": "French Terry Raglan Sleeve Sweatshirt",
    "description": "100% loopback French terry sweatshirt with athletic raglan sleeves and triangle collar insert.",
    "price": 2199,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-091",
    "title": "Pure Cotton Woven Boxer Shorts (Pack of 3)",
    "description": "Soft breathable cotton boxers with covered elastic waistband and functional fly button.",
    "price": 999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-092",
    "title": "Satin Silk Button-Front Sleepwear Set",
    "description": "Smooth lustrous satin pajama set with contrast piping, notch collar, and relaxed straight trousers.",
    "price": 2799,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-093",
    "title": "Men's Heavyweight Rugged Utility Denim Pants",
    "description": "Extra-durable heavyweight denim work pants built for longevity, with reinforced knees and functional tool pockets.",
    "price": 6999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-094",
    "title": "Poplin Short-Sleeve Resort Camp Shirt",
    "description": "Crisp cotton poplin Cuban collar shirt with tropical botanical print for warm-weather styling.",
    "price": 1799,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-095",
    "title": "Classic Oxford Cotton Button-Down (OCBD)",
    "description": "Heavyweight pinpoint Oxford cotton shirt featuring signature rolled collar and box pleat.",
    "price": 2499,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-096",
    "title": "Tartan Check Lambswool Winter Scarf",
    "description": "100% pure Scottish lambswool scarf in iconic Royal Stewart tartan with twisted tassel fringe.",
    "price": 1999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-097",
    "title": "Compact Leather Crossbody Sling Bag",
    "description": "Full-grain leather urban sling bag with adjustable nylon webbing strap and quick-access magnetic pouch.",
    "price": 2899,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-098",
    "title": "Men's Classic Heavy Twill Denim Pants - Raw Blue",
    "description": "Rugged 100% cotton heavy twill denim pants featuring classic five-pocket styling, bar-tack stitching, and a tailored straight cut.",
    "price": 3299,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-099",
    "title": "Unstructured Lightweight Linen Summer Blazer",
    "description": "Breathable unlined linen jacket with patch pockets and natural shoulder line for effortless tailoring.",
    "price": 5999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-100",
    "title": "Quick-Dry Stretch Board Swim Shorts",
    "description": "Water-repellent 4-way stretch boardshorts with secure zipper back pocket and mesh brief lining.",
    "price": 1399,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-101",
    "title": "Seamless Ribbed Knit Activewear Tank Top",
    "description": "Moisture-wicking compression stretch tank top with racerback design and scoop neckline.",
    "price": 999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "cloth-102",
    "title": "Men's Premium Stonewashed Straight Fit Denim Pants",
    "description": "Heavyweight stonewashed denim pants with classic 5-pocket design, reinforced rivets, and comfortable regular straight fit.",
    "price": 4999,
    "stock": 30,
    "category": "clothes",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-001",
    "title": "Nike Air Jordan 1 Retro High OG - Chicago Lost & Found",
    "color": "Red/White/Black",
    "description": "Iconic high-top basketball sneaker featuring premium cracked leather uppers, encapsulated Air-Sole cushioning, and vintage aesthetic detailing.",
    "price": 16995,
    "stock": 20,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-002",
    "title": "Adidas Ultraboost Light Running Shoes - Core Black",
    "color": "Core Black",
    "description": "Experience epic energy return with Light BOOST material, Primeknit+ upper for targeted support, and Continental Rubber outsole grip.",
    "price": 18999,
    "stock": 35,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-003",
    "title": "Puma RS-X Efekt Reflective Chunky Sneakers",
    "color": "White/Multi",
    "description": "Futuristic retro-inspired chunky sneakers with mesh upper, leather overlays, lightweight PU midsole, and reflective pops.",
    "price": 9999,
    "stock": 45,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-004",
    "title": "New Balance 550 Vintage Basketball Lifestyle Shoes",
    "color": "White/Green",
    "description": "Tribute to the 1989 basketball original, featuring low-top streamlined silhouette, premium leather upper, and durable rubber outsole.",
    "price": 11999,
    "stock": 30,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-005",
    "title": "Timberland 6-Inch Premium Waterproof Leather Boots",
    "color": "Wheat",
    "description": "Rugged iconic waterproof leather boots with PrimaLoft insulation, anti-fatigue technology, and seam-sealed construction.",
    "price": 17999,
    "stock": 18,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-006",
    "title": "ASICS Gel-Kayano 30 Long-Distance Running Shoes",
    "color": "Blue/White",
    "description": "Advanced stability running shoes with 4D GUIDANCE SYSTEM, PureGEL technology for cloud-like landings, and FF BLAST PLUS ECO cushioning.",
    "price": 15999,
    "stock": 40,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-007",
    "title": "Handcrafted Men's Genuine Leather Oxford Dress Shoes - Tan",
    "color": "Tan",
    "description": "Classic Goodyear welted full-grain calfskin leather Oxfords with brogue punch details and cushioned leather sole.",
    "price": 6999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-008",
    "title": "Converse Chuck 70 Vintage High-Top Canvas Sneakers",
    "color": "Black/White",
    "description": "Elevated Chuck Taylor featuring heavier 12oz organic canvas, vintage stitching, cushioned OrthoLite insole, and glossy egret midsole.",
    "price": 5999,
    "stock": 50,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-009",
    "title": "Salomon Speedcross 6 Gore-Tex Trail Running Shoes",
    "color": "Red/Black",
    "description": "Legendary trail running shoe featuring GORE-TEX waterproof membrane, Mud Contagrip deep lugged outsole, and Quicklace system.",
    "price": 14999,
    "stock": 22,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-010",
    "title": "Dr. Martens 1460 Smooth Leather 8-Eye Boots",
    "color": "Black",
    "description": "Original Dr. Martens 8-eye boot crafted from durable smooth leather, featuring yellow welt stitching and air-cushioned Bouncing Soles.",
    "price": 16999,
    "stock": 15,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-011",
    "title": "Vans Old Skool Core Classic Skate Shoes - Black/White",
    "color": "Black/White",
    "description": "Timeless side-stripe skate shoe featuring sturdy canvas and suede uppers, re-enforced toe caps, and signature rubber waffle outsoles.",
    "price": 4999,
    "stock": 65,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-012",
    "title": "Men's Italian Leather Penny Loafers - Espresso Brown",
    "color": "Espresso Brown",
    "description": "Hand-finished Italian suede penny loafers with apron toe stitching, flexible Blake welt construction, and memory foam insoles.",
    "price": 7999,
    "stock": 28,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-013",
    "title": "Nike Air Force 1 '07 Triple White",
    "color": "Triple White",
    "description": "Radiant low-top original with crisp leather overlays, perforated toe box, and Nike Air unit for lightweight all-day cushioning.",
    "price": 8995,
    "stock": 55,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-014",
    "title": "Women's Leather Ankle Chelsea Boots with Elastic Side Panels",
    "color": "Black",
    "description": "Sleek pull-on Chelsea boots in polished calfskin leather with durable stacked heel and non-slip rubber tread.",
    "price": 5499,
    "stock": 32,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-015",
    "title": "Under Armour Curry Flow 11 Basketball Shoes",
    "color": "White/Blue",
    "description": "Stephen Curry signature basketball shoes featuring rubberless UA Flow cushioning, Warp upper technology, and dual-density responsiveness.",
    "price": 13999,
    "stock": 24,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-016",
    "title": "Reebok Club C 85 Vintage Tennis Shoes",
    "color": "White/Green",
    "description": "Clean heritage court shoes made from soft garment leather, towel lining, EVA midsole, and high-abrasion rubber outsole.",
    "price": 6999,
    "stock": 42,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-017",
    "title": "Hoka One One Clifton 9 Maximalist Running Shoes",
    "color": "Blue/White",
    "description": "Ultra-cushioned daily trainer featuring responsive new foam, breathable engineered knit upper, and early-stage Meta-Rocker technology.",
    "price": 14999,
    "stock": 38,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-018",
    "title": "Nike ZoomX Vaporfly NEXT% 3 Racing Shoes",
    "color": "Neon Green/Black",
    "description": "Elite marathon road racing shoes equipped with full-length carbon fiber flyplate and responsive ZoomX foam midsole.",
    "price": 21995,
    "stock": 12,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-019",
    "title": "Skechers Arch Fit Go Walk Slip-On Walking Shoes",
    "color": "Black/White",
    "description": "Podiatrist-certified arch support walking shoes with stretch fit mesh fabric upper and lightweight ULTRA GO cushioning.",
    "price": 5499,
    "stock": 60,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-020",
    "title": "Men's Handcrafted Genuine Suede Driving Moccasins",
    "color": "Tan/Brown",
    "description": "Plush velvet suede driving shoes featuring pebbled rubber sole pods, exposed hand-stitching, and breathable leather footbed.",
    "price": 4499,
    "stock": 30,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-021",
    "title": "Crocs Classic Clog - Unisex Water Sandals",
    "color": "Yellow",
    "description": "Lightweight water-friendly clogs with Croslite foam cushioning, ventilation ports, and pivoting heel strap.",
    "price": 2995,
    "stock": 80,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-022",
    "title": "Adidas Predator Elite Firm Ground Football Boots",
    "color": "Black/Gold",
    "description": "Precision football boots featuring Strikeskin rubber fins, HybridTouch 2.0 upper, and CONTROLFRAME 2.0 outsole for firm ground pitch.",
    "price": 19999,
    "stock": 16,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-023",
    "title": "Birkenstock Arizona Unisex Two-Strap Leather Sandals",
    "color": "Cork/Tan",
    "description": "Iconic two-strap adjustable slide sandal with anatomically shaped cork-latex footbed lined in soft suede.",
    "price": 8990,
    "stock": 45,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-024",
    "title": "Columbia Crestwood Waterproof Hiking Shoes",
    "color": "Brown/Tan",
    "description": "Durable suede leather and mesh trail shoes featuring Omni-Tech waterproof seam-sealed construction and Techlite lightweight midsole.",
    "price": 7999,
    "stock": 35,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-025",
    "title": "Puma Future Ultimate FG/AG Soccer Cleats",
    "color": "Black/Gold",
    "description": "Engineered dual-mesh FUZIONFIT360 upper with PWRTAPE support, PWRPRINT texturing for ball touch, and Dynamic Motion System outsole.",
    "price": 16999,
    "stock": 18,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-026",
    "title": "Women's Strappy Stiletto Heel Sandals - Nude",
    "color": "Nude",
    "description": "Glamorous 3.5-inch stiletto heels featuring delicate ankle strap, padded footbed, and sleek metallic pin heel.",
    "price": 3999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-027",
    "title": "Nike Metcon 9 Cross-Training Shoes",
    "color": "White/Black",
    "description": "The gold standard for weightlifting and functional fitness, featuring enlarged Hyperlift plate, rubber rope wrap, and dual-density foam.",
    "price": 12795,
    "stock": 33,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-028",
    "title": "On Cloud 5 Lightweight Speed-Lacing Running Shoes",
    "color": "White/Grey",
    "description": "Signature Swiss engineering featuring CloudTec zero-gravity foam, patented Speedboard, and breathable antimicrobial mesh.",
    "price": 13999,
    "stock": 40,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-029",
    "title": "Men's Classic Wingtip Brogue Formal Leather Shoes",
    "color": "Dark Brown",
    "description": "Full-grain burnished leather dress Oxfords with decorative perforations, stacked heel, and soft leather lining.",
    "price": 5999,
    "stock": 22,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-030",
    "title": "Brooks Ghost 15 Neutral Distance Running Shoes",
    "color": "Blue/White",
    "description": "Smooth transition running shoes featuring updated DNA LOFT v2 cushioning, 3D Fit Print upper, and durable rubber traction.",
    "price": 12999,
    "stock": 36,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-031",
    "title": "Clarks Desert Boot in Original Beeswax Leather",
    "color": "Beeswax",
    "description": "The iconic crepe-soled ankle boot introduced in 1950, crafted from rich beeswax leather with simple lace-up fastening.",
    "price": 11999,
    "stock": 20,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-032",
    "title": "Adidas Samba OG Shoes - Cloud White/Core Black",
    "color": "White/Black",
    "description": "Born on the pitch, the Samba is a timeless icon of street style featuring soft leather upper, suede overlays, and gum rubber sole.",
    "price": 9999,
    "stock": 48,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-033",
    "title": "Merrell Moab 3 Mid Waterproof Hiking Boots",
    "color": "Brown/Tan",
    "description": "Famous for out-of-the-box comfort, durable suede upper, Vibram TC5+ outsole grip, and Air Cushion in the heel.",
    "price": 12999,
    "stock": 26,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-034",
    "title": "Nike Dunk Low Retro - Panda (Black/White)",
    "color": "Black/White",
    "description": "Created for the hardwood but taken to the streets, featuring crisp leather overlays, padded low-cut collar, and classic color-blocking.",
    "price": 9695,
    "stock": 50,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-035",
    "title": "Men's Slip-On Canvas Espadrilles - Navy Blue",
    "color": "Navy Blue",
    "description": "Casual summer espadrilles featuring breathable canvas upper, braided jute rope midsole, and flexible rubber sole.",
    "price": 1999,
    "stock": 70,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-036",
    "title": "Under Armour Phantom 3 SE Running Shoes",
    "color": "White/Blue",
    "description": "Ultra-breathable Warp upper, Molded midfoot panel for added structure, and responsive UA HOVR cushioning.",
    "price": 11999,
    "stock": 30,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-037",
    "title": "Women's Pointed Toe Block Heel Pumps - Classic Black",
    "color": "Black",
    "description": "Sophisticated 2-inch block heel pumps crafted from smooth faux leather with padded memory foam footbed.",
    "price": 2799,
    "stock": 40,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-038",
    "title": "Puma Future Rider Play On Unisex Sneakers",
    "color": "White/Multi",
    "description": "Vibrant retro running sneakers featuring slim Federbein shock-absorbing outsole and lightweight rider foam midsole.",
    "price": 6999,
    "stock": 45,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-039",
    "title": "Mizuno Wave Rider 27 Performance Running Shoes",
    "color": "Blue/White",
    "description": "Features Mizuno Enerzy foam for soft cushioning and high energy return, combined with eco-friendly Wave plate technology.",
    "price": 11999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-040",
    "title": "Men's Handcrafted Leather Double Monk Strap Shoes",
    "color": "White/Black",
    "description": "Distinguished double monk strap dress shoes with dual brass buckles, hand-burnished toe, and leather lining.",
    "price": 6499,
    "stock": 22,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-041",
    "title": "Reebok Zig Kinetica 2.5 Edge Outdoor Shoes",
    "color": "Black/White",
    "description": "Rugged outdoor inspired shoes with Zig Energy Shell surrounding the foam midsole and Vibram Ecostep lugged outsole.",
    "price": 10999,
    "stock": 28,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-042",
    "title": "Asics GEL-Nimbus 25 Maximum Cushioning Shoes",
    "color": "Blue/White",
    "description": "Softest cushioning running shoe featuring PureGEL technology, FF BLAST PLUS ECO cushioning, and stretch knit upper.",
    "price": 15999,
    "stock": 35,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-043",
    "title": "Women's Plush Faux Fur Slippers - Blush Pink",
    "color": "Blush Pink",
    "description": "Ultra-cozy indoor slide slippers with high-density memory foam footbed and non-slip durable rubber sole.",
    "price": 1299,
    "stock": 75,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-044",
    "title": "Saucony Endorphin Speed 3 Nylon Plate Trainers",
    "color": "White/Black",
    "description": "Featuring SPEEDROLL technology for effortless speed, PWRRUN PB foam cushioning, and re-designed winged nylon plate.",
    "price": 16999,
    "stock": 20,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-045",
    "title": "Nike Pegasus 40 Road Running Shoes",
    "color": "Red/White",
    "description": "The trusted workhorse with wings, featuring dual Zoom Air units, engineered single-layer mesh, and neutral support.",
    "price": 11895,
    "stock": 50,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-046",
    "title": "Men's Genuine Leather Chukka Ankle Boots - Dark Brown",
    "color": "Dark Brown",
    "description": "Versatile 3-eyelet Chukka boots crafted from rich oiled leather with comfortable crepe rubber outsole.",
    "price": 4999,
    "stock": 32,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-047",
    "title": "Adidas Forum Low Classic Retro Sneakers",
    "color": "White/Green",
    "description": "80s basketball icon featuring removable ankle strap, premium coated leather upper, and classic trefoil branding.",
    "price": 8999,
    "stock": 44,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-048",
    "title": "FootJoy Pro SL Golf Shoes - Waterproof Leather",
    "color": "White",
    "description": "Tour-proven spikeless golf shoes with ChromoSkin leather by Pittards, Fine Tuned Foam (FTF) for supple cushioning, and Infinity Outsole.",
    "price": 15999,
    "stock": 18,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-049",
    "title": "Women's Platform Canvas Lace-Up Sneakers",
    "color": "White/Multi",
    "description": "Trendy 1.5-inch platform canvas sneakers with durable vulcanized rubber sole and soft breathable cotton lining.",
    "price": 2499,
    "stock": 55,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-050",
    "title": "Men's Waterproof Tactical Combat Army Boots",
    "color": "Tan/Brown",
    "description": "Heavy-duty military tactical boots with side zip, high ankle collar, slip-resistant rubber lugs, and moisture-wicking lining.",
    "price": 5999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-051",
    "title": "SG Full Spike Leather Cricket Shoes",
    "color": "White/Red",
    "description": "Professional cricket shoes with lightweight TPU sole, removable steel spikes, reinforced toe box, and EVA mid-layer.",
    "price": 4299,
    "stock": 30,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-052",
    "title": "Unisex High-Top Canvas Skate Sneakers - All Black",
    "color": "All Black",
    "description": "Stealth black high-top canvas sneakers featuring reinforced metal eyelets, padded collar, and vulcanized rubber sole.",
    "price": 3499,
    "stock": 60,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-053",
    "title": "Nike Air Max 270 React Lifestyle Sneaker",
    "description": "Features Nike's biggest heel Air unit combined with lightweight React foam for all-day bounce.",
    "price": 13995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-054",
    "title": "Adidas Originals Stan Smith Classic White",
    "description": "Iconic tennis sneaker crafted with crisp leather upper, perforated 3-Stripes, and green heel tab.",
    "price": 8999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-055",
    "title": "Puma Suede Classic XXI Streetwear Sneakers",
    "description": "Full suede upper with synthetic lining, comfortable sockliner, and rubber midsole traction.",
    "price": 6999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-056",
    "title": "New Balance 574 Core Heritage Suede Sneaker",
    "description": "ENCAP midsole cushioning combines lightweight foam with a durable polyurethane rim.",
    "price": 9999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-057",
    "title": "Asics Gel-Kayano 30 Stability Running Shoes",
    "description": "4D GUIDANCE SYSTEM for adaptive stability and PureGEL technology for softer landings.",
    "price": 15999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-058",
    "title": "Vans Old Skool Classic Canvas Skate Shoes",
    "description": "The original Vans side stripe skate shoe with sturdy suede/canvas uppers and signature waffle outsoles.",
    "price": 4999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-059",
    "title": "Converse Chuck Taylor All Star High-Top",
    "description": "Timeless canvas high-top sneaker with classic ankle patch, vulcanized rubber sole, and metal eyelets.",
    "price": 4499,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-060",
    "title": "Clarks Original Suede Desert Boot",
    "description": "Iconic ankle boot in premium beeswax leather with timeless crepe rubber sole and clean two-eyelet lacing.",
    "price": 11999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-061",
    "title": "Timberland 6-Inch Premium Waterproof Boot",
    "description": "Direct-attach waterproof construction, PrimaLoft insulation, and rugged lug outsole.",
    "price": 17999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-062",
    "title": "Dr. Martens 1460 Smooth Leather 8-Eye Boot",
    "description": "Built with durable Smooth leather, yellow welt stitching, and Goodyear welted AirWair bouncing sole.",
    "price": 16999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-063",
    "title": "Reebok Club C 85 Vintage Court Sneakers",
    "description": "Soft garment leather upper with terry cloth lining and retro Archive branding details.",
    "price": 7999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-064",
    "title": "Under Armour HOVR Phantom 3 Running Shoes",
    "description": "UA HOVR technology provides 'zero gravity feel' to maintain energy return and absorb impact.",
    "price": 12999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-065",
    "title": "Brooks Ghost 15 Neutral Performance Running Shoes",
    "description": "DNA LOFT v2 cushioning delivers plush softness without adding bulk or sacrificing responsiveness.",
    "price": 13990,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-066",
    "title": "Saucony Triumph 21 Max Cushion Running Shoes",
    "description": "PWRRUN+ foam technology gives you an exceptionally lightweight, springy road running sensation.",
    "price": 14490,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-067",
    "title": "Hoka One One Clifton 9 Road Shoes",
    "description": "Responsive new foam and improved outsole design for silky-smooth everyday running transitions.",
    "price": 14999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-068",
    "title": "Salomon Speedcross 6 All-Terrain Trail Shoes",
    "description": "Mud Contagrip outsole with aggressive deep chevron lugs for maximum grip on loose technical trails.",
    "price": 13999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-069",
    "title": "On Cloud 5 Lightweight Running Shoes",
    "description": "CloudTec in Zero-Gravity foam for cushioned landings and signature Speed-lacing system.",
    "price": 13990,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-070",
    "title": "Skechers Go Walk Arch Fit Slip-On Shoes",
    "description": "Podiatrist-certified arch support with responsive ULTRA GO cushioning and high-rebound Comfort Pillars.",
    "price": 5499,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-071",
    "title": "Birkenstock Arizona Leather Two-Strap Sandals",
    "description": "Anatomically shaped cork-latex footbed with genuine oiled nubuck leather straps.",
    "price": 8990,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-072",
    "title": "Crocs Classic Comfortable Unisex Clogs",
    "description": "Original Croslite foam cushioning with pivoting heel straps and ventilation ports for breathability.",
    "price": 2995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-073",
    "title": "Allen Edmonds Park Avenue Cap-Toe Oxford Shoes",
    "description": "Handcrafted full-grain calfskin dress shoe with 360-degree Goodyear welt construction.",
    "price": 28990,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-074",
    "title": "Cole Haan GrandPrø Lightweight Tennis Sneaker",
    "description": "Featherweight leather court sneaker with Grand.ØS ergonomic comfort technology.",
    "price": 11999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-075",
    "title": "Steve Madden Block Heel Dress Sandals",
    "description": "Chic single strap minimalist evening sandal with supportive ankle buckle and sturdy block heel.",
    "price": 7999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-076",
    "title": "Aldo Stessy Pointed Toe Stiletto Pumps",
    "description": "Glossy pointed-toe high heel pumps with Pillow Walk cushioned insole for special occasions.",
    "price": 8999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-077",
    "title": "Woodland Rugged Outdoor Leather Trekking Shoes",
    "description": "Heavy-duty nubuck leather outdoor shoes with shock-absorbing polyurethane midsole and deep grip lugs.",
    "price": 4995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-078",
    "title": "Red Tape Formal Chelsea Leather Boots",
    "description": "Slip-on elasticated side gusset boots crafted from premium burnished leather with sleek TPR soles.",
    "price": 3499,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-079",
    "title": "Nike Air Force 1 '07 All-White Leather",
    "description": "Legendary low-cut basketball silhouette featuring encapsulated Nike Air cushioning and stitched overlays.",
    "price": 8995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-080",
    "title": "Adidas Ultraboost 1.0 Primeknit Running Shoes",
    "description": "Primeknit upper wraps the foot in supportive fit while full-length BOOST midsole delivers boundless energy.",
    "price": 17999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-081",
    "title": "Puma Future Rider Play On Retro Sneakers",
    "description": "Vibrant color-blocked upper with shock-absorbing Federbein outsole and ultra-comfortable Rider Foam.",
    "price": 6999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-082",
    "title": "Jordan Retro 4 Industrial Blue Basketball Shoes",
    "description": "Classic mesh side panel inserts, sculpted midsole with visible Air unit, and molded eyelet wings.",
    "price": 19995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-083",
    "title": "New Balance 9060 Chunky Futuristic Sneakers",
    "description": "Exaggerated wavy proportions with ABZORB and SBS cushioning inspired by 2000s tech aesthetics.",
    "price": 15999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-084",
    "title": "Asics Gel-Nimbus 26 Plush Cushion Running Shoes",
    "description": "Engineered knit upper with FF BLAST PLUS ECO foam for maximum cloud-like cushioning.",
    "price": 16999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-085",
    "title": "Mizuno Wave Rider 27 Road Running Shoes",
    "description": "Mizuno Wave plate delivers both cushioning and stability for smooth propulsion throughout your gait.",
    "price": 12999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-086",
    "title": "Merrell Moab 3 Waterproof Hiking Shoes",
    "description": "Vibram TC5+ outsole, kinetic fit advanced insole, and protective rubber toe cap for trail dominance.",
    "price": 11499,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-087",
    "title": "Vans Sk8-Hi High-Top Canvas Suede Skate Shoes",
    "description": "Padded collars for support and flexibility with reinforced toe caps to withstand repeated wear.",
    "price": 5999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-088",
    "title": "Converse Run Star Hike Platform High-Tops",
    "description": "Chunky platform midsole with two-tone jagged sawtooth rubber outsole and smart foam sockliner.",
    "price": 6999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-089",
    "title": "Hush Puppies Leather Penny Loafers",
    "description": "Hand-sewn moccasin construction with Bounce technology memory foam footbed and leather lining.",
    "price": 5999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-090",
    "title": "Geox Respira Italian Breathable Leather Derby",
    "description": "Patented breathable perforated sole with waterproof membrane keeps feet dry and temperature balanced.",
    "price": 12499,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-091",
    "title": "Skechers D'Lites Chunky Retro Sneakers",
    "description": "Smooth leather upper with mesh cooling panels, Air-Cooled Memory Foam insole, and thick midsole.",
    "price": 4999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-092",
    "title": "Nike ZoomX Vaporfly Next% 3 Marathon Racing Shoes",
    "description": "Full-length carbon fiber flyplate combined with responsive ZoomX foam for race-day speed.",
    "price": 21995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-093",
    "title": "Adidas Terrex Free Hiker 2 Gore-Tex Hiking Boots",
    "description": "GORE-TEX membrane seals out moisture while Continental Rubber outsole grips wet surfaces.",
    "price": 18999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-094",
    "title": "Puma Smash v2 Low-Top Leather Sneakers",
    "description": "Clean tennis-inspired silhouette with soft leather upper and durable non-marking rubber outsole.",
    "price": 3999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-095",
    "title": "On Cloudmonster Max-Cushion Road Running Shoes",
    "description": "Extreme CloudTec elements with Helion superfoam deliver maximum bounce and energetic rebound.",
    "price": 16990,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-096",
    "title": "Salomon XT-6 Advanced Sportstyle Sneaker",
    "description": "Agile Chassis System (ACS) stability structure with durable TPU film welded on abrasion-resistant mesh.",
    "price": 18999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-097",
    "title": "Crocs Echo Clog Sculpted Futuristic Foam Slides",
    "description": "Bold sculpted styling with LiteRide drop-in footbed for all-around lightweight comfort.",
    "price": 4995,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-098",
    "title": "Dr. Martens 2976 Classic Chelsea Leather Boot",
    "description": "Easy slip-on elastic gusset Chelsea boot with signature yellow welt stitch and air-cushioned sole.",
    "price": 15999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-099",
    "title": "Woodland High-Ankle Suede Leather Boots",
    "description": "Padded ankle collar with rust-resistant brass eyelets and heavy oil-resistant grooved sole.",
    "price": 5495,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-100",
    "title": "Clarks Tilden Cap Formal Derby Leather Shoes",
    "description": "Rich full-grain leather cap-toe derby with discreet elastic gore inserts and Ortholite footbed.",
    "price": 6999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-101",
    "title": "Nike Metcon 9 Functional Cross-Training Shoes",
    "description": "Larger Hyperlift plate in the heel gives unshakeable stability for squats, deadlifts, and wall walks.",
    "price": 12495,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "shoe-102",
    "title": "Under Armour Curry 11 Performance Basketball Shoes",
    "description": "Dual-density UA Flow cushioning gives exceptional on-court traction, lightness, and court feel.",
    "price": 14999,
    "stock": 25,
    "category": "shoes",
    "images": [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-001",
    "title": "MRF Genius Grand Edition English Willow Cricket Bat",
    "description": "Grade 1 natural air-dried English Willow cricket bat crafted for explosive power, optimum balance, and massive sweet spot.",
    "price": 38999,
    "stock": 15,
    "category": "sports",
    "images": [
      "/products/mrf_cricket_bat.jpg"
    ]
  },
  {
    "_id": "sport-002",
    "title": "Adidas FIFA World Cup Official Match Football - Size 5",
    "description": "Thermal bonded seamless surface technology for predictable trajectory, better touch, and lower water uptake. FIFA Quality Pro certified.",
    "price": 9999,
    "stock": 40,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-003",
    "title": "Wilson NBA Official Composite Leather Basketball",
    "description": "Official NBA indoor/outdoor composite leather basketball featuring Ever Bounce construction and Inflation Retention Lining.",
    "price": 4999,
    "stock": 50,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-004",
    "title": "Babolat Pure Drive Tennis Racket (300g)",
    "description": "Iconic power tennis racket featuring FSI Power technology and HTR System for explosive responsiveness and high stability.",
    "price": 19999,
    "stock": 22,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-005",
    "title": "Yonex Astrox 99 Pro Badminton Racket (4U, G5)",
    "description": "Head-heavy badminton racket engineered with NAMD graphite for steep, devastating smashes and enhanced shuttle hold.",
    "price": 16499,
    "stock": 30,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-006",
    "title": "Everlast Pro Style Training Boxing Gloves (14 oz) - Red",
    "description": "Premium synthetic leather boxing gloves with dual-layered foam padding, full wrist wrap strap, and mesh ventilated palm.",
    "price": 3499,
    "stock": 45,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-007",
    "title": "Rubber Encased Hex Dumbbell Set (20kg Pair)",
    "description": "Professional grade cast iron hex dumbbells with protective heavy-duty rubber coating and ergonomically contoured chrome handles.",
    "price": 5999,
    "stock": 25,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-008",
    "title": "Premium 6mm Non-Slip TPE Yoga Mat with Alignment Lines",
    "description": "Eco-friendly dual-layer TPE yoga mat providing superior grip, extra density cushioning for joints, and laser-engraved alignment markings.",
    "price": 1899,
    "stock": 80,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-009",
    "title": "Motorized Folding Treadmill with 3.0 HP Peak Motor & Incline",
    "description": "Heavy-duty home treadmill featuring multi-layer shock absorption belt, digital LCD console, speed up to 14 km/h, and Bluetooth speakers.",
    "price": 29990,
    "stock": 10,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-010",
    "title": "Callaway Strata Complete Golf Club Set with Stand Bag (12-Piece)",
    "description": "Complete golf set including titanium driver, 3-wood, 4 & 5 hybrids, 6-9 irons, pitching wedge, putter, and lightweight stand bag.",
    "price": 44999,
    "stock": 12,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-011",
    "title": "Stiga Pro Carbon Table Tennis Racket",
    "description": "Performance level ping pong paddle featuring 7-ply lightweight blade with carbon technology, 2.0mm ITTF approved rubber.",
    "price": 6999,
    "stock": 35,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-012",
    "title": "Element Complete 8.0-inch Skateboard - Maple Deck",
    "description": "Pre-assembled complete skateboard featuring 7-ply North American maple deck, 52mm 99A wheels, and smooth ABEC-5 bearings.",
    "price": 7499,
    "stock": 28,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-013",
    "title": "Speedo Vanquisher 2.0 Anti-Fog Swim Goggles",
    "description": "Low-profile competitive swim goggles with panoramic anti-fog UV protection lenses, silicone eye seals, and 4 interchangeable nosepieces.",
    "price": 1999,
    "stock": 60,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-014",
    "title": "Giro Register MIPS Adult Road Cycling Helmet",
    "description": "Lightweight in-mold polycarbonate helmet featuring MIPS Brain Protection System, Roc Loc Sport fit dial, and 22 wind tunnel vents.",
    "price": 5499,
    "stock": 32,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-015",
    "title": "CamelBak HydroBak Light 1.5L Hydration Backpack",
    "description": "Compact lightweight hydration pack with 1.5-liter Crux reservoir, breathable air mesh back panel, and reflective safety accents.",
    "price": 3999,
    "stock": 40,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-016",
    "title": "Heavy Duty 4ft Filled Punching Bag Set with Chains",
    "description": "Durable synthetic leather heavy bag stuffed with shock-absorbing textile filling, includes heavy duty ceiling hanger swivel mount.",
    "price": 4999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-017",
    "title": "11-Piece Stackable Resistance Bands Set with Door Anchor & Handles",
    "description": "Heavy-duty natural latex workout bands up to 150 lbs total resistance, includes ankle straps, foam handles, and travel pouch.",
    "price": 1499,
    "stock": 90,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-018",
    "title": "Quechua 4-Person Waterproof Camping Tent (2 Seconds Easy setup)",
    "description": "Pop-up dome tent with Fresh & Black technology to keep interior cool and dark, wind-resistant up to 50 km/h, and 2000mm waterproofing.",
    "price": 8999,
    "stock": 18,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-019",
    "title": "Black Diamond Trail Ergo Cork Trekking Poles (Pair)",
    "description": "Lightweight aluminum hiking poles with natural cork grips, ergonomic 15-degree corrective angle, and dual FlickLock adjustability.",
    "price": 9999,
    "stock": 25,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-020",
    "title": "USAPA Approved Pickleball Paddle Set (2 Paddles + 4 Balls)",
    "description": "Graphite carbon fiber face pickleball paddles with polymer honeycomb core, sweat-absorbent grip, and outdoor balls with carry bag.",
    "price": 4499,
    "stock": 38,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-021",
    "title": "Rawlings Select Pro Lite Youth Baseball Glove (11.5-inch)",
    "description": "All-leather shell baseball glove featuring Pro H web pattern, palm padding for impact protection, and soft fingerback lining.",
    "price": 3999,
    "stock": 30,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-022",
    "title": "Cressi Panoramic Tempered Glass Snorkel Diving Set",
    "description": "Dry-top splash-proof snorkel with panoramic 4-lens tempered glass scuba mask and soft hypoallergenic silicone skirt.",
    "price": 3499,
    "stock": 35,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-023",
    "title": "Intex Challenger K2 Inflatable 2-Person Kayak Set",
    "description": "Heavy-duty puncture resistant vinyl inflatable kayak with aluminum oars, high-output hand pump, removable skeg, and cargo net.",
    "price": 12999,
    "stock": 14,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-024",
    "title": "Adjustable Inline Skates Roller Blades with Illuminating Wheels",
    "description": "High-performance outdoor roller blades with aluminium frame, ABEC-7 bearings, and self-generating power LED light wheels.",
    "price": 3999,
    "stock": 42,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-025",
    "title": "SG Club Leather Cricket Ball (Pack of 6) - Red",
    "description": "Alum tanned top quality leather cricket balls sewn with linen thread, hand-crafted core for shape retention and consistent bounce.",
    "price": 2499,
    "stock": 50,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-026",
    "title": "Molten B7G5000 FIBA Approved Match Basketball - Size 7",
    "description": "Flagship premium real leather basketball featuring Dual-Cushion technology, 12-panel design, and superior tactile grip.",
    "price": 8999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-027",
    "title": "Head Radical Pro Tennis Racket (315g)",
    "description": "Engineered with Auxetic technology for sensational impact feel, versatile frame geometry, and extreme spin potential.",
    "price": 18499,
    "stock": 24,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-028",
    "title": "Li-Ning G-Force Superlite 3600 Badminton Racket",
    "description": "Ultra-lightweight 78g carbon fiber racket with High Tensile Slim Shaft and Dynamic Optimum Frame for fast swing speeds.",
    "price": 3299,
    "stock": 45,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-029",
    "title": "Cast Iron Kettlebell 16kg with Vinyl Coating",
    "description": "Solid cast iron kettlebell coated in color-coded vinyl to protect floors, featuring wide smooth handle for two-handed grip.",
    "price": 3299,
    "stock": 35,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-030",
    "title": "Mikasa V200W Official FIVB Volleyball",
    "description": "Official indoor match volleyball featuring 18 aerodynamic dimpled panels and Nano Balloon Silica technology for flight control.",
    "price": 6499,
    "stock": 28,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-031",
    "title": "Nivia Storm Football - Size 5 (White/Blue)",
    "description": "Durable 32-panel rubberized hand-stitched football with high air retention butyl bladder for rough ground play.",
    "price": 999,
    "stock": 75,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-032",
    "title": "Decathlon Domyos Magnetic Exercise Spin Bike",
    "description": "Ultra-smooth magnetic resistance indoor cycling bike with 12kg flywheel, adjustable handlebars/seat, and heart rate sensors.",
    "price": 24999,
    "stock": 15,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-033",
    "title": "Kookaburra Kahuna Pro Batting Pads (Cricket)",
    "description": "Ultra-lightweight high-density foam cricket leg guards with traditional cane construction and ergonomic knee roll.",
    "price": 4999,
    "stock": 32,
    "category": "sports",
    "images": [
      "/products/kookaburra_batting_pads.jpg"
    ]
  },
  {
    "_id": "sport-034",
    "title": "High Density EVA Foam Fitness Roller for Muscle Recovery",
    "description": "18-inch deep tissue foam roller for myofascial release, relieving muscle soreness, and improving flexibility.",
    "price": 999,
    "stock": 65,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-035",
    "title": "Garmin HRM-Pro Plus Premium Chest Strap Heart Rate Monitor",
    "description": "Transmits real-time heart rate data via ANT+ and Bluetooth LE, captures running dynamics, and stores data during swims.",
    "price": 11990,
    "stock": 22,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-036",
    "title": "Louisville Slugger Vapor Aluminum Baseball Bat (-3 drop)",
    "description": "7-Series one-piece alloy baseball bat with HUB 1-piece end cap for maximum swing speed and sweet spot performance.",
    "price": 7999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1593786481097-cf281dd12e9e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-037",
    "title": "Victor Feather Shuttlecocks Gold No. 1 (Tube of 12)",
    "description": "Premium goose feather shuttlecocks crafted for accurate flight stability, durability, and tournament speed.",
    "price": 1899,
    "stock": 80,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-038",
    "title": "Speedo Silicone Unisex Swimming Cap",
    "description": "100% premium ergonomic silicone swim cap designed to reduce drag, protect hair from chlorine, and fit securely.",
    "price": 599,
    "stock": 100,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-039",
    "title": "Spalding High-Speed Weighted Skipping Jump Rope",
    "description": "Tangle-free ball bearing steel cable jump rope with non-slip foam handles, easily adjustable cable length for cardio workouts.",
    "price": 799,
    "stock": 85,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-040",
    "title": "Coleman 48-Quart Heavy Duty Ice Chest Cooler Box",
    "description": "Insulated hard cooler holds up to 63 cans, keeps ice frozen for up to 3 days in temperatures up to 90°F, leak-resistant drain.",
    "price": 4999,
    "stock": 25,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-041",
    "title": "Titleist Pro V1 Golf Balls (Dozen)",
    "description": "The #1 ball in golf offering total performance for extraordinary distance, high flight, low long game spin, and Drop-and-Stop control.",
    "price": 5499,
    "stock": 40,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-042",
    "title": "Cosco Target Basketball Board Set with Steel Ring & Net",
    "description": "Heavy-duty acrylic backboard with spring-action steel breakaway rim and weather-resistant nylon net.",
    "price": 3499,
    "stock": 30,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-043",
    "title": "Decathlon 500 Indoor Table Tennis Table (Standard Foldable)",
    "description": "Official size foldable ping pong table with 18mm chipboard top, sturdy steel frame, integrated net, and 4 locking wheels.",
    "price": 26999,
    "stock": 8,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-044",
    "title": "Pro Handcrafted English Leather Field Hockey Ball (Pack of 4)",
    "description": "Official match dimpled hockey ball engineered for water-turf and grass pitches, seamless cork core interior.",
    "price": 1299,
    "stock": 55,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-045",
    "title": "Multi-Grip Wall Mounted Pull-Up Bar",
    "description": "Heavy-gauge steel chin-up bar with 6 padded foam handles, supports up to 200kg for arm, back, and core workouts.",
    "price": 2299,
    "stock": 45,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-046",
    "title": "Nivia Double Action High Pressure Ball Air Pump",
    "description": "Dual-action inflation pump pushes air on both push and pull stroke, includes flex hose and metal needles.",
    "price": 499,
    "stock": 120,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-047",
    "title": "Body Sculpture Adjustable Ab Roller Wheel with Knee Pad",
    "description": "Ultra-wide dual wheel design for enhanced stability, non-slip rubber tread, ergonomic comfort handles, and thick foam knee mat.",
    "price": 899,
    "stock": 70,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-048",
    "title": "Puma Cat Hand-Stitched Size 5 Training Soccer Ball",
    "description": "32-panel TPU casing training football with multi-layered polyester backing and rubber bladder for shape stability.",
    "price": 1499,
    "stock": 60,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-049",
    "title": "Hydration Running Belt Waist Pack with Water Bottle Holder",
    "description": "No-bounce lightweight fanny pack with insulated water bottle pocket, touchscreen zipper pouch, and key clip.",
    "price": 1199,
    "stock": 65,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-050",
    "title": "Everlast Heavy Duty Hand Wraps (180-inch) - Pair",
    "description": "Polyester-cotton blend breathable hand wraps with thumb loop and hook-and-loop closure for wrist & knuckle support.",
    "price": 599,
    "stock": 95,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-051",
    "title": "SG Savage Edition Cricket Helmet with Steel Visor",
    "description": "High impact outer shell cricket helmet with sweat-absorbent lining, adjustable steel face guard, and ear protectors.",
    "price": 2799,
    "stock": 35,
    "category": "sports",
    "images": [
      "/products/sg_cricket_helmet.svg"
    ]
  },
  {
    "_id": "sport-052",
    "title": "Dunlop Fort All Court Tennis Balls (Can of 3)",
    "description": "Premium pressurised tennis balls engineered with HD Durability Cloth for high visibility and long-lasting play on all court surfaces.",
    "price": 799,
    "stock": 90,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-053",
    "title": "Kookaburra Kahuna Pro Cricket Bat",
    "description": "Grade 1 English Willow crafted with high spine profile and thick edges for explosive boundary hitting.",
    "price": 34999,
    "stock": 20,
    "category": "sports",
    "images": [
      "/products/kookaburra_cricket_bat.jpg"
    ]
  },
  {
    "_id": "sport-054",
    "title": "SS Ton Reserve Edition English Willow Bat",
    "description": "Handcrafted master cricket bat with massive contour profile, round Sarawak cane handle, and supreme balance.",
    "price": 29999,
    "stock": 20,
    "category": "sports",
    "images": [
      "/products/ss_ton_cricket_bat.jpg"
    ]
  },
  {
    "_id": "sport-055",
    "title": "SG Club Four-Piece Leather Cricket Balls (Pack of 2)",
    "description": "Alum tanned top-quality leather ball with naturally seasoned inner core for 50-over matches.",
    "price": 1699,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-056",
    "title": "Gray-Nicolls Shockwave 2.0 Cricket Batting Gloves",
    "description": "Multi-section split finger design with high-density EVA foam and Pittards premium leather palm.",
    "price": 3499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-057",
    "title": "DSC Intense Speed Lightweight Batting Pads",
    "description": "Ultra-lightweight high-density foam front with reinforced cane rods and breathable airmesh bolsters.",
    "price": 2999,
    "stock": 20,
    "category": "sports",
    "images": [
      "/products/dsc_batting_pads.jpg"
    ]
  },
  {
    "_id": "sport-058",
    "title": "Mikasa Official V200W Indoor Volleyball",
    "description": "18-panel aerodynamic dimpled surface design for stable trajectory and superior ball control.",
    "price": 6499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-059",
    "title": "Spalding TF-1000 Legacy Indoor Basketball",
    "description": "Exclusive ZK microfiber composite leather cover with deep channel design for optimal grip and feel.",
    "price": 5499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-060",
    "title": "Molten BG4500 FIBA Approved Match Basketball",
    "description": "12-panel GIUGIARO design with premium composite leather and flattened seams for consistent spin.",
    "price": 5999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-061",
    "title": "Puma Accelerate Pro Indoor Court Shoes",
    "description": "Engineered for rapid directional agility with non-marking high-grip rubber outsole for badminton/squash.",
    "price": 7999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-062",
    "title": "Stiga Pro Carbon Table Tennis Racket",
    "description": "7-ply extra light blade with Carbon 3K technology and ITTF approved S5 rubber for high speed play.",
    "price": 4999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-063",
    "title": "Butterfly Timo Boll ALC Table Tennis Blade",
    "description": "Arylate-Carbon blade offering medium-hard feel, excellent dwell time, and venomous topspin power.",
    "price": 14999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-064",
    "title": "Nittaku 3-Star Table Tennis Balls (Pack of 6)",
    "description": "ITTF approved non-celluloid 40+ tournament balls renowned for perfect sphericity and bounce.",
    "price": 1299,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-065",
    "title": "Speedo Fastskin Elite Mirrored Swimming Goggles",
    "description": "Hydrodynamic low-profile racing goggles with IQfit 3D seal for leak-free, drag-reducing performance.",
    "price": 3499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-066",
    "title": "Arena Tracks Mirrored Competitive Racing Goggles",
    "description": "Anti-fog treated polycarbonate lenses with interchangeable nose bridges and dual silicone strap.",
    "price": 2199,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-067",
    "title": "Speedo 100% Silicone Ergonomic Swim Cap",
    "description": "Seamless contoured shape for superior hydrodynamic fit, reduced drag, and hair protection.",
    "price": 699,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-068",
    "title": "Hexagonal Rubber Encased Dumbbell (10kg Pair)",
    "description": "Solid cast-iron core with durable virgin rubber hexagonal heads that prevent rolling and protect floors.",
    "price": 3999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-069",
    "title": "Bowflex SelectTech 552 Quick Adjustable Dumbbells",
    "description": "Replaces 15 sets of weights, easily adjusting from 2.5kg to 24kg with a simple turn of the dial.",
    "price": 28990,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-070",
    "title": "Cast Iron Competition Kettlebell (16 kg)",
    "description": "Precision single-cast iron kettlebell with wide textured grip handle for smooth snatches and swings.",
    "price": 2799,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-071",
    "title": "Manduka PRO Ultra-Dense Yoga Mat 6mm",
    "description": "High-density closed-cell cushioning protects joints while proprietary dot pattern resists slippage.",
    "price": 9999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-072",
    "title": "Liforme Original Alignment Non-Slip Yoga Mat",
    "description": "Revolutionary GripForMe material with AlignForMe guiding grid system for perfect postural balance.",
    "price": 12999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-073",
    "title": "TRX PRO4 Full Body Suspension Trainer System",
    "description": "Heavy-duty nylon straps with industrial-grade carabiner, adjustable foot cradles, and door anchor.",
    "price": 14999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-074",
    "title": "Heavy Duty Pull-Up Resistance Bands (Set of 4)",
    "description": "100% natural latex looped resistance bands offering assistance levels from 15 lbs to 125 lbs.",
    "price": 1899,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-075",
    "title": "Everlast Heavy Punching Bag (70 lb / 32 kg)",
    "description": "Durable Nevatear synthetic leather construction with reinforced webbed straps for intense striking.",
    "price": 6999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-076",
    "title": "Venum Challenger 3.0 Boxing Gloves (12 oz)",
    "description": "Triple density foam layer for better shock absorption with large velcro closure for wrist support.",
    "price": 3899,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-077",
    "title": "Fairtex Muay Thai Shin Guards (Black)",
    "description": "Handmade in Thailand with Syntek leather, double velcro straps, and no metal loops for safety.",
    "price": 7499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-078",
    "title": "Decathlon B'Twin 500 Aerodynamic Cycling Helmet",
    "description": "Lightweight in-mold construction with 17 ventilation channels, dial retention ring, and sun visor.",
    "price": 2499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-079",
    "title": "Giro Savant Road Cycling Helmet",
    "description": "Slim profile with Roc Loc 5 fit system and 25 Wind Tunnel vents for optimal cooling on long rides.",
    "price": 5999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-080",
    "title": "Garmin Forerunner 55 GPS Sports Running Watch",
    "description": "Track time, distance, pace and heart rate during your runs with Garmin Coach personalized training plans.",
    "price": 17990,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-081",
    "title": "Polar H10 Chest Strap Bluetooth Heart Rate Sensor",
    "description": "Gold standard in heart rate accuracy with built-in memory, ANT+, and machine-washable soft strap.",
    "price": 7999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-082",
    "title": "Theragun Prime Deep Muscle Percussive Massager",
    "description": "Smart percussive therapy device with 16mm amplitude, ergonomic multi-grip, and QuietForce tech.",
    "price": 23990,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-083",
    "title": "Hyperice Hypervolt 2 Cordless Massage Gun",
    "description": "Lightweight handheld percussion device with 3 speed settings and patented QuietGlide technology.",
    "price": 19999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-084",
    "title": "Hydro Flask 32 oz Wide Mouth Insulated Sports Bottle",
    "description": "TempShield double-wall vacuum insulation keeps drinks ice cold for up to 24 hours, pure 18/8 steel.",
    "price": 3499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-085",
    "title": "CamelBak Podium Chill Insulated Bike Bottle",
    "description": "Double-walled construction with self-sealing Jet Valve cap prevents splatters and spills while riding.",
    "price": 1699,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-086",
    "title": "Element Section Complete Skateboard (8.0 Inch)",
    "description": "7-ply premium Canadian maple deck with raw Element trucks, 52mm wheels, and ABEC 5 bearings.",
    "price": 6999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-087",
    "title": "Santa Cruz Classic Dot Skateboard Deck (8.25 Inch)",
    "description": "Hard Rock maple construction with iconic Jim Phillips dot graphic and medium concave deck profile.",
    "price": 4499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-088",
    "title": "Callaway Chrome Soft Golf Balls (Dozen)",
    "description": "Hyper Elastic SoftFast Core for increased ball speed, high launch, and low spin off the driver.",
    "price": 4499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-089",
    "title": "TaylorMade Stealth 2 Plus Titanium Golf Driver",
    "description": "60X Carbon Twist Face technology surrounded by carbon composite for maximum energy transfer.",
    "price": 49999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-090",
    "title": "Titleist Vokey SM9 Tour Chrome Golf Wedge",
    "description": "Forward center of gravity (CG) for controlled trajectory and precision spin milled grooves.",
    "price": 14999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-091",
    "title": "Wilson Pro Staff 97 v14 Precision Tennis Racket",
    "description": "Paradigm Bending carbon fiber construction optimizes flex between hoop and shaft for pinpoint control.",
    "price": 21999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-092",
    "title": "Head Speed MP 2024 Auxetic Tennis Racket",
    "description": "Auxetic 2.0 technology delivers sensational feel and fast-paced dynamic swing maneuverability.",
    "price": 19999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-093",
    "title": "Dunlop Fort All Court Pressurized Tennis Balls (Can of 4)",
    "description": "HD Core and Fluoro Cloth technology for long-lasting durability on all hard, clay, and grass courts.",
    "price": 999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-094",
    "title": "Yonex Nanoflare 800 Pro Speed Badminton Racket",
    "description": "Sonic Flare System and Razor Frame design enable lightning-fast drives and steep counter-attacks.",
    "price": 17499,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-095",
    "title": "Victor Thruster K Enhanced Power Badminton Racket",
    "description": "Power Box frame cross-section with Hard Cored Technology for extreme smash power and torsional stability.",
    "price": 13999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-096",
    "title": "Yonex Mavis 350 Precision Nylon Shuttles (Tube of 6)",
    "description": "Wing Rib structure utilizes airflow through shuttlecock to restore shape quickly on impact.",
    "price": 899,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-097",
    "title": "Rawlings Heart of the Hide Baseball Glove (11.5 Inch)",
    "description": "Crafted from top 5% steer hides with deer-tanned cowhide palm lining and pro-grade leather laces.",
    "price": 19999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-098",
    "title": "Wilson A2000 Infield Baseball Mitt",
    "description": "Pro Stock leather rugged durability with Comfort Pro Fit lining and dual welting for pocket stability.",
    "price": 21999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-099",
    "title": "Kipsta Football Agility Training Cones (Set of 10)",
    "description": "Flexible marker cones for sprint drills, dribbling exercises, and speed coordination.",
    "price": 599,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-100",
    "title": "Speedo Ergonomic Eva Foam Pull Buoy",
    "description": "Elevates hips and legs to develop upper body strength, stroke technique, and core alignment in pool.",
    "price": 1199,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-101",
    "title": "Domyos Non-Slip Push-Up Bars Grips",
    "description": "Ergonomic angled handles prevent wrist strain and increase range of motion for deeper chest dips.",
    "price": 899,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop"
    ]
  },
  {
    "_id": "sport-102",
    "title": "Cap Barbell 7-Foot Solid Olympic Barbell (20 kg)",
    "description": "Cold rolled steel barbell with medium-depth diamond knurling and rotating brass bushing sleeves.",
    "price": 8999,
    "stock": 20,
    "category": "sports",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"
    ]
  }
];

export async function seedProducts() {
  try {
    console.log("🌱 Re-seeding all 408 products into MongoDB collection...");
    await Product.deleteMany({});
    
    // Add realistic companies and ratings based on titles
    const productsToSeed = initialProducts.map(p => {
      let company = "Generic";
      if (p.title) {
        const words = p.title.split(" ");
        // Try to capture the first word, or first two if it's a known short brand (e.g., 'New Balance')
        company = words[0];
        if (words[0].toLowerCase() === "new" || words[0].toLowerCase() === "under") {
          company = words[0] + " " + words[1];
        }
      }
      
      // Seed a realistic random rating between 3.8 and 4.9
      const rating = (Math.random() * (4.9 - 3.8) + 3.8).toFixed(1);

      return {
        ...p,
        company: p.company || company,
        rating: p.rating || Number(rating)
      };
    });

    await Product.insertMany(productsToSeed);
    console.log("✅ All 408 products successfully seeded into MongoDB!");
  } catch (err) {
    console.error("❌ Error seeding products to MongoDB:", err.message);
  }
}
