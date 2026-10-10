"use client";
import { AuthContext } from "@/context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { getProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
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
      } finally {
        if (!ignore) {
          setProductsLoading(false);
        }
      }
    }
    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [setUser]);
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );
  if (productsLoading) {
    return <h1>Loading dashboard...</h1>
  }

  if (pageError) {
    return <h1>{pageError}</h1>;
  }
  return (
    <main>
      <section>
        <h1>Dashboard</h1>
        <p>Welcome, {user.username}!</p>
        <p>Role: {user.role}</p>
      </section>
      <section>
        <h2>Inventory Overview</h2>
        <div>
          <div>
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div>
            <h3>Low Stock</h3>
            <p>{lowStockProducts.length}</p>
          </div>
          <div>
            <h3>Inventory Value</h3>
            <p>${inventoryValue.toFixed(2)}</p>
          </div>
        </div>
      </section>
      <section>
        <h2>Quick Actions</h2>
        <button onClick={() => router.push("/products")}>
          Manage Products
        </button>
        {user.role === "Manager" && (
          <button onClick={() => router.push("/products/new")}>
            Add Product
          </button>
        )}
      </section>
    </main>
  );
}
