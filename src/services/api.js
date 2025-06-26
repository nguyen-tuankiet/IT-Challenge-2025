import axios from 'axios';

// const API_URL = 'http://47.84.52.44:8080/feed-service/api';
const API_URL = 'http://localhost:8080/feed-service/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;
    