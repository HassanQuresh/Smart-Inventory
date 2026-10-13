"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { createProduct } from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "Manager") {
      router.replace("/products");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role !== "Manager") {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/products")}
          className="cursor-pointer mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <span aria-hidden="true">←</span>
          Back to products
        </button>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            INVENTORY MANAGEMENT
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Add a product
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Add a new item to your catalog. Enter its name, category, price,
            and starting stock quantity.
          </p>
        </div>

        <ProductForm
          includeStock
          submitLabel="Add product"
          onSubmit={createProduct}
          onSuccess={() => router.replace("/products")}
          onCancel={() => router.push("/products")}
        />

        <p className="mt-5 text-center text-xs text-slate-400">
          Your new product will be added to the inventory database.
        </p>
      </div>
    </main>
  );
}