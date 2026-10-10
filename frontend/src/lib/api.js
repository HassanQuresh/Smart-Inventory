const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
  };

  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${path}`, options);

    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: `Unexpected server response (${response.status})` };
    }

    return { status: response.status, data };
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      data: { message: "Unable to reach the server. Please try again." },
    };
  }
}

export const registerUser = (username, password) =>
  request("/auth/register", { method: "POST", body: { username, password } });

export const loginUser = (username, password) =>
  request("/auth/login", { method: "POST", body: { username, password } });

export const logoutUser = () => request("/auth/logout", { method: "POST" });

export const getCurrentUser = () => request("/auth/me");

export const getProducts = () => request("/products");

export const getProduct = (productId) => request(`/products/${productId}`);

export const createProduct = (productData) =>
  request("/products", { method: "POST", body: productData });

export const updateProduct = (productId, productData) =>
  request(`/products/${productId}`, { method: "PATCH", body: productData });

export const updateStock = (productId, change) =>
  request(`/products/${productId}/stock`, {
    method: "PATCH",
    body: { change },
  });

export const deleteProduct = (productId) =>
  request(`/products/${productId}`, { method: "DELETE" });
