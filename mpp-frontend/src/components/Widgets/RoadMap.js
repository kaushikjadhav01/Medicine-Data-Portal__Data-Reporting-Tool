import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import RoadMapItem from "./RoadMapItem";
import {mediaList} from "../../routes/main/Widgets/data"
import CardBox from "components/CardBox/index";

const RoadMap = () => {

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
    <CardBox styleName="gx-card-full" heading={''}>
      <Slider className="gx-slick-slider" {...settings}>
        {mediaList.map((media, index) =>
          <RoadMapItem key={index} data={media}/>
        )
        }
      </Slider>
    </CardBox>
  );
};

export default RoadMap;
