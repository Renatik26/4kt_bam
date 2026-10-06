// БУРГЕР-МЕНЮ
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// АНИМАЦИЯ ПРИ СКРОЛЛЕ
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealElements.forEach(el => observer.observe(el));

// ФИЛЬТР МЕНЮ
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        menuCards.forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// МОДАЛКА КАСТОМИЗАЦИИ
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const totalPrice = document.getElementById('totalPrice');
let currentDrink = { name: '', price: 0, type: '' };
let customOptions = { shots: '2', roast: 'light', syrup: 'none', milk: 'regular', foam: 'yes', size: 'S' };
const priceAddons = {
    shots: { '1': -20, '2': 0, '3': 30 },
    syrup: { 'none': 0, 'vanilla': 30, 'caramel': 30, 'chocolate': 40, 'hazelnut': 40, 'cinnamon': 20 },
    milk: { 'regular': 0, 'oat': 40, 'almond': 50, 'coconut': 50 },
    size: { 'S': 0, 'M': 40, 'L': 80 }
};

document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentDrink.name = btn.dataset.name;
        currentDrink.price = parseInt(btn.dataset.price);
        currentDrink.type = btn.dataset.type;
        modalTitle.textContent = currentDrink.name;
        const isCoffee = currentDrink.type === 'coffee';
        const hasMilk = currentDrink.type === 'coffee' || currentDrink.type === 'cold';
        document.getElementById('shotsGroup').style.display = isCoffee ? 'block' : 'none';
        document.getElementById('roastGroup').style.display = isCoffee ? 'block' : 'none';
        document.getElementById('syrupGroup').style.display = hasMilk ? 'block' : 'none';
        document.getElementById('milkGroup').style.display = hasMilk ? 'block' : 'none';
        document.getElementById('foamGroup').style.display = isCoffee ? 'block' : 'none';
        document.getElementById('sizeGroup').style.display = 'block';
        customOptions = { shots: '2', roast: 'light', syrup: 'none', milk: 'regular', foam: 'yes', size: 'S' };
        resetOptionButtons();
        updatePrice();
        modalOverlay.classList.add('active');
    });
});

if (document.getElementById('modalClose')) {
    document.getElementById('modalClose').addEventListener('click', () => modalOverlay.classList.remove('active'));
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });
}

document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.shots) customOptions.shots = btn.dataset.shots;
        if (btn.dataset.roast) customOptions.roast = btn.dataset.roast;
        if (btn.dataset.syrup) customOptions.syrup = btn.dataset.syrup;
        if (btn.dataset.milk) customOptions.milk = btn.dataset.milk;
        if (btn.dataset.foam) customOptions.foam = btn.dataset.foam;
        if (btn.dataset.size) customOptions.size = btn.dataset.size;
        updatePrice();
    });
});

function updatePrice() {
    let total = currentDrink.price;
    if (currentDrink.type === 'coffee') total += priceAddons.shots[customOptions.shots] || 0;
    total += priceAddons.syrup[customOptions.syrup] || 0;
    total += priceAddons.milk[customOptions.milk] || 0;
    total += priceAddons.size[customOptions.size] || 0;
    if (totalPrice) totalPrice.textContent = total + ' \u20bd';
}

function resetOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-shots="2"]')?.classList.add('active');
    document.querySelector('[data-roast="light"]')?.classList.add('active');
    document.querySelector('[data-syrup="none"]')?.classList.add('active');
    document.querySelector('[data-milk="regular"]')?.classList.add('active');
    document.querySelector('[data-foam="yes"]')?.classList.add('active');
    document.querySelector('[data-size="S"]')?.classList.add('active');
}

if (document.getElementById('confirmOrder')) {
    document.getElementById('confirmOrder').addEventListener('click', () => {
        fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drink: currentDrink.name, price: parseInt(totalPrice.textContent), options: { ...customOptions } })
        })
        .then(res => res.json())
        .then(() => { modalOverlay.classList.remove('active'); alert('Заказ принят: ' + currentDrink.name + ' — ' + totalPrice.textContent); })
        .catch(() => { modalOverlay.classList.remove('active'); alert('Заказ принят: ' + currentDrink.name + ' — ' + totalPrice.textContent); });
    });
}

// ЗВЁЗДНЫЙ РЕЙТИНГ
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('ratingInput');
stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        if (ratingInput) ratingInput.value = rating;
        stars.forEach((s, i) => { i < rating ? s.classList.add('active') : s.classList.remove('active'); });
    });
    star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        stars.forEach((s, i) => { s.style.color = i < rating ? 'var(--red)' : 'var(--dark-gray)'; });
    });
});
if (document.getElementById('ratingStars')) {
    document.getElementById('ratingStars').addEventListener('mouseleave', () => {
        const rating = parseInt(ratingInput.value);
        stars.forEach((s, i) => { s.style.color = i < rating ? 'var(--red)' : 'var(--dark-gray)'; });
    });
}

// ФОРМА ОТЗЫВА
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(reviewForm);
        const data = { name: formData.get('name'), city: formData.get('city'), rating: parseInt(formData.get('rating')), text: formData.get('text') };
        fetch('/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('reviewMessage').textContent = 'Спасибо за отзыв!';
            reviewForm.reset();
            stars.forEach(s => s.classList.add('active'));
            if (ratingInput) ratingInput.value = 5;
            const newCard = document.createElement('div');
            newCard.className = 'card reveal active';
            newCard.innerHTML = '<div class="review-stars">' + '\u2605'.repeat(data.rating) + '</div><p>' + data.text + '</p><span class="review-author">' + data.name + ', ' + data.city + '</span>';
            document.getElementById('reviewsGrid').prepend(newCard);
        })
        .catch(() => { document.getElementById('reviewMessage').textContent = 'Спасибо за отзыв!'; reviewForm.reset(); });
    });
}

// ФОРМА КОНТАКТОВ
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = { name: formData.get('name'), email: formData.get('email'), message: formData.get('message') };
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => { document.getElementById('contactMessage').textContent = 'Сообщение отправлено! Мы свяжемся с вами.'; contactForm.reset(); })
        .catch(() => { document.getElementById('contactMessage').textContent = 'Сообщение отправлено!'; contactForm.reset(); });
    });
}
