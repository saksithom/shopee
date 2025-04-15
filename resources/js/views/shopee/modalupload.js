import React, { useState, useEffect } from "react";
import {   Cancel, RotateRightTwoTone, UploadFile } from "@mui/icons-material";
import { Alert, Button, Col, Form, Modal, ProgressBar, Row } from "react-bootstrap";
// import { storeShopee } from "../../controllers/csvreaderController";
import { axiosJson, axiosUpload, base_api } from "../../helpers/init_vars";

const ModalCsvUpdate = ({onSuccess, ...data}) => {

  const [isclick, setIsclick] = useState(false)
  const [csvfile, setCsvfile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setReult] = useState(null)
  const [options, setOptions] = useState({
            is_official_shop : false,
            is_preferred_shop: false,
            item_rating : 4.5,
            shop_rating : 4.5,
            item_sold : 3,
            stock : 5,
            price : 50,
            per_page : 10000
  })
  useEffect(() => {
    if (data.show) {
        if(!isclick){

        }
    } else {
        if(isclick)
            setIsclick(false);
            setCsvfile(null)
            setUploading(false)
            setUploaded(false)
            setSuccess(false)
            setUploadProgress(0)
            setReult(null)
    }
  }, [data]);
  const selectedFile = (e) => {
    const file = e.target.files[0];
 //  console.log('file: ', file)
    if (file) {
        setCsvfile(file);
    }
  }
  const submitForm = async() => {
    const url = `${base_api}/shopee-data/1`
    const formData = new FormData()
    formData.append('file', csvfile)
    formData.append('_method', 'PUT')

    setUploading(true)
    setIsclick(true)
    const uploader = await axiosUpload.post(url,formData,{
        onUploadProgress: (progressEvent) => {
          // คำนวณเปอร์เซ็นต์การอัปโหลด
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          if(percentCompleted >= 100)
              setUploaded(true)
        },
      })
   //  console.log('uploader : ', uploader)
      if(uploader.status == 200 || uploader.status == 201 || uploader.status == 'success'){
        setReult(uploader.data)
        setSuccess(true)
      }

  }
  const clickSuccess = () => {
      data.onHide()
      onSuccess('yes')
  }

  return (
    <>
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
            {success ? 
            <Alert variant="success text-center">
              <h3>ผลการประมวลผล</h3>
              <p>ทำการประมวลผลเก็บข้อมูล Data Products files เรียบร้อยแล้ว</p>
              {/* <p>จำนวนสินค้า {result.total_product} รายการ สร้างไฟล์ได้ {result.totalfile} ไฟล์</p> */}
              <p><Button type="button" variant="primary" onClick={clickSuccess}>OK</Button> </p>
            </Alert>
            :
            <>
            {!uploading ? 
                <Form onSubmit={submitForm}>
                    
                    <Row>
                        <Col md={8}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label style={{height:'32px'}}>Select Shopee CSV File</Form.Label>
                                <Form.Control type="file" accept=".csv" onChange={selectedFile} />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="text-end">
                            <Form.Group>
                                <Form.Label className="w-100 block" style={{height:'32px'}}>&nbsp;</Form.Label>

                                <Button type="submit" size="sm" className="mx-1" ><UploadFile /> Submit</Button>
                                <Button type="button" variant="secondary"  size="sm" className="mx-1"><Cancel /> Reset</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            :
              <>{uploaded ? 
                <div className="text-center">
                  {/* <p><WritingLoader /></p> */}
                  <p><RotateRightTwoTone className="spin" sx={{fontSize:60}} /></p>
                  <p>ระบบกำลังประมวลผล เพื่อจัดเก็บ Data files โปรดรอจนกว่าระบบจะทำการประมวลผลเสร็จ</p>
                </div>
                :
                <div>
                  <p>Uploading: {csvfile.name}</p>
                  <ProgressBar animated variant="success" now={uploadProgress} max={100} />
                  <p>{uploadProgress}%</p>
                </div>
                }
                  </>
            }
            </>
            }
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCsvUpdate;
