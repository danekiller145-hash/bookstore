const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const cartSidebar = document.getElementById("cartSidebar");
const cartOpen = document.getElementById("cartOpen");
const closeCart = document.getElementById("closeCart");
const clearCart = document.getElementById("clearCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.querySelector(".cart-items");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
const searchInput = document.getElementById("searchInput");

// Рекомендации
const recommendAuthor = document.querySelector(".recommend-author");
const recommendBookYear = document.querySelector(".recommend-book-year");
const recommendPopular = document.querySelector(".recommend-popular");
const resetRecommends = document.querySelector(".reset-recommend");

// =========================
// LOCAL STORAGE
// =========================

let cart = JSON.parse(localStorage.getItem("bookCart")) || [];

updateCartCounter();
renderCart();

// =========================
// BURGER MENU
// =========================

burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
});

// =========================
// CART OPEN
// =========================

cartOpen.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
});

// =========================
// CART CLOSE
// =========================

closeCart.addEventListener("click", closePanels);
overlay.addEventListener("click", closePanels);

function closePanels() {
    cartSidebar.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
}

// =========================
// SAVE STORAGE
// =========================

function saveCart() {
    localStorage.setItem("bookCart", JSON.stringify(cart));
}

// =========================
// COUNTER
// =========================

function updateCartCounter() {
    cartCount.textContent = cart.length;
}

// =========================
// RENDER CART
// =========================

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Корзина пуста</h3>
            </div>
        `;
        // Прячем кнопки в футере если корзина пуста
        const cartFooter = document.querySelector(".cart-footer");
        if (cartFooter) {
            cartFooter.style.display = "none";
        }
        return;
    }

    // Показываем кнопки если есть товары
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) {
        cartFooter.style.display = "block";
    }

    cart.forEach((item, index) => {
        const html = `
            <div class="cart-item">
                <img src="${item.image}" alt="">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <button class="remove-item" data-index="${index}">Удалить</button>
                </div>
            </div>
        `;
        cartItems.insertAdjacentHTML("beforeend", html);
    });

    bindRemoveButtons();
}

// =========================
// REMOVE ITEM
// =========================

function bindRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-item");

    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            saveCart();
            renderCart();
            updateCartCounter();
            showToast("Книга удалена");
        });
    });
}

// =========================
// ADD TO CART
// =========================

const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".card");
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            image: card.dataset.image
        };

        const exists = cart.find(item => item.id === product.id);

        if (exists) {
            showToast("Уже в корзине");
            return;
        }

        cart.push(product);
        saveCart();
        renderCart();
        updateCartCounter();
        button.classList.add("added");
        button.innerHTML = "✓ Добавлено";
        showToast("Книга добавлена");
    });
});

// =========================
// CLEAR CART
// =========================

clearCart.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
    updateCartCounter();
    resetButtons();
    showToast("Корзина очищена");
});

// =========================
// CHECKOUT (оплата)
// =========================

const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Корзина пуста");
            return;
        }
        showToast("Переход к оплате...");
        // Здесь будет логика перехода на страницу оплаты
        // window.location.href = "/checkout";
    });
}

// =========================
// RESET BUTTONS
// =========================

function resetButtons() {
    buyButtons.forEach(button => {
        button.classList.remove("added");
        button.innerHTML = "Купить";
    });
}

// =========================
// RESTORE BUTTONS
// =========================

function restoreButtons() {
    buyButtons.forEach(button => {
        const card = button.closest(".card");
        const exists = cart.find(item => item.id === card.dataset.id);
        if (exists) {
            button.classList.add("added");
            button.innerHTML = "✓ Добавлено";
        }
    });
}

restoreButtons();

// =========================
// ФИЛЬТРАЦИЯ ПО ЖАНРАМ И РЕКОМЕНДАЦИЯМ
// =========================

let activeCategory = "all";
let activeRecommend = "all";

function filterBooks() {
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardRecommend = card.dataset.recommend;
        
        const categoryMatch = activeCategory === "all" || cardCategory === activeCategory;
        
        let recommendMatch = activeRecommend === "all";
        if (!recommendMatch && cardRecommend) {
            const recommends = cardRecommend.split(' ');
            recommendMatch = recommends.includes(activeRecommend);
        }
        
        if (categoryMatch && recommendMatch) {
            card.style.display = "grid";
            setTimeout(() => {
                card.classList.remove("hidden");
            }, 10);
        } else {
            card.classList.add("hidden");
            setTimeout(() => {
                if (card.classList.contains("hidden")) {
                    card.style.display = "none";
                }
            }, 250);
        }
    });
}

// Фильтр по жанрам
filters.forEach(filter => {
    filter.addEventListener("click", () => {
        filters.forEach(item => {
            item.classList.remove("active");
        });
        filter.classList.add("active");
        
        activeCategory = filter.dataset.category;
        filterBooks();
    });
});

// Фильтр по рекомендациям
if (recommendAuthor) {
    recommendAuthor.addEventListener("click", () => {
        activeRecommend = "author-month";
        highlightRecommend("author-month");
        filterBooks();
    });
}

if (recommendBookYear) {
    recommendBookYear.addEventListener("click", () => {
        activeRecommend = "book-of-year";
        highlightRecommend("book-of-year");
        filterBooks();
    });
}

if (recommendPopular) {
    recommendPopular.addEventListener("click", () => {
        activeRecommend = "popular";
        highlightRecommend("popular");
        filterBooks();
    });
}

if (resetRecommends) {
    resetRecommends.addEventListener("click", () => {
        activeRecommend = "all";
        highlightRecommend(null);
        filterBooks();
    });
}

function highlightRecommend(active) {
    const recItems = document.querySelectorAll(".recommend-menu p");
    recItems.forEach(item => {
        item.classList.remove("active-recommend");
    });
    if (active) {
        const activeItem = document.querySelector(`.recommend-menu p[data-recommend="${active}"]`);
        if (activeItem) {
            activeItem.classList.add("active-recommend");
        }
    }
}

// =========================
// SEARCH
// =========================

searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();

    cards.forEach(card => {
        const title = card.dataset.name.toLowerCase();
        if (title.includes(value)) {
            card.style.display = "grid";
        } else {
            card.style.display = "none";
        }
    });
});

// =========================
// TOAST
// =========================

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}

// =========================
// ANIMATE ON SCROLL
// =========================

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll(".card, .category-block, .newsletter").forEach(el => {
    observer.observe(el);
});

// =========================
// STICKY HEADER
// =========================

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});