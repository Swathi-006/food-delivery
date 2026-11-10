
const foods = [
    {
        id: 1,
        name: "Cheese Burst Pizza",
        category: "Pizza",
        price: 249,
        oldPrice: 399,
        rating: "4.9",
        image: "https://images.unsplash.com/photo-157 pizza"
    },
    {
        id: 2,
        name: "Classic Cheese Burger",
        category: "Burger",
        price: 149,
        oldPrice: 249,
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 3,
        name: "Chicken Dum Biryani",
        category: "Biryani",
        price: 199,
        oldPrice: 299,
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600"
    },
    {
        id: 4,
        name: "Italian Pasta",
        category: "Chinese",
        price: 179,
        oldPrice: 249,
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600"
    },
    {
        id: 5,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 129,
        oldPrice: 199,
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    },
    {
        id: 6,
        name: "Delicious French Fries",
        category: "Burger",
        price: 99,
        oldPrice: 149,
        rating: "4.6",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600"
    },
    {
        id: 7,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 199,
        oldPrice: 299,
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600"
    },
    {
        id: 8,
        name: "Veg Fried Rice",
        category: "Chinese",
        price: 159,
        oldPrice: 229,
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600"
    },
    {
        id: 9,
        name: "Strawberry Dessert",
        category: "Dessert",
        price: 119,
        oldPrice: 179,
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600"
    }
];

// Fix the first pizza image URL
foods[0].image =
"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600";

let cart = JSON.parse(localStorage.getItem("craveCart")) || [];
let discount = 0;

const foodGrid = document.getElementById("food-grid");

// Display food products
function displayFoods(items) {
    foodGrid.innerHTML = "";

    if (items.length === 0) {
        foodGrid.innerHTML = "<p>No food items found 😢</p>";
        return;
    }

    items.forEach(food => {
        foodGrid.innerHTML += `
            <div class="food-card">
                <img src="${food.image}" alt="${food.name}"
                     loading="lazy">

                <div class="food-info">
                    <h3>${food.name}</h3>
                    <p>⭐ ${food.rating} | Fresh & Delicious</p>

                    <div>
                        <span class="food-price">₹${food.price}</span>
                        <span class="old-price">₹${food.oldPrice}</span>
                    </div>

                    <button onclick="addToCart(${food.id})">
                        + Add to Cart
                    </button>
                </div>
            </div>
        `;
    });
}

// Category filter
function filterFood(category) {
    const filtered = category === "All"
        ? foods
        : foods.filter(food => food.category === category);

    displayFoods(filtered);
}

// Search food
function searchFood() {
    const value = document.getElementById("search")
        .value.toLowerCase();

    const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(value) ||
        food.category.toLowerCase().includes(value)
    );

    displayFoods(filtered);
}

// Add food to cart
function addToCart(id) {
    const food = foods.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    saveCart();
    showToast(food.name + " added to cart! ❤️");
}

// Save cart
function saveCart() {
    localStorage.setItem("craveCart", JSON.stringify(cart));
    updateCart();
}

// Update cart
function updateCart() {
    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    cart.forEach(item => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeItem(${item.id})">🗑</button>
                </div>
            </div>
        `;
    });

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cart-count").textContent = count;

    calculateTotal();
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    saveCart();
}

// Remove item
function removeItem(id) {
    cart = cart.filter(food => food.id !== id);
    saveCart();
}

// Calculate total
function calculateTotal() {
    let subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    let delivery = subtotal > 0 && subtotal < 299 ? 30 : 0;
    let savings = Math.round(subtotal * discount / 100);

    let total = subtotal + delivery - savings;

    document.getElementById("cart-total").textContent =
        total.toFixed(2);

    document.getElementById("discount-info").textContent =
        `Subtotal: ₹${subtotal} | Delivery: ₹${delivery} | Discount: ₹${savings}`;
}

// Apply coupon
function applyCoupon() {
    const code = document.getElementById("coupon-code")
        .value.trim().toUpperCase();

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    if (subtotal === 0) {
        showToast("Add food to your cart first!");
        return;
    }

    if (code === "CRAVE50" && subtotal >= 199) {
        discount = 20;
        showToast("20% discount applied! 🎉");
    }
    else if (code === "BOGO") {
        discount = 10;
        showToast("10% discount applied! 🎁");
    }
    else if (code === "FREEDEL" && subtotal >= 299) {
        discount = 0;
        showToast("Free delivery unlocked! 🚀");
    }
    else {
        discount = 0;
        showToast("Invalid coupon or minimum order not reached!");
    }

    calculateTotal();
}

// Open and close cart
function toggleCart() {
    document.getElementById("cart-panel")
        .classList.toggle("active");

    document.getElementById("cart-overlay")
        .classList.toggle("active");
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    const total = document.getElementById("cart-total").textContent;

    alert(
        "🎉 Thank you for ordering from CraveKart!\n\n" +
        "Your order total is ₹" + total +
        "\n\nThis is a demo checkout. Connect a backend " +
        "and payment gateway for real orders."
    );

    cart = [];
    discount = 0;
    saveCart();

    document.getElementById("coupon-code").value = "";
    toggleCart();
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Initial display
displayFoods(foods);
updateCart();
