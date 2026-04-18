const whatsappNumber = "919330948227";
const shortlistStorageKey = "manjimas-shortlist";

// Product catalog:
// Add more products here by copying one object and changing the values.
// The `id` must stay unique because product.html uses it from the URL.
const products = [
    {
        id: "silk-radiance",
        name: "Silk Radiance Saree",
        category: "Signature Silk",
        price: "Rs. 1,499",
        numericPrice: 1499,
        description: "A graceful silk saree with a rich festive feel, ideal for weddings, family functions, and elegant celebrations.",
        cover: "images/saree1/1.jpeg",
        fabric: "Soft silk blend",
        color: "Ruby red with gold accents",
        workType: "Woven zari border",
        occasion: "Wedding",
        blousePiece: "Included",
        care: "Dry clean recommended",
        availability: "In Stock",
        images: [
            "images/saree1/1.jpeg",
            "images/saree1/2.jpeg",
            "images/saree1/3.jpeg",
            "images/saree1/4.jpeg",
            "images/saree1/5.jpeg"
        ]
    },
    {
        id: "heritage-drape",
        name: "Heritage Drape Saree",
        category: "Festive Collection",
        price: "Enquire for price",
        numericPrice: null,
        description: "A boutique festive saree with striking visual appeal, made for buyers who want something memorable and celebration ready.",
        cover: "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg",
        fabric: "Banarasi-inspired art silk",
        color: "Deep maroon",
        workType: "Jacquard festive weave",
        occasion: "Festive",
        blousePiece: "Included",
        care: "Gentle dry clean only",
        availability: "Limited Stock",
        images: [
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (2).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.24 AM (1).jpeg"
        ]
    },
    {
        id: "royal-weave",
        name: "Royal Weave Saree",
        category: "Occasion Edit",
        price: "Rs. 1,899",
        numericPrice: 1899,
        description: "An elegant statement saree for festive gatherings, receptions, and buyers looking for a richer boutique look.",
        cover: "images/saree1/3.jpeg",
        fabric: "Premium silk weave",
        color: "Royal magenta",
        workType: "Rich woven pallu",
        occasion: "Reception",
        blousePiece: "Included",
        care: "Dry clean preferred",
        availability: "In Stock",
        images: [
            "images/saree1/3.jpeg",
            "images/saree1/4.jpeg",
            "images/saree1/5.jpeg",
            "images/saree1/2.jpeg"
        ]
    },
    {
        id: "celebration-classic",
        name: "Celebration Classic Saree",
        category: "New Arrival",
        price: "Enquire for price",
        numericPrice: null,
        description: "A celebration-ready drape with boutique appeal, ideal for puja, family functions, gifting, and modern traditional styling.",
        cover: "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
        fabric: "Soft designer tissue",
        color: "Rose pink",
        workType: "Subtle festive detailing",
        occasion: "Puja",
        blousePiece: "Available on request",
        care: "Dry clean recommended",
        availability: "Made to Order",
        images: [
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (2).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.24 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg"
        ]
    }
];

const shortlistState = new Set(loadShortlist());

