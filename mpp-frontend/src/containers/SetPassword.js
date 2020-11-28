import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { validateToken, setPassword } from '../appRedux/actions/Auth';

import IntlMessages from 'util/IntlMessages';
import { getUserDetails, showMessage } from '../helpers';

const FormItem = Form.Item;

const SetPassword = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (getUserDetails() === '') {
            const token = props.match.params.token
            dispatch(validateToken({ 'token': token }))
        } else {
            showMessage('info', 'Access Denied!');
            props.history.push('/logout')
        }
    }, []);

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = values => {
        const token = props.match.params.token
        dispatch(setPassword({ 'password': values.password, 'token': token }, navigatePostSetPassword()))
    };

    const navigatePostSetPassword = () => {
        props.history.push('/login');
    }

    return (
        <div className='gx-login-container'>
            <div className='gx-login-content'>

                <div className='gx-login-header'>
                    <img src={require('assets/images/logo-white.png')} alt='wieldy' title='wieldy' />
                </div>
                <div className='gx-mb-4'>
                    <h2>Change Password</h2>
                    <p><IntlMessages id='appModule.enterPasswordReset' /></p>
                </div>

                <Form
                    initialValues={{ remember: true }}
                    name='reset-password'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className='gx-signin-form gx-form-row0'>

                    <FormItem
                        rules={[
                            { required: true, message: 'Please input your Password!' },
                            { min: 8, message: <IntlMessages id='error.password_min' /> },
                            { pattern: /^(?=.*\d)(?=.*[a-z]).{8,100}$/, message: <IntlMessages id='error.password_valid' /> }
                        ]}
                        name='password'
                    >
                        <Input.Password placeholder='Password' />
                    </FormItem>

                    <FormItem
                        name='confirm'
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder='Retype New Password' />
                    </FormItem>

                    <FormItem>
                        <Button type='primary' htmlType='submit'>
                            <IntlMessages id='app.userAuth.setPassword' />
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
};

export default SetPassword;
