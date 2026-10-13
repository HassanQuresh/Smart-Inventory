"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProducts, updateStock, deleteProduct } from "@/lib/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [changes, setChanges] = useState({});
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        const result = await getProducts();

        if (ignore) return;

        if (result.status === 200) {
          setProducts(result.data);
        } else if (result.status === 401) {
          setUser(null);
        } else {
          setPageError(
            result.data?.message || "Failed to load products."
          );
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setPageError("Unable to contact the server.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [setUser]);

  function handleChange(productId, value) {
    setChanges((previousChanges) => ({
      ...previousChanges,
      [productId]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [productId]: "",
    }));
  }

  async function handleUpdateStock(productId) {
    const change = Number(changes[productId]);

    if (
      changes[productId] === undefined ||
      changes[productId].trim() === "" ||
      !Number.isInteger(change) ||
      change === 0
    ) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: "Enter a non-zero whole number.",
      }));
      return;
    }

    setErrors((previousErrors) => ({
      ...previousErrors,
      [productId]: "",
    }));

    setUpdating((previousUpdating) => ({
      ...previousUpdating,
      [productId]: true,
    }));

    try {
      const result = await updateStock(productId, change);

      if (result.status === 200) {
        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product._id === productId ? result.data : product
          )
        );

        setChanges((previousChanges) => ({
          ...previousChanges,
          [productId]: "",
        }));
      } else {
        setErrors((previousErrors) => ({
          ...previousErrors,
          [productId]:
            result.data?.message ||
            `Server error (${result.status})`,
        }));
      }
    } catch (error) {
      console.error(error);

      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: "Unable to contact the server. Please try again.",
      }));
    } finally {
      setUpdating((previousUpdating) => ({
        ...previousUpdating,
        [productId]: false,
      }));
    }
  }

  async function handleDeleteProduct(productId) {
    setDeleting((previousDeleting) => ({
      ...previousDeleting,
      [productId]: true,
    }));
    setErrors((previousErrors) => ({
      ...previousErrors,
      [productId]: null,
    }));
    try {
      const result = await deleteProduct(productId);

      if (result.status === 200) {
        setProducts((previousProducts) =>
          previousProducts.filter(
            (product) => product._id !== productId
          )
        );
        return true;
      } else {
        setErrors((previousErrors) => ({
          ...previousErrors,
          [productId]:
            result.data?.message ||
            `Server error (${result.status})`,
        }));
        return false;
      }
    } catch (error) {
      console.error(error);
      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: "Unable to contact the server. Please try again.",
      }));
      return false;
    } finally {
      setDeleting((previousDeleting) => ({
        ...previousDeleting,
        [productId]: false,
      }));
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(inputValue.toLowerCase().trim())
  );

  const lowStockCount = products.filter(
    (product) => product.stock <= 5
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mb-8 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              INVENTORY MANAGEMENT
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your inventory, monitor stock levels, and keep your
              product catalog up to date.
            </p>
          </div>

          {user?.role === "Manager" && (
            <button
              onClick={() => router.push("/products/new")}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span className="text-xl leading-none">+</span>
              Add product
            </button>
          )}
        </section>

        {/* Summary cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total products
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {products.length}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Products in your catalog
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                ▦
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Low stock
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {lowStockCount}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Products with 5 units or fewer
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                !
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inventory value
                </p>
                <p className="mt-3 break-all text-3xl font-bold tracking-tight text-slate-900">
                  ${inventoryValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Based on price × current stock
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                $
              </span>
            </div>
          </div>
        </section>

        {/* Main inventory panel */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Product catalog
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {inputValue.trim() ? " found" : " available"}
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-lg text-slate-400">
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search by product name..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                aria-label="Search products by name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {pageError && (
            <div
              role="alert"
              className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {pageError}
            </div>
          )}

          {products.length === 0 && !pageError ? (
            <div className="px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                ▦
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No products yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your inventory is empty. Add your first product to start
                managing your stock.
              </p>

              {user?.role === "Manager" && (
                <button
                  onClick={() => router.push("/products/new")}
                  className="cursor-pointer mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add your first product
                </button>
              )}
            </div>
          ) : filteredProducts.length === 0 && !pageError ? (
            <div className="px-6 py-16 text-center">
              <span className="text-3xl text-slate-300">⌕</span>
              <h3 className="mt-3 font-semibold text-slate-900">
                No matching products
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another product name.
              </p>
              <button
                onClick={() => setInputValue("")}
                className="cursor-pointer mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= 5;

                return (
                  <article
                    key={product._id}
                    className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      {/* Product details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                            {product.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words text-base font-bold text-slate-900">
                                {product.name}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isLowStock
                                  ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                  }`}
                              >
                                {isLowStock ? "Low stock" : "In stock"}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {product.category}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
                              <div>
                                <p className="text-xs font-medium text-slate-500">
                                  Unit price
                                </p>
                                <p className="mt-1 font-semibold text-slate-900">
                                  ${Number(product.price).toFixed(2)}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-slate-500">
                                  Available quantity
                                </p>
                                <p
                                  className={`mt-1 font-semibold ${isLowStock
                                    ? "text-amber-700"
                                    : "text-slate-900"
                                    }`}
                                >
                                  {product.stock} units
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock controls and manager actions */}
                      <div className="w-full xl:max-w-md">
                        <label
                          htmlFor={`stock-${product._id}`}
                          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          Adjust stock
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            id={`stock-${product._id}`}
                            type="number"
                            step="1"
                            value={changes[product._id] ?? ""}
                            onChange={(event) =>
                              handleChange(product._id, event.target.value)
                            }
                            placeholder="+10 or -5"
                            aria-label={`Stock change for ${product.name}`}
                            aria-invalid={Boolean(errors[product._id])}
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                          />

                          <button
                            onClick={() => handleUpdateStock(product._id)}
                            disabled={Boolean(updating[product._id])}
                            className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updating[product._id]
                              ? "Updating..."
                              : "Update stock"}
                          </button>
                        </div>

                        {errors[product._id] && (
                          <p
                            role="alert"
                            className="mt-2 text-xs font-medium text-red-600"
                          >
                            {errors[product._id]}
                          </p>
                        )}

                        {user?.role === "Manager" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                router.push(`/products/${product._id}/edit`)
                              }
                              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              Edit product
                            </button>

                            <button
                              onClick={() => setProductToDelete(product)}
                              disabled={Boolean(deleting[product._id])}
                              className="cursor-pointer rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deleting[product._id] ? "Deleting..." : "Delete product"}
                            </button>

                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
            <p className="text-xs text-slate-500">
              Stock adjustments are saved to your inventory database.
            </p>
          </div>

          {productToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="m19 6-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                  </svg>
                </div>

                <h2
                  id="delete-modal-title"
                  className="mt-4 text-xl font-bold text-slate-900"
                >
                  Delete this product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-900">
                    {productToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                {errors[productToDelete._id] && (
                  <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {errors[productToDelete._id]}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setProductToDelete(null)}
                    disabled={Boolean(deleting[productToDelete._id])}
                    className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const deleted = await handleDeleteProduct(productToDelete._id);
                      if (deleted) {
                        setProductToDelete(null);
                      }
                    }}
                    disabled={Boolean(deleting[productToDelete._id])}
                    className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting[productToDelete._id]
                      ? "Deleting..."
                      : "Delete product"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}