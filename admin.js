/**
 * ZENTURA ADMIN MASTER CONTROLLER
 */

const adminConfig = window.ZenturaConfig || {};
const loginDomain = adminConfig.loginDomain || "yourdomain.com";

/**
 * 1. UI MANAGER
 * Handles smooth transitions between views
 */
const updateAdminUI = (isLoggedIn, username = "") => {
  const loginView = document.getElementById("loginView");
  const adminView = document.getElementById("adminView");
  const adminName = document.getElementById("adminName");

  if (isLoggedIn) {
    loginView.setAttribute("hidden", "true");
    loginView.style.display = "none";
    adminView.removeAttribute("hidden");
    adminView.style.display = "grid";
    adminName.textContent = username;
  } else {
    loginView.removeAttribute("hidden");
    loginView.style.display = "block";
    adminView.setAttribute("hidden", "true");
    adminView.style.display = "none";
    adminName.textContent = "-";
  }
};

/**
 * 2. AUTHENTICATION OBSERVER
 * The single source of truth for auth state
 */
const initAuthObserver = () => {
  ZenturaData.onAuthChange(async (event, session) => {
    console.log(`[Auth Event]: ${event}`);

    // Handle initial session quickly to update UI
    if (event === "INITIAL_SESSION" && session?.user) {
      const userLabel = session.user.email.split("@")[0];
      updateAdminUI(true, userLabel);
      refreshDashboard(); // Load data immediately if already logged in
      return; // Exit early for initial session, full check will happen on subsequent events
    }

    if (session?.user) {
      try {
        // Safety timeout for admin check
        const checkPromise = ZenturaData.checkAdminAccess(session.user.id);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Admin check timed out. Check your connection.")), 6000)
        );

        const { isAdmin, error } = await Promise.race([checkPromise, timeoutPromise]);

        if (error) throw error;
        if (!isAdmin) throw new Error("Unauthorized: User not in admin_users table.");

        console.log("Admin authorized:", session.user.email);
        const userLabel = session.user.email.split("@")[0];
        updateAdminUI(true, userLabel);

        refreshDashboard();

      } catch (err) {
        console.error("Auth Error:", err);
        const status = document.getElementById("loginStatus");
        if (status) status.textContent = `Error: ${err.message}`;
        executeSignOut();
      }
    } else {
      updateAdminUI(false);
    }
  });
};

/**
 * 3. FAIL-SAFE LOGOUT logic
 */
const executeSignOut = async () => {
  const btn = document.getElementById("logoutBtn");
  if (btn) {
    btn.textContent = "Signing out...";
    btn.disabled = true;
  }

  try {
    // 1. Clear server-side session
    await ZenturaData.signOut();
  } catch (err) {
    console.warn("SignOut request failed, forcing local cleanup.");
  } finally {
    // 2. Clear all local traces (The "Force" part done professionally)
    ZenturaData.clearAuthSession();
    localStorage.clear();

    // 3. UI Update and Hard Refresh to clear memory
    updateAdminUI(false);
    window.location.replace("admin.html");
  }
};

/**
 * 4. EVENT INITIALIZERS
 */
const setupAuthEvents = () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const togglePass = document.getElementById("togglePassword");
  const passInput = document.getElementById("adminPass");

  // Login handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const loginStatus = document.getElementById("loginStatus");
    const user = document.getElementById("adminUser").value.trim();
    const pass = passInput.value.trim();
    const email = user.includes("@") ? user : `${user}@${loginDomain}`;

    loginStatus.textContent = "Authenticating...";
    const { error } = await ZenturaData.signIn(email, pass);
    if (error) loginStatus.textContent = error.message;
  });

  // Logout handler
  logoutBtn.addEventListener("click", executeSignOut);

  // Pass toggle
  togglePass.addEventListener("click", () => {
    const isPass = passInput.type === "password";
    passInput.type = isPass ? "text" : "password";
    togglePass.textContent = isPass ? "Hide" : "Show";
  });
};

const setupTabs = () => {
  const tabs = document.querySelectorAll(".admin-nav-item");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      panes.forEach(p => {
        p.setAttribute("hidden", "true");
        if (p.id === `tab-${target}`) p.removeAttribute("hidden");
      });
    });
  });
};

/**
 * 5. DASHBOARD DATA REFRESH
 */
let currentSiteContent = {};

