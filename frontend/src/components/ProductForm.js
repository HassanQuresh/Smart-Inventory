"use client";
import { useState } from "react";

export default function ProductForm({
  initialValues = {},
  includeStock = false,
  submitLabel,
  onSubmit,
  onSuccess,
  onCancel,
}) {
  const [name, setName] = useState(initialValues.name ?? "");
  const [price, setPrice] = useState(String(initialValues.price ?? ""));
  const [stock, setStock] = useState(String(initialValues.stock ?? ""));
  const [category, setCategory] = useState(initialValues.category ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      trimmedName === "" ||
      trimmedCategory === "" ||
      price === "" ||
      isNaN(numericPrice) ||
      numericPrice < 0.01 ||
      (includeStock &&
        (stock === "" || !Number.isInteger(numericStock) || numericStock < 0))
    ) {
      setMessage("Please fill in all fields with valid values.");
      return;
    }

    const payload = {
      name: trimmedName,
      price: numericPrice,
      category: trimmedCategory,
    };
    if (includeStock) {
      payload.stock = numericStock;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await onSubmit(payload);
      if (result.status >= 200 && result.status < 300) {
        onSuccess();
        return;
      }
      setMessage(result.data?.message || "Something went wrong. Please try again.");
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Product Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        min="0.01"
        step="0.01"
        required
      />

      {includeStock && (
        <>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            min="0"
            step="1"
            required
          />
        </>
      )}

      <label htmlFor="category">Category</label>
      <input
        id="category"
        type="text"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      />

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}