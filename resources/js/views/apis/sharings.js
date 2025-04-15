import React, { useContext, useEffect, useRef, useState } from "react";
import { Facebook, Instagram, InstallDesktopSharp, Refresh, SaveAlt } from "@mui/icons-material";
import { Button,Card, Col, Container, Form, Image, InputGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Modalconfirm from "../../components/Dialogs/Confirmation";
import { getApi, storeApi, updateApi, updateApiAccesscode } from "../../controllers/apiscontroller";
import { facebook_api_link, meta_app_version } from "../../helpers/init_vars";
import Facebookprofile from "../../components/apis/facebookprofile";
import { facebookListPages, facebookPages, facebookPicture } from "../../controllers/facebookController";
import Loading from "../../components/Loading/Loading";
import { Radio, Checkbox } from "@mui/material";
import { commissionRate } from "../../helpers/functions";
import { getSetting, storeSetting } from "../../controllers/settingController";
const Settingsharing = () => {
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

    const [loaded, setLoaded] = useState(false)
    const [field, setField] = useState(initFeilds)
    const [errors, setErrors] = useState(initErrors)
    const [querys, setQuerys] = useState([])
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})

    let componentMounted = useRef(true);
    useEffect(() => {
          if(componentMounted.current){
              init()
          }
      
          return () => {
            componentMounted.current = false;
          }
      },[])

      
    const init = async() => {
        setLoaded(false)
        const facebook = await fetchDataApis()
        if (facebook) {
            if(!facebook.access_code){
                await setLoaded(true)
                return false
            }
            let queryData = []
         //  console.log('facebook access code : ', facebook.access_code)
            const pages = facebook.access_code.pages //.filter(x => x.checked)
            const igs = facebook.access_code.instagrams //.filter(x => x.checked)
            for(let i = 0; i < pages.length; i++)
            {
                const options = await fetchSettings(pages[i].id)
                const setData = await setDataquery(pages[i],options,'facebook')
                queryData.push(setData)
            }

            for(let i = 0; i < igs.length; i++)
            {
                const options = await fetchSettings(igs[i].id)
                const igData = await setDataquery(igs[i],options,'instagram')
                queryData.push(igData)
            }
         //  console.log('query data : ', queryData)
            setQuerys(queryData)
        }
        setLoaded(true)  
    }

    const setDataquery = async(data,setting,type) => {
     //  console.log('setting: ', setting)
        const optionData = {
            times: setting?.options?.times ?? 2,
            field: setting?.options?.field ?? 'keyword',
            value: setting?.options?.value ?? '',
            rating: setting?.options?.rating ?? 4.8,
            sales: setting?.options?.sales ?? 10,
            limit: setting?.options?.limit ?? 5,
            minprice: setting?.options?.minprice ?? 50,
            mincommission: setting?.options?.mincommission ?? 10
        }

        return {
            page_id: data.id,
            description: data,
            type: type,
            options: optionData,
            picture: data.picture,
            actived: data.checked ? 1 : 0
        }
    }
    const setQueryOptions = (idx, newOptions) => {
        setQuerys(prevQuerys =>
            prevQuerys.map((query, q) =>
                q === idx
                    ? {
                          ...query,
                          options: {
                              ...query.options,
                              ...newOptions, // อัปเดตค่าตามที่กำหนด
                          },
                      }
                    : query
            )
        )
    }
    const fetchDataApis = async() => {
        const response = await getApi(`facebook`)
        if(response.status == 200){
            return response.data
        }
        return null
    }
    const fetchSettings = async(page_id) => {
        const response = await getSetting(page_id)
        if(response.status == 200){
            return response.data
        }
        return null
    }
        
    const onConfirmation = async(e) => {
            e.preventDefault();
            await setLoaded(false)
            setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้',status: 'ready'})
            await setLoaded(true)
    }
        
    const handleSubmit = async() => {
        querys.forEach(async (data) => {
            const params = {
                page_id : data.page_id,
                page : data.description,
                options: data.options,
                type: data.type,
                actived: data.actived
            }
            const response = await storeSetting(params)
        })
        setModalconfirm({...modalconfirm, status: 'success'})
        setTimeout(() => {
            window.location.reload()
        },2000)
    }
    
    return (
        <>
        {!loaded ? <Loading /> :
          <Container fluid>
              <Form onSubmit={onConfirmation}>
                <Card className="strpied-tabled-with-hover px-2 mb-2">
                    <Card.Header>
                        <Card.Title as="h4">ตั้งค่าการค้นหา สำหรับแชร์สินค้าอัตโนมัติ ไปยังเพจ</Card.Title>
                        <p className="card-category">Sharing Setting</p>
                        <hr/>
                    </Card.Header>
                    <Card.Body className="table-full-width table-responsive">
                        {querys?.map((page,p) => (
                            <div key={p} className="mb-4">
                                {page.description.checked && (
                                <>
                                <Card className="bordered">
                                    <Card.Header>
                                        <Card.Title as='h5' className="text-primary">{String(page.type).toUpperCase() }</Card.Title>
                                        <hr className="text-secondary"/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="4">
                                                <div className="mb-2">
                                                    <div className="icon-big text-start icon-warning" style={{height:'60px', width: '60px', overflow:'hidden'}}>
                                                        <Image src={page.picture} thumbnail fluid style={{height:'100%'}} />
                                                    </div>
                                                </div>
                                                <div className="border-2">
                                                    <div className="numbers">
                                                        <p className="card-category">Page Name: <strong className="text-success">{page.description.name}</strong></p>
                                                        <p className="card-category">Page ID: <strong className="text-warning">{page.description.id}</strong></p>
                                                        {page.type == 'facebook' && (<p className="card-category">category: <strong className="text-info"><i>{page.description?.category}</i></strong></p>) }
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md="8">
                                                <Row>
                                                    <Col md="8">
                                                        <Form.Group controlId="formFile" className="mb-3">
                                                            <Form.Label>ค้นหาจาก</Form.Label>
                                                                <InputGroup className="mb-3">
                                                                    <InputGroup.Text id="basic-addon1" style={{borderLeft:'1px solid #bdbdbd'}}>
                                                                        <Form.Select 
                                                                            style={{boxShadow:'none', borderLeft:0,borderTop:0, borderBottom:0}}
                                                                            value={page.options.field} onChange={e => setQueryOptions(p,{field: e.target.value})}
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
                                                                        value={page.options.value} onChange={e => setQueryOptions(p,{value: e.target.value})}
                                                                    />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>ระยะเวลาการแชร์ (ชม.): </Form.Label>
                                                            <Form.Select 
                                                                value={page.options.times} onChange={e => setQueryOptions(p,{times: e.target.value})}
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
                                                                value={page.options.limit} onChange={e => setQueryOptions(p,{limit: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="2">
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                                            <Form.Control type="number" 
                                                                value={page.options.sales} onChange={e => setQueryOptions(p,{sales: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="2">
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                                            <Form.Control type="number" 
                                                                value={page.options.rating} onChange={e => setQueryOptions(p,{rating: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="2">
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                                            <Form.Control type="number" 
                                                                value={page.options.minprice} onChange={e => setQueryOptions(p,{minprice: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Group className="mb-2">
                                                            <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                                            <Form.Control type="number" 
                                                                value={page.options.mincommission} onChange={e => setQueryOptions(p,{mincommission: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>                                  
                                    </Card.Body>
                                </Card>
                                {p != (querys.length -1) && (
                                    <hr/>
                                )}
                                </>
                            )}
                            </div>
                        ))}
                    </Card.Body>
                    <Card.Footer className="text-end">
                        <hr/>
                        <Button variant="primary" type="submit"><SaveAlt /> <span className="ms-2"> บันทึก</span></Button>
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

export default Settingsharing