// SKRIPTA ZA SLIKITE SLIDESHOW //
const slides = [
    {
        quote: "Home is not a place, it's a feeling",
        img: "../templates/img/home.png",
        title: "Home Decorations"
    },
    {
        quote: "Stir up some love in every pot",
        img: "../templates/img/kitchen.jpg",
        title: "Kitchen Equipment"
    },
    {
        quote: "Every toy has a story waiting to be told.",
        img: "../templates/img/Toys.jpg",
        title: "Toys"
    },
    {
        quote: "Life begins the day you start a garden.",
        img: "../templates/img/Garden Greenery.jpg",
        title: "Gardening tools"
    },
    {
        quote: "Elegance is the only beauty that never fades.",
        img: "../templates/img/accesories.jpg",
        title: "Accessories"
    },
    {
        quote: "Style is a way to say who you are without having to speak.",
        img: "../templates/img/clothes.jpg",
        title: "Clothes"
    }
];

let currentSlide = 0;
const slideContainer = document.getElementById('carouselContainer');

function createSlide(slideData) {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const img = document.createElement('img');
    img.src = slideData.img;
    img.alt = 'Slide Image';
    slide.appendChild(img);

    const content = document.createElement('div');
    content.classList.add('content');

    const title = document.createElement('h2');
    title.classList.add('Categorytitle');
    title.textContent = slideData.title;
    content.appendChild(title);

    const quote = document.createElement('p');
    quote.classList.add('quote');
    quote.textContent = slideData.quote;
    content.appendChild(quote);

    slide.appendChild(content);

    return slide;
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));

    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

slides.forEach(slideData => {
    const slide = createSlide(slideData);
    slideContainer.appendChild(slide);
});

showSlide(currentSlide);

setInterval(nextSlide, 5000);

// ----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
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

    function clearSignUpForm() {
        document.getElementById('first-last-name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('dob').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('sign-up-password').value = '';
    }

    showSectionFromHash();

    document.getElementById('home-link').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.homepagehidden').style.display = 'block';
        updateHash('#/home');
    });

    document.getElementById('sale-product-link').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.bcground').style.display = 'block';
        updateHash('#/salespage');
    });

    document.querySelector('.dropdown2 a').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.log-reg-hidden').style.display = 'block';
        updateHash('#/login');

        if (document.getElementById('sign-up-form').classList.contains('hidden')) {
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('sign-up-form').classList.add('hidden');
        } else {
            document.getElementById('sign-up-form').classList.remove('hidden');
            document.getElementById('login-form').classList.add('hidden');
        }
    });

    document.querySelector('.navbar-brand').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.homepagehidden').style.display = 'block';
        updateHash('#/home');
    });

    document.getElementById('login-sign-up-btn').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('sign-up-form').classList.remove('hidden');
    });

    document.getElementById('back-to-login-btn').addEventListener('click', function(event) {
        event.preventDefault();
        clearSignUpForm();
        document.getElementById('sign-up-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    document.getElementById('contact-us').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.contact-hidden').style.display = 'block';
        updateHash('#/contact');
    });

    document.getElementById('profile-link').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        const profileSection = document.querySelector('.profile-show');
        profileSection.classList.remove('hidden');
        profileSection.style.display = 'block';
        updateHash('#/profile');
    });

    document.getElementById('cart-link').addEventListener('click', function(event) {
        event.preventDefault();
        hideAllSections();
        document.querySelector('.cart-container').style.display = 'block';
        updateHash('#/cart');
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('more-details')) {
            event.preventDefault();
            hideAllSections();
            document.querySelector('.container-moredetails').style.display = 'block';
            updateHash('#/moredetails');
        }
    });

    window.addEventListener('hashchange', showSectionFromHash);
});


//--------------- TIMER FUNC -------------//
const day = document.getElementById("days");
const hour = document.getElementById("hours");
const min = document.getElementById("minutes");
const sec = document.getElementById("seconds");

const dayFlip = document.getElementById("flip-sheet-day");
const hourFlip = document.getElementById("flip-sheet-hour");
const minFlip = document.getElementById("flip-sheet-min");
const secFlip = document.getElementById("flip-sheet-sec");

const dayValue = () => {
    if (days < 10) {
        day.innerText = `0${days}`;
    } else {
        day.innerText = days;
    }
};

const hourValue = () => {
    if (hours < 10) {
        hour.innerText = `0${hours}`;
    } else {
        hour.innerText = hours;
    }
};

const minValue = () => {
    if (minutes < 10) {
        min.innerText = `0${minutes}`;
    } else {
        min.innerText = minutes;
    }
};

const secValue = () => {
    if (seconds < 10) {
        sec.innerText = `0${seconds}`;
    } else {
        sec.innerText = seconds;
    }
};

const timer = () => {
    dayValue();
    hourValue();
    minValue();
    secValue();

    seconds--;

    if (seconds < 0 && minutes > 0) {
        seconds = 59;
        minutes--;
        flip_anime(minFlip);
    }

    if (minutes <= 0 && hours > 0) {
        minutes = 59;
        hours--;
        flip_anime(hourFlip);
    }

    if (hours <= 0 && days > 0) {
        hours = 23;
        days--;
        flip_anime(dayFlip);
    }

    if (seconds < 0 && hours == 0 && minutes == 0 && days == 0) {
        clearInterval(stopTimer);
        clearInterval(stopAnime);
    }

    localStorage.setItem('countdown', JSON.stringify({days, hours, minutes, seconds}));
};

const savedState = JSON.parse(localStorage.getItem('countdown'));

if (savedState) {
    days = savedState.days;
    hours = savedState.hours;
    minutes = savedState.minutes;
    seconds = savedState.seconds;
} else {
    days = 4;
    hours = 23;
    minutes = 59;
    seconds = 59;
}

dayValue();
hourValue();
minValue();
secValue();

const stopTimer = setInterval(timer, 1000);

const flip_anime_sec = () => {
    secFlip.classList.toggle("flip");
};

const flip_anime = (obj) => {
    obj.classList.add("flip");

    setTimeout(() => {
        obj.classList.remove("flip");
    }, 1000);
};

const stopAnime = setInterval(flip_anime_sec, 1000);


document.addEventListener("DOMContentLoaded", function() {
    const scrollToTopButton = document.getElementById("scroll-to-top");

    window.addEventListener("scroll", function() {
        if (window.pageYOffset > 100) {
            scrollToTopButton.style.display = "block";
        } else {
            scrollToTopButton.style.display = "none";
        }
    });

    scrollToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
