import React, { useEffect, useRef, useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBContainer,
}
from 'mdb-react-ui-kit';
import { checklogin } from '../controllers/authen';
import { useNavigate } from 'react-router-dom';

const LoginLayout = ({children}) => {
  const [islogin, setIslogin] = useState(checklogin())
  const navigate = useNavigate()
  let componentMounted = useRef(true);
  useEffect(() => {
    if(componentMounted.current){
      init()
    }

    return () => {
        componentMounted.current = false;
    }
  },[])
  const init = async() => {
    const onlogin = await checklogin()
 //  console.log('on login : ', onlogin)
    if(onlogin){
      setIslogin(true)
      navigate('/admin/dashboard')
    }
  }
  return (
    <MDBContainer id="login-layout" fluid >{children}</MDBContainer>
  );
}

export default LoginLayout;