import { Card, Col, Container, Row } from "react-bootstrap"

const PolicyPage = () => {
    return (
        <div className="container py-5">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h1 className="card-title text-center text-primary mb-4">
                        นโยบายความเป็นส่วนตัว
                    </h1>      
                        <p className="card-text">
                            เว็บไซต์ของเรามุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของผู้ใช้งานทุกคน 
                            และเพื่อให้ท่านเข้าใจถึงวิธีการจัดการข้อมูล เราขอชี้แจงรายละเอียดดังต่อไปนี้:
                        </p>

                        <h2 className="text-secondary mt-4">การเก็บรวบรวมข้อมูล</h2>
                        <p>
                            เราเก็บรวบรวมข้อมูลต่อไปนี้จากผู้ใช้งาน:
                        </p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">ข้อมูลการเข้าสู่ระบบ Facebook Page เช่น ชื่อเพจ และรหัส Page ID</li>
                            <li className="list-group-item">ข้อมูลที่เกี่ยวข้องกับการจัดการเพจ เช่น โพสต์และสถิติ</li>
                            <li className="list-group-item">ข้อมูลที่จำเป็นเพื่อการยืนยันตัวตนผ่านระบบล็อกอิน</li>
                        </ul>

                        <h2 className="text-secondary mt-4">การใช้ข้อมูล</h2>
                        <p>
                            ข้อมูลที่เรารวบรวมจะถูกนำไปใช้เพื่อวัตถุประสงค์ดังนี้:
                        </p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">ให้บริการการจัดการ Facebook Page ส่วนตัว</li>
                            <li className="list-group-item">ปรับปรุงการใช้งานระบบให้มีประสิทธิภาพ</li>
                            <li className="list-group-item">วิเคราะห์ข้อมูลเพื่อพัฒนาบริการ</li>
                        </ul>

                        <h2 className="text-secondary mt-4">การปกป้องข้อมูล</h2>
                        <p>
                            เรามีมาตรการปกป้องข้อมูลส่วนตัวของคุณด้วยเทคโนโลยีที่ทันสมัย 
                            และจำกัดการเข้าถึงข้อมูลเฉพาะผู้ที่ได้รับอนุญาตเท่านั้น
                        </p>

                        <h2 className="text-secondary mt-4">การแชร์ข้อมูลกับบุคคลที่สาม</h2>
                        <p>
                            เราจะไม่เปิดเผยหรือแชร์ข้อมูลของคุณกับบุคคลที่สาม 
                            ยกเว้นในกรณีที่จำเป็นตามกฎหมายหรือเพื่อปฏิบัติตามข้อกำหนดของระบบ
                        </p>

                        <h2 className="text-secondary mt-4">การจัดเก็บข้อมูล</h2>
                        <p>
                            ข้อมูลของคุณจะถูกจัดเก็บอย่างปลอดภัยและจะไม่ถูกเก็บไว้นานเกินความจำเป็น 
                            เพื่อวัตถุประสงค์ที่ได้ระบุไว้ในนโยบายนี้
                        </p>

                        <h2 className="text-secondary mt-4">สิทธิของคุณ</h2>
                        <p>
                            คุณมีสิทธิที่จะเข้าถึงข้อมูลของคุณ ขอแก้ไข หรือขอให้ลบข้อมูลได้ตลอดเวลา 
                            โดยสามารถติดต่อเราได้ผ่านช่องทางที่ระบุไว้
                        </p>

                        <h2 className="text-secondary mt-4">การเปลี่ยนแปลงนโยบาย</h2>
                        <p>
                            เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวตามความเหมาะสม 
                            โดยจะแจ้งให้ทราบผ่านเว็บไซต์ของเรา
                        </p>

                        <h2 className="text-secondary mt-4">ติดต่อเรา</h2>
                        <p>
                            หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว 
                            กรุณาติดต่อเราที่{" "}
                            <a href="mailto:nong.wasantasiri@gmail.com" className="text-primary">
                            nong.wasantasiri@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
    )
}
export default PolicyPage