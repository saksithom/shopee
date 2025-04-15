import React, { useContext, useEffect, useRef, useState } from "react";
import { Facebook, Height, Instagram, InstallDesktopSharp, Refresh } from "@mui/icons-material";
import { Button,Card, Col, Container, Form, Image, InputGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Modalconfirm from "../../components/Dialogs/Confirmation";
import { getApi, storeApi, updateApi, updateApiAccesscode } from "../../controllers/apiscontroller";
import { facebook_api_link, meta_app_version } from "../../helpers/init_vars";
import Facebookprofile from "../../components/apis/facebookprofile";
import { facebookListPages, facebookPages, facebookPicture } from "../../controllers/facebookController";
import Loading from "../../components/Loading/Loading";
import { Radio, Checkbox } from "@mui/material";
const Apifacebookpage = () => {
    const initFeilds = {
        user: '',
        pages: '',
        page: null,
        page_id: '',
        instagram_id: '',
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

    const [apis, setApis] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [field, setField] = useState(initFeilds)
    const [errors, setErrors] = useState(initErrors)
    const [pages, setPages] = useState([])
    const [instagrams, setInstagrams] = useState([])
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
                appId: appId,
                cookie: true,
                xfbml: true,
                version:version,
              });
            } catch (error) {
              console.error("Error initializing Facebook SDK:", error);
            }
          };
        }
    };
    let componentMounted = useRef(true);
    
    useEffect(() => {
          if(componentMounted.current){
              init()
          }
      
          return () => {
            window.fbAsyncInit = null; 
            componentMounted.current = false;
          }
      },[])

      
    const init = async() => {
        setLoaded(false)
        let api = {
            facebooks: [],
            instagrams: [],
            profile: null
        }
        const facebook = await fetchDataApis()
        if (facebook) {
            const metaApiLink = `${facebook_api_link}&appId=${facebook.app_id}`;
            loadFacebookSDK(metaApiLink);
            initFacebookSDK(facebook.app_id, meta_app_version);

            setField(facebook);
            if(!facebook.access_code){
                await setLoaded(true)
                return false
            }

            const pagelist = await getlistPages()

            if(pagelist.facebooks){
                const facebookPages = pagelist.facebooks.map((item) => {
                    const cpage = facebook.access_code.pages.find(x => x.id == item.id)
                    return {
                        ...item,
                        checked: cpage ? cpage.checked : false,
                        picture: item?.picture
                    }
                })
                setPages(facebookPages)
                api.facebook  = facebook
                api.facebooks =facebookPages
            }
             //  console.log('loop facebook pages : ', facebookPages)
            // if(!pagelist.error && pagelist.instagrams.length > 0){
            //     const instagramsPages = pagelist.instagrams.map((itemIg) => {
            //         // console.log('ig picture profile : ', itemIg)
            //         const ipage = facebook.access_code.instagrams.find(x => x.id == itemIg.id)
            //         return {
            //             ...itemIg,
            //             checked: ipage?.checked ?? false,
            //             picture: itemIg.picture ?? ipage?.picture
            //         }
            //     })
                // setInstagrams(instagramsPages)
                // api.instagrams = instagramsPages                   
            // }

            if (facebook.access_code.auths){
                setAuths(facebook.access_code.auths); // Assuming setAuths is defined elsewhere
                api.auths = facebook.access_code.auths
            }

            if (facebook.access_code.profile){
                setAuths(facebook.access_code.profile); // Assuming setAuths is defined elsewhere
                api.auths = facebook.access_code.profile
            }
            
            if (facebook.access_code.user){
                const userPicture = await pagePicture(facebook.access_code.user.id)
            //  console.log("Facebook userPicture: ", userPicture);
                const profile = {
                    ...facebook.access_code.user, 
                    picture: userPicture,
                    data_access_expiration_time: facebook.access_code.long_access_token ? facebook.access_code.long_access_token.expires_in : (facebook.access_code.auths.data_access_expiration_time ?? null)
                }
            //  console.log("Facebook profile: ", profile);
                setAccount(profile);
                api.user = profile
            }
            
            if (facebook.access_code.long_access_token)
                setLong_access_token(facebook.access_code.long_access_token); // Assuming setLong_access_token is defined elsewhere
        } else {
         //  console.log("Facebook API data is not available");
        }
        console.log('api : ', api)
        setApis(api)
        setLoaded(true)  
    }
    const fetchDataApis = async() => {
        const response = await getApi(`facebook`)
        console.log('facebook reponse : ', response)
        if(response.status == 200){
            return response.data
        }
        return null
  
    }

    const handleFBLogin = async() => {
        try {
            window.FB.login((response) => {
                if (response.status == "connected") {
                    setLoaded(false)
                    console.log('response login facebook : ', response)
                    const authResponse = response.authResponse
                    const access_token = authResponse.accessToken
                    const token = {data : access_token}
                    setField({...field, user_access_token: access_token})
                    setAuths(authResponse)
                    setupUser(authResponse)
                    setupPages(authResponse)
                    exchangeAccessToken(authResponse)    
                    setLoaded(true)
                    // console.log('authResponse : ', authResponse)
                } else {
                    console.error("User cancelled login or did not fully authorize.",response);
                }
            }, 
            { 
                scope: 'pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_show_list,email,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights' 
            });
        } catch (error) {
            console.error("Failed to exchange token:", error);
            return null;
        }  
      };
      const setupPages = (data) => {
            window.FB.api(`/me/accounts`,{
                account_token: data.accessToken,
                fields: 'id,name,picture,category,category_list,access_token'
            },( response ) => {
                // console.log('setup pages : ', response.data)
                setLoaded(false)
                const fbpages = response.data
                const pagelist = field.facebook?.access_code?.pages ?? []
                const facebookPages = fbpages.map((item) => {
                    let picture = pageLargePicture(item)
                    const cpage = pagelist.length > 0 ? pagelist?.pages.find(x => x.id == item.id): null

                    if(cpage)
                        picture = cpage?.picture
                        return {
                            ...item,
                            checked: cpage ? cpage.checked : false,
                            picture: cpage?.picture ?? picture
                        }
                })
                setPages(facebookPages)
                // console.log('facebookPages: ', facebookPages)
                setLoaded(true)
            })
    }


    const pageLargePicture = (page) => {
        let picture = page?.picture.data.url
        window.FB.api(`/${page.id}/picture`,{
            account_token: page.access_token,
            redirect: false,
            type: 'large',
            Height: 120,
            width: 120
        },( response ) => {
            return response.data.url
        })
        return picture
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
                    return response.data
                }
            } catch (error) {
                console.error("Failed to exchange token:", error);
                return null;
            }  
        }
    
        const exchangeAccessToken = (data) => {        
                // console.log('exchangeAccessToken Error : ', data)

                window.FB.api(`/oauth/access_token`,
                {
                    grant_type: "fb_exchange_token",
                    client_id: field.app_id,
                    client_secret: field.secret_id,
                    fb_exchange_token: data.accessToken
                },
                ( response ) => {
                    if (response && !response.error) {
                        setField({
                            ...field,
                            user_access_token: data.accessToken,
                            long_access_token: response,
                            long_live_access_token: response.access_token
                        })
                        // console.log('exchangeAccessToken : ', response)

                        setLong_live_access_token(response.access_token)
                        setLong_access_token(response)
                    } else {
                        console.error("Failed to exchange token:", response.error.message);
                        return null;
                    }
                })
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
                return null;
            }  
        };

        const setFieldpage = (e) => {
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
                            checked: e.target.checked,
                            picture: page.picture
                        }
                    return item
                }))
        }

        const setFieldIg = (e) => {
         //  console.log('set field ig: ', e.target.value, ' checed: ', e.target.checked)
            if(!instagrams) return false;                
            setInstagrams(prev => prev.map((item) => {
                    if(item.id == e.target.value)
                        return {
                            ...item,
                            checked: e.target.checked,
                        }
                    return  item
            }))
            setField({...field, instagram_id: e.target.value})
            
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
                    // setModalconfirm({view:false})
                    window.location.reload()
                },3000)
            }else{
                setModalconfirm({view:true, title: 'เกิดข้อผิดพลาด', message : 'ไม่สามารถบันทึกข้อมูลได้ โปรดทดลองใหม่ภายหลัง',status: 'error'})

            }
        }
    const actionApis = async() => {
        if(field.user_access_token){
            const params = {
                user_access_token: field.user_access_token,
                long_live_access_token: field.long_live_access_token,
                page_access_token: field.page_access_token,
                page_id: field.page_id,
                instagram_id: field.instagram_id,
                access_code: {
                    auths: auths,
                    user: account,
                    pages: pages,
                    instagrams: instagrams,
                    long_access_token: long_access_token,
                    // field : field
                },
                app_id : field.app_id,
                secret_id : field.secret_id,
                client_id: field.client_id ?? null,
                api_type : field.api_type
            }
            // console.log('field : ', field)
            // console.log('api type : ', field.api_type, ' params: ', params)
            return await updateApi(field.api_type, params)
        }else{
            const params = {
                app_id : field.app_id,
                secret_id : field.secret_id,
                client_id: field.client_id ?? null,
                api_type : field.api_type,
            }
            return await storeApi(params)
        }
    }
    return (
        <>
        {!loaded ? <Loading /> :
          <Container fluid>
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
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h5">ตั้งค่า FACEBOOK APP ID</Card.Title>
                                        <hr/>
                                    </Card.Header>
                                    <Card.Body className="h320">
                                        <div className="mb-2">
                                            <Form.Group>
                                                <Form.Label>App ID <small className="text-danger">*</small></Form.Label>
                                                <Form.Control type="input" placeholder="Input Facebook APP ID"
                                                    onChange={e => setField({...field, app_id: e.target.value})}
                                                    value={field.app_id}
                                                    />
                                                {errors.app_id ? <small className="text-danger">{errors.app_id}</small> : null}
                                            </Form.Group>
                                        </div>
                                        <div className="mb-2">
                                            <Form.Group>
                                                <Form.Label>Secret ID <small className="text-danger">*</small></Form.Label>
                                                <Form.Control type="input" placeholder="Input Facebook Secret ID"
                                                    onChange={e => setField({...field, secret_id: e.target.value})}
                                                    value={field.secret_id}
                                                />
                                                { errors.secret_id ? <small className="text-danger">{errors.secret_id}</small> : null}
                                            </Form.Group>
                                        </div>
                                        {/*<div className="mb-2">
                                            <Form.Group>
                                                <Form.Label>Client ID</Form.Label>
                                                <Form.Control type="input" placeholder="Input Facebook Client ID"
                                                    onChange={e => setField({...field, client_id: e.target.value})}
                                                    value={field.client_id ?? ''}
                                                />
                                            </Form.Group>
                                        </div>*/}
                                    </Card.Body>
                                </Card>

                            </Col>
                            <Col md={8} className="border-1">
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h5">FACEBOOK ACCESS TOKEN SETTING</Card.Title>
                                        <hr/>
                                    </Card.Header>
                                    <Card.Body className="h320">
                                        { (field.app_id && field.secret_id) ? 
                                            <>
                                            {field.user_access_token ?
                                                <Form.Group>
                                                    <Form.Label>User Access Token ID</Form.Label>
                                                    <Form.Control as="textarea"
                                                        rows={3}
                                                        readOnly
                                                        placeholder="Facebook user access token"
                                                        className="bg-white h-100 mb-2"
                                                        value={field.user_access_token ?? ''}
                                                    />
                                                    <Form.Label>Long Access Token ID</Form.Label>
                                                    <Form.Control as="textarea"
                                                        rows={3}
                                                        readOnly
                                                        placeholder="Facebook Long access token"
                                                        className="bg-white h-100 mb-2"
                                                        value={field.long_live_access_token ?? ''}
                                                    />
                                                    <Button variant="outline-secondary" onClick={handleFBLogin} id="button-addon2" className="w-100">
                                                        <Refresh /> Regenerate User Access Token
                                                    </Button>
                                                </Form.Group>
                                                :
                                                    
                                                    <div className="button-overlay text-center mt-2">
                                                        <button className='btn btn-primary btn-lg' type="button" onClick={handleFBLogin}><Facebook /> Generate Access Token with Facebook User</button>
                                                        {/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div>  */}
                                                    </div>                                
                                                }
                                            </>
                                        : 
                                            <div className="text-center">โปรดทำการบันทึกการตั้งค่า FACEBOOK APP ID</div>
                                        }
                                    </Card.Body>
                                </Card>

                            </Col>
                        </Row>

                        {(apis && apis.facebooks && apis.facebooks.length > 0) ? 
                        <>

                        <Row>
                            <Col md={6}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h5">Facebook ที่กำลังแชร์</Card.Title>
                                        <hr/>
                                    </Card.Header>
                                    <Card.Body className="">
                                        {( field && field.access_code &&  field.page_id ) ? 
                                            <Facebookprofile profile={apis.user} page={apis} />
                                        : null }
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h5">เลือก Facebook สำหรับแชร์สินค้า</Card.Title>
                                        <hr/>
                                    </Card.Header>
                                    <Card.Body>
                                        { pages?.map((page,idx) => (
                                            <Card className="card-stats" key={idx}>
                                                <Card.Header>
                                                    <Card.Title className="p-2 text-success">Page : <i>{page.name}</i></Card.Title>
                                                </Card.Header>
                                                <Card.Body className="pb-4">
                                                    <Row className="mb-2">
                                                        <Col xs="1" className="text-center position-relative">
                                                            <Checkbox
                                                                value={page.id}
                                                                onChange={setFieldpage}
                                                                checked={page.checked}
                                                            /> 
                                                        </Col>
                                                        <Col xs="3">
                                                            <div className="icon-big text-center icon-warning">
                                                                <Image src={page.picture} thumbnail fluid />
                                                            </div>
                                                        </Col>
                                                        <Col xs="8">
                                                            {/* page checked : {String(page.checked)} */}
                                                            <div className="numbers">
                                                                <p className="card-category">Page ID: <strong>{page.id}</strong></p>
                                                                <p className="card-category">category: <strong><i>{page.category}</i></strong></p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                </Card>
                                {instagrams.length > 0 && ( 
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h5">เลือก Instagram สำหรับแชร์สินค้า</Card.Title>
                                        <hr/>
                                    </Card.Header>
                                    <Card.Body>
                                        { instagrams?.map((ig,igx) => (
                                            <Card className="card-stats" key={igx}>
                                                <Card.Header>
                                                    <Card.Title className="p-2 text-success">Instagram : <i>{ig.username}</i></Card.Title>
                                                </Card.Header>
                                                <Card.Body className="pb-4">
                                                    <Row className="mb-2">
                                                        <Col xs="1" className="text-center position-relative">
                                                            <Checkbox
                                                                value={ig.id}
                                                                onChange={setFieldIg}
                                                                checked={ig.checked}
                                                            />
                                                        </Col>
                                                        <Col xs="3">
                                                            <div className="icon-big text-center icon-warning">
                                                                <Image src={ig.picture} thumbnail fluid />
                                                                {/* <Instagram fontSize="large" /> */}
                                                            </div>
                                                        </Col>
                                                        <Col xs="8">
                                                            <div className="numbers">
                                                                <p className="card-category"> ID: <strong>{ig.id}</strong></p>
                                                                <p className="card-category"> Username: <strong>{ig.name}</strong></p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                </Card>
                                )}
                            </Col>
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
                        onApply={handleSubmit}

            />

        </Container>
      }
      </>   
    )
}

export default Apifacebookpage