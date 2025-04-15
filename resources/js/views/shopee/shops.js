import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchShopee, getShopee, storeShopee, updateShopee } from "../../controllers/csvreaderController"
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import Paginate from "../../components/Pagination/Paginate"
import { CheckRounded, Clear, FacebookRounded, FileUpload, Search, ShareRounded, StorefrontOutlined } from "@mui/icons-material"
import ModalCsvUpdate from "./modalupload"
import Modalsharing from "./modalshare"
import { fetchShopeeproducts } from "../../controllers/shopeeController"
import { commissionRate, formatNumber } from "../../helpers/functions"
import Modalsharingapi from "./modalshareapi"
import Modalconfirm from "../../components/Dialogs/Confirmation"
import { facebookPost } from "../../controllers/facebookController"
import { getOffershop, updateApiAccesscode } from "../../controllers/apiscontroller"
import Modalsharingshop from "./modalshareshop"

const Shopoffers = () => {
    const initParams = {
        field: 'keyword',
        keyword: '',
        page : 1,
        per_page : 50,
        current_page : 1
      }
    
      const initPageOption = {
          current_page : 1,
          last_page : 1,
          page : 1,
          offset : 20,
          page_list : [{no:1}]
      }
    const [pageOption, setPageOption] = useState(initPageOption)
    const [params, setParams] = useState(initParams)
    const [isloaded, setIsloaded] = useState(false)
    const [pageStatus, setPageStatus] = useState('loading')
    const [apis, setApis] = useState(null)
    const [items, setItems] = useState([])
    const [modalshare, setModalshare] = useState({view:false, items:null})
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already', percentage: 0})
    const navigate = useNavigate()
    useEffect(() => {
        if(!isloaded){
            init()
            setIsloaded(true)
        }
    },[])

    const init = async() => {
        await setPageStatus('loading')
        await fetchData(1)
        await setPageStatus('ready')
    }

    const fetchData = async(pageNo) => {
        const pam = getParams(pageNo)
        const res = await getOffershop(pam)
     //  console.log('res call fetch data : ', res.data)
        if(res.status == 200){
            const itemsData = res.data.shopOffer.nodes
            const meta = res.data.shopOffer.pageInfo
         //  console.log('meta : ', meta.hasNextPage)
            setItems(itemsData)
            setApis(res.data.apis)
            let last_page = 1
                
            setPageOption({
                ...pageOption,
                current_page: meta.page,
                page: meta.page,
                last_page: meta.hasNextPage ? Number(meta.page) + 1 : pageOption.last_page
            })
            setParams({
                ...params,
                page: meta.page,
                per_page: meta.limit,
                current_page: meta.page
            })
        }
    }
    
    const getParams = (pageNo) => {
        return {
            per_page: params.per_page,
            current_page: params.current_page,
            page: pageNo,  
            field: params.field,
            keyword: params.keyword,
        }
    }
    const changePage = async(pageNo) =>{
        await setPageStatus('loading')
        await setParams({...params, page : pageNo, current_page: pageNo})
        await setPageOption({...pageOption, page : pageNo,current_page: pageNo})
        await fetchData(pageNo)
        await setPageStatus('ready')
        window.scroll(0,0)

    }

    const submitSearch = async() => {
        await setPageStatus('loading')
        await fetchData(1)
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setParams(initParams)
    }
    const updateSuccess = async() => {
        await setParams(initParams)
        await submitSearch()
    }
    const sharingConfirm = (e) => {
        setModalconfirm({view:true, title: 'ยืนยันการแชร์ข้อมูล', message : 'คุณต้องการแชร์สินค้าทั้งหมดในหน้านี้',status: 'ready', type: 'sharing'})
    }
    const submitShare = async(field) => {
        try {   
            const content =  `${field.productName}\nRatting : ${field.ratingStar} \nราคา : ${(field.priceMin != field.priceMax) ? `${field.priceMin}-${field.priceMax}` : field.price } ฿.-\n พิกัดสินค้า : ${field.offerLink}`
            const params = {
                caption : content ?? '',
                itemId: field.itemId,
                productName: field.productName,
                shopName: field.shopName,
                imageUrl: field.imageUrl,
                offerLink: field.offerLink,
                productLink: field.productLink,
                shopId: field.shopId,
                ratingStar: field.ratingStar
            }
            return await facebookPost(params)
            // console.log('Uploaded image ID:', res);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }
    const sharingAll = async() => {
        // console.log('sharingAll e : ', e)
        let progress = 0;
        for(let i = 0; i < items.length; i++)
        {
            const sharer = await submitShare(items[i])
            // console.log('submitShare  : ', sharer)
            if(sharer.status == 200 ){
                if(progress >= 20 ) break;
                progress++
                const percentage = (progress / 20) * 100;
                setModalconfirm({...modalconfirm, percentage : percentage})
            }
        }
        if(progress >= 20){
            setModalconfirm({view:true, title: '', message : '',status: 'success',percentage:0})
            setTimeout(() => {
                setModalconfirm({view:false})
                window.location.reload()
            },3000)
        }
    }
    const onConfirmation = async(item) => {
        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการตั้งให้ร้านนี้ เป็นค่าเริ่มต้นในการแชร์สินค้าไปยังเพจ อัตโนมัติ',status: 'ready',data: item, type: 'set-shop'})
    }
    const ApplyConfirm = async() => {
        if(modalconfirm.type == 'sharing'){
            await sharingAll()
        }
        if(modalconfirm.type == 'set-shop'){
            await setDefaultshop(modalconfirm.data)
        }
    }
    const setDefaultshop = async(item) => {
        // console.log('apis : ', apis)
        setPageStatus('loading')
        const access_code = {
            "key": "shopId",
            "page": apis.access_code.page,
            "limit": apis.access_code.limit,
            "value": item.shopId
        }

        // console.log('onApply ', item)
        // console.log('new access code  ', access_code)
        const res = await updateApiAccesscode({api_type: 'shopee', access_code: access_code})
        if(res.status == 200){
            setModalconfirm({view:true, title: '', message : '',status: 'success',percentage:0})
            setTimeout(() => {
                setModalconfirm({view:false})
                setApis({...apis,access_code : res.data.access_code})
            },3000)
        }
        setPageStatus('ready')
        
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
                                <Card.Title as="h4">Shopee Shops Offers</Card.Title>
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
                                <h5>ค้นหาร้านค้า</h5>
                                <Row className="mb-2 mt-2 ">
                                    <Col md="8">
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label style={{height:'32px'}}>Filter with Keywords</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon1">
                                                    <Form.Select value={params.field} onChange={e => setParams({...params, field : e.target.value})}>
                                                        <option value="keyword">ชื่อร้าน</option>
                                                        <option value="shopId">รหัสร้านค้า</option>
                                                    </Form.Select>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    placeholder="คำค้นหา"
                                                    aria-label="Keyword"
                                                    aria-describedby="basic-addon1"
                                                    value={params.keyword}
                                                    onChange={ e => setParams({...params, keyword : e.target.value })}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md="4" className="text-end">
                                        <Form.Label>&nbsp;</Form.Label>
                                        <Form.Group className="search-button">
                                            <Button variant="primary" size="sm" type="submit" ><Search /> Search</Button>
                                            <Button variant="secondary" size="sm" className="me-2" onClick={clearInput}><Clear color="dark" /> Clear</Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="px-2 pe-4 mb-2">
                        <Card.Body className="table-full-width table-responsive px-2 mb-2">
                            <div className="mb-2 text-end">
                                <Button type="button" variant="btn btn-primary" onClick={sharingConfirm}><ShareRounded /> Share All</Button>
                            </div>
                            <div className="table-block">
                            <Table striped bordered hover responsive="sm">
                                <thead>
                                    <tr>
                                        <th>Set Default</th>
                                        <th><div className="w80">images</div></th>
                                        <th>shopid</th>
                                        <th>shop name</th>
                                        <th>shop rating</th>
                                        <th>Commission rate</th>
                                        <th>offer link</th>
                                        <th>shop link</th>
                                    </tr>
                                </thead>
                                {items.length > 0 ?
                                <tbody>
                                    {items.map((item,idx) => (
                                        <tr key={`items-${idx}`}>
                                            <td className="text-center">
                                                {apis.access_code.value != item.shopId &&

                                            <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>ตั้งให้เป็นร้านค้าหลัก</Tooltip>
                                            }
                                            >
                                                <Button type="button" onClick={() => onConfirmation(item)} size="sm" variant="outline-primary"><StorefrontOutlined /></Button>
                                            </OverlayTrigger>
                                            }
                                            </td>
                                            <td><Link to={`/admin/shopee-shop/${item.shopId}`}><img src={item.imageUrl}  className="w80 m-2" /></Link></td>
                                            <td><Link to={`/admin/shopee-shop/${item.shopId}`}>{ item.shopId }</Link></td>
                                            <td><Link to={`/admin/shopee-shop/${item.shopId}`}>{ item.shopName }</Link></td>
                                            <td><Link to={`/admin/shopee-shop/${item.shopId}`}>{ item.ratingStar }</Link></td>
                                            <td><Link to={`/admin/shopee-shop/${item.shopId}`}>{ commissionRate(item.commissionRate) }%</Link></td>
                                            <td><Link to={item.offerLink} target="_blank">{item.offerLink}</Link></td>
                                            <td><Link to={ item.originalLink} target="_blank">{item.originalLink}</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                                :
                                <tbody>
                                    <tr>
                                        <td colSpan={47} className="">- ไม่พบข้อมูล -</td>
                                    </tr>
                                </tbody>
                                }
                            </Table>
                            </div>
                        </Card.Body>
                    </Card>
                    {pageOption.last_page > 1 ? 
                    <Card className="px-2 mb-2">
                        <Card.Body>
                            <div className="text-center">
                                <Paginate options={pageOption} clickPage={e => changePage(e)} />
                            </div>
                        </Card.Body>
                    </Card>
                    : null }
                </Col>
            </Row>
        </Container>

        <Modalsharingshop show={modalshare.view} 
                        onHide={() => setModalshare({...modalshare,view:false})}
                        items={modalshare.items}
        />
        <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
            title={modalconfirm.title} 
            message={modalconfirm.message} 
            success={modalconfirm.status}
            percentage={modalconfirm.percentage}
            onSubmit={ApplyConfirm}
        />

        </>
        : null }
        </>
    )

}
export default Shopoffers