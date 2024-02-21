import React from "react";
import NotificationAlert from "react-notification-alert";

export const showNotify = (notifyRef, title, message, type="primary") => {

    const options = {
        place: "tc",
        message: (
            <div className="alert-text">
                <span className="alert-title" data-notify="title">
                    {" "}
                    {title}
                </span>
                <span data-notify="message">
                    {message}
                </span>
            </div>
        ),
        type: type,
        icon: "ni ni-bell-55",
        autoDismiss: 7,
    };

    notifyRef.current.notificationAlert(options);
};

const NotifyComponent = (props) => {
    const { notifyRef } = props;

    return (
        <div className="rna-wrapper">
            <NotificationAlert ref={notifyRef} />
        </div>
    )
}

export default NotifyComponent;