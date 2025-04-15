import React, { useEffect } from 'react';

const Facebooklogin = () => {
  useEffect(() => {
    // ตรวจสอบว่ามี Facebook SDK อยู่หรือไม่
    if (!window.FB) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v21.0&appId=1260809745260274';
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: '1260809745260274',
            xfbml: true,
            version: 'v21.0',
          });
        }
      };
      document.body.appendChild(script);
    } else {
      // รีเฟรช XFBML หาก SDK ถูกโหลดแล้ว
      window.FB.XFBML.parse();
    }
  }, []); // useEffect ที่ทำงานเพียงครั้งเดียวหลังจาก mount

  return (
    <div>
      {/* กำหนดพื้นที่สำหรับ Facebook Plugins */}
      <div id="fb-root"></div>
      {/* ตัวอย่างการแสดงปุ่มแชร์ */}
      <div
        className="fb-share-button"
        data-href="https://example.com" // ใส่ URL ที่คุณต้องการแชร์
        data-layout="button"
        data-size="large"
      ></div>
    </div>
  );
};

export default Facebooklogin;
