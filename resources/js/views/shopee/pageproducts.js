import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import { commissionRate, formatNumber } from "../../helpers/functions"
import Products from "../../components/Shopee/products"
import { getSetting, storeSetting } from "../../controllers/settingController"
import Modalsetfilters from "../../components/Modals/setfilters"
import { fetchShared } from "../../controllers/sharedcontroller"
import moment from "moment-timezone"
import { CancelOutlined, CheckBoxOutlined, SaveAltOutlined, Search } from "@mui/icons-material"
import Modalconfirm from "../../components/Dialogs/Confirmation"

const PageProducts = () => {
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
    const [modalconfirm, setModalconfirm] = useState({ view : false, status : 'already', data: null})
    
    const [page, setPage] = useState(null)
    const [fields, setFields] = useState(null)
    const [options, setOptions] = useState(initParams)
    const [isloaded, setIsloaded] = useState(false)
    const [pageStatus, setPageStatus] = useState('loading')
    const [querys, setQuerys] = useState(initParams)
    const [posts, setPosts] = useState({})
    
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
            navigate('/admin/shopee/products')

        await getSettingdata()
        await setPageStatus('ready')
    }
    const getSettingdata = async() => {
        const response = await getSetting(queryString.id)
        if(response.status == 200){
            const data = response.data
            const option = data.options
            const page_id = data.page_id
            // console.log('setting options : ', option)
            const querydata = {
                times: option.times,
                page_id: queryString.id,
                page: data.page,
                field: option.field,
                value: option.value,
                limit: option.limit,
                sales: option.sales,
                rating: option.rating,
                minprice: option.minprice,
                mincommission: option.mincommission
            }
            setFields(data)
            setPage(data.page)
            setOptions(option)
            setQuerys(querydata)
            const todayPosts = await fetchPosted(`?page_id=${page_id}&today=yes&per_page=10`)
            const allPosts = await fetchPosted(`?page_id=${page_id}&per_page=10`)
            const filterPosts = await fetchPosted(`?page_id=${page_id}&${option.field}=${option.value}&per_page=10`)
            setPosts({
                today: todayPosts?.meta.total ?? 0,
                lastpost: todayPosts?.data ?? null,
                all: allPosts?.meta.total ?? 0,
                filters: filterPosts?.meta.total ?? 0,
            })
        }
    }        
    
    const fetchPosted = async(params) => {
        const items = await fetchShared(params)
        if(items.status == 200)
          return items.data
        
        return []
    }
    
    const submitSearch = async() => {
        await setPageStatus('loading')
        await setQuerys(options)
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setFields(initParams)
    }

    const onSetfilters = (e) => {
        e.preventDefault()
        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้',status: 'ready'})
    }
    const handleSubmit = async() => {
        setPageStatus('loading')
        const paramsData = {
            page_id : fields.page_id,
            page : fields.page,
            options: {
                field: options.field,
                limit: options.limit,
                sales: options.sales,
                times: options.times,
                value: options.value,
                rating: options.rating,
                minprice: options.minprice,
                mincommission: options.mincommission
            },
            type: fields.type,
            actived: 1
        }
        await storeSetting(paramsData)
        setModalconfirm({...modalconfirm, status: 'success'})
        setTimeout(() => {
            window.location.reload()
        },2000)
    }
    return (
        <>
        {pageStatus == 'loading' && <Loading/> }
        {pageStatus == 'ready' ? 
        <>
        <Container fluid>
            {/* Page Setting */}
            <Card>
            <Card.Header>
                <Card.Title as='h5' className="text-primary">ค่าค้นหาปัจจุบัน</Card.Title>
                <hr className="text-secondary"/>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={submitSearch}>
                <Row>
                    <Col md="4" className="border-1">
                        <Card>
                            <Card.Body>
                                <div className="icon-big text-center icon-warning">
                                    <Image src={page.picture} thumbnail fluid className="w80" />
                                </div>
                                <p className="card-category">
                                    Page Name: <strong className="text-success">{page.name}</strong> <i>({ fields.type})</i><br/>
                                    Page ID: <strong className="text-warning">{page.id}</strong><br/>
                                    { fields.type == 'facebook' && (
                                        <>
                                            category: <strong className="text-info"><i>{page?.category}</i></strong><br/>
                                        </>
                                    )}
                                    จำนวนโพสวันนี้ <strong className="text-primary">{ formatNumber(posts.today,0) }</strong> โพส<br/>
                                    จากโพสทั้งหมด <strong className="text-primary">{ formatNumber(posts.all,0) }</strong> โพส<br/>
                                    โพสล่าสุด <span className="text-success">{posts.lastpost[0]?.updated_at ? moment(posts.lastpost[0]?.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm') : '-'}</span>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="8">
                        <Row>
                            <Col md="8">
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>ค่าค้นหา</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1" style={{borderLeft:'1px solid #bdbdbd'}}>
                                            <Form.Select 
                                                style={{boxShadow:'none', borderLeft:0,borderTop:0, borderBottom:0}}
                                                value={options.field}
                                                onChange={e => setOptions({...options, field: e.target.value, value: ''})}
                                                className="bg-white"
                                            >
                                                <option value="keyword">คำค้นหา</option>
                                                <option value="shopId">รหัสร้านค้า</option>
                                                <option value="productCatId">รหัสหมวดสินค้า</option>
                                            </Form.Select>
                                        </InputGroup.Text>
                                        <Form.Control
                                            placeholder="คำค้นหา"
                                            aria-label="Keyword"
                                            aria-describedby="basic-addon1"
                                            className="bg-white"
                                            onChange={e => setOptions({...options, value: e.target.value})}
                                            value={options.value}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md="4">
                                <Form.Group className="mb-2">
                                    <Form.Label>ระยะเวลาการแชร์ (ชม.): </Form.Label>
                                    <Form.Select 
                                        className="bg-white"
                                        
                                        value={options.times}
                                        onChange={e => setOptions({...options, times: e.target.value})}
                                        >
                                        {[...Array(12)].map((_,h) => (
                                            <option value={Number(h)+1} key={h}>{Number(h)+1}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row  className="mb-2">
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>จำนวนโพส/ครั้ง: </Form.Label>
                                    <Form.Control type="number" 
                                        className="bg-white"
                                        onChange={e => setOptions({...options, limit: e.target.value})}
                                        value={options.limit}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                    <Form.Control type="number" 
                                        className="bg-white"
                                        onChange={e => setOptions({...options, sales: e.target.value})}
                                        value={options.sales}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            onChange={e => setOptions({...options, rating: e.target.value})}
                                           value={options.rating}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="2">
                                    <Form.Group className="mb-2">
                                        <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            onChange={e => setOptions({...options, minprice: e.target.value})}
                                            value={options.minprice}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="4">
                                    <Form.Group className="mb-2">
                                        <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            onChange={e => setOptions({...options, mincommission: e.target.value})}
                                            value={options.mincommission}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>                            
                            <div className="text-end">
                                <Button variant="primary" type="button" onClick={onSetfilters}><CheckBoxOutlined /> บันทึกเป็นค่าเริ่มต้น</Button>
                                <Button variant='success' type='submit' onClick={submitSearch} className="me-2 ms-2" ><Search /> ค้นหา</Button>
                                <Button variant='secondary' type='button' onClick={clearInput} className='me-2'><CancelOutlined /> ยกเลิก</Button>
                                
                            </div>                               
                        </Col>
                    </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <hr/>
                    <div className="mb-2">
                        <span className="me-4">อัพเดทค่าสำหรับค้นหาล่าสุด <strong className="text-primary">{moment(fields.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')}</strong></span>
                        <span className="me-4">จำนวนโพสจากค่าปัจจุบัน <strong className="text-primary me-2 ms-2">{ formatNumber( posts.filters,0) }</strong> โพส</span>
                    </div>
                </Card.Footer>
            </Card>
            {/* Page Setting */}

            <Products querys={querys} />
        </Container>
        <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                title={modalconfirm.title} 
                message={modalconfirm.message} 
                success={modalconfirm.status}
                onApply={handleSubmit}
            />

        </>
        : null }
        </>
    )

}
export default PageProducts