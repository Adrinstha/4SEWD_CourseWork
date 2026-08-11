import { useEffect, useState } from "react";
import EmptyState from "../components/common/EmptyState.jsx";
import KpiCard from "../components/common/KpiCard.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ProductDetailModal from "../components/products/ProductDetailModal.jsx";
import ProductForm from "../components/products/ProductForm.jsx";
import ProductTable from "../components/products/ProductTable.jsx";
import ProductToolbar from "../components/products/ProductToolbar.jsx";
import { useAuth } from "../context/useAuth.js";
import * as productService from "../services/productService.js";
import { initializeDatabase } from "../services/seedService.js";
import * as supplierService from "../services/supplierService.js";

function ProductsPage() {
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let ignore = false;

    async function loadInventory() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await initializeDatabase();

        const [storedProducts, storedSuppliers] = await Promise.all([
          productService.getAll(),
          supplierService.getAll(),
        ]);

        if (!ignore) {
          setProducts(storedProducts);
          setSuppliers(storedSuppliers);
        }
      } catch (error) {
        console.error("Unable to load inventory:", error);

        if (!ignore) {
          setErrorMessage(
            "The inventory could not be loaded. Please refresh the page and try again.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInventory();

    return () => {
      ignore = true;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const supplier = suppliers.find((item) => item.id === product.supplierId);
    const supplierName = supplier?.name ?? "";

    const matchesSearch =
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      supplierName.toLowerCase().includes(normalizedSearch);

    const matchesSupplier =
      selectedSupplier === "all" || product.supplierId === selectedSupplier;

    return matchesSearch && matchesSupplier;
  });

  const filtersAreActive =
    searchTerm.trim() !== "" || selectedSupplier !== "all";

  async function handleDelete(productId) {
    if (!isAdmin) return;

    const productToDelete = products.find(
      (product) => product.id === productId,
    );

    if (!productToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${productToDelete.name}" from the inventory?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      const updatedProducts = await productService.remove(productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Unable to delete product:", error);
      setErrorMessage("The product could not be deleted. Please try again.");
    }
  }

  function handleProductAdded(newProduct) {
    setProducts((previousProducts) => [...previousProducts, newProduct]);
    setSearchTerm("");
    setSelectedSupplier("all");
    setIsFormVisible(false);
    setEditingProduct(null);
  }

  function handleProductSaved(savedProduct) {
    setProducts((previousProducts) =>
      previousProducts.map((p) => (p.id === savedProduct.id ? savedProduct : p)),
    );
    setIsFormVisible(false);
    setEditingProduct(null);
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedSupplier("all");
  }

  function handleOpenForm() {
    if (!isAdmin) return;
    setEditingProduct(null);
    setIsFormVisible(true);
  }

  function handleCloseForm() {
    setIsFormVisible(false);
    setEditingProduct(null);
  }

  function handleEditProduct(product) {
    if (!isAdmin) return;
    setEditingProduct(product);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleViewProduct(product) {
    setViewingProduct(product);
  }

  function getSupplierName(supplierId) {
    const supplier = suppliers.find((item) => item.id === supplierId);
    return supplier?.name ?? "Unknown supplier";
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal, bVal;
    if (sortField === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortField === "supplier") {
      aVal = getSupplierName(a.supplierId).toLowerCase();
      bVal = getSupplierName(b.supplierId).toLowerCase();
    } else if (sortField === "price") {
      aVal = Number(a.price || 0);
      bVal = Number(b.price || 0);
    } else if (sortField === "quantity") {
      aVal = Number(a.quantity || 0);
      bVal = Number(b.quantity || 0);
    } else if (sortField === "status") {
      aVal = a.quantity === 0 ? 0 : a.quantity <= 10 ? 1 : 2;
      bVal = b.quantity === 0 ? 0 : b.quantity <= 10 ? 1 : 2;
    } else {
      return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function renderInventoryContent() {
    if (isLoading) {
      return (
        <div className="status-message" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading inventory...</p>
        </div>
      );
    }

    if (paginatedProducts.length > 0) {
      return (
        <>
          <ProductTable
            products={paginatedProducts}
            suppliers={suppliers}
            sortField={sortField}
            sortDirection={sortDirection}
            isAdmin={isAdmin}
            onSort={handleSort}
            onView={handleViewProduct}
            onEdit={isAdmin ? handleEditProduct : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </>
      );
    }

    if (filtersAreActive) {
      return (
        <EmptyState
          title="No matching products"
          message="No products match the current search and supplier filters."
          actionLabel="Clear filters"
          onAction={handleClearFilters}
        />
      );
    }

    return (
      <EmptyState
        title="No products found"
        message={
          isAdmin
            ? "Add your first product to begin managing your inventory."
            : "No products are currently available in the inventory."
        }
        actionLabel={isAdmin ? "Add product" : undefined}
        onAction={isAdmin ? handleOpenForm : undefined}
      />
    );
  }

  const totalProductsCount = products.length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
    0,
  );
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 10,
  ).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  const formattedTotalValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalInventoryValue);

  return (
    <>
      <Navbar />

      <main className="page-shell" id="products">
        <PageHeader
          eyebrow="Inventory management"
          title="Products"
          description={
            isAdmin
              ? "View and manage the products available in your inventory."
              : "View the products available in your inventory."
          }
          actionLabel={
            isAdmin
              ? isFormVisible
                ? editingProduct
                  ? "Cancel edit"
                  : "Close form"
                : "Add product"
              : undefined
          }
          onAction={
            isAdmin ? (isFormVisible ? handleCloseForm : handleOpenForm) : undefined
          }
        />

        <div className="kpi-grid">
          <KpiCard
            title="Total Products"
            value={totalProductsCount}
            subtitle="Registered inventory items"
            variant="primary"
          />
          <KpiCard
            title="Total Stock Value"
            value={formattedTotalValue}
            subtitle="Combined product valuation"
            variant="success"
          />
          <KpiCard
            title="Low Stock Warning"
            value={lowStockCount}
            subtitle="Items with ≤ 10 units"
            variant="warning"
          />
          <KpiCard
            title="Out of Stock"
            value={outOfStockCount}
            subtitle="Needs immediate reorder"
            variant="danger"
          />
        </div>

        {isAdmin && isFormVisible && (
          <section
            className="content-panel product-form-panel"
            id="add-product"
            aria-labelledby="add-product-heading"
          >
            <div className="section-heading">
              <div>
                <p className="page-header__eyebrow">Product details</p>

                <h2 id="add-product-heading">
                  {editingProduct
                    ? `Edit "${editingProduct.name}"`
                    : "Add a new product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product details and save changes to your inventory."
                    : "Enter the product information and save it to your inventory."}
                </p>
              </div>
            </div>

            <ProductForm
              suppliers={suppliers}
              productToEdit={editingProduct}
              onProductAdded={handleProductAdded}
              onProductSaved={handleProductSaved}
              onCancel={handleCloseForm}
            />
          </section>
        )}

        <section
          className="content-panel"
          aria-labelledby="product-list-heading"
        >
          <div className="inventory-summary">
            <h2 id="product-list-heading">Product inventory</h2>

            {!isLoading && (
              <p aria-live="polite">
                {filtersAreActive
                  ? `${filteredProducts.length} of ${products.length}`
                  : products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="alert alert--error" role="alert">
              {errorMessage}
            </div>
          )}

          <ProductToolbar
            suppliers={suppliers}
            searchTerm={searchTerm}
            selectedSupplier={selectedSupplier}
            onSearchChange={setSearchTerm}
            onSupplierChange={setSelectedSupplier}
          />

          {renderInventoryContent()}
        </section>

        {viewingProduct && (
          <ProductDetailModal
            product={viewingProduct}
            supplierName={getSupplierName(viewingProduct.supplierId)}
            onClose={() => setViewingProduct(null)}
          />
        )}
      </main>
    </>
  );
}

export default ProductsPage;
