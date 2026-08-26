// ============================================
// BhedaCraft — Explore Page
// Product data, filtering, sorting & search
// ============================================

const PRODUCTS = [
    { id: 1,  name: "Felt Sheep Ornament",        category: "Ornaments",           material: "Wool Felt",     price: 450,  img: "Assets/img1.jpg", tag: "Bestseller" },
    { id: 2,  name: "Wool Coaster Set (x4)",       category: "Home Decor",          material: "Wool Felt",     price: 890,  img: "Assets/img2.jpg" },
    { id: 3,  name: "Handstitched Felt Tote Bag",  category: "Bags & Accessories",  material: "Felt & Wood",   price: 2400, img: "Assets/img3.jpg", tag: "New" },
    { id: 4,  name: "Rainbow Felt Garland",        category: "Home Decor",          material: "Wool Felt",     price: 1250, img: "Assets/img4.jpg" },
    { id: 5,  name: "Newborn Felt Booties",        category: "Baby & Kids",         material: "Cotton Blend",  price: 650,  img: "Assets/img5.jpg" },
    { id: 6,  name: "Mini Felt Christmas Trees",   category: "Seasonal",            material: "Wool Felt",     price: 380,  img: "Assets/img6.jpg", tag: "Seasonal" },
    { id: 7,  name: "Wool Dryer Balls (Set of 6)", category: "Home Decor",          material: "Wool Felt",     price: 990,  img: "Assets/img7.jpg" },
    { id: 8,  name: "Felt Fox Keychain",           category: "Bags & Accessories",  material: "Wool Felt",     price: 320,  img: "Assets/img1.jpg" },
    { id: 9,  name: "Himalayan Wool Table Rug",    category: "Home Decor",          material: "Felt & Wood",   price: 4200, img: "Assets/img2.jpg", tag: "Bestseller" },
    { id: 10, name: "Felt Bunny Baby Rattle",      category: "Baby & Kids",         material: "Cotton Blend",  price: 540,  img: "Assets/img3.jpg" },
    { id: 11, name: "Hanging Felt Bird Mobile",    category: "Ornaments",           material: "Wool Felt",     price: 1600, img: "Assets/img4.jpg" },
    { id: 12, name: "Woven Wool Crossbody Bag",    category: "Bags & Accessories",  material: "Felt & Wood",   price: 3100, img: "Assets/img5.jpg" },
    { id: 13, name: "Snowflake Ornament Trio",     category: "Seasonal",            material: "Wool Felt",     price: 560,  img: "Assets/img6.jpg" },
    { id: 14, name: "Felt Elephant Pillow",        category: "Home Decor",          material: "Cotton Blend",  price: 1750, img: "Assets/img7.jpg", tag: "New" },
    { id: 15, name: "Nepali New Year Bunting",     category: "Seasonal",            material: "Wool Felt",     price: 720,  img: "Assets/img1.jpg" },
    { id: 16, name: "Felt Owl Wall Hanging",       category: "Ornaments",           material: "Felt & Wood",   price: 980,  img: "Assets/img2.jpg" },
];

const state = {
    search: "",
    category: "all",
    priceRanges: [],
    materials: [],
    sort: "featured",
    wishlist: new Set(),
};

// cart is a map of productId -> quantity
const cart = new Map();

const grid = document.getElementById("productGrid");
const resultsNum = document.getElementById("resultsNum");
const activeChips = document.getElementById("activeChips");
const cartCountEl = document.getElementById("cartCount");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function getProduct(id) {
    return PRODUCTS.find(p => p.id === id);
}

function cartTotalQty() {
    let total = 0;
    cart.forEach(qty => total += qty);
    return total;
}

function cartSubtotal() {
    let total = 0;
    cart.forEach((qty, id) => total += qty * getProduct(id).price);
    return total;
}

function addToCart(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCartBadge();
    renderCartDrawer();
}

function changeQty(id, delta) {
    const current = cart.get(id) || 0;
    const next = current + delta;
    if (next <= 0) {
        cart.delete(id);
    } else {
        cart.set(id, next);
    }
    renderCartBadge();
    renderCartDrawer();
}

function removeFromCart(id) {
    cart.delete(id);
    renderCartBadge();
    renderCartDrawer();
}

function renderCartBadge() {
    cartCountEl.textContent = cartTotalQty();
}

