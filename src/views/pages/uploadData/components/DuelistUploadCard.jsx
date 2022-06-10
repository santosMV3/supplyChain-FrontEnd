import React from "react";
import { Button, Progress, UncontrolledTooltip } from "reactstrap";

import "./styles/style-duelist-upload-card.css";

const SheetItem = () => {
    return (
        <div className="duelist-upload-card-sheet-item">
            <input type="radio" id="_id" value="Item" className="duelist-upload-card-sheet-radio"/>
            <label htmlFor="_id" className="duelist-upload-card-sheet-label">
                Item
            </label>                 
        </div>
    )
}

export const UploadCard = () => {
    return (
        <div className="duelist-upload-container-card">
            <div className="duelist-upload-card">
                <label htmlFor="file-seletor" className="duelist-upload-card-label">
                    Upload Button
                    <div className="ni ni-send duelist-upload-card-icon"/>
                </label>
                <div className="duelist-upload-card-title">
                    File Name:
                </div>
                <div className="duelist-upload-card-value" id="teste-excel-target">
                    No excel selected.
                </div>
                <UncontrolledTooltip
                    delay={0}
                    placement="right"
                    target="teste-excel-target"
                >
                     No excel selected
                </UncontrolledTooltip>
                <div className="duelist-upload-card-title">
                    Sheets:
                </div>
                <div className="duelist-upload-card-container-sheets">
                    <div className="duelist-upload-card-group-sheets">
                        <SheetItem/>
                    </div>
                </div>
                <div className="duelist-upload-card-container-progress">
                    <div className="progress-info">
                        <div className="progress-percentage">
                            <span>
                                100%
                            </span>
                        </div>
                    </div>
                    <Progress max="100" value="100" color="success"/>
                </div>
                <input type="file" id="file-seletor" className="duelist-upload-card-input-file" accept=".xlsx, .XLSX, .xls, .XLS"/>
            </div>
            <Button color="primary" type="button">
                Send excel file
            </Button>
        </div>
    )
}