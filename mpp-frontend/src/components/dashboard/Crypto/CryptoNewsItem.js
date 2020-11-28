import React from "react";


const CryptoNewsItem =({data})=> {
  const {image, title, subTitle, desc} = data;
  return (
    <div className="gx-news-item">
      <div className="gx-news-thumb"><img className="gx-width-175 gx-rounded-lg" src={image} alt="..."/></div>
      <div className="gx-news-content">
        <h4 className="gx-mt-0">{title}</h4>
        <p className="gx-mb-2">{subTitle}</p>
        <div className="gx-news-tags-row">
          <div className="gx-news-tags-left">
            <p className="gx-text-grey gx-mb-0 gx-text-truncate"><i
              className={`icon icon-tag-new gx-fs-lg gx-mr-2 gx-d-inline-flex gx-vertical-align-middle gx-text-light-grey`}/>{desc}
            </p>
          </div>
          <div className="gx-news-tags-right">
            <p className="gx-text-primary gx-pointer gx-mb-0">Ready Full Story
              <i className={`icon icon-long-arrow-right gx-fs-xl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle`}/>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoNewsItem;
