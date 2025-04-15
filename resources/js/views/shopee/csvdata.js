import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchShopee, getShopee, storeShopee, updateShopee } from "../../controllers/csvreaderController"
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row, Table } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import Paginate from "../../components/Pagination/Paginate"
import { Clear, FacebookRounded, FileUpload, Search, ShareRounded } from "@mui/icons-material"
import ModalCsvUpdate from "./modalupload"
import Modalsharing from "./modalshare"

const Shopeedata = () => {
    const initParams = {
        productfile : 0,
        keyword : '',
        field : 'title',
        is_official_shop : false,
        is_preferred_shop: false,
        item_rating : '',
        shop_rating : '',
        item_sold : '',
        stock : '',
        price : '',
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
    const [items, setItems] = useState([])
    const [csvfile, setCsvfile] = useState(null)
    const [files, setFiles] = useState([])
    const [modalupload, setModalupload] = useState({view:false})
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
        const pm = getParams()
        await fetchData(pm)
        await setPageStatus('ready')
    }

    const fetchData = async(pam) => {
        const res = await fetchShopee(pam)
     //  console.log('response call fetch data : ', res)
        if(res.status == 200){
            const apis = res.data.api ?? []
            const products = res.data.products ?? []
            let itemsData = []
            for(let i = 0; i < apis.length; i++){
                const item = apis[i]
                const product = products.find(x => x.itemid == item.itemId)
                let media = []
                media.push({
                    "id": 0,
                    "ref_id": 0,
                    "url": item.imageUrl,
                    "path": null,
                    "filename": null,
                    "field": "image_link_3",
                    "sortable": 0,
                    "created_at": null,
                    "updated_at": null
                })
                if(product && product.medeas){
                    for(let im = 0; im < product.medeas.length; im++)
                    {
                        const img = product.medeas[im]
                        media.push({
                                "id": img.id,
                                "ref_id": img.ref_id,
                                "url": img.url,
                                "path": null,
                                "filename": null,
                                "field": "image_link_3",
                                "sortable": im,
                                "created_at": null,
                                "updated_at": null
                        })
                    }

                }

                
                itemsData.push({
                        "id": product ? product.id : 0,
                        "itemid": item.itemId,
                        "title": item.productName,
                        "shopid": item.shopId,
                        "shop_name": item.shopName,
                        "stock": product ? product.stock : 0,
                        "item_sold": item.sales,
                        "shop_rating": item.ratingStar,
                        "item_rating": item.ratingStar,
                        "price": item.price,
                        "description": product ? product.description : '',
                        "productLink": item.productLink,
                        "offerLink": item.offerLink,
                        "medeas": media
                })
            }
            setItems(itemsData)
        }
    }
    
    const getParams = () => {
        let pam = []
        pam.push(`per_page=${params.per_page}`)
        pam.push(`current_page=${params.current_page}`)
        pam.push(`page=1`)
        
        if( params.keyword )
            pam.push(`field=${params.field}&keyword=${params.keyword}`)

  
        // if( params.field )
        //   pam.push(`field=${params.field}`)
          
        return `?${pam.join('&')}`
    }
    const changePage = async(pageNo) =>{
        await setPageStatus('loading')
        await setParams({...params, page : pageNo})
        await fetchData(pageNo)
        await setPageStatus('ready')
        await window.scroll(0,0)

    }
    const selectedFile = (e) => {
        const file = e.target.files[0];
     //  console.log('file: ', file)
        if (file) {
            setCsvfile(file);
        }
    }

    const submitSearch = async() => {
        await setPageStatus('loading')
        const formdata = new FormData()
        formdata.append('file',csvfile)
        formdata.append('field',params.field)
        formdata.append('keyword',params.keyword)

     //  console.log('params : ', params)
        const res = await storeShopee(formdata)
     //  console.log('response csv : ', res)
        if(res.status == 201 || res.status == 200){
            const callbackData = res.data
            setParams({...params, field: callbackData.field, keyword : callbackData.keyword})

            let pam = []
            pam.push(`per_page=${params.per_page}`)
            pam.push(`current_page=1`)
            
            if( callbackData.keyword )
                pam.push(`field=${callbackData.field}&keyword=${callbackData.keyword}`)

            if( callbackData.itemsid )
                pam.push(`itemsid=${callbackData.itemsid.join(',')}`)

            await fetchData(`?${pam.join('&')}`)
        }
        await setPageStatus('ready')
    }

    const clearInput = (e) => {
        e.preventDefault();
        setCsvfile(null)
        setParams(initParams)
    }
    const updateSuccess = async() => {
        await setParams(initParams)
        await submitSearch()
    }
    const sharingConfirm = (e) => {
        setModalconfirm({view:true, title: 'ยืนยันการแชร์ข้อมูล', message : 'คุณต้องการแชร์สินค้าทั้งหมดในหน้านี้',status: 'ready'})
    }
    const submitShare = async(field) => {
        e.preventDefault();
        try {   
            const content =  `${field.title}
                            \nคะแนนสินค้า : ${field.item_rating} 
                            \nราคา : ${field.price}
                            \n พิกัดสินค้า : ${field.offerLink}`
            const params = {
                caption : content ?? '',
                itemId: field.itemid,
                productName: field.title,
                shopId: field.shopid,
                shopName: field.shop_name,
                imageUrl: field.media[0].url,
                offerLink: field.offerLink,
                productLink: field.productLink,
                ratingStar: field.item_rating
            }
            return await facebookPost(params)
            // console.log('Uploaded image ID:', res);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }
    const sharingAll = async() => {
        let progress = 0;
        for(let i = 0; i < items.length; i++)
        {
                await submitShare(items[i])
                progress++
                const percentage = (Number(progress) / Number(items.length)) * 100;
                setModalconfirm({...modalconfirm, percentage : percentage})
        }
        if(progress >= Number(items.length)){
            setModalconfirm({view:true, title: '', message : '',status: 'success',percentage:0})
            setTimeout(async() => {
                const del = await destroyShopee(0)
                if(del.status == 200 || del.status == 204)
                {
                    setModalconfirm({view:false})
                    window.location.reload()
                }
            },3000)
        }
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
                                <Card.Title as="h4">Shopee Products From JSON Files</Card.Title>
                                <p className="card-category">
                                Reader from csv file with shopee
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
                                <p><strong>Options Filter</strong></p>
                                
                                <Row className="mb-2 mt-2 ">
                                    <Col md="4">
                                        <Form.Group controlId="formFile" className="mb-3 pe-4">
                                            <Form.Label style={{height:'32px'}}>Filter with CSV File</Form.Label>
                                            <Form.Control type="file" accept=".csv" onChange={selectedFile} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label style={{height:'32px'}}>Filter with Keywords</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text id="basic-addon1">
                                                    <Form.Select value={params.field} onChange={e => setParams({...params, field : e.target.value})}>
                                                        <option value="title">ชื่อสินค้า</option>
                                                        <option value="itemid">รหัสสินค้า</option>
                                                        <option value="shop_name">ชื่อร้านค้า</option>
                                                        <option value="shopid">รหัสร้านค้า</option>
                                                        <option value="global_category1">กลุ่มสินค้าที่ 1</option>
                                                        <option value="global_category2">กลุ่มสินค้าที่ 2</option>
                                                        <option value="global_category3">กลุ่มสินค้าที่ 3</option>
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
                                            <Button variant="secondary" size="sm" className="me-2" onClick={clearInput}><Clear color="dark" /> Clear</Button>
                                            <Button variant="primary" size="sm" type="submit" ><Search /> Search</Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="px-2 pe-4 mb-2">
                        <Card.Body className="table-full-width table-responsive px-2 mb-2">
                            <div className="mb-2 text-end">
                                <Button type="button" variant="btn btn-primary" onClick={sharingConfirm}><ShareRounded /> Share All & Delete</Button>
                            </div>

                            <Table striped bordered hover responsive="sm">
                                <thead>
                                    <tr>
                                        <th>Share</th>
                                        <th>product rating</th>
                                        <th><div className="w280">images</div></th>
                                        <th>itemid</th>
                                        <th>product Name</th>
                                        <th>shop rating</th>
                                        <th>item sold</th>
                                        <th>shop name</th>
                                        <th>shopid</th>
                                        <th>price</th>
                                        <th>stock</th>
                                        <th>product link</th>
                                        <th>product short link</th>
                                    </tr>
                                </thead>
                                {items.length > 0 ?
                                <tbody>
                                    {items.map((item,idx) => (
                                        <tr key={`items-${idx}`}>
                                            <td><FacebookRounded color="primary" className="pointer" onClick={() => setModalshare({view:true, items : item})} /></td>
                                            <td>{ item.item_rating }</td>
                                            <td>
                                                {item.medeas?.map((img,i) => (
                                                    <img src={img.url} key={i}  className="w80 m-2" />
                                                ))}
                                            </td>
                                            <td>{ item.itemid }</td>
                                            <td><div className="w280">{ item.title }</div></td>
                                            <td>{ item.shop_rating }</td>
                                            <td>{ item.item_sold }</td>
                                            <td>{ item.shop_name }</td>
                                            <td>{ item.shopid }</td>
                                            <td>{ item.price }</td>
                                            <td>{ item.stock }</td>
                                            <td><Link to={item.productLink} target="_blank">{item.productLink}</Link></td>
                                            <td><Link to={ item.offerLink} target="_blank">{item.offerLink}</Link></td>
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
                        </Card.Body>
                    </Card>
                    {pageOption.last_page > 1 ? 
                    <Card className="px-2 mb-2">
                        <Card.Body>
                            <div className="text-center">
                                {/* <Paginate options={pageOption} clickPage={e => changePage(e)} /> */}
                            </div>
                        </Card.Body>
                    </Card>
                    : null }
                </Col>
            </Row>
        </Container>
        <ModalCsvUpdate show={modalupload.view} 
                        onHide={() => setModalupload({...modalupload,view:false})}
                        onSuccess={updateSuccess}
        />
        <Modalsharing show={modalshare.view} 
                        onHide={() => setModalshare({...modalshare,view:false})}
                        items={modalshare.items}
        />

        </>
        : null }
        </>
    )

}
export default Shopeedata