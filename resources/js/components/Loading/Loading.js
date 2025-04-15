import React from 'react';
import loadingIcon from '../../assets/img/loading-sm.gif';

const Loading = () => {
    return (
        <>
        <div className='box-in-loading'>
            <img src={loadingIcon} style={{ height: "20px" }} />
            <div className='font-14 mt-3'>Loading...</div>
        </div>
        </>
    )
}
export default Loading