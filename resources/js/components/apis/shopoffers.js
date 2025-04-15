import React,{ useContext, useEffect, useRef, useState } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import Loading from "../Loading/Loading";
import { CalendarMonthRounded, RestartAlt } from "@mui/icons-material";
import { getOffershop } from "../../controllers/apiscontroller";
import { commissionRate, Inputcontext } from "../../helpers/functions";
import StarRating from "../Shopee/rattingstars";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Shopoffer = (data) => {
    const {apis, setApis} = useContext(Inputcontext)
    const [loaded, setLoaded] = useState(false)
    const [shops, setShops] = useState(null)
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
           await fetchOffershop()
        await setLoaded(true)
    }
    const fetchOffershop = async() => {
        const shopee = apis.shopee.access_code
        const query = {field : shopee.key, keyword: shopee.value}
        const response = await getOffershop(query)
        if(response.status == 200){
         //  console.log('result offer : ', response.data.shopOffer.nodes)
            setShops(response.data.shopOffer.nodes)
            setShared(response.data.shared)
        }
    }
    return (
        <Card>
            {loaded ? 
            <>
            <Card.Header>
                <Card.Title>ค้นหาสินค้าจากร้านค้า</Card.Title>
            </Card.Header>
            <Card.Body>
                {shops.map((shop,idx) => (
                    <Row key={idx}>
                        <Col md="3" lg="3" sm="4" className="text-center"><Image src={shop.imageUrl} fluid thumbnail /></Col>
                        <Col md="8" lg="8" sm="8">
                            <Card.Title as="h3" className="text-primary"><strong>{shop.shopName}</strong></Card.Title>
                            <p>Shop ID : <strong><Link to={`/admin/shopee-shop/${shop.shopId}`} >{shop.shopId}</Link></strong></p>
                            <p>
                                <StarRating rating={shop.ratingStar} totalStars={5} /><br />
                                คะแนนร้านค้า : <strong className="text-warning me-3">{shop.ratingStar}</strong>
                                Commission Rate : <strong className="text-success"> {commissionRate(shop.commissionRate)} %</strong></p>
                             <p>Link สำหรับโปรโมท : <strong className="text-success">{shop.offerLink}</strong></p>
                             <p>Link ร้าน : <strong className="text-success"><Link to={shop.originalLink} target="_blank">{shop.originalLink}</Link></strong></p>
                             <p>แชร์ไปแล้ว <strong className="text-success">{ shared }</strong> รายการ</p>
                        </Col>
                    </Row>
                ))}

            </Card.Body>
            <Card.Footer>
                <CalendarMonthRounded />
                อัพเดทล่าสุด : {dayjs(apis.shopee.updated_at,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}
            </Card.Footer>

            </>
            :
            <Card.Body>
                <div className="text-center text-dark"><RestartAlt className="spin" /><br/>Loading ....</div>
            </Card.Body>
            }
        </Card>
    )
}

export default Shopoffer