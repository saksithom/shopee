import React,{ useEffect, useState } from "react"
import { Button, Card, Col, Modal, Row, Spinner } from "react-bootstrap";
import { Cancel, Share } from "@mui/icons-material";
import { facebookPages, facebookPost } from "../../controllers/facebookController";
import SelectSocials from "../../components/Selects/SelectSocials";
import { Link } from "react-router-dom";

const Modalsharingapi = ({onPost, ...data}) => {
    const [page_id, setPage_id] = useState('')
    const [field, setField] = useState(null)
    const [valid, setValid] = useState({page: false})
    
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if(data.show && JSON.stringify(data.items) != JSON.stringify(field)){
            setLoaded(false)
            console.log('data : ', data)
            setField(data.items)
            setLoaded(true)
        }else{
            console.log('modal hide')
            setField(null)
            setLoaded(false)

        }
    },[data.show, data.items])

    const submitShare = async(e) => {
        e.preventDefault();
        setValid({...valid, page: false})
        if(!page_id){
            setValid({...valid, page: true})
            return false
        }
        setLoaded(false)
        const params = {
            itemId: field.itemId,
            page_id: page_id,
        }

        const res = await facebookPost(params)
        if(res.status == 200){
            setLoaded(true)
            data.onHide()
        }
    }

    return (
        <Modal
            {...data}
            className="modal-custom"
            size="lg"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header className="">
              <h5 className="modal-title">{data.title}</h5>
            </Modal.Header>
            <Modal.Body className="">
                {data.show && (
                    <>
                    {loaded ? 
                <Card>
                    <Card.Body>
                        <div className="mb-2">
                        <p>
                            พิกัดสินค้า: <Link to={field.offerLink} target="_blank">{field.offerLink}</Link><br/>
                            <strong>{field.productName}</strong><br/>
                            Ratting: {field.ratingStar} <br/>
                            ราคา: {field.priceMax == field.priceMin ? field.price : `${field.priceMin} - ${field.priceMax}`} ฿.- <br/>
                            ร้านค้า: {field.shopName} <br/>
                        </p>

                        </div>
                        <div className="mb-3 text-center">
                                <img src={field.imageUrl} className="w220" />
                        </div>
                        <div className="mb-2">
                            <SelectSocials onChange={e => setPage_id(e.id)} value={page_id} label="แชร์ไปที่" />
                            {valid.page && (<div className="w-100"><small className="text-danger">* เลือกเพจก่อน</small></div>)}
                        </div>
                    </Card.Body>
                    
                    
                    <Card.Footer className="w-100">
                        <div className="text-center w-100">
                            <Button variant="primary" type="button" onClick={submitShare}><Share /> Share</Button>
                            <Button variant="secondary" className="ms-2" type="button" onClick={data.onHide}><Cancel/> Cancel</Button>
                        </div>
                    </Card.Footer>
                </Card>
                : 
                <Card>
                    <Card.Body className="text-center"><Spinner /> Loading....</Card.Body>
                </Card> }
                </>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default Modalsharingapi