import React,{ useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import Loading from "../Loading/Loading";
import { CheckBoxOutlined, RestartAlt } from "@mui/icons-material";
import { getOffershop } from "../../controllers/apiscontroller";
import StarRating from "../Shopee/rattingstars";
import { Link, useParams } from "react-router-dom";
import { commissionRate } from "../../helpers/functions";
import Modalconfirm from "../Dialogs/Confirmation";
import SelectSocials from "../Selects/SelectSocials";

const Cardshopoffer = ({onApply, ...data}) => {
    const [loaded, setLoaded] = useState(false)
    const [shops, setShops] = useState(null)
    const [field, setField] = useState(null)
    const [shared, setShared] = useState(0)
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    const [modalfilters, setModalfilters] = useState({ view : false, status : 'already', data: null})
    const isMounted = useRef(true)    
    ;
    useEffect(() => {
        if(JSON.stringify(data.querys) != JSON.stringify(field)){
            init()
         //  console.log('card shop offer : ', data)
        }
        return () => {
            isMounted.current = false
        }
    },[data.querys])
    const init = async() => {
        await setLoaded(false)           
        await fetchOffershop()
       setField(data.querys)
        await setLoaded(true)
    }
    const fetchOffershop = async() => {
        const query = {field : 'shopId', value: data.querys.value}
        if(data.querys.field == 'shopId')
            query.value = data.querys.value
        const response = await getOffershop(query)
        if(response.status == 200){
         //  console.log('result offer : ', response.data)
            setShops(response.data.shopOffer.nodes)
            setShared(response.data.shared)
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
        <Card className="pb-3">
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
                            
                        </Col>
                        <Col md="9" lg="9" sm="9">
                            <Card.Title as="h4" className="text-primary"><strong>{shop.shopName}</strong></Card.Title>
                            <p>
                                Shop ID : <strong>{shop.shopId}</strong>
                                <StarRating rating={shop.ratingStar} totalStars={5} /><br />
                            </p>
                            <p>
                                คะแนนร้านค้า : <strong className="text-warning me-3">{shop.ratingStar}</strong>
                                Commission Rate : <strong className="text-success">{ commissionRate(shop.commissionRate) }%</strong> <br/>
                                Link สำหรับโปรโมท : <strong className="text-success">{shop.offerLink}</strong><br/>
                                Link ร้าน : <strong className="text-success"><Link to={shop.originalLink} target="_blank">{shop.originalLink}</Link></strong> <br/>
                                แชร์แล้ว : <strong className="text-success">{shared}</strong> รายการ
                            </p>
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
        </>
    )
}

export default Cardshopoffer