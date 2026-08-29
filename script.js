// ============================================
// BhedaCraft — Explore Page
// Product data, filtering, sorting & search
// ============================================

const PRODUCTS = [
    { id: 1,  name: "Felt Sheep Ornament",        category: "Ornaments",           material: "Wool Felt",     price: 450,  img: "Assets/p1.jpg", tag: "Bestseller", desc: "A tiny handmade sheep that adds a cozy, playful touch to your tree, shelf, or favorite little corner." },

    { id: 2,  name: "Wool Coaster Set (x4)",       category: "Home Decor",          material: "Wool Felt",     price: 890,  img: "Assets/p2-1.jpg", desc: "Hand-felted coasters that keep your table safe from spills while bringing a warm, handmade feel to everyday moments.",
        colors: [
            { name: "Multicolor", hex: "#9206b2", img: "Assets/p2-1.jpg" },
            { name: "Christmas themed", hex: "#23c518", img: "Assets/p2-2.jpg" },
            { name: "Plain colors(Customizable)", hex: "#524f48", img: "Assets/p2-3.jpg" },
        ]
    },

    { id: 3,  name: "Handstitched Felt Tote Bag",  category: "Bags & Accessories",  material: "Felt & Wool",   price: 2400, img: "Assets/bgp3.jpg", tag: "New", desc: "A roomy handmade tote made for everyday errands, classes, shopping trips, and carrying all the little essentials." },

    { id: 4,  name: "Rainbow Felt Garland",        category: "Home Decor",          material: "Wool Felt",     price: 1250,  img: "Assets/p4.jpg", desc: "A colorful handmade garland that instantly makes a room feel brighter, warmer, and a little more cheerful." },

    { id: 5,  name: "Felt Boots",                 category: "Baby & Kids",         material: "Cotton Blend",  price: 650,  img: "Assets/p5.jpg", desc: "Soft little booties made to keep tiny feet warm and comfortable, especially on those chilly days." },

    { id: 6,  name: "Mini Felt Christmas Trees",  category: "Seasonal",            material: "Wool Felt",     price: 380,  img: "Assets/p6.jpg", tag: "Seasonal", desc: "Tiny felt trees that make a shelf, table, or gift corner feel extra festive without going over the top." },

    { id: 7,  name: "Stitched Wool Dryer Balls (Set of 6)", category: "Home Decor", material: "Wool Felt", price: 990, img: "Assets/p7.jpg", desc: "A simple, reusable way to make laundry easier while cutting down drying time and avoiding unnecessary chemicals." },

    { id: 8,  name: "Felt Keychains (Customizable)", category: "Bags & Accessories", material: "Wool Felt", price: 320, img: "Assets/p8.jpg", desc: "A cute little handmade companion for your keys, bag, or backpack, with customizable options to make it more personal." },

    { id: 9,  name: "Felt Ball Rug",              category: "Home Decor",          material: "Felt & Wool",   price: 4200, img: "Assets/p9.jpg", tag: "Bestseller", desc: "A cozy felted rug that brings color, texture, and a touch of traditional Nepali-inspired craft into your home." },

    { id: 10, name: "Felt Ankle Boots",           category: "Baby & Kids",         material: "Cotton Blend",  price: 540,  img: "Assets/p10.jpg", desc: "Warm and comfortable little boots designed to keep small feet cozy while adding a cute touch to everyday outfits." },

    { id: 11, name: "Felt Slipper",              category: "Ornaments",           material: "Wool Felt",     price: 1600, img: "Assets/p11.jpg", desc: "A soft handmade felt slipper that adds a cozy feel to slow mornings, relaxed evenings, and comfortable days at home." },

    { id: 12, name: "Color Chart",               category: "Bags & Accessories",  material: "Felt & Wool",   price: 3100, img: "Assets/p12.jpg", desc: "A handy collection of felt colors to help find the right shade for crafts, decorations, and personalized creations." },

    { id: 13, name: "Wool Wreath",               category: "Seasonal",            material: "Wool Felt",     price: 560,  img: "Assets/p13.jpg", desc: "A warm and welcoming wool wreath that gives doors, walls, or cozy corners a simple handmade touch." },

    { id: 14, name: "Cat House",                 category: "Home Decor",          material: "Cotton Blend",  price: 1750, img: "Assets/p14.jpg", tag: "New", desc: "A cozy little space for your cat to curl up, relax, and enjoy some quiet time in its own comfortable corner." },

    { id: 15, name: "Plain Dryer Balls (Set of 6)", category: "Seasonal",          material: "Wool Felt",     price: 720,  img: "Assets/p15.jpg", desc: "Reusable wool dryer balls that make laundry days a little easier while helping clothes dry faster and stay soft." },

    { id: 16, name: "Multicolor Felt Sheets",    category: "Ornaments",           material: "Felt & Wool",   price: 980,  img: "Assets/p16.jpg", desc: "Colorful felt sheets that are great for small DIY projects, decorations, school crafts, and adding a personal touch to handmade ideas." },
];

