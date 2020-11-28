import React from "react";

import Aux from "util/Auxiliary.js"
import WidgetHeader from "components/WidgetHeader/index";


const userImageList = [
  {
    id: 1,
    image: require('assets/images/avatar/alex-dolgove.png'),
    name: 'Alex Johns',
    rating: '5.0',
    deals: '27 Deals'
  },
  {
    id: 2,
    image: require('assets/images/avatar/chelsea-johns.jpg'),
    name: 'Chelsea Johns',
    rating: '4.5',
    deals: '21 Deals'
  },
  {
    id: 3,
    image: require('assets/images/avatar/domnic-brown.png'),
    name: 'Domnic Johns',
    rating: '5.0',
    deals: '27 Deals'
  },
  {
    id: 4,
    image: require('assets/images/avatar/ken-ramirez.jpg'),
    name: 'Ken Ramirez',
    rating: '5.0',
    deals: '27 Deals'
  },
  {
    id: 5,
    image: require('assets/images/avatar/zakie-chain.jpg'),
    name: 'Zakie Chain',
    rating: '5.0',
    deals: '27 Deals'
  },
]


const UserImages = () => {
  return (
    <Aux>
      <WidgetHeader styleName="gx-flex-row" title="Popular Agents" extra={<span>Go to agents list <i
        className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/></span>}/>

      <ul className="gx-agents-list">
        {userImageList.map((user, index) =>
          <li key={index}>
            <div className="gx-profileon gx-pointer">
              <div className="gx-profileon-thumb"><img alt="..." src={user.image} className="gx-rounded-lg"/></div>
              <div className="gx-profileon-content">
                <h5 className="gx-mb-1 gx-text-truncate">{user.name}</h5>
                <p className="gx-mb-0 gx-fs-sm gx-text-truncate"><i
                  className={`icon icon-star gx-text-orange gx-pr-1`}/> {user.rating} <span
                  className="gx-px-sm-1">|</span> {user.deals}
                </p>
              </div>
            </div>
          </li>
        )
        }
      </ul>
      <span className="gx-text-primary gx-fs-md gx-pointer gx-mb-4 gx-d-block gx-d-sm-none">Go to agents list <i
        className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/></span>

    </Aux>
  );
};

export default UserImages;
