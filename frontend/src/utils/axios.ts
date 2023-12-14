// API Encapsulation: Procedure
// 1. Get Request
// 2. Request Interception
// 3. Response Interception
// 4. Processing for individual interfaces
// 5. Packaging
// 6. Post, Put, Del Requests
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

// Create an Instance
// const axiosInstance = axios.create({
//     baseURL: 'http://localhost.com:3001',
//     timeout: 1000,
//     withCredentials: false,
// });

class Request {
    instance: AxiosInstance

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config)

        this.instance.interceptors.request.use(
            (res: AxiosRequestConfig) => {
              console.log('全局请求拦截器')
              return res
            },
            (err: any) => err,
        )
        this.instance.interceptors.response.use(
            // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
            (res: AxiosResponse) => {
                console.log('全局响应拦截器')
                return res.data
            },
            (err: any) => err,
        )
    }

    request(config: AxiosRequestConfig) {
        return this.instance.request(config)
    }
}

export default Request

// // Instance methods: request, get, delete, head, options, post, put, patch, getUri

// // Request Interceptors
// axiosInstance.interceptors.request.use(
//     config => {
//       // 在这里可以添加请求前的逻辑，例如添加 token 到 headers
//       // const token = localStorage.getItem('token');
//       // if (token) {
//       //   config.headers.Authorization = `Bearer ${token}`;
//       // }
//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
// );

// // Response Interceptors
// axiosInstance.interceptors.response.use(
//     response => {
//       // 在这里可以添加响应后的逻辑，例如统一处理返回数据格式
//       return response.data;
//     },
//     error => {
//       // 响应错误处理
//       return Promise.reject(error);
//     }
// );

// export default axiosInstance;

