// Product Data based on physical menu
const products = [
    // HAMBURGUESAS
    { id: 1, category: 'hamburguesas', name: 'Hamburguesa Normal', price: 6.00, desc: 'Carne o pollo, cremas, papas y ensalada.', image: 'assets/hamburguesa.png' },
    { id: 2, category: 'hamburguesas', name: 'Hamburguesa Especial', price: 7.00, desc: 'Res o pollo a la plancha, huevos, papas, cremas y ensalada.', image: 'assets/hamburguesa.png' },
    { id: 3, category: 'hamburguesas', name: 'Hamburguesa Super', price: 10.00, desc: 'Res o pollo, huevos, jamón, queso, papas, cremas y ensalada.', image: 'assets/hamburguesa.png' },
    { id: 4, category: 'hamburguesas', name: 'Hamburguesa BÚFALO', price: 13.00, desc: 'Res o pollo, huevos, jamón, doble queso, tocineta, doble papa y ensalada.', image: 'assets/hamburguesa.png' },
    
    // PERRO CALIENTE
    { id: 5, category: 'perros', name: 'Perro Caliente', price: 7.00, desc: 'Salchicha, papa, queso, cremas y ensalada.', image: 'assets/perro.png' },
    
    // SHAWARMA
    { id: 6, category: 'shawarma', name: 'Shawarma', price: 13.00, desc: 'Pan árabe, Pollo a la plancha, papa, cremas y ensalada.', image: 'assets/shawarma.png' },
    { id: 7, category: 'shawarma', name: 'Shawarma Mixto', price: 15.00, desc: 'Pan árabe, Carne y pollo a la plancha, papa, cremas y ensalada.', image: 'assets/shawarma.png' },
    
    // CHAUFA BROASTER
    { id: 8, category: 'chaufa', name: 'Chaufa Broaster', price: 13.00, desc: 'Pollo broaster, arroz chaufa, papa, cremas y ensalada.', image: 'assets/chaufa.png' },
    
    // SALCHIPAPA
    { id: 9, category: 'salchipapa', name: 'Salchipapa', price: 8.00, desc: 'Hot dog, queso, papa, cremas y ensalada.', image: 'assets/salchipapa.png' },
    
    // ALITAS
    { id: 10, category: 'alitas', name: 'Alitas BBQ / Acevichadas', price: 13.00, desc: 'Alitas bañadas en salsa (BBQ, Acevichadas o Maracuya) con guarnición.', image: 'assets/alitas.png' }
];

let cart = [];
let currentLocation = null;
let currentProductToEdit = null;

// DOM Elements
const productsContainer = document.getElementById('products-container');
const categoryButtons = document.querySelectorAll('.category-item');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartList = document.getElementById('cart-list');
const totalPriceEl = document.getElementById('total-price');
const cartCountEl = document.getElementById('cart-count');
const modal = document.getElementById('customize-modal');
const closeModal = document.querySelector('.close-modal');
const confirmAddBtn = document.getElementById('confirm-add');
const locationBtn = document.getElementById('get-location');
const locationDisplay = document.getElementById('location-display');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    renderProducts(null); // Show all by default
});

// Render Products
function renderProducts(category) {
    productsContainer.innerHTML = '';
    const filtered = category ? products.filter(p => p.category === category) : products;
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="price">S/ ${product.price.toFixed(2)}</span>
                <button class="add-btn" onclick="openCustomization(${product.id})">AGREGAR</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// Category Filtering
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    });
});

// Modal Logic
function openCustomization(productId) {
    currentProductToEdit = products.find(p => p.id === productId);
    document.getElementById('modal-product-name').innerText = currentProductToEdit.name;
    
    // Reset checkboxes
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    modal.style.display = 'block';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

confirmAddBtn.onclick = () => {
    const selectedCremas = [];
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => selectedCremas.push(cb.value));
    
    addToCart(currentProductToEdit, selectedCremas);
    modal.style.display = 'none';
};

// Cart Logic
function addToCart(product, cremas) {
    // We treat each "add" as a separate line item because they could have different cremas
    cart.push({
        ...product,
        uniqueId: Date.now() + Math.random(), // Unique ID for separate item config
        cremas: cremas
    });
    
    updateCart();
    openCart();
}

function updateCart() {
    cartList.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="cremas-list">Cremas: ${item.cremas.join(', ') || 'Niguna'}</div>
                <div class="item-price">S/ ${item.price.toFixed(2)}</div>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color: #ff4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
        `;
        cartList.appendChild(itemEl);
    });
    
    totalPriceEl.innerText = `S/ ${total.toFixed(2)}`;
    cartCountEl.innerText = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function openCart() {
    cartSidebar.classList.add('active');
}

cartBtn.onclick = openCart;
closeCart.onclick = () => cartSidebar.classList.remove('active');

// Geolocation
locationBtn.onclick = () => {
    if ("geolocation" in navigator) {
        locationBtn.innerText = "CAPTurando...";
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            currentLocation = { lat, lng };
            
            locationDisplay.innerHTML = `
                <div style="color: #4CAF50; font-weight: bold;">Ubicación Capturada ✓</div>
                <div style="margin-top:5px; padding: 5px; border: 1px solid #333; border-radius: 5px;">
                   Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
                </div>
            `;
            locationBtn.innerHTML = '<i class="fas fa-check"></i> UBICACIÓN FIJADA';
            locationBtn.style.borderColor = "#4CAF50";
        }, (error) => {
            console.error("Error geoloc:", error);
            let errorMsg = "Error al obtener ubicación.";
            if (error.code === 1) errorMsg = "Permiso denegado. Activa el GPS.";
            else if (error.code === 2) errorMsg = "Ubicación no disponible.";
            else if (error.code === 3) errorMsg = "Tiempo de espera agotado.";
            
            alert(errorMsg);
            locationBtn.innerText = "REINTENTAR";
        }, options);
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
};

// WhatsApp Order
checkoutBtn.onclick = () => {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let message = "🍔 *Nuevo Pedido - +BÚFALO*\n\n";
    
    // Grouping by product name and cremas for cleaner message
    cart.forEach(item => {
        message += `✅ *1 x ${item.name}*\n`;
        message += `   _Cremas:_ ${item.cremas.join(', ') || 'Sin cremas'}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `💰 *Total a pagar: S/ ${total.toFixed(2)}*\n\n`;

    if (currentLocation) {
        message += `📍 *Ubicación de entrega:*\nhttps://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
    } else {
        message += `📍 *Ubicación:* No proporcionada (Coordinar por aquí)`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51922818179?text=${encodedMessage}`);
};
