import React, {useState} from "react";
import {Col, Row} from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {greenStepList} from "../../routes/main/Widgets/data"
import GreenStepItem from "./GreenStepItem";
import Widget from "components/Widget/index";

const GreenStepCard = () => {

  const [image, setImage] = useState(greenStepList[0].image);
  const [loading, setLoading] = useState(false);

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    marginLeft: 10,
    marginRight: 10,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <Widget styleName="gx-card-full">
      <Row>
        <Col xl={12} lg={12} md={12} sm={12} xs={24}>
          <div className="gx-slick-slider-lt-thumb"><img
            className={loading ? 'fadeout gx-img-fluid' : 'fadein gx-img-fluid'} src={image}
            alt="..."/></div>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={24}>
          <Slider className="gx-slick-slider gx-slick-slider-dot-top" {...settings}
                  afterChange={(index) => {
                    setLoading(false);
                    setImage(greenStepList[index].image);
                  }}
                  beforeChange={(oldIndex, newIndex) => {
                    setLoading(true)
                  }}>
            {greenStepList.map((data, index) =>
              <GreenStepItem key={index} data={data}/>)
            }
          </Slider>
        </Col>
      </Row>
    </Widget>
  );
};

export default GreenStepCard;
