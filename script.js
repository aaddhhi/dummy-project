let allProducts = [];


const currentPage = window.location.pathname.split("/").pop()||"index.html";

// Registration Page
if (currentPage === "registration.html") {

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            const message = document.getElementById("registerMessage");
            message.style.display = "block";
            message.className = "message error";
            message.textContent = "❌ Passwords do not match!";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            message.style.display = "block";
            message.className = "message error";
            message.textContent = "❌ Email already registered!";
            return;
        }

        const newUser = {
            username,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));
        message.style.display = "block";
        message.className = "message success";
        message.textContent = "✅ Registration Successful!";
        setTimeout(() => {
        window.location.href = "index.html";
        }, 1500);

    });
}

// Login Page
if (currentPage === "index.html") {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();
        console.log("Login button clicked");

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(
            user => user.email === email && user.password === password
        );

        if (!validUser) {
            const message = document.getElementById("loginMessage");
            message.style.display = "block";
            message.className = "message error";
            message.textContent = "❌ Invalid Email or Password";
            return;
        }

        localStorage.setItem("loggedInUser", email);

        const message = document.getElementById("loginMessage");

        message.style.display = "block";
        message.className = "message success";
        message.textContent = "✅ Login Successful!";

        setTimeout(() => {
        window.location.href = "home.html";
        }, 1200);

    });
}

// Home Page
if (currentPage === "home.html") {

    fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {

        allProducts = data;

        console.log(allProducts);

        displayProducts(allProducts);

    })
    .catch(error => {
        console.log(error);
    });

    const loggedInEmail = localStorage.getItem("loggedInUser");

    const message = document.getElementById("loginMessage");

const loginRequired = localStorage.getItem("loginRequired");

if (loginRequired) {

    message.style.display = "block";
    message.className = "message error";
    message.textContent = "🔒 " + loginRequired;

    localStorage.removeItem("loginRequired");
}

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser = users.find(
        user => user.email === loggedInEmail
    );

    const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const searchValue =
        searchInput.value.toLowerCase();

    const filteredProducts =
        allProducts.filter(product =>
            product.title.toLowerCase()
            .includes(searchValue)
        );

    displayProducts(filteredProducts);

});

    if (currentUser) {
        document.getElementById("welcomeUser").textContent =
            `Welcome, ${currentUser.username}`;
    }
    updateCartCount();

    // Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    const message = document.getElementById("homeMessage");

    localStorage.removeItem("loggedInUser");

    message.style.display = "block";
    message.className = "message success";
    message.textContent = "✅ Logout Successful! Redirecting...";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1200);

});
}

function displayProducts(products) {

    const productContainer =
        document.getElementById("productContainer");

    productContainer.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p><strong>$${product.price}</strong></p>

            <p>⭐ ${product.rating.rate}</p>

            <p class="description">${product.description.substring(0, 80)}...</p>

            <button onclick="addToCart(${product.id})">
                Add To Cart
            </button>
        `;

        productContainer.appendChild(card);

    });

}

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

//add to cart
function addToCart(productId) {

    const product = allProducts.find(
        item => item.id === productId
    );

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

        showToast("🔄 Cart quantity updated!");

    } else {

        product.quantity = 1;

        cart.push(product);

        showToast("🛒 Product added to cart!", "success");

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
}

//cart count

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = `Cart (${totalItems})`;
    }

    const cartBtn = document.getElementById("cartCount");

if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
}
}
///cart open

function openCart(){

    document.getElementById("cartModal").style.display="flex";

    displayCart();
}

function closeCart(){

    document.getElementById("cartModal").style.display="none";
}
//display cart
function displayCart(){

    const cart=
    JSON.parse(localStorage.getItem("cart")) || [];

    const cartItems=
    document.getElementById("cartItems");

    cartItems.innerHTML="";

    let total=0;

    cart.forEach(item=>{

        total+=item.price*item.quantity;

        cartItems.innerHTML+=`

        <div class="cart-item">

            <img src="${item.image}">

            <div>

                <h4>${item.title}</h4>

                <p>$${item.price}</p>

                <p>Quantity : ${item.quantity}</p>

            </div>

            <button class="remove-btn"
            onclick="removeFromCart(${item.id})">

            Remove

            </button>

        </div>

        `;

    });

    document.getElementById("cartTotal").innerHTML=
    "Total : $"+total.toFixed(2);

}
//remove product
function removeFromCart(id){

    let cart=
    JSON.parse(localStorage.getItem("cart")) || [];

    cart=cart.filter(item=>item.id!==id);

    localStorage.setItem("cart",
    JSON.stringify(cart));

    updateCartCount();

    displayCart();

}