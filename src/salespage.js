document.addEventListener("DOMContentLoaded", function() {
    let products = {};
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            updateCartDisplay();
            updateCartCount();
            showSectionFromHash();  
        })
        .catch(error => console.error('Error fetching products:', error));

    function calculateDiscount(oldPrice, newPrice) {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    }

    function showCategoryProducts(category, onSaleOnly = false, isSalesPage = false) {
        hideAllSections();
        document.getElementById('bcground').style.display = 'block';
        if (isSalesPage) {
            document.getElementById('sale-hidden').style.display = 'block';
            document.querySelector('.mainsale').style.display = 'block';
        } else {
            document.getElementById('sale-hidden').style.display = 'none';
            document.querySelector('.mainsale').style.display = 'none';
        }

        const productContainer = document.getElementById('products');
        productContainer.innerHTML = '';

        if (!isSalesPage) {
            const categoryName = getCategoryName(category);
            const categoryHeader = `<h1 class="category-header">${categoryName}</h1>`;
            productContainer.innerHTML += categoryHeader;
        }

        let categoryProducts = products[category];
        if (onSaleOnly) {
            categoryProducts = categoryProducts.filter(product => product.onSale);
        }

        if (categoryProducts && categoryProducts.length > 0) {
            categoryProducts.forEach(function(product) {
                const newPrice = parseFloat(product.newPrice.replace(' EUR', ''));
                const oldPrice = parseFloat(product.oldPrice.replace(' EUR', ''));
                const savings = oldPrice - newPrice;
                const discountPercent = calculateDiscount(oldPrice, newPrice);

                const productHTML = `
                    <div class="col-xs-12 col-sm-6 col-md-2 product-item" data-id="${product.id}" data-category="${category}">
                        <img src="${product.image}" class="img-responsive center-block">
                        ${product.onSale ? `<span class="badge"><h5>Extra ${discountPercent}% Off</h5></span>` : ''}
                        <h4 class="text-center">${product.name}</h4>
                        <h5 class="text-center" id="new-Price">${product.newPrice}</h5>
                        ${product.onSale ? `<h6 class="text-center">${product.oldPrice}</h6>` : ''}
                        ${product.onSale ? `<p class="save">Save: ${savings.toFixed(2)} EUR</p>` : ''}
                        <div class="btn-container">
                            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                            <button class="more-details" data-product-id="${product.id}" data-category="${category}">More Details</button>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        } else {
            productContainer.innerHTML = `<p>No products found in this category.</p>`;
        }

        addMoreDetailsEventListeners();
        addAddToCartEventListeners();
    }

    function showSaleProducts() {
        hideAllSections();
        document.getElementById('bcground').style.display = 'block';
        document.querySelector('.mainsale').style.display = 'block';
        document.getElementById('sale-hidden').style.display = 'block';

        const productContainer = document.getElementById('products');
        productContainer.innerHTML = '';

        for (const category in products) {
            let categoryProducts = products[category].filter(product => product.onSale);
            categoryProducts.forEach(function(product) {
                const newPrice = parseFloat(product.newPrice.replace(' EUR', ''));
                const oldPrice = parseFloat(product.oldPrice.replace(' EUR', ''));
                const savings = oldPrice - newPrice;
                const discountPercent = calculateDiscount(oldPrice, newPrice);

                const productHTML = `
                    <div class="col-xs-12 col-sm-6 col-md-2 product-item" data-id="${product.id}" data-category="${category}">
                        <img src="${product.image}" class="img-responsive center-block">
                        <span class="badge"><h5>Extra ${discountPercent}% Off</h5></span>
                        <h4 class="text-center">${product.name}</h4>
                        <h5 class="text-center" id="new-Price">${product.newPrice}</h5>
                        <h6 class="text-center">${product.oldPrice}</h6>
                        <p class="save">Save: ${savings.toFixed(2)} EUR</p>
                        <div class="btn-container">
                            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                            <button class="more-details" data-product-id="${product.id}" data-category="${category}">More Details</button>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        }

        addMoreDetailsEventListeners();
        addAddToCartEventListeners();
    }

    function updateHash(hash) {
        history.pushState(null, '', hash);
    }

    function addMoreDetailsEventListeners() {
        const moreDetailsBtns = document.querySelectorAll('.more-details');
        moreDetailsBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const category = this.getAttribute('data-category');
                showProductDetails(category, productId);

                const currentProduct = {
                    category: category,
                    id: productId
                };
                localStorage.setItem('currentProduct', JSON.stringify(currentProduct));
            });
        });
    }

    function addAddToCartEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                addToCart(productId);
            });
        });
    }

    function showProductDetails(category, productId) {
        hideAllSections();
        const product = products[category].find(product => product.id === productId);

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description || "No description available.";
        document.getElementById('product-price').textContent = product.newPrice;
        document.getElementById('product-image').src = product.image;

        const addToCartButton = document.querySelector('.container-moredetails .product-add');
        addToCartButton.setAttribute('data-product-id', productId);

        const newAddToCartButton = addToCartButton.cloneNode(true);
        addToCartButton.parentNode.replaceChild(newAddToCartButton, addToCartButton);

        newAddToCartButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });

        document.querySelector('.container-moredetails').style.display = 'block';

        document.querySelector('.all-reviews').setAttribute('data-id', product.id);
        window.scrollTo(0, 0); 
    }

    function addToCart(productId) {
        const product = findProductById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        const existingProduct = cartItems.find(item => item.id === product.id);

        if (existingProduct) {
            alert('Product is already in the cart!');
        } else {
            cartItems.push({ ...product, quantity: 1 });
            updateCartDisplay();
            alert('Product added to cart!');
            updateCartCount();
        }

        saveCartItems();
    }

    function findProductById(productId) {
        for (const category in products) {
            const product = products[category].find(item => item.id === productId);
            if (product) {
                return product;
            }
        }
        return null;
    }

    function saveCartItems() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cartSummary.classList.remove('hidden');

            cartItems.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price" data-price="${item.newPrice}">Price: ${item.newPrice}</p>
                        <div class="quantity">
                            <label for="quantity${index}">Quantity:</label>
                            <input type="number" id="quantity${index}" value="${item.quantity}" min="1">
                        </div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;

                cartItemsContainer.appendChild(cartItem);
            });

            document.querySelectorAll('.quantity input').forEach((input, index) => {
                input.addEventListener('change', function() {
                    updateQuantity(index, this.value);
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    removeItem(index);
                });
            });

            updateCartSummary();
        }
    }

    function updateQuantity(index, quantity) {
        cartItems[index].quantity = parseInt(quantity);
        updateCartSummary();
        updateCartCount();
        saveCartItems();
    }

    function removeItem(index) {
        cartItems.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
        saveCartItems();
    }

    function updateCartSummary() {
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.newPrice.replace(' EUR', '')) * item.quantity, 0);
        subtotalElement.textContent = subtotal.toFixed(2);
        totalElement.textContent = subtotal.toFixed(2);
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }

        localStorage.setItem('cartItemCount', totalItems);
    }

    function showHomePage() {
        hideAllSections();
        const homePage = document.querySelector('.homepagehidden');
        homePage.classList.remove('hidden');
        window.scrollTo(0, 0); 
    }

    function showCart() {
        hideAllSections();
        document.querySelector('.cart-container').style.display = 'block';
        window.scrollTo(0, 0); 
    }

    function hideAllSections() {
        document.querySelector('.homepagehidden').style.display = 'none';
        document.getElementById('bcground').style.display = 'none';
        document.querySelector('.log-reg-hidden').style.display = 'none';
        document.querySelector('.contact-hidden').style.display = 'none';
        document.querySelector('.cart-container').style.display = 'none';
        document.querySelector('.container-moredetails').style.display = 'none';
        document.querySelector('.profile-show').style.display = 'none';
        document.querySelector('.mainsale').style.display = 'none';
        document.getElementById('sale-hidden').style.display = 'none';
    }

    function showSectionFromHash() {
        const hash = window.location.hash;
        hideAllSections();
        window.scrollTo(0, 0); 
        if (hash.startsWith('#/category/')) {
            const category = hash.split('/')[2];
            showCategoryProducts(category, false, false);
        } else if (hash.startsWith('#/category-sale/')) {
            const category = hash.split('/')[2];
            showCategoryProducts(category, true, true);
        } else {
            switch (hash) {
                case '#/home':
                    document.querySelector('.homepagehidden').style.display = 'block';
                    break;
                case '#/salespage':
                    showSaleProducts();
                    break;
                case '#/login':
                    document.querySelector('.log-reg-hidden').style.display = 'block';
                    break;
                case '#/contact':
                    document.querySelector('.contact-hidden').style.display = 'block';
                    break;
                case '#/profile':
                    const profileSection = document.querySelector('.profile-show');
                    profileSection.classList.remove('hidden');
                    profileSection.style.display = 'block';
                    break;
                case '#/cart':
                    document.querySelector('.cart-container').style.display = 'block';
                    break;
                case '#/moredetails':
                    document.querySelector('.container-moredetails').style.display = 'block';
                    break;
                default:
                    document.querySelector('.homepagehidden').style.display = 'block';
                    updateHash('#/home');
                    break;
            }
        }
    }

    document.querySelectorAll('#category-menu a').forEach(function(link) {
        link.addEventListener('click', function(event) {
            if (window.location.hash === '#/profile') {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            const category = this.getAttribute('data-category');
            showCategoryProducts(category, false, false);
            updateHash(`#/category/${category}`);
        });
    });

    document.getElementById('sale-product-link').addEventListener('click', function(event) {
        event.preventDefault();
        showSaleProducts();
        updateHash('#/salespage');
    });

    document.querySelectorAll('#slider-text h2').forEach(function(link) {
        link.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showCategoryProducts(category, true, true);
            updateHash(`#/category-sale/${category}`);
        });
    });

    document.querySelectorAll('.explore-btn').forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            showCategoryProducts(category, false, false);
            updateHash(`#/category/${category}`);
        });
    });

    window.addEventListener('hashchange', showSectionFromHash);

    window.addEventListener('load', showSectionFromHash);

    document.getElementById('cart-link-a').addEventListener('click', showCart);

    document.getElementById('footer-home').addEventListener('click', function(event) {
        event.preventDefault();
        updateHash('#/home');
        showSectionFromHash();
    });

    document.getElementById('footer-sale').addEventListener('click', function(event) {
        event.preventDefault();
        updateHash('#/salespage');
        showSectionFromHash();
    });

    document.getElementById('footer-contact').addEventListener('click', function(event) {
        event.preventDefault();
        updateHash('#/contact');
        showSectionFromHash();
    });
});

