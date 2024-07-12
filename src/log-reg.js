$(document).ready(function() {
    $('#category-toggle').mouseenter(function(event) {
        event.preventDefault();
        $('#category-menu').show();
    });

    $('#category-toggle, #category-menu').mouseleave(function(event) {
        event.preventDefault();
        if (!$(event.relatedTarget).closest('#category-menu').length) {
            $('#category-menu').hide();
        }
    });

    $('#category-menu').mouseenter(function() {
        $(this).show();
    }).mouseleave(function(event) {
        if (!$(event.relatedTarget).closest('#category-toggle').length) {
            $(this).hide();
        }
    });

    function formatDate(date) {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    function toggleProfile(show) {
        if (show) {
            $('.profile-hidden').show();
            $('body').addClass('modal-open');
        } else {
            $('.profile-hidden').hide();
            $('body').removeClass('modal-open');
        }
    }

    function hideAllSections() {
        $(".homepagehidden").hide();
        $(".sale-page").hide();
        $(".contact-page").hide();
        $(".profile-hidden").hide();
        $(".bcground").hide();
        $("#contactHidden").hide();
        $(".logo-section").hide();
        $("body").removeClass("modal-open");
        $("#change-password-form").hide();
        $("#category-menu").hide(); 
        $("#login-form").addClass("hidden"); 
        $("#sign-up-form").addClass("hidden"); 
        $(".profile-show").addClass("hidden"); 
        $(".cart-container").addClass("hidden"); 
    }

    $('#cart-link').click(function(event) {
        event.preventDefault();
        hideAllSections(); 
        $('.cart-container').removeClass('hidden'); 
    });

    $('#some-other-section-link').click(function(event) {
        event.preventDefault();
        hideAllSections(); 
        $('.some-other-section').show();
    });

    $('#homepage-link').click(function(event) {
        event.preventDefault();
        hideAllSections(); 
        $('.homepagehidden').show();
    });

    $('#sale-page-link').click(function(event) {
        event.preventDefault();
        hideAllSections(); 
        $('.sale-page').show(); 
    });

    $('#contact-page-link').click(function(event) {
        event.preventDefault();
        hideAllSections(); 
        $('.contact-page').show(); 
    });

    function calculateTimeLoggedIn() {
        const loginTime = new Date(localStorage.getItem('loginTime'));
        const currentTime = new Date();
        const diff = currentTime - loginTime;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
    }

    let intervalId;
    function startInterval() {
        intervalId = setInterval(function() {
            if ($(".profile-show").is(":visible")) {
                $('#time-logged-in').text(calculateTimeLoggedIn());
            }
        }, 1000);
    }

    function stopInterval() {
        clearInterval(intervalId);
    }

    function showProfileInfo(user) {
        $('#user-name').text(`${user.firstName} ${user.lastName}`);
        $('#user-email').text(user.email);
        $('#user-gender').text(user.gender);
        $('#user-dob').text(user.dob);
        $('#date-registered').text(formatDate(user.dateRegistered));
        $('#time-logged-in').text(calculateTimeLoggedIn());
    }

    $("#profile-link a").on("click", function(event) {
        event.preventDefault();
        hideAllSections();
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            showProfileInfo(user);
            $(".profile-show").removeClass("hidden");
            $("#profile-link").data("clicked", true);
            startInterval();
        } else {
            alert('No user is currently logged in.');
        }
    });

    $(".navbar-nav a").on("click", function(event) {
        if (!$(this).closest('li').is('#profile-link')) {
            $(".profile-show").addClass("hidden");
            $("#profile-link").data("clicked", false);
        }
    });

    $(".navbar-brand").on("click", function(event) {
        event.preventDefault();
        hideAllSections();
        $(".homepagehidden").show();
        $(".logo-section").show();
    });

    function saveLoginTime() {
        localStorage.setItem('loginTime', new Date().toISOString());
    }

    function saveSession(user) {
        user.dateRegistered = user.dateRegistered || new Date().toISOString(); // Save registration date if not already saved
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    function loadSession() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            $('#login-signup-link').addClass('hidden');
            $('#profile-link').removeClass('hidden');
        }
        showForm();
    }

    function showForm() {
        const currentForm = localStorage.getItem('currentForm') || 'login';
        if (currentForm === 'signup') {
            $('#sign-up-form').show();
            $('#login-form').hide();
            $('.panda').addClass('signup');
        } else {
            $('#login-form').show();
            $('#sign-up-form').hide();
            $('.panda').removeClass('signup');
        }
    }

    loadSession();

    $('#logout-btn').click(function(event) {
        event.preventDefault();
        toggleProfile(false);
        $('#profile-link').addClass('hidden');
        $('#login-signup-link').removeClass('hidden');
        clearSession();
        stopInterval(); 
        window.location.href = '/';
    });

    function clearSession() {
        localStorage.removeItem('loggedInUser');
    }


    function login() {
        var email = $('#login-email').val().trim();
        var password = $('#password').val().trim();

        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address.');
            return;
        }

        var storedUser = JSON.parse(localStorage.getItem(email));

        if (storedUser) {
            if (storedUser.password === password) {
                alert('Login successful!');
                $('#login-email').val('');
                $('#password').val('');
                $('#login-signup-link').addClass('hidden');
                $('#profile-link').removeClass('hidden');
                saveSession(storedUser);
                saveLoginTime();
                startInterval(); 
                window.location.href = '/';
            } else {
                alert('Incorrect password.');
            }
        } else {
            alert('Email not registered.');
        }
    }

    function saveSession(user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function showAlert(message) {
        $('.alert').text(message).show();
        setTimeout(function() {
            $('.alert').hide();
        }, 3000);
        alert(message);
    }

    $('#login-btn').click(function(event) {
        event.preventDefault();
        login();
    });

    $('#login-email, #password').keypress(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            login();
        }
    });

    $('#login-sign-up-btn').click(function() {
        $('#login-form').hide();
        $('#sign-up-form').show();
        $('.panda').addClass('signup');
        $('form').removeClass('wrong-entry');
        localStorage.setItem('currentForm', 'signup'); 
    });

    $('#back-to-login-btn').click(function() {
        $('#sign-up-form').hide();
        $('#login-form').show();
        $('.panda').removeClass('signup');
        $('form').removeClass('wrong-entry');
        localStorage.setItem('currentForm', 'login'); 
    });

    $('#sign-up-form').submit(function(event) {
        event.preventDefault();

        const capitalize = (str) => {
            return str.replace(/\b\w/g, (char) => char.toUpperCase());
        };

        const fullName = $('#first-last-name').val().trim();
        const [firstName, lastName] = fullName.split(' ').map(capitalize);

        if (!firstName || !lastName) {
            alert('Please enter both first and last name.');
            return;
        }

        const email = $('#email').val().trim();
        const dob = $('#dob').val().trim();

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
            alert('Please enter a valid date of birth (dd/mm/yyyy).');
            return;
        }

        const [day, month, year] = dob.split('/').map(Number);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        if (day < 1 || day > 31) {
            alert('Day must be between 1 and 31.');
            return;
        }
        if (month < 1 || month > 12) {
            alert('Month must be between 1 and 12.');
            return;
        }
        if (year > currentYear || (year === currentYear && (month > currentMonth || (month === currentMonth && day > currentDay)))) {
            alert('Date of birth cannot be in the future.');
            return;
        }

        const gender = $('#gender').val();
        const password = $('#sign-up-password').val();

        if (password.length < 5) {
            alert('Password must be at least 5 characters long.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (localStorage.getItem(email)) {
            alert('Email is already registered.');
            return;
        }

        const user = {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            gender: gender,
            email: email,
            password: password,
            dateRegistered: new Date().toISOString() 
        };

        localStorage.setItem(email, JSON.stringify(user));
        alert('Registration successful!');
        $('#sign-up-form')[0].reset();
        $('#sign-up-form').hide();
        showLoginForm(); 
        $('.panda').removeClass('signup');
        $('.panda').show();
        $('#login-form').removeClass('hidden'); 
    });

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    $('#forgot-password-link').click(function(event) {
        event.preventDefault();
        var resetEmail = prompt("Please enter your email address:");
        if (resetEmail) {
            resetPassword(resetEmail);
        }
    });

    function resetPassword(email) {
        var storedUser = JSON.parse(localStorage.getItem(email.trim()));

        if (storedUser) {
            var newPassword = generatePassword();
            storedUser.password = newPassword;
            localStorage.setItem(email.trim(), JSON.stringify(storedUser));
            alert('Your new password is: ' + newPassword);
        } else {
            alert('Email not registered.');
        }
    }

    var today = new Date().toISOString().split('T')[0];
    $('#dob').attr('max', today);

    $('#first-last-name').on('input', function() {
        let value = $(this).val();
        $(this).val(value.replace(/\b\w/g, (char) => char.toUpperCase()));
    });

    $(document).mousemove(function(event) {
        var docWidth = $(document).width();
        var docHeight = $(document).height();
        var mouseX = event.pageX;
        var mouseY = event.pageY;

        var centerX = docWidth / 1;
        var centerY = docHeight / 1;

        var eyeBallX = (mouseX - centerX) / (docWidth / 15);
        var eyeBallY = (mouseY - centerY) / (docHeight / 15);

        $('.eye-ball').css({
            'transform': 'translate(' + eyeBallX + 'px, ' + eyeBallY + 'px)'
        });
    });

    $('#password').focusin(function() {
        $('#login-form').addClass('up');
    });

    $('#password').focusout(function() {
        $('#login-form').removeClass('up');
    });

    $('#sign-up-password').focusin(function() {
        $('#sign-up-form').addClass('up');
    });

    $('#sign-up-password').focusout(function() {
        $('#sign-up-form').removeClass('up');
    });

    $('#login-sign-up-btn').click(function() {
        $('#login-form').hide();
        $('#sign-up-form').show();
    });

    $('#back-to-login-btn').click(function() {
        $('#sign-up-form').hide();
        $('#login-form').show();
    });

    $('#sale-product-link, #contact-us').click(function(event) {
        event.preventDefault();
        hideAllSections();
        if (this.id === 'sale-product-link') {
            $('.sale-page').show();
            $('.bcground').show();
        } else if (this.id === 'contact-us') {
            $('.contact-page').show();
            $('#contactHidden').show();
        }
    });

    function showLoginForm() {
        $('#login-form').removeClass('hidden');
        $('#login-form').show();
        $('#sign-up-form').hide();
        $('.panda').removeClass('signup');
    }

    function showSignUpForm() {
        $('#sign-up-form').removeClass('hidden');
        $('#login-form').addClass('hidden');
        $('.panda').addClass('signup');
    }

    $('#login-signup-link a').click(function(event) {
        event.preventDefault();
        hideAllSections();
        const currentForm = localStorage.getItem('currentForm');
        if (currentForm === 'signup') {
            showSignUpForm();
        } else {
            showLoginForm();
        }
    });

    function hideAllSections() {
        $('.homepagehidden').hide();
        $('.sale-page').hide();
        $('.contact-page').hide();
        $('.profile-hidden').hide();
        $('.bcground').hide();
        $('#contactHidden').hide();
        $('.logo-section').hide();
        $('body').removeClass('modal-open');
        $('#change-password-form').hide();
        $('#category-menu').hide();
        $('#login-form').addClass('hidden');
        $('#sign-up-form').addClass('hidden');
        $(".profile-show").addClass("hidden");
    }

    function loadSession() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            $('#login-signup-link').addClass('hidden');
            $('#profile-link').removeClass('hidden');
        }

        const currentForm = localStorage.getItem('currentForm');
        if (currentForm === 'signup') {
            showSignUpForm();
        } else {
            showLoginForm();
        }
    }

    loadSession();

    $('#login-sign-up-btn').click(function() {
        showSignUpForm();
        localStorage.setItem('currentForm', 'signup');
    });

    $('#back-to-login-btn').click(function() {
        showLoginForm();
        localStorage.setItem('currentForm', 'login');
    });

    $(window).on('beforeunload', function() {
        localStorage.setItem('currentForm', 'login');
    });

    $('#sale-product-link').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('.sale-page').show();
        $('.bcground').show();
    });

    $('#contact-us').click(function(event) {
        event.preventDefault();
        hideAllSections();
        $('.contact-page').show();
        $('#contactHidden').show();
    });
});

