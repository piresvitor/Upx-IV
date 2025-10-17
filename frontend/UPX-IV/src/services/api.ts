import axios, { type AxiosError, type AxiosRequestHeaders } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const headers: AxiosRequestHeaders = config.headers ?? {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log({ error }, error.response?.status);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = window.location.origin;
    }

    return Promise.reject(error);
  }
);
