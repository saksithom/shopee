import React, { useEffect, useRef, useState } from "react"
import { getFacebookProfile } from "../../controllers/apiscontroller"
import { Card, Col, Row } from "react-bootstrap"
import moment from "moment-timezone"
import dayjs from "dayjs"

const Facebookprofile = (data) => {
    const [loaded, setLoaded] = useState(false)
    const [facebook, setFacebook] = useState(null)
    const [instagram, setInstagram] = useState(null)
    const isMounted = useRef(true);
    const [prevdata, setPrevdata] = useState(null)
    useEffect(() => {
        if(JSON.stringify(data) !== JSON.stringify(prevdata)){
            setPrevdata(data)
            init()
        }
        return () => {
            isMounted.current = false
        }
    },[])
    const init = async() => {
        setLoaded(false)
        setupProfile()
        setLoaded(true)
    }

    const setupProfile = () => {
        // console.log('setup profile : ', data.profile)
        const pages = data.page.facebooks.filter(x => x.checked == true)
        const igs = data.page.instagrams.filter(x => x.checked == true)
        const user = data.profile
        const facebookData = {
        //   feeds: item.feeds.data,
          profile: {
            id : user.id,
            name : user.name,
            email : user.email,
            picture : user.picture,
            expire: moment().add(user.data_access_expiration_time, 'second').format('DD MMM YYYY HH:mm')
            // expire: moment.unix(item.debug.data.data_access_expires_at).add(7,'hours').format('DD/MM/YYYY HH:mm')
          },
        //   picture: item.picture.data,
        //   page_picture: item.page_picture,
          pages: pages ?? [],
          instagram: igs ?? []
        }
     //  console.log('facebook data : ', facebookData)
        setFacebook(facebookData)
    }
    return (
        <>
            { loaded ?
            <div className="mb-2">
                <Card className="card-stats">
                    <Card.Header>
                        <Card.Title className="p-2">Facebook Page</Card.Title>
                    </Card.Header>
                        <Card.Body className="pb-4">
                            {facebook.pages?.map((page,fb) => (
                            <Row className="mb-2" key={fb}>
                                <Col xs="3">
                                    <div className="icon-big text-center">
                                        <img src={page.picture} className="w-100 img-thumbnail" />
                                    </div>
                                </Col>
                                <Col xs="9">
                                    <div className="numbers">
                                        <Card.Title as="h4" className="text-primary">{page.name}</Card.Title>
                                        <p className="card-category">Page ID: {page.id}</p>
                                        <p className="card-category">Category: {page.category}</p>
                                    </div>
                                </Col>
                            </Row>
                            ))
                        }
                    </Card.Body>
                </Card>
                {facebook.instagram?.map((instagram,ig) => (
                <Card className="card-stats" key={ig}>
                    <Card.Header>
                        <Card.Title className="p-2">Instagram Page</Card.Title>
                    </Card.Header>
                        <Card.Body className="pb-4">
                            <Row className="mb-2">
                                <Col xs="3">
                                    <div className="icon-big text-center">
                                        <img src={instagram?.picture} className="w-100 img-thumbnail" />
                                    </div>
                                </Col>
                                <Col xs="9">
                                    <div className="numbers">
                                        <Card.Title as="h4" className="text-primary">{instagram.name}</Card.Title>
                                        <p className="card-category">ID: {instagram.id}</p>
                                        <p className="card-category">Username: {instagram.username}</p>
                                    </div>
                                </Col>
                            </Row>
                    </Card.Body>
                </Card>
                ))}
                <Card className="card-stats">
                    <Card.Header>
                        <Card.Title className="p-2">ผู้ใช้ Facebook</Card.Title>
                    </Card.Header>
                    <Card.Body className="pb-4">
                        {facebook.profile &&
                            <Row className="mb-2">
                                <Col xs="3">
                                    <div className="icon-big text-center icon-warning">
                                        <img src={facebook.profile?.picture} className="w-100 image img-thumnuil"></img>
                                    </div>
                                </Col>
                                <Col xs="9">
                                    <div className="numbers">
                                        <Card.Title as="h4" className="text-success">{facebook.profile.name}</Card.Title>
                                        <p className="card-category">ID: {facebook.profile.id}</p>
                                        <p className="card-category">Access Token Expired: <strong className="text-primary">{facebook.profile.expire}</strong></p>
                                    </div>
                                </Col>
                            </Row>
                        }
                    </Card.Body>
                </Card>
            </div>

                : 
                <div className="text-center">Loading....</div>
                }
        </>
    )
}
export default Facebookprofile