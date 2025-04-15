import React, { useEffect, useState } from "react"
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row, Table } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import { ArrowCircleRightOutlined, CheckBoxOutlined, Clear, RestartAlt, Search } from "@mui/icons-material"
import Products from "../../components/Shopee/products"
import Cardkeywords from "../../components/Cards/productKeyword"
import Cardshopoffer from "../../components/Cards/shopoffers"
import Cardcategory from "../../components/Cards/productcategory"
import ModalImage from "../../components/Modals/Pictures"
import { fetchSetting, storeSetting } from "../../controllers/settingController"
import SelectSocials from "../../components/Selects/SelectSocials"
import Modalsetfilters from "../../components/Modals/setfilters"

const Shopeeproducts = () => {
    const initParams = {
        times: 2,
        page_id: '',
        page: null,
        field: 'keyword',
        value: '',
        limit: 5,
        sales: 10,
        rating: 4.8,
        minprice: 10,
        mincommission: 5
    }
    const [modalfilters, setModalfilters] = useState({ view : false, status : 'already', data: null})
    const [settings, setSettings] = useState(null)
    const [params, setParams] = useState(initParams)
    const [fields, setFields] = useState(initParams)
    const [isSubmit, setIsSubmit] = useState(false)
    const [isloaded, setIsloaded] = useState(false)
    const [pageStatus, setPageStatus] = useState('loading')
    useEffect(() => {
        if(!isloaded){
            init()
            setIsloaded(true)
        }
    },[])

    const init = async() => {
        await setPageStatus('loading')
        await setPageStatus('ready')
    }

    const submitSearch = async() => {
        await setPageStatus('loading')
        await setParams(fields)
        setIsSubmit(true)
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setParams(initParams)
        setIsSubmit(false)
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
            <Row>
                <Col md="12">
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
                                <h5>ค้นหาสินค้า</h5>
                                <Row>
                                    <Col md="10">
                                        <Form.Group controlId="formFile">
                                            <InputGroup>
                                                <InputGroup.Text id="basic-addon1">
                                                    <Form.Select value={fields.field} onChange={e => setFields({...fields, field : e.target.value, value: ''})}>
                                                        <option value="keyword">คำค้นหา</option>
                                                        <option value="itemId">รหัสสินค้า</option>
                                                        <option value="shopId">รหัสร้านค้า</option>
                                                        <option value="productCatId">รหัสหมวดสินค้า</option>
                                                    </Form.Select>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder="คำค้นหา"
                                                    aria-label="Keyword"
                                                    aria-describedby="basic-addon1"
                                                    value={fields.value}
                                                    onChange={ e => setFields({...fields, value : e.target.value , keyword: e.target.value})}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row  className="mb-2">
                                    <Col md="2">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                            <Form.Control type="number" value={fields.sales} onChange={e => setFields({...fields, sales: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="2">
                                        <Form.Group className="mb-2">
                                            <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                            <Form.Control type="number" value={fields.rating} onChange={e => setFields({...fields, rating: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="2">
                                        <Form.Group className="mb-2">
                                            <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                            <Form.Control type="number" value={fields.minprice} onChange={e => setFields({...fields, minprice: e.target.value})} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="2">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                            <Form.Control type="number" value={fields.mincommission} onChange={e => setFields({...fields, mincommission: e.target.value})} />
                                        </Form.Group>
                                    </Col>

                                    <Col md="2" className="text-end">
                                        <Form.Label>&nbsp;</Form.Label>
                                        <Form.Group className="search-button">
                                            <Button variant="primary" size="sm" type="submit" className="me-2" ><Search /></Button>
                                            <Button variant="secondary" size="sm" className="" onClick={clearInput} title="Clear"><RestartAlt color="secondary" /></Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            {isSubmit && (
                                <div className="text-end mt-2 pe-4 me-4">
                                    <Button variant="primary" type="button" onClick={onSetfilters}><CheckBoxOutlined /> ตั้งเป็นค่าเริ่มต้น</Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                    
                    <Products querys={params} />
                </Col>
            </Row>
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
export default Shopeeproducts