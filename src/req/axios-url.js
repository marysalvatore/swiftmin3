import axios from 'axios' ;

// axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL:  'https://pro-api.coinmarketcap.com',
    headers:{
        'X-Requested-With': 'XMLHttpRequest',
        'X-CMC_PRO_API_KEY': 'f102e510-b4f6-4bc6-bde0-e25fae578875',
        // 'Access-Control-Allow-Origin': 'https://pro-api.coinmarketcap.com',
        // 'Content-Type': 'application/json',
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
    }


});

// http://localhost:3999/api/
//

export default instance;