import React, { useEffect, useState } from "react"
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row, Table } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import { CheckBoxOutlined, Clear, RestartAlt, Search } from "@mui/icons-material"
import Products from "../../components/Shopee/products"
import { useParams } from "react-router"
import Modalsetfilters from "../../components/Modals/setfilters"

const ProductsCategory = () => {
    const params = useParams()
    const initParams = {
        times: 2,
        page_id: '',
        page: null,
        field: 'productCatId',
        value: params.id,
        limit: 5,
        sales: 10,
        rating: 4.8,
        minprice: 10,
        mincommission: 5
    }
    
    const [modalfilters, setModalfilters] = useState({ view : false, status : 'already', data: null})
    const [settings, setSettings] = useState(null)
    const [isloaded, setIsloaded] = useState(false)
    const [fields, setFields] = useState(initParams)
    const [querys, setQuerys] = useState(initParams)
    const [apis, setApis] = useState(null)
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
        await setQuerys(fields)
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setCsvfile(null)
        setParams(initParams)
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
            <Card className="strpied-tabled-with-hover px-2 mb-2">
                <Card.Header>
                    <Card.Title as="h4">Shopee Products By Category ID {params.id}</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive">
                    <Form onSubmit={submitSearch} className="border px-3 mb-3 p-3 form-search">
                        <h5>Filter options</h5>
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
                                    <Button variant="secondary" size="sm" className="" onClick={clearInput}><RestartAlt color="dark" /> </Button>
                                </Form.Group>
                            </Col>
                            <Col md="2" className="text-end">
                                <Form.Label className="w-100">&nbsp;</Form.Label>
                                <Button variant="primary" type="button" onClick={onSetfilters}><CheckBoxOutlined /> ตั้งเป็นค่าเริ่มต้น</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <Products querys={querys} />
        </Container>
        </>
        : null }
        <Modalsetfilters 
                    show={modalfilters.view} 
                    onHide={() => setModalfilters({...modalfilters,view:false})} 
                    options={fields}
                />
        </>
    )
}
export default ProductsCategory