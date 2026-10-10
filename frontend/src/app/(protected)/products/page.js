"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProducts, updateStock, deleteProduct } from "@/lib/api";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [changes, setChanges] = useState({});
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const { user, setUser } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [pageError, setPageError] = useState("");
  const router = useRouter();
  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      try {
        const result = await getProducts();
        if (ignore) return;
        if (result.status === 200) {
          setProducts(result.data);
        } else if (result.status === 401) {
          setUser(null);
        } else {
          setPageError(result.data?.message || "Failed to load products.");
        }
      } catch (error) {
        console.error(error);
        if (!ignore) setPageError("Unable to contact the server.");
      }
    }
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [setUser]);
  function handleChange(productId, value) {
    setChanges((previousChanges) => ({
      ...previousChanges,
      [productId]: value,
    }));
  };
  async function handleUpdateStock(productId) {
    try {
      const change = Number(changes[productId]);
      if (!Number.isInteger(change) || change === 0) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          [productId]: "Invalid or empty value for update"
        }));
        return;
      }
      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: ""
      }));
      setUpdating((previousUpdating) => ({
        ...previousUpdating,
        [productId]: true,
      }));
      const result = await updateStock(productId, change);
      if (result.status === 200) {
        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product._id === productId
              ? result.data
              : product
          )
        );
        setChanges((previousChanges) => ({
          ...previousChanges,
          [productId]: "",
        }));
      } else {
        const apiErrorMessage = result.data?.message || `Server error (${result.status})`;
        setErrors((previousErrors) => ({
          ...previousErrors,
          [productId]: apiErrorMessage,
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: "Unable to contact the server. Please try again"
      }));
    } finally {
      setUpdating((previousUpdating) => ({
        ...previousUpdating,
        [productId]: false,
      }));
    };
  }
  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeleting((previousDeleting) => ({
        ...previousDeleting,
        [productId]: true,
      }));
      const result = await deleteProduct(productId);
      if (result.status === 200) {
        setProducts((previousProducts) =>
          previousProducts.filter(
            (product) => product._id !== productId
          )
        );
      } else {
        const apiErrorMessage =
          result.data?.message || `Server error (${result.status})`;
        setErrors((previousErrors) => ({
          ...previousErrors,
          [productId]: apiErrorMessage,
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((previousErrors) => ({
        ...previousErrors,
        [productId]: "Unable to contact the server. Please try again",
      }));
    } finally {
      setDeleting((previousDeleting) => ({
        ...previousDeleting,
        [productId]: false,
      }));
    }
  }
  function updateInputValue(event) {
    setInputValue(event.target.value);
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  return (
    <>
      <h1>Products Page</h1>
      {user.role === "Manager" && (
        <button onClick={() => router.push("/products/new")}>
          Add Product
        </button>
      )}
      <input type="text" placeholder="Search products..." value={inputValue}
        onChange={updateInputValue} />
      {pageError && <p>{pageError}</p>}
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product._id}>
            <h2>{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <input type="number" value={changes[product._id] ?? ""}
              onChange={(event) => {
                handleChange(product._id, event.target.value);
              }} placeholder="Stock Change" />
            <button onClick={() => handleUpdateStock(product._id)}
              disabled={updating[product._id]}>
              {updating[product._id] ? "Updating..." : "Update Stock"}
            </button>
            <br />
            {user.role === "Manager" && (
              <button onClick={() => router.push(`/products/${product._id}/edit`)}>
                Edit
              </button>
            )}
            {user.role === "Manager" && <button
              onClick={() => handleDeleteProduct(product._id)}
              disabled={deleting[product._id]}
            >
              {deleting[product._id] ? "Deleting..." : "Delete"}
            </button>}
            {errors[product._id] && (
              <p>{errors[product._id]}</p>
            )}
          </div>
        ))
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <p>No products match your search.</p>
      )}
    </>
  );
};