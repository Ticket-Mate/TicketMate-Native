import axios, { CanceledError } from "axios";

export { CanceledError }


const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

const apiClient = axios.create({baseURL});

export default apiClient;