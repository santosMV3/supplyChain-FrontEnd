import React from "react";
import Loader from "./index";

const LoaderBox = ({...props}) => {
    
    return (<div style={{
        width: '30vw',
        height: '40vh',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "absolute",
        backgroundColor: "#ffffff",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        margin: "20vh auto",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px"
    }}>
        <div style={{
            width: "160px",
            height: "90px",
            
        }}>
            <Loader/>
        </div>
        <div style={{
            fontSize: "1.1em",
            fontFamily: "arial"
        }}>
            {props.message?props.message:"Loading, please wait..."}
        </div>
    </div>)
}

export default LoaderBox;