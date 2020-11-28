import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { projectCount } from '../../../../../appRedux/actions/AdminDashboard'
import { Row, Col, Empty, Card } from 'antd';
import DashboardCountProjects from 'components/dashboardCountProjects/DashboardCountProjects';
import Widget from 'components/Widget/index';

import './project-count.css'


export const AdminDashboardProjectCount = (props) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const isProjectCountLoaded = useSelector(state => state.adminDashboard.isProjectCountLoaded);
    const projectCountList = useSelector(state => state.adminDashboard.project_count)

    useEffect(() => {
        dispatch(projectCount())
    }, [])

    useEffect(() => {
        let rowData = projectCountList.length ? projectCountList.map(
            (value, index) => ({
                key: index,
                status: value.status,
                count: value.count
            })
        ) : [];
        setData(rowData)
    }, [isProjectCountLoaded])

    return (
        <Col span={24}>
            <Widget>
                <h3 className='mb-20'>Project Wise Count</h3>
                {
                    data && data.length > 0 ?
                        <Row className='project-count-row'>
                            {
                                data.map((value, index) =>
                                    <Col xs={4}>
                                        <DashboardCountProjects data={value} key={index} />
                                    </Col>
                                )
                            }
                        </Row> :
                        <Card>
                            <Empty description='No data available!' />
                        </Card>
                }

            </Widget>
        </Col>
    )
}
