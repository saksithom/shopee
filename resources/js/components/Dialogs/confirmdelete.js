import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Row, Col } from "react-bootstrap";

import { HighlightOff, Save } from '@mui/icons-material';
import { Button } from 'react-bootstrap';

const ModalconfirmDelete = ({onApply, ...data}) => {
    const [isSubmit, setIssubmit] = useState(false)
    const [isopen, setIsopen] = useState(false)
    useEffect(() => {
        if(data.show){
            if(!isopen){
                setIssubmit(false)
                setIsopen(true)
            }
        }else{
            if(!isopen)
                setIsopen(false)
        }

    },[data])
    const clickConfirm =  async() => {
        setIssubmit(true)
        await onApply('Y')
        setTimeout(async () => { 
            await data.onHide()
        },1000)
    }
    return (
        <>
            <Modal {...data} className="modal-custom" size="md" backdrop="static" keyboard={false}>
                <Modal.Header  className="alert alert-danger m-0">
                    <h5 className="modal-title" id="exampleModalLabel">{data.title}</h5>
                </Modal.Header>
                <Modal.Body className="alert alert-danger p-0 m-0">
                    <div className="text-center p-4">
                        {/* isSubmit : {String(isSubmit)} : data on success : {String(data.onSuccess)} */}
                        {!isSubmit ? 
                            <>
                                <div className="mb-3">
                                    <HighlightOff className='text-danger' style={{fontSize:'80px'}} />
                                </div>
                                 {data.message} ใช่หรือไม่?
                                <div className="mt-4">
                                    <Button size='md' type='button' variant='secondary' className='me-2' onClick={data.onHide}>ยกเลิก</Button>
                                    <Button type="submit" variant='primary' size='md'onClick={clickConfirm}>ยืนยัน</Button>
                                </div>
                            </>
                        : null }

                        {(data.success != 'success' && isSubmit) ? 
                            <h4>กำลังประมวลผล กรุณารอสักครู่....</h4>
                        : null}
                        
                        {(data.success == 'success' && isSubmit) ? 
                            <>
                                <div className="mb-3">
                                    <HighlightOff className='text-success' style={{fontSize:'80px'}} />
                                </div>
                                <div className="mb-3 text-success fs-1">
                                    ลบข้อมูลสำเร็จ
                                </div>
                            </> 
                        : null}
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default ModalconfirmDelete;