import React, { useEffect, useRef, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Col, ListGroup, Row, Table } from 'react-bootstrap';
import { commionOrders, commionsNet, formatNumber, salesPrice, slatDate } from '../../helpers/functions';
import moment from 'moment-timezone';
import 'moment/locale/th'
moment.locale('th')
export default function CommissionLine({commission, period}) {
  const chartRef = useRef(null);
  const [width, setWidth] = useState(500);
  const [prevdata, setPrevdata] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [subject, setSubject] =useState(null)
  const [labels, setLabels] = useState([])
  const [graphdata, setGraphdata] = useState([])
  const [commissions, setCommissions] = useState([])
  const [total, setTotal] = useState({
    orders: 0,
    sales: 0.00,
    commions: 0.00
  })
  useEffect(() => {
    if(JSON.stringify(commission) !== JSON.stringify(prevdata)){
      init()
      setPrevdata(commission)
    }
  },[commission])
  useEffect(() => {
      const updateSize = () => {
          if (chartRef.current) {
              setWidth(chartRef.current.offsetWidth);
          }
      };
      window.addEventListener("resize", updateSize);
      updateSize(); // เรียกครั้งแรกเพื่อเซ็ตค่าเริ่มต้น
      return () => window.removeEventListener("resize", updateSize);
  }, []);

  const init = () => {
    setLoaded(false)
    setSubject(`${slatDate(period[0])}-${slatDate(period[1])}`)
    setupLabel()
    setLoaded(true)
  }
  const setupLabel = () => {
    const start = moment(period[0]);
    const end = moment(period[1]);
    let current = start.clone();
    let dateList = [];
    let commissionList = []
    let sales = []
    let orders = []
    let commissionsData = []
    let totalOrders = 0
    let totalSeles = 0
    let totalCommission = 0
    while (current.isSameOrBefore(end, "day")) {
      const date = current.format('YYYY-MM-DD')
      const comm = commission.filter(x => moment(x.purchaseTime,'YYYY-MM-DD').format('YYYY-MM-DD') == date)
      commissionList.push(commionsNet(comm))
      sales.push(salesPrice(comm))
      orders.push(commionOrders(comm))
      dateList.push(current.format("DD MMM YYYY"));
      commissionsData.push({
          orders: commionOrders(comm),
          sales: salesPrice(comm),
          date: current.format("DD MMM YYYY"),
          commission: commionsNet(comm)
      })
      totalOrders += Number(commionOrders(comm))
      totalSeles += Number(salesPrice(comm))
      totalCommission += Number(commionsNet(comm))
      current.add(1, "day"); // เพิ่มวันทีละ 1
    }
 //  console.log('dateList : ',dateList, ' commissionList : ', commissionList)

    setLabels(dateList)
    setGraphdata([
      { data: commissionList, label: 'รายได้', color: 'green'},
      // { data: sales, label: 'ยอดขาย', color: 'blue'},
      { data: orders, label: 'คำสั่งซื้อ', color: 'orange'}
    ])
    setCommissions(commissionsData)
    setTotal({
      orders: totalOrders,
      sales: totalSeles,
      commions: totalCommission
    })
  }
  
  return (
    <Card ref={chartRef} style={{ width: "100%" }}>
      <Card.Header>
        <Card.Title as="h5"><strong>{subject}</strong></Card.Title>
        <hr/>
      </Card.Header>
      <Card.Body>
        <LineChart
          xAxis={[{ scaleType: 'point',data: labels }]}
          series={graphdata}
          width={width}
          height={300}
          />
          <p><strong>Commissions</strong></p>
          <div className='commission-table'>
            <Table responsive>
              <thead>
                <tr>
                <th><div className='mw120'>วันที่</div></th>
                <th><div className='mw140'>จำนวนออเดอร์</div></th>
                <th><div className='mw120'>ยอดขาย(บาท)</div></th>
                <th><div className='mw120'>คอมมิชชั่น(บาท)</div></th>
                </tr>
              </thead>
              <tbody>
                {commissions?.map((comm,cm) => (
                <tr key={cm}>
                  <td className='text-center'>{comm.date}</td>
                  <td className='text-center'>{comm.orders }</td>
                  <td className='text-end text-primary'>{formatNumber(comm.sales)}</td>
                  <td className='text-end text-success'>{formatNumber(comm.commission)}</td>
                </tr>
                ))}
              </tbody>
              {/* <tfoot>
                <tr>
                  <td className='text-end bold'><strong>รวม</strong></td>
                  <td className='text-center'><strong>{total.orders}</strong></td>
                  <td className='text-end text-primary'><strong>{formatNumber(total.sales)}</strong></td>
                  <td className='text-end text-success'><strong>{formatNumber(total.commions)}</strong></td>
                </tr>
              </tfoot> */}
            </Table>
          </div>
      </Card.Body>
      <Card.Footer>
        {/* <hr/> */}
        <div className='mt-2 w-100'>
          <span className='me-4'>ขายได้ <strong>{total.orders}</strong> ออเดอร์</span>
          <span className='text-primary me-4'>ยอดขายรวม : <strong>{formatNumber(total.sales)} </strong> บาท</span>
          <span className='text-success'>ยอดคอมมิชชั่นรวม : <strong>{formatNumber(total.commions)}</strong> บาท</span>

        </div>
      </Card.Footer>
    </Card>
  );
}
