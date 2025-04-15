import axios from "axios"
import CryptoJS from "crypto-js";
const shopee_api_link = 'https://open-api.affiliate.shopee.co.th';
const shopee_app_id='15360110087';
const shopee_app_secret='ZNMLETZB34EHR2QPOLDMKCY2BCJLQLXP';


const shopeeHeaders = (graphQLParams) => {
    var timestamps = Math.ceil(new Date().getTime()/1000);

    var payload = JSON.stringify(graphQLParams);
    var factor = shopee_app_id+timestamps+payload+shopee_app_secret;
    
    var sign = CryptoJS.SHA256(factor).toString(CryptoJS.enc.Hex);
    
    var headers = {
        "Content-Type": "application/json",
        "Authorization": "SHA256 Credential="+shopee_app_id+", Timestamp="+timestamps+", Signature="+sign
    }

    return axios.create({
        baseURL: shopee_api_link,
        headers: headers
    })
}

const getProducts = async(graphQLParams) => {
    const fetcher = shopeeHeaders(graphQLParams)
    return await fetcher.post('/graphql',graphQLParams)
}

export {
    getProducts
}