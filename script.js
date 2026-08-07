/* ============================= STATE & STORAGE ============================= */
const RATE = 279;
const fmtUSD = n => '$' + Number(n).toFixed(2);
const fmtPKR = n => '';
const uid = () => Math.random().toString(36).slice(2, 9);

const ICONS = {
  candle: `<svg viewBox="0 0 100 140" fill="none"><rect x="35" y="40" width="30" height="90" rx="6" fill="var(--amber-deep)" opacity=".85"/><ellipse cx="50" cy="40" rx="15" ry="6" fill="var(--amber-bright)"/><path d="M50 8 C 44 20, 56 24, 50 34 C 44 24, 56 20, 50 8Z" fill="#ffce7a"/></svg>`,
  jewelry: `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="42" r="26" stroke="var(--amber-bright)" stroke-width="4" fill="none"/><path d="M35 68 L50 95 L65 68" stroke="var(--amber-deep)" stroke-width="4" fill="none"/><polygon points="50,24 60,42 50,60 40,42" fill="var(--amber-bright)" opacity=".9"/></svg>`,
  decor: `<svg viewBox="0 0 100 100" fill="none"><path d="M20 80 Q50 20 80 80 Z" fill="var(--amber-deep)" opacity=".7"/><circle cx="50" cy="55" r="10" fill="var(--amber-bright)"/></svg>`,
  skincare: `<svg viewBox="0 0 100 120" fill="none"><rect x="30" y="35" width="40" height="70" rx="10" fill="var(--amber-deep)" opacity=".85"/><rect x="40" y="15" width="20" height="24" rx="4" fill="var(--amber-bright)"/></svg>`,
  accessory: `<svg viewBox="0 0 100 100" fill="none"><rect x="15" y="35" width="70" height="40" rx="20" stroke="var(--amber-bright)" stroke-width="5" fill="none"/><circle cx="50" cy="55" r="10" fill="var(--amber-deep)"/></svg>`
};
function iconFor(cat) { return ICONS[cat] || ICONS.decor; }

const SEED_PRODUCTS = [
  { name: "IZOORA BARMOP TOWELS", category: "accessory", price: 19.99, stock: 42, desc: "100% Cotton — Perfect for Cleaning", rating: 4.8, active: true },
  { name: "IZOORA WHITE BATHROBES", category: "bathrobes", price: 18, stock: 42, desc: "2 Pack - Premium 100% Cotton Terry Cloth Unisex Spa Robe", rating: 4.8, active: true },
  { name: "IZOORA BLACK BATH TOWELS ", category: "jewelry", price: 64, stock: 15, desc: "30x60 Inches - Pack of 6 | Ultra Soft, Highly Absorbent | 100% Cotton", rating: 4.9, active: true },
  { name: "IZOORA GREY TOWELS", category: "jewelry", price: 39, stock: 28, desc: "Set 8 Piece | 100% Cotton Bath Towels", rating: 4.6, active: true },
  { name: "IZOORA WHITE BATH TOWELS", category: "decor", price: 52, stock: 9, desc: "Pack of 6 | Ultra Soft, Highly Absorbent | 100% Cotton Towels for Bathroom, Gym, Spa, and Hotel Use | 24x48 inches.", rating: 4.7, active: true },
  { name: "IZOORA WHITE TOWELS", category: "decor", price: 96, stock: 6, desc: "Set 8 Piece | 100% Cotton Bath Towels", rating: 4.9, active: true },
  { name: "IZOORA NAVY BATH TOWELS", category: "skincare", price: 34, stock: 33, desc: "Pack of 6 | Ultra Soft, Highly Absorbent | 100% Cotton Towels for Bathroom, Gym, Spa, and Hotel Use | 24x48 inches", rating: 4.5, active: true },
  { name: "IZOORA GREY BATHROBES", category: "bathrobes", price: 26, stock: 21, desc: "Premium 100% Cotton Terry Cloth Unisex Spa Robe", rating: 4.4, active: true },
  { name: "IZOORA GREY BATH TOWELS", category: "accessory", price: 45, stock: 17, desc: "Pack of 6 | Ultra Soft, Highly Absorbent | 100% Cotton Towels for Bathroom, Gym, Spa, and Hotel Use | 24x48 inches", rating: 4.6, active: true },
  { name: "IZOORA GREY BATH TOWELS", category: "accessory", price: 58, stock: 12, desc: "30x60 Inches - Pack of 6 | Ultra Soft, Highly Absorbent | 100% Cotton", rating: 4.7, active: true },
  { name: "IZOORA BABY CAP", category: "candle", price: 24, stock: 50, desc: "Trio of mini amber-glass votives — vanilla bourbon, fig, and smoked cedar.", rating: 4.8, active: true },
  // { name: "Amber Beaded Bracelet", category: "jewelry", price: 29, stock: 0, desc: "Hand-strung raw amber beads on elastic cord, said to carry warmth from the Baltic coast.", rating: 4.3, active: true },
  // { name: "Terracotta Amber Wall Hanging", category: "decor", price: 71, stock: 8, desc: "Macrame and sun-fired clay bead wall piece in graduated amber tones.", rating: 4.6, active: true }
];

const ADMIN_EMAIL = "admin1985@gmail.com";
const ADMIN_PASS = "@dmin1985";

let STATE = {
  products: [],
  users: [],
  orders: [],
  currentUser: null,
  guestOrderId: null,
  cart: [],
  directCheckout: null,
  route: location.hash || '#/',
  ui: { dropdownOpen: false, mobileMenuOpen: false, cartOpen: false, checkoutPayment: 'cod', productFilter: 'all', productSearch: '', adminSearch: '', pdpTab: 'description', editingProduct: null, formErrors: {}, checkoutConfirmed: false }
};

// Sync currentUser and cart using localStorage to persist across multi-page loads
function loadSession() {
  try {
    let guestOrderId = localStorage.getItem('izoora_guest_order_id');
    if (!guestOrderId) {
      guestOrderId = 'AG-G-' + uid();
      localStorage.setItem('izoora_guest_order_id', guestOrderId);
    }
    STATE.guestOrderId = guestOrderId;
  } catch (e) { console.error(e); }

  try {
    const userJson = sessionStorage.getItem('izoora_user');
    if (userJson) STATE.currentUser = JSON.parse(userJson);
  } catch (e) { console.error(e); }

  try {
    const cartJson = sessionStorage.getItem('izoora_cart');
    if (cartJson) STATE.cart = JSON.parse(cartJson);
  } catch (e) { console.error(e); }

  try {
    const directCheckoutJson = sessionStorage.getItem('izoora_direct_checkout');
    if (directCheckoutJson) STATE.directCheckout = JSON.parse(directCheckoutJson);
  } catch (e) { console.error(e); }
}

function saveSession() {
  try {
    if (STATE.currentUser) {
      sessionStorage.setItem('izoora_user', JSON.stringify(STATE.currentUser));
    } else {
      sessionStorage.removeItem('izoora_user');
    }
  } catch (e) { console.error(e); }

  try {
    sessionStorage.setItem('izoora_cart', JSON.stringify(STATE.cart));
  } catch (e) { console.error(e); }

  try {
    if (STATE.directCheckout) sessionStorage.setItem('izoora_direct_checkout', JSON.stringify(STATE.directCheckout));
    else sessionStorage.removeItem('izoora_direct_checkout');
  } catch (e) { console.error(e); }
}

