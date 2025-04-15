import { SaveAltSharp, ShoppingBasketOutlined } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Button,Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import Modalconfirm from "../../components/Dialogs/Confirmation";
import { getApi, storeApi } from "../../controllers/apiscontroller";
import Cardkeywords from "../../components/Cards/productKeyword";
import Cardcategory from "../../components/Cards/productcategory";
import Cardshopoffer from "../../components/Cards/shopoffers";
import Loading from "../../components/Loading/Loading";

const Apisxpage = () => {
    const initFeilds = {
        user_id: '',
        page_id: '',
        app_id: '',
        secret_id: '',
        client_id: '',
        user_access_token: '',
        access_code: {
            key: 'keyword',
            value: '',
            rating: 4.5,
            saled: 5,
            page:  1,
            limit: 5
        },
        api_type: 'shopee'

    }
    const initErrors = {
        secret_id: '',
        app_id: ''
    }

    const [loaded, setLoaded] = useState(true)
    const [field, setField] = useState(initFeilds)
    const [accesscode, setAccesscode] = useState(null)
    const [errors, setErrors] = useState(initErrors)
    const [querys, setQuerys] = useState({
        key: 'keyword',
        value: '',
        rating: 4.5,
        saled: 5,
        page:  1,
        limit: 5
    })
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    useEffect(() => {
        init()

    },[])
    const init = async() => {
      setLoaded(false)
      await fetchDataApis()
      setLoaded(true)

  }
  const fetchDataApis = async() => {
      const response = await getApi(`shopee`)
      if(response.status == 200){
       //  console.log('response data apis : ', response.data)
          const data = response.data
          if(data){
                setField(data)
                if(data.access_code){
                    const code = data.access_code
                    setAccesscode(code)
                    setQuerys({
                        ...code,
                        key: code.key ?? 'keyword',
                        value: code.value ?? '',
                        rating: parseFloat(code.rating) ?? 4.5,
                        page: parseInt(code.page) ?? 1,
                        limit: code.limit ?? 5,
                        price: parseInt(code.price) ?? 1,
                        commission: parseFloat(code.commission) ?? 1,
                        sales: parseInt(code.sales) ?? 1
            
                    })
                }
            
          }
      }

  }
    const validations = () => {
        let x = 0;
        let err = initErrors
        if(!field.app_id){
            err.app_id = '* Please enter Facebook App ID'
            x++
        }
        if(!field.secret_id){
            err.secret_id = '* Please enter Facebook App ID'
            x++
        }
        setErrors(err)
        console.error('error validation : ', x , ' : ' , err)
        return x == 0 ? true : false
    }
    const onConfirmation = async(e) => {
        e.preventDefault();
        await setLoaded(false)
        const valid = validations()
        if(!valid ){
            await setLoaded(true)
            return false
        }

        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลนี้',status: 'ready'})
        await setLoaded(true)

    }
    const handleSubmit = async() => {
        await setLoaded(false)
        await submitApi()
        await setLoaded(true)
    }
    const submitApi = async() => {
        const params = {
            app_id : field.app_id,
            secret_id : field.secret_id,
            api_type : field.api_type,
            access_code: querys
        }
        const res = await storeApi(params)
        if(res.status == 201 || res.status == 200){
         //  console.log('response update shopee api : ', res)
            setField(res.data)
            if(res.data.access_code)
            setQuerys(res.data.access_code)

            setModalconfirm({view:true, title: '', message : '',status: 'success'})
            setTimeout(() => {
                setModalconfirm({view:false})
            },3000)
        }
    }

    return (
      <>
      {!loaded ? <Loading /> :
        <Container fluid>
          <Form onSubmit={onConfirmation}>
              <Card className="strpied-tabled-with-hover px-2 mb-2">
                  <Card.Header>
                      <Card.Title as="h4">X API</Card.Title>
                      <p className="card-category">X for sharring products content</p>
                      <hr/>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive">
                      <div className="text-center">Comming soon.....</div>
                  </Card.Body>
                  <Card.Footer className="text-end">
                      <hr/>
                      {/* <Button variant="primary" type="submit"><SaveAltSharp /><span className="ms-2">{(field) ? 'UPDATE' : 'SAVE'} API Shopee</span> </Button> */}
                  </Card.Footer>
              </Card>
          </Form>
          <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        onApply={handleSubmit}

            />

        </Container>
      }
      </>
    )
}

export default Apisxpage