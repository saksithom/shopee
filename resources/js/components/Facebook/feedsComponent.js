import { CalendarMonthRounded } from '@mui/icons-material';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Facebookfeeds = (data) => {
    const TextWithNewline = (text) => {
        const strings = String(text).split(`\n`)
        return (
          <div>
            {strings?.map((line, index) => (
              <p key={index} className='m-0'>{line}</p>
            ))}
          </div>
        );
      };
  return (
    <>
    {data.feed ? 
    <Card className="card-stats">
        <Card.Body>
          
            <Row>
                <Col md={2} lg={2} sm={4}>
                <Link to={`https://www.facebook.com/${data.feed?.id}`} target='_blank'>
                    <Image src={data.feed?.full_picture} thumbnail fluid />
                    </Link>
                </Col>
                <Col md={10} lg={10} sm={8}>
                    <div className={{ whiteSpace:"pre-line"}}>
                      <Link to={`https://www.facebook.com/${data.feed?.id}`} target='_blank' className='text-dark'>
                        {TextWithNewline(data.feed?.message)}
                      </Link>
                    </div> 
                </Col>
            </Row>
        </Card.Body>
        <Card.Footer>
            <hr />
            <div className="stats">
                <CalendarMonthRounded />
                โพสเมื่อ : { moment(data.feed.created_time,'YYYY-MM-DD HH:mm').add(7, 'hours').format('DD/MM/YYYY HH:mm')}
            </div>
        </Card.Footer>
    </Card>
    : null }
    </>
  );
};

export default Facebookfeeds;
