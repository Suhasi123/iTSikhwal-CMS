import api from "./api.js";

export const listCategories = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/api/categories", payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/api/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/api/categories/${id}`);
  return data;
};
