import api from "./api.js";

export const getDashboard = async () => {
  const { data } = await api.get("/api/dashboard");
  return data;
};
