import { axiosJson, base_api } from "../helpers/init_vars"

// const url = `https://graph.facebook.com/v21.0/${facebook_page_id}`
const base_url = `${base_api}/apis`
// Dashboard
const fetchDashboard = async(params) => {
    return await axiosJson.get(`${base_api}/dashboard${params}`)
}

const fetchDashboardApis = async() => {
    return await axiosJson.get(`${base_api}/dashboard-apis${params}`)
}

const fetchDashboardPosts = async() => {
    return await axiosJson.get(`${base_api}/dashboard-posts${params}`)
}

const fetchDashboardCommissions = async() => {
    return await axiosJson.get(`${base_api}/dashboard-commissions`)
}

// API fetch
const fetchApi = async(params) => {
    return await axiosJson.get(`${base_url}`)
}
const getFacebookProfile = async() => {
    return await axiosJson.get(`${base_url}-facebook`)
}
const getShopeeReports = async() => {
    return await axiosJson.get(`${base_url}-shopee`)
}
const getCommissions = async() => {
    return await axiosJson.get(`${base_url}-commission`)
}
const getOffershop = async(params) => {
    return await axiosJson.post(`${base_url}-shopee-shop-offer`,params)
}
const getApi = async(type) => {
    return await axiosJson.get(`${base_url}/${type}`)
}
const storeApi = async(params) => {
    return await axiosJson.post(`${base_url}`,params)
}
const updateApi = async(type,params) => {
    params._method = 'PUT'
    return await axiosJson.post(`${base_url}/${type}`,params)
}
const deleteApi = async(type,params) => {
    params._method = 'DELETE'
    return await axiosJson.post(`${base_url}/${type}`,params)
}

const updateApiAccesscode = async(params) => {
    return await axiosJson.post(`${base_url}-accesscode`,params)
}

const getInstagram = async(params) => {
    return await axiosJson.get(`${base_url}-instagram`)
}

export {
    fetchApi,
    getApi,
    storeApi,
    updateApi,
    deleteApi,
    fetchDashboard,
    getFacebookProfile,
    getShopeeReports,
    getOffershop,
    updateApiAccesscode,
    fetchDashboardCommissions,
    fetchDashboardPosts,
    getInstagram,
    getCommissions
}
