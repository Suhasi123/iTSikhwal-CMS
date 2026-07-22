import api from "./api.js";

export const listBlogs = async (params = {}) => {
  const { data } = await api.get("/api/blogs", { params });
  return data;
};

export const getBlog = async (id) => {
  const { data } = await api.get(`/api/blogs/${id}`);
  return data;
}; 

export const createBlog = async (payload) => {
  const { data } = await api.post("/api/blogs", payload);
  return data;
};

export const updateBlog = async (id, payload) => {
  const { data } = await api.put(`/api/blogs/${id}`, payload);
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/api/blogs/${id}`);
  return data;
};

export const publishBlog = (id) => api.patch(`/api/blogs/${id}/publish`).then((r) => r.data);
export const archiveBlog = (id) => api.patch(`/api/blogs/${id}/archive`).then((r) => r.data);
export const restoreBlog = (id) => api.patch(`/api/blogs/${id}/restore`).then((r) => r.data);
export const featureBlog = (id, isFeatured) =>
  api.patch(`/api/blogs/${id}/feature`, { is_featured: isFeatured }).then((r) => r.data);

export const checkSlug = async (title) => {
  const { data } = await api.get("/api/blogs/check-slug", { params: { title } });
  return data;
};

export const deleteThumbnail = (id) =>
  api.delete(`/api/blogs/${id}/thumbnail`).then((r) => r.data);
export const deleteCover = (id) =>
  api.delete(`/api/blogs/${id}/cover-image`).then((r) => r.data);
