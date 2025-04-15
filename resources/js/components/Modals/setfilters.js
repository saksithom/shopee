import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Row, Col, ProgressBar, InputGroup, Button } from "react-bootstrap";

import { CancelOutlined, Save, SaveAltOutlined } from '@mui/icons-material';
import { fetchSetting, storeSetting } from '../../controllers/settingController';
import SelectSocials from '../Selects/SelectSocials';

const Modalsetfilters = ({options, ...data}) => {
    const [isSubmit, setIssubmit] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [status, setStatus] = useState('ready')
    const [fields, setFields] = useState({
        page: null,
        page_id: '',
        times: 2,
        field: 'keyword',
        value: '',
        limit: 5,
        sales: 1,
        rating: 4.7,
        minprice: 1,
        mincommission: 1
    })
    const [pages, setPages] = useState([])
    const [percentage, setPercentage] = useState(0)
    
    useEffect(() => {
        if(data.show){
          init()
        }else{
            setIssubmit(false)
        }

    },[data.show])
    const init = async() => {
      await fetchFilters()
      setFields({
        ...fields,
        field: options.field,
        value: options.value,
        sales: options.sales,
        rating: options.rating,
        minprice: options.minprice,
        mincommission: options.mincommission,
      })
    }
    const fetchFilters = async() => {
      const response = await fetchSetting()
      if(response.status == 200){
        const data = response.data.data
        if(data)
          setPages(data)
      }
    }
    const onChangePage = (val) => {
        const page = pages.find(x => x.page_id == val.id)
        if(!page) return false 
        const option = page.options
        setFields({
            ...fields,
            page_id: page.page_id,
            page: page.page,
            limit: option.limit,
            times: option.times,
            type: page.type,
        })
    }

    const clickConfirm =  async() => {
        setIssubmit(true)
        setStatus('confirmation')
    }

    const submitSettings = async() => {
        setLoaded(false)
        setStatus('processing')
        const paramsData = {
            page_id : fields.page_id,
            page : fields.page,
            options: {
                field: fields.field,
                limit: fields.limit,
                sales: fields.sales,
                times: fields.times,
                value: fields.value,
                rating: fields.rating,
                minprice: fields.minprice,
                mincommission: fields.mincommission
            },
            type: fields.type,
            actived: 1
        }
        await storeSetting(paramsData)

        setLoaded(true)
        setStatus('completed')

        setTimeout(() => {
            data.onHide()
        },2000)
    }
    return (
        <>
            <Modal {...data} className="modal-custom" size="xl" backdrop="static" keyboard={false}>
                <Modal.Header  className="">
                    <h5 className="modal-title" id="exampleModalLabel">บันทึกการตั้งค่า สำหรับโพสอัตโนมัติ</h5>
                </Modal.Header>
                <Modal.Body className="">
                    <div className="p-4">
                        {!isSubmit ? 
                            <>
                                <div className="mb-3">
                                    <Row>
                                        <Col md="6">
                                            <SelectSocials onChange={e => onChangePage(e)} value={fields.page_id} label="สำหรับเพจ" />
                                        </Col>
                                        <Col md="4">
                                            <Form.Group className="mb-2">
                                                <Form.Label>ระยะเวลาการแชร์ (ชม.): </Form.Label>
                                                <Form.Select 
                                                    value={fields.times} onChange={e => setFields({...fields, times: e.target.value})}
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
                                                <Form.Control type="number" 
                                                    value={fields.limit} onChange={e => setFields({...fields, limit: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="8">
                                            <Form.Group controlId="formFile" className="mb-3">
                                                <Form.Label>ค้นหาจาก</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="basic-addon1" style={{borderLeft:'1px solid #bdbdbd'}}>
                                                        <Form.Select 
                                                            style={{boxShadow:'none', borderLeft:0,borderTop:0, borderBottom:0}}
                                                            value={fields.field} onChange={e => setFields({...fields,field: e.target.value})}
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
                                                        value={fields.value} onChange={e => setFields({...fields, value: e.target.value})}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        </Row>

                                        <Row className="mb-2">
                                        <Col md="2">
                                            <Form.Group className="mb-2">
                                                <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                                <Form.Control type="number" 
                                                    value={fields.sales} onChange={e => setFields({...fields, sales: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="2">
                                            <Form.Group className="mb-2">
                                            <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                                <Form.Control type="number" 
                                                    value={fields.rating} onChange={e => setFields({...fields, rating: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="2">
                                                <Form.Group className="mb-2">
                                                <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                                <Form.Control type="number" 
                                                    value={fields.minprice} onChange={e => setFields({...fields, minprice: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md="4">
                                            <Form.Group className="mb-2">
                                                <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                                <Form.Control type="number" 
                                                    value={fields.mincommission} onChange={e => setFields({...fields, mincommission: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="mt-4 text-end">
                                    <Button variant='secondary' type='button' onClick={data.onHide} className='me-2'><CancelOutlined /> ยกเลิก</Button>
                                    <Button variant='primary' type='submit' onClick={clickConfirm} ><SaveAltOutlined /> บันทึก</Button>
                                </div>
                            </>
                        : 
                            <>
                                {status == 'confirmation' && (
                                    <div className='alert alert-success text-center'>
                                        <div className='mb-3 text-center'>
                                            <p>
                                                <SaveAltOutlined/>
                                            </p>
                                            <p><strong>ยืนยันการบันทึกข้อมูล</strong></p>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <Button variant='secondary' type='button' onClick={data.onHide} className='me-2'><CancelOutlined /> ยกเลิก</Button>
                                            <Button variant='primary' type='submit' onClick={submitSettings} ><SaveAltOutlined /> บันทึก</Button>
                                        </div>

                                    </div> 
                                )}
                            </>
                        }

                        {(status == 'processing' && isSubmit) && (
                            <div className='text-center item-align-center'>
                            <h4>กำลังประมวลผล กรุณารอสักครู่....</h4>
                            {data.percentage && (
                            <p>
                                <ProgressBar variant='primary' now={percentage} label={`${percentage.toFixed(0)}%`} />
                            </p>
                            )}
                            </div>
                        )}
                        
                        {(status == 'completed' && isSubmit) ? 
                            <div className='text-center item-align-center'>
                                <div className="mb-3">
                                    <Save className='text-success' style={{fontSize:'80px'}} />
                                </div>
                                <div className="mb-3 text-success fs-1">
                                    บันทึกรายการสำเร็จ
                                </div>
                            </div> 
                        : null}
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default Modalsetfilters;