import { base_api, axiosJson, token } from "../helpers/init_vars"


const postLogin = async(data) => {
    const url = `${base_api}/facebook/login`
    return await axiosJson.post(url,data)
}

const facebookPages = async(params) => {
    const url = `${base_api}/facebook/getpages`
    return await axiosJson.get(`${url}${params ? params : ''}`)
}
const facebookFeeds = async(params) => {
    const url = `${base_api}/facebook/getfeeds`
    return await axiosJson.get(`${url}${params ?? ''}`)
}
const facebookListPages = async(params) => {
    const url = `${base_api}/facebook/listpages`
    return await axiosJson.get(`${url}${params ? params : ''}`)
}
const facebookPicture = async(params) => {
    const url = `${base_api}/facebook/picture`
    return await axiosJson.post(`${url}`,params)
}

const facebookPost = async(params) => {
    const url = `${base_api}/facebook/postfeed`
    return await axiosJson.post(url,params)
}

const refreshToken = async(params) => {
    const url = `${base_api}/facebook/refresh-token`
    return await axiosJson.post(url,params)
}


export {
    postLogin,
    facebookPages,
    facebookFeeds,
    facebookListPages,
    facebookPost,
    facebookPicture,
    refreshToken
}