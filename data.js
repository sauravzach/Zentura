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

const DEFAULT_CONTENT = {
  hero: {
    badge: "Comfort-first travel planning",
    title: "Travel in comfort, guided by the people who know each destination best.",
    description:
      "Zentura creates stress-free trips for new and returning clients. We handpick stays, arrange permits, and keep your itinerary seamless from arrival to departure.",
    primaryCta: "Plan my trip",
    secondaryCta: "View packages",
    featuredLabel: "Featured this month",
    featuredCta: "Reserve now",
  },
  stats: [
    { value: "120+", label: "Curated departures" },
    { value: "4.8/5", label: "Traveler satisfaction" },
    { value: "24/7", label: "Trip support" },
  ],
  packages: {
    title: "Signature travel packages",
    description:
      "Choose a ready-to-go itinerary or let us customize every detail. All packages are designed for comfort, smooth transfers, and trusted local guides.",
    ctaLabel: "Request a custom quote",
    cardCta: "Book now",
  },
  why: {
    title: "Why travelers trust Zentura",
    description:
      "We handle the hard parts so you can relax. Dedicated support keeps new clients confident and repeat clients delighted.",
    items: [
      {
        title: "Permit and paperwork cleared",
        text: "Entry permits, police clearance certificates, and destination approvals coordinated in advance.",
      },
      {
        title: "Comfort-first stays",
        text: "Verified hotels, daily breakfast, and local hosts that know how to take care of you.",
      },
      {
        title: "On-trip concierge",
        text: "From airport pickup to last-day checkout, we stay in touch with you and your family.",
      },
      {
        title: "Local experience",
        text: "Trusted guides, community-driven activities, and safe adventure add-ons.",
      },
    ],
  },
  steps: {
    title: "How it works",
    description: "We keep things simple for you and transparent for your team.",
    items: [
      {
        label: "Step 01",
        title: "Share your travel goals",
        text: "Tell us where, when, and who is traveling. We will capture preferences and comfort needs.",
      },
      {
        label: "Step 02",
        title: "Receive a curated plan",
        text: "We send you a clear itinerary, inclusions, exclusions, and a transparent price breakdown.",
      },
      {
        label: "Step 03",
        title: "Travel with support",
        text: "Dedicated coordinators stay available before and during the trip for quick updates.",
      },
    ],
  },
  testimonials: {
    title: "Traveler stories",
    description:
      "Real feedback from families and professionals who chose Zentura for their stress-free travel.",
    items: [
      { quote: "Zentura handled every approval for Lakshadweep and kept us calm even during flight delays.", name: "Asha, Bengaluru" },
      { quote: "We loved the daily check-ins and local guides. It felt personal and safe.", name: "Rahul, Hyderabad" },
      { quote: "The stay recommendations were perfect for our parents. Everything was pre-arranged.", name: "Meera, Mumbai" },
    ],
  },
  support: {
    title: "Support for existing clients",
    description:
      "Already traveling with Zentura? Get quick updates and connect with your trip coordinator instantly.",
    items: [
      { title: "Trip updates", text: "Receive itinerary confirmations, transfer details, and day-wise reminders in one place." },
      { title: "Concierge hotline", text: "A dedicated contact for urgent changes, weather alerts, or last-minute upgrades." },
      { title: "Partner network", text: "Local hosts and drivers stay synced with your travel needs." },
    ],
  },
  contact: {
    formTitle: "Trip inquiry",
    title: "Plan your next trip",
    description:
      "Tell us your preferred dates and comfort needs. We will respond with a curated plan and pricing.",
    directTitle: "Reach Zentura directly",
    directDescription: "We answer quickly for new clients and returning clients who need updates.",
    phoneLabel: "Phone",
    phone: "+91 00000 00000",
    emailLabel: "Email",
    email: "hello@yourdomain.com",
    officeLabel: "Office",
    office: "Bengaluru, India",
    note: "Admin can manage inquiries, trips, and images from the admin dashboard.",
  },
  footer: {
    tagline: "Travel with comfort, guided by trust. We are ready to launch on your existing domain.",
    quickLinksLabel: "Quick links",
    supportLabel: "Client support",
    supportItems: [
      "24/7 coordinator access",
      "Custom itinerary updates",
      "Local assistance on-site",
    ],
  },
};

const config = window.ZenturaConfig || {};
const hasSupabaseConfig =
  config.supabaseUrl &&
  config.supabaseAnonKey &&
  !config.supabaseUrl.includes("YOUR_") &&
  !config.supabaseAnonKey.includes("YOUR_");

const supabaseClient =
  hasSupabaseConfig && window.supabase
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

const storageBucket = config.storageBucket || "zentura-images";

const mergeContent = (base, override) => {
  if (Array.isArray(base)) {
    if (Array.isArray(override) && override.length > 0) {
      return override;
    }
    return base;
  }
  if (typeof base === "object" && base !== null) {
    const result = { ...base };
    Object.keys(base).forEach((key) => {
      result[key] = mergeContent(base[key], override ? override[key] : undefined);
    });
    return result;
  }
  return override === undefined || override === null ? base : override;
};

const formatPrice = (value, currency = "INR") => {
  const number = Number(value) || 0;
  if (currency === "INR") {
    return `INR ${number.toLocaleString("en-IN")}`;
  }
  return `${currency} ${number.toLocaleString("en-US")}`;
};

