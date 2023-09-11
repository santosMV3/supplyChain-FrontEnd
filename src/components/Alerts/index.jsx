import React from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";

export const SuccessAlert = (props) => {
    const { setalert, message, title } = props;

    return (
        <ReactBSAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title={ title ? title : "Success" }
            onConfirm={() => setalert(null)}
            onCancel={() => setalert(null)}
            confirmBtnBsStyle="success"
            confirmBtnText="Ok"
            btnSize=""
        >
            {message}
        </ReactBSAlert>
    )
};

export const ErrorAlert = (props) => {
    const { setalert, message, title } = props;

    return (
        <ReactBSAlert
            danger
            style={{ display: "block", marginTop: "-100px" }}
            title={ title ? title : "Error" }
            onConfirm={() => setalert(null)}
            onCancel={() => setalert(null)}
            confirmBtnBsStyle="danger"
            confirmBtnText="Ok"
            btnSize=""
        >
            {message}
        </ReactBSAlert>
    )
};