$(document).ready(function() {
    $("#profile-link").on("click", function(event) {
        event.preventDefault();
        $(".profile-show").removeClass("hidden");
        $(this).data("clicked", true);
    });

    $(".navbar-nav a").on("click", function(event) {
        if (!$(this).closest('li').is('#profile-link')) {
            $(".profile-show").addClass("hidden");
            $("#profile-link").data("clicked", false);
        }
    });
});


$(document).ready(function() {
    $('#my-account-profile').click(function() {
        $('.subMenu-MyAcc').slideToggle();
        $('.subMenu-changePass').slideUp();
        $('.subMenu-DeactivateAccount').slideUp(); 
    });

    $('#change-password-profile').click(function() {
        $('.subMenu-changePass').slideToggle();
        $('.subMenu-MyAcc').slideUp(); 
        $('.subMenu-DeactivateAccount').slideUp();
    });

    $('#deactivate-account-profile').click(function() {
        $('.subMenu-DeactivateAccount').slideToggle();
        $('.subMenu-MyAcc').slideUp();
        $('.subMenu-changePass').slideUp(); 
    });

    $('#confirm-change-password').click(function(event) {
        event.preventDefault();
        const currentPassword = $('#current-password').val().trim();
        const newPassword = $('#new-password').val().trim();
        const confirmNewPassword = $('#confirm-new-password').val().trim();

        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!user) {
            $('#change-password-success').text("No user is currently logged in.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            $('#change-password-success').text("Please fill out all fields.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        if (user.password !== currentPassword) {
            $('#change-password-success').text("Current password is incorrect.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        if (newPassword.length < 5) {
            $('#change-password-success').text("Please enter new password.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        if (newPassword === currentPassword) {
            $('#change-password-success').text("New password cannot be the same as the current password.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            $('#change-password-success').text("New passwords do not match.").css('color', 'red').show();
            setTimeout(function() {
                $('#change-password-success').hide();
                $('#confirm-change-password').show();
            }, 3000);
            return;
        }

        user.password = newPassword;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem(user.email, JSON.stringify(user));

        $('#confirm-change-password').hide();
        $('#change-password-success').text("Password successfully changed!").css('color', 'green').show();
        setTimeout(function() {
            $('#change-password-success').hide();
            $('#confirm-change-password').show();
        }, 3000);
    });

    $('#confirm-deactivate-account').click(function(event) {
        event.preventDefault();
        const deactivateEmail = $('#deactivate-email').val().trim();
        const deactivatePassword = $('#deactivate-password').val().trim();
        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!user) {
            $('#deactivate-success').text("No user is currently logged in.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!deactivateEmail) {
            $('#deactivate-success').text("Please enter an email address.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        if (!emailRegex.test(deactivateEmail)) {
            $('#deactivate-success').text("Please enter a valid email address.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        if (user.email !== deactivateEmail) {
            $('#deactivate-success').text("Email does not match our records.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        if (!deactivatePassword) {
            $('#deactivate-success').text("Please enter your password.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        if (user.password !== deactivatePassword) {
            $('#deactivate-success').text("Password is incorrect.").css('color', 'red').show();
            setTimeout(function() {
                $('#deactivate-success').hide();
                $('#confirm-deactivate-account').show();
            }, 3000);
            return;
        }

        localStorage.removeItem(user.email);
        clearSession();

        $('#confirm-deactivate-account').hide();
        $('#deactivate-success').text("Account successfully deactivated!").css('color', 'green').show();
        setTimeout(function() {
            $('#deactivate-success').hide();
            window.location.href = '/'; 
        }, 3000);
    });

    function clearSession() {
        localStorage.removeItem('loggedInUser');
    }

    $('#current-password, #new-password, #confirm-new-password').keypress(function(event) {
        if (event.which === 13) {
            $('#confirm-change-password').click();
        }
    });

    $('#deactivate-email, #deactivate-password').keypress(function(event) {
        if (event.which === 13) {
            $('#confirm-deactivate-account').click();
        }
    });

    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });
});

//------------- WRITE REVIEW -----------// 

document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.stars .star');
    const reviewForm = document.querySelector('.review-form');
    const reviewText = document.getElementById('review-text');
    const submitReview = document.getElementById('submit-review');
    const reviewSuccess = document.querySelector('.review-success');
    const loginAlert = document.querySelector('.login-alert');
    const allReviewsButton = document.querySelector('.all-reviews');
    const allReviewsContainer = document.querySelector('.all-reviews-container');
    const reviewsList = document.querySelector('.reviews-list');
    let rating = 0;
    let allReviewsTimeout;

    function getLoggedInEmail() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        return user ? user.email : null;
    }

    function getReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews'));
        return Array.isArray(reviews) ? reviews : [];
    }

    function checkIfUserReviewed(productId, email) {
        const reviews = getReviews();
        return reviews.some(review => review.productId === productId && review.email === email);
    }

    function renderReviews(productId) {
        const reviews = getReviews();
        const loggedInEmail = getLoggedInEmail();
        const productReviews = reviews.filter(review => review.productId === productId);
        reviewsList.innerHTML = '';

        if (productReviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews for this product.</p>';
            return;
        }

        productReviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            reviewItem.innerHTML = `
                <div>
                    <h4>Name: ${review.name}</h4>
                    <p>Date and Time: ${review.date}</p>
                    <p>Text: ${review.text}</p>
                    <span>Grade: ${review.rating} star(s)</span>
                </div>
                ${review.email === loggedInEmail ? `<button class="remove-review" data-index="${index}">Remove</button>` : ''}
            `;
            reviewsList.appendChild(reviewItem);
        });

        const removeButtons = document.querySelectorAll('.remove-review');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                removeReview(index, productId);
            });
        });
    }

    function removeReview(index, productId) {
        const reviews = getReviews();
        const loggedInEmail = getLoggedInEmail();
        const productReviews = reviews.filter(review => review.productId === productId);

        if (productReviews[index].email === loggedInEmail) {
            const globalIndex = reviews.findIndex(review => review.productId === productId && review.email === loggedInEmail);
            reviews.splice(globalIndex, 1);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            renderReviews(productId);
            stars.forEach(star => {
                star.style.pointerEvents = 'auto';
                star.style.color = 'white'; 
            });
        } else {
            alert('You can only remove your own reviews.');
        }
    }

    function resetAllActions() {
        reviewForm.style.display = 'none';
        reviewSuccess.style.display = 'none';
        loginAlert.style.display = 'none';
        highlightStars(0);
        stars.forEach(star => {
            star.style.pointerEvents = 'auto';
        });
        reviewText.value = '';
        allReviewsContainer.style.display = 'none';
        clearTimeout(allReviewsTimeout);
    }

    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('selected');
                star.style.color = 'gold';
            } else {
                star.classList.remove('selected');
                star.style.color = 'white';
            }
        });
    }

    stars.forEach((star) => {
        star.addEventListener('click', function () {
            const loggedInEmail = getLoggedInEmail();
            const productId = parseInt(document.querySelector('.all-reviews').getAttribute('data-id'));

            if (!loggedInEmail) {
                loginAlert.style.display = 'block';
                loginAlert.textContent = 'You must be logged in to submit a review.';
                setTimeout(() => {
                    loginAlert.style.display = 'none';
                }, 4000);
                return;
            }

            if (checkIfUserReviewed(productId, loggedInEmail)) {
                loginAlert.style.display = 'block';
                loginAlert.textContent = 'You have already submitted a review.';
                setTimeout(() => {
                    loginAlert.style.display = 'none';
                }, 4000);
                return;
            }

            rating = parseInt(this.getAttribute('data-value'));
            reviewForm.style.display = 'block';
            highlightStars(rating);
        });
    });

    submitReview.addEventListener('click', function () {
        const review = reviewText.value.trim();
        const loggedInEmail = getLoggedInEmail();
        const productId = parseInt(document.querySelector('.all-reviews').getAttribute('data-id'));
        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        if (review === '') {
            alert('Please fill out all fields.');
            return;
        }

        if (!loggedInEmail) {
            loginAlert.textContent = 'You must be logged in to submit a review.';
            loginAlert.style.display = 'block';
            setTimeout(() => {
                loginAlert.style.display = 'none';
            }, 4000);
            return;
        }

        const reviews = getReviews();
        const date = new Date().toLocaleString();
        const fullName = `${user.firstName} ${user.lastName}`;
        reviews.push({ productId, email: loggedInEmail, name: fullName, rating, text: review, date });
        localStorage.setItem('reviews', JSON.stringify(reviews));

        reviewForm.style.display = 'none';
        reviewSuccess.style.display = 'block';
        reviewSuccess.textContent = `Review submitted successfully with ${rating} star(s)!`;

        stars.forEach(star => {
            star.style.pointerEvents = 'none';
            star.style.color = 'white';
        });

        setTimeout(() => {
            reviewSuccess.style.display = 'none';
            stars.forEach(star => {
                star.style.pointerEvents = 'auto';
            });
            highlightStars(0);
        }, 4000);

        allReviewsContainer.style.display = 'none';
        renderReviews(productId);
    });

    allReviewsButton.addEventListener('click', function () {
        const productId = parseInt(this.getAttribute('data-id'));
        if (allReviewsContainer.style.display === 'none') {
            allReviewsContainer.style.display = 'block';
            renderReviews(productId);
            allReviewsTimeout = setTimeout(() => {
                allReviewsContainer.style.display = 'none';
            }, 5000); 
        } else {
            allReviewsContainer.style.display = 'none';
            clearTimeout(allReviewsTimeout);
        }
    });

    function resetActionsOnNavigation() {
        document.querySelectorAll('.nav-link, .navbar-brand, .product-link').forEach(link => {
            link.addEventListener('click', function() {
                resetAllActions();
            });
        });
    }

    window.addEventListener('beforeunload', resetAllActions);
    window.addEventListener('hashchange', resetAllActions);
    window.addEventListener('popstate', resetAllActions);
    resetActionsOnNavigation();

    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', function () {
            resetAllActions();
        });
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('product-link') || event.target.classList.contains('nav-link')) {
            resetAllActions();
        }
    });

    window.addEventListener('beforeunload', function () {
        resetAllActions();
    });

    document.querySelector('.container-moredetails').style.display = 'none';

    localStorage.removeItem('currentProduct');

    const backHomeButton = document.querySelector('.back-home');

    backHomeButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});


