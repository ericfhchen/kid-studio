document.addEventListener('DOMContentLoaded', function() {
  initCollectionSorting();
  attachCartItemEventListeners();
});

function initCollectionSorting() {
  var sortSelect = document.getElementById('SortBy');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.href;
    });
  }
}

function formatMoney(cents) {
  return '$' + (cents / 100).toFixed(2);
}

function addToCart(variantId, quantity, properties) {
  var data = { id: variantId, quantity: quantity || 1 };
  if (properties) data.properties = properties;

  return fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(response) { return response.json(); });
}

function updateCartCount() {
  fetch('/cart.js')
    .then(function(response) { return response.json(); })
    .then(function(cart) {
      var elements = document.querySelectorAll('[data-cart-count]');
      elements.forEach(function(el) {
        el.textContent = cart.item_count;
        if (cart.item_count === 0) {
          el.classList.add('hide');
        } else {
          el.classList.remove('hide');
        }
      });
    });
}

function updateCartUI(cart) {
  var cartEmpty = document.querySelector('.cart__empty');
  var cartItems = document.querySelector('.cart__items');
  var cartFooter = document.querySelector('.cart__footer');
  var subtotalElement = document.querySelector('.cart__subtotal span:last-child');
  var cartOverlay = document.getElementById('cart-overlay');

  if (cart.item_count === 0) {
    if (cartEmpty) cartEmpty.classList.remove('hidden');
    if (cartItems) cartItems.classList.add('hidden');
    if (cartFooter) cartFooter.classList.add('hidden');
  } else {
    if (cartEmpty) cartEmpty.classList.add('hidden');
    if (cartItems) cartItems.classList.remove('hidden');
    if (cartFooter) cartFooter.classList.remove('hidden');
    if (subtotalElement) subtotalElement.textContent = formatMoney(cart.total_price);
    if (cartOverlay) cartOverlay.style.display = 'block';
    updateCartItems(cart);
  }
}

function updateCartItems(cart) {
  var container = document.querySelector('.cart__items');
  if (!container) return;

  container.innerHTML = '';

  cart.items.forEach(function(item) {
    var el = document.createElement('div');
    el.className = 'cart__item';
    el.dataset.variantId = item.variant_id;

    var imageUrl = item.image ? item.image.replace(/(\.[^.]*)$/, '_200x$1') : '';

    var metafieldHtml = '';
    if (item.properties && item.properties['Book Cover Type']) {
      metafieldHtml = '<p class="cart__item-metafield">' + item.properties['Book Cover Type'] + '</p>';
    }

    var variantHtml = '';
    if (item.variant_title && item.variant_title !== 'Default Title') {
      variantHtml = '<p class="cart__item-variant">' + item.variant_title + '</p>';
    }

    el.innerHTML =
      '<div class="cart__item-image"><img src="' + imageUrl + '" alt="' + item.title + '"></div>' +
      '<div class="cart__item-details">' +
        '<h3 class="cart__item-title">' + item.product_title + '</h3>' +
        variantHtml +
        metafieldHtml +
        '<p class="cart__item-price">' + formatMoney(item.final_line_price) + '</p>' +
        '<div class="cart__item-quantity">' +
          '<button class="cart__item-quantity-decrease" aria-label="Decrease quantity">-</button>' +
          '<input class="cart__item-quantity-input" type="number" value="' + item.quantity + '" min="1" aria-label="Item quantity">' +
          '<button class="cart__item-quantity-increase" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<button class="cart__item-remove" aria-label="Remove item">Remove</button>' +
      '</div>';

    container.appendChild(el);
  });

  attachCartItemEventListeners();
}

function attachCartItemEventListeners() {
  document.querySelectorAll('.cart__item-quantity-decrease').forEach(function(button) {
    button.addEventListener('click', function() {
      var input = this.nextElementSibling;
      var value = parseInt(input.value);
      var cartItem = this.closest('.cart__item');
      if (value <= 1) {
        removeCartItem(cartItem);
      } else {
        input.value = value - 1;
        changeCartItem(cartItem, value - 1);
      }
    });
  });

  document.querySelectorAll('.cart__item-quantity-increase').forEach(function(button) {
    button.addEventListener('click', function() {
      var input = this.previousElementSibling;
      var value = parseInt(input.value);
      input.value = value + 1;
      changeCartItem(this.closest('.cart__item'), value + 1);
    });
  });

  document.querySelectorAll('.cart__item-remove').forEach(function(button) {
    button.addEventListener('click', function() {
      removeCartItem(this.closest('.cart__item'));
    });
  });
}

function removeCartItem(cartItem) {
  var variantId = cartItem.dataset.variantId;
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: 0 })
  })
  .then(function(response) { return response.json(); })
  .then(function(cart) { updateCartUI(cart); });
}

function changeCartItem(cartItem, quantity) {
  var variantId = cartItem.dataset.variantId;
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity })
  })
  .then(function(response) { return response.json(); })
  .then(function(cart) { updateCartUI(cart); });
}

document.addEventListener('click', function(event) {
  if (event.target.matches('.product-card__add-to-cart') || event.target.closest('.product-card__add-to-cart')) {
    var button = event.target.matches('.product-card__add-to-cart') ? event.target : event.target.closest('.product-card__add-to-cart');
    var variantId = button.getAttribute('data-variant-id');
    if (variantId) {
      event.preventDefault();
      addToCart(variantId).then(function() { updateCartCount(); });
    }
  }
});
