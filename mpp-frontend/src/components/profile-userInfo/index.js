import React from 'react';
import { Col, Row } from 'antd';
import Widget from 'components/Widget';
import AboutItem from './AboutItem';

const About = (props) => {

  return (
    <Widget title='Profile' styleName='gx-card-tabs gx-card-tabs-right gx-card-profile'>
      <div className='gx-mb-2'>
        <Row>
          {props.aboutList.map((about, index) =>
            <Col key={index} xl={8} lg={12} md={12} sm={12} xs={24}>
              <AboutItem data={about} />
            </Col>
          )}
        </Row>
      </div>
    </Widget>
  );
}


export default About;
