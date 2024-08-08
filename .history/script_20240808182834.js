const HOST = "192.168.1.102"; // Replace with your actual host
const cart = []; // Initialize an empty array to store cart items
let total = 0;

// Function to add a product to the cart
function addToCart(productName, price, productId) {
  // Check if the product is already in the cart
  const existingProduct = cart.find((item) => item.productId === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    // Add the product to the cart
    const cartItem = {
      name: productName,
      price: price,
      productId: productId,
      quantity: 1,
    };
    cart.push(cartItem);
  }

  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("cart-row");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td class="quantity-flex">
        <button class="btn decrease-btn" onclick="decreaseQuantity(${index})">-</button>
        ${item.quantity}
        <button class="btn increase-btn" onclick="increaseQuantity(${index})">+</button>
      </td>
      <td><button class="btn delete-btn" onclick="removeFromCart(${index})">Delete</button></td>
    `;
    cartItems.appendChild(row);
    total += item.price * item.quantity;
  });

  updateTotal();
}

// Function to increase the quantity of a product in the cart
function increaseQuantity(index) {
  cart[index].quantity++;
  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    // Remove the product if the quantity is 1 and decrease button is clicked
    cart.splice(index, 1);
  }
  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to remove a product from the cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to update the total price
function updateTotal() {
  const totalPriceElement = document.getElementById("total-price");
  totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to fetch and display products (for Home page)
async function fetchAndDisplayProducts() {
  try {
    const response = await fetch(
      `http://${HOST}:5000/api/products?latest=true`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const container = document.getElementById("products-container");

    data.products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
        <img src="${product.img || "https://via.placeholder.com/250"}" alt="${
        product.title
      }">
        <h2 class="title">${product.title}</h2>
        <p class="desc">${product.desc}</p>
        <button onclick="viewProductDetails('${
          product._id
        }')">View Details</button>
        <button onclick="addToCart('${product.title}', ${product.price}, '${
        product._id
      }')">Add to Cart</button>
      `;

      container.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function viewProductDetails(productId) {
  window.location.href = `product.html?id=${productId}`;
}

// Function to load cart items from local storage
function loadCart() {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  if (storedCart) {
    storedCart.forEach((item) => cart.push(item));
    updateCart();
  }
}

// Highlight the active link in the navbar
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", function () {
    document
      .querySelectorAll("nav ul li a")
      .forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  });
});

// Optionally set the active class based on current page
function setActiveNav() {
  const currentRoute = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav ul li a").forEach((link) => {
    if (link.getAttribute("data-route") === currentRoute) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Call setActiveNav when the page loads
setActiveNav();

// Log-in & Sign-up
// Login function
async function login(data) {
  try {
    const response = await fetch(`http://${HOST}:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = new Error("HTTP error");
      error.response = response;
      throw error;
    }
    const responseData = await response.json();
    console.log(responseData);
    localStorage.setItem("token", responseData.accessToken);
    localStorage.setItem("email", responseData.email);
    localStorage.setItem("username", responseData.username);
    localStorage.setItem("_id", responseData._id);
    localStorage.setItem("success", true);
    localStorage.setItem("username", responseData.username);
    window.location.href = "./index.html";
    const username = document.getElementById("username").value;

    alert(`Welcome ${username}`);
    return responseData;
  } catch (error) {
    console.error(error);
    if (error.response) {
      const errorData = await error.response.json();
      return errorData;
    } else {
      return { message: "Network error or server is not reachable" };
    }
  }
}

// Attach login event listener
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = {
      username,
      password,
    };
    const result = await login(data);
    if (result && result.message) {
      document.getElementById("login-error").textContent = result.message;
    } else {
      document.getElementById("login-error").textContent = "";
    }
  });

// Sign up function
async function signUp(data) {
  try {
    const response = await fetch(`http://${HOST}:5000/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = new Error("HTTP error");
      error.response = response;
      throw error;
    }
    const responseData = await response.json();
    console.log(responseData);
    localStorage.setItem("token", responseData.accessToken);
    localStorage.setItem("email", responseData.email);
    localStorage.setItem("username", responseData.username);
    localStorage.setItem("_id", responseData._id);
    localStorage.setItem("success", true);
    window.location.href = "./index.html";
    const newUsername = document.getElementById("new-username").value;
    alert(`Account created for ${newUsername}`);
    return responseData;
  } catch (error) {
    console.error(error);
    if (error.response) {
      const errorData = await error.response.json();
      return errorData;
    } else {
      return { message: "Network error or server is not reachable" };
    }
  }
}

// Attach sign-up event listener
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const newUsername = document.getElementById("new-username").value;
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("new-password").value;
    const data = {
      username: newUsername,
      email,
      password: newPassword,
    };
    const result = await signUp(data);
    if (result && result.message) {
      document.getElementById("signup-error").textContent = result.message;
    } else {
      document.getElementById("signup-error").textContent = "";
    }
  });

// Add to cart
async function addItemsToCart(cartItems) {
  try {
    const response = await fetch(`http://${HOST}:5000/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${localStorage.getItem("token")}`, // Include token if required for authentication
      },
      body: JSON.stringify({ products: cartItems }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      document.getElementById("cart-error").textContent = responseData.message;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "./checkout.html";

    console.log("Cart updated successfully:", responseData);
  } catch (error) {
    console.error("Error adding items to cart:", error);
  }
}

// Function to load cart items from localStorage and post them
function postCartItems() {
  // Retrieve cart items from localStorage
  const storedCart = localStorage.getItem("cart");
  // Parse the stored cart items
  let cartItems = [];
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    // Map the parsed items to the required format
    cartItems = parsedCart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  } else {
    // Handle case where cart is empty
    alert("Cart is empty. Cannot add items to cart.");
    return; // Exit function early
  }
  // Call addItemsToCart with the cartItems
  addItemsToCart(cartItems);
}

// Make order
async function makeOrder(cartItems, deliveryData) {
  try {
    let headers;
    let data;
    if (localStorage.getItem("token")) {
      headers = {
        "Content-Type": "application/json",
        token: `Bearer ${localStorage.getItem("token")}`,
      };
      data = {
        userId: `${localStorage.getItem("_id")}`,
        name: `${localStorage.getItem("username")}`,
        email: `${localStorage.getItem("email")}`,
        address: deliveryData.address,
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
      data = {
        name: deliveryData.name,
        email: deliveryData.email,
        address: deliveryData.address,
      };
    }
    const response = await fetch(`http://${HOST}:5000/api/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ products: cartItems, ...data }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      document.getElementById("order-error").textContent = responseData.message;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "./order-success.html";

    console.log("Order created successfully:", responseData);
  } catch (error) {
    console.error("Error creating order:", error);
  }
}

// Function to load cart items from localStorage and post them
function postOrderItems(deliveryData) {
  // Retrieve cart items from localStorage
  const storedCart = localStorage.getItem("cart");
  // Parse the stored cart items
  let cartItems = [];
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    // Map the parsed items to the required format
    cartItems = parsedCart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  } else {
    // Handle case where cart is empty
    alert("Cart is empty. Cannot order empty cart.");
    return; // Exit function early
  }
  // Call addItemsToCart with the cartItems
  makeOrder(cartItems, deliveryData);
  localStorage.removeItem("cart");
}
