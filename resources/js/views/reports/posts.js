import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Image, Row, Spinner, Tab, Tabs } from "react-bootstrap"
import { useNavigate } from "react-router";
import { fetchApi } from "../../controllers/apiscontroller";
import Loading from "../../components/Loading/Loading";
import { fetchShared } from "../../controllers/sharedcontroller";
import { Link } from "react-router-dom";
import { CalendarMonthRounded, NavigateBeforeSharp, NavigateNextSharp } from "@mui/icons-material";
import StarRating from "../../components/Shopee/rattingstars";
import { captionWord, formatNumber, slatDateTime } from "../../helpers/functions";
import moment from "moment-timezone";
import CardPageFilter from "../../components/Cards/pagefilters";

const ReportPost = () => {
  const [key, setKey] = useState('home');
  const [loaded,setLoaded] = useState(false)
  const [dataloaded,setDataloaded] = useState(false)
  const [pages, setPages] = useState([])
    const sectiontop = useRef(null)

  useEffect(() => {
    init()
  },[]);

  const init = async() => {
    await setLoaded(false)
    await fetchApis()
    await setLoaded(true)
    setDataloaded(true)
  }

  const fetchApis = async() => {
    const response = await fetchApi(`?per_page=100`)
    if(response.status == 200){
      const fb = response.data.find(x => x.api_type == 'facebook')
      const shopee = response.data.find(x => x.api_type == 'shopee')
      if(fb){
        const fbPages = await Promise.all(
          fb.access_code.pages
            .filter(x => x.checked === true)
            .map(async (x) => {
              const posts = await fetchPosted(`?page_id=${x.id}&today=yes&per_page=20`);
              return { 
                ...x, 
                type: 'facebook',
                posts: posts?.meta?.total ?? 0,
                feeds: posts?.data ?? [],
                meta: posts?.meta ?? [],
                lasts: posts?.data.length > 0 ? slatDateTime(posts?.data[0].created_at) : '-',
                content: posts?.data.length > 0 ? posts?.data[0] : null
              };
            })
        );
      
        const instagrams = await Promise.all(
          fb.access_code.instagrams
                .filter(x => x.checked === true)
                .map(async(x) => {
                  const posts = await fetchPosted(`?page_id=${x.id}&today=yes&per_page=20`)
                  return { 
                    ...x, 
                    type: 'instagram',
                    posts: posts?.meta?.total ?? 0,
                    feeds: posts?.data ?? [],
                    lasts: posts?.data.length > 0 ? slatDateTime(posts?.data[0].created_at) : '-',
                    content: posts?.data.length > 0 ? posts?.data[0] : null
                }
          })
        )
        setKey(fbPages[0].id)
        setPages([...fbPages, ...instagrams]);
      }

    }
  }

  const fetchPosted = async(params) => {
    const items = await fetchShared(params)
    if(items.status == 200)
      return items.data

    return []
  }
  const changePage = async(e,pageNo, idx) => {
    e.preventDefault();
    console.log('change page: ', pageNo)
    setDataloaded(false)
    const cpage = pages.find((_,i) => i == idx)
    if(!cpage) return false
    if(pageNo < 0 )
      pageNo = 1
    
    if(pageNo > cpage.meta.last_page)
      pageNo = cpage.meta.last_page
    const params = `?page_id=${cpage.id}&today=yes&per_page=20&page=${pageNo}`
    console.log('change page params : ', params)
    const posts = await fetchPosted(params)
    console.log('change page params : ', posts)

    if(posts){
        const updatePage = pages.map((item,i) => {
          if( i == idx)
            return {
              ...item,
              feeds: posts?.data ?? [],
              meta: posts?.meta ?? []
            }
          return item
        })
        setPages(updatePage)
    }
    setDataloaded(true)
    setTimeout(() => {
      window.scroll(0,0)
      sectiontop.current?.scrollIntoView({ behavior: 'smooth' });
  },500)
}
  return (
    <>
      {!loaded ? 
        <Loading/>
      :
        <Container fluid className="page-posts">
          <Card className="strpied-tabled-with-hover px-2 mb-2">
            <Card.Header>
              <Card.Title as="h4">รายการโพสวันนี้</Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive" ref={sectiontop} >
              <Tabs
                id="controlled-tab-facebooks"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                {pages?.map((page,p) => (
                  <Tab eventKey={page.id} title={`${page.name} (${String(page.type).toUpperCase()})`} key={p}>
                    <CardPageFilter page_id={page.id} feeds={page.feeds} />
                    {!dataloaded ? <div className="text-center"><Spinner /> Loading....</div>
                    :
                    <>
                    <div className="text-end text-secondary"><i>Current page: {page.meta.current_page}</i></div>
                    {page.feeds?.map((data,f) => (
                    <Card className="mb-2" key={f}>
                      <Card.Body>
                          <Row>
                              <Col md={2} lg={2} sm={4}>
                                <Link to={`https://www.facebook.com/${data.facebook_post_id}`} target='_blank'>
                                  <Image src={data.imageUrl} thumbnail fluid />
                                </Link>
                              </Col>
                              <Col md={10} lg={10} sm={8}>
                                  <div className="mb-2">
                                    <div className="mb-1">
                                      <Link to={`https://www.facebook.com/${data.facebook_post_id}`} target='_blank' className='text-dark'>
                                        <strong>{data.productName}</strong>
                                      </Link>
                                    </div>
                                    <div><StarRating rating={data.ratingStar} totalStars={5}/></div>
                                    <div><small>Rating : {formatNumber(data.ratingStar,1)}</small></div>
                                    <div className="mb-2">
                                          <p className="card-category text-start">
                                            ราคา: <strong className="text-primary me-2">{formatNumber(data.price,2)}</strong> ฿.- <br/>
                                            พิกัดสินค้า : <a href={data.offerLink} target="_blank"><i>{captionWord(data.offerLink,25)}</i></a>
                                          </p>
                                          <p className="card-category text-start">
                                            ร้านค้า: <strong className="text-primary">{data.shopName}</strong><br/>
                                            พิกัดร้าน : <a href={data.shopOfferlink} target="_blank"><i>{captionWord(data.shopOfferlink,25)}</i></a>
                                          </p>
                                    </div> 
                                  </div> 
                              </Col>
                          </Row>
                      </Card.Body>
                      <Card.Footer>
                          <hr />
                          <div className="stats">
                              <CalendarMonthRounded />
                              โพสเมื่อ : <span className="text-info">{ moment(data.updated_at,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')}</span>
                          </div>
                      </Card.Footer>
                  </Card>
                  ))}
                  <div className="dataTables_paginate paging_simple_numbers text-center">
                      <ul className="pagination">
                        <li className={`paginate_button page-item first ${page.meta.current_page ==1 ? 'disabled' : ''}`} id="paginate_first"><a href="#" onClick={e => changePage(e,(Number(page.meta.current_page) - 1),p)} className="page-link mr-1"><NavigateBeforeSharp /></a></li>
                        <li className={`paginate_button page-item next ${page.meta.current_page == page.meta.last_page ? 'disabled' : ''}`} id="stock_feed_next"><a href="#" onClick={e => changePage(e,(Number(page.meta.current_page) + 1),p)} className="page-link"><NavigateNextSharp /></a></li>
                      </ul>
                  </div>
                  </>}
                  </Tab>
                ))}
              </Tabs>
            </Card.Body>
          </Card>
        </Container>
      }
    </>
  )
}
export default ReportPost