import React,{ useEffect, useState } from "react"
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Cancel, Share } from "@mui/icons-material";
import { facebookPages, facebookPost } from "../../controllers/facebookController";
import SelectSocials from "../../components/Selects/SelectSocials";

const Modalsharing = ({onPost, ...data}) => {
    const [message, setMessage] = useState(null)
    const [field, setField] = useState(null)
    const [page, setPage] = useState('')
    const [images, setImages] = useState([])
    const [valid, setValid] = useState({page: false})
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if(data.show){
            init()
        }else{
            setField(null)
        }
    },[data.show])
    const init = async() => {
        setItem()
    }
    const setItem = () => {
        const item = data.items
        setField(item)
        setImages(item.medeas ?? [])
    }
    const onChangePage = (val) => {
     //  console.log('val : ', val)
        setField({
            ...field,
            page_id: val.id,
            page: val,
            page_type: val.type,
        })
    }

    const submitShare = async(e) => {
        e.preventDefault();
        setValid({...valid, page: false})
        if(!page){
            setValid({...valid, page: true})
            return false
        }
        const params = {
            itemId: field.itemid,
            page_id: page,
        }
        const fb = await facebookPost(params)
        if(fb.status == 200){
            data.onHide()
        }          
     //  console.log('fb response : ', fb)
    }
    return (
          <Modal
            {...data}
            className="modal-custom"
            size="lg"
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="">
              <h5 className="modal-title">{data.title}</h5>
            </Modal.Header>
            <Modal.Body className="">
                <Card>
                    <Card.Body>
                        <div className="mb-2">
                        <p>
                            พิกัดสินค้า: {field.offerLink}<br/>
                            <strong>{field.title}</strong><br/>
                            Ratting: {field.item_rating} <br/>
                            ราคา: {field.price} ฿.- <br/>
                            ร้านค้า: {field.shop_name} <br/>
                        </p>

                        </div>
                        <div className="mb-3 text-center">
                            {images.map((img,idx) => (
                                <img src={img.url} key={idx} className="w220" />
                            ))}
                        </div>
                        <div className="mb-2">
                            <SelectSocials onChange={e => setPage(e.id)} value={page} label="แชร์ไปที่" />
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
            </Modal.Body>
          </Modal>
      );
}

export default Modalsharing