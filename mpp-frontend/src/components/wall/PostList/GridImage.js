import React from "react";

const GridImage = (props) => {

  const handleCancel = () => {
    props.handleToggle();
  };

    const {mediaList} = props;
    switch (mediaList.length) {
      case 1:
        return <div className="gx-gallery-item" onClick={handleCancel}>
          <img className="gx-img-fluid" src={mediaList[0].image} alt="post"/>
        </div>;
      case 2:
        return <div className="gx-gallery-grid gx-gallery-2" onClick={handleCancel}>
          <div className="gx-gallery-item">
            <img className="gx-img-fluid" src={mediaList[0].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img className="gx-img-fluid" src={mediaList[1].image} alt="post"/>
          </div>
        </div>;
      case 3:
        return <div className="gx-gallery-grid gx-gallery-3" onClick={handleCancel}>
          <div className="gx-gallery-item">
            <img className="gx-img-fluid" src={mediaList[0].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img className="gx-img-fluid" src={mediaList[1].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img className="gx-img-fluid" src={mediaList[2].image} alt="post"/>
          </div>
        </div>;
      case 4:
        return <div className="gx-gallery-grid gx-gallery-4" onClick={handleCancel}>
          <div className="gx-gallery-item">
            <img src={mediaList[0].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img src={mediaList[1].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img src={mediaList[2].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img src={mediaList[3].image} alt="post"/>
          </div>
        </div>;
      default:
        return <div className="gx-gallery-grid gx-gallery-4-more" onClick={handleCancel}>
          <div className="gx-gallery-item">
            <img src={mediaList[0].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img src={mediaList[1].image} alt="post"/>
          </div>
          <div className="gx-gallery-item thumb">
            <img src={mediaList[2].image} alt="post"/>
          </div>
          <div className="gx-gallery-item">
            <img src={mediaList[3].image} alt="post"/>
            <div className="gx-gallery-item-content">
              <h1 className="gx-text-white">+ {mediaList.length - 3}</h1>
            </div>
          </div>
        </div>
    }
};

export default GridImage;
