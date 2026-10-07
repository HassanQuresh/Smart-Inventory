const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function registerUser(username, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function getProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}
export async function updateStock(productId, change) {
  const response = await fetch(`${API_URL}/products/${productId}/stock`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      change,
    }),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}
export async function createProduct(productData) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  return {
    status: response.status,
    data
  };
};
export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  return {
    status: response.status,
    data
  }
};
export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  return {
    status: response.status,
    data
  };
};