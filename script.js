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
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert("Email already registered!");
            return;
        }

        const newUser = {
            username,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration Successful!");

        window.location.href = "index.html";

    });
}

// Login Page
if (currentPage === "index.html") {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(
            user => user.email === email && user.password === password
        );

        if (!validUser) {
            alert("Invalid Email or Password");
            return;
        }

        localStorage.setItem("loggedInUser", email);

        alert("Login Successful!");

        window.location.href = "home.html";

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

    // If user is not logged in
    if (!loggedInEmail) {
        alert("Please Login First");
        window.location.href = "index.html.html";
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

        localStorage.removeItem("loggedInUser");

        alert("Logged Out Successfully");

        window.location.href = "login.html";
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

//add to cart
function addToCart(productId) {

    const selectedProduct =
        allProducts.find(product => product.id === productId);

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(selectedProduct);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Product Added To Cart");
}

//cart count

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent =
            `Cart (${cart.length})`;
    }
}
const searchInput = document.getElementById("searchInput");

if(searchInput){
searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    displayProducts(filteredProducts);
});
}