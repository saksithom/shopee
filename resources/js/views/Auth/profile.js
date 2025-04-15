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
  Alert
} from "react-bootstrap";
import { userinfo } from "../../helpers/init_vars";
import { updateProfile } from "../../controllers/authen";

const Profile = () => {
  const [user, setUser] = useState(userinfo)
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name : '',
  })

  const validate = () => {
    let x = 0
    let err = {
        name : '',
    }

    if(!user.name){
      err.name = '* กรุณาป้อนการยืนยันรหัสผ่าน'
      x++
    }

    setErrors(err)
    return x == 0 ? true : false
  }

  const submitProfile = async(e) => {
    e.preventDefault();
    const valid = validate()
 //  console.log('submit login : ', valid)
    if(!valid){
      return false
    }
    const fetcher = await updateProfile({name : user.name})
    if(fetcher.status == 200){
   //  console.log('fetcher result : ', fetcher)
      setSuccess(true)
      setTimeout(() => {
        localStorage.setItem('userinfo',JSON.stringify(fetcher.data.data))
        setSuccess(false)
          // window.location.href="/admin/profile"
      //   // navigate('/admin/profile')
      },1500)
    }

  }
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">User Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form method="post" onSubmit={submitProfile}>
                {success ? 
                <Alert variant="success">
                  {/* <Alert.Heading>ผลการบันทึก</Alert.Heading> */}
                  <p>ทำการอัพเดทข้อมูลเรียบร้อยแล้ว.</p>
                </Alert>
                : null}
                  <Row>
                    <Col className="px-1" md="6">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                          value={user.name}
                          onChange={e => setUser({...user, name : e.target.value})}
                        ></Form.Control>
                            {errors.name ?<div className="text-danger">{errors.name}</div>: null }
                            </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Form.Control
                          placeholder="Email"
                          type="email"
                          disabled
                          defaultValue={user.email}
                        ></Form.Control>
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
    </>
  );
}

export default Profile;
