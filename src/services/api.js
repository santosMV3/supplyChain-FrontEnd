import axios from 'axios';

// http://10.17.4.150

export const api = axios.create({
    baseURL: 'http://10.17.4.150:8000',
    timeout: 9999999
});
