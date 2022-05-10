import React from "react";
import { useLottie } from "lottie-react";
import animation from "./processing-animation.json";

export const Loader = () => {
    const options = {
        animationData: animation,
        loop: true,
        autoplay: true,
    }
    
    const { View } = useLottie(options);
    return View;
}

const ProcessBox = ({...props}) => {
    
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
        margin: "25vh auto",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        transition: "0.5s",
        userSelect: "none"
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
            {props.message?props.message:"Processing Excel File, Please wait..."}
        </div>
    </div>)
}

export default ProcessBox;