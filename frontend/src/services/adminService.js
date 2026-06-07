import apiClient from "./apiClient";

const fetchStats = () => apiClient.get("/api/admin/stats");

const fetchDbStatus = () => apiClient.get("/api/db/check");

const fetchResource = (resource, params = {}) =>
  apiClient.get(`/api/admin/${resource}`, { params });

const createResource = (resource, payload) =>
  apiClient.post(`/api/admin/${resource}`, payload);

const updateResource = (resource, id, payload) =>
  apiClient.put(`/api/admin/${resource}/${id}`, payload);

const deleteResource = (resource, id) =>
  apiClient.delete(`/api/admin/${resource}/${id}`);

const adminService = {
  fetchStats,
  fetchDbStatus,
  fetchResource,
  createResource,
  updateResource,
  deleteResource,
};

export default adminService;