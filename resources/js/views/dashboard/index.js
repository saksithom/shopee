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
import { useNavigate } from "react-router";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { fetchApi, fetchDashboardCommissions, getCommissions } from "../../controllers/apiscontroller";
import { fetchShared } from "../../controllers/sharedcontroller";
import { fetchChunkCommission } from "../../controllers/commissionController";
import { captionWord, commionOrders, commionsNet, commionType, commissionRate, formatNumber, salesPrice, slatDate, slatDateTime } from "../../helpers/functions";
import CommissionLine from "../../components/Graphs/commissionline";
import StarRating from "../../components/Shopee/rattingstars";
import { AccessTimeFilledOutlined, CalendarMonthRounded } from "@mui/icons-material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import ImageCaption from "../../components/Overleys/captions";
import { getSetting } from "../../controllers/settingController";
const Dashboard = () => {

  const [loaded,setLoaded] = useState(false)
  const [apis,setApis] = useState({facebook: null, shopee: null})
  const [pages, setPages] = useState([])
  const [commissions, setCommissions] = useState([])
  const [commission, setCommission] = useState([])
  const [pageimages, setPageimages] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    init()
  },[]);

  const init = async() => {
    await setLoaded(false)
    await fetchApis()
    await fetchCommissions()
    await setLoaded(true)
  }
  const fetchApis = async() => {
    const response = await fetchApi(`?per_page=100`)
    if(response.status == 200){
      let imgs = []
      let filters = []
      // console.log('fatch apis : ', response.data)
      const fb = response.data.find(x => x.api_type == 'facebook')
      const shopee = response.data.find(x => x.api_type == 'shopee')
      if(fb){
        const fbPages = await Promise.all(
          fb.access_code.pages
            .filter(x => x.checked === true)
            .map(async (x) => {
              const posts = await fetchPosted(`?page_id=${x.id}&today=yes`);
              const options = await fetchSettings(x.id)
              // console.log('options : ', options)
              imgs.push(x.picture)
              return { 
                ...x, 
                type: 'facebook',
                posts: posts?.meta?.total ?? 0,
                lasts: posts?.data.length > 0 ? slatDateTime(posts?.data[0].created_at) : '-',
                content: posts?.data.length > 0 ? posts?.data[0] : null,
                options: options?.options ?? []
              };
            })
        );
        // let instagrams =  []
        // console.log('fb access code : ', fb.access_code)
        // if(fb.access_code.instagrams)
        //  instagrams = await Promise.all(
        //   fb.access_code.instagrams
        //         .filter(x => x.checked === true)
        //         .map(async(x) => {
        //           const posts = await fetchPosted(`?page_id=${x.id}&today=yes`)
        //           imgs.push(x.picture)
        //           return { 
        //             ...x, 
        //             type: 'instagram',
        //             posts: posts?.meta?.total ?? 0,
        //             lasts: posts?.data.length > 0 ? slatDateTime(posts?.data[0].created_at) : '-',
        //             content: posts?.data.length > 0 ? posts?.data[0] : null
        //         }
        //   })
        // )
        setPageimages(imgs)
        // setPages([...fbPages, ...instagrams]);
        setPages(fbPages);
      }
      setApis({
        facebook: fb,
        shopee: shopee
      })
    }
  }
  const fetchSettings = async(page_id) => {
      const response = await getSetting(page_id)
      if(response.status == 200){
        return response.data
      }
      return []
    
  }
  const fetchPosted = async(params) => {
    const items = await fetchShared(params)
    if(items.status == 200)
      return items.data

    return []
  }
  const fetchCommissions = async() => {
    const response = await fetchChunkCommission()
    // console.log('fetch commissions : ', response.data)
    if(response.status == 200){
        setCommissions(response.data)
        if(response.data.data){
          const data0 = response.data.data[0] ?? []
          const data1 = response.data.data[1] ?? []
          const comm = data1.filter(x => moment(x.purchaseTime,'YYYY-MM-DD').format('YYYY-MM-DD') == moment().subtract(1, 'days').format('YYYY-MM-DD'))
          if(comm.length > 0){
            setCommission(comm)
            // console.log('commission yesterday : ', comm)
          }
        }
    }
  }

  return (
    <>
    {!loaded ? 
      <Loading/>
    :
      <Container fluid className="page-dashboard">
        <Card>
          <Card.Body>            
            <Row>
              {commissions.periods?.map((periods,c) => (
              <Col md="6" key={c}>
                <CommissionLine period={periods} commission={commissions.data[c] ?? []} />
              </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Sammary Pages</Card.Title>
            <hr/>
          </Card.Header>
          <Card.Body>            
            {apis.facebook && (
            <>
            <PhotoProvider
              overlayRender={({overlay}) => {
                return overlay
              }}
            >
            <Row className="">
                {pages?.map((page,p) => (
                <Col lg="4" sm="6" key={p}>
                    <Card className="h320h">
                      <Card.Header>
                        <Card.Title as='h4' className="text-primary"><a href={`/admin/shopee/page/${page.id}`} title={page.name}>{ captionWord(page.name,20) }</a> </Card.Title>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2">
                        <Row>
                          <Col xs="4" md="3" sm="4">
                              <PhotoView 
                                src={page.picture}
                                overlay={<ImageCaption caption={`${page.name} (${page.type})`} />}    
                              >
                                <img src={page.picture} className="img-thumbnail pointer" />
                              </PhotoView>
                          </Col>
                          <Col xs="8" md="9" sm="8">
                            <div className="mb-2">
                              <p>
                                <Link to={page.type == 'facebook' ? `https://facebook.com/${page.id}`: `https://www.instagram.com/${page.username}`} target="_blank">
                                <strong className={`${page.type == 'facebook' ? 'text-primary' : 'text-warning'}`}>{ String(page.type).toUpperCase()}</strong> <br/>
                                </Link>

                              {page.type == 'instagram' && (
                                <>
                                <strong className="text-warning">{String(page.username).toUpperCase()}</strong><br/>
                                </>
                              )}
                              Page ID: {page.id}<br/>
                              {page.type == 'facebook' && (
                                <>
                                Category: {page.category}<br/>
                                </>
                              )}
                              </p>
                              
                            </div>
                          </Col>
                        </Row>
                        <hr />
                        <div className="mt-2">
                          การค้นหา : <strong className="text-success">{page.options ? `${page.options.field}: ${page.options.value}`: ''} </strong><br/>
                          จำนวนโพส วันนี้: <strong className="text-success">{page.posts} </strong> <small>โพส</small><br/>
                          โพสล่าสุด: <strong className="text-success">{page.lasts} </strong>
                        </div>
                      </Card.Body>
                    </Card>
                </Col>
                ))}
              </Row>
              </PhotoProvider>
              <h5>โพสล่าสุด</h5>
              <Row>
                {pages?.map((page,p) => (
                <Col lg="4" sm="6" key={p}>
                    {page.content && (
                      
                      <Card>
                      <Card.Header>
                        <Card.Title as='h4' className="text-primary">{captionWord(page.name,20) } ({page.type}) </Card.Title>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2">
                        <div className="mb-1">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>{page.content?.productName}</Tooltip>
                            }
                            >
                            <div className="text-start mb-2 h60">
                              <strong>{captionWord(page.content?.productName)}</strong>
                            </div>
                        </OverlayTrigger>
                        </div>
                        <div className="mb-2">
                          <Link to={`https://www.facebook.com/${page.content?.facebook_post_id}`} target='_blank'>
                            <Image src={page.content?.imageUrl} thumbnail fluid />
                          </Link>
                        </div>
                        <div className="mb-2">
                        <div><StarRating rating={page.content?.ratingStar} totalStars={5}/></div>
                        <div><small>Rating : {formatNumber(page.content?.ratingStar,1)}</small></div>
                        <div className="mb-2">
                          <p className="card-category text-start">
                            Price: <strong className="text-primary me-2">{formatNumber(page.content?.price,2)}</strong> ฿.- <br/>
                            Commission Rate: <strong className="text-primary">{commissionRate(page.content?.commissionRate)}</strong> % <br/>
                            Commission: <strong className="text-primary">{formatNumber(page.content?.commission,2)}</strong> ฿.-<br/>
                            offerLink : <a href={page.content?.offerLink} target="_blank"><i>{captionWord(page.content?.offerLink,25)}</i></a>
                          </p>
                          <p className="card-category text-start">
                            Shop Id: <strong className="text-primary">{page.content?.shopId}</strong><br/> 
                            Shop Name: <strong className="text-primary">{page.content?.shopName}</strong><br/>
                            Shop offerLink : <a href={page.content?.shopOfferlink} target="_blank"><i>{captionWord(page.content?.shopOfferlink,25)}</i></a>
                          </p>
                        </div>
                    </div>
                      </Card.Body>
                      <Card.Footer className="w-100">
                        <hr/>
                        <div className="mb-2 text-secondary">
                        <CalendarMonthRounded /> วันที่ <strong className="text-warning ms-2 me-2">{ moment(page.content?.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY')}</strong> 
                        <AccessTimeFilledOutlined /> เวลา <strong className="text-warning ms-2 ">{ moment(page.content?.updated_at,'YYYY-MM-DD HH:mm').format('HH:mm')}</strong> 
                        </div>
                      </Card.Footer>
                    </Card>
                        )}
                    </Col>
                ))}
                </Row>
                </>
              )}
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Sammary Commission</Card.Title>
            <hr/>
          </Card.Header>
          <Card.Body>            
              <Row>
                {commissions.data?.map((com,c) => (
                <Col lg="4" sm="4" key={c}>
                    <Card className="h220h">
                      <Card.Header>
                        <strong>{slatDate(commissions.periods[c][0])}-{slatDate(commissions.periods[c][1])}</strong>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2">
                        <Row>
                          <Col xs="3">
                            <div className="icon-big text-center icon-warning">
                              <i className="nc-icon nc-money-coins text-success" style={{fontSize:'46px'}}></i>
                            </div>
                          </Col>
                          <Col xs="9">
                              <div className="mb-2">
                                <p>
                                  คำสั่งซื้อ <strong className="text-success">{commionOrders(com)} </strong> รายการ <br/>
                                  รอดำเนินการ : <strong className="text-warning"><i>{formatNumber(commionType(com,'PENDING'),2)}</i></strong> <small><i>฿.-</i></small><br/>
                                  สำเร็จแล้ว : <strong className="text-success">{formatNumber(commionType(com,'COMPLETED'),2)}<i></i></strong> <small><i>฿.-</i></small>
                                </p>
                                <Card.Title as="h5">ยอดรวม : <strong className="text-success"><i>{formatNumber(commionsNet(com),2)}</i></strong> <small><i>฿.-</i></small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
              </Col>
              ))}
              {commission && (
                <Col lg="4" sm="4">
                    <Card className="h220h">
                      <Card.Header>
                        <strong>ยอดขาย เมื่อวาน</strong>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2">
                        <Row>
                          <Col xs="3">
                            <div className="icon-big text-center icon-warning">
                              <i className="nc-icon nc-money-coins text-success" style={{fontSize:'46px'}}></i>
                            </div>
                          </Col>
                          <Col xs="9">
                              <div className="mb-2">
                                <p>
                                  คำสั่งซื้อ <strong className="text-success">{commionOrders(commission)} </strong> รายการ <br/>
                                  ยอดขาย : <strong className="text-success"><i>{formatNumber(salesPrice(commission),2)}</i></strong> <small><i>฿.-</i></small><br/>
                                </p>
                                <Card.Title as="h5">คอมมิชชั่น : <strong className="text-success"><i>{formatNumber(commionsNet(commission),2)}</i></strong> <small><i>฿.-</i></small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
              </Col>
              )}
            </Row>
              {commission.length > 0 && (
              <Row >
                <Col lg="12" sm="12">
                    <Card className="card-stats ">
                      <Card.Header>
                        <strong>รายการขาย สำหรับเมื่อวาน</strong>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2">
                        <PhotoProvider
                          overlayRender={({overlay}) => {
                            return overlay
                          }}
                        >
                        <Row>
                          {commission?.map((comms,cm) => (
                            <React.Fragment key={cm}>
                              {comms.orders?.map((order,o) => (
                              <Col md="4" key={o}>
                                <div className="mb-2">Order ID: <strong className="text-primary">{order.orderId}</strong></div>
                                {order.items?.map((item,i) => (
                                  <React.Fragment key={i}>
                                    {item.itemPrice > 0 && (
                                      <Row>
                                        <Col xs="3">
                                          <PhotoView src={item.imageUrl}
                                            overlay={<ImageCaption caption={`${item.itemName} คอมมิชชั่น ${formatNumber(item.itemTotalCommission,2)} (${formatNumber(item.itemSellerCommissionRate,1)})% บาท`} />}
                                          >
                                            <Image src={item.imageUrl} thumbnail className="pointer" />
                                          </PhotoView>
                                        </Col>
                                        <Col xs="9">
                                            <div className="mb-2">
                                              <p>
                                                รหัสสินค้า : <strong className="text-success">{item.itemId} </strong> <br/>
                                                สินค้า : <strong className="text-success">{item.itemName}</strong> <br/>
                                                ร้านค้า : <strong className="text-success">{item.shopName} </strong> <br/>
                                                จำนวน : <strong className="text-success">{item.qty} </strong> รายการ <br/>
                                                ราคา/ชิ้น : <strong className="text-success"><i>{formatNumber(item.itemPrice,0)}</i></strong> <small className="me-2"><i>฿.- </i></small>
                                                ราคารวม: <strong className="text-success"><i>{formatNumber(item.actualAmount,0)}</i></strong> <small><i>฿.- </i></small><br/>
                                                คอมมิชชั่น : <strong className="text-success">{formatNumber(item.itemTotalCommission,2)}<i></i></strong><small>({formatNumber(item.itemSellerCommissionRate,1)})% <i>฿.-</i></small>
                                              </p>
                                              {/* <Card.Title as="h5">ยอดรวม : <strong className="text-success"><i>{commionsNet(commission)}</i></strong> <small><i>฿.-</i></small></Card.Title> */}
                                          </div>
                                        </Col>
                                    </Row>
                                    )}
                                  </React.Fragment>
                                ))}
                              </Col>
                              ))}
                            </React.Fragment>
                          ))}
                        </Row>
                        </PhotoProvider>
                      </Card.Body>
                    </Card>
              </Col>
            </Row>
            )}
            </Card.Body>
        </Card>
      </Container>
      }
    </>
    
  );
}

export default Dashboard;
