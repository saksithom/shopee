const { base_api, axiosJson } = require("../helpers/init_vars")

const fetchShared = async(params) => {
    return await axiosJson.get(`${base_api}/shared${params}`)
}
const fetchLogs = async(params) => {
    return await axiosJson.get(`${base_api}/logs${params}`)
}
const clearLogs = async() => {
    return await axiosJson.post(`${base_api}/logs/0`,{_method:'DELETE'})
}

const fetchPosts = async(params) => {
    return await axiosJson.post(`${base_api}/shared`, params)
}

export {
    fetchLogs,
    clearLogs,
    fetchShared,
    fetchPosts
}