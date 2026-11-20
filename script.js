const products = [
  {id:1,name:"The Sunday Midi Dress",category:"Dresses",price:4290,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Soft Knit Everyday Top",category:"Tops",price:2490,tag:"NEW",image:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"The Weekend Co-ord",category:"Sets",price:5190,tag:"TRENDING",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Classic Wide-Leg Trousers",category:"Bottoms",price:3890,tag:"",image:"https://images.unsplash.com/photo-1506629905607-d9a3a2f4e5e3?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"The Linen Button Shirt",category:"Tops",price:3190,tag:"NEW",image:"https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Floral Day Dress",category:"Dresses",price:4590,tag:"",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Relaxed Two-Piece Set",category:"Sets",price:5490,tag:"LIMITED",image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Everyday Straight Jeans",category:"Bottoms",price:3690,tag:"",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85"}
];

const money = value => "Rs. " + Number(value).toLocaleString("en-PK");
const getCart = () => {
  try { return JSON.parse(localStorage.getItem("styleStudioCart")) || []; }
  catch { return []; }
};
const saveCart = cart => {
  localStorage.setItem("styleStudioCart", JSON.stringify(cart));
  updateCartCount();
};
function updateCartCount() {
  const count = getCart().reduce((sum,item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}
function productCard(product) {
  return `<article class="product-card">
    <div class="product-image-wrap">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      <button class="quick-add" data-add="${product.id}" type="button">ADD TO BAG +</button>
    </div>
    <div class="product-info"><span class="product-category">${product.category}</span><h3 class="product-name">${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
  </article>`;
}
function addToCart(id) {
  const cart = getCart();
  const found = cart.find(item => item.id === id);
  if (found) found.quantity += 1;
  else cart.push({id,quantity:1});
  saveCart(cart);
  renderCart();
  const button = document.querySelector(`[data-add="${id}"]`);
  if (button) {
    const original = button.textContent;
    button.textContent = "ADDED ✓";
    setTimeout(() => button.textContent = original, 1000);
  }
}
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<div class="empty-state">Your bag is waiting for something lovely.</div>';
  } else {
    container.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return "";
      return `<div class="cart-row">
        <img src="${product.image}" alt="${product.name}">
        <div><h3>${product.name}</h3><p>${money(product.price)} · ${product.category}</p></div>
        <div class="quantity-controls"><button type="button" data-qty="-1" data-id="${product.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-qty="1" data-id="${product.id}" aria-label="Increase quantity">+</button></div>
        <button class="remove-item" type="button" data-remove="${product.id}">REMOVE</button>
      </div>`;
    }).join("");
  }
  const total = cart.reduce((sum,item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  },0);
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = money(total);
}
function renderShop() {
  const container = document.getElementById("shop-products");
  if (!container) return;
  const search = (document.getElementById("search-input")?.value || "").trim().toLowerCase();
  const category = document.getElementById("category-filter")?.value || "all";
  const sort = document.getElementById("sort-filter")?.value || "featured";
  let filtered = products.filter(p => (category === "all" || p.category === category) && (p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)));
  if (sort === "low") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high") filtered.sort((a,b) => b.price - a.price);
  const count = document.getElementById("results-count");
  if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} to explore`;
  container.innerHTML = filtered.length ? filtered.map(productCard).join("") : '<div class="empty-state">No pieces found. Try changing your search or filters.</div>';
}
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(Number(add.dataset.add));
  const qty = event.target.closest("[data-qty]");
  if (qty) {
    const id = Number(qty.dataset.id), change = Number(qty.dataset.qty);
    const cart = getCart().map(item => item.id === id ? {...item,quantity:item.quantity + change} : item).filter(item => item.quantity > 0);
    saveCart(cart); renderCart();
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    saveCart(getCart().filter(item => item.id !== Number(remove.dataset.remove)));
    renderCart();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());
  updateCartCount();
  const featured = document.getElementById("featured-products");
  if (featured) featured.innerHTML = products.slice(0,4).map(productCard).join("");
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get("category");
  const categorySelect = document.getElementById("category-filter");
  if (categorySelect && categoryParam) {
    const match = [...categorySelect.options].find(option => option.value.toLowerCase() === categoryParam.trim().toLowerCase());
    if (match) categorySelect.value = match.value;
  }
  ["search-input","category-filter","sort-filter"].forEach(id => {
    document.getElementById(id)?.addEventListener(id === "search-input" ? "input" : "change", renderShop);
  });
  document.getElementById("clear-filters")?.addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("category-filter").value = "all";
    document.getElementById("sort-filter").value = "featured";
    renderShop();
  });
  renderShop();
  renderCart();
  document.getElementById("checkout-button")?.addEventListener("click", () => {
    const message = document.getElementById("checkout-message");
    if (!getCart().length) message.textContent = "Your bag is empty. Add a piece before checkout.";
    else message.textContent = "Thank you! This is a demo checkout, so no payment has been processed.";
  });
  document.getElementById("newsletter-form")?.addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("newsletter-message").textContent = "Thank you for joining the Style Letter!";
    event.target.reset();
  });
  document.getElementById("contact-form")?.addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("contact-feedback").textContent = "Thanks for your message! This demo form does not send data to a server.";
    event.target.reset();
  });
  const menuButton = document.querySelector(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });
});
