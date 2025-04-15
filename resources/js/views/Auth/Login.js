import React, { useEffect, useState } from 'react';
import {

  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
  MDBRow,
  MDBCol
}
from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loginphoto from '../../assets/img/administrator-login.jpeg'
import { useNavigate } from 'react-router-dom';
import { Facebook } from '@mui/icons-material';
import { facebookLogin, postLogin } from '../../controllers/authen';
import { Form, InputGroup } from 'react-bootstrap';
import { emailinfo } from '../../helpers/functions';
const Login = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [rememberme,setRememberme] = useState(false)
  const [accessToken, setAccessToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
      email : '',
      password : '',
      isLogin : false,
      isAuthen : ''
  })
  useEffect(() => {
    // if(accessToken)
    //   navigate('/admin/dashboard')
    /*
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = meta_api_link;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    // เรียก FB.init เมื่อ SDK โหลดเสร็จ
    window.fbAsyncInit = function () {
      FB.init({
        appId: meta_app_id, // แทนที่ด้วย App ID ของคุณ
        cookie: true,
        xfbml: true,
        version: meta_app_version, // ระบุเวอร์ชัน
      });
    };
    */
  }, []);

  const clickRememberMe = (e) => {
    setRememberme(e.target.checked)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
/*
  const handleFBLogin = async() => {
 //  console.log('click login button')
    window.FB.login(
      async (response) => {
        if (response.authResponse) {
       //  console.log("Login Success:", response);
          const data = response.authResponse
          const accessToken = data.accessToken
          localStorage.setItem('user_access_token',accessToken)
          setAccessToken(accessToken);
          fetchUserLogin(data)
        } else {
       //  console.log("User cancelled login or did not fully authorize.",response);
        }
      }, 
      { scope: 'pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_show_list,email' }
    );
  };

  const fetchUserLogin = (data) => {
      window.FB.api(`/me`, 
          { fields: 'name,email,picture',access_token: data.accessToken },
          async( response ) => {
         //  console.log('User Data:', response);
              // await callbackFacebookLogin(response,data)
          }
        );      
    };


  const callbackFacebookLogin = async(response,data) => {
    try {
      const params = {
        email : response.email,
        facebook_id: response.id,
        name: response.name,
        avatar: response.picture.data.url,
        facebook_access_token: data.accessToken,
        data_access_expiration_time: data.data_access_expiration_time,
        expiresIn: data.expiresIn,
        password : null,
        rememberme : 1
      }
   //  console.log('params : ', params)
      const authen = await facebookLogin(params)
      if(authen.status == 200 || authen.status == 201){

          const data = authen.data
       //  console.log('login data: ', data)
          if(data){
            localStorage.setItem('token',data.token)
            localStorage.setItem('userinfo', JSON.stringify(data.user))
            window.location.reload()
          }
          // navigate('/admin/dashboard')
      }
    } catch (error) {
   //  console.log('error : ', error)
      setErrors({...errors, isAuthen : 'error'})
    }
  }
  */
  const validate = () => {
    let x = 0
    let err = {
        email : '',
        password : '',
        isAuthen : ''
    }
    const mail = emailinfo(email)
    if(!email){
      err.email = '* กรุณาป้อน Email'
      x++
    }
    if(!mail){
      err.email = '* รูปแบบ Email ไม่ถูกต้อง'
      x++
    }
    if(!password){
      err.password = '* กรุณาป้อนรหัสผ่าน'
      x++
    }
    setErrors(err)
    return x == 0 ? true : false
  }

  const submitLogin = async(e) => {
    e.preventDefault();
    const valid = validate()
 //  console.log('submit login : ', valid)
    if(!valid){
      return false
    }

    try {
      const params = {
        email : email,
        password : password,
        rememberme : rememberme ? 1 : 0
      }
      const authen = await postLogin(params)

      if(authen.status == 200){

          const data = authen.data
       //  console.log('login data: ', data)
          localStorage.setItem('token',data.token)
          localStorage.setItem('userinfo', JSON.stringify(data.user))
          window.location.reload()
          // navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('error : ', error)
      setErrors({...errors, isAuthen : 'error'})
    }
  }



  return (
    <div id="login-page" className="d-flex align-items-center justify-content-center">
      <MDBRow className='d-flex justify-content-center'>
          <MDBCol col='4' md='4'>
            <img src={Loginphoto} className="img-fluid image mb-3" alt="Phone image" />
            {/*<div className="button-overlay">
              <button className='btn btn-primary btn-lg btn-block' onClick={handleFBLogin}><Facebook /> Login with Facebook</button>
               <div class="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div> 
            </div>*/}
          </MDBCol>
          <MDBCol col='3' md='3'>
            <form method='post' onSubmit={submitLogin}>
              {errors.isAuthen == 'error' ? <div className='alert alert-danger'>Email หรือ Password ไม่ถูกต้อง</div>: null }
              <MDBInput  label='Email address' id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} size="lg"/>
              {errors.email ?<div className="text-danger">{errors.email}</div>: null }
              <div className='mb-1'>&nbsp;</div>
              <Form.Group>
                {/* <label>Password</label> */}
                <InputGroup>
                  <MDBInput  label='Password' id='password' type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}  size="lg"/>
                  <InputGroup.Text className="pointer" onClick={() => togglePasswordVisibility('password')}>
                    {showPassword ? <MDBIcon far icon="eye" /> : <MDBIcon far icon="eye-slash" />}
                  </InputGroup.Text>
                </InputGroup>
                {errors.password ?<div className="text-danger">{errors.password}</div>: null }
              </Form.Group>

              <div className='mb-1'>&nbsp;</div>
              <div className="d-flex justify-content-between  mb-4">
                <div className='form-checks'>
                  
                  <input type='checkbox' id='rememberme' className='me-2' checked={rememberme} onChange={clickRememberMe} />
                  <label htmlFor="rememberme" className='pointer'>Remember me</label>
                </div>
                <a href="!#">Forgot password?</a>
              </div>
              <MDBBtn className="mb-4 w-100 mt-4" type='submit' onClick={submitLogin} size="lg">Sign in</MDBBtn>
            </form>
          </MDBCol>
        </MDBRow>
      </div>
  );
}

export default Login;