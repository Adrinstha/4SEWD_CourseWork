// Custom simple hashing function (non-reversible 64-bit polynomial rolling hash digest)
function hashPassword(password) {
  let hash1 = 5381;
  let hash2 = 1777;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash1 = (hash1 << 5) + hash1 + char;
    hash2 = (hash2 << 5) - hash2 + char;
  }
  return (hash1 >>> 0).toString(16) + (hash2 >>> 0).toString(16);
}

// LocalStorage Keys
const usersKey = "stockflow_users";
const productsKey = "stockflow_products";
const suppliersKey = "stockflow_suppliers";

// Seed Database if Empty
if (!localStorage.getItem(usersKey)) {
  const defaultUsers = [
    {
      email: "adrinshrestha16@gmail.com",
      passwordHash: hashPassword("admin123"),
    },
  ];
  localStorage.setItem(usersKey, JSON.stringify(defaultUsers));
}

if (!localStorage.getItem(suppliersKey)) {
  const defaultSuppliers = [
    {
      id: 1,
      name: "TechSource Nepal",
      email: "sales@techsource.example",
      phone: "+977 1 555 0101",
      notes: "",
    },
    {
      id: 2,
      name: "Office Hub",
      email: "orders@officehub.example",
      phone: "+977 1 555 0194",
      notes: "",
    },
    {
      id: 3,
      name: "Digital Traders",
      email: "contact@digitaltraders.example",
      phone: "+977 9800 111 222",
      notes: "",
    },
    {
      id: 4,
      name: "Workspace Nepal",
      email: "hello@workspace.example",
      phone: "+977 9800 333 444",
      notes: "",
    },
  ];
  localStorage.setItem(suppliersKey, JSON.stringify(defaultSuppliers));
}

if (!localStorage.getItem(productsKey)) {
  const defaultProducts = [
    {
      id: 1,
      name: "ProBook Laptop",
      description:
        "A reliable laptop for daily administrative and business tasks.",
      price: 899.0,
      quantity: 24,
      supplier: "TechSource Nepal",
      image: "assets/laptop.svg",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with adjustable DPI.",
      price: 28.5,
      quantity: 3,
      supplier: "Office Hub",
      image: "assets/mouse.svg",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      description: "Tactile mechanical keyboard with RGB backlighting.",
      price: 74.0,
      quantity: 18,
      supplier: "Digital Traders",
      image: "assets/keyboard.svg",
    },
    {
      id: 4,
      name: "USB Headset",
      description: "Noise-cancelling USB headset with high-quality microphone.",
      price: 52.0,
      quantity: 11,
      supplier: "TechSource Nepal",
      image: "assets/headset.svg",
    },
    {
      id: 5,
      name: "Smartphone X2",
      description:
        "Modern smartphone with high-resolution display and large battery capacity.",
      price: 620.0,
      quantity: 2,
      supplier: "Digital Traders",
      image: "assets/phone.svg",
    },
  ];
  localStorage.setItem(productsKey, JSON.stringify(defaultProducts));
}

// Database Helpers
function getProducts() {
  return JSON.parse(localStorage.getItem(productsKey)) || [];
}

function saveProducts(products) {
  localStorage.setItem(productsKey, JSON.stringify(products));
}

function getSuppliers() {
  return JSON.parse(localStorage.getItem(suppliersKey)) || [];
}

function saveSuppliers(suppliers) {
  localStorage.setItem(suppliersKey, JSON.stringify(suppliers));
}

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey)) || [];
}

// Route Protection
function checkAuthRedirect() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "index.html";
  }
}

// Logout and common setup on load
document.addEventListener("DOMContentLoaded", () => {
  // Setup logout link listener
  const logoutLinks = document.querySelectorAll('a[href="index.html"]');
  logoutLinks.forEach((link) => {
    link.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
    });
  });
});
