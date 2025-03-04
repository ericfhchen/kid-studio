// Main theme JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart quantity buttons
  initCartQuantityButtons();
  
  // Initialize collection sorting
  initCollectionSorting();
});

/**
 * Initialize cart quantity buttons
 */
function initCartQuantityButtons() {
  const minusButtons = document.querySelectorAll('[data-quantity-minus]');
  const plusButtons = document.querySelectorAll('[data-quantity-plus]');
  
  minusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.nextElementSibling;
      const value = parseInt(input.value);
      if (value > 1) {
        input.value = value - 1;
      }
    });
  });
  
  plusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const value = parseInt(input.value);
      input.value = value + 1;
    });
  });
}

/**
 * Initialize collection sorting
 */
function initCollectionSorting() {
  const sortSelect = document.getElementById('SortBy');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.href;
    });
  }
}

/**
 * Add to cart functionality
 * @param {number} variantId - The variant ID to add to cart
 * @param {number} quantity - The quantity to add
 */
function addToCart(variantId, quantity = 1) {
  const data = {
    id: variantId,
    quantity: quantity
  };
  
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // Update cart count
    updateCartCount();
    
    // Show added to cart message
    showAddedToCartMessage();
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
  });
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCountElements = document.querySelectorAll('[data-cart-count]');
      
      cartCountElements.forEach(element => {
        element.textContent = cart.item_count;
        
        if (cart.item_count === 0) {
          element.classList.add('hide');
        } else {
          element.classList.remove('hide');
        }
      });
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
    });
}

/**
 * Show added to cart message
 */
function showAddedToCartMessage() {
  // Implementation depends on design requirements
  // This is a simple example
  const message = document.createElement('div');
  message.className = 'added-to-cart-message';
  message.textContent = 'Item added to cart';
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('show');
    
    setTimeout(() => {
      message.classList.remove('show');
      
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 2000);
  }, 10);
}

// Initialize product quick add buttons
document.addEventListener('click', function(event) {
  if (event.target.matches('.product-card__add-to-cart') || event.target.closest('.product-card__add-to-cart')) {
    const button = event.target.matches('.product-card__add-to-cart') ? event.target : event.target.closest('.product-card__add-to-cart');
    const variantId = button.getAttribute('data-variant-id');
    
    if (variantId) {
      event.preventDefault();
      addToCart(variantId);
    }
  }
}); 