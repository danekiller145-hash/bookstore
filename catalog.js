// ===== ДАННЫЕ КНИГ (как в data.js) =====
const catalogBooks = [
    {
        id: 1,
        name: "Throne Of Ice",
        author: "Marion Blackwood",
        price: 890,
        category: "adventure",
        rating: 5,
        description: "Вторая книга серии «Flame and Thorns». Продолжение истории о борьбе против тиранической династии.",
        image: "book1.jpg",
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Neverthorn",
        author: "Shannon Mayer",
        price: 750,
        category: "adventure",
        rating: 4,
        description: "Академия-фэнтези в жанре романтического фэнтези с элементами дарк-академии.",
        image: "book2.jpg",
        date: "2024-02-20"
    },
    {
        id: 3,
        name: "Taste Of Torment",
        author: "Stacey Trombley",
        price: 1200,
        category: "horror",
        rating: 5,
        description: "Третья книга серии Deep In Your Veins. Вампиры готовятся стать Великой Высокой Парой.",
        image: "book3.jpg",
        date: "2024-01-10"
    },
    {
        id: 4,
        name: "Realm Of Fear",
        author: "Miranda Joy",
        price: 950,
        category: "horror",
        rating: 4,
        description: "Эмилия пытается очистить имя сестры и раскрывает преступление.",
        image: "book4.jpg",
        date: "2024-03-05"
    },
    {
        id: 5,
        name: "Queen Of Roses",
        author: "Briar Boleyn",
        price: 680,
        category: "detective",
        rating: 5,
        description: "Моргана, полукровка фейри, отправляется на поиски Экскалибура.",
        image: "book5.jpg",
        date: "2024-02-28"
    },
    {
        id: 6,
        name: "Married To Pirate",
        author: "Athena Rose",
        price: 1100,
        category: "detective",
        rating: 4,
        description: "Под чёрным флагом любовь пробивается сквозь шторм недоверия.",
        image: "book6.jpg",
        date: "2024-03-10"
    }
];


const urlParams = new URLSearchParams(window.location.search);
const categoryFromUrl = urlParams.get('category');


let currentBooks = [...catalogBooks];
if (categoryFromUrl) {
    currentBooks = catalogBooks.filter(book => book.category === categoryFromUrl);
}


function renderCatalog(books) {
    const container = document.getElementById("catalogProducts");
    if (!container) return;
    
    container.innerHTML = "";
    
    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "catalog-card";
        card.setAttribute("data-id", book.id);
        card.setAttribute("data-name", book.name);
        card.setAttribute("data-image", book.image);
        
        card.innerHTML = `
            <img src="${book.image}" alt="${book.name}">
            <div class="catalog-card-info">
                <h3>${book.name}</h3>
                <span class="author">${book.author}</span>
                <div class="rating">${"★".repeat(book.rating)}${"☆".repeat(5-book.rating)}</div>
                <p>${book.description.substring(0, 100)}...</p>
                <div class="card-footer">
                    <span class="price">${book.price} ₽</span>
                    <button class="buy-btn-catalog">Купить</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    
    document.querySelectorAll(".buy-btn-catalog").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const book = books[index];
            addToCart(book);
        });
    });
}


function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("bookCart")) || [];
    
    const exists = cart.find(item => item.id == book.id);
    if (exists) {
        showToast("Уже в корзине");
        return;
    }
    
    cart.push({
        id: book.id,
        name: book.name,
        image: book.image
    });
    
    localStorage.setItem("bookCart", JSON.stringify(cart));
    updateCartCounter();
    showToast("Книга добавлена");
}


function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("bookCart")) || [];
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = cart.length;
}


function sortBooks(books, sortType) {
    const sorted = [...books];
    
    switch(sortType) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "newest":
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        default:
            return sorted;
    }
}


function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}


renderCatalog(currentBooks);

// ===== СОРТИРОВКА =====
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
        const sorted = sortBooks(currentBooks, e.target.value);
        renderCatalog(sorted);
    });
}


const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        let filtered = catalogBooks.filter(book => 
            book.name.toLowerCase().includes(value) || 
            book.author.toLowerCase().includes(value)
        );
        
        if (categoryFromUrl) {
            filtered = filtered.filter(book => book.category === categoryFromUrl);
        }
        
        const sortValue = sortSelect ? sortSelect.value : "default";
        const sorted = sortBooks(filtered, sortValue);
        renderCatalog(sorted);
        currentBooks = filtered;
    });
}


const cartOpen = document.getElementById("cartOpen");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

if (cartOpen) {
    cartOpen.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.add("active");
        if (overlay) overlay.classList.add("active");
        renderCartSidebar();
    });
}

if (closeCart) {
    closeCart.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    });
}

if (overlay) {
    overlay.addEventListener("click", () => {
        if (cartSidebar) cartSidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    });
}

function renderCartSidebar() {
    const cartItems = document.querySelector(".cart-items");
    const cart = JSON.parse(localStorage.getItem("bookCart")) || [];
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart"><h3>Корзина пуста</h3></div>`;
        return;
    }
    
    cartItems.innerHTML = "";
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
    
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const cart = JSON.parse(localStorage.getItem("bookCart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("bookCart", JSON.stringify(cart));
            renderCartSidebar();
            updateCartCounter();
            showToast("Книга удалена");
        });
    });
}


const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        localStorage.setItem("bookCart", JSON.stringify([]));
        renderCartSidebar();
        updateCartCounter();
        showToast("Корзина очищена");
    });
}


const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("bookCart")) || [];
        if (cart.length === 0) {
            showToast("Корзина пуста");
            return;
        }
        showToast("Переход к оплате...");
    });
}


const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav && overlay) {
    burger.addEventListener("click", () => {
        nav.classList.toggle("active");
        overlay.classList.toggle("active");
    });
}

// ===== ОБНОВЛЯЕМ СЧЕТЧИК ПРИ ЗАГРУЗКЕ =====
updateCartCounter();
