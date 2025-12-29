const escapeHTML = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const setupReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const observeElements = (elements) => {
    elements.forEach((element, index) => {
      if (!element.classList.contains("is-visible")) {
        element.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(element);
      }
    });
  };

  observeElements(Array.from(document.querySelectorAll(".reveal")));

  return observeElements;
};

const renderTrips = (trips, observe) => {
  const grid = document.getElementById("tripGrid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";

  const cards = trips.map((trip) => {
    const card = document.createElement("article");
    card.className = "trip-card reveal";

    const inclusions = trip.inclusions
      .slice(0, 4)
      .map((item) => `<li>${escapeHTML(item)}</li>`)
      .join("");

    const exclusions = trip.exclusions
      .slice(0, 2)
      .map((item) => `<li>${escapeHTML(item)}</li>`)
      .join("");

    const imageMarkup = trip.image
      ? `<img src="${escapeHTML(trip.image)}" alt="${escapeHTML(trip.title)}" />`
      : `<div class="trip-image"></div>`;

    const featuredLabel = trip.featured
      ? `<span class="label">Featured</span>`
      : `<span class="label">Comfort pick</span>`;

    card.innerHTML = `
      ${imageMarkup}
      <div class="trip-body">
        <div class="trip-title">
          <div>
            <h3>${escapeHTML(trip.title)}</h3>
            <p class="trip-meta">${escapeHTML(trip.location)} | ${escapeHTML(trip.duration)}</p>
          </div>
          <span class="trip-price">${ZenturaData.formatPrice(trip.price, trip.currency)}</span>
        </div>
        <p class="trip-meta">${escapeHTML(trip.description)}</p>
        <div>
          <strong>Top inclusions</strong>
          <ul class="list">${inclusions}</ul>
        </div>
        <div>
          <strong>Exclusions</strong>
          <ul class="list">${exclusions}</ul>
        </div>
        <div class="trip-actions">
          ${featuredLabel}
          <button class="btn btn-primary" data-trip="${escapeHTML(trip.title)}">Book now</button>
        </div>
      </div>
    `;

    return card;
  });

  cards.forEach((card) => grid.appendChild(card));
  observe(cards);

  grid.querySelectorAll("[data-trip]").forEach((button) => {
    button.addEventListener("click", () => {
      const select = document.getElementById("trip");
      if (select) {
        select.value = button.dataset.trip;
      }
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  });
};

const populateTripSelect = (trips) => {
  const select = document.getElementById("trip");
  if (!select) {
    return;
  }
  const options = trips.map(
    (trip) => `<option value="${escapeHTML(trip.title)}">${escapeHTML(trip.title)}</option>`
  );
  options.push('<option value="Custom itinerary">Custom itinerary</option>');
  select.insertAdjacentHTML("beforeend", options.join(""));
};

const setupContactForm = () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) {
    return;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const message = {
      id: ZenturaData.generateId(),
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      trip: data.get("trip"),
      month: data.get("month"),
      message: data.get("message"),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    ZenturaData.addMessage(message);
    form.reset();
    status.textContent = "Thanks! Your request was sent. Our coordinator will contact you shortly.";
  });
};

const setupNavToggle = () => {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggle || !navLinks) {
    return;
  }
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  ZenturaData.seedStorage();
  const trips = ZenturaData.loadTrips();
  const observe = setupReveal();
  renderTrips(trips, observe);
  populateTripSelect(trips);
  setupContactForm();
  setupNavToggle();
});
