import { readFile } from "@ramonak/react-excel";
import React, { useState } from "react";
import { Button, Progress, UncontrolledTooltip } from "reactstrap";

import "./styles/style-duelist-upload-card.css";

export const UploadCard = (props) => {
    const { identity, endpoint } = props;

    const [ fileData, setFileData ] = useState(null);
    const [ excelData, setExcelData ] = useState(null);
    const [ sheetName, setSheetName ] = useState(null);

    const handlerInputFile = (e) => {
        if(e.target.files.length > 0){
            const file = e.target.files[0];
            file.format = file.name.split('.');
            setFileData({[identity]: file});

            readFile(file)
            .then((data) => {
                console.log(data);
                setExcelData({
                    [identity]: {
                        sheets: data.SheetNames,
                    }
                });
            })
            .catch(console.error);
        }
    }

    const handlerInputRadio = (e) => {
        if(e.target.checked){
            setSheetName({[identity]: e.target.value});
        }
    }

    const sendExcelFile = (e) => {
        e.target.disabled = true;
        
        if(!fileData) window.alert("Please, select a excel file to upload.");
        else if(!sheetName) window.alert("Please, select a sheet to read.");

        e.target.disabled = false;
    }

    return (
        <div className="duelist-upload-container-card">
            <div className="duelist-upload-card">
                <label htmlFor="file-seletor" className="duelist-upload-card-label">
                    Upload {identity.toUpperCase()}
                    <div className="ni ni-send duelist-upload-card-icon"/>
                </label>
                <div className="duelist-upload-card-title">
                    File Name:
                </div>
                <div className="duelist-upload-card-value" id={`${identity}-file-target`}>
                    {fileData?(
                        <>
                            {fileData[`${identity}`].format[0]}&nbsp;
                            <div className="duelist-upload-card-file-format">
                                {fileData[`${identity}`].format[1]}
                            </div>
                        </>
                    ):"No excel selected."}
                </div>
                <UncontrolledTooltip
                    delay={0}
                    placement="right"
                    target={`${identity}-file-target`}
                >
                    {fileData?fileData.format[0]:"No excel selected."}
                </UncontrolledTooltip>
                <div className="duelist-upload-card-title">
                    Sheets:
                </div>
                <div className="duelist-upload-card-container-sheets">
                    <div className="duelist-upload-card-group-sheets">
                        {excelData?excelData[`${identity}`].sheets.map((sheet, index) => (
                            <div key={`${identity}-sheet-name-${index}`} className="duelist-upload-card-sheet-item">
                                <input type="radio" onChange={handlerInputRadio} id={`${identity}-sheet-item-${index}`} value={sheet} className="duelist-upload-card-sheet-radio"/>
                                <label htmlFor={`${identity}-sheet-item-${index}`} className="duelist-upload-card-sheet-label">
                                    {sheet}
                                </label>                 
                            </div>
                        )):null}
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
                <input type="file" id="file-seletor" onChange={handlerInputFile} className="duelist-upload-card-input-file" accept=".xlsx, .XLSX, .xls, .XLS"/>
            </div>
            <Button color="primary" type="button" onClick={sendExcelFile}>
                Send {identity} file
            </Button>
        </div>
    )
}