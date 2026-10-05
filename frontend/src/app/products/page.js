"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProducts, updateStock } from "@/lib/api";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [changes, setChanges] = useState({});
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState({});
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      if (!isLoading && user) {
        const data = await getProducts();
        if (!ignore) {
          setProducts(data.data);
        }
      }
    }
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [user, isLoading]);
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
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!user) {
    return <h1>You are not logged in.</h1>;
  }
  return (
    <>
      <h1>Products Page</h1>
      {products.length > 0 ? (
        products.map((product) => (
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
            {errors[product._id] && (
              <p>{errors[product._id]}</p>
            )}
          </div>
        ))
      ) : (
        <p>No Products Found</p>
      )}
    </>
  );
};