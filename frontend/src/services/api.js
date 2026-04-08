import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000" // 👈 check your backend port
});

export default API;