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
  Col
} from "react-bootstrap";
import { userinfo } from "../helpers/init_vars";

const User = () => {
  const [user, setUser] = useState(userinfo)
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
                <Form>
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

export default User;
