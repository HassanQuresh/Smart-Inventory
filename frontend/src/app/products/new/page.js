"use client"
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { createProduct } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function NewProduct() {
  const router = useRouter();
  const { user, isLoading } = useContext(AuthContext);
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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  function updateName(event) {
    setName(event.target.value);
  };
  function updatePrice(event) {
    setPrice(event.target.value);
  };
  function updateStock(event) {
    setStock(event.target.value);
  };
  function updateCategory(event) {
    setCategory(event.target.value);
  };
  async function handleCreateProduct() {
    setLoading(true);
    try {
      if (name === "" || price === "" || stock === "" || category === "" || isNaN(Number(price)) || Number(price) < 0.01 || !Number.isInteger(Number(stock)) || stock < 0) {
        setMessage("Invalid data for product creation");
        return;
      };
      const product = {
        name,
        price: Number(price),
        stock: Number(stock),
        category
      };
      const data = await createProduct(product);
      if (data?.status === 201) {
        setMessage("Product created successfully!");
        setName("");
        setPrice("");
        setStock("");
        setCategory("");
      } else {
        setMessage(data?.data?.message || "Failed to create product.");
      };
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error occurred.");
    } finally {
      setLoading(false);
    };
  };
  async function handleSubmit(event) {
    event.preventDefault();
    await handleCreateProduct();
  }
  function redirectToProducts() {
    router.push("/products");
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!user || user.role !== "Manager") {
    return null;
  }
  return (
    <>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <p>Product Name</p>
        <input type="text"
          value={name}
          placeholder="Name"
          onChange={updateName}
          required />
        <p>Price</p>
        <input type="number"
          value={price}
          placeholder="Price"
          onChange={updatePrice}
          min="0.01"
          step="0.01"
          required />
        <p>Stock</p>
        <input type="number" value={stock}
          placeholder="Stock"
          onChange={updateStock}
          min="0"
          step="1"
          required />
        <p>Category</p>
        <input type="text"
          value={category}
          placeholder="Category"
          onChange={updateCategory}
          required />
        <button type="button" onClick={redirectToProducts}>Cancel</button>
        <button type="submit" disabled={loading}>{loading ? "Adding Product" : "Add Product"}</button>
        <p>{message}</p>
      </form>
    </>
  );
};