const state = {
    search: "",
    category: "all",
    priceRanges: [],
    materials: [],
    sort: "featured",
    wishlist: new Set(),
    selectedColors: new Map(),
};

function getSelectedColor(p) {
    if (!p.colors) return null;
    return state.selectedColors.get(p.id) || p.colors[0].name;
}

function getCurrentImg(p) {
    if (!p.colors) return p.img;
    const colorName = getSelectedColor(p);
    const match = p.colors.find(c => c.name === colorName);
    return match ? match.img : p.colors[0].img;
}

const cart = new Map();

function cartKey(id, color) {
    return color ? `${id}::${color}` : `${id}`;
}

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
    cart.forEach(entry => total += entry.qty);
    return total;
}

function cartSubtotal() {
    let total = 0;
    cart.forEach(entry => total += entry.qty * getProduct(entry.id).price);
    return total;
}

function addToCart(id, color) {
    const key = cartKey(id, color);
    const existing = cart.get(key);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.set(key, { id, color, qty: 1 });
    }

    renderCartBadge();
    renderCartDrawer();
}

function changeQty(key, delta) {
    const entry = cart.get(key);

    if (!entry) return;

    entry.qty += delta;

    if (entry.qty <= 0) {
        cart.delete(key);
    }

    renderCartBadge();
    renderCartDrawer();
}

function removeFromCart(key) {
    cart.delete(key);
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

        cart.forEach((entry, key) => {

            const p = getProduct(entry.id);

            const img = p.colors
                ? (p.colors.find(c => c.name === entry.color) || p.colors[0]).img
                : p.img;

            const row = document.createElement("div");

            row.className = "cart-item";

            row.innerHTML = `
                <img src="${img}" alt="${p.name}">

                <div class="cart-item-info">

                    <span class="name">
                        ${p.name}${entry.color ? ` <span style="color:#9E5949;font-size:12px;">(${entry.color})</span>` : ""}
                    </span>

                    <span class="price">${formatPrice(p.price)}</span>

                    <div class="qty-row">

                        <button class="qty-minus" data-key="${key}">
                            &minus;
                        </button>

                        <span>${entry.qty}</span>

                        <button class="qty-plus" data-key="${key}">
                            &plus;
                        </button>

                        <button class="remove-item" data-key="${key}">
                            Remove
                        </button>

                    </div>

                </div>
            `;

            cartItemsEl.appendChild(row);
        });

        checkoutBtn.disabled = false;

        cartItemsEl.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", () => changeQty(btn.dataset.key, -1));
        });

        cartItemsEl.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", () => changeQty(btn.dataset.key, 1));
        });

        cartItemsEl.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(btn.dataset.key));
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

        const matchesSearch =
            p.name.toLowerCase().includes(state.search.toLowerCase());

        const matchesCategory =
            state.category === "all" ||
            p.category === state.category;

        const matchesPrice =
            state.priceRanges.length === 0 ||
            state.priceRanges.some(r => priceInRange(p.price, r));

        const matchesMaterial =
            state.materials.length === 0 ||
            state.materials.includes(p.material);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesMaterial
        );
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
            break;
    }

    return list;
}

function formatPrice(n) {
    return "Rs. " + n.toLocaleString("en-IN");
}

