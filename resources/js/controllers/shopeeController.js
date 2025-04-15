const { base_api, axiosJson, axiosUpload } = require("../helpers/init_vars")
const base_url = `${base_api}/shopee-products`

const fetchShopeeproducts = async(params) => {
    return await axiosJson.get(`${base_url}${params}`)
}

export {
    fetchShopeeproducts
}