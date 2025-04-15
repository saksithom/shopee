import { useEffect, useState } from "react"
import { Card, Col, Form, Image, InputGroup, Row } from "react-bootstrap"
import { getSetting } from "../../controllers/settingController"
import { formatNumber, slatDate } from "../../helpers/functions"
import { fetchShared } from "../../controllers/sharedcontroller"
import moment from "moment-timezone"

const CardPageFilter = ({page_id, feeds}) => {
    const [prevpage, setPrevpage] = useState(null)
    const [page, setPage] = useState()
    const [loaded, setLoaded] = useState(false)
    const [filters, setFilters] = useState({})
    const [posts, setPosts] = useState({})
    useEffect(() => {
        if(page_id !== prevpage){
            init()
            setPrevpage(page_id)
        }
    },[page_id])
    const init =  async() => {
        setLoaded(false)
        await fetchSettings()
        setLoaded(true)
    }
    const fetchSettings = async() => {
        const response = await getSetting(page_id)
        // console.log('response settings : ', response.data)
        if(response.status == 200){
            const options = response.data.options

            setFilters(response.data)
            setPage(response.data.page)
            // check post //
            const todayPosts = await fetchPosted(`?page_id=${page_id}&today=yes&per_page=10`)
            const allPosts = await fetchPosted(`?page_id=${page_id}&per_page=10`)
            const filterPosts = await fetchPosted(`?page_id=${page_id}&${options?.field ?? ''}=${options?.value ?? ''}&per_page=10`)
            setPosts({
                today: todayPosts?.meta.total ?? 0,
                all: allPosts?.meta.total ?? 0,
                filters: filterPosts?.meta.total ?? 0,
            })
    
        }
    }
    const fetchPosted = async(params) => {
        const items = await fetchShared(params)
        if(items.status == 200)
          return items.data
    
        return []
    }
    
    return (
        <Card className="bordered">
            {!loaded ? 
            <Card.Body className="text-center">Loading....</Card.Body>
            :
            <>
            <Card.Header>
                <Card.Title as='h5' className="text-primary">ค่าสำหรับค้นหา</Card.Title>
                <hr className="text-secondary"/>
            </Card.Header>
            <Card.Body>
                <Row>
                    {page ?
                    <Col md="4">
                        <div className="mb-2">
                            <div className="icon-big text-start icon-warning" style={{height:'60px', width: '60px', overflow:'hidden'}}>
                                <Image src={page.picture} thumbnail fluid style={{height:'100%'}} />
                            </div>
                        </div>
                        <div className="border-2">
                            <div className="mb-1">
                                <p className="card-category">
                                    Page Name: <strong className="text-success">{page.name}</strong><br/>
                                    Page ID: <strong className="text-warning">{page.id}</strong><br/>
                                    { filters.type == 'facebook' && (
                                        <>
                                            category: <strong className="text-info"><i>{page?.category}</i></strong><br/>
                                        </>
                                    )}
                                    จำนวนโพสวันนี้ <strong className="text-primary">{ formatNumber(posts.today,0) }</strong> โพส<br/>
                                    จากโพสทั้งหมด <strong className="text-primary">{ formatNumber(posts.all,0) }</strong> โพส<br/>
                                    โพสล่าสุด <span className="text-success">{feeds[0]?.updated_at ? moment(feeds[0]?.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm') : '-'}</span>
                                </p>
                            </div>
                        </div>
                    </Col>
                    : ''}
                    {filters ? 
                    <Col md="8">
                        <Row>
                            <Col md="8">
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>ค้นหาจาก</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1" style={{borderLeft:'1px solid #bdbdbd'}}>
                                            <Form.Select 
                                                style={{boxShadow:'none', borderLeft:0,borderTop:0, borderBottom:0}}
                                                defaultValue={filters.options.field}
                                                disabled
                                                className="bg-white"
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
                                            className="bg-white"
                                            disabled
                                            defaultValue={filters.options.value}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md="4">
                                <Form.Group className="mb-2">
                                    <Form.Label>ระยะเวลาการแชร์ (ชม.): </Form.Label>
                                    <Form.Select 
                                        className="bg-white"
                                        disabled
                                        defaultValue={filters.options.times}
                                    >
                                        {[...Array(12)].map((_,h) => (
                                            <option value={Number(h)+1} key={h}>{Number(h)+1}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row  className="mb-2">
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>จำนวนโพส/ครั้ง: </Form.Label>
                                    <Form.Control type="number" 
                                        className="bg-white"
                                        disabled
                                        defaultValue={filters.options.limit}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>ยอดขายได้ขั้นต่ำ: </Form.Label>
                                    <Form.Control type="number" 
                                        className="bg-white"
                                        disabled
                                        defaultValue={filters.options.sales}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="2">
                                <Form.Group className="mb-2">
                                    <Form.Label>คะแนนสินค้าขั้นต่ำ: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            disabled
                                            defaultValue={filters.options.rating}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="2">
                                    <Form.Group className="mb-2">
                                        <Form.Label>ราคาเริ่มต้น: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            disabled
                                            defaultValue={filters.options.minprice}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="4">
                                    <Form.Group className="mb-2">
                                        <Form.Label>Commission ขั้นต่ำ: </Form.Label>
                                        <Form.Control type="number" 
                                            className="bg-white"
                                            disabled
                                            defaultValue={filters.options.mincommission}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                        </Col>
                        : null }
                    </Row>                                  
                </Card.Body>
                <Card.Footer>
                    <hr/>
                    <div className="mb-2">
                        <span className="me-4">อัพเดทค่าสำหรับค้นหาล่าสุด <strong className="text-primary">{moment(filters.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')}</strong></span>
                        <span className="me-4">จำนวนโพสจากค่าปัจจุบัน <strong className="text-primary me-2 ms-2">{ formatNumber( posts.filters,0) }</strong> โพส</span>
                    </div>
                </Card.Footer>
                </>
            }
            </Card>

    )
}
export default CardPageFilter