function renderCartDrawer() {
    cartItemsEl.innerHTML = "";

    if (cart.size === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your cart is empty.<br>Add a few handmade favorites!</p>
            </div>`;
        checkoutBtn.disabled = true;
    } else {
        cart.forEach((qty, id) => {
            const p = getProduct(id);
            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <div class="cart-item-info">
                    <span class="name">${p.name}</span>
                    <span class="price">${formatPrice(p.price)}</span>
                    <div class="qty-row">
                        <button class="qty-minus" data-id="${id}">&minus;</button>
                        <span>${qty}</span>
                        <button class="qty-plus" data-id="${id}">&plus;</button>
                        <button class="remove-item" data-id="${id}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsEl.appendChild(row);
        });
        checkoutBtn.disabled = false;

        cartItemsEl.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), -1));
        });
        cartItemsEl.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), 1));
        });
        cartItemsEl.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
        });
    }

    cartSubtotalEl.textContent = formatPrice(cartSubtotal());
}

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
}

function priceInRange(price, range) {
    const [min, max] = range.split("-").map(Number);
    return price >= min && price <= max;
}

function getFiltered() {
    let list = PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
        const matchesCategory = state.category === "all" || p.category === state.category;
        const matchesPrice = state.priceRanges.length === 0 ||
            state.priceRanges.some(r => priceInRange(p.price, r));
        const matchesMaterial = state.materials.length === 0 ||
            state.materials.includes(p.material);
        return matchesSearch && matchesCategory && matchesPrice && matchesMaterial;
    });

    switch (state.sort) {
        case "price-asc":
            list = list.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            list = list.sort((a, b) => b.price - a.price);
            break;
        case "name-asc":
            list = list.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break; // featured = original order
    }

    return list;
}

function formatPrice(n) {
    return "Rs. " + n.toLocaleString("en-IN");
}

function renderChips() {
    const chips = [];

    if (state.category !== "all") {
        chips.push({ label: state.category, onRemove: () => { state.category = "all"; syncCategoryButtons(); render(); } });
    }
    state.priceRanges.forEach(r => {
        const labelMap = {
            "0-500": "Under Rs. 500",
            "500-1000": "Rs. 500–1000",
            "1000-2000": "Rs. 1000–2000",
            "2000-999999": "Rs. 2000+",
        };
        chips.push({ label: labelMap[r], onRemove: () => {
            state.priceRanges = state.priceRanges.filter(x => x !== r);
            document.querySelectorAll(".price-check").forEach(cb => { if (cb.value === r) cb.checked = false; });
            render();
        }});
    });
    state.materials.forEach(m => {
        chips.push({ label: m, onRemove: () => {
            state.materials = state.materials.filter(x => x !== m);
            document.querySelectorAll(".material-check").forEach(cb => { if (cb.value === m) cb.checked = false; });
            render();
        }});
    });

    activeChips.innerHTML = "";
    chips.forEach(chip => {
        const el = document.createElement("div");
        el.className = "chip";
        el.innerHTML = `<span>${chip.label}</span><i class="fa-solid fa-xmark"></i>`;
        el.querySelector("i").addEventListener("click", chip.onRemove);
        activeChips.appendChild(el);
    });
}

function renderGrid(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-mound"></i>
                <p>No products match your filters yet.<br>Try clearing a filter or searching something else.</p>
            </div>`;
        return;
    }

    list.forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-media">
                ${p.tag ? `<span class="card-eyebrow">${p.tag}</span>` : ""}
                <button class="wish-btn" aria-label="Add to wishlist" data-id="${p.id}">
                    <i class="fa-${state.wishlist.has(p.id) ? "solid" : "regular"} fa-heart"></i>
                </button>
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="card-body">
                <span class="card-cat">${p.category}</span>
                <h3 class="card-title">${p.name}</h3>
                <div class="card-bottom">
                    <span class="card-price">${formatPrice(p.price)}</span>
                    <button class="add-cart-btn" data-id="${p.id}">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // wire up wishlist buttons
    grid.querySelectorAll(".wish-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            if (state.wishlist.has(id)) {
                state.wishlist.delete(id);
                btn.classList.remove("active");
                btn.querySelector("i").className = "fa-regular fa-heart";
            } else {
                state.wishlist.add(id);
                btn.classList.add("active");
                btn.querySelector("i").className = "fa-solid fa-heart";
            }
        });
    });

    // wire up add-to-cart buttons
    grid.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            addToCart(Number(btn.dataset.id));
            btn.textContent = "Added ✓";
            btn.classList.add("added");
            setTimeout(() => {
                btn.textContent = "Add to Cart";
                btn.classList.remove("added");
            }, 1200);
        });
    });
}

function render() {
    const filtered = getFiltered();
    resultsNum.textContent = filtered.length;
    renderChips();
    renderGrid(filtered);
}

function syncCategoryButtons() {
    document.querySelectorAll(".cat-tag").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === state.category);
    });
}

// ---------- Event wiring ----------
document.addEventListener("DOMContentLoaded", () => {
    // search
    document.getElementById("searchInput").addEventListener("input", (e) => {
        state.search = e.target.value;
        render();
    });

    // category buttons
    document.querySelectorAll(".cat-tag").forEach(btn => {
        btn.addEventListener("click", () => {
            state.category = btn.dataset.category;
            syncCategoryButtons();
            render();
        });
    });

    // price checkboxes
    document.querySelectorAll(".price-check").forEach(cb => {
        cb.addEventListener("change", () => {
            state.priceRanges = Array.from(document.querySelectorAll(".price-check:checked")).map(x => x.value);
            render();
        });
    });

    // material checkboxes
    document.querySelectorAll(".material-check").forEach(cb => {
        cb.addEventListener("change", () => {
            state.materials = Array.from(document.querySelectorAll(".material-check:checked")).map(x => x.value);
            render();
        });
    });

    // sort
    document.getElementById("sortSelect").addEventListener("change", (e) => {
        state.sort = e.target.value;
        render();
    });

    // clear filters
    document.getElementById("clearFilters").addEventListener("click", () => {
        state.search = "";
        state.category = "all";
        state.priceRanges = [];
        state.materials = [];
        document.getElementById("searchInput").value = "";
        document.querySelectorAll(".price-check, .material-check").forEach(cb => cb.checked = false);
        syncCategoryButtons();
        render();
    });

    // mobile filter toggle
    const toggle = document.getElementById("mobileFilterToggle");
    const panel = document.getElementById("filtersPanel");
    if (toggle && panel) {
        toggle.addEventListener("click", () => panel.classList.toggle("open"));
    }

    // cart drawer open/close
    cartToggle.addEventListener("click", (e) => {
        e.preventDefault();
        openCart();
    });
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCart();
    });

    // checkout placeholder — no backend yet
    checkoutBtn.addEventListener("click", () => {
        alert("Checkout isn't connected yet — this is where payment would happen once your backend is set up.");
    });

    renderCartDrawer();
    render();
});
window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1800);
});

function openLogin() {
    document.getElementById("loginsu").style.display = "flex";
}
function closeLogin() {
    document.getElementById("loginsu").style.display = "none";
}
