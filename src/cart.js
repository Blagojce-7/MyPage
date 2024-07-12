document.addEventListener('DOMContentLoaded', function () {
    const shippingFormContainer = document.querySelector('.container-shipping-info');
    const shippingFormButton = document.querySelector('.button-shipping-info');
    const paymentInfoButton = document.querySelector('#payment-info');
    const completeOrderButton = document.querySelector('.truck-button');
    const homePageContent = document.querySelector('.homepagehidden');
    const cartContent = document.querySelector('.cart-container');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountBadge = document.querySelector('#cart-count');
    const cartLink = document.querySelector('#cart-link');

    shippingFormButton.disabled = true;
    completeOrderButton.disabled = true;

    const form = document.querySelector('.form-shipping-info');
    const inputs = form.querySelectorAll('.field-shipping-info__input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
            shippingFormButton.disabled = !allFilled;
        });
    });

    paymentInfoButton.addEventListener('click', () => {
        shippingFormContainer.style.display = (shippingFormContainer.style.display === 'block') ? 'none' : 'block';
    });

    shippingFormButton.addEventListener('click', (e) => {
        e.preventDefault();
        completeOrderButton.disabled = false;

        const firstName = document.querySelector('#firstname').value;
        const lastName = document.querySelector('#lastname').value;
        const address = document.querySelector('#address').value;
        const country = document.querySelector('#country').value;
        const zipCode = document.querySelector('#zipcode').value;
        const city = document.querySelector('#city').value;
        const state = document.querySelector('#municipality').value;

        alert(`Successfully entered details:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nAddress: ${address}\nCountry: ${country}\nZip Code: ${zipCode}\nCity: ${city}\nMunicipality: ${state}`);
    });

    function checkCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.length === 0) {
            completeOrderButton.disabled = true;
            cartCountBadge.textContent = '0';
            cartContent.style.display = 'none';  
            emptyCartMessage.classList.remove('hidden'); 
        } else {
            completeOrderButton.disabled = false;
            cartCountBadge.classList.remove('hidden');
            cartCountBadge.textContent = cartItems.length;
            cartLink.classList.remove('disabled');
            cartLink.style.pointerEvents = 'auto';
            cartContent.style.display = 'block'; 
            emptyCartMessage.classList.add('hidden'); 
    
            cartItemsContainer.innerHTML = '';
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
                input.addEventListener('change', function () {
                    updateQuantity(index, this.value);
                });
            });
    
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');
                    removeItem(index);
                });
            });
    
            updateCartSummary();
        }
    }

    cartLink.addEventListener('click', (e) => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.length === 0) {
            e.preventDefault();
        }
    });

    completeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();

        let box = completeOrderButton.querySelector(".box"),
            truck = completeOrderButton.querySelector(".truck");

        if (!completeOrderButton.classList.contains("done")) {
            if (!completeOrderButton.classList.contains("animation")) {
                completeOrderButton.classList.add("animation");

                gsap.to(completeOrderButton, {
                    "--box-s": 1,
                    "--box-o": 1,
                    duration: 0.3,
                    delay: 0.5
                });

                gsap.to(box, {
                    x: 0,
                    duration: 0.4,
                    delay: 0.7
                });

                gsap.to(completeOrderButton, {
                    "--hx": -5,
                    "--bx": 50,
                    duration: 0.18,
                    delay: 0.92
                });

                gsap.to(box, {
                    y: 0,
                    duration: 0.1,
                    delay: 1.15
                });

                gsap.set(completeOrderButton, {
                    "--truck-y": 0,
                    "--truck-y-n": -26
                });

                gsap.to(completeOrderButton, {
                    "--truck-y": 1,
                    "--truck-y-n": -25,
                    duration: 0.2,
                    delay: 1.25,
                    onComplete() {
                        gsap.timeline({
                            onComplete() {
                                completeOrderButton.classList.add("done");
                                localStorage.removeItem('cartItems'); 
                                cartItemsContainer.innerHTML = '';
                                checkCart();
                                setTimeout(() => {
                                    cartContent.style.display = 'none';
                                    shippingFormContainer.style.display = 'none';
                                    homePageContent.style.display = 'block';
                                }, 1000); 
                            }
                        })
                            .to(truck, {
                                x: 0,
                                duration: 0.4
                            })
                            .to(truck, {
                                x: 40,
                                duration: 1
                            })
                            .to(truck, {
                                x: 20,
                                duration: 0.6
                            })
                            .to(truck, {
                                x: 96,
                                duration: 0.4
                            });
                        gsap.to(completeOrderButton, {
                            "--progress": 1,
                            duration: 2.4,
                            ease: "power2.in"
                        });
                    }
                });
            }
        } else {
            completeOrderButton.classList.remove("animation", "done");
            gsap.set(truck, {
                x: 4
            });
            gsap.set(completeOrderButton, {
                "--progress": 0,
                "--hx": 0,
                "--bx": 0,
                "--box-s": 0.5,
                "--box-o": 0,
                "--truck-y": 0,
                "--truck-y-n": -26
            });
            gsap.set(box, {
                x: -24,
                y: -6
            });
        }
    });

    checkCart();

    function addItemToCart(item) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        checkCart();
    }

    function removeItemFromCart(index) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        checkCart();

        if (cartItems.length === 0) {
            homePageContent.style.display = 'block';
            cartContent.style.display = 'none';
        }
    }

    function updateQuantity(index, quantity) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems[index].quantity = parseInt(quantity);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartSummary();
        checkCart();
    }

    function updateCartSummary() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.newPrice.replace(' EUR', '')) * item.quantity, 0);
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('total').textContent = subtotal.toFixed(2);
    }

    function showSectionFromHash() {
        const hash = window.location.hash;
        hideAllSections();
        switch (hash) {
            case '#/home':
                document.querySelector('.homepagehidden').style.display = 'block';
                break;
            case '#/salespage':
                document.querySelector('.bcground').style.display = 'block';
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
                    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    if (cartItems.length > 0) {
                        document.querySelector('.cart-container').style.display = 'block';
                    } else {
                        history.pushState(null, '', '#/home');
                    }
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

    function hideAllSections() {
        document.querySelector('.homepagehidden').style.display = 'none';
        document.querySelector('.bcground').style.display = 'none';
        document.querySelector('.log-reg-hidden').style.display = 'none';
        document.querySelector('.contact-hidden').style.display = 'none';
        document.querySelector('.cart-container').style.display = 'none'; 
        document.querySelector('.container-moredetails').style.display = 'none'; 
        document.querySelector('.profile-show').style.display = 'none'; 
    }

    function updateHash(hash) {
        history.pushState(null, '', hash);
    }

    showSectionFromHash();


//-------------------- TIMER FUNCTION ------------------//

    function sortProducts(criteria) {
        const productsContainer = document.getElementById('products');
        const products = Array.from(productsContainer.getElementsByClassName('product-item'));

        products.sort((a, b) => {
            if (criteria === 'lower-price') {
                const priceA = parseFloat(a.querySelector('#new-Price').textContent.replace(/[^\d.-]/g, ''));
                const priceB = parseFloat(b.querySelector('#new-Price').textContent.replace(/[^\d.-]/g, ''));
                return priceA - priceB;
            } else if (criteria === 'higher-price') {
                const priceA = parseFloat(a.querySelector('#new-Price').textContent.replace(/[^\d.-]/g, ''));
                const priceB = parseFloat(b.querySelector('#new-Price').textContent.replace(/[^\d.-]/g, ''));
                return priceB - priceA;
            } else if (criteria === 'highest-offer') {
                const discountA = parseFloat(a.querySelector('.badge').textContent.replace('Extra ', '').replace('% Off', ''));
                const discountB = parseFloat(b.querySelector('.badge').textContent.replace('Extra ', '').replace('% Off', ''));
                return discountB - discountA;
            } else if (criteria === 'alphabetical') {
                const nameA = a.querySelector('h4').textContent.toLowerCase();
                const nameB = b.querySelector('h4').textContent.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            }
        });

        productsContainer.innerHTML = '';
        products.forEach(product => productsContainer.appendChild(product));
    }

    document.getElementById('sort-options').addEventListener('change', function () {
        sortProducts(this.value);
    });
});
