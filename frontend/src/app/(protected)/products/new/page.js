"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { createProduct } from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role !== "Manager") {
      router.replace("/products");
    }
  }, [user.role, router]);

  if (user.role !== "Manager") {
    return null;
  }

  return (
    <>
      <h1>Add New Product</h1>
      <ProductForm
        includeStock
        submitLabel="Add Product"
        onSubmit={createProduct}
        onSuccess={() => router.replace("/products")}
        onCancel={() => router.push("/products")}
      />
    </>
  );
}