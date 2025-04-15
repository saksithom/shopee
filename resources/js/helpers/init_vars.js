import axios from "axios"

const base_api = `/api/v1`
const token = localStorage.getItem('token') ?? null
const user_access_token = localStorage.getItem('user_access_token') ?? null
const userinfo = localStorage.getItem('userinfo')  ?? null
const meta_app_version = 'v22.0'
const facebook_api_link = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=${meta_app_version}`
const treads_api_link = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=${meta_app_version}`

const axiosJson = axios.create({
    headers: {
        "Content-Type": "application/json",
        'Authorization': `${ token ? 'Bearer ' + token : '' }`
    }
})

const axiosUpload = axios.create({
    baseURL: '/',
    timeout: -1,
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': `${ token ? 'Bearer ' + token : '' }`
    },
    timeout: 1000 * 60 * 30,  // 30 minutes, adjust according to need
    maxContentLength: Infinity,  // Disable content length limit
    maxBodyLength: Infinity
})
const axiosFormdata = axios.create({
    baseURL: '/',
    timeout: 0,
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': `${ token ? 'Bearer ' + token : '' }`
    },
    timeout: 1000 * 60 * 30,  // 30 minutes, adjust according to need
    maxContentLength: Infinity,  // Disable content length limit
    maxBodyLength: Infinity
})

const axiosMeta = axios.create({
    baseURL: 'https://graph.facebook.com/v16.0',  // URL พื้นฐานของ Graph API (ปรับตามเวอร์ชันที่ใช้)
    headers: {
        'Authorization': `Bearer ${user_access_token}`,  // เพิ่ม Access Token ใน header
        'Content-Type': 'application/json'
    }
})
const initshopType = [
    { text : 'OFFICIAL SHOP', value : 1 , code : 'OFFICIAL_SHOP'},
    { text : 'PREFERRED SHOP', value : 2 , code : 'PREFERRED_SHOP'},
    { text : 'PREFERRED PLUS SHOP', value : 4 , code : 'PREFERRED_PLUS_SHOP'},
];

const initLogslevel = [
    {text: 'info', value: 'info'},
    {text: 'warning', value: 'warning'},
    {text: 'notice', value: 'notice'},
    {text: 'error', value: 'error'},
    {text: 'critical', value: 'critical'}
]

export {
    base_api,
    token,
    user_access_token,
    userinfo,
    axiosJson,
    axiosUpload,
    axiosMeta,
    axiosFormdata,
    meta_app_version,
    facebook_api_link,
    initshopType,
    initLogslevel
}
