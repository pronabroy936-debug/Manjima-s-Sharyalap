// Product catalog:
// Add more products here by copying one object and changing the values.
// The `id` must stay unique because product.html uses it from the URL.
const products = [
    {
        // Product 1
        id: "silk-radiance",
        name: "Silk Radiance Saree",
        category: "Signature Silk",
        price: "Rs. 1,499",
        description: "A graceful silk saree with a rich festive feel, ideal for weddings, family functions, and elegant celebrations.",
        cover: "images/saree1/1.jpeg",
        images: [
            "images/saree1/1.jpeg",
            "images/saree1/2.jpeg",
            "images/saree1/3.jpeg",
            "images/saree1/4.jpeg",
            "images/saree1/5.jpeg"
        ]
    },
    {
        // Product 2
        id: "heritage-drape",
        name: "Heritage Drape Saree",
        category: "Festive Collection",
        price: "Enquire for price",
        description: "A boutique festive saree with striking visual appeal, made for buyers who want something memorable and celebration ready.",
        cover: "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg",
        images: [
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (2).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.24 AM (1).jpeg"
        ]
    },
    {
        // Product 3
        id: "royal-weave",
        name: "Royal Weave Saree",
        category: "Occasion Edit",
        price: "Rs. 1,899",
        description: "An elegant statement saree for festive gatherings, receptions, and buyers looking for a richer boutique look.",
        cover: "images/saree1/3.jpeg",
        images: [
            "images/saree1/3.jpeg",
            "images/saree1/4.jpeg",
            "images/saree1/5.jpeg",
            "images/saree1/2.jpeg"
        ]
    },
    {
        // Product 4
        id: "celebration-classic",
        name: "Celebration Classic Saree",
        category: "New Arrival",
        price: "Enquire for price",
        description: "A celebration-ready drape with boutique appeal, ideal for puja, family functions, gifting, and modern traditional styling.",
        cover: "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
        images: [
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.23 AM (2).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.24 AM (1).jpeg",
            "images/saree2/WhatsApp Image 2026-04-17 at 11.40.22 AM.jpeg"
        ]
    }
];

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

// Product card template used on the homepage collection section
function createProductCard(product) {
    return `
        <article class="card">
            <div class="card-media">
                <img src="${product.cover}" alt="${product.name}">
            </div>
            <div class="card-body">
                <span class="card-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong class="card-price">${product.price}</strong>
                <div class="card-footer">
                    <span>Multiple gallery images</span>
                    <a class="card-link" href="product.html?id=${product.id}">View Details</a>
                </div>
            </div>
        </article>
    `;
}

// Render all product cards on the homepage
function renderHomeProducts() {
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML = products.map(createProductCard).join("");
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

// Render the correct product on product.html based on URL parameter
function renderProductDetails() {
    const page = document.body.dataset.page;

    if (page !== "product") {
        return;
    }

    // Example URL: product.html?id=silk-radiance
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

    if (!nameEl || !categoryEl || !priceEl || !descEl || !buyLink || !thumbnailList || !mainImage) {
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
    buyLink.href = `https://wa.me/919330948227?text=${encodeURIComponent(`Hello Manjima's Sharyalap, I want to buy ${product.name}.`)}`;

    // Create all thumbnails for the selected product
    thumbnailList.innerHTML = product.images.map((image, index) => `
        <img
            src="${image}"
            alt="${product.name} view ${index + 1}"
            class="${index === 0 ? "active" : ""}"
            data-image="${image}"
        >
    `).join("");

    // Add click event to each thumbnail
    thumbnailList.querySelectorAll("img").forEach((thumb) => {
        thumb.addEventListener("click", () => changeImg(thumb.dataset.image, thumb));
    });
}

// Initial page setup
setupNavToggle();
renderHomeProducts();
renderProductDetails();
setupImageZoom();