async function loadAll() {
  loadSession();

  try {
    const r = await window.storage.get('products', true);
    STATE.products = JSON.parse(r.value);
    let updated = false;
    STATE.products.forEach(p => {
      if (p.name && p.name.toLowerCase().includes('bathrobe') && p.category !== 'bathrobes') {
        p.category = 'bathrobes';
        updated = true;
      }
    });
    if (updated) {
      await saveProducts();
    }
    if (STATE.products.length < SEED_PRODUCTS.length) {
      STATE.products = SEED_PRODUCTS.map((p, i) => ({ ...p, id: 'AG-P-' + String(i + 1).padStart(4, '0') }));
      await saveProducts();
    }
  } catch (e) {
    STATE.products = SEED_PRODUCTS.map((p, i) => ({ ...p, id: 'AG-P-' + String(i + 1).padStart(4, '0') }));
    await saveProducts();
  }

  // Load users from localStorage
  try {
    const usersJson = localStorage.getItem('izoora_users');
    if (usersJson) {
      STATE.users = JSON.parse(usersJson);
    } else {
      STATE.users = [{
        id: 'AG-C-0001', fullName: 'Site Administrator', email: ADMIN_EMAIL, password: ADMIN_PASS,
        address: '—', landmark: '—', phone: '—', isAdmin: true, createdAt: Date.now()
      }];
      saveUsers();
    }
  } catch (e) {
    console.error(e);
  }

  // Load orders from localStorage
  try {
    const ordersJson = localStorage.getItem('izoora_orders');
    STATE.orders = ordersJson ? JSON.parse(ordersJson) : [];
  } catch (e) {
    console.error(e);
  }

  try {
    const reviewsJson = localStorage.getItem('izoora_reviews');
    window.REVIEWS_DB = reviewsJson ? JSON.parse(reviewsJson) : {};
  } catch (e) {
    window.REVIEWS_DB = {};
  }

  render();
  initContactForm();

  // Keep saved delivery details available when checkout is rendered.
  try {
    if (getActivePage() !== 'checkout') {
      document.querySelectorAll('form').forEach(f => f.reset());
      document.querySelectorAll('input, textarea').forEach(i => {
        if (i.type !== 'submit' && i.type !== 'button' && i.type !== 'checkbox' && i.type !== 'radio') {
          i.value = '';
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}

async function saveProducts() { try { await window.storage.set('products', JSON.stringify(STATE.products), true); } catch (e) { console.error(e); } }
async function saveUsers() { try { localStorage.setItem('izoora_users', JSON.stringify(STATE.users)); } catch (e) { console.error(e); } }
async function saveOrders() { try { localStorage.setItem('izoora_orders', JSON.stringify(STATE.orders)); } catch (e) { console.error(e); } }

function nextId(prefix, arr) {
  const n = arr.length + 1;
  return prefix + '-' + String(n).padStart(4, '0');
}

function toast(msg) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3200);
}

/* ============================= POPUPS SYSTEM ============================= */
function showPopup(title, message) {
  let modal = document.getElementById('successModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'successModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.zIndex = '9999';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.3s ease';

  modal.innerHTML = `
    <div class="backdrop" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);"></div>
    <div class="panel" style="position:relative;background:var(--bg-card);padding:40px;border-radius:24px;width:min(450px,90%);text-align:center;box-shadow:var(--shadow);transform:scale(0.9);transition:transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);color:var(--cream);border:1px solid var(--line);">
      <div style="width:72px;height:72px;background:rgba(110,148,100,0.15);color:var(--success);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:32px;font-weight:bold;border:1px solid var(--success)">✓</div>
      <h3 style="font-size:24px;margin-bottom:12px;color:var(--cream);font-weight:700;">${title}</h3>
      <p style="font-size:15px;color:var(--cream-dim);line-height:1.6;margin-bottom:28px;">${message}</p>
      <button class="btn btn-primary btn-block" style="padding:14px;border-radius:999px;font-weight:600;" onclick="document.getElementById('successModal').style.opacity='0'; setTimeout(()=>document.getElementById('successModal').remove(),300)">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.backdrop').addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  });

  requestAnimationFrame(() => {
    modal.style.opacity = '1';
    modal.querySelector('.panel').style.transform = 'scale(1)';
  });
}

/* ============================= PAGE DETECTION ============================= */
function getActivePage() {
  const path = location.pathname.toLowerCase();
  if (path.endsWith('product.html')) return 'product';
  if (path.endsWith('about and help.html') || path.endsWith('about%20and%20help.html')) return 'info';
  if (path.endsWith('login.html')) return 'login';
  if (path.endsWith('admin.html')) return 'admin';
  if (path.endsWith('contact.html')) return 'contact';
  if (path.endsWith('checkout.html')) return 'checkout';
  if (path.endsWith('order-success.html')) return 'order-success';
  return 'home';
}

/* ============================= ROUTER & NAVIGATION ============================= */
window.addEventListener('hashchange', () => {
  STATE.route = location.hash || '#/';
  window.scrollTo(0, 0);
  render();
});

function go(hash) {
  const page = getActivePage();
  if (hash.startsWith('#/products') || hash.startsWith('#/product/')) {
    if (page !== 'product') { location.href = 'product.html' + hash; return; }
  } else if (hash === '#/info') {
    if (page !== 'info') { location.href = 'about and help.html'; return; }
  } else if (hash === '#/login' || hash === '#/signup') {
    // if (page !== 'login') { location.href = 'login.html' + hash; return; }
  } else if (hash.startsWith('#/admin')) {
    if (page !== 'admin') { location.href = 'admin.html' + hash; return; }
  } else if (hash === '#/') {
    if (page !== 'home') { location.href = 'index.html'; return; }
  } else if (hash.startsWith('#/checkout')) {
    if (page !== 'checkout') { location.href = 'checkout.html' + hash; return; }
  } else if (hash.startsWith('#/order-success/')) {
    if (page !== 'order-success') { location.href = 'order-success.html' + hash; return; }
  }
  location.hash = hash;
  render();
}

function requireAuth(next) {
  if (!STATE.currentUser) {
    toast('Please log in or register to continue.');
    go('#/login?next=' + encodeURIComponent(next));
    return false;
  }
  return true;
}

/* ============================= VALIDATION ============================= */
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validPhone = v => /^[+0-9][0-9\-\s]{6,15}$/.test(v);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const cartCount = () => STATE.cart.reduce((a, c) => a + c.qty, 0);
const cartItemsFull = () => STATE.cart.map(c => { const p = STATE.products.find(p => p.id === c.productId); return p ? { ...p, qty: c.qty } : null; }).filter(Boolean);
const cartTotal = () => cartItemsFull().reduce((s, i) => s + i.price * i.qty, 0);

/* ============================= HEADER & FOOTER ============================= */
function Header() {
  const page = getActivePage();
  const isAdminUser = STATE.currentUser && STATE.currentUser.isAdmin;
  const navLinks = isAdminUser ? `
      <a href="admin.html#/admin" class="${page === 'admin' ? 'active' : ''}">Admin panel</a>` : `
      <a href="index.html" class="${page === 'home' ? 'active' : ''}">Home</a>
      <a href="product.html" class="${page === 'product' ? 'active' : ''}">Products</a>
      <a href="about and help.html" class="${page === 'info' ? 'active' : ''}">About &amp; Help</a>
      <a href="contact.html" class="${page === 'contact' ? 'active' : ''}">Contact</a>`;
  const nav = `
    <nav class="mainnav">
      ${navLinks}
    </nav>`;

  const cartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px; vertical-align:middle; display:inline-block; color:#f3e9d8;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;

  return `
  <header>
    <div class="headbar">
      <a href="index.html" class="logo">
        <img src="products pictures/izoora logo.png" alt="izoora Logo" style="height:32px; width:auto; border-radius:4px; vertical-align:middle;">
        
      </a>
      ${nav}
      <div class="head-actions">
        <button class="icon-btn mobile-menu-btn" type="button" aria-label="Open navigation menu" aria-expanded="${STATE.ui.mobileMenuOpen}" onclick="event.stopPropagation();toggleMobileMenu()">
          <span class="menu-icon"><i></i><i></i><i></i></span>
        </button>
        ${!isAdminUser ? `
        <div class="icon-btn" onclick="event.stopPropagation();go('#/cart')" title="Cart">
          ${cartIcon}
          ${cartCount() > 0 ? `<span class="badge">${cartCount()}</span>` : ''}
        </div>` : `
        <div class="icon-btn" onclick="event.stopPropagation();go('#/admin')" title="Notifications">
          🔔
          ${pendingOrders().length > 0 ? `<span class="badge">${pendingOrders().length}</span>` : ''}
        </div>`}
        <div class="icon-btn" onclick="event.stopPropagation();toggleDropdown()" title="Account">👤</div>
        <div class="dropdown ${STATE.ui.dropdownOpen ? 'open' : ''}" id="acctDropdown">
          ${!STATE.currentUser ? `
            <a href="login.html#/login">Log in</a>
            <a href="login.html#/signup">Register</a>
            <a href="login.html#/orders">My orders</a>
          ` : isAdminUser ? `
            <div style="padding:12px 16px;font-size:13px;color:var(--cream-dim);">Signed in as<br><b style="color:inherit">${esc(STATE.currentUser.fullName)}</b></div>
            <div class="divide"></div>
            <a href="admin.html#/admin">Admin panel</a>
            <button onclick="logout()">Log out</button>
          ` : `
            <div style="padding:12px 16px;font-size:13px;color:var(--cream-dim);">Signed in as<br><b style="color:inherit">${esc(STATE.currentUser.fullName)}</b></div>
            <div class="divide"></div>
            <a href="login.html#/profile">View profile</a>
            <a href="login.html#/orders">My orders</a>
            <button onclick="logout()">Log out</button>
          `}
        </div>
      </div>
    </div>
    <nav class="mobile-nav-menu ${STATE.ui.mobileMenuOpen ? 'open' : ''}" aria-label="Mobile navigation">
      ${navLinks}
    </nav>
  </header>`;
}

function toggleDropdown() { STATE.ui.dropdownOpen = !STATE.ui.dropdownOpen; render(); }
function toggleMobileMenu() { STATE.ui.mobileMenuOpen = !STATE.ui.mobileMenuOpen; STATE.ui.dropdownOpen = false; render(); }
document.addEventListener('click', (event) => {
  const clickedMobileLink = event.target.closest('.mobile-nav-menu a');
  const clickedInsideHeader = event.target.closest('header');
  if (clickedMobileLink && STATE.ui.mobileMenuOpen) { STATE.ui.mobileMenuOpen = false; render(); return; }
  if (!clickedInsideHeader && (STATE.ui.dropdownOpen || STATE.ui.mobileMenuOpen)) {
    STATE.ui.dropdownOpen = false;
    STATE.ui.mobileMenuOpen = false;
    render();
  }
});

function logout() {
  STATE.currentUser = null;
  STATE.cart = [];
  saveSession();
  toast('Logged out.');
  go('#/');
}

function pendingOrders() { return STATE.orders.filter(o => o.status === 'pending'); }
function completedOrders() { return STATE.orders.filter(o => o.status === 'completed'); }

function Footer() {
  return `
  <footer><div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="logo" style="margin-bottom:10px;">
          <img src="products pictures/izoora logo.png" alt="izoora Logo" style="height:32px; width:auto; border-radius:4px; vertical-align:middle; margin-right:8px;">
          
        </div>
        <p style="color:var(--cream-dim);font-size:13.5px;max-width:320px;">Our journey began with high-quality terry towels, but our vision reaches far beyond.</p>
      </div>
      <div><h4>Shop</h4>
        <a href="product.html">All products</a>
        <a href="product.html#/products?cat=candle">Candles</a>
        <a href="product.html#/products?cat=jewelry">Jewelry</a>
      </div>
      <div><h4>Support</h4>
        <a href="contact.html">Contact us</a>
        <a href="about and help.html">FAQ</a>
        <a href="about and help.html">Reviews</a>
      </div>
      <div><h4>Account</h4>
        <a href="login.html#/login">Log in</a>
        <a href="login.html#/signup">Register</a>
      </div>
    </div>
    <div class="foot-bottom"><span>© 2026 izoora. All rights reserved.</span></div>
  </div></footer>`;
}

function getProductImages(prodId) {
  const match = prodId.match(/(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    switch (num) {
      case 1: return ['1.1.jpeg', '1.2.jpeg', '1.3.jpeg', '1.4.jpeg', '1.5.jpeg', '1.6.jpeg', '1.7.jpeg'];
      case 2: return ['2.1.webp', '2.2.webp', '2.3.webp', '2.4.webp', '2.5.webp'];
      case 3: return ['3.1.webp', '3.2.webp', '3.3.webp', '3.4.webp', '3.5.jpg', '3.6.webp'];
      case 4: return ['4.1.jpg', '4.2.webp', '4.3.webp', '4.4.jpg', '4.5.webp', '4.6.webp'];
      case 5: return ['5.1.jpg', '5.2.webp', '5.3.webp', '5.4.webp', '5.5.webp', '5.6.webp'];
      case 6: return ['6.1.webp', '6.2.webp', '6.3.webp', '6.4.webp', '6.5.webp', '6.6.webp'];
      case 7: return ['7.1.jpg', '7.2.jpg', '7.3.jpg', '7.4.jpg', '7.5.jpg', '7.6.jpg'];
      case 8: return ['8.1.jpg', '8.2.jpg', '8.3.jpg', '8.4.jpg'];
      case 9: return ['9.1.jpg', '9.2.webp', '9.3.jpg', '9.4.jpg', '9.5.jpg'];
      case 10: return ['10.1.jpg', '10.2.webp', '10.3.webp', '10.4.webp', '10.5.webp', '10.6.jpg', '10.7.webp'];
      // Baby Cap images are PNG files.  Keep these extensions in sync with the
      // files in `products pictures` so every gallery thumbnail can load.
      case 11: return ['11.1.png', '11.2.png', '11.3.png', '11.4.png'];
    }
  }
  return ['1.1.jpeg', '1.2.jpeg', '1.3.jpeg', '1.4.jpeg', '1.5.jpeg', '1.6.jpeg', '1.7.jpeg'];
}

function ProductCard(p) {
  const low = p.stock > 0 && p.stock <= 5;
  const firstImage = getProductImages(p.id)[0];
  return `<div class="card-product" onclick="go('#/product/${p.id}')">
    <div class="card-thumb" style="background:#fff;">
      <img src="products pictures/${firstImage}" alt="${esc(p.name)}" style="width:100%; height:100%; object-fit:contain;">
    </div>
    <div class="card-body">
      <div class="card-cat">${esc(p.category)}</div>
      <div class="card-title">${esc(p.name)}</div>
      <div class="${p.stock === 0 ? 'stock-flag low' : low ? 'stock-flag low' : 'stock-flag'}">${p.stock === 0 ? 'Out of stock' : low ? p.stock + ' left' : 'In stock'}</div>
      <div class="card-price"><span class="price-usd">${fmtUSD(p.price)}</span><span class="price-pkr mono">${fmtPKR(p.price)}</span></div>
    </div>
  </div>`;
}

/* ============================= DETAIL GALLERY & QTY BOX ============================= */
let currentMainImage = "products pictures/1.1.jpeg";
function changePdpImage(src) {
  currentMainImage = src;
  const mainImg = document.getElementById('mainPdpImage');
  if (mainImg) mainImg.src = src;
  const thumbs = document.querySelectorAll('.pdp-thumb');
  thumbs.forEach(t => {
    t.style.borderColor = t.getAttribute('src') === src ? 'var(--amber)' : 'transparent';
  });
}
window.changePdpImage = changePdpImage;

let pdpQtyVal = 1;
function changeQtyBox(d) {
  pdpQtyVal = Math.max(1, pdpQtyVal + d);
  const el = document.getElementById('pdpQty');
  if (el) el.textContent = pdpQtyVal;
}
window.changeQtyBox = changeQtyBox;

function addToCart(id) {
  const p = STATE.products.find(p => p.id === id);
  if (!p || p.stock === 0) return;
  const qty = pdpQtyVal || 1;
  const existing = STATE.cart.find(c => c.productId === id);
  if (existing) existing.qty += qty; else STATE.cart.push({ productId: id, qty });
  pdpQtyVal = 1;
  saveSession();
  toast(`${p.name} added to bag.`);
  render();
}

function buyNow(id) {
  const p = STATE.products.find(p => p.id === id);
  if (!p || p.stock === 0) return;
  STATE.directCheckout = { productId: id, qty: Math.min(pdpQtyVal || 1, p.stock) };
  saveSession();
  go('#/checkout?buyNow=1');
}
window.buyNow = buyNow;

async function submitProductInquiry(event, productId) {
  event.preventDefault();
  const form = event.target;
  const p = STATE.products.find(x => x.id === productId);
  if (!p) return;

  const button = form.querySelector('[type="submit"]');
  const origText = button.textContent;
  button.disabled = true;
  button.textContent = 'Sending...';

  const formData = new FormData(form);
  const data = {
    "Product Name": p.name,
    "Product Price": fmtUSD(p.price),
    "Customer Email": formData.get('email'),
    "Customer Message/Question": formData.get('message'),
    "Date and Time": new Date().toLocaleString()
  };

  try {
    const res = await fetch('https://formspree.io/f/mkodqyao', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      form.reset();
      showPopup('Thanks for sending your message!', 'We will contact you soon.');
    } else {
      throw new Error('Formspree response not OK');
    }
  } catch (err) {
    console.error(err);
    toast('Error sending message. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = origText;
  }
}

async function submitReview(event, productId) {
  event.preventDefault();
  const form = event.target;
  const p = STATE.products.find(x => x.id === productId);
  if (!p) return;

  const button = form.querySelector('[type="submit"]');
  const origText = button.textContent;
  button.disabled = true;
  button.textContent = 'Sending...';

  const name = document.getElementById('rev_name').value.trim();
  const rating = parseInt(document.getElementById('rev_rating').value);
  const text = document.getElementById('rev_text').value.trim();
  const email = STATE.currentUser ? STATE.currentUser.email : '';

  const data = {
    "Customer Name": name,
    "Customer Email": email || 'N/A',
    "Product Name": p.name,
    "Star Rating": rating,
    "Review Comment": text,
    "Date and Time": new Date().toLocaleString()
  };

  try {
    const res = await fetch('https://formspree.io/f/mkodqyao', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      form.reset();
      showPopup('Thanks for reviewing!', 'Your review has been successfully submitted.');
    } else {
      throw new Error('Formspree response not OK');
    }
  } catch (err) {
    console.error(err);
    toast('Error submitting review. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = origText;
    render();
  }
}

/* ============================= CART FUNCTIONALITY ============================= */
function cartQty(id, d) {
  const c = STATE.cart.find(c => c.productId === id);
  const p = STATE.products.find(p => p.id === id);
  if (!c) return;
  c.qty = Math.max(1, Math.min(p.stock, c.qty + d));
  saveSession();
  render();
}
window.cartQty = cartQty;

function cartRemove(id) {
  STATE.cart = STATE.cart.filter(c => c.productId !== id);
  saveSession();
  render();
}
window.cartRemove = cartRemove;

function goCheckout() { go('#/checkout'); }
window.goCheckout = goCheckout;

/* ============================= CHECKOUT PLACE ORDER ============================= */
async function placeOrder(total, shipping, checkoutItems, subtotal, isDirectPurchase) {
  const fullName = document.getElementById('co_fullName').value.trim();
  const phone = document.getElementById('co_phone').value.trim();
  const email = document.getElementById('co_email').value.trim();
  const address = document.getElementById('co_address').value.trim();
  const landmark = document.getElementById('co_landmark').value.trim();
  const errBox = document.getElementById('coErr');
  if (!fullName || !phone || !email || !address) {
    errBox.style.display = 'block'; errBox.textContent = 'Please fill in your name, phone, email and address before placing the order.'; return;
  }
  if (!validEmail(email)) { errBox.style.display = 'block'; errBox.textContent = 'Please enter a valid email address.'; return; }
  if (!validPhone(phone)) { errBox.style.display = 'block'; errBox.textContent = 'Please enter a valid phone number.'; return; }
  errBox.style.display = 'none';

  const items = checkoutItems || cartItemsFull();
  const orderId = nextId('AG-O', STATE.orders);

  const order = {
    id: orderId,
    customerId: STATE.currentUser ? STATE.currentUser.id : STATE.guestOrderId,
    customerSnapshot: { fullName, phone, email, address, landmark },
    // Keep a complete item snapshot so order history remains accurate even if a
    // product is later edited, hidden, or removed from the catalogue.
    items: items.map(i => ({
      productId: i.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      image: getProductImages(i.id)[0]
    })),
    subtotal: subtotal ?? cartTotal(), shipping, total,
    paymentMethod: 'Cash on Delivery',
    status: 'pending',
    createdAt: Date.now()
  };

  // Submit order details to Formspree
  const formData = {
    "Order ID": orderId,
    "Customer Name": fullName,
    "Customer Email": email,
    "Customer Phone": phone,
    "Delivery Address": address,
    "Nearest Landmark": landmark,
    "Payment Method": "Cash on Delivery",
    "Items": items.map(i => `${i.name} (Qty: ${i.qty}, Price: ${fmtUSD(i.price)})`).join(', '),
    "Shipping Charge": fmtUSD(shipping),
    "Total Order Amount": fmtUSD(total),
    "Submission Type": "Order Placement",
    "Date and Time": new Date().toLocaleString()
  };

  try {
    await fetch('https://formspree.io/f/mkodqyao', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } catch (err) {
    console.error("Formspree checkout submit error: ", err);
  }

  items.forEach(i => { const p = STATE.products.find(p => p.id === i.id); if (p) p.stock = Math.max(0, p.stock - i.qty); });
  STATE.orders.unshift(order);
  if (isDirectPurchase) STATE.directCheckout = null;
  else STATE.cart = [];
  if (STATE.currentUser) Object.assign(STATE.currentUser, { fullName, phone, email, address, landmark });
  saveSession();
  saveUsers(); saveOrders(); saveProducts();

  // Reset checkout fields
  const fullNameEl = document.getElementById('co_fullName');
  const phoneEl = document.getElementById('co_phone');
  const emailEl = document.getElementById('co_email');
  const addressEl = document.getElementById('co_address');
  const landmarkEl = document.getElementById('co_landmark');
  if (fullNameEl) fullNameEl.value = '';
  if (phoneEl) phoneEl.value = '';
  if (emailEl) emailEl.value = '';
  if (addressEl) addressEl.value = '';
  if (landmarkEl) landmarkEl.value = '';

  showPopup('✓ Order Confirmed', 'Your order has been successfully placed.<br><br>Your order will be delivered in 2 days.');

  // Prevent closing the popup during 7 seconds
  const modal = document.getElementById('successModal');
  if (modal) {
    const closeBtn = modal.querySelector('button');
    if (closeBtn) {
      closeBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); };
      closeBtn.style.cursor = 'not-allowed';
      closeBtn.style.opacity = '0.5';
    }
    const backdrop = modal.querySelector('.backdrop');
    if (backdrop) {
      const newBackdrop = backdrop.cloneNode(true);
      backdrop.parentNode.replaceChild(newBackdrop, backdrop);
    }
  }

  go('#/order-success/' + order.id);

  setTimeout(() => {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    }
    go('#/');
  }, 7000);
}
window.placeOrder = placeOrder;

/* ============================= AUTH HANDLERS ============================= */
function doLogin() {
  const email = document.getElementById('li_email').value.trim().toLowerCase();
  const pass = document.getElementById('li_pass').value;
  const err = document.getElementById('loginErr');
  const user = STATE.users.find(u => u.email.toLowerCase() === email && u.password === pass);
  if (!user) { err.style.display = 'block'; err.textContent = 'Incorrect email or password.'; return; }
  STATE.currentUser = user;
  saveSession();
  toast(`Welcome back, ${user.fullName.split(' ')[0]}!`);
  const qs = new URLSearchParams(STATE.route.split('?')[1] || '');
  const next = qs.get('next');
  go(user.isAdmin ? '#/admin' : (next ? decodeURIComponent(next) : '#/'));
}
window.doLogin = doLogin;

function doSignup() {
  const name = document.getElementById('su_name').value.trim();
  const email = document.getElementById('su_email').value.trim().toLowerCase();
  const phone = document.getElementById('su_phone').value.trim();
  const address = document.getElementById('su_address').value.trim();
  const landmark = document.getElementById('su_landmark').value.trim();
  const pass = document.getElementById('su_pass').value;
  const pass2 = document.getElementById('su_pass2').value;
  const err = document.getElementById('suErr');
  if (!name || !email || !phone || !address || !landmark || !pass || !pass2) { err.style.display = 'block'; err.textContent = 'Please fill in every field.'; return; }
  if (!validEmail(email)) { err.style.display = 'block'; err.textContent = 'Please enter a valid email address.'; return; }
  if (!validPhone(phone)) { err.style.display = 'block'; err.textContent = 'Please enter a valid phone number.'; return; }
  if (pass.length < 6) { err.style.display = 'block'; err.textContent = 'Password must be at least 6 characters.'; return; }
  if (pass !== pass2) { err.style.display = 'block'; err.textContent = 'Passwords do not match.'; return; }
  if (STATE.users.some(u => u.email.toLowerCase() === email)) { err.style.display = 'block'; err.textContent = 'An account with this email already exists.'; return; }
  const user = { id: nextId('AG-C', STATE.users), fullName: name, email, phone, address, landmark, password: pass, isAdmin: false, createdAt: Date.now() };
  STATE.users.push(user); saveUsers();
  STATE.currentUser = user;
  saveSession();
  toast(`Welcome, ${name.split(' ')[0]}! Your account has been created.`);
  go('#/');
}
window.doSignup = doSignup;

function saveProfile() {
  const name = document.getElementById('pr_name').value.trim();
  const email = document.getElementById('pr_email').value.trim().toLowerCase();
  const phone = document.getElementById('pr_phone').value.trim();
  const address = document.getElementById('pr_address').value.trim();
  const landmark = document.getElementById('pr_landmark').value.trim();
  const err = document.getElementById('prErr');
  if (!name || !email || !phone || !address || !landmark) { err.style.display = 'block'; err.textContent = 'Please fill in every field.'; return; }
  if (!validEmail(email)) { err.style.display = 'block'; err.textContent = 'Please enter a valid email address.'; return; }
  if (!validPhone(phone)) { err.style.display = 'block'; err.textContent = 'Please enter a valid phone number.'; return; }
  const dupe = STATE.users.find(u => u.email.toLowerCase() === email && u.id !== STATE.currentUser.id);
  if (dupe) { err.style.display = 'block'; err.textContent = 'That email is already used by another account.'; return; }
  Object.assign(STATE.currentUser, { fullName: name, email, phone, address, landmark });
  saveUsers();
  saveSession();
  toast('Profile updated.');
  render();
}
window.saveProfile = saveProfile;

/* ============================= FAQ TOGGLER ============================= */
function toggleFaq(i) {
  STATE.ui['faq' + i] = !STATE.ui['faq' + i];
  render();
}
window.toggleFaq = toggleFaq;

/* ============================= ADMIN PANEL CONTROLS ============================= */
function completeOrder(id) {
  const o = STATE.orders.find(o => o.id === id);
  if (!o) return;
  o.status = 'completed'; o.completedAt = Date.now();
  saveOrders();
  toast(`Order ${id} marked as completed.`);
  render();
}
window.completeOrder = completeOrder;

function openProductModal(id) { STATE.ui.editingProduct = id || 'new'; render(); }
window.openProductModal = openProductModal;
function closeProductModal() { STATE.ui.editingProduct = null; render(); }
window.closeProductModal = closeProductModal;

function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  STATE.products = STATE.products.filter(p => p.id !== id);
  saveProducts(); toast('Product deleted.'); render();
}
window.deleteProduct = deleteProduct;

function saveProductModal(id) {
  const name = document.getElementById('pm_name').value.trim();
  const category = document.getElementById('pm_cat').value;
  const price = parseFloat(document.getElementById('pm_price').value);
  const stock = parseInt(document.getElementById('pm_stock').value);
  const desc = document.getElementById('pm_desc').value.trim();
  const active = document.getElementById('pm_active').checked;
  const err = document.getElementById('pmErr');
  if (!name || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || !desc) { err.style.display = 'block'; err.textContent = 'Please fill in every field with valid values.'; return; }
  if (id) {
    const p = STATE.products.find(p => p.id === id);
    Object.assign(p, { name, category, price, stock, desc, active });
  } else {
    STATE.products.push({ id: nextId('AG-P', STATE.products), name, category, price, stock, desc, active, rating: 4.5 });
  }
  saveProducts();
  toast(id ? 'Product updated.' : 'Product added.');
  STATE.ui.editingProduct = null;
  render();
}
window.saveProductModal = saveProductModal;

/* ============================= RENDERING LOGIC ============================= */
function render(preserveFocus) {
  const page = getActivePage();
  const path = STATE.route.split('?')[0];
  const qs = new URLSearchParams(STATE.route.split('?')[1] || '');

  // 1. Render Header and Footer wrappers
  const headerWrapper = document.getElementById('headerWrapper');
  if (headerWrapper) headerWrapper.innerHTML = Header();

  const footerWrapper = document.getElementById('footerWrapper');
  if (footerWrapper) {
    if (page === 'admin') {
      footerWrapper.innerHTML = '';
    } else {
      footerWrapper.innerHTML = Footer();
    }
  }

  // Preserve input focus if needed
  let focusId = null, selStart = null, selEnd = null;
  if (preserveFocus && document.activeElement && document.activeElement.id) {
    focusId = document.activeElement.id;
    try { selStart = document.activeElement.selectionStart; selEnd = document.activeElement.selectionEnd; } catch (e) { }
  }

  // Get references to elements
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  // Handle common dynamic view overriding (like Cart view #/cart)
  if (path === '#/cart') {
    const cartTemplate = document.getElementById('cartTemplate');
    if (cartTemplate) {
      mainContent.innerHTML = cartTemplate.innerHTML;
      const items = cartItemsFull();
      const emptyState = document.getElementById('cartEmptyState');
      const cartContent = document.getElementById('cartContent');
      const itemsList = document.getElementById('cartItemsList');

      if (items.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';

        if (itemsList) {
          itemsList.innerHTML = items.map(i => {
            const firstImage = getProductImages(i.id)[0];
            return `
            <div class="cart-line">
              <div class="thumb-mini" style="background:#fff;"><img src="products pictures/${firstImage}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;"></div>
              <div style="flex:1;">
                <div style="font-weight:600;">${esc(i.name)}</div>
                <div style="font-size:12.5px;color:var(--cream-dim);">${fmtUSD(i.price)} · ${fmtPKR(i.price)}</div>
              </div>
              <div class="qty-box">
                <button onclick="cartQty('${i.id}',-1)">−</button><span>${i.qty}</span><button onclick="cartQty('${i.id}',1)">+</button>
              </div>
              <div style="width:80px;text-align:right;font-weight:600;">${fmtUSD(i.price * i.qty)}</div>
              <div style="cursor:pointer;color:var(--cream-dim);padding-left:8px;" onclick="cartRemove('${i.id}')">✕</div>
            </div>`;
          }).join('');
        }

        const totalUSD = document.getElementById('cartTotalUSD');
        const totalPKR = document.getElementById('cartTotalPKR');
        if (totalUSD) totalUSD.textContent = fmtUSD(cartTotal());
        if (totalPKR) totalPKR.textContent = `(${fmtPKR(cartTotal())})`;
      }
    }
    return;
  }

  // 2. Page Specific Rendering
  if (page === 'home') {
    // Stat counters
    const statProds = document.getElementById('statProductsCount');
    const statCusts = document.getElementById('statClientsCount');
    if (statProds) statProds.textContent = STATE.products.filter(p => p.active).length;
    if (statCusts) statCusts.textContent = STATE.users.filter(u => !u.isAdmin).length;

    // Infinite Carousel
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
      const carouselProducts = STATE.products.filter(p => p.active).slice(0, 6);
      if (carouselProducts.length >= 6) {
        const cardsHTML = carouselProducts.map(ProductCard).join('');
        carouselTrack.innerHTML = cardsHTML + cardsHTML;
      } else {
        const fallbackProducts = SEED_PRODUCTS.slice(0, 6).map((p, i) => ({ ...p, id: 'AG-P-' + String(i + 1).padStart(4, '0') }));
        const cardsHTML = fallbackProducts.map(ProductCard).join('');
        carouselTrack.innerHTML = cardsHTML + cardsHTML;
      }
    }
  }

  else if (page === 'product') {
    const listSection = document.getElementById('productsListView');
    const detailSection = document.getElementById('productDetailView');

    if (path.startsWith('#/product/')) {
      // PDP View
      if (listSection) listSection.style.display = 'none';
      if (detailSection) detailSection.style.display = 'block';

      const prodId = path.replace('#/product/', '');
      const p = STATE.products.find(x => x.id === prodId);
      if (p) {
        // Reset currentMainImage to the product's first image if the current main image is not from this product
        const imgs = getProductImages(p.id);
        const hasImg = imgs.some(img => currentMainImage.endsWith(img));
        if (!hasImg) {
          currentMainImage = 'products pictures/' + imgs[0];
        }

        // Gallery
        const mainPdpImage = document.getElementById('mainPdpImage');
        if (mainPdpImage) mainPdpImage.src = currentMainImage;

        const pdpThumbs = document.getElementById('pdpThumbnails');
        if (pdpThumbs) {
          pdpThumbs.innerHTML = imgs.map(img => `
            <img src="products pictures/${img}" class="pdp-thumb" onclick="changePdpImage('products pictures/${img}')" style="width:80px; height:80px; object-fit:cover; cursor:pointer; border-radius:8px; border:2px solid ${currentMainImage === 'products pictures/' + img ? 'var(--amber)' : 'transparent'};">
          `).join('');
        }

        // Details
        const pdpId = document.getElementById('pdpId');
        const pdpName = document.getElementById('pdpName');
        const pdpRating = document.getElementById('pdpRating');
        const pdpPriceUSD = document.getElementById('pdpPriceUSD');
        const pdpPricePKR = document.getElementById('pdpPricePKR');
        const pdpStockFlag = document.getElementById('pdpStockFlag');
        const pdpQty = document.getElementById('pdpQty');
        const btnAddToBag = document.getElementById('btnAddToBag');
        const btnBuyNow = document.getElementById('btnBuyNow');

        if (pdpId) pdpId.textContent = p.id;
        if (pdpName) pdpName.textContent = p.name;
        if (pdpRating) pdpRating.innerHTML = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating)) + ` <span style="color:var(--cream-dim);font-size:13px;">${p.rating}/5</span>`;
        if (pdpPriceUSD) pdpPriceUSD.textContent = fmtUSD(p.price);
        if (pdpPricePKR) pdpPricePKR.textContent = fmtPKR(p.price);

        if (pdpStockFlag) {
          pdpStockFlag.className = p.stock === 0 ? 'stock-flag low' : p.stock <= 5 ? 'stock-flag low' : 'stock-flag';
          pdpStockFlag.textContent = p.stock === 0 ? 'Out of stock' : p.stock + ' in stock';
        }
        if (pdpQty) pdpQty.textContent = pdpQtyVal;
        if (btnAddToBag) {
          btnAddToBag.disabled = p.stock === 0;
          btnAddToBag.onclick = () => addToCart(p.id);
        }
        if (btnBuyNow) {
          btnBuyNow.disabled = p.stock === 0;
          btnBuyNow.onclick = () => buyNow(p.id);
        }

        // Tabs
        const tabDesc = document.getElementById('tab_desc');
        const tabShip = document.getElementById('tab_ship');
        const tabRevs = document.getElementById('tab_revs');
        const pdpTabText = document.getElementById('pdpTabText');

        if (tabDesc) {
          tabDesc.className = STATE.ui.pdpTab === 'description' ? 'active' : '';
          tabDesc.onclick = () => { STATE.ui.pdpTab = 'description'; render(); };
        }
        if (tabShip) {
          tabShip.className = STATE.ui.pdpTab === 'shipping' ? 'active' : '';
          tabShip.onclick = () => { STATE.ui.pdpTab = 'shipping'; render(); };
        }
        if (tabRevs) {
          tabRevs.className = STATE.ui.pdpTab === 'reviews' ? 'active' : '';
          tabRevs.onclick = () => { STATE.ui.pdpTab = 'reviews'; render(); };
        }

        if (pdpTabText) {
          pdpTabText.textContent = STATE.ui.pdpTab === 'description' ? p.desc :
            STATE.ui.pdpTab === 'shipping' ? 'Ships worldwide in 3–10 business days. Free returns within 30 days of delivery. Duties/taxes may apply depending on your destination country.' :
              'Loved for its warm tone and long-lasting quality — see reviews below.';
        }

        // Inquiry form
        const inquiryForm = document.getElementById('productInquiryForm');
        if (inquiryForm) {
          // Clone to prevent duplicate listeners
          const newForm = inquiryForm.cloneNode(true);
          inquiryForm.parentNode.replaceChild(newForm, inquiryForm);
          newForm.onsubmit = (e) => submitProductInquiry(e, p.id);

          // Do not pre-fill customer information
        }

        // Reviews List
        const reviewsList = document.getElementById('reviewsList');
        if (reviewsList) {
          reviewsList.innerHTML = '';
        }

        // Write Review Form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
          reviewForm.onsubmit = (e) => {
            e.preventDefault();
            submitReview(e, p.id);
          };
        }

        // Related pieces
        const related = STATE.products.filter(x => x.category === p.category && x.id !== p.id && x.active).slice(0, 4);
        const relatedSection = document.getElementById('relatedSection');
        const relatedGrid = document.getElementById('relatedProductsGrid');

        if (relatedSection) {
          if (related.length > 0) {
            relatedSection.style.display = 'block';
            if (relatedGrid) relatedGrid.innerHTML = related.map(ProductCard).join('');
          } else {
            relatedSection.style.display = 'none';
          }
        }
      }
    } else {
      // Products Listing View
      if (listSection) listSection.style.display = 'block';
      if (detailSection) detailSection.style.display = 'none';

      const catParam = qs.get('cat');
      if (catParam) STATE.ui.productFilter = catParam;

      let list = STATE.products.filter(p => p.active);
      if (STATE.ui.productFilter === 'towels') {
        list = list.filter(p =>
          p.category.toLowerCase() === 'towels' ||
          p.category.toLowerCase() === 'towel' ||
          p.name.toLowerCase().includes('towel') ||
          p.desc.toLowerCase().includes('towel')
        );
      } else if (STATE.ui.productFilter === 'bathrobes') {
        list = list.filter(p =>
          p.category.toLowerCase() === 'bathrobes' ||
          p.category.toLowerCase() === 'bathrobe' ||
          p.category.toLowerCase() === 'robe' ||
          p.name.toLowerCase().includes('bathrobe') ||
          p.name.toLowerCase().includes('bath robe') ||
          p.name.toLowerCase().includes('robe') ||
          p.desc.toLowerCase().includes('bathrobe') ||
          p.desc.toLowerCase().includes('bath robe') ||
          p.desc.toLowerCase().includes('robe')
        );
      } else if (STATE.ui.productFilter === 'baby cap') {
        list = list.filter(p =>
          p.category.toLowerCase() === 'baby cap' ||
          p.category.toLowerCase() === 'babycap' ||
          p.name.toLowerCase().includes('baby cap') ||
          p.name.toLowerCase().includes('babycap') ||
          p.desc.toLowerCase().includes('baby cap') ||
          p.desc.toLowerCase().includes('babycap')
        );
      } else if (STATE.ui.productFilter !== 'all') {
        list = list.filter(p => p.category === STATE.ui.productFilter);
      }

      if (STATE.ui.productSearch) {
        list = list.filter(p => p.name.toLowerCase().includes(STATE.ui.productSearch.toLowerCase()));
      }

      const countText = document.getElementById('productsCountText');
      if (countText) countText.textContent = `${list.length} item${list.length === 1 ? '' : 's'} found`;

      // Filter chips
      const chipsContainer = document.getElementById('categoryChips');
      if (chipsContainer) {
        const cats = ['all', 'towels', 'bathrobes', 'baby cap'];
        const catLabels = { 'all': 'All', 'towels': 'Towels', 'bathrobes': 'Bathrobes', 'baby cap': 'Baby Cap' };
        chipsContainer.innerHTML = cats.map(c => `
          <div class="chip ${STATE.ui.productFilter === c ? 'active' : ''}" onclick="STATE.ui.productFilter='${c}';STATE.route='#/products';location.hash='#/products';render()">${catLabels[c] || c}</div>
        `).join('');
      }

      // Search input event binding
      const searchInput = document.getElementById('pSearchInput');
      if (searchInput) {
        searchInput.value = STATE.ui.productSearch;
        searchInput.oninput = (e) => {
          STATE.ui.productSearch = e.target.value;
          render(true);
        };
      }

      // Grid populate
      const productsGrid = document.getElementById('productsGrid');
      const emptyState = document.getElementById('productsEmptyState');
      if (productsGrid) {
        if (list.length > 0) {
          productsGrid.innerHTML = list.map(ProductCard).join('');
          productsGrid.style.display = 'grid';
          if (emptyState) emptyState.style.display = 'none';
        } else {
          productsGrid.innerHTML = '';
          productsGrid.style.display = 'none';
          if (emptyState) {
            emptyState.style.display = 'block';
            if (STATE.ui.productFilter === 'bathrobes' || STATE.ui.productFilter === 'baby cap') {
              emptyState.innerHTML = `<div class="drop"></div><h3>This product is not available.</h3>`;
            } else {
              emptyState.innerHTML = `<div class="drop"></div><h3>Product not available.</h3>`;
            }
          }
        }
      }
    }
  }

  else if (page === 'info') {
    // FAQ render
    const faqContainer = document.getElementById('faqContainer');
    if (faqContainer) {
      const FAQS = [
        { q: "How long does shipping take?", a: "Domestic orders arrive in 3-5 business days; international orders typically take 7-10 business days depending on customs." },
        { q: "Do you ship worldwide?", a: "Yes — we ship to most countries. Prices are shown in both USD and PKR for convenience at checkout." },
        { q: "What payment methods do you accept?", a: "Cash on Delivery is currently available at checkout." },
        { q: "What's your return policy?", a: "Unused items in original packaging can be returned within 30 days of delivery for a full refund." },
        { q: "How do I track my order?", a: "Log in and visit \"My orders\" from the profile menu to see live status for every order you've placed." }
      ];
      faqContainer.innerHTML = FAQS.map((f, i) => `
        <div class="faq-item">
          <div class="faq-q" onclick="toggleFaq(${i})">${f.q}<span>${STATE.ui['faq' + i] ? '−' : '+'}</span></div>
          <div class="faq-a ${STATE.ui['faq' + i] ? 'open' : ''}">${f.a}</div>
        </div>`).join('');
    }

    // Site reviews render
    const infoReviewsGrid = document.getElementById('infoReviewsGrid');
    if (infoReviewsGrid) {
      const SITE_REVIEWS = [
        { name: "Amina R.", rating: 5, text: "The Baltic Amber Pendant is even more beautiful in person — genuinely unique stone and fast worldwide shipping." },
        { name: "Marcus T.", rating: 5, text: "Ordered the Table Lamp for my study, the glow is exactly the warm amber tone I wanted." },
        { name: "Sana K.", rating: 4, text: "Lovely candles, long burn time. Would love to see a bigger size option in future." },
        { name: "Diego F.", rating: 5, text: "Customer support was quick to answer my questions before I ordered. Very smooth checkout experience." }
      ];
      infoReviewsGrid.innerHTML = SITE_REVIEWS.map(r => `<div class="review-card">
        <div class="review-head"><b>${esc(r.name)}</b><span class="star">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></div>
        <p style="color:var(--cream-dim);font-size:14px;margin:0;">${esc(r.text)}</p>
      </div>`).join('');
    }
  }

  else if (page === 'login') {
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const profileView = document.getElementById('profileView');
    const ordersView = document.getElementById('ordersView');

    if (loginView) loginView.style.display = 'none';
    if (signupView) signupView.style.display = 'none';
    if (profileView) profileView.style.display = 'none';
    if (ordersView) ordersView.style.display = 'none';

    if (path === '#/signup') {
      if (signupView) signupView.style.display = 'block';
    } else if (path === '#/profile') {
      if (!STATE.currentUser) { go('#/login?next=%23%2Fprofile'); return; }
      if (profileView) {
        profileView.style.display = 'block';
        const u = STATE.currentUser;
        const profileUserId = document.getElementById('profileUserId');
        const prName = document.getElementById('pr_name');
        const prEmail = document.getElementById('pr_email');
        const prPhone = document.getElementById('pr_phone');
        const prAddress = document.getElementById('pr_address');
        const prLandmark = document.getElementById('pr_landmark');

        if (profileUserId) profileUserId.textContent = u.id;
        if (prName) prName.value = u.fullName || '';
        if (prEmail) prEmail.value = u.email || '';
        if (prPhone) prPhone.value = u.phone || '';
        if (prAddress) prAddress.value = u.address || '';
        if (prLandmark) prLandmark.value = u.landmark || '';
      }
    } else if (path === '#/orders') {
      if (ordersView) {
        ordersView.style.display = 'block';
        const mine = STATE.orders.filter(o => {
          const belongsToViewer = STATE.currentUser
            ? o.customerId === STATE.currentUser.id
            : o.customerId === STATE.guestOrderId || o.customerId === null;
          return belongsToViewer && o.status !== 'cancelled';
        });
        const emptyState = document.getElementById('myOrdersEmptyState');
        const panel = document.getElementById('myOrdersPanel');
        const tbody = document.getElementById('myOrdersTableBody');

        if (mine.length === 0) {
          if (emptyState) emptyState.style.display = 'block';
          if (panel) panel.style.display = 'none';
        } else {
          if (emptyState) emptyState.style.display = 'none';
          if (panel) panel.style.display = 'block';
          if (tbody) {
            tbody.innerHTML = mine.map(o => {
              const canCancel = o.status === 'pending';
              const cancelBtn = canCancel ? `<button class="btn btn-danger btn-sm" onclick="openCancelModal('${o.id}')">Cancel Order</button>` : '';

              const customer = o.customerSnapshot || {};
              const itemImages = o.items.map(i => {
                // Older saved orders may not have an image snapshot, so keep a
                // backwards-compatible lookup for them.
                const firstImage = i.image || getProductImages(i.productId)[0];
                return `<div style="height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                  <img src="products pictures/${firstImage}" alt="${esc(i.name)}" style="width:36px; height:36px; object-fit:cover; border-radius:4px;">
                </div>`;
              }).join('');

              const itemNames = o.items.map(i => `<div style="height: 40px; display: flex; align-items: center; margin-bottom: 4px; font-weight: 500;">${esc(i.name)}</div>`).join('');
              const itemQtys = o.items.map(i => `<div style="height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">${i.qty}</div>`).join('');
              const itemPrices = o.items.map(i => `<div style="height: 40px; display: flex; align-items: center; margin-bottom: 4px;">${fmtUSD(i.price)}</div>`).join('');

              return `<tr>
                <td class="idtag" style="vertical-align: middle;">${o.id}</td>
                <td>${itemImages}</td>
                <td>${itemNames}</td>
                <td style="text-align: center;">${itemQtys}</td>
                <td>${itemPrices}</td>
                <td style="vertical-align: middle; font-weight: 600;">${fmtUSD(o.total)}</td>
                <td style="vertical-align: middle;">${new Date(o.createdAt).toLocaleDateString()}</td>
                <td style="vertical-align: middle; max-width: 190px; word-break: break-word;"><strong>${esc(customer.fullName || '')}</strong><br><small style="color:var(--cream-dim)">${esc(customer.email || '')}<br>${esc(customer.phone || '')}<br>${esc(customer.address || '')}${customer.landmark ? `<br>Landmark: ${esc(customer.landmark)}` : ''}</small></td>
                <td style="vertical-align: middle;"><span class="tag-status ${o.status}">${o.status}</span></td>
                <td style="vertical-align: middle;">${cancelBtn}</td>
              </tr>`;
            }).join('');
          }
        }
      }
    } else {
      if (loginView) loginView.style.display = 'block';
    }
  }

  else if (page === 'checkout') {
    const isDirectPurchase = qs.get('buyNow') === '1';
    const directItem = STATE.directCheckout && STATE.products.find(p => p.id === STATE.directCheckout.productId);
    const items = isDirectPurchase && directItem ? [{ ...directItem, qty: Math.min(STATE.directCheckout.qty, directItem.stock) }] : cartItemsFull();
    if (items.length === 0) {
      mainContent.innerHTML = `<div class="wrap" style="padding:60px 0"><div class="empty-state"><h3>Your bag is empty</h3><button class="btn btn-primary" style="margin-top:14px;" onclick="go('#/products')">Shop now</button></div></div>`;
      return;
    }
    const u = STATE.currentUser;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 75 ? 0 : 6.5;
    const total = subtotal + shipping;

    // Fill inputs
    const fullName = document.getElementById('co_fullName');
    const phone = document.getElementById('co_phone');
    const email = document.getElementById('co_email');
    const address = document.getElementById('co_address');
    const landmark = document.getElementById('co_landmark');

    if (fullName) fullName.value = u ? u.fullName || '' : '';
    if (phone) phone.value = u ? u.phone || '' : '';
    if (email) email.value = u ? u.email || '' : '';
    if (address) address.value = u ? u.address || '' : '';
    if (landmark) landmark.value = u ? u.landmark || '' : '';

    // Fill summary
    const summaryItems = document.getElementById('checkoutSummaryItems');
    if (summaryItems) {
      summaryItems.innerHTML = items.map(i => `<div class="summary-row"><span>${esc(i.name)} × ${i.qty}</span><span>${fmtUSD(i.price * i.qty)}</span></div>`).join('');
    }
    const checkShipping = document.getElementById('checkoutShipping');
    if (checkShipping) checkShipping.textContent = shipping === 0 ? 'Free' : fmtUSD(shipping);

    const checkTotal = document.getElementById('checkoutTotal');
    if (checkTotal) checkTotal.textContent = fmtUSD(total);

    const checkTotalPKR = document.getElementById('checkoutTotalPKR');
    if (checkTotalPKR) checkTotalPKR.textContent = fmtPKR(total);

    const btnPlaceOrder = document.getElementById('btnPlaceOrder');
    if (btnPlaceOrder) {
      btnPlaceOrder.onclick = () => placeOrder(total, shipping, items, subtotal, isDirectPurchase);
    }
  }

  else if (page === 'order-success') {
    const orderId = path.replace('#/order-success/', '');
    const o = STATE.orders.find(x => x.id === orderId);
    if (!o) {
      mainContent.innerHTML = `<div class="wrap" style="padding:60px 0"><div class="empty-state"><h3>Order not found</h3></div></div>`;
      return;
    }
    const successOrderId = document.getElementById('successOrderId');
    if (successOrderId) successOrderId.textContent = o.id;
  }

  else if (page === 'admin') {
    const errorGate = document.getElementById('adminAuthGateError');
    const shell = document.getElementById('adminShell');
    const isAdminUser = STATE.currentUser && STATE.currentUser.isAdmin;

    if (!isAdminUser) {
      if (errorGate) errorGate.style.display = 'block';
      if (shell) shell.style.display = 'none';
      return;
    }

    if (errorGate) errorGate.style.display = 'none';
    if (shell) shell.style.display = 'flex';

    // Sidebar render
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
      const item = (href, label, icon, count) => `<a href="${href}" class="${path === href ? 'active' : ''}">${icon} ${label} ${count ? `<span class="idtag" style="margin-left:auto;">${count}</span>` : ''}</a>`;
      sidebar.innerHTML = `
        <div class="sidelabel">Manage</div>
        ${item('#/admin', 'Dashboard', '📊')}
        ${item('#/admin/clients', 'Registered clients', '👥')}
        ${item('#/admin/pending', 'Pending orders', '⏳', pendingOrders().length)}
        ${item('#/admin/completed', 'Completed orders', '✅')}
        ${item('#/admin/products', 'Products', '🏺')}
      `;
    }

    // Toggle admin subviews
    const subviews = document.querySelectorAll('.admin-subview');
    subviews.forEach(v => v.style.display = 'none');

    // Admin Search Helpers
    const AdminSearchBar = (placeholder) => `<input class="search-input" style="max-width:320px;" placeholder="${placeholder}" value="${esc(STATE.ui.adminSearch)}" oninput="STATE.ui.adminSearch=this.value;render(true)">`;
    const OrderRow = (o, showAction) => `<tr>
      <td class="idtag">${o.id}</td>
      <td>
        <div style="font-weight:600;">${esc(o.customerSnapshot.fullName)}</div>
        <div style="font-size:12px;color:var(--cream-dim);">${esc(o.customerSnapshot.email)} · ${esc(o.customerSnapshot.phone)}</div>
        <div style="font-size:12px;color:var(--cream-dim);">${esc(o.customerSnapshot.address)} (${esc(o.customerSnapshot.landmark)})</div>
      </td>
      <td>${o.items.map(i => `${esc(i.name)} ×${i.qty}`).join('<br>')}</td>
      <td>${fmtUSD(o.total)}<br><span class="mono" style="font-size:11.5px;color:var(--cream-dim);">${fmtPKR(o.total)}</span></td>
      <td style="text-transform:capitalize;">${o.paymentMethod}</td>
      <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      ${showAction ? `<td><button class="btn btn-primary btn-sm" onclick="completeOrder('${o.id}')">Mark completed</button></td>` : `<td><span class="tag-status completed">Completed</span></td>`}
    </tr>`;

    if (path === '#/admin/clients') {
      const clientsView = document.getElementById('adminClientsView');
      if (clientsView) {
        clientsView.style.display = 'block';
        const searchWrapper = document.getElementById('clientsSearchWrapper');
        if (searchWrapper) searchWrapper.innerHTML = AdminSearchBar('Search by name, email, phone, ID…');

        let list = STATE.users.filter(u => !u.isAdmin);
        if (STATE.ui.adminSearch) list = list.filter(u => (u.fullName + u.email + u.phone + u.id).toLowerCase().includes(STATE.ui.adminSearch.toLowerCase()));

        const listContainer = document.getElementById('clientsListContainer');
        if (listContainer) {
          listContainer.innerHTML = list.length ? `<table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Landmark</th><th>Joined</th></tr></thead><tbody>
            ${list.map(u => `<tr><td class="idtag">${u.id}</td><td>${esc(u.fullName)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>${esc(u.address)}</td><td>${esc(u.landmark)}</td><td>${new Date(u.createdAt).toLocaleDateString()}</td></tr>`).join('')}
          </tbody></table>` : `<div class="empty-state">No clients match your search.</div>`;
        }
      }
    }

    else if (path === '#/admin/pending') {
      const pendingView = document.getElementById('adminPendingView');
      if (pendingView) {
        pendingView.style.display = 'block';
        const searchWrapper = document.getElementById('pendingSearchWrapper');
        if (searchWrapper) searchWrapper.innerHTML = AdminSearchBar('Search by order ID, customer…');

        let list = pendingOrders();
        if (STATE.ui.adminSearch) list = list.filter(o => (o.id + o.customerSnapshot.fullName + o.customerSnapshot.email).toLowerCase().includes(STATE.ui.adminSearch.toLowerCase()));

        const listContainer = document.getElementById('pendingListContainer');
        if (listContainer) {
          listContainer.innerHTML = list.length ? `<table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Placed</th><th></th></tr></thead><tbody>
            ${list.map(o => OrderRow(o, true)).join('')}
          </tbody></table>` : `<div class="empty-state"><div class="drop"></div><h3>No pending orders</h3></div>`;
        }
      }
    }

    else if (path === '#/admin/completed') {
      const completedView = document.getElementById('adminCompletedView');
      if (completedView) {
        completedView.style.display = 'block';
        const searchWrapper = document.getElementById('completedSearchWrapper');
        if (searchWrapper) searchWrapper.innerHTML = AdminSearchBar('Search by order ID, customer…');

        let list = completedOrders();
        if (STATE.ui.adminSearch) list = list.filter(o => (o.id + o.customerSnapshot.fullName + o.customerSnapshot.email).toLowerCase().includes(STATE.ui.adminSearch.toLowerCase()));

        const listContainer = document.getElementById('completedListContainer');
        if (listContainer) {
          listContainer.innerHTML = list.length ? `<table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Placed</th><th></th></tr></thead><tbody>
            ${list.map(o => OrderRow(o, false)).join('')}
          </tbody></table>` : `<div class="empty-state">No completed orders yet.</div>`;
        }
      }
    }

    else if (path === '#/admin/products') {
      const productsView = document.getElementById('adminProductsView');
      if (productsView) {
        productsView.style.display = 'block';
        const headerAction = document.getElementById('productsHeaderAction');
        if (headerAction) {
          headerAction.innerHTML = `${AdminSearchBar('Search products…')}<button class="btn btn-primary btn-sm" onclick="openProductModal()">+ Add product</button>`;
        }

        let list = STATE.products;
        if (STATE.ui.adminSearch) list = list.filter(p => (p.name + p.category + p.id).toLowerCase().includes(STATE.ui.adminSearch.toLowerCase()));

        const listContainer = document.getElementById('adminProductsListContainer');
        if (listContainer) {
          listContainer.innerHTML = `<table><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>
            ${list.map(p => `<tr>
              <td class="idtag">${p.id}</td>
              <td>${esc(p.name)}</td>
              <td style="text-transform:capitalize;">${p.category}</td>
              <td>${fmtUSD(p.price)}<br><span class="mono" style="font-size:11px;color:var(--cream-dim);">${fmtPKR(p.price)}</span></td>
              <td>${p.stock}</td>
              <td><span class="tag-status ${p.active ? 'completed' : 'pending'}">${p.active ? 'Live' : 'Hidden'}</span></td>
              <td style="white-space:nowrap;">
                <button class="btn btn-ghost btn-sm" onclick="openProductModal('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
              </td>
            </tr>`).join('')}
          </tbody></table>`;
        }
      }
    }

    else {
      // Dashboard View
      const dashboardView = document.getElementById('adminDashboardView');
      if (dashboardView) {
        dashboardView.style.display = 'block';

        const revenue = completedOrders().reduce((s, o) => s + o.total, 0);
        const liveProducts = STATE.products.filter(p => p.active).length;
        const lowStock = STATE.products.filter(p => p.active && p.stock > 0 && p.stock <= 5).length;
        const topProduct = (() => {
          const counts = {};
          STATE.orders.forEach(o => o.items.forEach(i => counts[i.name] = (counts[i.name] || 0) + i.qty));
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          return sorted[0] ? sorted[0][0] : '—';
        })();
        const recent = STATE.orders.slice(0, 5);
        const maxDay = 7;
        const days = [...Array(maxDay)].map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (maxDay - 1 - i));
          const key = d.toDateString();
          const total = STATE.orders.filter(o => new Date(o.createdAt).toDateString() === key).reduce((s, o) => s + o.total, 0);
          return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), total };
        });
        const maxVal = Math.max(1, ...days.map(d => d.total));

        // KPIs
        const kpiGrid = document.getElementById('kpiGrid');
        if (kpiGrid) {
          kpiGrid.innerHTML = `
            <div class="kpi-card"><div class="lbl">Products live</div><div class="val">${liveProducts}</div><div class="sub">${lowStock} low on stock</div></div>
            <div class="kpi-card"><div class="lbl">Pending orders</div><div class="val">${pendingOrders().length}</div></div>
            <div class="kpi-card"><div class="lbl">Completed orders</div><div class="val">${completedOrders().length}</div></div>
            <div class="kpi-card"><div class="lbl">Total orders</div><div class="val">${STATE.orders.length}</div></div>
            <div class="kpi-card"><div class="lbl">Registered clients</div><div class="val">${STATE.users.filter(u => !u.isAdmin).length}</div></div>
            <div class="kpi-card"><div class="lbl">Total revenue (completed)</div><div class="val">${fmtUSD(revenue)}</div><div class="sub mono" style="color:var(--cream-dim);">${fmtPKR(revenue)}</div></div>
          `;
        }

        // Chart
        const chart = document.getElementById('revenueChart');
        if (chart) {
          chart.innerHTML = days.map(d => `<div style="flex:1;text-align:center;">
            <div style="height:${100 * d.total / maxVal}px;background:linear-gradient(180deg,var(--amber-bright),var(--amber-deep));border-radius:6px 6px 0 0;min-height:4px;"></div>
            <div style="font-size:11px;color:var(--cream-dim);margin-top:6px;">${d.label}</div>
          </div>`).join('');
        }

        // Highlights
        const highlights = document.getElementById('highlightsPanel');
        if (highlights) {
          highlights.innerHTML = `
            <h3 style="margin-bottom:12px;">Store highlights</h3>
            <div class="summary-row"><span>Best-selling item</span><span style="color:var(--cream);">${esc(topProduct)}</span></div>
            <div class="summary-row"><span>Average order value</span><span style="color:var(--cream);">${STATE.orders.length ? fmtUSD(STATE.orders.reduce((s, o) => s + o.total, 0) / STATE.orders.length) : '—'}</span></div>
            <div class="summary-row"><span>Low-stock items</span><span style="color:var(--cream);">${lowStock}</span></div>
            <div class="summary-row"><span>Out-of-stock items</span><span style="color:var(--cream);">${STATE.products.filter(p => p.stock === 0).length}</span></div>
          `;
        }

        // Recent Orders
        const recentCont = document.getElementById('recentOrdersContainer');
        if (recentCont) {
          recentCont.innerHTML = recent.length ? `<table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead><tbody>
            ${recent.map(o => `<tr><td class="idtag">${o.id}</td><td>${esc(o.customerSnapshot.fullName)}</td><td>${fmtUSD(o.total)}</td><td><span class="tag-status ${o.status}">${o.status}</span></td><td>${new Date(o.createdAt).toLocaleDateString()}</td></tr>`).join('')}
          </tbody></table>` : `<p style="color:var(--cream-dim);">No orders yet.</p>`;
        }
      }
    }

    // Modal
    const modalEl = document.getElementById('adminProductModal');
    if (modalEl) {
      const id = STATE.ui.editingProduct;
      if (!id) {
        modalEl.style.display = 'none';
      } else {
        modalEl.style.display = 'flex';
        const isNew = id === 'new';
        const p = isNew ? { name: '', category: 'candle', price: '', stock: '', desc: '', active: true } : STATE.products.find(p => p.id === id);

        const pmTitle = document.getElementById('pmTitle');
        const pmName = document.getElementById('pm_name');
        const pmCat = document.getElementById('pm_cat');
        const pmPrice = document.getElementById('pm_price');
        const pmStock = document.getElementById('pm_stock');
        const pmDesc = document.getElementById('pm_desc');
        const pmActive = document.getElementById('pm_active');
        const btnSave = document.getElementById('btnSaveProduct');
        const pmErr = document.getElementById('pmErr');

        if (pmTitle) pmTitle.textContent = isNew ? 'Add product' : 'Edit product';
        if (pmErr) pmErr.style.display = 'none';
        if (pmName) pmName.value = p.name || '';
        if (pmCat) pmCat.value = p.category || 'candle';
        if (pmPrice) pmPrice.value = p.price || '';
        if (pmStock) pmStock.value = p.stock || '';
        if (pmDesc) pmDesc.value = p.desc || '';
        if (pmActive) pmActive.checked = !!p.active;

        if (btnSave) {
          btnSave.textContent = isNew ? 'Add product' : 'Save changes';
          btnSave.onclick = () => saveProductModal(isNew ? '' : id);
        }
      }
    }
  }

  // Restore input focus
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus(); try { if (selStart !== null) el.setSelectionRange(selStart, selEnd); } catch (e) { } }
  }
}
window.render = render;

/* ============================= CONTACT FORM HANDLERS ============================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Do not pre-fill customer information

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const origText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const res = await fetch('https://formspree.io/f/mkodqyao', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        form.reset();
        showPopup('✓ Thanks for sending your message!', 'We will contact you soon.');
      } else {
        throw new Error('Formspree response not OK');
      }
    } catch (err) {
      console.error(err);
      toast('Error sending message. Please try again.');
    } finally {
      button.disabled = false;
      button.textContent = origText;
    }
  });
}

// Expose globally for page scripts
window.AMBRA = {
  currentUser: () => STATE.currentUser,
  toast: (msg, type) => toast(msg),
  showPopup: (title, message) => showPopup(title, message)
};

// Cancel Order Modal functions
function openCancelModal(orderId) {
  let modal = document.getElementById('cancelOrderModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'cancelOrderModal';
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';

  modal.innerHTML = `
    <div class="modal-box" style="max-width: 400px;">
      <span class="modal-close" onclick="document.getElementById('cancelOrderModal').remove()">✕</span>
      <h3>Cancel Order</h3>
      <p style="font-size: 13.5px; color: var(--cream-dim); margin-bottom: 16px;">Please let us know why you want to cancel your order <b>${orderId}</b>.</p>
      <div class="field">
        <label>Cancellation Reason</label>
        <textarea id="cancelReasonInput" rows="4" placeholder="Reason for cancellation..." required></textarea>
      </div>
      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <button class="btn btn-ghost" style="flex: 1;" onclick="document.getElementById('cancelOrderModal').remove()">Close</button>
        <button class="btn btn-danger" style="flex: 1;" id="btnConfirmCancel">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const confirmBtn = document.getElementById('btnConfirmCancel');
  confirmBtn.onclick = () => submitCancelOrder(orderId);
}
window.openCancelModal = openCancelModal;

/* ============================= SCROLL ENTRANCE ANIMATIONS ============================= */
let scrollRevealObserver;

function revealScrollElements(scope = document) {
  const selector = [
    'main > .wrap', 'main > section', 'main .hero', 'main .stats-section',
    'main .section-head', 'main .card-product', 'main .panel', 'main .form-card',
    'main .pdp-gallery', 'main .pdp-grid > div', 'main .contact-grid > *',
    'main h1', 'main h2', 'main h3', 'main p', 'main .btn', 'main img',
    'footer .foot-grid', 'footer .foot-bottom'
  ].join(', ');

  const elements = scope.querySelectorAll ? scope.querySelectorAll(selector) : [];
  elements.forEach(element => {
    if (element.classList.contains('reveal-on-scroll')) return;
    if (element.matches('.hero-slide img')) return;
    element.classList.add('reveal-on-scroll');
    if (element.matches('img, .card-product, .pdp-gallery')) element.classList.add('reveal-zoom');
    if (scrollRevealObserver) scrollRevealObserver.observe(element);
    else element.classList.add('is-visible');
  });
}

function initScrollAnimations() {
  if ('IntersectionObserver' in window) {
    scrollRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        scrollRevealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  }

  revealScrollElements();
  new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('main, main *, footer, footer *') || node.querySelector('main, footer')) revealScrollElements(node);
    }));
  }).observe(document.body, { childList: true, subtree: true });
}

