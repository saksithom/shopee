import { axiosJson, base_api } from "../helpers/init_vars"

// const url = `https://graph.facebook.com/v21.0/${facebook_page_id}`
const base_url = `${base_api}/commions`
// Dashboard
const fetchCommissions = async(params) => {
    return await axiosJson.get(`${base_url}${params ?? ''}`)
}
const fetchChunkCommission = async(params) => {
    return await axiosJson.get(`${base_url}-chunks${params ?? ''}`)

}
const getTotalCommissions = async() => {
    return await axiosJson.get(`${base_url}-total`)
}

export {
    fetchCommissions,
    getTotalCommissions,
    fetchChunkCommission
}