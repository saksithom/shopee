import React,{ useContext, useEffect, useRef, useState } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import { CalendarMonthRounded, FindInPageOutlined, RestartAlt, ScreenSearchDesktopOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Inputcontext } from "../../helpers/functions";
import { fetchShared } from "../../controllers/sharedcontroller";

const Keywordcard = () => {
    const {apis} = useContext(Inputcontext)
    const [loaded, setLoaded] = useState(false)
    const [field, setField] = useState(null)
    const [shared, setShared] = useState(0)
    const isMounted = useRef(true);
    useEffect(() => {
        init()
        return () => {
            isMounted.current = false
        }
    },[])
    const init = async() => {
        await setLoaded(false)
           await setField(apis.shopee.access_code)
           await fetchTotalpost()
        await setLoaded(true)
    }
    const fetchTotalpost = async() => {
        const access = apis.shopee.access_code
        const params = `?${access.key}=${access.value}&per_page=15`
        const items = await fetchShared(params)
        if(items.status == 200){
            const meta = items.data.meta 
            setShared(meta.total)
        }
    }
    return (
        <Card>
            {loaded ? 
            <>
            <Card.Header>
                <Card.Title as="h4" className="text-primary">แชร์สินค้าอัตโนมัติด้วยคำค้นหา</Card.Title>
            </Card.Header>
            <Card.Body>
                    <Row>
                        <Col md="3" lg="3" sm="4" className="text-center text-primary"><ScreenSearchDesktopOutlined style={{fontSize:"80px"}} /></Col>
                        <Col md="8" lg="8" sm="8">
                            <Card.Title as="h3" className="text-primary">แชร์สินค้าอัตโนมัติด้วยคำค้นหา</Card.Title>
                            <p>KEYWORD : <strong>{field?.value}</strong></p>
                            <p>แชร์ไปแล้ว <strong className="text-success">{ shared }</strong> รายการ</p>
                        </Col>
                    </Row>
            </Card.Body>
            <Card.Footer>
                <hr/>
                <CalendarMonthRounded />
                อัพเดทล่าสุด : {dayjs(apis.shopee.updated_at,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}
            </Card.Footer>
            </>
            :
            <Card.Body>
                {/* <div className="text-center text-dark"><RestartAlt className="spin" /><br/>Loading ....</div> */}
            </Card.Body>
            }
        </Card>
    )
}

export default Keywordcard