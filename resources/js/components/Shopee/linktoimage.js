import { useEffect, useState } from "react"
import { Image } from "react-bootstrap"

const Linktoimage = (data) => {
    const [prev, setPrev] = useState(null)
    const someLink = ['https://cf.shopee.co.th/file/']
    useEffect(() => {
        if(JSON.stringify(data) != JSON.stringify(prev)){
            setPrev(data)
        
        }

    },[data])
    const isImage = (value) => {
        if( someLink.some(url => value.includes(url)) )
            return true

        return false
    }
    return (
        <>
            { isImage(data.value) ?
                <Image src={data.value} thumbnail width={60} className="m-1" />
            :
                <div>{data.value}</div>
            }
        </>
    )
}
export default Linktoimage