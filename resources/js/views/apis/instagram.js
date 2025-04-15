import { SaveAltSharp, ShoppingBasketOutlined } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Button,Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Modalconfirm from "../../components/Dialogs/Confirmation";
import { getApi, getInstagram, storeApi } from "../../controllers/apiscontroller";
import Cardkeywords from "../../components/Cards/productKeyword";
import Cardcategory from "../../components/Cards/productcategory";
import Cardshopoffer from "../../components/Cards/shopoffers";
import Loading from "../../components/Loading/Loading";

const Apiinstagram = () => {
    const initFeilds = {
        user_id: '',
        page_id: '',
        app_id: '',
        secret_id: '',
        client_id: '',
        user_access_token: '',
        page_access_token: '',
        long_access_token: '',
        access_code: null,
        api_type: 'instagram'

    }
    const initErrors = {
        secret_id: '',
        app_id: ''
    }

    const [loaded, setLoaded] = useState(true)
    const [field, setField] = useState(initFeilds)
    const [accesscode, setAccesscode] = useState(null)
    const [errors, setErrors] = useState(initErrors)
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    useEffect(() => {
        init()

    },[])
    const init = async() => {
      setLoaded(false)
      await fetchDataApis()
      await connectionIg()
      setLoaded(true)

    }
    const fetchDataApis = async() => {
        const response = await getApi(`${initFeilds.api_type}`)
        if(response.status == 200){
         //  console.log(`response data ${initFeilds.api_type} : `, response.data)
            const data = response.data
            if(data){
                    setField(data)
                    if(data.access_code){
                        const code = data.access_code
                        setAccesscode(code)
                    }
            }
        }

    }
    const connectionIg = async() => {
        const response = await getInstagram()
     //  console.log('connectionIg : ', response)
    }
    
    const validations = () => {
        let x = 0;
        let err = initErrors
        if(!field.app_id){
            err.app_id = '* Please enter Instagram App ID'
            x++
        }
        if(!field.secret_id){
            err.secret_id = '* Please enter Instagram Secret ID'
            x++
        }
        if(!field.user_access_token){
            err.user_access_token = '* Please enter Instagram Access Token'
            x++
        }
        setErrors(err)
        console.error('error validation : ', x , ' : ' , err)
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

        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลนี้',status: 'ready'})
        await setLoaded(true)

    }
    const handleSubmit = async() => {
        await setLoaded(false)
        await submitApi()
        await setLoaded(true)
    }
    const submitApi = async() => {
        const params = {
            app_id : field.app_id,
            secret_id : field.secret_id,
            api_type : field.api_type,
            user_access_token: field.user_access_token,
            access_code: null
        }
        const res = await storeApi(params)
        if(res.status == 201 || res.status == 200){
       //  console.log('response update shopee api : ', res)
            setField(res.data)
            /*
            if(res.data.access_code)
            setQuerys(res.data.access_code)
            */
            setModalconfirm({view:true, title: '', message : '',status: 'success'})
            setTimeout(() => {
                setModalconfirm({view:false})
            },3000)
        }
    }

    return (
      <>
      {!loaded ? <Loading /> :
        <Container fluid>
          <Form onSubmit={onConfirmation}>
              <Card className="strpied-tabled-with-hover px-2 mb-2">
                  <Card.Header>
                      <Card.Title as="h4">INSTAGRAM API</Card.Title>
                      <p className="card-category">INSTAGRAM API for sharring products content</p>
                      <hr/>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive">
                      <Row className="mb-2">
                                                  <Col md={6}>
                                                      <Card>
                                                          <Card.Header>
                                                              <Card.Title as="h5">ตั้งค่า INSTAGRAM APP ID</Card.Title>
                                                              <hr/>
                                                          </Card.Header>
                                                          <Card.Body className="h320">
                                                              <div className="mb-2">
                                                                  <Form.Group>
                                                                      <Form.Label>App ID <small className="text-danger">*</small></Form.Label>
                                                                      <Form.Control type="input" placeholder="Input Instagram APP ID"
                                                                          onChange={e => setField({...field, app_id: e.target.value})}
                                                                          value={field.app_id}
                                                                          />
                                                                      {errors.app_id ? <small className="text-danger">{errors.app_id}</small> : null}
                                                                  </Form.Group>
                                                              </div>
                                                              <div className="mb-2">
                                                                  <Form.Group>
                                                                      <Form.Label>Secret ID <small className="text-danger">*</small></Form.Label>
                                                                      <Form.Control type="input" placeholder="Input Instagram Secret ID"
                                                                          onChange={e => setField({...field, secret_id: e.target.value})}
                                                                          value={field.secret_id}
                                                                      />
                                                                      { errors.secret_id ? <small className="text-danger">{errors.secret_id}</small> : null}
                                                                  </Form.Group>
                                                              </div>
                                                              <div className="mb-2">
                                                                  <Form.Group>
                                                                      <Form.Label>Access Token <small className="text-danger">*</small></Form.Label>
                                                                      <Form.Control style={{height:'100%'}} as='textarea' placeholder="Input Instagram Secret ID"
                                                                          onChange={e => setField({...field, user_access_token: e.target.value})}
                                                                          value={field.user_access_token}
                                                                      />
                                                                      { errors.user_access_token ? <small className="text-danger">{errors.user_access_token}</small> : null}
                                                                  </Form.Group>
                                                              </div>
                                                              
                                                          </Card.Body>
                                                      </Card>
                      
                                                  </Col>
                                                  <Col md={6} className="border-1">
                                                      <Card>
                                                          <Card.Header>
                                                              <Card.Title as="h5">INSTAGRAM ACCESS TOKEN SETTING</Card.Title>
                                                              <hr/>
                                                          </Card.Header>
                                                          <Card.Body className="h320">
                                                                  {field.user_access_token ?
                                                                      <Form.Group>
                                                                          <Form.Label>Access Token ID</Form.Label>
                                                                          <Form.Control as="textarea"
                                                                              rows={6}
                                                                              readOnly
                                                                              placeholder="Instagram user access token"
                                                                              className="bg-white h-100 mb-2"
                                                                              defaultValue={field.user_access_token ?? ''}
                                                                          />
                                                                          {/* <Button variant="outline-secondary" onClick={handleFBLogin} id="button-addon2" className="w-100">
                                                                              <Refresh /> Regenerate User Access Token
                                                                          </Button> */}
                                                                      </Form.Group>
                                                                      :
                                                                          
                                                                          <div className="button-overlay text-center mt-2">
                                                                              {/* <button className='btn btn-primary btn-lg' type="button" onClick={handleFBLogin}><Facebook /> Generate Access Token with Instagram User</button> */}
                                                                              {/* <div className="fb-login-button" data-width="" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="false"></div>  */}
                                                                          </div>                                
                                                                      }
                                                                  
                                                          </Card.Body>
                                                      </Card>
                      
                                                  </Col>
                                              </Row>
                  </Card.Body>
                  <Card.Footer className="text-end">
                      <hr/>
                      <Button variant="primary" type="submit"><SaveAltSharp /><span className="ms-2">{(field) ? 'UPDATE' : 'SAVE'} API INSTAGRAM</span> </Button>
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

export default Apiinstagram