const refreshDashboard = async () => {
  try {
    const { content } = await ZenturaData.fetchSiteContent();
    if (content) {
      currentSiteContent = content; // Store for updates

      // 1. Hero
      document.getElementById("heroBadgeInput").value = content.hero?.badge || "";
      document.getElementById("heroTitleInput").value = content.hero?.title || "";
      document.getElementById("heroDescriptionInput").value = content.hero?.description || "";

      // 2. Stats
      (content.stats || []).forEach((s, i) => {
        if (i < 3) {
          document.getElementById(`stat${i}_val`).value = s.value || "";
          document.getElementById(`stat${i}_label`).value = s.label || "";
        }
      });

      // 3. Why Zentura
      document.getElementById("whyTitleInput").value = content.why?.title || "";
      document.getElementById("whyDescriptionInput").value = content.why?.description || "";
      (content.why?.items || []).forEach((item, i) => {
        if (i < 4) {
          document.getElementById(`why${i}_title`).value = item.title || "";
          document.getElementById(`why${i}_text`).value = item.text || "";
        }
      });

      // 4. Testimonials
      (content.testimonials?.items || []).forEach((item, i) => {
        if (i < 3) {
          document.getElementById(`test${i}_quote`).value = item.quote || "";
          document.getElementById(`test${i}_name`).value = item.name || "";
        }
      });

      // 5. Steps (Process)
      (content.steps?.items || []).forEach((item, i) => {
        if (i < 3) {
          document.getElementById(`step${i}_title`).value = item.title || "";
          document.getElementById(`step${i}_text`).value = item.text || "";
        }
      });

      // 6. Support
      (content.support?.items || []).forEach((item, i) => {
        if (i < 3) {
          document.getElementById(`supp${i}_title`).value = item.title || "";
          document.getElementById(`supp${i}_text`).value = item.text || "";
        }
      });

      // 7. Contact
      document.getElementById("contactPhoneInput").value = content.contact?.phone || "";
      document.getElementById("contactEmailInput").value = content.contact?.email || "";
      document.getElementById("contactOfficeInput").value = content.contact?.office || "";
    }
    await renderTrips();
    await renderMessages();
  } catch (err) {
    console.error("Data load failed:", err);
  }
};

const setupDashboardEvents = () => {
  const siteForm = document.getElementById("siteForm");

  if (siteForm) {
    siteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusMsg = document.getElementById("siteStatus");
      statusMsg.textContent = "Saving changes...";
      statusMsg.style.color = "blue";
      console.log("Saving site content...", currentSiteContent);

      // Create a fresh clone/update of the content object based on ALL inputs
      const updated = JSON.parse(JSON.stringify(currentSiteContent));

      // Hero
      if (!updated.hero) updated.hero = {};
      updated.hero.badge = document.getElementById("heroBadgeInput").value;
      updated.hero.title = document.getElementById("heroTitleInput").value;
      updated.hero.description = document.getElementById("heroDescriptionInput").value;

      // Stats
      updated.stats = [0, 1, 2].map(i => ({
        value: document.getElementById(`stat${i}_val`).value,
        label: document.getElementById(`stat${i}_label`).value
      }));

      // Why Us
      if (!updated.why) updated.why = { title: "", description: "", items: [] };
      updated.why.title = document.getElementById("whyTitleInput").value;
      updated.why.description = document.getElementById("whyDescriptionInput").value;
      updated.why.items = [0, 1, 2, 3].map(i => ({
        title: document.getElementById(`why${i}_title`).value,
        text: document.getElementById(`why${i}_text`).value
      }));

      // Testimonials
      if (!updated.testimonials) updated.testimonials = { title: "", description: "", items: [] };
      updated.testimonials.items = [0, 1, 2].map(i => ({
        quote: document.getElementById(`test${i}_quote`).value,
        name: document.getElementById(`test${i}_name`).value
      }));

      // Steps
      if (!updated.steps) updated.steps = { title: "", description: "", items: [] };
      updated.steps.items = [0, 1, 2].map(i => ({
        label: `Step 0${i + 1}`,
        title: document.getElementById(`step${i}_title`).value,
        text: document.getElementById(`step${i}_text`).value
      }));

      // Support
      if (!updated.support) updated.support = { title: "", description: "", items: [] };
      updated.support.items = [0, 1, 2].map(i => ({
        title: document.getElementById(`supp${i}_title`).value,
        text: document.getElementById(`supp${i}_text`).value
      }));

      // Contact
      if (!updated.contact) updated.contact = {};
      updated.contact.phone = document.getElementById("contactPhoneInput").value;
      updated.contact.email = document.getElementById("contactEmailInput").value;
      updated.contact.office = document.getElementById("contactOfficeInput").value;

      try {
        const { error } = await ZenturaData.saveSiteContent(updated);
        if (error) throw error;

        console.log("Save successful!");
        currentSiteContent = updated; // Update local cache
        statusMsg.textContent = "Changes saved successfully!";
        statusMsg.style.color = "green";

        setTimeout(() => { statusMsg.textContent = ""; }, 3000);
      } catch (err) {
        console.error("Save failed:", err);
        statusMsg.textContent = `Save Failed: ${err.message}`;
        statusMsg.style.color = "red";
      }
    });
  }
};

let currentTrips = [];