function loadShortlist() {
    try {
        const saved = JSON.parse(localStorage.getItem(shortlistStorageKey) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveShortlist() {
    try {
        localStorage.setItem(shortlistStorageKey, JSON.stringify([...shortlistState]));
    } catch (error) {
        // Ignore storage errors so browsing still works in stricter privacy modes.
    }
}

function isShortlisted(productId) {
    return shortlistState.has(productId);
}

function toggleShortlist(productId) {
    if (isShortlisted(productId)) {
        shortlistState.delete(productId);
    } else {
        shortlistState.add(productId);
    }

    saveShortlist();
    syncShortlistUI();
}

function getShortlistedProducts() {
    return products.filter((product) => shortlistState.has(product.id));
}

function createWhatsAppUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function buildShortlistMessage(items) {
    if (!items.length) {
        return "Hello Manjima's Sharyalap, I want to explore your saree collection.";
    }

    const summary = items.map((item) => `${item.name} (${item.price})`).join(", ");
    return `Hello Manjima's Sharyalap, I want to enquire about these sarees: ${summary}.`;
}

function getUniqueValues(key) {
    return [...new Set(products.map((product) => product[key]).filter(Boolean))];
}

function formatDetailLabel(label) {
    return label.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`).replace(/^./, (char) => char.toUpperCase());
}

function getPricePriority(product) {
    return typeof product.numericPrice === "number" ? product.numericPrice : Number.MAX_SAFE_INTEGER;
}

function getRelatedProducts(productId) {
    const currentProduct = products.find((product) => product.id === productId);

    if (!currentProduct) {
        return [];
    }

    return products
        .filter((product) => product.id !== productId)
        .sort((first, second) => {
            const firstScore = Number(first.category === currentProduct.category) + Number(first.occasion === currentProduct.occasion);
            const secondScore = Number(second.category === currentProduct.category) + Number(second.occasion === currentProduct.occasion);

            if (secondScore !== firstScore) {
                return secondScore - firstScore;
            }

            return getPricePriority(first) - getPricePriority(second);
        })
        .slice(0, 3);
}

// Mobile menu open / close behavior
function setupNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

function createShortlistButton(productId) {
    const activeClass = isShortlisted(productId) ? "active" : "";
    const label = isShortlisted(productId) ? "Saved" : "Save";

    return `
        <button
            class="shortlist-btn ${activeClass}"
            type="button"
            data-shortlist-toggle="${productId}"
            aria-pressed="${String(isShortlisted(productId))}"
        >
            ${label}
        </button>
    `;
}

// Product card template used on the homepage collection section
function createProductCard(product) {
    return `
        <article class="card">
            <div class="card-media">
                <img src="${product.cover}" alt="${product.name}" loading="lazy">
                <span class="card-badge">${product.availability}</span>
            </div>
            <div class="card-body">
                <div class="card-topline">
                    <span class="card-tag">${product.category}</span>
                    ${createShortlistButton(product.id)}
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="card-meta">
                    <span>${product.fabric}</span>
                    <span>${product.color}</span>
                    <span>${product.occasion}</span>
                </div>
                <strong class="card-price">${product.price}</strong>
                <div class="card-footer">
                    <span>Multiple gallery images</span>
                    <a class="card-link" href="product.html?id=${product.id}">View Details</a>
                </div>
            </div>
        </article>
    `;
}

function attachShortlistEvents(scope = document) {
    scope.querySelectorAll("[data-shortlist-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            toggleShortlist(button.dataset.shortlistToggle);
        });
    });
}

function syncShortlistButtons() {
    document.querySelectorAll("[data-shortlist-toggle]").forEach((button) => {
        const isActive = isShortlisted(button.dataset.shortlistToggle);
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
        button.textContent = isActive ? "Saved" : "Save";
    });

    const shortlistToggle = document.getElementById("shortlistToggle");
    const productId = shortlistToggle?.dataset.productId;

    if (shortlistToggle && productId) {
        const active = isShortlisted(productId);
        shortlistToggle.classList.toggle("active", active);
        shortlistToggle.textContent = active ? "Saved to Shortlist" : "Save to Shortlist";
    }
}

function updateShortlistLink(items) {
    const shortlistLink = document.getElementById("shortlistWhatsApp");

    if (!shortlistLink) {
        return;
    }

    shortlistLink.href = createWhatsAppUrl(buildShortlistMessage(items));
    shortlistLink.classList.toggle("is-disabled", !items.length);
    shortlistLink.setAttribute("aria-disabled", String(!items.length));
}

function renderShortlistSection() {
    const shortlistGrid = document.getElementById("shortlistGrid");
    const shortlistEmpty = document.getElementById("shortlistEmpty");

    if (!shortlistGrid || !shortlistEmpty) {
        return;
    }

    const items = getShortlistedProducts();
    shortlistGrid.innerHTML = items.map(createProductCard).join("");
    shortlistEmpty.hidden = items.length > 0;
    updateShortlistLink(items);
    attachShortlistEvents(shortlistGrid);
}

function syncShortlistUI() {
    syncShortlistButtons();
    renderShortlistSection();
}

function populateFilterOptions(select, values, placeholder) {
    if (!select) {
        return;
    }

    select.innerHTML = [`<option value="all">${placeholder}</option>`]
        .concat(values.map((value) => `<option value="${value}">${value}</option>`))
        .join("");
}

// Render all product cards on the homepage collection section
function renderHomeProducts() {
    const productGrid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const occasionFilter = document.getElementById("occasionFilter");
    const filterReset = document.getElementById("filterReset");
    const catalogSummary = document.getElementById("catalogSummary");
    const emptyState = document.getElementById("emptyState");

    if (!productGrid) {
        return;
    }

    populateFilterOptions(categoryFilter, getUniqueValues("category"), "All categories");
    populateFilterOptions(occasionFilter, getUniqueValues("occasion"), "All occasions");

    function getFilteredProducts() {
        const query = searchInput?.value.trim().toLowerCase() || "";
        const category = categoryFilter?.value || "all";
        const occasion = occasionFilter?.value || "all";

        return products.filter((product) => {
            const haystack = [
                product.name,
                product.category,
                product.description,
                product.fabric,
                product.color,
                product.workType,
                product.occasion
            ].join(" ").toLowerCase();

            const matchesQuery = !query || haystack.includes(query);
            const matchesCategory = category === "all" || product.category === category;
            const matchesOccasion = occasion === "all" || product.occasion === occasion;

            return matchesQuery && matchesCategory && matchesOccasion;
        });
    }

    function renderCatalog() {
        const filteredProducts = getFilteredProducts();

        productGrid.innerHTML = filteredProducts.map(createProductCard).join("");
        emptyState.hidden = filteredProducts.length > 0;

        if (catalogSummary) {
            catalogSummary.textContent = filteredProducts.length === products.length
                ? `Showing all ${products.length} sarees`
                : `Showing ${filteredProducts.length} of ${products.length} sarees`;
        }

        attachShortlistEvents(productGrid);
    }

    renderCatalog();

    [searchInput, categoryFilter, occasionFilter].forEach((element) => {
        element?.addEventListener("input", renderCatalog);
        element?.addEventListener("change", renderCatalog);
    });

    filterReset?.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (occasionFilter) {
            occasionFilter.value = "all";
        }

        renderCatalog();
    });

    document.getElementById("clearShortlist")?.addEventListener("click", () => {
        shortlistState.clear();
        saveShortlist();
        syncShortlistUI();
        renderCatalog();
    });
}

// Change main image when a thumbnail is clicked
function changeImg(imageSrc, trigger) {
    const mainImage = document.getElementById("mainImg");

    if (!mainImage) {
        return;
    }

    mainImage.src = imageSrc;
    mainImage.dataset.imagePath = imageSrc;

    document.querySelectorAll("#thumbnailList img").forEach((thumb) => {
        thumb.classList.remove("active");
    });

    if (trigger) {
        trigger.classList.add("active");
    }
}

// Open a full-screen zoom view for the main product image
function setupImageZoom() {
    const mainImage = document.getElementById("mainImg");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImg");
    const closeButton = document.getElementById("imageModalClose");
    const prevButton = document.getElementById("imageModalPrev");
    const nextButton = document.getElementById("imageModalNext");

    if (!mainImage || !modal || !modalImage || !closeButton || !prevButton || !nextButton) {
        return;
    }

    let modalImages = [];
    let activeIndex = 0;
    let touchStartX = 0;
    let touchCurrentX = 0;

    function syncModalImages() {
        const thumbnails = Array.from(document.querySelectorAll("#thumbnailList img"));
        const currentImagePath = mainImage.dataset.imagePath || mainImage.getAttribute("src");
        modalImages = thumbnails.map((thumb) => thumb.dataset.image);
        activeIndex = modalImages.indexOf(currentImagePath);

        if (activeIndex < 0) {
            activeIndex = 0;
        }

        if (!modalImages.length && mainImage.src) {
            modalImages = [mainImage.src];
            activeIndex = 0;
        }
    }

    function showModalImage(index) {
        if (!modalImages.length) {
            return;
        }

        activeIndex = (index + modalImages.length) % modalImages.length;
        const imageSrc = modalImages[activeIndex];
        modalImage.src = imageSrc;
        modalImage.alt = mainImage.alt;

        const activeThumb = document.querySelector(`#thumbnailList img[data-image="${CSS.escape(imageSrc)}"]`);
        changeImg(imageSrc, activeThumb);
    }

    function openModal() {
        if (!mainImage.src) {
            return;
        }

        syncModalImages();
        showModalImage(activeIndex);
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function showPrevious() {
        showModalImage(activeIndex - 1);
    }

    function showNext() {
        showModalImage(activeIndex + 1);
    }

    mainImage.addEventListener("click", openModal);
    mainImage.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal();
        }
    });

    closeButton.addEventListener("click", closeModal);
    prevButton.addEventListener("click", showPrevious);
    nextButton.addEventListener("click", showNext);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modalImage.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchCurrentX = touchStartX;
    }, { passive: true });

    modalImage.addEventListener("touchmove", (event) => {
        touchCurrentX = event.changedTouches[0].clientX;
    }, { passive: true });

    modalImage.addEventListener("touchend", () => {
        const distance = touchCurrentX - touchStartX;

        if (Math.abs(distance) < 40) {
            return;
        }

        if (distance > 0) {
            showPrevious();
        } else {
            showNext();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowLeft") {
            showPrevious();
        }

        if (event.key === "ArrowRight") {
            showNext();
        }
    });
}

