import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row, Tab, Table, Tabs } from "react-bootstrap"
import Loading from "../../components/Loading/Loading";
import { fetchChunkCommission, fetchCommissions } from "../../controllers/commissionController";
import moment from "moment-timezone";
import { captionWord, commionOrders, commionsNet, commionType, commissionRate, formatNumber, salesPrice, shortDateTh, shortDateTimeTh, slatDate, slatDateTime } from "../../helpers/functions";
import { AccountBalanceOutlined, AccountBalanceWalletOutlined } from "@mui/icons-material";
import CommissionLine from "../../components/Graphs/commissionline";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ImageCaption from "../../components/Overleys/captions";

const ReportCommission = () => {
  const [loaded,setLoaded] = useState(false)
  const [commissions, setCommissions] = useState([])
  const [commission, setCommission] = useState([])
  const [alls, setAlls] =useState([])
  const [orders, setOrders] =useState([])
  let no = 1
  useEffect(() => {
      init()
  },[]);

  const init = async() => {
    await setLoaded(false)
    await fetchChankCommissions()
    await counting()
    await setLoaded(true)
  }

  const counting = async() => {
    const allCommission = await fetchAllCommission(1)
    // console.log('allCommission : ', allCommission)
    setAlls(allCommission)
    let ordersData = [];
    for(let i = 0; i < allCommission.length; i++){
      if(allCommission[i].orders){
        for(let o = 0; o < allCommission[i].orders.length; o++)
        {
          const order = allCommission[i].orders[o]
          if(order.orderStatus == 'PENDING' || order.orderStatus == 'COMPLETED' )
            ordersData.push({...allCommission[i].orders[o], purchaseTime:  allCommission[i].purchaseTime})
        }
      }else{
     //  console.log('orders false : ', allCommission[i])
      }
    }
    setOrders(ordersData)
  }

  const fetchAllCommission = async(pageNo,data = [],ordersNo = 0) => {
      const response = await fetchCommissions(`?per_page=50&page=${pageNo}`)
      if(response.status == 200){
        const meta = response.data
        const com = response.data.data
          for(let i = 0; i < com.length; i++)
          {
            data.push(com[i])
            if(com[i].orders)
            ordersNo += Number(com[i].orders.length)
          }
          if(Number(meta.last_page) > Number(pageNo)){
            pageNo++
            return await fetchAllCommission(pageNo,data,ordersNo)
          }else{
            return data
          }
      }
  }

  const fetchChankCommissions = async() => {
    const response = await fetchChunkCommission()
    if(response.status == 200){
        setCommissions(response.data)
        if(response.data.data){
          const data1 = response.data.data[1] ?? []
          const comm = data1.filter(x => moment(x.purchaseTime,'YYYY-MM-DD').format('YYYY-MM-DD') == moment().subtract(1, 'days').format('YYYY-MM-DD'))
          if(comm.length > 0){
            setCommission(comm)
          }
        }
    }
  }
  return (
    <>
      {!loaded ? 
        <Loading/>
      :
        <Container fluid className="page-posts">
          <Card className="strpied-tabled-with-hover px-2 mb-4">
            <Card.Header>
              <Card.Title as="h4">Commission Report</Card.Title>
              <hr/>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive">
              <Row>
                <Col md="6">
                  <Card>
                    <Card.Header>
                      <strong>คอมมิชชั่นทั้งหมด</strong>
                      <hr/>
                    </Card.Header>
                    <Card.Body className="h200">
                      <Row>
                        <Col xs="3">
                          <div className="icon-big text-center text-success">
                            <AccountBalanceWalletOutlined sx={{fontSize: 46}} />
                          </div>
                        </Col>
                        <Col xs="9">
                            <div className="mb-2">
                              <p>
                                คำสั่งซื้อทั้งหมด <strong className="text-success">{ orders.length } </strong> รายการ <br/>
                                ยอดขายทั้งหมด : <strong className="text-success"><i>{formatNumber(salesPrice(alls),0)}</i></strong> <small><i>฿.-</i></small><br/>
                                รอดำเนินการ : <strong className="text-warning"><i>{formatNumber(commionType(alls,'PENDING'),2)}</i></strong> <small><i>฿.-</i></small><br/>
                                สำเร็จแล้ว : <strong className="text-success">{formatNumber(commionType(alls,'COMPLETED'),2)}<i></i></strong> <small><i>฿.-</i></small>

                              </p>
                              <Card.Title as="h5">คอมมิชชั่น : <strong className="text-success"><i>{formatNumber(commionsNet(alls),2)}</i></strong> <small><i>฿.-</i></small></Card.Title>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                {commission.length > 0 && (
                <Col lg="6" sm="6">
                    <Card>
                      <Card.Header>
                        <strong>คอมมิชชั่น {shortDateTh(commission[0].purchaseTime)}</strong>
                        <hr/>
                      </Card.Header>
                      <Card.Body className="pb-2 h200">
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
                                  ยอดขาย : <strong className="text-success"><i>{formatNumber(salesPrice(commission),0)}</i></strong> <small><i>฿.-</i></small><br/>
                                </p>
                                <Card.Title as="h5">คอมมิชชั่น : <strong className="text-success"><i>{formatNumber(commionsNet(commission),2)}</i></strong> <small><i>฿.-</i></small></Card.Title>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                  )}
                  {commissions.data?.map((com,c) => (
                  <Col lg="6" sm="6" key={c}>
                      <Card>
                        <Card.Header>
                          <strong>{shortDateTh(commissions.periods[c][0])} - {shortDateTh(commissions.periods[c][1])}</strong>
                          <hr/>
                        </Card.Header>
                        <Card.Body className="pb-2 h200">
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
                                    ยอดขาย : <strong className="text-success"><i>{formatNumber(salesPrice(com),0)}</i></strong> <small><i>฿.-</i></small><br/>
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
                              
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="strpied-tabled-with-hover px-2 mb-4">
            <Card.Header>
              <Card.Title as="h4">Commission Graphs</Card.Title>
              <hr/>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive">
              <Row>
                {commissions.periods?.map((periods,c) => (
                  <Col md="6" key={c}>
                    <CommissionLine period={periods} commission={commissions.data[c] ?? []} />
                  </Col>
                ))}
              </Row>
            </Card.Body>          
          </Card>

          <Card className="strpied-tabled-with-hover px-2 mb-4">
            <Card.Header>
              <Card.Title as="h4">Commission Oreders</Card.Title>
              <hr/>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive">
              <PhotoProvider
                overlayRender={({overlay}) => {
                  return overlay
                }}
              >
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th className="w60">ลำดับ</th>
                      <th className="w120">วันที่สั่งซื้อ</th>
                      <th className="w80">รูปสินค้า</th>
                      <th>สินค้า</th>
                      <th className="w120">จำนวน</th>
                      <th className="w120">ราคา</th>
                      <th className="w120">ราคารวม(บาท)</th>
                      <th className="w120">คอมมิชชั่นเรท(%)</th>
                      <th className="w120">คอมมิชชั่น(บาท)</th>
                      <th className="w120">สถานะคำสั่งซื้อ</th>
                    </tr>
                  </thead>
                    <tbody>
                    {orders.map((order,idx) => (
                      <React.Fragment key={idx}>
                      {order.items.map((item,it) => (
                        <React.Fragment key={it}>
                        {item.itemPrice > 0 && (
                        <tr className={order.orderStatus}>
                            <td className="text-end">{no++}</td>
                            <td>{shortDateTimeTh(order.purchaseTime)}</td>
                            <td className="text-center">
                              <PhotoView 
                                  src={item.imageUrl}
                                  overlay={<ImageCaption caption={`${item.itemName} คอมมิชชั่น ${formatNumber(item.itemTotalCommission,2)} บาท`} />}    
                              >
                                  <img src={item.imageUrl} className="img-thumbnail pointer" />
                              </PhotoView>
                            </td>
                            <td className="text-end">{item.itemName}</td>
                            <td className="text-end">{item.qty}</td>
                            <td className="text-end">{item.itemPrice}</td>
                            <td className="text-end">{item.actualAmount}</td>
                            <td className="text-end">{formatNumber(item.itemSellerCommissionRate,1)}%</td>
                            <td className="text-end">{formatNumber(item.itemTotalCommission,2)}</td>
                            <td className="text-center">{order.orderStatus}</td>
                        </tr>
                        )}
                      </React.Fragment>
                      ))}
                      </React.Fragment>
                    ))}
                    </tbody>
                </Table>
              </PhotoProvider>
            </Card.Body>
          </Card>

        </Container>
      }
    </>
  )

}
export default ReportCommission