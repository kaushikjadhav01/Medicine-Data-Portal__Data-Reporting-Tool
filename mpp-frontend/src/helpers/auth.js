import React, { useState, useEffect } from "react";

const Auth = (WrappedComponent, Roles) => {

    const AuthCheck = (props) => {
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            let collectData = [];
            let user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const userRole = user.role;
                collectData = Roles.filter(data => userRole === data);
                if (collectData.length) {
                    setIsAuthorized(true)
                }
            } else {
                props.history.push('/login');
            }
        }, [])

        if (isAuthorized) {
            return <WrappedComponent {...props} />;
        } else {
            return <div>YOU ARE NOT AUTHORIZED TO USE THE PAGE</div>;
        }
    }
    return AuthCheck;
};

export { Auth };