function getCategoryName(category) {
    switch (category) {
        case 'electronics':
            return 'Electronics and Gadgets';
        case 'fashion':
            return 'Fashion and Apparel';
        case 'health':
            return 'Health and Wellness';
        case 'kitchen':
            return 'Home and Kitchen';
        case 'outdoorAndSports':
            return 'Outdoor and Sports';
        case 'automotiveAccessories':
            return 'Automotive Accessories'; 
        case 'pet':
            return 'Pet Supplies';
        case 'security':
            return 'Security Systems';
        case 'toys':
            return 'Toys';
        case 'gardening':
            return 'Gardening Tools';
        case 'jewellery':
            return 'Jewellery';
        case 'Beauty':
            return 'Beauty and Personal Care'; 
        default:
            return 'Unknown Category';
    }
}

function sortProducts(criteria) {
    const productContainer = document.getElementById('products');
    const productsArray = Array.from(productContainer.getElementsByClassName('product-item'));

    const categoryHeader = productContainer.querySelector('.category-header'); 
    let sortedProducts;

    switch (criteria) {
        case 'lower-price':
            sortedProducts = productsArray.sort((a, b) => parseFloat(a.querySelector('#new-Price').textContent.replace(' EUR', '')) - parseFloat(b.querySelector('#new-Price').textContent.replace(' EUR', '')));
            break;
        case 'higher-price':
            sortedProducts = productsArray.sort((a, b) => parseFloat(b.querySelector('#new-Price').textContent.replace(' EUR', '')) - parseFloat(a.querySelector('#new-Price').textContent.replace(' EUR', '')));
            break;
        case 'highest-offer':
            sortedProducts = productsArray.sort((a, b) => {
                const discountA = parseInt(a.querySelector('.badge h5').textContent.match(/\d+/)[0]);
                const discountB = parseInt(b.querySelector('.badge h5').textContent.match(/\d+/)[0]);
                return discountB - discountA;
            });
            break;
        case 'alphabetical':
            sortedProducts = productsArray.sort((a, b) => a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent));
            break;
        default:
            sortedProducts = productsArray;
            break;
    }

    productContainer.innerHTML = ''; 
    if (categoryHeader) {
        productContainer.appendChild(categoryHeader);
    }
    sortedProducts.forEach(product => productContainer.appendChild(product)); // Append sorted products
}
