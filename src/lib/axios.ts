import axios from 'axios';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    // console.error('Error response:', error.response?.data);
    return Promise.reject(error);
  }
);

export default axios;