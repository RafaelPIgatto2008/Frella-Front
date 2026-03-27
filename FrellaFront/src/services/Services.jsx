import api from "./ApiUrl";

export const createService = async (serviceData) => {
  try {
    const response = await api.post("Service/Create-Service", serviceData);
    return response.data;
  } 
  catch (error) {
    throw error;
  }
};

export const getAllServices = async () => {
  try {
    const response = await api.get("Service/Get-Services");
    return response.data;
  } 
  catch (error) {
    throw error;
  }
};

export const getServiceById = async (id) => {
  try{
    const response = await api.get(`Service/${id}`);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const candidateToService = async (serviceId) => {
  try{
    const response = await api.post(`Service/Candidate-To-Service/${serviceId}`);
    return response.data;
  } 
  catch (error){
    throw error;
  }
}
