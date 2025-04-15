import React, { useState, useEffect } from "react";
import { Alert, Modal } from "react-bootstrap";

const ModalAlert = (data) => {
  const [isclick, setIsclick] = useState(false);
  useEffect(() => {
    if (data.show) {
        if(!isclick){

        }
    } else {
        if(isclick)
            setIsclick(false);
    }
  }, [data]);

  return (
    <>
      <Modal
        {...data}
        className="modal-custom"
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="">
          <h5 className="modal-title">{data.title}</h5>
        </Modal.Header>
        <Modal.Body className="">
          <Alert variant={data.type ?? 'danger'}>
            <div className="text-center py-2">
              <h3>{data.sub_title}</h3>
              <p>{data.message}</p>
            </div>

            <div className="text-center py-2">
              <div>
                <button
                  type="button"
                  className="btn btn-padding btn-submit"
                  onClick={data.onHide}
                  >
                  OK
                </button>
              </div>
            </div>
          </Alert>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalAlert;
