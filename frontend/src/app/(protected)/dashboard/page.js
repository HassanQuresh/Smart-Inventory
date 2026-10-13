"use client";

import { AuthContext } from "@/context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

function PackageIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3zM3.5 7.5V17L12 21l8.5-4V7.5M12 12v9M7.75 5.25l8.5 4.5"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

function StatIcon({ type }) {
  const paths = {
    products: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M4 9h16M9 4v5" />
      </>
    ),
    stock: (
      <>
        <path d="M12 3 21 19H3L12 3z" />
        <path d="M12 9v4m0 3h.01" />
      </>
    ),
    value: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5c-.6-.7-1.5-1-3-1-1.7 0-2.8.8-2.8 2s1 2 2.8 2 2.8.8 2.8 2-1.1 2.2-2.8 2.2c-1.3 0-2.4-.5-3.1-1.3M12 5.5v13" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        const result = await getProducts();

        if (ignore) return;

        if (result.status === 200) {
          setProducts(Array.isArray(result.data) ? result.data : []);
        } else if (result.status === 401) {
          setUser(null);
          router.replace("/login");
        } else {
          setPageError(
            result.data?.message || "Failed to load your inventory."
          );
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setPageError("Unable to connect to the server. Please try again.");
        }
      } finally {
        if (!ignore) {
          setProductsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [setUser, router]);

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  const recentProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  if (productsLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <h1 className="mt-5 text-lg font-semibold text-slate-900">
            Loading your dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fetching your inventory...
          </p>
        </div>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <StatIcon type="stock" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Couldn&apos;t load inventory
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {pageError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const isManager = user?.role === "Manager";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>Workspace</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600">Dashboard</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back{user?.username ? `, ${user.username}` : ""}!
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Here&apos;s what&apos;s happening with your inventory today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {user?.role || "User"}
            </span>

            <Link
              href="/products"
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <PackageIcon className="h-4 w-4" />
              Manage products
            </Link>
          </div>
        </section>

        {/* Inventory overview */}
        <section className="mt-9">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Inventory overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A snapshot of your current stock and inventory value.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {/* Total products */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total products
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {totalProducts}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <StatIcon type="products" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Unique products in your inventory
              </p>
            </article>

            {/* Low stock */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Low stock items
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {lowStockProducts.length}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${lowStockProducts.length > 0
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                  <StatIcon type="stock" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Products with 5 units or fewer
              </p>
            </article>

            {/* Inventory value */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 xl:col-span-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Inventory value
                  </p>
                  <p className="mt-3 break-words text-3xl font-bold tracking-tight text-slate-900">
                    {formatCurrency(inventoryValue)}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <StatIcon type="value" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Total value of currently held stock
              </p>
            </article>
          </div>
        </section>

        {/* Low-stock alert */}
        {lowStockProducts.length > 0 && (
          <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <StatIcon type="stock" />
                </div>
                <div>
                  <h2 className="font-bold text-amber-950">
                    Low stock needs attention
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    {lowStockProducts.length}{" "}
                    {lowStockProducts.length === 1 ? "product has" : "products have"}{" "}
                    5 or fewer units remaining. Review your stock levels.
                  </p>
                </div>
              </div>

              <Link
                href="/products"
                className="cursor-pointer inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-amber-900 transition hover:text-amber-700 sm:self-center"
              >
                Review inventory
                <ArrowRightIcon />
              </Link>
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section className="mt-9">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Jump straight to what you need to do.
            </p>
          </div>

          <div className={`grid gap-4 ${isManager ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
            <Link
              href="/products"
              className="cursor-pointer group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <PackageIcon />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Manage products
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    View products and manage stock levels.
                  </p>
                </div>
              </div>
              <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                <ArrowRightIcon />
              </span>
            </Link>

            {isManager && (
              <Link
                href="/products/new"
                className="cursor-pointer group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14m-7-7h14"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Add a product</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Add a new item to your inventory.
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  <ArrowRightIcon />
                </span>
              </Link>
            )}
          </div>
        </section>

        {/* Recent inventory */}
        <section className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent inventory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick look at your latest product records.
              </p>
            </div>

            <Link
              href="/products"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all products
              <ArrowRightIcon />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <PackageIcon />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your inventory will appear here once products are added.
              </p>
              {isManager && (
                <Link
                  href="/products/new"
                  className="cursor-pointer mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add your first product
                  <ArrowRightIcon />
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 md:hidden">
                {recentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock <= 5
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                        }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Product
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Category
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Unit price
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Stock
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <PackageIcon className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock <= 5
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                              }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(product.updatedAt || product.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          Smart Inventory · Inventory at a glance
        </footer>
      </div>
    </main>
  );
}