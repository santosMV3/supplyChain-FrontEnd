import axios from 'axios';

// http://10.17.4.150
// https://api.mv3.com.br
// http://localhost:8000

export const api = axios.create({
    baseURL: 'https://api.mv3.com.br',
    timeout: 9999999
});
