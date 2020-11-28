import React from "react";
import Widget from "components/Widget";

const Biography = () => {
  return (
    <Widget styleName="gx-card-profile">
      <div className="ant-card-head">
        <span className="ant-card-head-title gx-mb-2">Biography</span>
        <p className="gx-text-grey gx-fs-sm gx-mb-0">A little flash back of Kiley Brown</p>
      </div>
      <h3 className="gx-font-weight-light">Donec dignissim gravida sem, ut cursus dolor hendrerit et. Morbi
        volutpat.</h3>
      <p>Augue mauris dignissim arcu, ut venenatis metus ante eu orci. Donec non maximus neque,
        ut finibus ex. Quisque semper ornare magna, sed ullamcorper risus luctus quis. Etiam tristique
        dui vitae diam rutrum sodales. Mauris feugiat lectus felis, nec ullamcorper risus elementum at.
        Aliquam erat volutpat. Nullam et est eget metus gravida tincidunt.
        Phasellus sed odio eu lacus venenatis.
      </p>
      <p>Suspendisse vel bibendum ex. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        Sed a felis nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In molestie ultricies urna non
        volutpat.
        Nam fermentum cursus elit, et tempus metus scelerisque imperdiet. Sed tincidunt molestie justo,
        a vulputate velit sagittis at. Pellentesque consequat leo tortor.
      </p>

    </Widget>
  )
}


export default Biography;
