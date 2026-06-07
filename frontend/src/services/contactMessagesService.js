import apiClient from "./apiClient";

const submitMessage = async (payload) => {
  const response = await apiClient.post("/api/support", payload);
  return response.data;
};

const fetchMessages = async (params = {}) => {
  return apiClient.get("/api/admin/support-messages", { params });
};

const markAsRead = async (id) => {
  const response = await apiClient.put(`/api/admin/support-messages/${id}/read`);
  return response.data;
};

const deleteMessage = async (id) => {
  return apiClient.delete(`/api/admin/support-messages/${id}`);
};

const contactMessagesService = {
  submitMessage,
  fetchMessages,
  markAsRead,
  deleteMessage,
};

export default contactMessagesService;
