export const SPORTS = [
  {
    id: "badminton",
    name: "Badminton",
    description:
      "Where passion meets play. Book your court and experience premium indoor badminton facilities with professional coaching.",
    image: "/badminton-smash.png",
    price: 500,
    pricePerSlot: 500,
  },
  {
    id: "cricket",
    name: "Cricket",
    description:
      "Unleash your cricket dreams on our world-class pitches. Professional nets and coaching available for all skill levels.",
    image: "/cricket-batsman-shot.png",
    price: 800,
    pricePerSlot: 800,
  },
  {
    id: "tennis",
    name: "Tennis",
    description:
      "Serve your way to excellence. Premium tennis courts with professional-grade surfaces for competitive play.",
    image: "/tennis-player-serving.jpg",
    price: 600,
    pricePerSlot: 600,
  },
]

export const VENUES = [
  {
    id: "venue-1",
    name: "Visakhapatnam Sports Complex",
    location: "17.6887° N, 83.1774° E",
    address: "MVP Colony, Visakhapatnam, Andhra Pradesh",
    image: "/modern-sports-complex.jpg",
    grounds: ["Court A", "Court B", "Court C", "Court D", "Court E", "Court F"],
  },
  {
    id: "venue-2",
    name: "Rushikonda Indoor Arena",
    location: "17.7833° N, 83.3833° E",
    address: "Rushikonda, Visakhapatnam, Andhra Pradesh",
    image: "/indoor-sports-arena.jpg",
    grounds: ["Arena 1", "Arena 2", "Arena 3", "Arena 4", "Arena 5", "Arena 6"],
  },
  {
    id: "venue-3",
    name: "Beach Road Sports Hub",
    location: "17.7231° N, 83.3260° E",
    address: "Beach Road, Visakhapatnam, Andhra Pradesh",
    image: "/coastal-sports-facility.jpg",
    grounds: ["Hub 1", "Hub 2", "Hub 3", "Hub 4", "Hub 5", "Hub 6"],
  },
]

export const TIME_SLOTS = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
]

export const HEALTH_BENEFITS = [
  {
    title: "Improved Fitness",
    description:
      "Enhance cardiovascular health, build stamina, and improve overall body coordination through regular play.",
    icon: "💪",
  },
  {
    title: "Better Focus",
    description:
      "Sharpen mental clarity and concentration while tracking fast-moving shuttlecocks and strategic gameplay.",
    icon: "🎯",
  },
  {
    title: "Cultivates Discipline",
    description: "Develop self-control, commitment, and a winning mindset through structured training and practice.",
    icon: "⭐",
  },
  {
    title: "Strength Training",
    description: "Build muscular endurance, core strength, and explosive power with every serve and smash.",
    icon: "🏋️",
  },
  {
    title: "Cool Down",
    description: "Learn proper recovery techniques to prevent injuries and maintain peak performance levels.",
    icon: "🧘",
  },
]

export const AMENITIES = [
  {
    title: "Plenty of Parking",
    description: "Spacious parking facilities for cars and bikes with 24/7 security.",
    image: "/busy-city-parking-lot.png",
  },
  {
    title: "Pollution-free Environment",
    description: "Clean, well-maintained facilities with excellent air circulation systems.",
    image: "/clean-environment.jpg",
  },
  {
    title: "Professional Trainers",
    description: "Expert coaches with years of experience to elevate your game.",
    image: "/sports-coach.png",
  },
  {
    title: "Soft Drinks",
    description: "Refreshment kiosk with energy drinks and healthy snacks.",
    image: "/refreshment-counter.jpg",
  },
  {
    title: "Waiting Area",
    description: "Comfortable lounge with WiFi and entertainment for spectators.",
    image: "/waiting-lounge.jpg",
  },
  {
    title: "Sports Library",
    description: "Resource center with training materials and sports psychology books.",
    image: "/grand-library.png",
  },
]

export const COUPONS = [
  { code: "FIRST50", discount: 50, description: "First booking discount", expiryDate: "2025-12-31" },
  { code: "WEEKEND20", discount: 20, description: "Weekend special", expiryDate: "2025-12-31" },
  { code: "SPORTS100", discount: 100, description: "Sports enthusiast bonus", expiryDate: "2025-12-31" },
]

export const PAYMENT_METHODS = [
  { id: "upi", name: "UPI", icon: "💳" },
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "netbanking", name: "Net Banking", icon: "🏦" },
  { id: "wallet", name: "Digital Wallet", icon: "📱" },
]
