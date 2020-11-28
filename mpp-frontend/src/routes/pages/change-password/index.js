import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import IntlMessages from 'util/IntlMessages';
import { useDispatch, useSelector } from 'react-redux';
import { resetChangePassword, userChangePassword } from '../../../appRedux/actions'

const FormItem = Form.Item;


const ChangePassword = (props) => {

    const { changePasswordSuccess } = useSelector(({ authentication }) => authentication);
    const dispatch = useDispatch();


    useEffect(() => {
        if (changePasswordSuccess) {
            props.history.push('/logout')
            dispatch(resetChangePassword())
        }
    }, [changePasswordSuccess])

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = values => {
        dispatch(userChangePassword(values))
    };

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
                            <IntlMessages id='app.userAuth.resetPassword' />
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;
