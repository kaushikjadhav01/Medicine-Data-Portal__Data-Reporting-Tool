import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";

import IntlMessages from "util/IntlMessages";
import { authConstants } from "../constants";
import { userForgetPassword } from "../appRedux/actions/Auth";
import { getUserDetails, showMessage } from '../helpers';


const FormItem = Form.Item;

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const { isMailSend } = useSelector(({ authentication }) => authentication);
  const [isResetToken, setIsResetToken] = useState(false)

  useEffect(() => {

    if (getUserDetails() !== '') {
      showMessage('info', 'Access Denied!');
      props.history.push('/logout')
    }

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('token') === 'true') {
      setIsResetToken(true)
    }

    return () => {
      dispatch({ type: authConstants.FORGOT_PASSWORD_REQUEST });
    }
  }, [])

  useEffect(() => {
    if (isMailSend) {
      props.history.push('/login')
    }
  }, [isMailSend])

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    dispatch(userForgetPassword({
      email: values.email.trim().toLowerCase()
    }))
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header">
          <img src={require("assets/images/logo-white.png")} alt="mpp" title="mpp" />
        </div>
        <div className="gx-mb-4">
          <h2>{isResetToken ? 'Resend set password link' : 'Forgot Your Password ?'}</h2>
          <p>{isResetToken ? 'Enter below the registered e-mail id' : <IntlMessages id="app.userAuth.forgot" />}</p>
        </div>

        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="gx-signin-form gx-form-row0">
          <FormItem name="email" rules={[{ required: true, message: 'Please input your E-mail!' }, { type: 'email', message: <IntlMessages id='error.email_valid' /> }]}>
            <Input className='gx-input-lineheight' type="email" placeholder="E-Mail Address" />
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.userAuth.send" />
            </Button>
          </FormItem>
        </Form>

      </div>
    </div>
  );
};

export default ResetPassword;
