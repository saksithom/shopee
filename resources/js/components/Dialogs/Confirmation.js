import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Row, Col, ProgressBar, Button } from "react-bootstrap";

import { Close, Save, WarningOutlined } from '@mui/icons-material';

const Modalconfirm = ({onApply, onCompleted, ...data}) => {
    const [isSubmit, setIssubmit] = useState(false)
    const [isopen, setIsopen] = useState(false)
    const [predata, setPredata] = useState({})
    const [percentage, setPercentage] = useState(0)
    
    useEffect(() => {
        if(data.show){
            if(JSON.stringify(data) !== JSON.stringify(predata)){
                if(data.percentage)
                    setPercentage(data.percentage)
                if(!isopen){
                    setIssubmit(false)
                    setIsopen(true)
                }
            }
        }else{
            if(!isopen)
                setIsopen(false)
            setIssubmit(false)
        }

    },[data])
    const clickConfirm =  async() => {
        setIssubmit(true)
        await onApply()
        setTimeout(async () => { 
            await data.onHide()
            // onApply()
        },1000)
    }

    const isCompleted = () => {
        
    }
    return (
        <>
            <Modal {...data} className="modal-custom" size="md" backdrop="static" keyboard={false}>
                <Modal.Header  className="">
                    <h5 className="modal-title" id="exampleModalLabel">{data.title}</h5>
                </Modal.Header>
                <Modal.Body className="">
                    <div className="text-center p-4">
                        {/* isSubmit : {String(isSubmit)} : data on success : {String(data.onSuccess)} */}
                        {!isSubmit ? 
                            <>
                                <div className="mb-3">
                                    <Save className='text-success' style={{fontSize:'80px'}} />
                                </div>
                                 {data.message} ใช่หรือไม่?
                                <div className="mt-4">
                                    <button className="btn btn-de btn-cancle me-2" onClick={data.onHide}>ยกเลิก</button>
                                    <button type="submit" className="btn btn-padding btn-submit" onClick={clickConfirm}>ยืนยัน</button>
                                </div>
                            </>
                        : null }

                        {(data.success != 'success' && isSubmit) && (
                            <>
                            <h4>กำลังประมวลผล กรุณารอสักครู่....</h4>
                            {data.percentage ? 
                            <p>
                                <ProgressBar variant='primary' now={percentage} label={`${percentage.toFixed(0)}%`} />
                            </p>
                            : null }
                            </>
                        )}
                        
                        {(data.success == 'success' && isSubmit) && (
                            <>
                                <div className="mb-3">
                                    <Save className='text-success' style={{fontSize:'80px'}} />
                                </div>
                                <div className="mb-3 text-success fs-1">
                                    บันทึกรายการสำเร็จ
                                </div>
                            </> 
                        )}
                        {(data.success == 'error' && isSubmit) && (
                            <div className='alert alert-danger'>
                                <div className="mb-3">
                                    <WarningOutlined fontSize='large' />
                                </div>
                                <div className="mb-3 text-success fs-1">
                                    {data.message}
                                </div>
                                <div className='text-center'>
                                    <Button variant='outline-secondary' type='button' onClick={()=> data.onHide()}><Close /> Close</Button>
                                </div>
                            </div> 
                        )}
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default Modalconfirm;