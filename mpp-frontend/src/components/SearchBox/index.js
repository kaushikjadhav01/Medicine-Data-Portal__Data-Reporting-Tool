import React from "react";

const SearchBox = ({styleName, placeholder, onChange, value}) => {

  return (
    <div className={`gx-search-bar ${styleName}`}>
      <div className="gx-form-group">
        <input className="ant-input" type="search" placeholder={placeholder} onChange={onChange}
               value={value}/>
        <span className="gx-search-icon gx-pointer"><i className="icon icon-search"/></span>
      </div>
    </div>
  )
};
export default SearchBox;

SearchBox.defaultProps = {
  styleName: "",
  value: "",
};
