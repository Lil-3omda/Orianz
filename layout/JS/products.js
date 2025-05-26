import { addToCart, getCart } from "./cartHandler.js";
import { searchBar,addActiveToLinkes } from "./navBar.js";
let products = [];
let allProducts = [];
const productsPerPage = 15;
let currentPage = 1;

addActiveToLinkes();

async function fetchProducts() {
  const productsData = localStorage.getItem("products");
  if (productsData) {
    allProducts = JSON.parse(productsData);
    products=[...allProducts];
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
        <div class="card h-100 shadow-sm border-success border-opacity-25 m-3">
          <div class="position-relative">
            <img src="${product.img}" alt="${product.name}" class="card-img-top product-card" style="height: 200px; object-fit: cover; cursor: pointer;" data-id="${product.id}">
            ${product.hazardLevel ? `
              <span class="position-absolute top-0 end-0 m-2 badge ${
                product.hazardLevel.toLowerCase() === 'low' ? 'bg-success' :
                product.hazardLevel.toLowerCase() === 'medium' ? 'bg-warning text-dark' : 'bg-danger'
              }">${product.hazardLevel}</span>
            ` : ''}
            ${product.discount ? `
              <span class="position-absolute top-0 start-0 m-2 badge bg-danger">
                خصم ${product.discount}%
              </span>
            ` : ''}
          </div>
    
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-success fw-bold mb-1">${product.name}</h5>
            
            <!-- Basic Info -->
            <div class="mb-1">
              <div class="row g-2 small">
                <div class="col-12">
                  <span class="badge bg-light text-dark border me-1">
                    <i class="fa-solid fa-tag me-1"></i>${product.category}
                  </span>
                  ${product.brand ? `
                    <span class="badge bg-light text-dark border">
                      <i class="fa-solid fa-building me-1"></i>${product.brand}
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>
            <!-- Availability & Stock -->
            ${product.stock !== undefined ? `
              <div class="mb-1">
                <small class="text-muted">
                  <i class="fa-solid fa-warehouse me-1"></i>
                  المتوفر: 
                  <span class="${product.available > 10 ? 'text-success' : product.available > 0 ? 'text-warning' : 'text-danger'}">
                    ${product.available > 0 ? `${product.available} قطعة` : 'غير متوفر'}
                  </span>
                </small>
              </div>
            ` : ''}
            <!-- Price Section -->
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                  ${product.originalPrice && product.originalPrice > product.price ? `
                    <small class="text-muted text-decoration-line-through">${product.originalPrice} جنيه</small><br>
                  ` : ''}
                  <span class="h5 text-primary fw-bold mb-0">${product.price} جنيه</span>
                  ${product.unit ? `<br><small class="text-muted">للـ ${product.unit}</small>` : ''}
                </div>
                ${product.minOrder ? `
                  <small class="text-info">
                    <i class="fa-solid fa-shopping-basket me-1"></i>
                    الحد الأدنى: ${product.minOrder}
                  </small>
                ` : ''}
              </div>
              
              <button 
                data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' 
                class="btn btn-success w-100 fw-semibold cartBtn ${product.available === 0 ? 'disabled' : ''}"
                ${product.available === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-cart-plus me-2"></i>
                ${product.available === 0 ? 'غير متوفر' : 'اضف الي السلة'}
              </button>
            </div> 
          </div>
        </div>
        `
    )
    .join("");
}

  // function setActiveFilter(activeId) {
  //   ["all", "best-seller", "premium", "economic"].forEach((id) => {
  //     document.getElementById(id).classList.toggle("active", id === activeId);
  //   });
  // }

  // const filters = {
  //   "all": () => products,
  //   "best-seller": () => products.filter((product) => product.sold >= 50),
  //   "premium": () => products.filter((product) => product.price >= 60000),
  //   "economic": () => products.filter((product) => product.price <= 800),
  // };

  // Object.keys(filters).forEach((filterId) => {
  //   const element = document.getElementById(filterId);
  //   element.addEventListener("click", () => {
  //     setActiveFilter(filterId);
  //     renderProducts(filters[filterId]());
  //   });
  // });

  renderProducts(paginatedProducts);

  filterableCards.addEventListener("click", (e) => {
    if (e.target.classList.contains("product-card")) {
      const productId = e.target.dataset.id;
      window.location.href = `productDetails.html?productId=${productId}`;
    }
  });
  filterableCards.addEventListener("click", (e) => {
    const userId = sessionStorage.getItem("loggedInUserId") || "0";
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
  prev.innerHTML = `<a class="page-link" href="#">السابقة</a>`;
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
  next.innerHTML = `<a class="page-link" href="#">التالية</a>`;
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
