const { base_api, axiosJson, axiosUpload } = require("../helpers/init_vars")
const base_url = `${base_api}/shopee-data`

const fetchShopee = async(params) => {
    return await axiosJson.get(`${base_url}${params}`)
}

const getShopee = async(id) => {
    return await axiosJson.get(`${base_url}/${id}`)
}

const storeShopee = async(params) => {
    return await axiosUpload.post(base_url,params)
}

const updateShopee = async(id,params) => {
    return await axiosJson.put(`${base_url}/${id}`,params)
}

const destroyShopee = async(id) => {
    return await axiosJson.delete(`${base_url}/${id}`)
}

export {
    fetchShopee,
    getShopee,
    storeShopee,
    updateShopee,
    destroyShopee
}