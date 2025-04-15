import React, { useState, useEffect } from "react";
import { Alert, Image, Modal } from "react-bootstrap";
import Loading from "../Loading/Loading";

const ModalImage = (data) => {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState('');
  useEffect(() => {
    if (data.show && data.src !== src ) {
        setSrc(data.src)
        setLoaded(true)
    } else {
        if(loaded)
            setLoaded(false);
    }
  }, [data.src]);

  return (
      <Modal
        {...data}
        className="modal-custom image"
        size="lg"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="">
            {loaded ? 
                <Image src={src} thumbnail />
            : 
                <div className="text-center"><Loading /></div>
            }
        </Modal.Body>
      </Modal>
  );
};

export default ModalImage;