const normalizeTrip = (trip) => ({
  ...trip,
  image: trip.image_url || trip.image,
});

const fetchSiteContent = async () => {
  if (!supabaseClient) {
    return { content: DEFAULT_CONTENT, error: null };
  }
  const { data, error } = await supabaseClient
    .from("site_content")
    .select("content")
    .eq("id", "primary")
    .maybeSingle();

  if (error) {
    return { content: DEFAULT_CONTENT, error };
  }

  const merged = mergeContent(DEFAULT_CONTENT, data?.content || {});
  return { content: merged, error: null };
};

const saveSiteContent = async (content) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient.from("site_content").upsert({
    id: "primary",
    content,
    updated_at: new Date().toISOString(),
  });
  return { error };
};

const fetchTrips = async (options = {}) => {
  const { fallback = false } = options;
  if (!supabaseClient) {
    return { trips: fallback ? DEFAULT_TRIPS : [], error: null };
  }
  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { trips: fallback ? DEFAULT_TRIPS : [], error };
  }

  if (data.length === 0 && fallback) {
    return { trips: DEFAULT_TRIPS, error: null };
  }

  return { trips: data.map(normalizeTrip), error: null };
};

const createTrip = async (trip) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient.from("trips").insert({
    title: trip.title,
    location: trip.location,
    duration: trip.duration,
    price: trip.price,
    currency: trip.currency || "INR",
    description: trip.description,
    highlights: trip.highlights,
    inclusions: trip.inclusions,
    exclusions: trip.exclusions,
    image_url: trip.image,
    featured: trip.featured,
  });
  return { error };
};

const updateTrip = async (trip) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient
    .from("trips")
    .update({
      title: trip.title,
      location: trip.location,
      duration: trip.duration,
      price: trip.price,
      currency: trip.currency || "INR",
      description: trip.description,
      highlights: trip.highlights,
      inclusions: trip.inclusions,
      exclusions: trip.exclusions,
      image_url: trip.image,
      featured: trip.featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", trip.id);
  return { error };
};

const deleteTrip = async (id) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient.from("trips").delete().eq("id", id);
  return { error };
};

const seedTripsIfEmpty = async () => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabaseClient.from("trips").select("id").limit(1);
  if (error) {
    return { error };
  }
  if (data && data.length > 0) {
    return { error: null };
  }
  const payload = DEFAULT_TRIPS.map((trip) => ({
    title: trip.title,
    location: trip.location,
    duration: trip.duration,
    price: trip.price,
    currency: trip.currency,
    description: trip.description,
    highlights: trip.highlights,
    inclusions: trip.inclusions,
    exclusions: trip.exclusions,
    image_url: trip.image,
    featured: trip.featured,
  }));
  const insertResult = await supabaseClient.from("trips").insert(payload);
  return { error: insertResult.error || null };
};

const fetchMessages = async () => {
  if (!supabaseClient) {
    return { messages: [], error: null };
  }
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { messages: [], error };
  }

  return { messages: data, error: null };
};

const addMessage = async (message) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient.from("messages").insert(message);
  return { error };
};

const updateMessageStatus = async (id, status) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { error } = await supabaseClient
    .from("messages")
    .update({ status })
    .eq("id", id);
  return { error };
};

const uploadImage = async (file, prefix = "trips") => {
  if (!supabaseClient) {
    return { url: "", error: new Error("Supabase not configured") };
  }
  if (!file) {
    return { url: "", error: new Error("No file provided") };
  }
  const extension = file.name.split(".").pop();
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `${prefix}/${safeName}.${extension}`;

  const { error } = await supabaseClient.storage
    .from(storageBucket)
    .upload(path, file, { upsert: true });

  if (error) {
    return { url: "", error };
  }

  const { data } = supabaseClient.storage.from(storageBucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};

const signIn = async (email, password) => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

const checkAdminAccess = async (userId) => {
  if (!supabaseClient) {
    return { isAdmin: false, error: new Error("Supabase not configured") };
  }
  // Check if the user exists in the admin_users table
  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { isAdmin: false, error };
  }
  
  // If data exists, they are an admin
  return { isAdmin: !!data, error: null };
};

const signOut = async () => {
  if (!supabaseClient) {
    return { error: new Error("Supabase not configured") };
  }
  return supabaseClient.auth.signOut();
};

const clearAuthSession = () => {
  const keysToRemove = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.includes("-auth-token")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

const getSession = async () => {
  if (!supabaseClient) {
    return { session: null };
  }
  const { data } = await supabaseClient.auth.getSession();
  return data;
};

const onAuthChange = (callback) => {
  if (!supabaseClient) {
    return () => {};
  }
  const { data } = supabaseClient.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
};

window.ZenturaData = {
  supabase: supabaseClient,
  isReady: Boolean(supabaseClient),
  DEFAULT_TRIPS,
  DEFAULT_CONTENT,
  formatPrice,
  fetchSiteContent,
  saveSiteContent,
  fetchTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  seedTripsIfEmpty,
  fetchMessages,
  addMessage,
  updateMessageStatus,
  uploadImage,
  signIn,
  signOut,
  clearAuthSession,
  getSession,
  onAuthChange,
  checkAdminAccess,
};
