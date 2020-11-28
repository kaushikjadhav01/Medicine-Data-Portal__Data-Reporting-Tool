import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessages from 'util/IntlMessages';
import { Card, Row, Empty } from 'antd';
import { getPartnerDashboardAction } from '../../../appRedux/actions/PartnerDashboard';
import TemplateTile from 'components/TemplateTile';

import './partner-dashboard.css'
import { getQuarter } from '../../../helpers';

const PartnerDashboard = (props) => {

    const { isLoaded, partnerList } = useSelector(({ partnerDashboard }) => partnerDashboard);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(getPartnerDashboardAction());
    }, [])

    useEffect(() => {
        if (isLoaded) {
            setData(partnerList)
        }
    }, [isLoaded, partnerList])

    return (
        <div>
            <div className='gx-flex-row gx-align-items-center gx-justify-content-between'>
                <h1 className='title gx-mb-4'><IntlMessages id='sidebar.partnerDashboard' /></h1>
            </div>
            {
                data && data.length > 0 ?
                    <Row>
                        {
                            data.map((value, index) => <TemplateTile quarter={getQuarter()} data={value} history={props.history} key={index} />)
                        }
                    </Row>
                    :
                    <Card>
                        <Empty description='No data available!' />
                    </Card>
            }
        </div>
    )
}

export default PartnerDashboard