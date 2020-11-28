import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../appRedux/actions/Auth";

const Logout = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userLogout());
        props.history.push('/login')
    })

    return (
        <></>
    )

}

export default Logout;
