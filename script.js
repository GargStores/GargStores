// 🛒 CART STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedCoupon = "";

// 📱 MENU
function toggleMenu() {
    document.getElementById("menu")?.classList.toggle("active");
}

// 🛒 CART TOGGLE
function toggleCart() {
    let box = document.getElementById("cart-box");
    if (!box) return;

    box.style.display = (box.style.display === "block") ? "none" : "block";
}

// ➕➖ QTY (PRODUCT PAGE)
function changeQty(btn, change) {
    let qtyBox = btn.closest(".qty");
    let qtySpan = qtyBox.querySelector("span");

    let qty = parseInt(qtySpan.innerText);
    qty += change;

    if (qty < 1) qty = 1;

    qtySpan.innerText = qty;
}

// 🛒 ADD TO CART
function addToCart(name, price, btn) {
    let qty = parseInt(
        btn.closest(".product-card").querySelector(".qty span").innerText
    );

    let item = cart.find(i => i.name === name);

    if (item) {
        item.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    saveCart();
    updateCart();

    alert(name + " added to cart ✅");
}

// ⚡ BUY NOW
function orderNow(name, price, btn) {
    addToCart(name, price, btn);
    toggleCart();
}

// ❌ REMOVE ITEM
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// 💾 SAVE
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 🎁 APPLY COUPON
function applyCoupon() {
    let code = document.getElementById("coupon")?.value.trim().toUpperCase();

    if (!code) {
        alert("Enter coupon!");
        return;
    }

    if (code === "GARG50" || code === "SAVE10" || code === "FREESHIP") {
        appliedCoupon = code;
        alert("Coupon Applied ✅");
    } else {
        appliedCoupon = "";
        alert("Invalid Coupon ❌");
    }

    updateCart();
}

// 🔄 UPDATE CART
function updateCart() {

    let cartItems = document.getElementById("cart-items");

    // RIGHT SIDE BOXES
    let subtotalBox = document.getElementById("subtotal");
    let deliveryBox = document.getElementById("delivery");
    let discountBox = document.getElementById("discount");
    let totalBox = document.getElementById("total");

    let countBox = document.getElementById("cart-count");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    // 🛒 EMPTY CART
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                🛒 Your cart is empty <br><br>
                <a href="products.html">Shop Now</a>
            </div>
        `;

        if (subtotalBox) subtotalBox.innerText = 0;
        if (deliveryBox) deliveryBox.innerText = 0;
        if (discountBox) discountBox.innerText = 0;
        if (totalBox) totalBox.innerText = 0;
        if (countBox) countBox.innerText = 0;

        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {

        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        cartItems.innerHTML += `
        <div class="cart-item">
            <div class="info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.qty}</p>
            </div>

            <div class="price">
                <p>₹${itemTotal}</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>`;
    });

    // 🚚 DELIVERY
    let delivery = (subtotal > 0 && subtotal < 499) ? 40 : 0;

    // 🎁 DISCOUNT
    let discount = 0;

    if (appliedCoupon === "GARG50") discount = 50;
    if (appliedCoupon === "SAVE10") discount = subtotal * 0.10;
    if (appliedCoupon === "FREESHIP") delivery = 0;

    // 💰 FINAL TOTAL
    let finalTotal = subtotal + delivery - discount;
    if (finalTotal < 0) finalTotal = 0;

    // ✅ UPDATE RIGHT SIDE
    if (subtotalBox) subtotalBox.innerText = Math.round(subtotal);
    if (deliveryBox) deliveryBox.innerText = Math.round(delivery);
    if (discountBox) discountBox.innerText = Math.round(discount);
    if (totalBox) totalBox.innerText = Math.round(finalTotal);

    // 🔢 CART COUNT
    let count = 0;
    cart.forEach(i => count += i.qty);
    if (countBox) countBox.innerText = count;
}

// 💳 CHECKOUT → WHATSAPP
function checkout() {

    if (cart.length === 0) {
        alert("Cart empty!");
        return;
    }

    let phone = "919872502860";

    let name = prompt("Enter your name:");
    let address = prompt("Enter your address:");

    let msg = "🛒 *Order - Garg General Store*%0A%0A";

    let subtotal = 0;

    cart.forEach(item => {
        let t = item.price * item.qty;
        subtotal += t;
        msg += `• ${item.name} x ${item.qty} = ₹${t}%0A`;
    });

    let delivery = (subtotal > 0 && subtotal < 499) ? 40 : 0;
    let discount = 0;

    if (appliedCoupon === "GARG50") discount = 50;
    if (appliedCoupon === "SAVE10") discount = subtotal * 0.10;
    if (appliedCoupon === "FREESHIP") delivery = 0;

    let finalTotal = subtotal + delivery - discount;

    msg += `%0A----------------%0A`;
    msg += `Subtotal: ₹${subtotal}%0A`;
    msg += `Delivery: ₹${delivery}%0A`;
    msg += `Discount: -₹${Math.round(discount)}%0A`;
    msg += `*Total: ₹${Math.round(finalTotal)}*%0A%0A`;

    if (name) msg += `Name: ${name}%0A`;
    if (address) msg += `Address: ${address}%0A`;

    window.location.href = `https://wa.me/${phone}?text=${msg}`;

    // RESET
    cart = [];
    saveCart();
    updateCart();
}

// 🚀 LOAD CART ON PAGE
window.onload = updateCart;