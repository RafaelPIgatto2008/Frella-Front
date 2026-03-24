import api from "./ApiUrl";

export const registerUser = async (userData) => {
    try{
        const response = await api.post("Auth/Register")
        return response.data
    }
    catch(error){
        throw error;
    }
}

export const login = async (userData) => {
    try{
        const response = await api.post("Auth/Login")
        return response.data;
    }
    catch{
        throw error;
    }
}