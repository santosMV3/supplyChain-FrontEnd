import React from "react"
import './assets/unauthorized.css';
import AnimationUnauthorizedBox from "views/pages/components/custom/animationBox/unauthorizedBox";

const Unauthorized = () => {
    return (
        <>
            <div id="component-body">
                <AnimationUnauthorizedBox message="Unauthorized access to this page."/>
            </div>
        </>
    )
}

export default Unauthorized;