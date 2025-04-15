import React,{ useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { CalendarMonthRounded, CheckBoxOutlined, RestartAlt, ScreenSearchDesktopOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import Modalconfirm from "../Dialogs/Confirmation";
import { fetchShared } from "../../controllers/sharedcontroller";
import { fetchSetting, getSetting } from "../../controllers/settingController";
import SelectSocials from "../Selects/SelectSocials";

const Cardkeywords = ({onApply, ...data}) => {
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    const [loaded, setLoaded] = useState(false)
    const [field, setField] = useState(null)
    const [defaults, setDefaults] = useState(null)
    const [shared, setShared] = useState(0)
    const componentMounted = useRef(true);
        useEffect(() => {
            if(componentMounted.current)
                init()
            return () => {
              componentMounted.current = false;
            }
        },[])
    
    useEffect(() => {
     //  console.log('set Cardkeywords : ', data)
        if(JSON.stringify(data.querys) != JSON.stringify(field)){
            init()
        }
    },[data.querys])
    const init = async() => {
        await setLoaded(false)
        await fetchTotalpost()
        setField(data.querys)
        setDefaults(data.defaultQuery)
        await setLoaded(true)
    }

    const fetchTotalpost = async() => {
        const params = `?${data.querys.field}=${data.querys.value}&per_page=15`
        const items = await fetchShared(params)
        if(items.status == 200){
            const meta = items.data.meta 
            setShared(meta.total)
        }
    }
    const showButtonUpdate = () => {
        const cs = defaults.find(x => x.page_id == field.page_id)
        if(
            !cs
            || (field.field == 'keyword' && field.value != cs.value)
            || cs.limit != field.limit
            || parseInt(cs.minprice) != parseInt(field.minprice)
            || cs.sales != field.sales
            || cs.rating != field.rating
            || cs?.mincommission != field.mincommission
        ) 
            return true //(<p className="mt-1"><Button variant="primary" type="button" onClick={e => onConfirmation(e,field)}><CheckBoxOutlined /> ตั้งเป็นค่าเริ่มต้นสำหรับแชร์อัตโนมัติ</Button></p>)
        return false
    }
    const onConfirmation = async(e,item) => {
        e.preventDefault();
        await setLoaded(false)
        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการตั้งให้ร้านนี้ เป็นค่าเริ่มต้นในการแชร์สินค้าไปยังเพจ อัตโนมัติ',data: item, status: 'ready'})
        await setLoaded(true)

    }
    const handleSubmit = async() => {
        await setLoaded(false)
        onApply({
            page_id : field.page_id,
            page : field.page,
            options: {
                times: field.times,
                field:  field.field ,
                value:  field.value,
                limit:  field.limit,
                sales:  field.sales,
                rating:  field.rating,
                minprice:  field.minprice,
                mincommission:  field.mincommission,
            },
            type: field.type,
            actived: field.actived
        })
        setModalconfirm({view:false, title: '', message : '',status: 'ready',percentage:0})
        await setLoaded(true)
    }

    return (
        <>
        <Card>
            {loaded ? 
            <>
            <Card.Header>
                <Card.Title as="h4" className="text-primary">ตั้งค่าสำหรับ แชร์สินค้าอัตโนมัติด้วยคำค้นหา</Card.Title>
                <hr/>
            </Card.Header>
            <Card.Body>
                    <Row>
                        <Col md="3" lg="3" sm="4" className="text-center text-primary"><ScreenSearchDesktopOutlined style={{fontSize:"80px"}} /></Col>
                        <Col md="9" lg="9" sm="8">
                            <p>คำค้นหา : <strong>{field?.value} </strong></p>
                            <p><strong>Filter setting</strong> <br/>
                                <span className="me-3">จำนวนโพส/ครั้ง : <strong className="text-primary">{field?.limit}</strong> โพส/<strong className="text-primary">{field.times}</strong> ชม.</span> |
                                <span className="ms-3 me-3">ยอดขายได้ขั้นต่ำ: <strong className="text-primary">{field?.sales}</strong> ออเดอร์</span> |
                                <span className="ms-3 me-3">คะแนนสินค้าขั้นต่ำ: <strong className="text-primary">{field?.rating}</strong> คะแนน</span> <br/>
                                <span className="me-3">ราคาเริ่มต้น: <strong className="text-primary">{field?.minprice}</strong> บาท</span>  |
                                <span className="ms-3 me-3">คอมมิชชั่นขั้นต่ำ: <strong className="text-primary">{field?.mincommission}</strong> บาท</span>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3" lg="3" sm="4" className="text-center text-primary"></Col>
                        <Col md="4" lg="4" sm="5">
                            <SelectSocials onChange={e => setField({...field,page_id: e.id, page: e})} value={field.page_id} label="สำหรับเพจ" />
                        </Col>
                        <Col md="2" lg="2" sm="2">
                            <Form.Group className="mb-2">
                                <Form.Label>ระยะเวลาการโพส (ชม./ครั้ง) </Form.Label>
                                    <Form.Select 
                                        value={field.times} onChange={e => setField({...field,times: e.target.value})}
                                    >
                                        {[...Array(12)].map((_,h) => (
                                        <option value={Number(h)+1} key={h}>{Number(h)+1}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group className="mb-2">
                                <Form.Label>จำนวนโพส/ครั้ง: </Form.Label>
                                <Form.Control type="number" value={field.limit} onChange={e => setField({...field, limit: e.target.value})} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3" lg="3" sm="4" className="text-center text-primary"></Col>
                        <Col md="9" lg="9" sm="8">
                            <p>แชร์ไปแล้ว <strong className="text-success">{ shared }</strong> รายการ</p>
                            {showButtonUpdate && (
                                <p className="mt-1">
                                    <Button variant="primary" type="button" onClick={e => onConfirmation(e,field)}><CheckBoxOutlined /> ตั้งเป็นค่าเริ่มต้นสำหรับแชร์อัตโนมัติ</Button>
                                </p>
                            )}
                        </Col>
                    </Row>
            </Card.Body>
            <Card.Footer className="text-secondary">
                <hr/>
                <CalendarMonthRounded />
                อัพเดทล่าสุด : {dayjs(data.querys.updated_at,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}
            </Card.Footer>
            </>
            :
            <Card.Body>
                <div className="text-center text-secondary"><RestartAlt className="spin" /><br/>Loading ....</div>
            </Card.Body>
            }
        </Card>
        <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
            title={modalconfirm.title} 
            message={modalconfirm.message} 
            success={modalconfirm.status}
            onApply={handleSubmit}
    />
    </>

    )
}

export default Cardkeywords