import React,{useEffect, useRef, useState } from "react"

const Paginate = (data) => {
    // const {rows, setRows } = useContext(AuthenContext)
    const [pagesList, setPagesList] = useState([{no:1}])
    const [offset, setOffset] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    let componentMounted = useRef(true);
    
    useEffect(() => {
        if(componentMounted.current){
            init()
        }

        return () => {
            componentMounted.current = false;
        }
    },[])
    
    const init = () => {
        const current_page = data.options.current_page
        setAsPageList(current_page)
        setCurrentPage(current_page)
    }
    const setAsPageList = (cpage) => {
        // console.log('paginate data ', data)
        let pl = []
        const pagin = data.options;
        let os = pagin.offset ? pagin.offset : offset
        if( pagin.last_page > os ){
            let mid     = parseInt( os / 2 )
            // console.log('cpage : ', cpage ,' mid : ', mid)
            let startOffset = parseInt(cpage) - parseInt(mid);
            let endOffset = parseInt(cpage) + parseInt(mid);
            // console.log('cpage : ', cpage , ' mid : ', mid)
            if( cpage == 1 || startOffset < 1 ){
                startOffset = 1
                endOffset = os
                // console.log('page = 1')
            }
            // console.log('cpage : ', cpage, 'mid : ', mid, 'start page : ', startOffset,' end : ', endOffset, ' last : ', pagin.last_page)
            if( endOffset > pagin.last_page ){
                    endOffset = pagin.last_page
                    startOffset = parseInt(pagin.last_page) - (parseInt(os) - 1)
            }

            // console.log('page A start : ', startOffset, ' end : ', endOffset)
            for( let i = startOffset; i <= endOffset; i++){
                pl.push({no : i})
            }
        }else{
            // console.log('page B')
            for(let i = 1; i <= data.options.last_page; i++){
                pl.push({no : i})
            }

        }
        // console.log('pl : ', pl)
        setPagesList(pl);
    }

    const clickPage = (e,pageNo) => {
        e.preventDefault();
        // console.log('click change page : ', pageNo)
        setCurrentPage(pageNo)
        setAsPageList(pageNo)
        data.clickPage(pageNo)
        // return pageNo
    }

    return (
        <>
        {pagesList.length > 1 && 
        <div className="dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
                
                <li className={`paginate_button page-item first ${data.options.page ==1 ? 'disabled' : ''}`} id="paginate_first"><a href="#" onClick={e => clickPage(e,1)} className="page-link mr-1">&lt;&lt; </a></li>
                <li className={`paginate_button page-item previous ${data.options.page ==1 ? 'disabled' : ''}`} id="stock_feed_previous"><a href="#" onClick={e => clickPage(e,data.options.page-1)} className="page-link">&lt; </a></li>
                {pagesList?.map((page,idx) => (
                        <li className={`paginate_button page-item ${data.options.page == page.no ? 'active': ''}`} key={`pagin-${idx}`}><a href="#" onClick={e => clickPage(e,page.no)} className="page-link">{page.no}</a></li>
                    )
                )}
                {/* <li className="paginate_button page-item "><a href="#" aria-controls="stock_feed" data-dt-idx="2" tabindex="0" className="page-link">2</a></li> */}
                <li className={`paginate_button page-item next ${data.options.last_page == currentPage ? 'disabled' : ''}`} id="stock_feed_next"><a href="#" onClick={e => clickPage(e,currentPage +1)} className="page-link mr-1"> &gt;</a></li>
                <li className={`paginate_button page-item next ${data.options.last_page == currentPage ? 'disabled' : ''}`} id="stock_feed_next"><a href="#" onClick={e => clickPage(e,data.options.last_page)} className="page-link"> &gt; &gt;</a></li>
            </ul>
        </div>
        }
        </>

    )
}
export default Paginate