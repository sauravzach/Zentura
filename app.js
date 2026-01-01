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

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
};

const setHTML = (id, value) => {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.innerHTML = value;
  }
};

const renderCards = (containerId, items, build) => {
  const container = document.getElementById(containerId);
  if (!container) {
    return [];
  }
  container.innerHTML = "";
  const nodes = items.map(build);
  nodes.forEach((node) => container.appendChild(node));
  return nodes;
};

const renderTrips = (trips, content, observe) => {
  const grid = document.getElementById("tripGrid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";
  const cardCta = content?.packages?.cardCta || "Book now";

  const cards = trips.map((trip) => {
    const card = document.createElement("article");
    card.className = "trip-card reveal";

    const inclusions = (trip.inclusions || [])
      .slice(0, 4)
      .map((item) => `<li>${escapeHTML(item)}</li>`)
      .join("");

    const exclusions = (trip.exclusions || [])
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
          <button class="btn btn-primary" data-trip="${escapeHTML(trip.title)}">${escapeHTML(cardCta)}</button>
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
  select.innerHTML = '<option value="">Select a package</option>';
  const options = trips.map(
    (trip) => `<option value="${escapeHTML(trip.title)}">${escapeHTML(trip.title)}</option>`
  );
  options.push('<option value="Custom itinerary">Custom itinerary</option>');
  select.insertAdjacentHTML("beforeend", options.join(""));
};

const applySiteContent = (content) => {
  setText("heroBadge", content.hero.badge);
  setText("heroTitle", content.hero.title);
  setText("heroDescription", content.hero.description);
  setText("heroPrimaryCta", content.hero.primaryCta);
  setText("heroSecondaryCta", content.hero.secondaryCta);

  content.stats.forEach((stat, index) => {
    setText(`statValue${index}`, stat.value);
    setText(`statLabel${index}`, stat.label);
  });

  setText("packagesTitle", content.packages.title);
  setText("packagesDescription", content.packages.description);
  setText("packagesCta", content.packages.ctaLabel);

  setText("whyTitle", content.why.title);
  setText("whyDescription", content.why.description);

  setText("stepsTitle", content.steps.title);
  setText("stepsDescription", content.steps.description);

  setText("testimonialsTitle", content.testimonials.title);
  setText("testimonialsDescription", content.testimonials.description);

  setText("supportTitle", content.support.title);
  setText("supportDescription", content.support.description);

  setText("contactFormTitle", content.contact.formTitle);
  setText("contactTitle", content.contact.title);
  setText("contactDescription", content.contact.description);
  setText("contactDirectTitle", content.contact.directTitle);
  setText("contactDirectDescription", content.contact.directDescription);
  setText("contactPhoneLabel", content.contact.phoneLabel);
  setText("contactPhone", content.contact.phone);
  setText("contactEmailLabel", content.contact.emailLabel);
  setText("contactEmail", content.contact.email);
  setText("contactOfficeLabel", content.contact.officeLabel);
  setText("contactOffice", content.contact.office);
  setText("contactNote", content.contact.note);

  setText("footerTagline", content.footer.tagline);
  setText("footerQuickLinks", content.footer.quickLinksLabel);
  setText("footerSupport", content.footer.supportLabel);
  const supportItems = (content.footer.supportItems || [])
    .map((item) => `<p class="trip-meta">${escapeHTML(item)}</p>`)
    .join("");
  setHTML("footerSupportList", supportItems);
};

const renderContentLists = (content, observe) => {
  const whyNodes = renderCards("whyList", content.why.items, (item) => {
    const card = document.createElement("div");
    card.className = "feature-card reveal";
    card.innerHTML = `
      <h3>${escapeHTML(item.title)}</h3>
      <p class="trip-meta">${escapeHTML(item.text)}</p>
    `;
    return card;
  });

  const stepNodes = renderCards("stepsList", content.steps.items, (item) => {
    const card = document.createElement("div");
    card.className = "step reveal";
    card.innerHTML = `
      <span>${escapeHTML(item.label)}</span>
      <h3>${escapeHTML(item.title)}</h3>
      <p class="trip-meta">${escapeHTML(item.text)}</p>
    `;
    return card;
  });

  const testimonialNodes = renderCards("testimonialsList", content.testimonials.items, (item) => {
    const card = document.createElement("div");
    card.className = "testimonial reveal";
    card.innerHTML = `
      <p>"${escapeHTML(item.quote)}"</p>
      <strong>- ${escapeHTML(item.name)}</strong>
    `;
    return card;
  });

  const supportNodes = renderCards("supportList", content.support.items, (item) => {
    const card = document.createElement("div");
    card.className = "feature-card reveal";
    card.innerHTML = `
      <h3>${escapeHTML(item.title)}</h3>
      <p class="trip-meta">${escapeHTML(item.text)}</p>
    `;
    return card;
  });

  observe([...whyNodes, ...stepNodes, ...testimonialNodes, ...supportNodes]);
};

const renderFeaturedSlider = (trips, content) => {
  const container = document.getElementById("featuredSlider");
  const dotsContainer = document.getElementById("sliderDots");
  if (!container || !dotsContainer) return;

  const featuredTrips = trips.filter(t => t.featured);
  const displayTrips = featuredTrips.length > 0 ? featuredTrips : [trips[0]];

  if (displayTrips.length === 0) return;

  container.innerHTML = "";
  dotsContainer.innerHTML = "";

  const defaultTag = content.hero?.featuredTagDefault || "All permits handled";
  const labelCta = content.hero?.featuredCta || "Reserve now";

  displayTrips.forEach((trip, i) => {
    const slide = document.createElement("div");
    slide.className = `hero-card fade-in ${i === 0 ? "active" : ""}`;
    slide.style.display = i === 0 ? "block" : "none";
    slide.style.position = "relative";
    slide.style.left = "0";
    slide.style.right = "0";
    slide.style.bottom = "0";

    const tag = (trip.inclusions && trip.inclusions[0]) || defaultTag;

    slide.innerHTML = `
      <span class="badge">${escapeHTML(content.hero.featuredLabel)}</span>
      <h3>${escapeHTML(trip.title)}</h3>
      <p class="trip-meta">${escapeHTML(trip.duration)} | Starting at ${ZenturaData.formatPrice(trip.price, trip.currency)}</p>
      <div class="trip-actions">
        <span class="label">${escapeHTML(tag)}</span>
        <a class="btn btn-primary" href="#contact" data-trip-pick="${escapeHTML(trip.title)}">${escapeHTML(labelCta)}</a>
      </div>
    `;
    container.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = `slider-dot ${i === 0 ? "is-active" : ""}`;
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  let currentIndex = 0;
  const slides = container.querySelectorAll(".hero-card");
  const dots = dotsContainer.querySelectorAll(".slider-dot");

  const goToSlide = (index) => {
    slides[currentIndex].style.display = "none";
    dots[currentIndex].classList.remove("is-active");

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].style.display = "block";
    dots[currentIndex].classList.add("is-active");
  };

  document.getElementById("prevFeatured")?.addEventListener("click", () => goToSlide(currentIndex - 1));
  document.getElementById("nextFeatured")?.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Auto-scroll every 5 seconds
  if (displayTrips.length > 1) {
    setInterval(() => goToSlide(currentIndex + 1), 5000);
  }

  // Handle CTA clicks within slider
  container.querySelectorAll("[data-trip-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      const select = document.getElementById("trip");
      if (select) select.value = btn.dataset.tripPick;
    });
  });
};

const setupContactForm = () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) {
    return;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const message = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      trip: data.get("trip"),
      month: data.get("month"),
      message: data.get("message"),
      status: "new",
    };

    status.textContent = "Sending...";
    const { error } = await ZenturaData.addMessage(message);
    if (error) {
      status.textContent = "Setup pending. Please contact us directly for now.";
      return;
    }

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

document.addEventListener("DOMContentLoaded", async () => {
  const observe = setupReveal();
  const [{ content }, { trips }] = await Promise.all([
    ZenturaData.fetchSiteContent(),
    ZenturaData.fetchTrips({ fallback: true }),
  ]);

  applySiteContent(content);
  renderContentLists(content, observe);
  renderTrips(trips, content, observe);
  populateTripSelect(trips);
  renderFeaturedSlider(trips, content);
  setupContactForm();
  setupNavToggle();
});
