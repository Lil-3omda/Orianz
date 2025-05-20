import { addToCart } from "./cartHandler.js";
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
const productsData = localStorage.getItem("products");

let products = [];

if (productsData) {
    products = JSON.parse(productsData).filter(product => product.id == productId);
} else {
    console.error("No product data found");
}

const productDetails = document.getElementById("productDetails");

if (products.length > 0) {
    const product = products[0];
    const description = product.description;

    const specList = Object.entries(description)
        .filter(([key, val]) => key !== 'content')
        .map(([key, val]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return `<p><strong>${label}:</strong> ${val}</p>`;
        }).join("");

    const highlights = description.content
        ? `<h4>Highlights:</h4><ul>${description.content.map(item => `<li>${item}</li>`).join("")}</ul>`
        : '';

    productDetails.innerHTML = `
        <div class="product-details row m-5" style="place-content: center;">
            <img src="${product.img}" alt="${product.name}"  class="product-image col-6">
            <div class="product-info col-6">
                <h2>${product.name}</h2>
                ${specList}
                ${highlights}
                <p><strong>Price:</strong> ${product.price} EGP</p>
                <button class="btn" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' id="addToCartBtn">Add to Cart</button>
            </div>
        </div>
    `;
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.addEventListener("click", () => {
        const productData = addToCartBtn.getAttribute("data-product");
        addToCart(productData);
    });
} else {
    productDetails.innerHTML = "<h5>Product not found.</h5>";
}
function getCartItemCount() {
    let totalCount = 0;        
    const cartKeys = Object.keys(localStorage).filter(key => key.startsWith("cart_"));
    cartKeys.forEach(key => {
    try {
        const cartItems = JSON.parse(localStorage.getItem(key)) || [];
        cartItems.forEach(item => {
        totalCount += item.quantity || 1;
        });
    } catch (e) {
        console.error("Error parsing cart data for key:", key);
    }
    });
    return totalCount;
}
window.addEventListener("DOMContentLoaded", function () {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
    cartCountEl.textContent = getCartItemCount();
    }
});
