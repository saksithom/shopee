import React, { useEffect } from "react"
import { getLogout } from "../../controllers/authen"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        isLogout()
    },[])
    const init = async() => {
        await isLogout()
    }
    const isLogout = async() => {
        const authen = await getLogout()
        if( authen.status == 200){
            localStorage.removeItem('token')
            localStorage.removeItem('userinfo')
            localStorage.clear();
            navigate('/login')
        }
    }
}
export default Logout