async function submitCancelOrder(orderId) {
  const reason = document.getElementById('cancelReasonInput').value.trim();
  if (!reason) {
    alert('Please enter a cancellation reason.');
    return;
  }

  const o = STATE.orders.find(x => x.id === orderId);
  if (!o) return;

  const btn = document.getElementById('btnConfirmCancel');
  const origText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';

  // Send cancellation to Formspree
  const customer = o.customerSnapshot || {};
  const cancelledOrderDetails = o.items.map(i =>
    `${i.name} — Qty: ${i.qty}, Unit price: ${fmtUSD(i.price)}, Line total: ${fmtUSD(i.price * i.qty)}`
  ).join(' | ');
  const cancelData = {
    "Email Label": "ORDER CANCELLED",
    "Cancellation Info": "ORDER CANCELLED",
    "Customer Name": customer.fullName || '',
    "Customer Email": customer.email || '',
    "Customer Phone": customer.phone || '',
    "Order ID": o.id,
    "Cancelled Order/Product Details": cancelledOrderDetails,
    "Order Total": fmtUSD(o.total),
    "Order Date": new Date(o.createdAt).toLocaleDateString(),
    "Cancellation Reason": reason,
    "Cancellation Date & Time": new Date().toLocaleString()
  };

  try {
    const res = await fetch('https://formspree.io/f/mkodqyao', {
      method: 'POST',
      body: JSON.stringify(cancelData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      o.status = 'cancelled';
      o.cancellationReason = reason;
      o.cancelledAt = Date.now();
      saveOrders();
      document.getElementById('cancelOrderModal').remove();
      showPopup('Order Cancelled', 'Your order has been successfully cancelled.');
      render();
    } else {
      throw new Error('Formspree response not OK');
    }
  } catch (err) {
    console.error(err);
    toast('Error cancelling order. Please try again.');
    btn.disabled = false;
    btn.textContent = origText;
  }
}

// Initialize
initScrollAnimations();
loadAll();