const renderTrips = async () => {
  const tbody = document.querySelector("#tripsTable tbody");
  const { trips } = await ZenturaData.fetchTrips({ fallback: false });
  currentTrips = trips; // Cache for editing

  tbody.innerHTML = trips.map(t => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding:12px;"><strong>${t.title}</strong></td>
      <td>₹${t.price}</td>
      <td><span class="status-dot ${t.featured ? 'is-active' : ''}"></span>${t.featured ? 'Featured' : 'Standard'}</td>
      <td>
        <button class="btn btn-ghost" onclick="window.openTripEditor('${t.id}')">Edit</button>
        <button class="btn btn-ghost" onclick="window.deleteTrip('${t.id}')" style="color: #dc2626;">Delete</button>
      </td>
    </tr>
  `).join('');
};

const setupTripEvents = () => {
  const tripForm = document.getElementById("tripForm");
  if (!tripForm) return;

  tripForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = tripForm.querySelector("button[type='submit']");
    const originalText = btn.textContent;
    btn.textContent = "Saving...";
    btn.disabled = true;

    try {
      const id = document.getElementById("tripId").value;
      const imageFile = document.getElementById("tripImageFn").files[0];
      let imageUrl = document.getElementById("tripImageUrl").value;

      // Upload image if new file selected
      if (imageFile) {
        const { url, error } = await ZenturaData.uploadImage(imageFile);
        if (error) throw error;
        imageUrl = url;
      }

      const tripData = {
        id, // Included for updates
        title: document.getElementById("tripTitle").value,
        location: document.getElementById("tripLocation").value,
        duration: document.getElementById("tripDuration").value,
        price: Number(document.getElementById("tripPrice").value),
        description: document.getElementById("tripDesc").value,
        image: imageUrl,
        featured: document.getElementById("tripFeatured").checked,
        highlights: [], // Simplified for now
        inclusions: document.getElementById("tripInclusions").value.split("\n").map(s => s.trim()).filter(Boolean),
        exclusions: document.getElementById("tripExclusions").value.split("\n").map(s => s.trim()).filter(Boolean)
      };

      let result;
      if (id) {
        result = await ZenturaData.updateTrip(tripData);
      } else {
        delete tripData.id;
        result = await ZenturaData.createTrip(tripData);
      }

      if (result.error) throw result.error;

      // Success
      window.closeTripEditor();
      refreshDashboard();
      alert("Trip saved successfully!");

    } catch (err) {
      console.error("Trip save error:", err);
      alert("Failed to save trip: " + err.message);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
};

window.openTripEditor = (tripId = null) => {
  const editor = document.getElementById("tripEditor");
  const title = document.getElementById("tripEditorTitle");
  const form = document.getElementById("tripForm");

  form.reset();
  editor.removeAttribute("hidden");

  if (tripId) {
    const trip = currentTrips.find(t => t.id === tripId);
    if (!trip) return;

    title.textContent = "Edit Trip";
    document.getElementById("tripId").value = trip.id;
    document.getElementById("tripTitle").value = trip.title;
    document.getElementById("tripLocation").value = trip.location;
    document.getElementById("tripDuration").value = trip.duration;
    document.getElementById("tripPrice").value = trip.price;
    document.getElementById("tripDesc").value = trip.description;
    document.getElementById("tripInclusions").value = (trip.inclusions || []).join("\n");
    document.getElementById("tripExclusions").value = (trip.exclusions || []).join("\n");
    document.getElementById("tripImageUrl").value = trip.image || "";
    document.getElementById("tripFeatured").checked = trip.featured;

    const preview = document.getElementById("imagePreview");
    preview.textContent = trip.image ? "Current image set. Upload new to replace." : "No image set.";
  } else {
    title.textContent = "Add New Trip";
    document.getElementById("tripId").value = "";
    document.getElementById("tripImageUrl").value = "";
    document.getElementById("tripInclusions").value = "";
    document.getElementById("tripExclusions").value = "";
    document.getElementById("imagePreview").textContent = "";
  }
};

window.closeTripEditor = () => {
  document.getElementById("tripEditor").setAttribute("hidden", "true");
};

const renderMessages = async () => {
  const tbody = document.querySelector("#messagesTable tbody");
  const { messages } = await ZenturaData.fetchMessages();
  if (messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="padding:20px; text-align:center;">No inquiries found.</td></tr>';
    return;
  }
  tbody.innerHTML = messages.map(m => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding:12px;">${m.name}</td>
      <td>${m.trip || 'Custom'}</td>
      <td>${m.email || m.phone}</td>
      <td><button class="btn btn-ghost" onclick="window.toggleMsg('${m.id}', '${m.status}')">${m.status === 'resolved' ? '✅' : 'Mark Seen'}</button></td>
    </tr>
  `).join('');
};

window.deleteTrip = async (id) => {
  if (confirm("Delete this trip?")) {
    await ZenturaData.deleteTrip(id);
    refreshDashboard();
  }
};

window.toggleMsg = async (id, status) => {
  const next = status === 'resolved' ? 'new' : 'resolved';
  await ZenturaData.updateMessageStatus(id, next);
  renderMessages();
};

/**
 * START
 */
document.addEventListener("DOMContentLoaded", () => {
  initAuthObserver();
  setupAuthEvents();
  setupTabs();
  setupDashboardEvents();
  setupTripEvents();
});