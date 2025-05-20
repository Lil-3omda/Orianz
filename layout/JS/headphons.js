import { addToCart, getCart } from "./cartHandler.js";
import { searchBar,addActiveToLinkes } from "./navBar.js";
let products = [];
let allProducts = [];
const productsPerPage = 15;
let currentPage = 1;

addActiveToLinkes();
window.addEventListener('popstate', function(event) {
  window.location.reload();
  });

async function fetchProducts() {
  const productsData = localStorage.getItem("products");
  if (productsData) {
    allProducts = JSON.parse(productsData);
    allProducts = allProducts.filter((product) => product.category === "headphones");
    products = [...allProducts];
  } else {
    console.error("No product founded");
    products = [];
  }
  displayProducts(currentPage);
  setupPagination();
}

try {
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    products = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    currentPage = 1;
    displayProducts(currentPage);
    setupPagination();
  });
}
catch (error) {
  window.location.reload();
 
}


function displayProducts(page) {
  if (!products || !Array.isArray(products) || products.length === 0) return;
  if (typeof productsPerPage !== "number" || productsPerPage <= 0) return;

  const filterableCards = document.getElementById("filterable-cards");


  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = products.slice(start, end);

  function renderProducts(productList) {
    filterableCards.innerHTML = productList
      .map(
        (product) => `
        <div class="card item p-2 m-4 mt-0">
            <img class="product-card" src="${product.img}" alt="" data-id="${product.id}">
            <div class="card-body">
                <h6 class="card-title fs-5">${product.name}</h6>
                <p class="card-description">${product.category}</p>
                <p class="card-description">${product.price} EGP</p>
                <button data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' class="btn cartBtn">Add to Cart<i class="fa-solid fa-cart-plus ms-1"></i></button>
            </div>
        </div>
      `
      )
      .join("");
  }

  function setActiveFilter(activeId) {
    ["all", "best-seller", "premium", "economic"].forEach((id) => {
      document.getElementById(id).classList.toggle("active", id === activeId);
    });
  }

  renderProducts(paginatedProducts);

  document.getElementById("all").addEventListener("click", () => {
    setActiveFilter("all");
    renderProducts(products);
  });

  document.getElementById("best-seller").addEventListener("click", () => {
    setActiveFilter("best-seller");
    const bestSellers = products.filter((product) => product.sold >= 7);
    renderProducts(bestSellers);
  });

  document.getElementById("premium").addEventListener("click", () => {
    setActiveFilter("premium");
    const premiumProducts = products.filter((product) => product.price >= 10000);
    renderProducts(premiumProducts);
  });

  document.getElementById("economic").addEventListener("click", () => {
    setActiveFilter("economic");
    const economicProducts = products.filter((product) => product.price <= 1000);
    renderProducts(economicProducts);
  });

  filterableCards.addEventListener("click", (e) => {
    if (e.target.classList.contains("product-card")) {
      const productId = e.target.dataset.id;
      console.log(`Navigating to product ${productId}`);
      window.location.href = `productDetails.html?productId=${productId}`;
    }
  });
  filterableCards.addEventListener("click", (e) => {
      if (e.target.classList.contains("cartBtn")) {
        addToCart(e.target.dataset.product);
      }
    });
}


function setupPagination() {
  const pageCount = Math.ceil(products.length / productsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prev = document.createElement("li");
  prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayProducts(currentPage);
      setupPagination();
    }
  });
  pagination.appendChild(prev);

  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement("li");
    pageBtn.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageBtn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayProducts(currentPage);
      setupPagination();
    });
    pagination.appendChild(pageBtn);
  }

  const next = document.createElement("li");
  next.className = `page-item ${currentPage === pageCount ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">Next</a>`;
  next.addEventListener("click", () => {
    if (currentPage < pageCount) {
      currentPage++;
      displayProducts(currentPage);
      setupPagination();
    }
  });
  pagination.appendChild(next);
}
fetchProducts();
