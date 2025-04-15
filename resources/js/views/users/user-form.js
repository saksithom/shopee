import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../../components/Loading/Loading"
import { axiosJson } from "../../helpers/init_vars"
import { fetchUsers, getUsers, storeUsers, updateUsers } from "../../controllers/users"
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import { emailinfo } from "../../helpers/functions"
import ModalAlert from "../../components/Dialogs/Alert"
import Modalconfirm from "../../components/Dialogs/Confirmation"
import { MDBIcon } from "mdb-react-ui-kit"
import { ArrowBack, DoNotDisturb, SaveAlt } from "@mui/icons-material"

const Administratorsform = () => {
    const initError = {
        name : '',
        email : '',
        password : '',
        confirm_password : '',
        level : '',
        active : false
    }
    const [field, setField] = useState({
        name : '',
        email : '',
        password : '',
        confirm_password : '',
        level : '',
        active : ''
    })
    const [user, setUser] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
    const [errors, setErrors] = useState(initError)
    const [loading, setLoading] = useState(true)
    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already'})
    const [modalalert, setModalalert] = useState({ view : false, title : '', message : ''})
    const pr = useParams()
    const navigate = useNavigate()
    let componentMounted = useRef(true);

    useEffect(() => {
        if(componentMounted.current){
            init()
        }

        return () => {
            componentMounted.current = false;
        }
    },[])

    const init = async() => {
     //  console.log('run init')
        setLoading(true)
        await fetchEdit()
        setLoading(false)

    }
    const fetchEdit = async() => {
        if(!pr.id) return false;

        const response = await getUsers(pr.id)
        if(response.status == 200){
         //  console.log('data : ', response.data)
            const userData = response.data.data
            setUser(userData)
            setField({
                ...field,
                name : userData.name,
                email : userData.email,
                level : userData.level,
                active : userData.active == 1 ? true :false
        
            })
        }
    }

    const validMail = async(e) => {
        const email = emailinfo( e.target.value )
        if(!email){
            setModalalert({view:true, title: 'เกิดข้อผิดพลาด', message : 'รูปแบบ E-mail ไม่ถูกต้อง กรุณาตรวจสอบ'})
            setField({...field, email: ''})
            return false
        }
        const existed = await existsMail(e);
        if(!existed) return false;

        setField({...field, email: e.target.value})
    }

    const existsMail = async(e) => {
     //  console.log('exists mail : ', e)
        const pm = `?email=${field.email}`
        const checker = await fetchUsers(pm)
        if(checker.status == 200){
            if(checker.data.data.length > 0){
                setModalalert({view:true, title: 'เกิดข้อผิดพลาด', message : 'E-mail นี้ถูกใช้แล้ว โปรดใช้ E-mail อื่น'})
                setField({...field, email: ''})
                return false
            }
        }

    }

    const togglePasswordVisibility = (type) => {
     //  console.log('click look password : ', type)
        if(type == 'password')
            setShowPassword(!showPassword);
        if(type == 'confirm_password')
            setShowConfirmPassword(!showConfirmPassword);
    };
    const validate = () => {
        let x = 0;
        let errs = initError 
        if(!field.name){
            errs.name = '* ป้อนชื่อ'
            x++
        }
        if(!field.email){
            errs.email = '* ป้อน Email'
            x++
        }
        if(!field.level){
            errs.level = '* เลือก Admin Level'
            x++
        }
        if(!pr.id){
            if(!field.password){
                errs.password = '* ป้อน Password'
                x++
            }
            if(!field.confirm_password){
                errs.confirm_password = '* ป้อน Confirm Password'
                x++
            }
            if(field.password != field.confirm_password){
                errs.confirm_password = '* Password และ Confirm Password ไม่ตรงกัน'
                x++
            }

        }else{
            if(field.password){
                if(!field.confirm_password){
                    errs.confirm_password = '* ป้อน Confirm Password'
                    x++
                }
    
                if(field.password != field.confirm_password){
                    errs.confirm_password = '* Password และ Confirm Password ไม่ตรงกัน'
                    x++
                }
            }
        }
        setErrors(errs)
        return x == 0 ? true : false
    }

    const confirmSubmit = (e) => {
        e.preventDefault();
        const valid = validate()
        if(!valid ) return false

        setModalconfirm({view:true, title: 'ยืนยันการบันทึกข้อมูล', message : 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้',status: 'ready'})
    }
    const handleSubmit = async() => {
        const submitter = await submitUser()
        if(submitter.status == 200 || submitter.status == 201){
            setModalconfirm({...modalconfirm, status : 'success'})
            setTimeout(() => {
                navigate('/admin/users')
            },2000)
        }
    }
    const submitUser = async() => {
        const params = {
            name : field.name,
            email : field.email,
            password: field.password,
            confirm_password : field.confirm_password,
            level : field.level,
            active : field.active ? 1 : 0
        }
        if(pr.id){
            return await updateUsers(pr.id,params)
        }else{
            return await storeUsers(params)
        }
    }
    return (
        <>
        {loading && <Loading/> }
        {!loading ? 
            <>
            <Container fluid>
                <Form method="POST" onSubmit={confirmSubmit}>

                <Card className="strpied-tabled-with-hover px-3 mb-2">
                    <Card.Header>
                        <Card.Title as="h4">Administrator Users</Card.Title>
                            <p className="card-category">Administrator managements</p>
                    </Card.Header>
                    <Card.Body className="table-full-width table-responsive">
                            <Row className="mb-2">
                                <Col md="6">
                                    <Form.Group>
                                        <label>Name : </label>
                                        <input type="text" className="form-control" value={field.name} onChange={e => setField({...field,name : e.target.value})} />
                                        {errors.name ?<div className="text-danger"><small>{errors.name}</small></div>: null }
                                        </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group>
                                        <label>Email : </label>
                                        <input type="text" className="form-control" 
                                            value={field.email} 
                                            onChange={e => setField({...field, email : e.target.value})}
                                            onBlur={validMail}
                                        />
                                        {errors.email ?<div className="text-danger"><small>{errors.email}</small></div>: null }
                                        </Form.Group>
                                </Col>
                                <Col className="px-1" md="4">
                                    <Form.Group>
                                        <label>Password</label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="กรุณาป้อนรหัสผ่าน"
                                                value={field.password}
                                                onChange={e => setField({...field, password : e.target.value })}
                                            />
                                            <InputGroup.Text className="pointer" onClick={() => togglePasswordVisibility('password')}>
                                            {showPassword ? <MDBIcon far icon="eye" /> : <MDBIcon far icon="eye-slash" />}
                                            </InputGroup.Text>
                                        </InputGroup>
                                        {errors.password ?<div className="text-danger"><small>{errors.password}</small></div>: null }
                                    </Form.Group>
                                </Col>
                                <Col className="pl-1" md="4">
                                    <Form.Group>
                                        <label htmlFor="">Confirm Password</label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="กรุณาป้อนรหัสผ่าน"
                                                value={field.confirm_password}
                                                onChange={e => setField({...field, confirm_password :e.target.value})}
                                            />
                                            <InputGroup.Text className="pointer" onClick={() => togglePasswordVisibility('confirm_password')}>
                                            {showConfirmPassword ? <MDBIcon far icon="eye" /> : <MDBIcon far icon="eye-slash" />}
                                            </InputGroup.Text>
                                        </InputGroup>
                                        {errors.confirm_password ?<div className="text-danger"><small>{errors.confirm_password}</small></div>: null }
                                        </Form.Group>
                                </Col>
                                <Col md="2">
                                    <Form.Group>
                                        <label>Level</label>
                                        <Form.Select value={field.level} onChange={e => setField({...field, level : e.target.value})}>
                                            <option>- Select Level -</option>
                                            <option value="super-admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                        </Form.Select>
                                        {errors.level ?<div className="text-danger"><small>{errors.level}</small></div>: null }
                                        </Form.Group>
                                </Col>
                                <Col md="2">
                                    <Form.Group>
                                        <label>Active</label>
                                        <Form.Check // prettier-ignore
                                            className="mt-2"
                                            type="switch"
                                            id="custom-switch"
                                            // label="Check this switch"
                                            checked={field.active}
                                            onChange={e => setField({...field, active : e.target.checked})}
                                        />
                                        {errors.active ?<div className="text-danger">{errors.active}</div>: null }
                                        </Form.Group>
                                </Col>
                            </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="text-end">
                        <Button variant="secondary" className="me-2" onClick={() => navigate('/admin/users')}><DoNotDisturb /> Cancel</Button>
                        <Button variant="primary"  type="submit" ><SaveAlt /> Save</Button>
                    </Card.Body>
                </Card>
                </Form>

            </Container>
            <ModalAlert show={modalalert.view} onHide={() => setModalalert({...modalalert,view:false})} title={modalalert.title} message={modalalert.message} />
            <Modalconfirm show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        onSubmit={handleSubmit}

            />
            </>
        : null }
        </>
    )

}
export default Administratorsform