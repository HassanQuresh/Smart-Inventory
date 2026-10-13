"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

const categoryStyles = [
  {
    color: "bg-blue-600",
    iconStyle: "bg-blue-50 text-blue-700",
  },
  {
    color: "bg-emerald-500",
    iconStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    color: "bg-amber-500",
    iconStyle: "bg-amber-50 text-amber-700",
  },
  {
    color: "bg-violet-500",
    iconStyle: "bg-violet-50 text-violet-700",
  },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

function PackageIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M3 8v9l9 5 9-5V8" />
      <path d="M12 13v9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function FeatureIcon({ type }) {
  const paths = {
    products: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </>
    ),
    stock: (
      <>
        <path d="M3 17 9 11l4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    access: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

function LoadingValue() {
  return (
    <span
      className="inline-block h-7 w-16 animate-pulse rounded-md bg-slate-200"
      aria-label="Loading statistic"
    />
  );
}

function DashboardPreview({ stats, isLoading, error }) {
  const categories = stats?.categories ?? [];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-200/40 blur-3xl" />

      <div className="relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-400">
              LIVE OVERVIEW
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Inventory at a glance
            </h2>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live data
          </span>
        </div>

        {error ? (
          <div
            role="status"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <p className="text-sm font-semibold text-amber-900">
              Inventory statistics are temporarily unavailable.
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              Please try again shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Total products
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                    #
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {isLoading ? (
                    <LoadingValue />
                  ) : (
                    formatNumber(stats.totalProducts)
                  )}
                </p>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  Across all categories
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Units in stock
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                    <PackageIcon />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {isLoading ? (
                    <LoadingValue />
                  ) : (
                    formatNumber(stats.totalUnits)
                  )}
                </p>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  Combined stock quantity
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <p className="text-xs text-slate-500">
                  Total inventory value
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {isLoading ? (
                    <LoadingValue />
                  ) : (
                    formatCurrency(stats.inventoryValue)
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Unit price multiplied by stock quantity
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Products by category
                </h3>
                <span className="text-xs text-slate-400">
                  {isLoading
                    ? "Loading..."
                    : `${stats.totalCategories} ${stats.totalCategories === 1
                      ? "category"
                      : "categories"
                    }`}
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-5" aria-label="Loading categories">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-3 h-2 rounded-full bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No products have been added yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {categories.map((category, index) => {
                    const style =
                      categoryStyles[index % categoryStyles.length];

                    return (
                      <div key={category.name}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${style.iconStyle}`}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {category.percentage}% of products
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">
                              {formatNumber(category.count)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {category.count === 1 ? "product" : "products"}
                            </p>
                          </div>
                        </div>

                        <div
                          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-label={`${category.name} share of products`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={category.percentage}
                        >
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 ${style.color}`}
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-7 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-blue-700 shadow-sm">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold text-blue-900">
              Your inventory, organized.
            </p>
            <p className="mt-0.5 text-xs text-blue-700/80">
              Products and stock in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-2 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/10 sm:flex md:-right-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
          ✓
        </span>
        <div>
          <p className="text-xs font-bold text-slate-800">
            Stay organized
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Everything in its place
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured.");
        }

        const response = await fetch(
          `${baseUrl}/products/public-stats`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not load inventory statistics.");
        }

        const data = await response.json();

        if (
          !Number.isFinite(data.totalProducts) ||
          !Number.isFinite(data.totalUnits) ||
          !Number.isFinite(data.inventoryValue) ||
          !Number.isFinite(data.totalCategories) ||
          !Array.isArray(data.categories)
        ) {
          throw new Error("The statistics response has an invalid shape.");
        }

        if (!controller.signal.aborted) {
          setStats(data);
          setStatsError(false);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Failed to load public inventory statistics:", error);
          setStatsError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => controller.abort();
  }, []);

  if (isAuthLoading || user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-50 text-slate-500">
        <div className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
            <PackageIcon className="h-6 w-6" />
          </span>
          Smart Inventory
        </div>
        <div
          className="h-7 w-7 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600 motion-reduce:animate-none"
          aria-label="Loading"
        />
        <p className="text-sm">Getting everything ready...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="cursor-pointer flex shrink-0 items-center gap-2.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <PackageIcon className="h-6 w-6" />
          </span>
          Smart Inventory
        </Link>

        <div className="flex items-center gap-4 sm:gap-7">
          <Link
            href="/login"
            className="cursor-pointer text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="cursor-pointer group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:px-5"
          >
            Get started <ArrowIcon />
          </Link>
        </div>
      </nav>

      <section className="relative border-y border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/70">
        <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-[10px] font-bold tracking-[0.13em] text-blue-700 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              INVENTORY MANAGEMENT, SIMPLIFIED
            </div>

            <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Take control of your{" "}
              <span className="text-blue-600">inventory.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Track products, monitor stock levels, and keep your inventory
              organized with a workspace built for your team.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="cursor-pointer group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Get started <ArrowIcon />
              </Link>
              <Link
                href="/login"
                className="cursor-pointer inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700"
              >
                Sign in to your account
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-2.5 text-sm text-slate-500">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>
              Designed for managers and employees
            </div>
          </div>

          <div className="py-4 sm:px-3 lg:py-0">
            <DashboardPreview
              stats={stats}
              isLoading={isStatsLoading}
              error={statsError}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-3 lg:px-10">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
            <FeatureIcon type="products" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">
              Product management
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your product catalog organized and easy to manage.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
            <FeatureIcon type="stock" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Stock tracking</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update quantities and keep track of inventory changes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
            <FeatureIcon type="access" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Role-based access</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Support manager and employee workflows with separate
              permissions.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>
            © {new Date().getFullYear()} Smart Inventory. All rights reserved.
          </p>
          <p>Inventory management made simple.</p>
        </div>
      </footer>
    </main>
  );
}
