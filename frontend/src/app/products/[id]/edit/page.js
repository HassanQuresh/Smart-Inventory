"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getProduct, updateProduct } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const params = useParams();

  const productId = params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "Manager") {
      router.push("/products");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchProduct() {
      const result = await getProduct(productId);

      if (result.status === 200) {
        const product = result.data;

        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
      } else {
        setMessage(
          result.data?.message || "Unable to find product."
        );
      }

      setLoading(false);
    }

    if (!isLoading && user?.role === "Manager") {
      fetchProduct();
    }
  }, [productId, isLoading, user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      name === "" ||
      price === "" ||
      category === "" ||
      isNaN(Number(price)) ||
      Number(price) < 0.01
    ) {
      setMessage("Invalid data for product update.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const productData = {
        name,
        price: Number(price),
        category,
      };

      const result = await updateProduct(productId, productData);

      if (result.status === 200) {
        setMessage("Product updated successfully!");
      } else {
        setMessage(
          result.data?.message || "Failed to update product."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  function redirectToProducts() {
    router.push("/products");
  }

  if (isLoading || loading) {
    return <h1>Loading...</h1>;
  }

  if (!user || user.role !== "Manager") {
    return null;
  }

  return (
    <>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        <p>Product Name</p>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <p>Price</p>
        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <p>Category</p>
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />

        <button
          type="button"
          onClick={redirectToProducts}
        >
          Cancel
        </button>

        <button type="submit"
          disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <p>{message}</p>
      </form>
    </>
  );
}