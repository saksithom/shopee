import { base_api, axiosJson, token } from "../helpers/init_vars"
const base_url = `${base_api}/settings`

const fetchSetting = async(params) => {
    const url = `${base_url}${params ?? ''}`
    return await axiosJson.get(url)
}
const getSetting = async(page_id) => {
    const url = `${base_url}/${page_id ?? '0'}`
    return await axiosJson.get(url)
}

const storeSetting = async(params) => {
    return await axiosJson.post(base_url,params ?? {})
}
const updateSetting = async(params) => {
    return await axiosJson.post(base_url,params ?? {})
}
const destroySetting = async(params) => {
    return await axiosJson.post(base_url,params ?? {})
}

export {
    fetchSetting,
    getSetting,
    storeSetting,
    updateSetting,
    destroySetting
}