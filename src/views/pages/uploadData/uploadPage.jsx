import React from "react";
import "../style.css";
import { UploadCard } from "./components/DuelistUploadCard";

const DuelistUpload = () => {
    return (
        <div id="ContainerPage" className="align-itens-center-row">
            <UploadCard/>
            <UploadCard/>
        </div>
    )
}

export default DuelistUpload;