import { useEffect, useState } from "react"

const Datavalue = (data) => {
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
        <div className="p-1 border">{  isImage(data.value) ? <img src={data.value} style={{width:'60px',height:'60px'}} /> : data.value}</div>
    )
}
export default Datavalue