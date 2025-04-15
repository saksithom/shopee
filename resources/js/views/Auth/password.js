import React, { useState } from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  InputGroup,
  Popover,
  Alert
} from "react-bootstrap";
import { MDBIcon } from 'mdb-react-ui-kit';
import { userinfo } from "../../helpers/init_vars";
import { updatePassword } from "../../controllers/authen";
import { useNavigate } from "react-router-dom";

const Changepassword = () => {
  const [user, setUser] = useState(userinfo)
  const [password, setPassword] = useState('')
  const [confirm_password, setContrim_password] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    password : '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const togglePasswordVisibility = (type) => {
 //  console.log('click look password : ', type)
    if(type == 'password')
        setShowPassword(!showPassword);
    if(type == 'confirm_password')
        setShowConfirmPassword(!showConfirmPassword);
  };
  const validate = () => {
    let x = 0
    let err = {
        password : '',
        confirmPassword : '',
    }

    if(!confirm_password){
      err.confirmPassword = '* กรุณาป้อนการยืนยันรหัสผ่าน'
      x++
    }
    if(!password){
        err.password = '* กรุณาป้อนรหัสผ่าน'
        x++
    } 
    if(password != confirm_password){
      err.confirmPassword = '* ยืนยันรหัสผ่านไม่ตรงกัน'
      x++
    }
    setErrors(err)
    return x == 0 ? true : false
  }

  const submitPassword = async(e) => {
    e.preventDefault();
    const valid = validate()
 //  console.log('submit login : ', valid)
    if(!valid){
      return false
    }
    const fetcher = await updatePassword({password : password})
    if(fetcher.status == 200){
      setSuccess(true)
      setTimeout(() => {
        setPassword('')
        setContrim_password('')
        setSuccess(false)
        navigate('/admin/profile')
      },1500)
    }

  }
  return (
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Change Password</Card.Title>
              </Card.Header>
              <Card.Body>
                {success ? 
                <Alert variant="success">
                  {/* <Alert.Heading>ผลการบันทึก</Alert.Heading> */}
                  <p>ทำการเปลี่ยนรหัสเรียบร้อยแล้ว.</p>
                </Alert>
                : null}
                <Form method="post" onSubmit={submitPassword}>
                  <Row>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <div className="form-control">{user.email}</div>
                          
                      </Form.Group>
                    </Col>
                    </Row>
                    <Row>

                    <Col className="px-1" md="4">
                        <Form.Group>
                            <label>Password</label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="กรุณาป้อนรหัสผ่าน"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputGroup.Text className="pointer" onClick={() => togglePasswordVisibility('password')}>
                                  {showPassword ? <MDBIcon far icon="eye" /> : <MDBIcon far icon="eye-slash" />}
                                </InputGroup.Text>
                            </InputGroup>
                            {errors.password ?<div className="text-danger">{errors.password}</div>: null }
                        </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Confirm Password
                        </label>
                        <InputGroup>
                                <Form.Control
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="กรุณาป้อนรหัสผ่าน"
                                    value={confirm_password}
                                    onChange={(e) => setContrim_password(e.target.value)}
                                />
                                <InputGroup.Text className="pointer" onClick={() => togglePasswordVisibility('confirm_password')}>
                                  {showConfirmPassword ? <MDBIcon far icon="eye" /> : <MDBIcon far icon="eye-slash" />}
                                </InputGroup.Text>
                            </InputGroup>
                            {errors.confirmPassword ?<div className="text-danger">{errors.confirmPassword}</div>: null }
                            </Form.Group>
                    </Col>
                    <Col className="pl-1" md="2">
                      <label htmlFor="" className="block w-100 mb-2">&nbsp;</label>
                      <Button
                        className="btn-fill pull-right"
                        type="submit"
                        variant="info"
                      >
                        Update
                      </Button>
                    </Col>
                  </Row>
                  
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
  );
}

export default Changepassword;
