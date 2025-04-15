import { useEffect, useRef, useState } from "react"
import { clearLogs, fetchLogs } from "../../controllers/sharedcontroller"
import Loading from "../../components/Loading/Loading"
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import dayjs from "dayjs"
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from "react-bootstrap-daterangepicker"
import { CalendarMonthOutlined, Clear, ClearAllOutlined, NavigateBeforeSharp, NavigateNextSharp, Search } from "@mui/icons-material"
import moment from "moment"
import Modalconfirm from "../../components/Dialogs/Confirmation"
import { initLogslevel } from "../../helpers/init_vars"
import SelectSocials from "../../components/Selects/SelectSocials"

const Logs = () => {
    const today = dayjs().format('DD/MM/YYYY HH:mm')
    const sectiontop = useRef(null)
 //  console.log('today : ', today)
    const initDateoption = {
        locale: {
            format: 'DD/MM/YYYY HH:mm',
            cancelLabel: 'Clear',
        },
        startDate: dayjs().startOf('day'),
        endDate: today,
        maxDate: dayjs().format('DD/MM/YYYY HH:mm'),
        singleDatePicker: false,
        autoApply: true,
        timePicker: true,
        timePickerIncrement: 1,
        timePicker24Hour: true,
        autoUpdateInput: false,
    }
 //  console.log('initDateoption: ', initDateoption)
    const [isloaded, setIsloaded] = useState(false)
    const [levels, setLevels] = useState([])
    const [dateoption, setDateoption] = useState(initDateoption)
    const [items, setItems] = useState([])
    const [meta, setMeta] = useState({current_page:1,last_page: 1, total: 0})
    const [term, setTerm] = useState('')
    const [bydate, setBydate] = useState({start : dayjs().startOf('day').format('DD/MM/YYYY HH:mm'), end : today})
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already', percentage: 0})
    const isMounted = useRef(true);

    useEffect(() => {
            init()
        return () => {
            isMounted.current = false
        }
    },[])

    const init = async() => {
        await setIsloaded(false)
        setDateoption(initDateoption)
        await fetchData(bydate.start,bydate.end)
        await setIsloaded(true)
    }
    const fetchData = async(start,end,level=[],term='') => {
        const startDate = moment(start,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
        const endDate = moment(end,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')

        let pm  = []
        pm.push(`start=${startDate}`)
        pm.push(`end=${endDate}`)
        if(term)
            pm.push(term)

        if(level && level.length > 0)
            pm.push(`level=${level.join(',')}`)

        const response = await fetchLogs(`?${pm.join('&')}`)
        if(response.status == 200){
            
            setItems(response.data.data)
            setMeta({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            })
        }
    }
    const applyDate = async(event,picker) => {
        const startDate = picker.startDate.format('DD/MM/YYYY HH:mm')
        const endDate = picker.endDate.format('DD/MM/YYYY HH:mm')
     //  console.log('start ', startDate, ' end : ', endDate)
        setBydate({
            start: startDate,
            end: endDate
        })
        setDateoption({
            ...dateoption,
            startDate: startDate,
            endDate: endDate
        })
        setIsloaded(false)
        await fetchData(startDate,endDate,levels)
        setIsloaded(true)
    }
    const onFilters = async(val) => {
        const term = `name=${val.name}&page_id=${val.id}`
        setTerm(val.id)
        setIsloaded(false)
        await fetchData(bydate.start,bydate.end,levels,term)
        setIsloaded(true)
    }

    const logsClass = (line) => {
        if(!line) return ''
        const str = String(line).toLowerCase()
        if(str.includes('warning') 
        ) return 'warning'

        if(str.includes('info') 
        ) return 'success'

        if(str.includes('notice') 
        ) return 'primary'

        if(str.includes('critical') 
        ) return 'danger'

        if(str.includes('error') 
        ) return 'danger'

        return 'secondary'
    }
    
    const levelLogs = async(e) => {
        let newLevels = levels
        const {checked, value} = e.target
        if(checked){
            const chk = levels.find(x => x == value)
            if(!chk)
                newLevels = ([...newLevels, value])
        }else{
            newLevels = levels.filter(x => x != e.target.value)
        }
        setLevels(newLevels)
        setIsloaded(false)
        await fetchData(bydate.start,bydate.end,newLevels)
        setIsloaded(true)
    }
    const levelChecked = (value) => {
        return levels.find(x => x == value)
    }
    const submitSearch = async() => {
        await setIsloaded(false)
        await fetchData()
        await setIsloaded(true)
    }
    const logsClear = (e) => {
        e.preventDefault()
        setModalconfirm({view:true, title: 'ยืนยันการเคลียร์ข้อมูล', message : 'โปรดยืนยันการเคลียร์ Logs ทั้งหมด',status: 'ready'})
        
    }
    const applyClear = async() => {
        const clean = await clearLogs()
        if(clean.status == 200 || clean.status == 204){
         //  console.log('response apply clear : ', clean.data )
            setModalconfirm({view:true, title: '', message : clean.data.message,status: 'success',percentage:0})
            setTimeout(async() => {
                setModalconfirm({view:false, title: '', message : '',status: 'standby',percentage:0})
                await setIsloaded(false)
                await fetchData()            
                await setIsloaded(true)
            },2000)
        }
    }

    const changePage = async(e,pageNo) => {
        e.preventDefault();
        setIsloaded(false)
        let pm  = []
        pm.push(`start=${moment(bydate.start,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')}`)
        pm.push(`end=${moment(bydate.end,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')}`)
        pm.push(`page=${pageNo}`)
        if(term)
            pm.push(term)

        if(levels && levels.length > 0)
            pm.push(`level=${levels.join(',')}`)

        const response = await fetchLogs(`?${pm.join('&')}`)
        if(response.status == 200){
            setItems(response.data.data)
            setMeta({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            })

        }
        setTimeout(() => {
            sectiontop.current?.scrollIntoView({ behavior: 'smooth' });
        },500)
        setIsloaded(true)
    }

    return (
        <>
        {!isloaded ? <Loading/> :
        <Container fluid>
            <Row>
                <Col md="12">
                    <Card className="strpied-tabled-with-hover px-2 mb-2">
                        <Card.Header>
                            <Row>
                            <Col md="8">
                                <Card.Title as="h4">Logs Details</Card.Title>
                                <p className="card-category">
                                </p>
                            </Col>
                            <Col md="4 text-end">
                            </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive">
                            <Form onSubmit={submitSearch} className="border px-3 mb-3 p-3 form-search">
                                <h5>Logs Date filter</h5>
                                <Row className="">
                                    <Col md={4} lg={4} sm={8}>
                                        <Form.Group className="search-button">
                                        <Form.Label>ระหว่างวันที่</Form.Label>
                                        <div className='position-relative'>
                                            <DateRangePicker initialSettings={dateoption} onApply={applyDate} >
                                                <input type="text" name="expired_date" className="form-control" 
                                                        placeholder='เลือกวันที่' autoComplete='off' 
                                                        value={`${bydate.start} - ${bydate.end}`}
                                                        onChange={e => setBydate(e.target.value)}
                                                />
                                            </DateRangePicker >
                                            <div className="position-absolute" style={{ right: "2px", bottom: "2px" }}>
                                                <CalendarMonthOutlined />
                                            </div>
                                        </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} lg={4} sm={8}>
                                        <SelectSocials className="form-control form-select" firstoption="ทั้งหมด" label="เลือกเพจ" value={term} onChange={e => onFilters(e)} />
                                    </Col>

                                </Row>
                                <Row className="mb-2 mt-2 logs-level">
                                        <Col md={8} lg={8} sm={8}>
                                    {initLogslevel?.map((val,i) => (
                                        <Form.Check type="checkbox" className="me-5" key={i}>
                                            <Form.Check.Input // prettier-ignore
                                                type='checkbox'
                                                value={val.value}
                                                onChange={levelLogs}
                                                checked={levelChecked(val.value)}
                                            />
                                            <Form.Check.Label className={`text-${logsClass(val.value)} text-bold`}> {val.text}</Form.Check.Label>
                                        </Form.Check>
                                    ))}
                                        </Col>
                                        {/* <Form.Group className="search-button">
                                            <Button variant="primary" size="sm" type="submit" ><Search /> Search</Button>
                                            <Button variant="secondary" size="sm" className="ms-2" onClick={clearInput}><Clear color="dark" /> Clear</Button>
                                        </Form.Group> */}
                                    
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="strpied-tabled-with-hover px-2 mb-2" ref={sectiontop}>
                        <Card.Header>
                            <Card.Title>Filter by </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-end mb-2">
                                <Button type="button" variant="primary" onClick={logsClear}>
                                    <ClearAllOutlined /> Clear logs
                                </Button>
                            </div>
                            <div className="table-responsive">
                            <Table responsive striped>
                                <thead>
                                    <tr>
                                        <th className="w140">วัน เวลา</th>
                                        <th>รายละเอียด</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{dayjs(item.timestamp,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="p-0"><div className={`alert alert-${logsClass(item.level)} p-2 m-1`} style={{ whiteSpace: 'pre-line' }}>{Number(idx)+1}.- {item?.context?.product} {item.message}<br/>{item?.context?.page_name} ({item?.context?.page_id})</div>{item?.context?.result ? "\n" + JSON.stringify(item?.context?.result) : ''}</td>
                                    </tr>
                                    ))} 
                                </tbody>
                            </Table>
                            </div>
                            <div className="dataTables_paginate paging_simple_numbers text-center">
                                <ul className="pagination">
                                    <li className={`paginate_button page-item first ${meta.current_page ==1 ? 'disabled' : ''}`} id="paginate_first"><a href="#" onClick={e => changePage(e,(Number(meta.current_page) - 1))} className="page-link mr-1"><NavigateBeforeSharp /></a></li>
                                    <li className={`paginate_button page-item next ${meta.current_page == meta.last_page ? 'disabled' : ''}`} id="stock_feed_next"><a href="#" onClick={e => changePage(e,(Number(meta.current_page) + 1))} className="page-link"><NavigateNextSharp /></a></li>
                                </ul>
                            </div>
                        </Card.Body>

                    </Card>
                </Col>
            </Row>
            <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                title={modalconfirm.title} 
                message={modalconfirm.message} 
                success={modalconfirm.status}
                percentage={0}
                onApply={applyClear}
            />

        </Container>
        }

        </>

    )
}
export default Logs