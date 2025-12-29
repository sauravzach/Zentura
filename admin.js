const SESSION_KEY = "zentura_admin_session";

const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const setSession = (username) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username, createdAt: new Date().toISOString() })
  );
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const showView = (isLoggedIn, username = "") => {
  const loginView = document.getElementById("loginView");
  const adminView = document.getElementById("adminView");
  const adminName = document.getElementById("adminName");

  if (!loginView || !adminView || !adminName) {
    return;
  }

  loginView.hidden = isLoggedIn;
  adminView.hidden = !isLoggedIn;
  adminName.textContent = username;
};

const parseList = (value) => {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const resetTripForm = () => {
  const form = document.getElementById("tripForm");
  if (!form) {
    return;
  }
  form.reset();
  document.getElementById("tripId").value = "";
};

const fillTripForm = (trip) => {
  document.getElementById("tripId").value = trip.id;
  document.getElementById("tripTitle").value = trip.title;
  document.getElementById("tripLocation").value = trip.location;
  document.getElementById("tripDuration").value = trip.duration;
  document.getElementById("tripPrice").value = trip.price;
  document.getElementById("tripImage").value = trip.image || "";
  document.getElementById("tripDescription").value = trip.description;
  document.getElementById("tripHighlights").value = (trip.highlights || []).join(", ");
  document.getElementById("tripInclusions").value = (trip.inclusions || []).join(", ");
  document.getElementById("tripExclusions").value = (trip.exclusions || []).join(", ");
  document.getElementById("tripFeatured").checked = Boolean(trip.featured);
};

const renderTripsTable = () => {
  const tbody = document.querySelector("#tripsTable tbody");
  if (!tbody) {
    return;
  }
  const trips = ZenturaData.loadTrips();
  tbody.innerHTML = "";

  trips.forEach((trip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${trip.title}</strong>
        <div class="trip-meta">${trip.location}</div>
      </td>
      <td>${ZenturaData.formatPrice(trip.price, trip.currency)}</td>
      <td>${trip.featured ? "Yes" : "No"}</td>
      <td>
        <button class="btn btn-ghost" data-action="edit" data-id="${trip.id}">Edit</button>
        <button class="btn btn-ghost" data-action="delete" data-id="${trip.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

const sanitizePhone = (value) => {
  if (!value) {
    return "";
  }
  return value.replace(/\D/g, "");
};

const renderMessagesTable = () => {
  const tbody = document.querySelector("#messagesTable tbody");
  if (!tbody) {
    return;
  }

  const messages = ZenturaData.loadMessages();
  tbody.innerHTML = "";

  if (messages.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No inquiries yet.</td>`;
    tbody.appendChild(row);
    return;
  }

  messages.forEach((message) => {
    const row = document.createElement("tr");
    const phone = sanitizePhone(message.phone || "");
    const mailLink = message.email
      ? `<a href="mailto:${message.email}">Email</a>`
      : "";
    const whatsappLink = phone
      ? `<a href="https://wa.me/${phone}" target="_blank" rel="noreferrer">WhatsApp</a>`
      : "";
    const contactLinks = [mailLink, whatsappLink].filter(Boolean).join(" | ");

    row.innerHTML = `
      <td>
        <strong>${message.name || "Unknown"}</strong>
        <div class="trip-meta">${message.month || ""}</div>
      </td>
      <td>${message.trip || "Custom"}</td>
      <td>${contactLinks || "-"}</td>
      <td>
        <span class="status-dot ${message.status === "resolved" ? "is-active" : ""}"></span>
        <button class="btn btn-ghost" data-action="toggle" data-id="${message.id}">
          ${message.status === "resolved" ? "Contacted" : "New"}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
};

const setupTripForm = () => {
  const form = document.getElementById("tripForm");
  const status = document.getElementById("tripStatus");
  const cancel = document.getElementById("cancelEdit");
  if (!form || !status || !cancel) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const trips = ZenturaData.loadTrips();
    const id = document.getElementById("tripId").value || ZenturaData.generateId();

    const trip = {
      id,
      title: document.getElementById("tripTitle").value.trim(),
      location: document.getElementById("tripLocation").value.trim(),
      duration: document.getElementById("tripDuration").value.trim(),
      price: Number(document.getElementById("tripPrice").value || 0),
      currency: "INR",
      image: document.getElementById("tripImage").value.trim(),
      description: document.getElementById("tripDescription").value.trim(),
      highlights: parseList(document.getElementById("tripHighlights").value),
      inclusions: parseList(document.getElementById("tripInclusions").value),
      exclusions: parseList(document.getElementById("tripExclusions").value),
      featured: document.getElementById("tripFeatured").checked,
    };

    const existingIndex = trips.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
      status.textContent = "Trip updated.";
    } else {
      trips.unshift(trip);
      status.textContent = "Trip added.";
    }

    ZenturaData.saveTrips(trips);
    renderTripsTable();
    resetTripForm();
  });

  cancel.addEventListener("click", () => {
    resetTripForm();
    status.textContent = "Edit canceled.";
  });
};

const setupTables = () => {
  const tripsTable = document.getElementById("tripsTable");
  const messagesTable = document.getElementById("messagesTable");

  if (tripsTable) {
    tripsTable.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }
      const action = button.dataset.action;
      const id = button.dataset.id;
      const trips = ZenturaData.loadTrips();
      const trip = trips.find((item) => item.id === id);

      if (action === "edit" && trip) {
        fillTripForm(trip);
      }
      if (action === "delete" && trip) {
        const confirmed = window.confirm(`Delete ${trip.title}?`);
        if (confirmed) {
          ZenturaData.saveTrips(trips.filter((item) => item.id !== id));
          renderTripsTable();
        }
      }
    });
  }

  if (messagesTable) {
    messagesTable.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.dataset.action !== "toggle") {
        return;
      }
      const id = button.dataset.id;
      const messages = ZenturaData.loadMessages();
      const message = messages.find((item) => item.id === id);
      if (message) {
        message.status = message.status === "resolved" ? "new" : "resolved";
        ZenturaData.saveMessages(messages);
        renderMessagesTable();
      }
    });
  }
};

const setupAdminSettings = () => {
  const form = document.getElementById("adminSettings");
  const status = document.getElementById("settingsStatus");
  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const current = ZenturaData.getAdminCredentials();
    const newUser = document.getElementById("newUser").value.trim();
    const newPass = document.getElementById("newPass").value.trim();

    const updated = {
      username: newUser || current.username,
      password: newPass || current.password,
    };

    ZenturaData.setAdminCredentials(updated);
    status.textContent = "Credentials updated.";
    form.reset();
  });
};

const setupLogin = () => {
  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");
  const logout = document.getElementById("logoutBtn");

  if (!form || !status || !logout) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value.trim();
    const credentials = ZenturaData.getAdminCredentials();

    if (username === credentials.username && password === credentials.password) {
      setSession(username);
      showView(true, username);
      renderTripsTable();
      renderMessagesTable();
      status.textContent = "";
      form.reset();
    } else {
      status.textContent = "Invalid login. Try again.";
    }
  });

  logout.addEventListener("click", () => {
    clearSession();
    showView(false);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  ZenturaData.seedStorage();
  setupLogin();
  setupTripForm();
  setupTables();
  setupAdminSettings();

  const session = getSession();
  if (session) {
    showView(true, session.username);
    renderTripsTable();
    renderMessagesTable();
  } else {
    showView(false);
  }
});
