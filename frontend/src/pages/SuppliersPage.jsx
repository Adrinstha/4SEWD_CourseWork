import { useEffect, useState } from "react";
import EmptyState from "../components/common/EmptyState.jsx";
import KpiCard from "../components/common/KpiCard.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import SupplierForm from "../components/suppliers/SupplierForm.jsx";
import SupplierTable from "../components/suppliers/SupplierTable.jsx";
import { useAuth } from "../context/useAuth.js";
import * as productService from "../services/productService.js";
import { initializeDatabase } from "../services/seedService.js";
import * as supplierService from "../services/supplierService.js";

function SuppliersPage() {
  const { isAdmin } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let ignore = false;

    async function loadSuppliers() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        await initializeDatabase();

        const [storedSuppliers, storedProducts] = await Promise.all([
          supplierService.getAll(),
          productService.getAll(),
        ]);

        if (!ignore) {
          setSuppliers(storedSuppliers);
          setProducts(storedProducts);
        }
      } catch (error) {
        console.error("Unable to load suppliers:", error);
        if (!ignore) {
          setErrorMessage(
            "The suppliers list could not be loaded. Please refresh and try again.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      ignore = true;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(normalizedSearch) ||
      supplier.email.toLowerCase().includes(normalizedSearch) ||
      (supplier.notes && supplier.notes.toLowerCase().includes(normalizedSearch)),
  );

  async function handleDelete(supplierId) {
    if (!isAdmin) return;

    const supplierToDelete = suppliers.find((s) => s.id === supplierId);
    if (!supplierToDelete) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const hasProducts = await productService.hasProductsForSupplier(supplierId);
      if (hasProducts) {
        setErrorMessage(
          `Cannot delete supplier "${supplierToDelete.name}": Products are currently assigned to this supplier. Reassign or remove those products first.`,
        );
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete supplier "${supplierToDelete.name}"?`,
      );
      if (!confirmed) return;

      const updatedSuppliers = await supplierService.remove(supplierId);
      setSuppliers(updatedSuppliers);
      setSuccessMessage(`Supplier "${supplierToDelete.name}" deleted successfully.`);
    } catch (error) {
      console.error("Unable to delete supplier:", error);
      setErrorMessage("The supplier could not be deleted. Please try again.");
    }
  }

  function handleSupplierSaved(updatedSupplier) {
    setSuppliers((prev) => {
      const exists = prev.some((s) => s.id === updatedSupplier.id);
      if (exists) {
        return prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s));
      }
      return [...prev, updatedSupplier];
    });

    setSuccessMessage(
      editingSupplier
        ? `Supplier "${updatedSupplier.name}" updated successfully.`
        : `Supplier "${updatedSupplier.name}" added successfully.`,
    );

    setIsFormVisible(false);
    setEditingSupplier(null);
  }

  function handleOpenForm() {
    if (!isAdmin) return;
    setEditingSupplier(null);
    setIsFormVisible(true);
  }

  function handleCloseForm() {
    setIsFormVisible(false);
    setEditingSupplier(null);
  }

  function handleEditSupplier(supplier) {
    if (!isAdmin) return;
    setEditingSupplier(supplier);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    let aVal = "",
      bVal = "";
    if (sortField === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortField === "email") {
      aVal = a.email.toLowerCase();
      bVal = b.email.toLowerCase();
    } else {
      return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedSuppliers.length / pageSize) || 1;
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function renderContent() {
    if (isLoading) {
      return (
        <div className="status-message" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading suppliers...</p>
        </div>
      );
    }

    if (paginatedSuppliers.length > 0) {
      return (
        <>
          <SupplierTable
            suppliers={paginatedSuppliers}
            sortField={sortField}
            sortDirection={sortDirection}
            isAdmin={isAdmin}
            onSort={handleSort}
            onEdit={isAdmin ? handleEditSupplier : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedSuppliers.length}
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

    if (searchTerm.trim() !== "") {
      return (
        <EmptyState
          title="No matching suppliers"
          message="No suppliers match the current search term."
          actionLabel="Clear search"
          onAction={() => setSearchTerm("")}
        />
      );
    }

    return (
      <EmptyState
        title="No suppliers found"
        message={
          isAdmin
            ? "Add your first supplier to begin."
            : "No suppliers registered."
        }
        actionLabel={isAdmin ? "Add supplier" : undefined}
        onAction={isAdmin ? handleOpenForm : undefined}
      />
    );
  }

  const totalSuppliersCount = suppliers.length;
  const activeSuppliersCount = suppliers.filter((s) =>
    products.some((p) => p.supplierId === s.id),
  ).length;
  const unassignedSuppliersCount = totalSuppliersCount - activeSuppliersCount;

  return (
    <>
      <Navbar />

      <main className="page-shell" id="suppliers">
        <PageHeader
          eyebrow="Supplier management"
          title="Suppliers"
          description={
            isAdmin
              ? "View and manage the suppliers supplying products to your inventory."
              : "View the suppliers supplying products to your inventory."
          }
          actionLabel={
            isAdmin
              ? isFormVisible
                ? editingSupplier
                  ? "Cancel edit"
                  : "Close form"
                : "Add supplier"
              : undefined
          }
          onAction={
            isAdmin ? (isFormVisible ? handleCloseForm : handleOpenForm) : undefined
          }
        />

        <div className="kpi-grid">
          <KpiCard
            title="Total Suppliers"
            value={totalSuppliersCount}
            subtitle="Registered vendor partners"
            variant="primary"
          />
          <KpiCard
            title="Active Suppliers"
            value={activeSuppliersCount}
            subtitle="Suppliers with active inventory"
            variant="success"
          />
          <KpiCard
            title="Unassigned Suppliers"
            value={unassignedSuppliersCount}
            subtitle="No products currently linked"
            variant="warning"
          />
        </div>

        {isAdmin && isFormVisible && (
          <section
            className="content-panel product-form-panel"
            id="add-supplier"
          >
            <div className="section-heading">
              <div>
                <p className="page-header__eyebrow">Supplier details</p>
                <h2>
                  {editingSupplier
                    ? `Edit "${editingSupplier.name}"`
                    : "Add a new supplier"}
                </h2>
                <p>
                  {editingSupplier
                    ? "Update supplier contact information and details."
                    : "Enter supplier details and save to your database."}
                </p>
              </div>
            </div>

            <SupplierForm
              supplierToEdit={editingSupplier}
              onSupplierSaved={handleSupplierSaved}
              onCancel={handleCloseForm}
            />
          </section>
        )}

        <section className="content-panel">
          <div className="inventory-summary">
            <h2>Registered Suppliers</h2>
            {!isLoading && (
              <p>
                {searchTerm.trim() !== ""
                  ? `${filteredSuppliers.length} of ${suppliers.length}`
                  : suppliers.length}{" "}
                {suppliers.length === 1 ? "supplier" : "suppliers"}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="alert alert--error" role="alert" style={{ marginBottom: "1rem" }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="alert alert--success" role="status" style={{ marginBottom: "1rem" }}>
              {successMessage}
            </div>
          )}

          <div className="toolbar" style={{ marginBottom: "1.5rem" }}>
            <input
              className="input"
              type="text"
              placeholder="Search suppliers by name, email, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>

          {renderContent()}
        </section>
      </main>
    </>
  );
}

export default SuppliersPage;
