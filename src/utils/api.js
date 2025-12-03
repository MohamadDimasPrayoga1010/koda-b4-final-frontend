const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}, token) => {
  let headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };


  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
    }
  }

  const config = { ...options, headers };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};
