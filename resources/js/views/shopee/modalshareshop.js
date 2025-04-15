import React,{ useEffect, useState } from "react"
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Cancel, Share } from "@mui/icons-material";
import { facebookPages, facebookPost } from "../../controllers/facebookController";

const Modalsharingshop = ({onPost, ...data}) => {
    const [message, setMessage] = useState(null)
    const [field, setField] = useState(null)
    const [images, setImages] = useState([])
    const [isopen, setIsopen] = useState(false)
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if(data.show){
            if(!isopen){
             //  console.log('open modal sharing : ', data.items)
                init()
            }
            setIsopen(true)
        }else{
            if(isopen){
                setIsopen(false)
                // setLoaded(false)
                // setImages([])
                // setMessage(null)
                // setIsopen(false)
            }
        }
    },[data])
    const init = async() => {
        // await setLoaded(false)
        setItem()
        // await setLoaded(true)

    }
    const setItem = () => {
        const item = data.items
        setField(item)
        const itemMessage = () => (
            <>
                <p><strong>{item.title}</strong></p>
                <p>ราคา : <strong>{item.sale_price > 0 ? item.sale_price : item.price } ฿.-</strong></p>
                <p>พิกัดสินค้า : <a href={item.offerLink} target="_blank">{item.offerLink}</a></p>
                <br/>
            </>
        )
        setMessage(itemMessage())
        setImages(item.medeas ?? [])
    }

    const submitShare = async(e) => {
        e.preventDefault();
     //  console.log('click share to facebook', message,' images : ', images)
        try {   
            const content =  `${field.shopName}
                            \nคะแนนสินค้า : ${field.ratingStar} 
                            \nราคา : ${field.price}
                            \n พิกัดร้าน : ${field.offerLink}`
                            
            const params = {
                caption : content ?? '',
                shopId: field.shopid,
                shopName: field.shopName,
                imageUrl: field.imageUrl,
                offerLink: field.offerLink,
                ratingStar: field.ratingStar

            }
            const fb = await facebookPost(params)
         //  console.log('fb response : ', fb)
            data.onHide()
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }
    return (
        <>
        {isopen ? 
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
                <Row>
                    {/* <Col md={4}>
                        <div className="mb-2">รูปภาพ</div>
                        <div>
                            {images.map((img,idx) => (
                                <img src={img.url} key={idx} width={80} />
                            ))}
                        </div>
                    </Col> */}
                    <Col md={12}>
                        <div>
                            {message}
                        </div>
                        <div className="mb-3">
                            {images.map((img,idx) => (
                                <img src={img.url} key={idx} className="w-100" />
                            ))}
                        </div>
                    </Col>
                </Row>
                <div className="text-center">
                    <Button variant="primary" type="button" onClick={submitShare}><Share /> Share</Button>
                    <Button variant="secondary" className="ms-2" type="button" onClick={data.onHide}><Cancel/> Cancel</Button>
                </div>
            </Modal.Body>
          </Modal>
          :null}
        </>
      );
}

export default Modalsharingshop