import { readFile } from "@ramonak/react-excel";
import React, { useState } from "react";
import { Button, Progress, UncontrolledTooltip } from "reactstrap";
import { api } from "services/api";

import "./styles/style-duelist-upload-card.css";

export const UploadCard = () => {

    const [ fileData, setFileData ] = useState(null);
    const [ excelData, setExcelData ] = useState(null);
    const [ sheetName, setSheetName ] = useState(null);
    const [ importState, setImportState ] = useState(false);
    const [ uploadTime, setUploadTime ] = useState({
        time: 0,
        message: null,
        color: "default"
    });

    const handlerInputFile = (e) => {
        if(e.target.files.length > 0){
            const file = e.target.files[0];
            file.format = file.name.split('.');
            setFileData(file);

            readFile(file)
            .then((data) => {
                console.log(data);
                setExcelData({
                    sheets: data.SheetNames
                });
            })
            .catch(console.error);
        }
    }

    const handlerInputRadio = (e) => {
        if(e.target.checked){
            setSheetName(e.target.value);
        }
    }

    const sendExcelFile = () => {
        if(!fileData) return window.alert("Please, select a excel file to upload.");
        else if(!sheetName) return window.alert("Please, select a sheet to read.");
        const endpoint = `/upload/${importState?"logisticMap":"zzorder"}/${sheetName}`;

        setUploadTime({
            time: 0,
            message: null,
            color: "default"
        })

        api.post(endpoint, fileData, {
            onUploadProgress: (event) => {
                let progress = Math.round(
                    (event.loaded * 100) / event.total
                );
                if (progress === 100) {
                    // Ocorre quando o backend está gravando os dados do excel
                    return setUploadTime({
                        time: 99,
                        message: "Saving data.",
                        color: "alert"
                    })
                }
                return setUploadTime({...uploadTime, time: progress});
            }
        })
        .then(() => {
            setUploadTime({
                time: 100,
                message: "Upload success.",
                color: "success"
            })
        })
        .catch(() => {
            setUploadTime({
                time: 100,
                message: "Upload error.",
                color: "danger"
            })
        });
    }

    const handlerImportCheck = (e) => {
        setImportState(e.target.checked);
    }

    return (
        <div className="duelist-upload-container-card">
            <div className="duelist-upload-card">
                <label htmlFor="file-seletor" className="duelist-upload-card-label">
                    Click to Upload
                    <div className="ni ni-send duelist-upload-card-icon"/>
                </label>
                <div className="duelist-upload-card-title">
                    File Name:
                </div>
                <div className="duelist-upload-card-value" id="file-target">
                    {fileData?(
                        <>
                            {fileData.format[0]}&nbsp;
                        </>
                    ):"No excel selected."}
                </div>
                <UncontrolledTooltip
                    delay={0}
                    placement="right"
                    target="file-target"
                >
                    {fileData?fileData.format[0]:"No excel selected."}
                </UncontrolledTooltip>
                <div className="duelist-upload-card-title">
                    Sheets:
                </div>
                <div className="duelist-upload-card-container-sheets">
                    <div className="duelist-upload-card-group-sheets">
                        {excelData?excelData.sheets.map((sheet, index) => (
                            <div key={`sheet-name-${index}`} className="duelist-upload-card-sheet-item">
                                <input type="radio" onChange={handlerInputRadio} id={`sheet-item-${index}`} value={sheet} className="duelist-upload-card-sheet-radio"/>
                                <label htmlFor={`sheet-item-${index}`} className="duelist-upload-card-sheet-label">
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
                                {uploadTime.message?uploadTime.message:uploadTime.time}
                            </span>
                        </div>
                    </div>
                    <Progress max="100" value={uploadTime.time} color={uploadTime.color}/>
                    <div className="duelist-upload-card-check-file" style={{
                        height: [sheetName?"auto":"0px"],
                    }}>
                        <label htmlFor="switch-buttom-file">
                            ZZORDER
                        </label>
                        <label class="switch">
                            <input type="checkbox" onChange={handlerImportCheck} id="switch-buttom-file"/>
                            <span class="slider round"/>
                        </label>
                        <label htmlFor="switch-buttom-file">
                            DUE LIST
                        </label>
                    </div>
                </div>
                <input type="file" id="file-seletor" onChange={handlerInputFile} className="duelist-upload-card-input-file" accept=".xlsx, .XLSX, .xls, .XLS"/>
            </div>
            <Button color="primary" type="button" onClick={sendExcelFile}>
                Send excel file
            </Button>
        </div>
    )
}