function renderChips() {

    const chips = [];

    if (state.category !== "all") {

        chips.push({
            label: state.category,

            onRemove: () => {
                state.category = "all";
                syncCategoryButtons();
                render();
            }
        });
    }

    state.priceRanges.forEach(r => {

        const labelMap = {
            "0-500": "Under Rs. 500",
            "500-1000": "Rs. 500–1000",
            "1000-2000": "Rs. 1000–2000",
            "2000-999999": "Rs. 2000+",
        };

        chips.push({
            label: labelMap[r],

            onRemove: () => {

                state.priceRanges =
                    state.priceRanges.filter(x => x !== r);

                document.querySelectorAll(".price-check").forEach(cb => {

                    if (cb.value === r) {
                        cb.checked = false;
                    }

                });

                render();
            }
        });
    });

    state.materials.forEach(m => {

        chips.push({
            label: m,

            onRemove: () => {

                state.materials =
                    state.materials.filter(x => x !== m);

                document.querySelectorAll(".material-check").forEach(cb => {

                    if (cb.value === m) {
                        cb.checked = false;
                    }

                });

                render();
            }
        });
    });

    activeChips.innerHTML = "";

    chips.forEach(chip => {

        const el = document.createElement("div");

        el.className = "chip";

        el.innerHTML = `
            <span>${chip.label}</span>
            <i class="fa-solid fa-xmark"></i>
        `;

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
                <p>No products match your filters yet.<br>
                Try clearing a filter or searching something else.</p>
            </div>
        `;

        return;
    }

    list.forEach(p => {

        const card = document.createElement("article");

        card.className = "product-card";
        card.dataset.id = p.id;

        const currentImg = getCurrentImg(p);
        const currentColor = getSelectedColor(p);

        const swatchesHtml = p.colors ? `

            <div class="card-swatches">

                ${p.colors.map(c => `

                    <button
                        class="swatch ${c.name === currentColor ? "active" : ""}"
                        style="background:${c.hex};"
                        data-id="${p.id}"
                        data-color="${c.name}"
                        aria-label="${c.name}"
                        title="${c.name}">
                    </button>

                `).join("")}

                <span class="swatch-label">
                    ${currentColor}
                </span>

            </div>

        ` : "";

        card.innerHTML = `

            <div class="card-media">

                ${p.tag ? `<span class="card-eyebrow">${p.tag}</span>` : ""}

                <button
                    class="wish-btn"
                    aria-label="Add to wishlist"
                    data-id="${p.id}">

                    <i class="fa-${state.wishlist.has(p.id) ? "solid" : "regular"} fa-heart"></i>

                </button>

                <img
                    src="${currentImg}"
                    alt="${p.name}${currentColor ? " - " + currentColor : ""}">

            </div>

            <div class="card-body">

                <span class="card-cat">
                    ${p.category}
                </span>

                <h3 class="card-title">
                    ${p.name}
                </h3>

                ${swatchesHtml}

                <p class="card-desc">
                    ${p.desc}
                </p>

                <div class="card-bottom">

                    <span class="card-price">
                        ${formatPrice(p.price)}
                    </span>

                    <button
                        class="add-cart-btn"
                        data-id="${p.id}">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });

    grid.querySelectorAll(".swatch").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            state.selectedColors.set(id, btn.dataset.color);

            const p = getProduct(id);

            const card = btn.closest(".product-card");

            card.querySelector(".card-media img").src =
                getCurrentImg(p);

            card.querySelector(".card-media img").alt =
                `${p.name} - ${btn.dataset.color}`;

            card.querySelectorAll(".swatch").forEach(s =>
                s.classList.toggle("active", s === btn)
            );

            card.querySelector(".swatch-label").textContent =
                btn.dataset.color;
        });
    });

    grid.querySelectorAll(".wish-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            if (state.wishlist.has(id)) {

                state.wishlist.delete(id);

                btn.classList.remove("active");

                btn.querySelector("i").className =
                    "fa-regular fa-heart";

            } else {

                state.wishlist.add(id);

                btn.classList.add("active");

                btn.querySelector("i").className =
                    "fa-solid fa-heart";
            }
        });
    });

    grid.querySelectorAll(".add-cart-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            const p = getProduct(id);

            addToCart(id, getSelectedColor(p));

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

        btn.classList.toggle(
            "active",
            btn.dataset.category === state.category
        );

    });
}

// ---------- Event wiring ----------

document.addEventListener("DOMContentLoaded", () => {

    // search

    document.getElementById("searchInput")
        .addEventListener("input", (e) => {

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

            state.priceRanges =
                Array.from(
                    document.querySelectorAll(".price-check:checked")
                ).map(x => x.value);

            render();
        });
    });


    // material checkboxes

    document.querySelectorAll(".material-check").forEach(cb => {

        cb.addEventListener("change", () => {

            state.materials =
                Array.from(
                    document.querySelectorAll(".material-check:checked")
                ).map(x => x.value);

            render();
        });
    });


    // sort

    document.getElementById("sortSelect")
        .addEventListener("change", (e) => {

            state.sort = e.target.value;

            render();
        });


    // clear filters

    document.getElementById("clearFilters")
        .addEventListener("click", () => {

            state.search = "";

            state.category = "all";

            state.priceRanges = [];

            state.materials = [];

            document.getElementById("searchInput").value = "";

            document
                .querySelectorAll(".price-check, .material-check")
                .forEach(cb => cb.checked = false);

            syncCategoryButtons();

            render();
        });


    // mobile filter toggle

    const toggle =
        document.getElementById("mobileFilterToggle");

    const panel =
        document.getElementById("filtersPanel");

    if (toggle && panel) {

        toggle.addEventListener("click", () =>
            panel.classList.toggle("open")
        );
    }


    // cart drawer open/close

    cartToggle.addEventListener("click", (e) => {

        e.preventDefault();

        openCart();
    });

    cartClose.addEventListener("click", closeCart);

    cartOverlay.addEventListener("click", closeCart);

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closeCart();
        }

    });


    // checkout placeholder — no backend yet

    checkoutBtn.addEventListener("click", () => {

        alert(
            "Checkout isn't connected yet — this is where payment would happen once your backend is set up."
        );

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