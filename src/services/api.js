import axios from 'axios';

// http://10.17.4.150

export const api = axios.create({
    baseURL: 'http://192.168.224.199:8000',
    timeout: 9999999
});
