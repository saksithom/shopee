import React, { useContext, useEffect, useState } from "react";
import { Facebook, Refresh } from "@mui/icons-material";
import { Button,Card, Col, Form, Image, InputGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Modalconfirm from "../Dialogs/Confirmation";
import { storeApi, updateApi, updateApiAccesscode } from "../../controllers/apiscontroller";
import { Inputcontext } from "../../helpers/functions";
import { facebook_api_link, meta_app_version } from "../../helpers/init_vars";
import moment from "moment-timezone";
import Facebookprofile from "./facebookprofile";
import { facebookListPages, facebookPages, facebookPicture } from "../../controllers/facebookController";
import Loading from "../Loading/Loading";
import { Radio } from "@mui/material";
const Apifacebook = () => {
    const initFeilds = {
        user: '',
        pages: '',
        page: null,
        page_id: '',
        user_id: '',
        app_id: '',
        secret_id: '',
        client_id: '',
        user_access_token: '',
        page_access_token: '',
        long_access_token: '',
        api_type: 'facebook'

    }
    const initErrors = {
        secret_id: '',
        app_id: ''
    }

    const {apis, setApis} = useContext(Inputcontext)
    const [loaded, setLoaded] = useState(false)
    const [field, setField] = useState(initFeilds)
    const [errors, setErrors] = useState(initErrors)
    const [pages, setPages] = useState([])
    const [account, setAccount] = useState([])
    const [auths, setAuths] = useState([])
    const [long_live_access_token, setLong_live_access_token] = useState(null)
    const [long_access_token, setLong_access_token] = useState(null)
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})

    const loadFacebookSDK = (metaApiLink) => {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = metaApiLink;
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      };
    
      const initFacebookSDK = (appId, version) => {
        if (!window.fbAsyncInit) {
          window.fbAsyncInit = function () {
            try {
              FB.init({
                appId: appId, // แทนที่ด้วย App ID ของคุณ
                cookie: true,
                xfbml: true,
                version:version, // ระบุเวอร์ชัน
              });
           //  console.log("Facebook SDK Initialized");
            } catch (error) {
              console.error("Error initializing Facebook SDK:", error);
            }
          };
        }
      };

    useEffect(() => {
        if (apis && apis.facebook) {
            const facebook = apis.facebook;
         //  console.log('facebook : ', facebook)
            const metaApiLink = `${facebook_api_link}&appId=${facebook.app_id}`;
            loadFacebookSDK(metaApiLink);
            initFacebookSDK(facebook.app_id, meta_app_version);
            init(facebook)
          } else {
            console.warn("Facebook API data is not available");
            setLoaded(true)
          }
      
          // Cleanup function
          return () => {
            window.fbAsyncInit = null; 
          }
    },[apis])
    const init = async(facebook) => {
        await setLoaded(false)
        setField(facebook);
        if(!facebook.access_code){
            await setLoaded(true)
            return false
        }
        const pagelist = await getlistPages()        
        if(pagelist.length > 0 && facebook.access_code.pages){
            const facebookPages = facebook.access_code.pages.map((item) => {
                const cpage = pagelist.find(x => x.id == item.id)
                return {
                    ...item,
                    checked: facebook.page_id == item.id,
                    picture: cpage?.picture ?? ''
                }
            })

            await updateAccesscode(facebookPages)
            setPages(facebookPages)
        }
        

        if (facebook.access_code.auths)
            setAuths(facebook.access_code.auths); // Assuming setAuths is defined elsewhere
        
        if (facebook.access_code.user){
            const userPicture = await pagePicture(facebook.access_code.user.id)
         //  console.log("Facebook userPicture: ", userPicture);
            const profile = {
                ...facebook.access_code.user, 
                picture: userPicture,
                data_access_expiration_time: facebook.access_code.auths ? facebook.access_code.auths.data_access_expiration_time : null
            }
         //  console.log("Facebook profile: ", profile);
            setAccount(profile);
         }
        
        if (facebook.access_code.long_access_token)
            setLong_access_token(facebook.access_code.long_access_token); // Assuming setLong_access_token is defined elsewhere
        
        await setLoaded(true)  
    }
    const updateAccesscode = async(pagelist) => {

        if(!pagelist) return false;
        const acPage = apis.facebook.access_code.pages.find(x => x.checked == true)
        if(!acPage){
            const access_code = {
                ...apis.facebook.access_code,
                pages: pagelist
            }
            const res = await updateApiAccesscode({api_type: 'facebook', access_code: access_code})
            if(res.status == 200){
             //  console.log('update facebook api: ', res.data)
                // setApis({
                //     ...apis,
                //     facebook: res.data,
                // })
            }
        }

    }
    const handleFBLogin = async() => {
        try {
            window.FB.login((response) => {
                if (response.status == "connected") {
                    const authResponse = response.authResponse
                    const access_token = authResponse.accessToken
                    const token = {data : access_token}
                    setField({...field, user_access_token: access_token})
                    setAuths(authResponse)
                    setupUser(authResponse)
                    setupPages(authResponse)
                    exchangeAccessToken(authResponse.accessToken)    
                } else {
                    console.error("User cancelled login or did not fully authorize.",response);
                }
            }, 
            { 
                scope: 'pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_show_list,email' 
            });
        } catch (error) {
            console.error("Failed to exchange token:", error);
            return null;
        }  
      };
      const setupPages = (data) => {
        try {
            window.FB.api(`/me/accounts`,{
                account_token: data.accessToken 
            },( response ) => {
                    setPages(response.data)
                    setField({
                        ...field,
                        user_access_token: data.accessToken,
                        page_access_token: response.data[0].access_token
                    })
            })
        } catch (error) {
            console.error("Failed to exchange token:", error);
            return null;
        }  
    }

      const setupUser = (data) => {
            try {
                window.FB.api(`/me`, { 
                    fields: 'name,email,picture',
                    access_token: data.accessToken 
                },( response ) => {
                    setAccount(response)
                })
            } catch (error) {
                console.error("Failed to exchange token:", error);
                return null;
            }  
        };

        const getlistPages = async() => {
            try {
                const response = await facebookListPages()
                if(response.status == 200)
                {
                    setPages(response.data.pages)
                    return response.data.pages
                }
            } catch (error) {
                console.error("Failed to exchange token:", error);
                return null;
            }  
        }
    
        const exchangeAccessToken = (userAccessToken) => {          
            try {
                window.FB.api(`/oauth/access_token`,
                {
                    grant_type: "fb_exchange_token",
                    client_id: field.app_id,
                    client_secret: field.secret_id,
                    fb_exchange_token: userAccessToken
                },
                ( response ) => {
                    if (response && !response.error) {
                     //  console.log("setLong_live_access_token:", response);
                        setLong_access_token(response)
                        setLong_live_access_token(response.access_token); // บันทึก long-lived token
                        setField({
                            ...field,
                            user_access_token: data.accessToken,
                            page_access_token: data.page_access_token,
                            long_access_token: response.access_token
                        })
                    } else {
                        console.error("Failed to exchange token:", response.error.message);
                        return null;
                    }
                })
            } catch (error) {
              console.error("Failed to exchange token:", error);
              return null;
            }
          }
        
        const pagePicture = async (page_id) => {
            try {
                let pic = '';
                const response = await facebookPicture({user_id : page_id})
                if(response.status == 200){
                    const data = response.data
                    return data.url
                }
            } catch (error) {
                console.error("Failed to exchange token:", error);
                return null;
            }  
        };
        const setFieldpage = (e) => {
            if(e.target.checked){
                if(!pages) return false;
                const page = pages.find(x => x.id == e.target.value)
                setField({
                    ...field, 
                    page : page,
                    page_id: page.id,
                    page_access_token: page.access_token,
                    page_picture: page?.picture
                })
                setPages(prev => prev.map((item) => {
                    if(item.id == e.target.value)
                        return {
                            ...item,
                            checked: true,
                            picture: page.picture
                        }
                    return {
                            ...item,
                            checked: false,
                        }
                }))
            }
        }
          const validations = () => {
            let x = 0;
            let err = initErrors
            if(!field.app_id){
                err.app_id = '* Please enter Facebook App ID'
                x++
            }
            if(!field.secret_id){
                err.secret_id = '* Please enter Facebook App ID'
                x++
            }
            setErrors(err)
         //  console.log('error validation : ', x , ' : ' , err)
            return x == 0 ? true : false
        }
        const onConfirmation = async(e) => {
            e.preventDefault();
            await setLoaded(false)
            const valid = validations()
            if(!valid ){
                await setLoaded(true)
                return false
            }
    
            setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้',status: 'ready'})
            await setLoaded(true)
    
        }
        const handleSubmit = async() => {
            await submitApi()
        }
        const submitApi = async() => {
            const res = await actionApis()
            if(res.status == 201 || res.status == 200){
                setApis({
                    ...apis,
                    facebook : res.data
                })

                setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้',status: 'success'})
                setTimeout(() => {
                    setModalconfirm({view:false})
                },3000)
            }
        }
    const actionApis = async() => {
        if(field.user_access_token){
            const params = {
                user_access_token: field.user_access_token,
                long_live_access_token: long_live_access_token,
                page_access_token: field.page_access_token,
                page_id: field.page_id,
                access_code: {
                    auths: auths,
                    user: account,
                    pages: pages,
                    long_access_token: long_access_token,
                    // field : field
                },
                app_id : field.app_id,
                secret_id : field.secret_id,
                client_id: field.client_id ?? null,
                api_type : field.api_type
            }
            return await updateApi(field.api_type, params)
        }else{
            const params = {
                app_id : field.app_id,
                secret_id : field.secret_id,
                client_id: field.client_id ?? null,
                api_type : field.api_type,
                page_id: field.page_id,
            }
            return await storeApi(params)
        }
    }
    return (
        <>
        {loaded ?
        <>
            <Form onSubmit={onConfirmation}>
                <Card className="strpied-tabled-with-hover px-2 mb-2">
                    <Card.Header>
                        <Card.Title as="h4">Facebook API</Card.Title>
                        <p className="card-category">Setting & Generate access token api for META & Facebook</p>
                        <hr/>
                    </Card.Header>
                    <Card.Body className="table-full-width table-responsive">
                        <Row className="mb-2">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>App ID <small className="text-danger">*</small></Form.Label>
                                    <Form.Control type="input" placeholder="Input Facebook APP ID"
                                        onChange={e => setField({...field, app_id: e.target.value})}
                                        value={field.app_id}
                                    />
                                    {errors.app_id ? <small className="text-danger">{errors.app_id}</small> : null}
                                    </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Secret ID <small className="text-danger">*</small></Form.Label>
                                    <Form.Control type="input" placeholder="Input Facebook Secret ID"
                                        onChange={e => setField({...field, secret_id: e.target.value})}
                                        value={field.secret_id}
                                    />
                                    { errors.secret_id ? <small className="text-danger">{errors.secret_id}</small> : null}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Client ID</Form.Label>
                                    <Form.Control type="input" placeholder="Input Facebook Client ID"
                                        onChange={e => setField({...field, client_id: e.target.value})}
                                        value={field.client_id ?? ''}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* {(!apis || !apis.facebook )} */}
                        {(apis && apis.facebook) ? 
                        <>
                        <Row>
                            <Col md={12}>
                                {field.user_access_token ?
                                <Form.Group>
                                    <Form.Label>Access Token ID</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            readOnly
                                            placeholder="Facebook user access token"
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                            className="bg-white"
                                            defaultValue={field.user_access_token ?? ''}
                                        />
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>Generate User Access Token</Tooltip>
                                            }
                                        >
                                            <Button variant="outline-secondary" onClick={handleFBLogin} id="button-addon2">
                                                <Refresh />
                                            </Button>
                                        </OverlayTrigger>
                                    </InputGroup>
                                </Form.Group>
                                :
                                    
                                    <div className="button-overlay text-center mt-2">
                                        <button className='btn btn-primary btn-lg' type="button" onClick={handleFBLogin}><Facebook /> Generate Access Token with Facebook User</button>
                                        {/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div>  */}
                                    </div>                                
                                }
                            </Col>
                        </Row>
                        {( apis && apis.facebook.access_code &&  apis.facebook.page_id ) ? 
                        <div className="mb-2">
                        <Card.Title className="p-2">Current Facebook Page</Card.Title>

                        <hr/>
                        <Facebookprofile profile={account} page={pages} />
                        </div>
                        : null }
                        <Card.Title className="p-2">Select default Facebook Page</Card.Title>
                        <hr />
                        <Row className="profile-stats">
                            { pages?.map((page,idx) => (
                            <Col lg="6" sm="6" key={idx}>
                                <Card className="card-stats h180">
                                    <Card.Title className="p-2 text-success">Page : <i>{page.name}</i></Card.Title>
                                    <Card.Body>
                                        <Row>
                                            <Col xs="1" className="text-center position-relative">
                                                <Radio
                                                    value={page.id}
                                                    onChange={setFieldpage}
                                                    checked={field.page_id == page.id}
                                                />
                                            </Col>
                                            <Col xs="3">
                                                <div className="icon-big text-center icon-warning">
                                                    <Image src={page.picture} thumbnail fluid />
                                                </div>
                                            </Col>
                                            <Col xs="8">
                                                <div className="numbers">
                                                    <p className="card-category">Page ID: <strong>{page.id}</strong></p>
                                                    <p className="card-category">category: <strong><i>{page.category}</i></strong></p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            ))}
                        </Row>
                        
                        </>
                        :
                            null
                        }
                    </Card.Body>
                    <Card.Footer className="text-end">
                        <hr/>
                        <Button variant="primary" type="submit"><Facebook /> <span className="ms-2">{(apis && apis.shopee) ? 'UPDATE' : 'SAVE'} API ID</span></Button>
                    </Card.Footer>
                </Card>
            </Form>
            <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        onSubmit={handleSubmit}

            />

        </>
        : <Loading /> 
        }
        </>
    )
}

export default Apifacebook