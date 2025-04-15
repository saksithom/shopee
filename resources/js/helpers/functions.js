import dayjs from "dayjs";
import moment from "moment-timezone";
import React,{ createContext } from "react";

const Inputcontext = createContext(null)

const emailinfo = (email) => {
    if(!email) return false

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
const ucfirst = (str) => {
    if (!str) return str; // ตรวจสอบว่ามีค่าในสตริงหรือไม่
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const adminLevel = (level) => {
    if(level == 'admin')
        return 'Admin'
    if(level == 'super-admin')
        return 'Super Admin'
    return ucfirst(String(level))
}
const getFilename = (filename) => {
    const exfile = filename.split('/')
    const no = Number(exfile.length) - 1
    return no > -1 ? exfile[no].replace('.json','') : ''
}

// const number = 1234.56;
// console.log(formatNumber(number)); // Output: 001,234.56
function formatNumber(num ,digit=2) 
{
    if(!num) return 0
    if (typeof num !== 'number')
        num = parseFloat(num)
    let [integerPart, decimalPart] = num.toFixed(Number(digit)).split('.');

    // integerPart = integerPart.padStart(3, '0');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${integerPart}${decimalPart ? `.${decimalPart}`: ''}`;
}

function captionWord(text,maxChars = 60) {
    if(!text) return ''
    if (text.length > maxChars) {
        return text.substring(0, maxChars) + '...';
    }
    return text;
}

const commissionRate = (rate) => {
    const commission = parseFloat(rate)*100
    const s = String(commission).split('.')
    return s.length > 1 ? commission.toFixed(2): commission
}
const unixDate = (int,format='DD/MM/YYYY') => {
    if(!int) return ''
    return dayjs.unix(int).format(format)
}
const slatDate = (date) => {
    if(!date) return ''
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY')
}

const slatDateTime = (date) => {
    if(!date) return ''
    return moment(date,'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')
}
const shortDateTh = (date) => {
    if(!date) return ''
    return moment(date,'YYYY-MM-DD').format('DD MMM YYYY')
}

const shortDateTimeTh = (date) => {
    if(!date) return ''
    return moment(date,'YYYY-MM-DD HH:mm').format('DD MMM YYYY HH:mm')
}
const menuActived = (itemroutes) => {
    const fullpath = location.pathname.split('/').filter(segment => segment !== "")
    if(fullpath.length < 2){
        return itemroutes
    } 
    const layout = `/${fullpath[0]}`
    const path = `${location.pathname.replace(layout,'')}`
    const activedMenu = itemroutes.map((item) => {
        if(item.submenu && item.submenu.length > 0){
            let newsub = item.submenu.map((sub) => {
                let isActive = false;
                // เช็คถ้า path มี :id
                if (sub.path.includes(':id')) {
                    const subPathRegex = new RegExp('^' + sub.path.replace(/:id/g, '([\\w-]+)') + '$');
                    const match = path.match(subPathRegex);
                    if (match) {
                        isActive = true;
                    }
                } else {
                    isActive = (sub.layout === layout && sub.path === path);
                }

                return {
                    ...sub,
                    actived: isActive
                };
            })
                
            const findActive = newsub.find(x => x.actived == true)
         //  console.log('find active :', findActive)
            const submenu = newsub.map(sub => {
                if(findActive && findActive.activedPath && findActive.activedPath == sub.path)
                    return {
                        ...sub,
                        actived: true
                    }
                return sub
            })
            return {
                ...item,
                actived: findActive ? true: false,
                submenu : submenu
            }
                
        }else{
          return {
            ...item,
            actived : (item.layout == layout && item.path == path )
          }
      }
    })
    return activedMenu
}

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
}
const isValidURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // ตรวจสอบ http หรือ https
      "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + // ชื่อโดเมน
      "localhost|" + // localhost
      "\\d{1,3}(\\.\\d{1,3}){3})" + // IP Address
      "(\\:\\d+)?(\\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?$", // Port และ Path
      "i"
    );
    return !!urlPattern.test(url);
}

// Commission Functions //
const commionOrders = (coms) => {
    let no = 0;
    for(let i = 0; i < coms.length; i++)
    {
        if(!coms[i].orders) continue;
        const orders = coms[i]?.orders.filter(x => (x.orderStatus == 'COMPLETED' || x.orderStatus == 'PENDING'))
        no+= parseInt(orders.length)
    }
    return no;
}
const commionType = (coms,type) => {
    let no = 0;
    for(let i = 0; i < coms.length; i++)
    {
        if(!coms[i].orders) continue;
        const orders = coms[i].orders.filter(x => (x.orderStatus == type))
        if(orders.length > 0)
            no+= parseFloat(coms[i].netCommission)
        }
    return no.toFixed(2) ?? 0;
}
const commionsNet = (coms) => {
    if(!coms) return 0
    let no = 0;
    for(let i = 0; i < coms.length; i++)
    {
        no+= parseFloat(coms[i].netCommission)
    }
    return parseFloat(no).toFixed(2);
}
const salesPrice = (coms) => {
    let no = 0;
    for(let i = 0; i < coms.length; i++)
    {
        if(!coms[i].orders) continue;
        const orders = coms[i]?.orders.filter(x => (x.orderStatus == 'COMPLETED' || x.orderStatus == 'PENDING'))
        for(let a = 0; a < orders.length; a++)
        {
            for(let b = 0; b < orders[a].items.length; b++)
            {
                no += parseFloat(orders[a].items[b].actualAmount) //* Number(orders[a].items[b].qty)
            }
        }
    }
    return no;
}
// Commission Functions //
export {
    adminLevel,
    captionWord,
    commissionRate,
    emailinfo,
    formatNumber,
    getFilename,
    Inputcontext,
    isValidURL,
    menuActived,
    truncateText,
    ucfirst,
    unixDate,
    slatDate,
    slatDateTime,
    shortDateTh,
    shortDateTimeTh,
    commionOrders,
    commionType,
    commionsNet,
    salesPrice
}