const { base_api, axiosJson } = require("../helpers/init_vars")
const base_url = `${base_api}/users`

const fetchUsers = async(params) => {
    return await axiosJson.get(`${base_url}${params}`)
}

const getUsers = async(id) => {
    return await axiosJson.get(`${base_url}/${id}`)
}

const storeUsers = async(params) => {
    return await axiosJson.post(base_url,params)
}

const updateUsers = async(id,params) => {
    return await axiosJson.put(`${base_url}/${id}`,params)
}

const destroyUsers = async(id) => {
    return await axiosJson.delete(`${base_url}/${id}`)
}

export {
    fetchUsers,
    getUsers,
    storeUsers,
    updateUsers,
    destroyUsers
}