import api from "./ApiUrl";

export const registerUser = async (userData) => {
  try{
    const response = await api.post("Auth/Register", userData);
    return response.data;
  }
  catch(error){
    throw error;
  }
}

export const login = async (userData) => {
  try{
    const response = await api.post("Auth/Login", userData);
    return response.data;
  }
  catch (error){
    throw error;
  }
}

export const getUserById = async () => {
  try{
    const response = await api.get("Auth/GetUserById");
    return response.data;
  }
  catch (error) {
    throw error
  }
}
