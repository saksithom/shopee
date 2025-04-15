import React, { useEffect, useState } from "react";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Image,
} from "react-bootstrap";
import { userinfo } from "../helpers/init_vars";
import { fetchDashboard, fetchDashboardCommissions, getApi } from "../controllers/apiscontroller";
import { useNavigate } from "react-router";
import { CalendarMonthRounded, CalendarMonthSharp, Facebook, FacebookRounded, FacebookSharp, ShareRounded, ShoppingBasket } from "@mui/icons-material";
import moment from "moment-timezone";
import { captionWord, commissionRate, formatNumber, unixDate } from "../helpers/functions";
import Loading from "../components/Loading/Loading";
import Facebookfeeds from "../components/Facebook/feedsComponent";
import StarRating from "../components/Shopee/rattingstars";
import { fetchShared } from "../controllers/sharedcontroller";
import { facebookFeeds } from "../controllers/facebookController";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import ModalImage from "../components/Modals/Pictures";
import { getTotalCommissions } from "../controllers/commissionController";

const Dashboard = () => {
  // const user = JSON.parse(userinfo) ?? null
  const [facebook, setFacebook] = useState(null)
  const [shopee, setShopee] = useState(null)
  const [itemshare, setItemshare] = useState(null)
  const [settings, setSetting] = useState({
    shopee : false,
    facebook: false
  })
  const [reports, setReports] = useState([])
  const [modalimage, setModalimage] = useState({view:false, src:''})
  const [commission, setCommission] = useState(null)
  const [commissions, setCommissions] = useState({
    orders: 0,
    pending: 0,
    completed: 0,
    total: 0
  })
  const [posts, setPosts] = useState([])
  const [completed,setCompleted] = useState(false)
  const [loaded,setLoaded] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    init()
  },[]);
  const init = async() => {
    await setLoaded(false)
    await getDashboard()
    await getShared()
    await getCommissions()
    await fetchTotalcommission()
    await setLoaded(true)
  }
  const getShared = async() => {
    const items = await fetchShareds(`?today=yes&per_page=12`)
   //  console.log('response shared : ', items)
      if(items.data && items.total)
      setPosts({
        data: items.data,
        shared: items.total,
      })
  }
  const getDashboard = async() => {
      const feeds = await getFeeds()
      const items = await fetchDashboard('')
      if(items.status == 200){
        const item = items.data
        if(!item) return false

        if(item.facebook){
          setSetting(pre => {
            return {
              ...settings, facebook : true
            }
          })
          setupFacebook(item.facebook,feeds)
        }
        if(item.shopee){
          setShopee(item.shopee)
          const access = item.shopee.access_code
          const pam = `?${access.key}=${access.value}&per_page=15`
          const sharer = await fetchShareds(pam)
          setItemshare(sharer.total)
        }
      }
  }
  const getFeeds = async() => {
    const feeds = await facebookFeeds(`?limit=10`)
    if(feeds.status == 200){
      // console.log('response feeds : ', feeds)
      return feeds.data.data
    }
  }
  const fetchShareds = async(params) => {
    const items = await fetchShared(params)
    if(items.status == 200){
      const data = items.data.data
      const meta = items.data.meta 
      return { data: data, total: meta.total }
    }
  }

  const setupFacebook = (item,feeds) => {
    // console.log('setup facebook : ', item)
    const page = item.access_code.pages.find(x => x.checked == true || x.id == item.page_id)
    const user = item.access_code.user
    const auths = item.access_code.auths
    if(user)
        setCompleted(true)
    
    const facebookData = {
      feeds: feeds ?? [],
      profile: {
        id : user.id,
        name : user.name,
        email : user.email,
        picture : user.picture,
        expire: unixDate(auths.data_access_expiration_time)
      },
      pages: {
        id : page?.id,
        name : page?.name,
        category : page?.category,
        picture: page?.picture
      }
    }
 //  console.log('facebook data : ', facebookData)
    setFacebook(facebookData)
  }
  const getCommissions = async() => {
    const comms = await fetchDashboardCommissions('')
    if(comms.status == 200){
   //  console.log('response commision')
      setReports(comms.data.data)
      setupReports(comms.data.data)
    }
  }

  const fetchTotalcommission = async() => {
    const commis = await getTotalCommissions()
    // console.log('total commission: ', commis)
    if(commis.status == 200){
      setCommissions(commis.data)
    }
  }
  const setupReports = (items) => {
    let itemData = [];
    let total = 0;
    // console.log('setup reports : ', items)
    items.forEach(item => {
        let product = null;

        // หา product จาก order.items
        // item.orders.forEach(order => {
        //     const foundProduct = order.items.find(i => i.itemId);
        //     if (foundProduct) {
        //         product = foundProduct; // เก็บ product ที่พบล่าสุด
        //     }
        // });

        // เพิ่มข้อมูลใน itemData
        itemData.push({
            // product,
            commission: parseFloat(item.totalCommission).toFixed(2) ?? 0.00,
            purchaseTime: moment.unix(item.purchaseTime).format('DD/MM/YYYY'),
            clickTime: moment.unix(item.clickTime).format('DD/MM/YYYY'),
            status: item.conversionStatus,
            orders: item.orders
        });

        // รวมค่าคอมมิชชั่น
        total += parseFloat(item.totalCommission);
    });

    // อัพเดตค่าที่ต้องการ
    setCommission(total.toFixed(2));
};
  const totalPrice = (items) => {
    let total = 0
    for(let i = 0; i < items.length; i++)
    {
      total += parseFloat(items[i].itemPrice) * parseInt(items[i].qty)
    }
    return total
  }


  return (
    <>
    {!loaded ? 
      <Loading/>
    :
      <Container fluid className="page-dashboard">
            <Row className="profile-stats">
                <Col lg="4" sm="6">
                    <Card className="card-stats ">
                      <Card.Body className="pb-2">
                        <Card.Title as='h4' className="text-primary">{settings.facebook ? facebook.pages.name : 'Facebook Page'}</Card.Title>
                        {settings.facebook ? 
                        <Row>
                          <Col xs="4" md="3" sm="4">
                            <div className="icon-big text-center">
                              <img src={facebook.pages.picture} className="img-thumbnail" />
                            </div>
                          </Col>
                          <Col xs="8" md="9" sm="8">
                            <div className="mb-2">
                              <p>Page ID: {facebook.pages.id}</p>
                              <p>Category: {facebook.pages.category}</p>
                              <p>Access Token Expire at: <strong className="text-primary">{facebook.profile.expire}</strong></p>
                              <hr />
                              <Card.Title as="h5">Shared Today: <strong className="text-success"> { posts.shared }</strong> <small>Posts.</small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                        :
                          <div className="text-center">
                            Please setting facebook api <a href="#" onClick={e => { e.preventDefault(); navigate('/admin/apis')}}>Click</a>
                          </div>
                        }
                      </Card.Body>
                    </Card>
              </Col>
                <Col lg="4" sm="6">
                    <Card className="card-stats ">
                      <Card.Title as='h4' className="p-2 text-warning">Commission</Card.Title>
                      <Card.Body className="pb-2">
                        {reports.length > 0 ?
                        <Row>
                          <Col xs="3">
                            <div className="icon-big text-center icon-warning">
                              <i className="nc-icon nc-money-coins text-success"></i>
                            </div>
                          </Col>
                          <Col xs="9">
                              <div className="mb-2">
                              <p>ค่าคอมมิชชั่น <br/>
                                  <strong className="text-success">{ moment(commissions.bt.startDate,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY') }</strong> - <strong className="text-success">{ moment(commissions.bt.endDate,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY') }</strong> 
                                </p>
                              <p>คำสั่งซื้อ <strong className="text-success">{commissions.orders}</strong> รายการ</p>
                              <p>รอดำเนินการ : <strong className="text-success"><i>{formatNumber(commissions.pending,2)}</i></strong> <small><i>฿.-</i></small></p>
                              <p>สำเร็จแล้ว : <strong className="text-success"><i>{formatNumber(commissions.completed,2)}</i></strong> <small><i>฿.-</i></small></p>
                              <Card.Title as="h5">ยอดรวมรายได้ : <strong className="text-success"><i>{formatNumber(commissions.total,2)} </i></strong> <small><i>฿.-</i></small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                        : null }
                      </Card.Body>
                    </Card>
              </Col>
              <Col lg="4" sm="6">
                    <Card className="card-stats ">
                      <Card.Title as="h4" className="p-2 text-warning">Default Auto Sharing</Card.Title>
                      <Card.Body className="pb-2">
                        {shopee ?
                        <Row>
                          <Col xs="3">
                            <div className="icon-big text-center icon-warning">
                              <ShareRounded color="primary" fontSize="large" />
                            </div>
                          </Col>
                          <Col xs="9">
                              <div className="mb-2">
                                <p className="card-category ">Sharing by: <strong className="text-success upercase">{shopee.access_code.key}</strong></p>
                                <p>{shopee.access_code.key == 'shopId' ? <span>'Shop ID: <Link to={`/admin/shopee-shop/${shopee.access_code.value}`} ><strong>{shopee.access_code.value}</strong></Link></span> : <span>Word: <strong className="text-success">{shopee.access_code.value}</strong> </span>}</p>
                                <p>Total Products Sharring per 2 Hours.</p>
                                <Card.Title as="h5"><strong className="text-success"><i>{shopee.access_code.limit}</i></strong> <small><i> Shared.</i></small></Card.Title>
                                <Card.Title as="h5">Total Shared: <strong className="text-success"><i>{itemshare}</i></strong> <small><i> Posts.</i></small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                        : null }
                      </Card.Body>
                    </Card>
              </Col>
            </Row>
            {posts.shared > 0 ? 
          <Card>
            <Card.Header>
              <Card.Title as="h4" className="text-success">Last 15 Products Shared in Today.</Card.Title>
              <hr />
            </Card.Header>
            <Card.Body>
              <Row>
              {posts.data?.map((post,index) => (
              <Col lg="4" md="4" sm="6" className="mb-2" key={index}>
                <Card className="card-stats">
                  <Card.Body>
                    <div className="mb-2 p-2">
                        <div className="icon-big text-center icon-warning">
                          <img src={post.imageUrl} className="w-100 image" />
                        </div>
                    </div>
                    <div className="mb-1 p-2">
                    <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{post.productName}</Tooltip>
                        }
                    >
                        <div className="text-start mb-2" style={{height:'100px',overflow:'hidden'}}>
                          <strong>{captionWord(post.productName)}</strong>
                        </div>
                    </OverlayTrigger>
                        <div><StarRating rating={post.ratingStar} totalStars={5}/></div>
                        <div><small>Rating : {formatNumber(post.ratingStar,1)}</small></div>
                        <div className="mb-2">
                          <p className="card-category text-start">
                            Price: <strong className="text-primary me-2">{formatNumber(post.price,2)}</strong> ฿.- <br/>
                            Commission Rate: <strong className="text-primary">{commissionRate(post.commissionRate)}</strong> % <br/>
                            Commission: <strong className="text-primary">{formatNumber(post.commission,2)}</strong> ฿.-<br/>
                            offerLink : <a href={post.offerLink} target="_blank"><i>{captionWord(post.offerLink,25)}</i></a>
                          </p>
                          <p className="card-category text-start">
                            Shop Id: <strong className="text-primary">{post.shopId}</strong><br/> 
                            Shop Name: <strong className="text-primary">{post.shopName}</strong><br/>
                            Shop offerLink : <a href={post.shopOfferlink} target="_blank"><i>{captionWord(post.shopOfferlink,25)}</i></a>
                          </p>
                        </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                          <CalendarMonthRounded />
                          Shared : { moment(post.updated_at,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
              ))}
              </Row>
            </Card.Body>
          </Card>
          : null }
          {/* Commission List */}
          <Card>
            <Card.Header>
              <Card.Title as="h3" className="text-success"><i className="nc-icon nc-money-coins"></i> Affiliates Commission Summary</Card.Title>
              <hr/>
            </Card.Header>
            <Card.Body>
              {reports?.map((report,index) => (
                <Container key={index} className="mb-2">
                        {report.orders?.map((order,ok) => (
                    <Card className="card-stats" key={`${index}-${ok}`}>
                      <Card.Body>
                          <React.Fragment key={`${index}-${ok}`}>
                            {order.items?.map((item,i) => (
                              <Row key={`${index}-${ok}-${i}`} className={`pt-2 mb-3 ${i > 0 ? 'border-top': ''}`}>
                                <Col md="1">
                                    <Image src={item.imageUrl} thumbnail 
                                          className="pointer" 
                                          onClick={() => setModalimage({view:true, src: item.imageUrl})}/>
                                </Col>
                                <Col md="10">
                                      <div className="text-start mb-2">
                                        <p><strong>{item.itemName}</strong> </p>
                                        <p>
                                          <i className="me-4">จำนวน : <strong className="text-success">{item.qty}</strong> ชิ้น </i> 
                                          <i className="me-4">ราคา : <strong className="text-success">{formatNumber(item.itemPrice,0)}</strong> ฿.</i> 
                                          <i className="me-4">ราคารวม : <strong className="text-success">{ formatNumber((Number(item.itemPrice) * Number(item.qty)),0) }</strong> ฿.</i>
                                          <i className="me-4">ค่าคอมมิชชั่น : <strong className="text-success">{ formatNumber(item.itemTotalCommission,2) }</strong> ฿.</i>
                                        </p>
                                      </div>
                                </Col>
                            </Row>
                          ))}
                          </React.Fragment>
                      </Card.Body>
                      <Card.Footer>
                        <hr/>
                        <Row className="w-100">
                          <Col md="6">
                              <span className="me-4">ยอดรวม : <strong className="text-success me-4">{formatNumber(totalPrice(order.items),0)}</strong> ฿.</span>
                              <span className="me-4"><i>Commission : <strong className="text-success me-4">{formatNumber(report.totalCommission,2)}</strong> ฿.</i></span>
                              <span className="me-4"><i>Status :  <strong className={`${order.orderStatus =='COMPLETED' ? 'text-success' : order.orderStatus == 'PENDING' ? 'text-warning' : 'text-secondary'} me-4`}>{order.orderStatus}</strong></i></span>
                          </Col>
                          <Col md="6">
                            <span className="me-4">
                              <CalendarMonthRounded className="me-2 text-primary" />
                              คลิก : <span className="text-primary"> {dayjs(report.clickTime, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}</span>
                            </span>
                            <span className="me-4">
                              <CalendarMonthRounded className="me-2 text-primary" />
                              สั่งซื้อ : <span className="text-primary">{dayjs(report.purchaseTime, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')}</span>
                            </span>
                          </Col>
                        </Row>
                      </Card.Footer>
                    </Card>
                        ))} 

              </Container>
              ))}
            </Card.Body>
          </Card>
          {/* Facebook Share API */}
          {(settings.facebook && facebook.feeds.length > 0) ? 
          <Card>
            <Card.Header>
              <Card.Title  className="text-primary bold" as="h4"><FacebookSharp /> Last 10 Products Shared in Facebook Page.</Card.Title>
              <hr/>
            </Card.Header>
            <Card.Body>
              {/* <Card.Title className="text-primary bold"><FacebookSharp /> Facebook Feed</Card.Title> 
              <hr/>*/}
              <Row>
              {facebook.feeds?.map((feed,index) => (
              <Col lg="12" md="12" sm="6" className="mb-2" key={index}>
                  <Facebookfeeds feed={feed} />
              </Col>
              ))}
              </Row>
            </Card.Body>
          </Card>
          : null }

      </Container>
      }
      <ModalImage show={modalimage.view} 
                        onHide={() => setModalimage({...modalimage,view:false})} 
                        src={modalimage.src} 
                    />
    </>
    
  );
}

export default Dashboard;
