"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { getProduct, updateProduct } from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default function EditProduct() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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

  useEffect(() => {
    if (isLoading || !user || user.role !== "Manager") return;

    let ignore = false;

    async function fetchProduct() {
      try {
        const result = await getProduct(productId);

        if (ignore) return;

        if (result.status === 200) {
          setProduct(result.data);
        } else if (result.status === 404) {
          setPageError("Product not found.");
        } else {
          setPageError(
            result.data?.message || "Unable to load product."
          );
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setPageError("Unable to contact the server.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [productId, isLoading, user]);

  if (isLoading || !user || user.role !== "Manager" || loading) {
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

  if (pageError || !product) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
            !
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            {pageError || "Product not found."}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The product may have been removed or may no longer be available.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="cursor-pointer mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to products
          </button>
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
            Edit product
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Update the details for{" "}
            <span className="font-semibold text-slate-700">
              {product.name}
            </span>
            .
          </p>
        </div>

        <ProductForm
          key={product._id}
          initialValues={product}
          submitLabel="Save changes"
          onSubmit={(data) => updateProduct(productId, data)}
          onSuccess={() => router.push("/products")}
          onCancel={() => router.push("/products")}
        />

        <p className="mt-5 text-center text-xs text-slate-400">
          Changes will be saved to your inventory database.
        </p>
      </div>
    </main>
  );
}