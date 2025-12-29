const STORAGE_KEYS = {
  trips: "zentura_trips",
  messages: "zentura_messages",
  admin: "zentura_admin",
};

const DEFAULT_ADMIN = {
  username: "admin",
  password: "zentura123",
};

const DEFAULT_TRIPS = [
  {
    id: "lakshadweep-4d3n",
    title: "Lakshadweep Trip",
    location: "Lakshadweep Islands",
    duration: "4 Days / 3 Nights",
    price: 16000,
    currency: "INR",
    description:
      "Lagoon stays with island hopping, calm waters, and guided experiences tailored for comfort.",
    highlights: ["Island hopping", "Lagoon cruise", "Family-friendly comfort"],
    inclusions: [
      "Entry permit",
      "Police clearance certificate",
      "Accommodation and food",
      "Airport transfers",
      "Sightseeing",
      "Snorkeling",
      "Kayaking",
      "Glass boat ride",
      "Tour guide",
    ],
    exclusions: ["Flight ticket", "Scuba diving"],
    image: "assets/trip-lakshadweep.svg",
    featured: true,
  },
  {
    id: "coorg-escape-3d2n",
    title: "Coorg Coffee Escape",
    location: "Coorg, Karnataka",
    duration: "3 Days / 2 Nights",
    price: 9800,
    currency: "INR",
    description:
      "A calm hillside getaway with boutique stays, coffee trails, and plantation walks.",
    highlights: ["Plantation stay", "Waterfall visit", "Local cuisine"],
    inclusions: ["Stay with breakfast", "Local transfers", "Guided plantation tour"],
    exclusions: ["Personal expenses", "Adventure sports"],
    image: "assets/trip-coorg.svg",
    featured: false,
  },
  {
    id: "rajasthan-heritage-5d4n",
    title: "Rajasthan Heritage Trail",
    location: "Jaipur, Jodhpur, Udaipur",
    duration: "5 Days / 4 Nights",
    price: 24800,
    currency: "INR",
    description:
      "Fort tours, heritage hotels, and cultural evenings with a dedicated coordinator.",
    highlights: ["Fort visits", "Heritage stays", "Cultural evenings"],
    inclusions: ["Hotel stay", "Daily breakfast", "Private transfers", "Guided sightseeing"],
    exclusions: ["Flight or train tickets", "Meals not mentioned"],
    image: "assets/trip-rajasthan.svg",
    featured: false,
  },
];

const getStored = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

const setStored = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const seedStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.trips)) {
    setStored(STORAGE_KEYS.trips, DEFAULT_TRIPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.messages)) {
    setStored(STORAGE_KEYS.messages, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.admin)) {
    setStored(STORAGE_KEYS.admin, DEFAULT_ADMIN);
  }
};

const loadTrips = () => getStored(STORAGE_KEYS.trips, DEFAULT_TRIPS);

const saveTrips = (trips) => {
  setStored(STORAGE_KEYS.trips, trips);
};

const loadMessages = () => getStored(STORAGE_KEYS.messages, []);

const saveMessages = (messages) => {
  setStored(STORAGE_KEYS.messages, messages);
};

const addMessage = (message) => {
  const messages = loadMessages();
  messages.unshift(message);
  saveMessages(messages);
};

const getAdminCredentials = () => getStored(STORAGE_KEYS.admin, DEFAULT_ADMIN);

const setAdminCredentials = (credentials) => {
  setStored(STORAGE_KEYS.admin, credentials);
};

const generateId = () => {
  return `id_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
};

const formatPrice = (value, currency = "INR") => {
  const number = Number(value) || 0;
  if (currency === "INR") {
    return `INR ${number.toLocaleString("en-IN")}`;
  }
  return `${currency} ${number.toLocaleString("en-US")}`;
};

window.ZenturaData = {
  STORAGE_KEYS,
  DEFAULT_TRIPS,
  seedStorage,
  loadTrips,
  saveTrips,
  loadMessages,
  saveMessages,
  addMessage,
  getAdminCredentials,
  setAdminCredentials,
  generateId,
  formatPrice,
};
