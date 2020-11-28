import React from "react";
import { Link } from "react-router-dom";
import IntlMessages from "util/IntlMessages";

const Error404 = () => (
    <div className="gx-page-error-container">
        <div className="gx-page-error-content">
            <div className="gx-error-code gx-mb-4">404</div>
            <h2 className="gx-text-center">
                <IntlMessages id="extraPages.404Msg" />
            </h2>
            <p className="gx-text-center">
                <Link className="gx-btn gx-btn-primary" to="/"><IntlMessages id="extraPages.goHome" /></Link>
            </p>
        </div>
    </div>
);

export default Error404;
