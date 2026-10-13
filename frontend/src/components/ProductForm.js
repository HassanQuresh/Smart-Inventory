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
      trimmedName.length < 3 ||
      trimmedName.length > 100 ||
      !/^[a-zA-Z\s-]+$/.test(trimmedName) ||
      trimmedCategory === "" ||
      price.trim() === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0.01 ||
      (includeStock &&
        (stock.trim() === "" ||
          !Number.isInteger(numericStock) ||
          numericStock < 0))
    ) {
      setMessage(
        "Check your entries: use a valid product name, category, price, and stock quantity."
      );
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

      setMessage(
        result.data?.message || "Something went wrong. Please try again."
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50";

  const labelClass = "text-sm font-semibold text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-white px-5 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
            {includeStock ? "+" : "✎"}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {includeStock ? "Product details" : "Update product details"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {includeStock
                ? "Enter the details for the new item in your inventory."
                : "Update the information below and save your changes."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <div>
          <label htmlFor="name" className={labelClass}>
            Product name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Wireless Gaming Mouse"
            minLength={3}
            maxLength={100}
            autoComplete="off"
            disabled={saving}
            required
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            Use 3–100 characters. Letters, spaces, and hyphens are supported.
          </p>
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Electronics"
            disabled={saving}
            required
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            Choose a clear category to keep your inventory organized.
          </p>
        </div>

        <div className={includeStock ? "grid gap-6 sm:grid-cols-2" : ""}>
          <div>
            <label htmlFor="price" className={labelClass}>
              Unit price ($)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-slate-400">
                $
              </span>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                disabled={saving}
                required
                className={`${inputClass} pl-9`}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              The price must be at least 0.01.
            </p>
          </div>

          {includeStock && (
            <div>
              <label htmlFor="stock" className={labelClass}>
                Initial stock
              </label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                placeholder="e.g. 50"
                min="0"
                step="1"
                disabled={saving}
                required
                className={inputClass}
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter a whole number of units, including zero if needed.
              </p>
            </div>
          )}
        </div>

        {message && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
              !
            </span>
            <p>{message}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}