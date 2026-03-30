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

export const getMyServices = async () => {
  try{
    const response = await api.get("Service/My-services");
    return response.data;
  }
  catch(error){
    if (error?.response?.status === 404 || error?.response?.status === 405) {
      try {
        const fallbackResponse = await api.post("Service/My-services");
        return fallbackResponse.data;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }

    throw error;
  }
}

export const getAllCandidatesFromService = async (serviceId) => {
  try{
    const response = await api.get(`Service/Get-All-Candidates/${serviceId}`);
    return response.data;
  } 
  catch(error){
    throw error;
  }
}

export const changeServiceStatus = async () => {
  try{
    const response = await api.post("Change-Status")
    return response.data;
  }
  catch(error){
    throw error;
  }
}
