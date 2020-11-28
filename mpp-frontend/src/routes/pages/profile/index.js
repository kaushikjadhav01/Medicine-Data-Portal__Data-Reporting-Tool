import React, { useEffect, useState } from 'react';
import { Avatar, Table, Row, Col, Button, Tooltip } from 'antd';
import About from 'components/profile-userInfo'
import { getRole, getUserDetails, getUserInfo } from '../../../helpers';


const UserProfilePage = (props) => {

    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        setIsUserAdmin(getRole() === 'ADMIN')
        setUserDetails(getUserInfo())
    }, [])

    const setInfoList = () => {
        if (isUserAdmin) {
            return [
                {
                    id: 1,
                    title: 'User Name',
                    icon: 'user-o',
                    userList: '',
                    descClass: 'gx-text-capitalize',
                    desc: [userDetails.name]
                },
                {
                    id: 2,
                    title: 'email',
                    icon: 'email',
                    userList: '',
                    descClass: '',
                    desc: [userDetails.email]
                }
            ]
        } else {
            return [
                {
                    id: 1,
                    title: 'Company Name',
                    icon: 'company',
                    userList: '',
                    descClass: 'gx-text-capitalize',
                    desc: [userDetails.company_name]
                },
                {
                    id: 2,
                    title: 'email',
                    icon: 'email',
                    userList: '',
                    descClass: '',
                    desc: [userDetails.email]
                },
                {
                    id: 2,
                    title: 'Contact Number',
                    icon: 'phone',
                    descClass: '',
                    userList: '',
                    desc: [userDetails.contact_number]
                },
                {
                    id: 3,
                    title: 'Region',
                    icon: 'map-google',
                    userList: '',
                    descClass: 'gx-text-capitalize',
                    desc: [userDetails.region]
                },
                {
                    id: 4,
                    title: 'Address',
                    icon: 'home',
                    userList: '',
                    descClass: 'gx-text-capitalize',
                    desc: [userDetails.address ? userDetails.address : '---']
                }
            ]
        }

    }

    return (
        <div className="gx-profile-content">
            <Row>
                <Col span={24}>
                    <About aboutList={setInfoList()} />
                </Col>
            </Row>
        </div >
    )
}

export default UserProfilePage
