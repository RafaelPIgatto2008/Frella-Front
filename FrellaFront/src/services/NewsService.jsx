import api from "./ApiUrl";

export const getAllNews = async () => {
  try {
    const response = await api.get("News/Get-News");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewsById = async (id) => {
  try {
    const response = await api.get(`News/GetNewsById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
