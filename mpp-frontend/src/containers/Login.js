import React, { useEffect } from 'react';
import { Button, Form, Input, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogin } from '../appRedux/actions/Auth';
import { roleConstants } from '../constants'

import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined';
import IntlMessages from 'util/IntlMessages';

const FormItem = Form.Item;

const Login = (props) => {

  const isLoggedIn = useSelector(state => state.authentication.isUserLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    navigatePostLogin()
  }, [isLoggedIn])

  const navigatePostLogin = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === roleConstants.ADMIN || user.role === roleConstants.STAFF) {
        props.history.push('/admin/dashboard');
      } else {
        props.history.push('/partner/dashboard');
      }
    } else {
      props.history.push('/login');
    }
  }

  const onFinish = values => {
    dispatch(userLogin({
      email: values.email.trim().toLowerCase(),
      password: values.password.trim()
    }, navigatePostLogin()))
  };

  return (
    <div className='gx-login-container'>
    <a href="http://ec2-3-91-83-56.compute-1.amazonaws.com:8000/api/swagger"><button type='button' className='btn' style={{position: 'absolute', right:20, top:20, color: 'white', background: 'green'}}>Swagger Link</button></a>
      <div className='gx-login-content'>
        <div className='gx-login-header gx-text-center'>
          <img className='mb-30' src={require('assets/images/logo-white.png')} alt='mpp' title='mpp' />
          <p><IntlMessages id="app.userAuth.welcome" /></p>
          <h1 className='gx-login-title'>Login</h1>
        </div>
        <Form
          name='login'
          onFinish={onFinish}
          className='gx-signin-form gx-form-row0'>
          <FormItem
            rules={[
              { required: true, message: <IntlMessages id='error.email_required' /> },
              { type: 'email', message: <IntlMessages id='error.email_valid' /> }
            ]}
            name='email'
          >
            <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='admin@mdp.com or partner@mdp.com' />
          </FormItem>
          <FormItem rules={[{ required: true, message: <IntlMessages id='error.password_required' /> }]} name='password'>
            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Demopass@123' />
          </FormItem>
          <div className='gx-flex-row align-items-baseline'>
            <FormItem name='remember' valuePropName='checked'>
              <Checkbox>Remember me</Checkbox>
            </FormItem>
            <Link className='gx-login-form-forgot gx-ml-auto float-right' to='/reset-password'><IntlMessages id='app.userAuth.forgotPassword' /></Link>
          </div>
          <FormItem className='gx-text-center'>
            <Button id='app-btn-login' className='gx-img-fluid-full' type='primary' htmlType='submit'>
              <IntlMessages id='app.userAuth.login' />
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default Login;
