import React,{ useEffect, useState } from "react"
import { Card, Col, Container, Row, Button, Nav, Tabs, Tab } from "react-bootstrap"
import Loading from "../../components/Loading/Loading"
import Apifacebook from "../../components/apis/apifacebook"
import Apishopee from "../../components/apis/apishopee"
import { Inputcontext } from "../../helpers/functions"
import { fetchApi } from "../../controllers/apiscontroller"

const Apis = () => {
    const [pageStatus, setPageStatus] = useState('loading')
    const [activeTab, setActiveTab] = useState('facebook')
    const [apis, setApis] = useState([])
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already',type : '' })
    useEffect(() => {
        init()
    },[])
    const init = async() => {
        setPageStatus('loading')
        await fetchDataApis()
        setPageStatus('ready')

    }
    const fetchDataApis = async() => {
        const response = await fetchApi()
        if(response.status == 200){
            // console.log('response data apis : ', response.data)
            const data = response.data
            if(data){
                const fb = data.find(x => x.api_type == 'facebook')
                const shopee = data.find(x => x.api_type == 'shopee')
                setApis({facebook : fb, shopee : shopee})
            }
        }

    }
    const context = {
        modalconfirm, setModalconfirm,
        apis, setApis
    }

    return (
        <>
        {pageStatus == 'loading' && <Loading/> }
        {pageStatus == 'ready' ?
            <Inputcontext.Provider value={context}>
                <Container fluid>
                    <Tabs accessKey={activeTab}>
                        <Tab eventKey='facebook' onClick={() => setActiveTab('facebook')} title="Facebook">
                            <Apifacebook />
                        </Tab>
                        <Tab eventKey='shopee' onClick={() => setActiveTab('shopee')} title="Shopee">
                            <Apishopee />
                        </Tab>
                    </Tabs>
                </Container>
            </Inputcontext.Provider>
        : null 
        }
        </>
                        
    )
}
export default Apis