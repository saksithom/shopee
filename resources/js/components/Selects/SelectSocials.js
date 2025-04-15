import React, { useEffect, useRef, useState } from 'react';
import { getApi } from '../../controllers/apiscontroller';
import { Form } from 'react-bootstrap';

const SelectSocials = ({onChange, ...data}) => {
    const [selected, setSelected] = useState('')
    const [socials, setSocials] = useState([])
    const [loaded, setLoaded] = useState(false)
    let componentMounted = useRef(true);
    useEffect(() => {
        if(componentMounted.current)
            init()
        return () => {
          componentMounted.current = false;
        }
    },[])

    useEffect(() => {
        if(data.value != selected){
            setSelected(data.value)
        }
        
    },[data.value])


    const init = async() => {
        await fetchSocails()
    }
    const fetchSocails = async() => {
        setLoaded(false)
        const response = await getApi('facebook');
        if (response.status !== 200 || !response.data?.access_code) {
            return setLoaded(true);
        }
        
        const { pages, instagrams } = response.data.access_code;
        setSocials([
            ...pages.filter(x => x.checked).map(p => ({ ...p, type: 'facebook' })),
            ...instagrams.filter(x => x.checked).map(i => ({ ...i, type: 'instagram' }))
        ]);        
        setLoaded(true)
    }
    const setAsSelected = (e) => {
        setSelected(e.target.value)
        const social = socials.find((x => x.id == e.target.value))
        if(social)
            onChange(social)
    }
    return (
        <Form.Group className="mb-2">
            {data.label && (<Form.Label>{data.label}</Form.Label>)}
            <Form.Select 
                className={data.className ?? `${data.disabled ? 'bg-white' : ''}`}
                value={selected} onChange={setAsSelected}
                disabled={data.disabled}
                >
                <option value="">{data.firstoption ?? '- เลือก -'}</option>
                {socials?.map((opt,idx) => (
                    <option value={opt.id} key={`option-${idx}`}>{opt.name} ({opt.type})</option>
                ))}
             </Form.Select>
        </Form.Group>
            
    )
}
export default SelectSocials