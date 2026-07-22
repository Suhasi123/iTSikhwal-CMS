import api from "./api.js";

export const login = async (email, password) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};
