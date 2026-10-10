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
    if (user.role !== "Manager") {
      router.replace("/products");
    }
  }, [user.role, router]);

  useEffect(() => {
    if (user.role !== "Manager") return;
    let ignore = false;

    async function fetchProduct() {
      const result = await getProduct(productId);
      if (ignore) return;
      if (result.status === 200) {
        setProduct(result.data);
      } else if (result.status === 404) {
        setPageError("Product not found.");
      } else {
        setPageError(result.data?.message || "Unable to load product.");
      }
      setLoading(false);
    }

    fetchProduct();
    return () => {
      ignore = true;
    };
  }, [productId, user.role]);
  if (isLoading || !user) {
    return <h1>Loading...</h1>;
  }
  if (user.role !== "Manager") {
    return null;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (pageError) {
    return (
      <>
        <h1>{pageError}</h1>
        <button onClick={() => router.push("/products")}>
          Back to Products
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Edit Product</h1>
      <ProductForm
        initialValues={product}
        submitLabel="Save Changes"
        onSubmit={(data) => updateProduct(productId, data)}
        onSuccess={() => router.push("/products")}
        onCancel={() => router.push("/products")}
      />
    </>
  );
}