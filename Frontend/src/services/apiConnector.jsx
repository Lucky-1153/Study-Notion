import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://study-notion-server-sgln.onrender.com', // Adjust according to your backend URL
    withCredentials: true, // This allows sending cookies with requests
})

export const apiConnector = (method, url, bodyData,headers, params) =>{
    return axiosInstance( {
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params: null
    })
}
