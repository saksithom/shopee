import React from "react";

const TermsOfService = () => {
  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-center text-primary mb-4">
            ข้อกำหนดการให้บริการ
          </h1>
          <p className="card-text">
            ขอบคุณที่เลือกใช้บริการของเรา กรุณาอ่านข้อกำหนดการให้บริการนี้อย่างละเอียด 
            การใช้งานเว็บไซต์และระบบของเราถือว่าคุณได้ยอมรับเงื่อนไขทั้งหมดดังต่อไปนี้:
          </p>

          <h2 className="text-secondary mt-4">1. การยอมรับเงื่อนไข</h2>
          <p>
            การใช้งานเว็บไซต์ของเราถือว่าคุณได้ยอมรับข้อกำหนดทั้งหมดที่ระบุไว้ในเอกสารนี้ 
            หากคุณไม่ยอมรับข้อกำหนด คุณควรหยุดการใช้งานระบบทันที
          </p>

          <h2 className="text-secondary mt-4">2. การใช้งานระบบ</h2>
          <p>
            คุณสามารถใช้งานระบบได้หลังจากล็อกอินเข้าสู่ระบบผ่านบัญชี Facebook 
            โดยการใช้งานระบบของเราต้อง:
          </p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">ไม่ใช้ระบบเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
            <li className="list-group-item">ไม่ละเมิดสิทธิ์ของผู้อื่น</li>
            <li className="list-group-item">ไม่ทำให้ระบบเสียหายหรือใช้งานผิดวัตถุประสงค์</li>
          </ul>

          <h2 className="text-secondary mt-4">3. การเก็บรักษาข้อมูล</h2>
          <p>
            เราเก็บรักษาข้อมูลของคุณตามที่ระบุในนโยบายความเป็นส่วนตัว 
            โปรดตรวจสอบนโยบายดังกล่าวเพื่อดูรายละเอียดเพิ่มเติม
          </p>

          <h2 className="text-secondary mt-4">4. การเปลี่ยนแปลงข้อกำหนด</h2>
          <p>
            เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดการให้บริการนี้ 
            โดยไม่ต้องแจ้งให้ทราบล่วงหน้า การเปลี่ยนแปลงจะมีผลทันทีที่ประกาศในเว็บไซต์
          </p>

          <h2 className="text-secondary mt-4">5. การระงับการใช้งาน</h2>
          <p>
            เราขอสงวนสิทธิ์ในการระงับหรือยุติการใช้งานของคุณ หากตรวจพบการละเมิดข้อกำหนด 
            หรือการกระทำที่ไม่เหมาะสมต่อระบบ
          </p>

          <h2 className="text-secondary mt-4">6. การจำกัดความรับผิดชอบ</h2>
          <p>
            เราจะไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดขึ้นจากการใช้งานระบบ 
            รวมถึงความเสียหายทางตรงหรือทางอ้อม
          </p>

          <h2 className="text-secondary mt-4">7. การติดต่อ</h2>
          <p>
            หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับข้อกำหนดการให้บริการ 
            กรุณาติดต่อเราที่ 
            <a href="mailto:nong.wasantasiri@gmail.com" className="text-primary">nong.wasantasiri@gmail.com</a>          
        </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
