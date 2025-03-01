import axiosInstance from "./axiosInstance";

const HomeAPI = {
  getHomeData: async (currentLanguage, headers = {}) => {
    const response = await axiosInstance.get("/home", {
      headers: {
        ...headers,
        language: currentLanguage, // Include the language in headers
      },
    });
    return response.data;
  },
 
};

export default HomeAPI;
