import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../controllers/authen';
import { token, userinfo } from '../helpers/init_vars';

const AuthMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const userinfo = userinfo ? JSON.parse(userinfo) : null
  const [tokendata] = useState(token)

  useEffect(() => {
 //  console.log('user info : ', userinfo)
    if (!tokendata || userinfo) {
      localStorage.clear()
      navigate('/login');  // ถ้าไม่มี token จะ redirect ไปที่หน้า login
    } else {
      init()
    }
  }, [navigate]);
  const init = async() => {
    await fetchUser()
  }
  const fetchUser = async() => {
    try {
        const user = await getUserInfo()
     //  console.log('resonse user : ', user)
        if(user.status == 200){
            const userData = user.data.data;
            localStorage.setItem('userinfo',JSON.stringify(userData))
        }
    } catch (error) {
        localStorage.removeItem('userinfo');
        localStorage.removeItem('token');
        navigate('/login');

    }
  }
  return children;
};

export default AuthMiddleware;
