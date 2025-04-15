import { base_api, axiosJson, token } from "../helpers/init_vars"


const postLogin = async(data) => {
    const url = `${base_api}/auth/login`
    return await axiosJson.post(url,data)
}

const facebookLogin = async(data) => {
    const url = `${base_api}/facebook/login`
    return await axiosJson.post(url,data)
}
const facebookLogout = async(data) => {
    
}
const getLogout = async() => {
    const url = `${base_api}/auth/logout`
    return await axiosJson.get(url)
}

const getUserInfo = async() => {
    const url = `${base_api}/auth/userinfo`
    return await axiosJson.get(url)
}

const updatePassword = async(data) => {
    const url = `${base_api}/auth/change-password`
    return await axiosJson.post(url,data)
}

const updateProfile = async(data) => {
    const url = `${base_api}/auth/profile`
    return await axiosJson.post(url,data)
}


const checklogin = async() => {
    const accessToken = token
    if(!accessToken) return false
    try {
        const user = await getUserInfo()
        if(user.status == 200 ){
            return true
        }else{
            return false;
        }
        
    } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('userinfo')
        return false
    }
}
export {
    postLogin,
    getLogout,
    getUserInfo,
    checklogin,
    updatePassword,
    updateProfile,
    facebookLogin
}