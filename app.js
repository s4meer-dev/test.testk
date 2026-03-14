/* =====================
   BREW HAVEN — app.js
   ===================== */

/* ---- CART STATE ---- */
const cart = [];

/* ---- ELEMENTS ---- */
const cartBtn      = document.getElementById('cartBtn');
const cartSidebar  = document.getElementById('cartSidebar');
const cartOverlay  = document.getElementById('cartOverlay');
const cartClose    = document.getElementById('cartClose');
const cartItemsEl  = document.getElementById('cartItems');
const cartBadgeEl  = document.getElementById('cartBadge');
const cartTotalEl  = document.getElementById('cartTotal');
const checkoutBtn  = document.getElementById('checkoutBtn');
const toast        = document.getElementById('toast');
const backToTop    = document.getElementById('backToTop');

/* ---- OPEN / CLOSE CART ---- */
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

/* ---- RENDER CART ---- */
function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartTotalEl.textContent = '₹0';
    cartBadgeEl.textContent = '0';
    return;
  }

  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    totalItems += item.qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      </div>
      <div class="cart-item-controls">
        <button class="ci-qty-btn" data-action="dec" data-index="${index}">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-qty-btn" data-action="inc" data-index="${index}">+</button>
      </div>
      <button class="cart-item-remove" data-index="${index}" aria-label="Remove item">✕</button>
    `;
    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = '₹' + total.toLocaleString('en-IN');
  cartBadgeEl.textContent = totalItems;

  /* Inline controls */
  cartItemsEl.querySelectorAll('.ci-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      if (btn.dataset.action === 'inc') {
        cart[i].qty++;
      } else {
        cart[i].qty--;
        if (cart[i].qty <= 0) cart.splice(i, 1);
      }
      renderCart();
    });
  });

  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.index);
      cart.splice(i, 1);
      renderCart();
    });
  });
}

/* ---- ADD TO CART ---- */
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name  = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const qtyEl = btn.closest('.card-actions').querySelector('.qty-value');
    const qty   = parseInt(qtyEl.textContent) || 1;

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, qty });
    }

    renderCart();
    showToast(`${qty}× ${name} added to cart ☕`);

    /* Reset qty on card */
    qtyEl.textContent = '1';
  });
});

/* ---- QTY CONTROLS ON CARDS ---- */
document.querySelectorAll('.qty-control').forEach(ctrl => {
  const minus = ctrl.querySelector('.qty-minus');
  const plus  = ctrl.querySelector('.qty-plus');
  const val   = ctrl.querySelector('.qty-value');

  plus.addEventListener('click', () => {
    val.textContent = parseInt(val.textContent) + 1;
  });

  minus.addEventListener('click', () => {
    const current = parseInt(val.textContent);
    if (current > 1) val.textContent = current - 1;
  });
});

/* ---- FILTER TABS ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards  = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    menuCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- CHECKOUT BUTTON ---- */
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  showToast('Order placed! Thank you ☕');
  cart.length = 0;
  renderCart();
  closeCart();
});

/* ---- TOAST HELPER ---- */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ---- BACK TO TOP ---- */
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- CONTACT FORM (simple demo) ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formSuccess.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  });
}