function renderProductMeta(product) {
    const detailsContainer = document.getElementById("productDetails");
    const availability = document.getElementById("productAvailability");

    if (!detailsContainer || !availability) {
        return;
    }

    const detailMap = {
        fabric: product.fabric,
        color: product.color,
        workType: product.workType,
        occasion: product.occasion,
        blousePiece: product.blousePiece,
        care: product.care
    };

    detailsContainer.innerHTML = Object.entries(detailMap).map(([key, value]) => `
        <div class="detail-card">
            <span>${formatDetailLabel(key)}</span>
            <strong>${value}</strong>
        </div>
    `).join("");

    availability.textContent = product.availability;
    availability.className = `product-availability status-${product.availability.toLowerCase().replace(/\s+/g, "-")}`;
}

function renderRelatedProducts(productId) {
    const relatedProductsContainer = document.getElementById("relatedProducts");
    const relatedSection = document.getElementById("relatedSection");

    if (!relatedProductsContainer || !relatedSection) {
        return;
    }

    const related = getRelatedProducts(productId);
    relatedProductsContainer.innerHTML = related.map(createProductCard).join("");
    relatedSection.hidden = related.length === 0;
    attachShortlistEvents(relatedProductsContainer);
}

// Render the correct product on product.html based on URL parameter
function renderProductDetails() {
    const page = document.body.dataset.page;

    if (page !== "product") {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || products[0].id;
    const product = products.find((item) => item.id === productId) || products[0];

    const nameEl = document.getElementById("productName");
    const categoryEl = document.getElementById("productCategory");
    const priceEl = document.getElementById("productPrice");
    const descEl = document.getElementById("productDescription");
    const buyLink = document.getElementById("buyLink");
    const thumbnailList = document.getElementById("thumbnailList");
    const mainImage = document.getElementById("mainImg");
    const shortlistToggle = document.getElementById("shortlistToggle");

    if (!nameEl || !categoryEl || !priceEl || !descEl || !buyLink || !thumbnailList || !mainImage || !shortlistToggle) {
        return;
    }

    document.title = `${product.name} | Manjima's Sharyalap`;
    nameEl.textContent = product.name;
    categoryEl.textContent = product.category;
    priceEl.textContent = product.price;
    descEl.textContent = product.description;
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    mainImage.dataset.imagePath = product.images[0];
    buyLink.href = createWhatsAppUrl(`Hello Manjima's Sharyalap, I want to buy ${product.name}.`);

    thumbnailList.innerHTML = product.images.map((image, index) => `
        <img
            src="${image}"
            alt="${product.name} view ${index + 1}"
            class="${index === 0 ? "active" : ""}"
            data-image="${image}"
            loading="lazy"
        >
    `).join("");

    thumbnailList.querySelectorAll("img").forEach((thumb) => {
        thumb.addEventListener("click", () => changeImg(thumb.dataset.image, thumb));
    });

    renderProductMeta(product);
    renderRelatedProducts(product.id);

    shortlistToggle.dataset.productId = product.id;
    shortlistToggle.addEventListener("click", () => {
        toggleShortlist(product.id);
    });

    syncShortlistButtons();
}

setupNavToggle();
renderHomeProducts();
renderShortlistSection();
renderProductDetails();
setupImageZoom();
syncShortlistButtons();
