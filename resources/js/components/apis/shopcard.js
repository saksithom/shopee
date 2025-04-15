import React,{ useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Image, Row } from "react-bootstrap";
import Loading from "../Loading/Loading";
import { CheckBoxOutlined, RestartAlt } from "@mui/icons-material";
import { getOffershop } from "../../controllers/apiscontroller";
import StarRating from "../Shopee/rattingstars";
import { Link, useParams } from "react-router-dom";
import { commissionRate } from "../../helpers/functions";
import Modalconfirm from "../Dialogs/Confirmation";

const Shopcard = ({onApply, ...data}) => {
    const [loaded, setLoaded] = useState(false)
    const [shops, setShops] = useState(null)
    const [apis, setApis] = useState(null)
    const [shared, setShared] = useState(0)
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    const isMounted = useRef(true);
    const queryString = useParams()
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
        const query = {field : 'shopId', keyword: queryString.id}
        const response = await getOffershop(query)
        if(response.status == 200){
         //  console.log('result offer : ', response.data)
            setShops(response.data.shopOffer.nodes)
            setShared(response.data.shared)
            setApis(response.data.apis)
        }
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
            apis : apis,
            shop: modalconfirm.data
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
                <Card.Title></Card.Title>
            </Card.Header>
            <Card.Body>
                {shops.map((shop,idx) => (
                    <Row key={idx}>
                        <Col md="3" lg="3" sm="4" className="text-center">
                            <Image src={shop.imageUrl} fluid thumbnail />
                            {apis.access_code.value != shop.shopId &&
                             <p className="mt-1"><Button variant="primary" type="button" onClick={e => onConfirmation(e,shop)}><CheckBoxOutlined /> ตั้งค่าเป็นร้านสำหรับแชร์</Button></p>
                            }
                        </Col>
                        <Col md="8" lg="8" sm="8">
                            <Card.Title as="h3" className="text-primary"><strong>{shop.shopName}</strong></Card.Title>
                            <p>Shop ID : <strong>{shop.shopId}</strong></p>
                            <p>
                                <StarRating rating={shop.ratingStar} totalStars={5} /><br />
                                คะแนนร้านค้า : <strong className="text-warning me-3">{shop.ratingStar}</strong>
                                Commission Rate : <strong className="text-success">{ commissionRate(shop.commissionRate) }%</strong></p>
                             <p>Link สำหรับโปรโมท : <strong className="text-success">{shop.offerLink}</strong></p>
                             <p>Link ร้าน : <strong className="text-success"><Link to={shop.originalLink} target="_blank">{shop.originalLink}</Link></strong></p>
                             <p>แชร์แล้ว : <strong className="text-success">{shared}</strong> รายการ</p>
                             
                        </Col>
                    </Row>
                ))}

            </Card.Body>
            </>
            :
            <Card.Body>
                <div className="text-center text-dark"><RestartAlt className="spin" /><br/>Loading ....</div>
            </Card.Body>
            }
        </Card>
        <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        onSubmit={handleSubmit}
        />

        </>
    )
}

export default Shopcard