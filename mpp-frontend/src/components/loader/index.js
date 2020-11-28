import React from 'react';
import { Spin } from 'antd';
import { useSelector } from "react-redux";
import './loader.css';

const Loader = () => {

    const showLoader = useSelector(state => state.loader.showLoader);
    return (
        <div>
            { showLoader ? (
                <div className="app-loader-wrapper">
                    <div className="app-loader">
                        <Spin size='large' />
                    </div>
                </div>
            ) : null}
        </div>
    )
}


export default Loader;
