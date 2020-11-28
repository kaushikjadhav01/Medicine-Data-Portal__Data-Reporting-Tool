import React, {useState} from "react";
import {Radio} from "antd";

import Widget from "components/Widget/index";
import {albama, colorado, newJersy, popularList} from "../../../routes/main/dashboard/Listing/data"
import CircularProgress from "components/CircularProgress";
import PropertiesItemCard from "./PropertiesItemCard";


const popularData = [popularList, newJersy, colorado, albama];

const PropertiesCard = () => {

  const [popular, setPopular] = useState(popularData[0]);
  const [loader, setLoader] = useState(false);


  const handleChange = (e) => {
    const value = e.target.value;
    setPopular(popularData[value]);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  };

    return (
      <Widget>
        <div className="ant-row-flex gx-justify-content-between gx-mb-3 gx-mb-sm-4 gx-dash-search">
          <h2 className="h4 gx-mb-3 gx-mb-sm-1 gx-mr-2">Properties</h2>
          <div className="gx-mx-sm-2">
            <Radio.Group className="gx-radio-group-link gx-radio-group-link-bg-light" defaultValue={0}
                         onChange={handleChange}>
              <Radio.Button value={0} className="gx-mb-2">Popular</Radio.Button>
              <Radio.Button value={1} className="gx-mb-2">New Jersy</Radio.Button>
              <Radio.Button value={2} className="gx-mb-2">Colorado</Radio.Button>
              <Radio.Button value={3} className="gx-mb-2">Albama</Radio.Button>
            </Radio.Group>
          </div>
          <span className="gx-ml-2 gx-search-icon"><i
            className="icon icon-search-new gx-pointer gx-text-primary gx-fs-xxl"/></span>
        </div>

        {loader ? <CircularProgress className="gx-loader-400"/> : popular.map((data, index) =>
          <PropertiesItemCard key={index} data={data}/>
        )}

      </Widget>
    );
};

export default PropertiesCard;
