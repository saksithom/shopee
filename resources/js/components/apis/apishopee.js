import { SaveAltSharp, ShoppingBasketOutlined } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Button,Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import Modalconfirm from "../Dialogs/Confirmation";
import { Inputcontext } from "../../helpers/functions";
import { storeApi } from "../../controllers/apiscontroller";
import Shopoffer from "./shopoffers";
import Keywordcard from "./keywordcard";
import Cardkeywords from "../Cards/productKeyword";
import Cardcategory from "../Cards/productcategory";
import Cardshopoffer from "../Cards/shopoffers";

const Apishopee = () => {
    const initFeilds = {
        user_id: '',
        page_id: '',
        app_id: '',
        secret_id: '',
        client_id: '',
        user_access_token: '',
        access_code: {
            key: 'keyword',
            value: '',
            rating: 4.5,
            saled: 5,
            page:  1,
            limit: 5
        },
        api_type: 'shopee'

    }
    const initErrors = {
        secret_id: '',
        app_id: ''
    }

    const {apis, setApis} = useContext(Inputcontext)
    const [loaded, setLoaded] = useState(true)
    const [field, setField] = useState(initFeilds)
    const [accesscode, setAccesscode] = useState(null)
    const [errors, setErrors] = useState(initErrors)
    const [querys, setQuerys] = useState({
        key: 'keyword',
        value: '',
        rating: 4.5,
        saled: 5,
        page:  1,
        limit: 5
    })
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    useEffect(() => {
        if(apis && apis.shopee ){
            setField(apis.shopee)
            if(apis.shopee.access_code){
                const code = apis.shopee.access_code
                setAccesscode(code)
                setQuerys({
                    ...code,
                    key: code.key ?? 'keyword',
                    value: code.value ?? '',
                    rating: parseFloat(code.rating) ?? 4.5,
                    page: parseInt(code.page) ?? 1,
                    limit: code.limit ?? 5,
                    price: parseInt(code.price) ?? 1,
                    commission: parseFloat(code.commission) ?? 1,
                    sales: parseInt(code.sales) ?? 1
        
                })
            }
        }

    },[])
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
            access_code: querys
        }
        const res = await storeApi(params)
        if(res.status == 201 || res.status == 200){
         //  console.log('response update shopee api : ', res)
            setApis({
                ...apis,
                shipee : res.data
            })
            setField(res.data)
            if(res.data.access_code)
            setQuerys(res.data.access_code)

            setModalconfirm({view:true, title: '', message : '',status: 'success'})
            setTimeout(() => {
                setModalconfirm({view:false})
            },3000)
        }
    }

    return (
        <>
        {loaded ?
        <>
        <Form onSubmit={onConfirmation}>
            <Card className="strpied-tabled-with-hover px-2 mb-2">
                <Card.Header>
                    <Card.Title as="h4">Shopee Affiliate Open API</Card.Title>
                    <p className="card-category">Setting Shopee Affiliates OPEN API</p>
                    <hr/>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive">
                    <Row>
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
                    </Row>
                    <hr/>
                    <Card.Title as="h4">ตั้งค่าการค้นหาและแชร์สินค้าอัตโนมัติ</Card.Title>
                    <Row>
                        <Col md="8">
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>ค้นหาจาก</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1" style={{borderLeft:'1px solid #bdbdbd'}}>
                                            <Form.Select 
                                                value={querys.key} 
                                                onChange={e => setQuerys({...querys, key : e.target.value, value: ''})}
                                                style={{boxShadow:'none', borderLeft:0,borderTop:0, borderBottom:0}}
                                            >
                                                {/* <option value="keyword">KEYWORD</option>
                                                <option value="shopId">SHOP ID</option> */}
                                                <option value="keyword">คำค้นหา</option>
                                                <option value="shopId">รหัสร้านค้า</option>
                                                <option value="productCatId">รหัสหมวดสินค้า</option>
                                            </Form.Select>
                                        </InputGroup.Text>
                                        <Form.Control
                                            placeholder="คำค้นหา"
                                            aria-label="Keyword"
                                            aria-describedby="basic-addon1"
                                            value={querys.value}
                                            onChange={ e => setQuerys({...querys, value : e.target.value })}
                                        />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row  className="mb-2">
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>จำนวนโพส/ครั้ง: </Form.Label>
                                <Form.Control type="number" value={querys.limit} onChange={e => setQuerys({...querys, limit: e.target.value})} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                <Form.Control type="number" value={querys.sales} onChange={e => setQuerys({...querys, sales: e.target.value})} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                <Form.Control type="number" value={querys.rating} onChange={e => setQuerys({...querys, rating: e.target.value})} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                <Form.Control type="number" value={querys.price} onChange={e => setQuerys({...querys, price: e.target.value})} />
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                <Form.Control type="number" value={querys.commission} onChange={e => setQuerys({...querys, commission: e.target.value})} />
                            </Form.Group>
                        </Col>
                    </Row>                    
                    
                    <hr className="mb-2" />
                    {(accesscode && accesscode.key == 'keyword' && accesscode.value) && <Cardkeywords apis={apis} querys={accesscode} onApply={submitApi} />}
                    {(accesscode && accesscode.key == 'productCatId' && accesscode.value) && <Cardcategory apis={apis} querys={accesscode} onApply={submitApi} />}
                    {(accesscode && accesscode.key == 'shopId' && accesscode.value) && <Cardshopoffer apis={apis} querys={accesscode} onApply={submitApi} />}
                </Card.Body>
                <Card.Footer className="text-end">
                    <hr/>
                    <Button variant="primary" type="submit"><SaveAltSharp /><span className="ms-2">{(apis && apis.shopee) ? 'UPDATE' : 'SAVE'} API Shopee</span> </Button>
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
        : null 
        }
        </>

    )
}

export default Apishopee