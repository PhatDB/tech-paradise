import axios from 'axios';
import https from 'https';

const agent = new https.Agent({rejectUnauthorized: false});

const axiosClient = axios.create({
    baseURL: process.env.API_BASE_URL || 'https://localhost:5000',
    httpsAgent: agent,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
