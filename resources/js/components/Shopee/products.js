import { useEffect, useRef, useState } from "react"
import { Button, Card, Container, Pagination, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import { fetchShopeeproducts } from "../../controllers/shopeeController"
import Loading from "../Loading/Loading"
import ModalImage from "../Modals/Pictures"
import Modalconfirm from "../Dialogs/Confirmation"
import Modalsharingapi from "../../views/shopee/modalshareapi"
import Paginate from "../Pagination/Paginate"
import { ArrowLeft, ArrowRight, CheckCircleOutline, FacebookRounded, LinkOutlined, NavigateBeforeSharp, NavigateNextSharp, RestartAlt, ShareRounded } from "@mui/icons-material"
import { commissionRate, formatNumber } from "../../helpers/functions"
import { fetchPosts } from "../../controllers/sharedcontroller"
import { PhotoProvider, PhotoView } from "react-photo-view"
import ImageCaption from "../Overleys/captions"

const Products = ({querys, ...data}) => {
    const initParams = {
            page : 1,
            per_page : 12,
            current_page : 1
          }
        
          const initPageOption = {
              current_page : 1,
              last_page : 1,
              page : 1,
              offset : 20,
              page_list : [{no:1}]
          }
    const [modalshare, setModalshare] = useState({view:false, items:null})
    const [modalimage, setModalimage] = useState({view:false, src:''})
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already', percentage: 0})
    
    const [params, setParams] = useState(initParams)
    const [items, setItems] = useState(null)
    const [loaded, setLoaded] = useState(null)
    const [prev, setPrev] = useState(null)
    const [posted, setPosted] = useState([])
    const [hasnext, setHasnext] = useState(false)
    const sectiontop = useRef()
    useEffect(() => {
        if(JSON.stringify(data) != JSON.stringify(prev)){
            setPrev(data)
            init()
        }
    },[data])
    const init = async() => {
        await fetchData(1)
    }
    
    const fetchData = async(pageNo) => {
        await setLoaded(false)

        const pam = getParams(pageNo)
        const res = await fetchShopeeproducts(pam)
        if(res.status == 200){
            const itemsData = res.data.data
            const meta = res.data.meta
            setItems(itemsData)
            await fetchShareds(itemsData)
            setHasnext(meta.hasNextPage)
            setParams({
                ...params,
                page: meta.page,
                per_page: meta.limit,
                current_page: meta.page,
                nextPage: meta.nextPage
            })
            setTimeout(() => {
                window.scroll(0,0)
                window.scrollTo({ top: 0, behavior: "smooth" })
            },500)
        }
        await setLoaded(true)
    }

    const fetchShareds = async(itemsData) => {
        let itemId = []
        for(let i = 0; i < itemsData.length; i++)
        {
            const idata = itemsData[i]
            itemId.push(idata.itemId)
        }
        const res = await fetchPosts({
            itemsIds: itemId
        })
        if(res.status == 200){
        //  console.log('response posts : ', res)
            setPosted(res.data)
        }
    }

    const getParams = (pageNo) => {
        let pam = []
        pam.push(`per_page=${params.per_page}`)
        pam.push(`current_page=${params.current_page}`)
        pam.push(`page=${pageNo}`)
   //  console.log('params data : ', querys)
        if(querys){
            const query = querys
         //  console.log('query : ', query)
            if( query.field && query.value )
                pam.push(`field=${query.field}&keyword=${query.value}`)
            if( query.shopId)
                pam.push(`shopId=${query.shopId}`)
            // if( query.limit)
            //     pam.push(`limit=${query.limit}`)
            if( query.rating)
                pam.push(`rating=${query.rating}`)
            if( query.sales)
                pam.push(`sales=${query.sales}`)
            if( query.minprice)
                pam.push(`price=${query.minprice}`)
            if( query.mincommission)
                pam.push(`commission=${query.mincommission}`)
        }
        return `?${pam.join('&')}`
    }
    const changePage = async(pageNo) =>{
        await setLoaded(false)
        await setParams({...params, page : pageNo})
        await fetchData(pageNo)
        await setLoaded(true)
        setTimeout(() => {
            window.scroll(0,300)
            sectiontop.current?.scrollIntoView({ behavior: 'smooth' });
        },500)
      
    }
    const sharingConfirm = (e) => {
        setModalconfirm({view:true, title: 'ยืนยันการแชร์ข้อมูล', message : 'คุณต้องการแชร์สินค้าทั้งหมดในหน้านี้',status: 'ready'})
    }
    const submitShare = async(field) => {
        try {   
            const content =  `${field.productName}\nRatting : ${field.ratingStar} \nราคา : ${(field.priceMin != field.priceMax) ? `${field.priceMin}-${field.priceMax}` : field.price } ฿.-\n พิกัดสินค้า : ${field.offerLink}`
            const params = {
                caption : content ?? '',
                itemId: field.itemId,
                productName: field.productName,
                shopName: field.shopName,
                imageUrl: field.imageUrl,
                offerLink: field.offerLink,
                productLink: field.productLink,
                shopId: field.shopId,
                ratingStar: field.ratingStar
            }
            return await facebookPost(params)
            // console.log('Uploaded image ID:', res);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    }
    const sharingAll = async(e) => {
     //  console.log('sharingAll e : ', e)
        let progress = 0;
        for(let i = 0; i < items.length; i++)
        {
            const sharer = await submitShare(items[i])
            // console.log('submitShare  : ', sharer)
            if(sharer.status == 200 ){
                if(progress >= 20 ) break;
                progress++
                const percentage = (progress / 20) * 100;
                setModalconfirm({...modalconfirm, percentage : percentage})
            }
        }
        if(progress >= 20){
            setModalconfirm({view:true, title: '', message : '',status: 'success',percentage:0})
            setTimeout(() => {
                setModalconfirm({view:false})
                window.location.reload()
            },3000)
        }
    }
    const isPosted = (item) => {
        // console.log('is posted  : ', posted)
        // console.log('is posted item : ', item.itemId)
        if(!posted)
            return (
                <FacebookRounded color="primary" className="pointer" onClick={() => setModalshare({view:true, items : item})} />
            )
    
        const res = posted.find(x => x.itemId == item.itemId)
        if(res)
            return (
                <CheckCircleOutline color="success" />
            )
        return (
            <FacebookRounded color="primary" className="pointer" onClick={() => setModalshare({view:true, items : item})} />
        )
    }
    return (
        <>
            {loaded ? 
                <>
                    <Card className="px-2 pe-4 mb-2">
                        <Card.Body className="table-full-width table-responsive px-2 mb-2" ref={sectiontop}>
                            <div className="mb-2 text-end">
                                <Button type="button" variant="btn btn-primary" onClick={sharingConfirm}><ShareRounded /> Share All</Button>
                            </div>
                            <PhotoProvider
                                overlayRender={({overlay}) => {
                                    return overlay
                                }}
                            >
                            <Table striped bordered hover responsive="sm">
                                <thead>
                                    <tr>
                                        <th>Share</th>
                                        <th>Rating</th>
                                        <th><div className="w80">images</div></th>
                                        <th>Porduct</th>
                                        <th>price</th>
                                        <th>Commission</th>
                                        <th>Sales</th>
                                        <th>Shop</th>
                                        <th>link</th>
                                    </tr>
                                </thead>
                                {items.length > 0 ?
                                <tbody>
                                    {items.map((item,idx) => (
                                        <tr key={`items-${idx}`}>
                                            <td>
                                                {/* <FacebookRounded color="primary" className="pointer" onClick={() => setModalshare({view:true, items : item})} /> */}
                                                {isPosted(item)}
                                            </td>
                                            <td className="text-right">{ item.ratingStar }</td>
                                            <td>
                                                <PhotoView
                                                    src={item.imageUrl}
                                                    overlay={<ImageCaption caption={`${item.productName} คอมมิชชั่น ${formatNumber(item.commission,2)} บาท`} />}    
                                                >
                                                    <img src={item.imageUrl} className="img-thumbnail pointer w80" />
                                                </PhotoView>
                                                {/* <img src={item.imageUrl}  className="w80 m-2 pointer" onClick={() => setModalimage({view:true, src: item.imageUrl})} /> */}
                                            </td>
                                            <td>
                                                <div>ID : { item.itemId }</div>
                                                <div className="w280">{ item.productName }</div>
                                            </td>
                                            <td className="text-right">{ formatNumber( Number(item.price,0) ) }</td>
                                            <td className="text-right">
                                                Rate: { commissionRate(item.shopeeCommissionRate) }% <br/>
                                                เฉลี่ย: {formatNumber(item.commission,2)} บาท/ชิ้น
                                            </td>
                                            <td className="text-right">{ formatNumber(item.sales,0) }</td>
                                            <td>
                                                ID: <Link to={`/admin/shopee-shop/${item.shopId}`}>{ item.shopId }</Link> <br/>
                                                Name: <Link to={`/admin/shopee-shop/${item.shopId}`}>{ item.shopName }</Link> <br />
                                                Category {item.productCatIds?.map((cate,c) => (
                                                            <Link key={c} to={`/admin/shopee-category/${cate}`} className="me-2" target="_blank">{cate}</Link> 
                                                        ))}
                                            </td>
                                            <td className="text-center">
                                                <Link to={item.productLink} target="_blank"><LinkOutlined /></Link><br/>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                :
                                <tbody>
                                    <tr>
                                        <td colSpan={47} className="">- ไม่พบข้อมูล -</td>
                                    </tr>
                                </tbody>
                                }
                            </Table>
                            </PhotoProvider>
                        </Card.Body>
                    </Card>
                    <Card className="px-2 mb-2">
                        <Card.Body>
                            <div className="text-center">
                                {/* <Button variant="primary" onClick={e => changePage(Number(params.page)-1)} type="button" size="sm" disabled={params.page == 1} className="me-1"><NavigateBeforeSharp /></Button>
                                <Button variant="primary" onClick={e => changePage(Number(params.page)+1)} type="button" disabled={!hasnext} size="sm"><NavigateNextSharp /></Button> */}
                            {/* <Paginate options={pageOption} clickPage={e => changePage(e)} /> */}
                            <div className="dataTables_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={`paginate_button page-item first ${params.page ==1 ? 'disabled' : ''}`} id="paginate_first"><a href="#" onClick={e => changePage(Number(params.page)-1)} className="page-link mr-1"><NavigateBeforeSharp /></a></li>
                                    <li className={`paginate_button page-item next ${!hasnext ? 'disabled' : ''}`} id="stock_feed_next"><a href="#" onClick={e => changePage(Number(params.nextPage))} className="page-link"><NavigateNextSharp /></a></li>
                                </ul>

                            </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Modalsharingapi show={modalshare.view} 
                        onHide={() => setModalshare({...modalshare,view:false})}
                        items={modalshare.items}
                    />
                    <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        percentage={modalconfirm.percentage}
                        onSubmit={sharingAll}
                    />
                    <ModalImage show={modalimage.view} 
                        onHide={() => setModalimage({...modalimage,view:false})} 
                        src={modalimage.src} 
                    />
                </>
            :
                <Card className="mb-2">
                    <Card.Body className="text-center">
                        <div className="text-center text-secondary"><RestartAlt className="spin" /><br/>Loading ....</div>
                    </Card.Body>
                </Card>
            }
        </>
    )
}
export default Products