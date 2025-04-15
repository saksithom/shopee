import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import Paginate from "../../components/Pagination/Paginate"
import { CheckBoxOutlined, CheckCircleOutline, Clear, FacebookRounded, LinkOutlined, Search, ShareRounded } from "@mui/icons-material"
import { fetchShopeeproducts } from "../../controllers/shopeeController"
import { commissionRate, formatNumber } from "../../helpers/functions"
import Modalsharingapi from "./modalshareapi"
import Modalconfirm from "../../components/Dialogs/Confirmation"
import { facebookPost } from "../../controllers/facebookController"
import Shopcard from "../../components/apis/shopcard"
import { fetchApi, updateApiAccesscode } from "../../controllers/apiscontroller"
import { fetchShared } from "../../controllers/sharedcontroller"
import ModalImage from "../../components/Modals/Pictures"
import Products from "../../components/Shopee/products"
import Shopoffer from "../../components/apis/shopoffers"
import Cardshopoffer from "../../components/Cards/shopoffers"
import { fetchSetting } from "../../controllers/settingController"
import Modalsetfilters from "../../components/Modals/setfilters"

const ShopProducts = () => {
    const queryString = useParams()
    const initParams = {
        times: 2,
        page_id: '',
        page: null,
        field: 'shopId',
        value: queryString.id,
        limit: 5,
        sales: 10,
        rating: 4.8,
        minprice: 10,
        mincommission: 5
    }
    const [modalfilters, setModalfilters] = useState({ view : false, status : 'already', data: null})
    
    const [settings, setSettings] = useState(null)
    const [fields, setFields] = useState(initParams)
    const [isloaded, setIsloaded] = useState(false)
    const [pageStatus, setPageStatus] = useState('loading')
    const [apis, setApis] = useState(null)
    const [querys, setQuerys] = useState(initParams)
    
    const navigate = useNavigate()
    useEffect(() => {
        if(!isloaded){
            init()
            setIsloaded(true)
        }
    },[])

    const init = async() => {
        await setPageStatus('loading')
        if(!queryString.id)
            navigate('/admin/shopee-shop')

        await fetchDataApis()
        await setPageStatus('ready')
    }
    const fetchDataApis = async() => {
        const response = await fetchApi()
        if(response.status == 200){
            const data = response.data
            if(data){
                const fb = data.find(x => x.api_type == 'facebook')
                const shopee = data.find(x => x.api_type == 'shopee')
                setApis({facebook : fb, shopee : shopee})
                
            }
        }
    }
    
    const submitSearch = async() => {
        await setPageStatus('loading')
        await setQuerys(fields)
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setFields(initParams)
    }

    const onSetfilters = (e) => {
        e.preventDefault()
        setModalfilters({view: true, status:'ready',data: fields})
    }

    return (
        <>
        {pageStatus == 'loading' && <Loading/> }
        {pageStatus == 'ready' ? 
        <>
        <Container fluid>
            <div className="mb-2">
            </div>
            <Row>
                <Col md="6" className="pb-3">
                    <Cardshopoffer querys={querys}  />
                </Col>
                <Col md="6">
                    <Card className="strpied-tabled-with-hover px-2 mb-2">
                        <Card.Header>
                            <Row>
                            <Col md="8">
                                <Card.Title as="h4">Shopee Products</Card.Title>
                                <p className="card-category">
                                {/* Reader from csv file with shopee */}
                                </p>
                            </Col>
                            <Col md="4 text-end">
                                {/* <Button variant="success" size="sm" type="button" className="mt-2" onClick={() => setModalupload({view:true})}><FileUpload  className="me-1" /> Upload Master Product</Button> */}
                            </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive">
                            <Form onSubmit={submitSearch} className="border px-3 mb-3 p-3 form-search">
                                <h5>ค้นหาสินค้าในร้าน</h5>
                                <Row className="mb-0 mt-2 ">
                                    <Col md="12">
                                        <Form.Group controlId="formFile">
                                            <Form.Label style={{height:'32px'}}>Filter with Keywords</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">
                                                    <Form.Select value={fields.field} onChange={e => setFields({...fields, field : e.target.value})}>
                                                        <option value="keyword">คำค้นหา</option>
                                                    </Form.Select>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder="คำค้นหา"
                                                    aria-label="Keyword"
                                                    aria-describedby="basic-addon1"
                                                    value={fields.value}
                                                    onChange={ e => setFields({...fields, value : e.target.value })}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    
                                </Row>
                                <Row  className="mb-2">
                                    <Col md="3">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                            <Form.Control type="number" value={fields.sales} onChange={e => setFields({...fields, sales: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="3">
                                        <Form.Group className="mb-2">
                                            <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                            <Form.Control type="number" value={fields.rating} onChange={e => setFields({...fields, rating: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="3">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                            <Form.Control type="number" value={fields.minprice} onChange={e => setFields({...fields, minprice: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="3" className="text-end pe-0 ps-0">
                                        <Form.Label>&nbsp;</Form.Label>
                                        <Form.Group className="search-button">
                                            <Button variant="primary" size="sm" type="submit" className="me-1" ><Search /></Button>
                                            <Button variant="secondary" size="sm" className="" onClick={clearInput}><Clear color="dark" /></Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md="12" className="text-right">
                    <Button variant="primary" type="button" onClick={onSetfilters}><CheckBoxOutlined /> ตั้งค่าเป็นร้านสำหรับแชร์</Button>
                </Col>
            </Row>
            <Products querys={querys} />
        </Container>
        <Modalsetfilters
                    show={modalfilters.view} 
                    onHide={() => setModalfilters({...modalfilters,view:false})} 
                    options={fields}
        />
        
        </>
        : null }
        </>
    )

}
export default ShopProducts