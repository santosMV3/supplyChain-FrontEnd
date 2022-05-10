import React, { useState, useEffect } from 'react';

import { api } from 'services/api';

import {
    Container,
    Button,
    Form,
    Progress,
    UncontrolledTooltip,
    Table,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Input,
} from 'reactstrap'


import { readFile } from "@ramonak/react-excel";

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Loader from "../components/custom/loader";
import LoaderBox from "../components/custom/loader/loaderBox";
import ProcessBox from '../components/custom/loader/processingLoader';

api.defaults.timeout = 0;

const UploadPage = () => {
    const [hover, setHover] = useState({
        seletorZZORDER: false,
        seletorLogMap: false
    });
    const [loaderData, setLoaderData] = useState({
        seletorZZORDER: undefined,
        seletorLogMap: undefined
    })
    const [uploadData, setUploadData] = useState({
        seletorZZORDER: undefined,
        seletorLogMap: undefined
    });

    const [uploadStatus, setUploadStatus] = useState({
        seletorZZORDER: 'stable',
        seletorLogMap: 'stable'
    });

    const [excelData, setExcelData] = useState({
        seletorZZORDER: undefined,
        seletorLogMap: undefined
    });

    const [excelSheet, setExcelSheet] = useState({
        seletorZZORDER: undefined,
        seletorLogMap: undefined
    })

    const [stateButtonZZORDER, setStateButtonZZORDER] = useState({
        text: "Send ZZORDER Excel",
        color: "primary"
    });

    const [stateButtonLogMap, setStateButtonLogMap] = useState({
        text: "Send BackLog Excel",
        color: "primary"
    });

    const [processState, setProcessState] = useState([false]);

    const handlerInputFile = (e) => {
        if(e.target.files.length > 0){
            setProcessState([true, "Reading Excel sheets..."]);
            const file = e.target.files[0];
            file.format = file.name.split('.');
            setUploadData({...uploadData, [e.target.id]: file});

            readFile(file).then((data) => {
                setExcelData({...excelData, [e.target.id]: data});
                setProcessState([false]);
            })
            .catch((error) => {
                console.error(error);
                setProcessState([false]);
            });
        }
    }

    const handlerInputRadio = (e) => {
        if(e.target.checked === true) {
            const value = e.target.value;
            setExcelSheet({...excelSheet, [e.target.name]: value});
        }
    }

    const sendExcelZZORDER = (e) => {
        if(uploadData.seletorZZORDER === undefined) return window.alert("Choose a ZZORDER excel file please!");
        if(excelSheet.seletorZZORDER === undefined) return window.alert("Choose a sheet in ZZORDER uploader please!");
        e.target.disabled = true;

        setUploadStatus({...uploadStatus, seletorZZORDER: 'stable'});

        setLoaderData({...loaderData, seletorZZORDER: 0});

        setStateButtonZZORDER({text: "Please Wait...", color: "warning"});

        api.post(`/upload/zzorder/${excelSheet.seletorZZORDER}`, uploadData.seletorZZORDER, {
            onUploadProgress: (event) => {
                let progress = Math.round(
                    (event.loaded * 100) / event.total
                );
                if (progress === 100){
                    setStateButtonZZORDER({text: "Saving excel data...", color: "warning"});
                    setProcessState([true, "Registering ZZORDER data in the database..."]);
                }
                setLoaderData({...loaderData, seletorZZORDER: progress});
            }
        })
        .then(() => {
            e.target.disabled = false;
            setUploadStatus({...uploadStatus, seletorZZORDER: 'stable'});
            setLoaderData({...loaderData, seletorZZORDER: "Upload Success"});
            setStateButtonZZORDER({text: "Upload Success!!!", color: "success"});
            setProcessState([false]);
            
            api.post('/history/', {
                idUser: localStorage.getItem("AUTHOR_ID"),
                page: "Due List",
                after: `Upload/?/ZZORDER EXCEL`,
                action: "upload",
            }).catch(console.error);
        })
        .catch(() => {
            setUploadStatus({...uploadStatus, seletorZZORDER: 'unstable'});
            setLoaderData({...loaderData, seletorZZORDER: 100});
            setStateButtonZZORDER({text: "Try again...", color: "danger"});
            setProcessState([false]);
            e.target.disabled = false;
        });
    }

    const sendExcelBackLog = (e) => {
        if(uploadData.seletorLogMap === undefined) return window.alert("Choose a BackLog excel file please!");
        if(excelSheet.seletorLogMap === undefined) return window.alert("Choose a sheet in BackLog uploader please!");
        e.target.disabled = true;
        setUploadStatus({...uploadStatus, seletorLogMap: 'stable'});

        setLoaderData({...loaderData, seletorLogMap: 0});

        setStateButtonLogMap({text: "Uploading Excel", color: "warning"});

        api.post(`/upload/logisticMap/${excelSheet.seletorLogMap}`, uploadData.seletorLogMap, {
            onUploadProgress: (event) => {
                let progress = Math.round(
                    (event.loaded * 100) / event.total
                );
                setLoaderData({...loaderData, seletorLogMap: progress});
                if(progress === 100) {
                    setStateButtonLogMap({text: "Saving data...", color: "warning"});
                    setProcessState([true, "Registering LOGMAP data in the database..."]);
                }
            }
        })
        .then(() => {
            e.target.disabled = false;
            setUploadStatus({...uploadStatus, seletorLogMap: 'stable'});
            setLoaderData({...loaderData, seletorLogMap: "Upload Success"});
            setStateButtonLogMap({text: "Upload Success!!!", color: "success"});
            setProcessState([false]);
            api.post('/history/', {
                idUser: localStorage.getItem("AUTHOR_ID"),
                page: "Due List",
                after: `Upload/?/LOGMAP EXCEL`,
                action: "upload",
            }).catch(console.error);
        })
        .catch(() => {
            setUploadStatus({...uploadStatus, seletorLogMap: 'unstable'});
            setLoaderData({...loaderData, seletorLogMap: 100});
            setStateButtonLogMap({text: "Try again...", color: "danger"});
            setProcessState([false]);
            e.target.disabled = false;
        });
    }

    return(
        <Container style={{
            display: "flex",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {processState[0]?(<ProcessBox message={processState[1]}/>):null}
            <Form style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: "15px",
                // backgroundColor: "rgb(77, 228, 255)",
                marginTop: '10px',
                width: '70vw',
                minHeight: '200px',
                height: 'auto',
                borderRadius: '15px',
                boxShadow: '0px 0px 5px gray',
                paddingBottom: '15px',
                display: [processState[0]?"none":"block"]
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '30px',
                    minHeight: '5px',
                    height: 'auto',
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}>
                        <div style={{
                            boxSizing: "border-box",
                            width: "250px",
                            minHeight: "150px",
                            height: 'auto',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "15px",
                            // border: '2px solid black',
                            borderRadius: "15px",
                            overflow: "hidden",
                            fontSize: "1.1em",
                            cursor: "default",
                            userSelect: "none",
                            backgroundColor: "#fff",
                            boxShadow: '0px 0px 10px gray',
                            color: '#11cdef',
                            marginRight: '15px',
                            transition: '0.5s',
                        }}
                        >
                            <label htmlFor="seletorZZORDER" style={hover.seletorZZORDER?{
                                width: "120px",
                                height: "120px",
                                backgroundColor: "#11cdef",
                                fontSize: "0.9em",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                boxSizing: 'border-box',
                                padding: '10px',
                                textAlign: 'center',
                                borderRadius: '100%',
                                // border: '3px dotted black',
                                color: '#fff',
                                boxShadow: '0px 0px 20px #11cdef',
                                flexDirection: 'column',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                transition: '0.5s',
                            }:{
                                width: "120px",
                                height: "120px",
                                backgroundColor: "#4de4ff",
                                fontSize: "0.9em",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                boxSizing: 'border-box',
                                padding: '10px',
                                textAlign: 'center',
                                borderRadius: '100%',
                                // border: '3px dotted black',
                                color: '#fff',
                                boxShadow: '0px 0px 0px #4de4ff',
                                flexDirection: 'column',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                transition: '0.5s',
                            }} onMouseEnter={() => setHover({...hover, seletorZZORDER: true})}
                            onMouseOut={() => setHover({...hover, seletorZZORDER: false})}>
                                Upload ZZORDER
                                <div className="ni ni-send" style={{
                                    borderRadius: '100%',
                                    backgroundColor: '#fff',
                                    color: '#11cdef',
                                    boxSizing: 'border-box',
                                    padding: '5px',
                                    textAlign: 'center'
                                }} onMouseEnter={() => setHover({...hover, seletorZZORDER: false})}/>
                            </label>
                            <div style={{
                                fontSize: '0.875rem',
                                textAlign: 'left',
                                color: '#8898aa',
                                fontWeight: '600',
                                width: '100%',
                                marginBottom: '2px'
                            }}>
                                File Name:
                            </div>
                            <div id="filenameZZORDER" style={{
                                width: '100%',
                                height: '35px',
                                textAlign: 'center',
                                backgroundColor: '#efefef',
                                borderRadius: '10px',
                                // border: '2px solid black',
                                boxSizing: 'border-box',
                                padding: '5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                boxShadow: '0px 0px 2px black',
                                marginBottom: '10px'
                            }}> 
                                {uploadData.seletorZZORDER!==undefined?uploadData.seletorZZORDER.format[0]:"No excel selected"}
                            </div>
                            <UncontrolledTooltip
                                delay={0}
                                placement="right"
                                target="filenameZZORDER"
                            >
                                {uploadData.seletorZZORDER!==undefined?uploadData.seletorZZORDER.format[0]:"No excel selected"}
                            </UncontrolledTooltip>
                            <div style={{
                                fontSize: '0.875rem',
                                textAlign: 'left',
                                color: '#8898aa',
                                fontWeight: '600',
                                width: '100%',
                                marginBottom: '2px'
                            }}>
                                Sheets:
                            </div>
                            <div style={{
                                width:'100%',
                                height: '70px',
                                boxShadow: '0px 0px 2px black',
                                backgroundColor: '#efefef',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                overflow: 'hidden',
                            }}>
                                {excelData.seletorZZORDER!==undefined?(
                                    <div style={{
                                        width: '100%',
                                        height: '70px',
                                        overflow: 'auto'
                                    }}>
                                        {excelData.seletorZZORDER.SheetNames.map((sheet, index) => (
                                            <div key={`zzorder-${index}`} style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '2px',
                                                boxSizing: 'border-box',
                                                boxShadow: '0px 0px 2px black'
                                            }}>
                                                <input type="radio" onChange={handlerInputRadio} style={{width:'10%'}} name="seletorZZORDER" value={sheet} id={sheet+"_id"}/>
                                                <label htmlFor={sheet+"_id"} style={{
                                                    fontFamily: 'Arial',
                                                    color: 'gray',
                                                    fontSize: '0.8em',
                                                    margin: '0',
                                                    width: '90%',
                                                    textAlign: 'right'
                                                }}>
                                                    {sheet}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ):null}
                            </div>
                            {loaderData.seletorZZORDER===undefined?(
                                <div style={{width: '100%', height: '0px', overflow: 'hidden', transition: '0.5s'}}>
                                    <div className="progress-info">
                                        <div className="progress-percentage">
                                            {uploadStatus.seletorZZORDER==='stable'?(
                                                <span>
                                                    {loaderData.seletorZZORDER===undefined?'Não enviado':loaderData.seletorZZORDER}
                                                </span>
                                            ):(
                                                <span style={{width:'100%', textAlign: 'center'}}>
                                                    Upload Error
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Progress max="100" value={loaderData.seletorZZORDER===undefined?0:loaderData.seletorZZORDER} color={uploadStatus.seletorZZORDER!=='unstable'?'success':'danger'}/>
                                </div>
                            ):(
                                <div style={{width: '100%', height: '58px', overflow: 'hidden', transition: '0.5s'}}>
                                    <div className="progress-info">
                                        <div className="progress-percentage">
                                            {uploadStatus.seletorZZORDER==='stable'?(
                                                <span>
                                                    {loaderData.seletorZZORDER===undefined?'Não enviado':loaderData.seletorZZORDER}
                                                </span>
                                            ):(
                                                <span style={{width:'100%', textAlign: 'center'}}>
                                                    Upload Error
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Progress max="100" value={loaderData.seletorZZORDER===undefined?0:loaderData.seletorZZORDER} color={uploadStatus.seletorZZORDER!=='unstable'?'success':'danger'}/>
                                </div>
                            )}
                        </div>
                        <input type="file" onChange={handlerInputFile} id="seletorZZORDER" accept=".xlsx" style={{display: "none"}}/>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            boxSizing: "border-box",
                            width: "250px",
                            minHeight: "150px",
                            height: 'auto',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "15px",
                            // border: '2px solid black',
                            borderRadius: "15px",
                            overflow: "hidden",
                            fontSize: "1.1em",
                            cursor: "default",
                            userSelect: "none",
                            backgroundColor: "#fff",
                            boxShadow: '0px 0px 10px gray',
                            color: '#11cdef',
                            marginRight: '15px',
                            transition: '0.5s',
                        }}
                        >
                            <label htmlFor="seletorLogMap" style={hover.seletorLogMap?{
                                width: "120px",
                                height: "120px",
                                backgroundColor: "#11cdef",
                                fontSize: "0.9em",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                boxSizing: 'border-box',
                                padding: '10px',
                                textAlign: 'center',
                                borderRadius: '100%',
                                // border: '3px dotted black',
                                color: '#fff',
                                boxShadow: '0px 0px 20px #11cdef',
                                flexDirection: 'column',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                transition: '0.5s',
                            }:{
                                width: "120px",
                                height: "120px",
                                backgroundColor: "#4de4ff",
                                fontSize: "0.9em",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                boxSizing: 'border-box',
                                padding: '10px',
                                textAlign: 'center',
                                borderRadius: '100%',
                                // border: '3px dotted black',
                                color: '#fff',
                                boxShadow: '0px 0px 0px #4de4ff',
                                flexDirection: 'column',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                transition: '0.5s',
                            }} onMouseEnter={() => setHover({...hover, seletorLogMap: true})}
                            onMouseOut={() => setHover({...hover, seletorLogMap: false})}>
                                Upload BackLog
                                <div className="ni ni-send" style={{
                                    borderRadius: '100%',
                                    backgroundColor: '#fff',
                                    color: '#11cdef',
                                    boxSizing: 'border-box',
                                    padding: '5px',
                                    textAlign: 'center'
                                }} onMouseEnter={() => setHover({...hover, seletorLogMap: false})}/>
                            </label>
                            <div style={{
                                fontSize: '0.875rem',
                                textAlign: 'left',
                                color: '#8898aa',
                                fontWeight: '600',
                                width: '100%',
                                marginBottom: '2px'
                            }}>
                                File Name:
                            </div>
                            <div id="filenameZZORDER" style={{
                                width: '100%',
                                height: '35px',
                                textAlign: 'center',
                                backgroundColor: '#efefef',
                                borderRadius: '10px',
                                // border: '2px solid black',
                                boxSizing: 'border-box',
                                padding: '5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                boxShadow: '0px 0px 2px black',
                                marginBottom: '10px'
                            }}> 
                                {uploadData.seletorLogMap!==undefined?uploadData.seletorLogMap.format[0]:"No excel selected"}
                            </div>
                            <UncontrolledTooltip
                                delay={0}
                                placement="right"
                                target="filenameZZORDER"
                            >
                                {uploadData.seletorLogMap!==undefined?uploadData.seletorLogMap.format[0]:"No excel selected"}
                            </UncontrolledTooltip>
                            <div style={{
                                fontSize: '0.875rem',
                                textAlign: 'left',
                                color: '#8898aa',
                                fontWeight: '600',
                                width: '100%',
                                marginBottom: '2px'
                            }}>
                                Sheets:
                            </div>
                            <div style={{
                                width:'100%',
                                height: '70px',
                                boxShadow: '0px 0px 2px black',
                                backgroundColor: '#efefef',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                overflow: 'hidden',
                            }}>
                                {excelData.seletorLogMap!==undefined?(
                                    <div style={{
                                        width: '100%',
                                        height: '70px',
                                        overflow: 'auto'
                                    }}>
                                        {excelData.seletorLogMap.SheetNames.map((sheet, index) => (
                                            <div key={`logmap-${index}`} style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '2px',
                                                boxSizing: 'border-box',
                                                boxShadow: '0px 0px 2px black'
                                            }}>
                                                <input type="radio" onChange={handlerInputRadio} style={{width:'10%'}} name="seletorLogMap" value={sheet} id={sheet+"_id"}/>
                                                <label htmlFor={sheet+"_id"} style={{
                                                    fontFamily: 'Arial',
                                                    color: 'gray',
                                                    fontSize: '0.8em',
                                                    margin: '0',
                                                    width: '90%',
                                                    textAlign: 'right'
                                                }}>
                                                    {sheet}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ):null}
                            </div>
                            {loaderData.seletorLogMap===undefined?(
                                <div style={{width: '100%', height: '0px', overflow: 'hidden', transition: '0.5s'}}>
                                    <div className="progress-info">
                                        <div className="progress-percentage">
                                            {uploadStatus.seletorLogMap==='stable'?(
                                                <span>
                                                    {loaderData.seletorLogMap===undefined?'Não enviado':loaderData.seletorLogMap}
                                                </span>
                                            ):(
                                                <span style={{width:'100%', textAlign: 'center'}}>
                                                    Upload Error
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Progress max="100" value={loaderData.seletorLogMap===undefined?0:loaderData.seletorLogMap} color={uploadStatus.seletorLogMap!=='unstable'?'success':'danger'}/>
                                </div>
                            ):(
                                <div style={{width: '100%', height: '58px', overflow: 'hidden', transition: '0.5s'}}>
                                    <div className="progress-info">
                                        <div className="progress-percentage">
                                            {uploadStatus.seletorLogMap==='stable'?(
                                                <span>
                                                    {loaderData.seletorLogMap===undefined?'Não enviado':loaderData.seletorLogMap}
                                                </span>
                                            ):(
                                                <span style={{width:'100%', textAlign: 'center'}}>
                                                    Upload Error
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Progress max="100" value={loaderData.seletorLogMap===undefined?0:loaderData.seletorLogMap} color={uploadStatus.seletorLogMap!=='unstable'?'success':'danger'}/>
                                </div>
                            )}
                        </div>
                        <input type="file" onChange={handlerInputFile} id="seletorLogMap" accept=".xlsx" style={{display: "none"}}/>
                    </div>
                </div>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Button color={stateButtonZZORDER.color} onClick={sendExcelZZORDER} id="sendButtonZZORDER" type="button">
                        {stateButtonZZORDER.text}
                    </Button>
                    <Button color={stateButtonLogMap.color} onClick={sendExcelBackLog} id="sendButtonLogMap" type="button">
                        {stateButtonLogMap.text}
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

const ListLogMap = () => {
    const [logMapData, setLogMapData] = useState(undefined);
    const [goPage, setGoPage] = useState(undefined);
    const [filterStats, setFilterStats] = useState(false);
    const [requisitionUrl, setRequisitionUrl] = useState("");
    const [searchFilter, setSearchFilter] = useState({
        field: "",
        value: ""
    });

    const [expandState, setExpandState] = useState(false);
    const expandPagination = () => setExpandState(true);
    const closePagination = () => setExpandState(false);

    const [filterState, setFilterState] = useState(false);
    const openFilter = () => setFilterState(true);
    const closeFilter = () => setFilterState(false);

    const [loaderList, setLoaderList] = useState(true);
    const openLoaderList = () => setLoaderList(true);
    const closeLoaderList = () => setLoaderList(false);

    const filterFields = [
      ["salesRep", "Sales Rep"],
      ["competenceName", 'COMPETENCE NAME (Z2 PARTNER)'],
      ["custNumber", 'CUST. NUMBER'],
      ["custName", 'CUST. NAME'],
      ["docType", 'Doc Type'],
      ["AGRegion", 'AG Region'],
      ["documentNumber", 'Document number'],
      ["item", 'Item'],
      ["PONumber", 'PO Number'],
      ["openValueLocalCurrency", 'Open Value: Local Currency'],
      ["firstDate", 'First Date'],
      ["schedIDate", 'Sched. l. date'],
      ["SOCreationDate", 'SO Creation Date'],
      ["confDeliveryDate", 'Conf.Deliverydat'],
      ["delay", 'Delay'],
      ["deliveryDate", 'Delivery Date'],
      ["availabilityCustomerDelvDate", 'Availability customer delv date'],
      ["itemCategory", 'Item categ.'],
      ["purchNo", 'Purch. no.'],
      ["producingCompany", 'Producing Company'],
      ["importNo", 'Import No.'],
      ["GRDate", 'GR-date'],
      ["GRQuantity", 'GR-quantity'],
      ["materialNumber", 'Materialnumber'],
      ["materialDescript", 'Material descript.'],
      ["ordercode", 'Ordercode'],
      ["commQuantity", 'Comm.quantity'],
      ["externalStock", 'External stock'],
      ["deliveryBlock", 'Delivery block'],
      ["termDescription", 'Term Description'],
      ["incoterms", 'Incoterms 1'],
      ["route", 'Route'],
      ["spCarrierPartner", 'SP Carrier Partner'],
      ["spName", 'SP Name'],
      ["confirmationTypeSC", 'Confirmation type SC'],
      ["dateOfNotification", 'Date of notification'],
      ["fullDelivery", 'full delivery'],
      ["PCInvoice", 'PC Invoice'],
      ["PCInvoiceDate", 'PC Invoice Date'],
      ["soLine", "SO LINHA"],
      ["externalService", "External Service", "check"]
    ];

    const weaklyDays = [
        'Domingo',
        'Segunda-Feira',
        'Terça-Feira',
        'Quarqua-Feira',
        'Quinta-Feira',
        'Sexta-Feira',
        'Sábado',
        'Undefined'
    ]

    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '0px solid #000',
            boxShadow: theme.shadows[5],
            padding: '30px',
            borderRadius: '5px',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        }));
      

    const handlerGopage = (e) => {
        const fullPage = logMapData!==undefined?logMapData.lastPage:0;
        if(e.target.value > fullPage) return setGoPage(fullPage);
        return setGoPage(e.target.value);
    }

    const handlerInputFilter = (e) => {
        if(e.target.type === "checkbox") return setSearchFilter({...searchFilter, [e.target.id]: e.target.checked});
        setSearchFilter({...searchFilter, [e.target.id]: e.target.value});
    }

    useEffect(() => {
        let abortController = new AbortController();
        const getData = () => {
            const userId = localStorage.getItem('AUTHOR_ID');

            api.get(`/users/${userId}`).then((response) => {
                const fullName = `${response.data.first_name} ${response.data.last_name}`
                api.get(`/logisticMap/?competenceName=${fullName}`).then((order) => {
                    order.data.page = '1';
                    order.data.fullPage = [order.data.count/40, order.data.count%40];
                    order.data.lastPage = order.data.fullPage[1] > 0 ? parseInt(order.data.fullPage[0])+1:parseInt(order.data.fullPage[0]);
                    if(order.data.count === 0) return api.get(`/logisticMap/`).then((order) => {
                        order.data.page = '1';
                        order.data.fullPage = [order.data.count/40, order.data.count%40];
                        order.data.lastPage = order.data.fullPage[1] > 0 ? parseInt(order.data.fullPage[0])+1:parseInt(order.data.fullPage[0]);
                        setRequisitionUrl(`/logisticMap/`);
                        return setLogMapData(order.data);
                    }).catch(console.error);
                    setFilterStats(true);
                    setLogMapData(order.data);
                    setRequisitionUrl(`/logisticMap/?competenceName=${fullName}`);
                    closeLoaderList();
                }).catch((error) => {
                    console.error(error);
                    closeLoaderList();
                });
            }).catch((error) => {
                console.error(error);
                closeLoaderList();
            });
            
        };
        getData();

        return () => {
            abortController.abort();
        }
    }, []);

    const getData = (pageUrl) => {
        try {
            if(pageUrl.search('page') !== -1){
                const page = pageUrl.split('?');
                const pageNumber = page[1].split('=');

                api.get(`/logisticMap/?${page[1]}`).then((response) => {
                    response.data.page = pageNumber[1];
                    response.data.fullPage = [response.data.count/40, response.data.count%40];
                    response.data.lastPage = response.data.fullPage[1] > 0 ? parseInt(response.data.fullPage[0])+1:parseInt(response.data.fullPage[0]);
                    setLogMapData(response.data);
                    setRequisitionUrl(`/logisticMap/?${page[1]}`);
                }).catch(console.error);
            } else {
                try {
                    api.get(`/logisticMap/`).then((response) => {
                        response.data.page = 1;
                        response.data.fullPage = [response.data.count/100, response.data.count%100];
                        setLogMapData(response.data);
                        setRequisitionUrl(`/logisticMap/`);
                        return false;
                    }).catch(console.error);
                } catch (error) {
                    console.error(error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const goToPage = (page) => {
        try {
            api.get(`/logisticMap/?page=${page}`).then((response) => {
                response.data.page = page;
                response.data.fullPage = [response.data.count/40, response.data.count%40];
                response.data.lastPage = response.data.fullPage[1] > 0 ? parseInt(response.data.fullPage[0])+1:parseInt(response.data.fullPage[0]);
                setLogMapData(response.data);
                setRequisitionUrl(`/logisticMap/?page=${page}`);
            }).catch(console.error);
        } catch (error) {
            console.error(error);
        }
    }

    const searchField = () => {
        try {
            api.get(`/logisticMap/?${searchFilter.field}=${searchFilter.value}`).then((response) => {
                response.data.page = 1;
                response.data.fullPage = [response.data.count/40, response.data.count%40];
                response.data.lastPage = response.data.fullPage[1] > 0 ? parseInt(response.data.fullPage[0])+1:parseInt(response.data.fullPage[0]);
                setLogMapData(response.data);
                setFilterStats(true);
                setRequisitionUrl(`/logisticMap/?${searchFilter.field}=${searchFilter.value}`);
            }).catch(console.error);
        } catch (error) {
            console.error(error);
        }
    }

    const removeFilter = (e) => {
        if(requisitionUrl.indexOf("?") > -1) {
            e.target.disabled = true;
            e.target.disabled = getData("/logisticMap/");
            setFilterStats(false);
        }
    }

    const ListItem = ({post, index}) => {
        const classes = useStyles();
        const [modalState, setModalState] = useState(false);
        const openModal = () => setModalState(true);
        const closeModal = () => setModalState(false);

        const [autoForms, setAutoForms] = useState({
            importation: "Getting..."
        });
        const [orderState, setOrderState] = useState(false);
        const [userOrder, setUserOrder] = useState(false);
        const [statusOrder, setStatusOrder] = useState([]);
        const [status, setStatus] = useState(undefined);

        const [selectedStatus, setSelectedStatus] = useState(undefined);
        const [selectedStatusName, setSelectedStatusName] = useState(undefined);

        const [statusData, setStatusData] = useState([]);
        const openStatus = () => setOrderState(true);
        const closeStatus = () => setOrderState(false);

        const [editMode, setEditMode] = useState(false);
        const openEditMode = () => setEditMode(true);
        const closeEditMode = () => setEditMode(false);

        const [loaderItem, setLoaderItem] = useState(true);
        const openLoaderItem = () => setLoaderItem(true);
        const closeLoaderItem = () => setLoaderItem(false);

        const [editExternalMode, setEditExternalMode] = useState(false);
        const openExternalMode = () => {
            if (!post.externalService) return;
            return setEditExternalMode(true);
        }
        const closeExternalMode = () => setEditExternalMode(false);

        const [selectedStatusWeek, setSelectedStatusWeek] = useState(post.previsionWeek);

        const handleChangeWeek = (event) => {
            setSelectedStatusWeek(event.target.value);
        };

        const handleChange = (event) => {
            setSelectedStatus(event.target.value);
        };

        const handleOptionChange = (e) => {
            setSelectedStatusName(e.target.id);
        }

        const getStatus = () => {
            openLoaderItem();
            Promise.all([
                api.get('/status?is_active=True'),
                api.get(`/statusOrder?idOrder=${post.id}`),
                api.get(`/importationDetails/${post.importation}`)
            ]).then((response) => {
                setStatusData(response[0].data);
                setStatusOrder(response[1].data);
                setAutoForms({...autoForms, importation: response[2].data.imp});
                if(response[1].data[0]) {
                    Promise.all([
                        api.get(`/status/${response[1].data[0].idStatus}`),
                        api.get(`/users/${response[1].data[0].idUser}`)
                    ]).then((data) => {
                        setStatus([data[0].data.name, data[0].data.description, data[0].data.idStatus]);
                        setSelectedStatus(`${data[0].data.idStatus}:${post.id}`);
                        setUserOrder(data[1].data);
                        closeLoaderItem();
                    }).catch(console.error);
                } else {
                    closeLoaderItem();
                }
            }).catch(console.error);
        }

        useEffect(() => {
            let abortController = new AbortController();
            getStatus();

            return () => {
                abortController.abort();
            }
            
        }, []);

        const updateOrderWeek = () => {
            api.patch(`/logisticMap/${post.id}/`, {previsionWeek: selectedStatusWeek}).then((response) => {
                api.post('/history/', {
                    idUser: localStorage.getItem("AUTHOR_ID"),
                    page: "Due List",
                    before: `Prevision Fat. (Week)/?/${post.previsionWeek}`,
                    after: `Prevision Fat. (Week)/?/${selectedStatusWeek}`,
                    action: "update",
                    SO: post.soLine,
                    description: "Changed the Prevision Fat. Week of this order.",
                }).catch(console.error);

                post.previsionWeek = selectedStatusWeek;
                closeEditMode();
                window.alert("Successfully awarded week.");
            }).catch(console.error);
        }

        const reloadData = () => {
            api.get('/status?is_active=True').then((response => setStatusData(response.data))).catch(console.error);
            api.get(`/statusOrder?idOrder=${post.id}`).then((response) => {
                setStatusOrder(response.data);
                if(response.data[0]) api.get(`/status/${response.data[0].idStatus}`)
                .then((data) => setStatus([data.data.name, data.data.description])).catch(console.error);
            }).catch(console.error);
        }

        const openValue = parseFloat(post.openValueLocalCurrency);

        const saveStatusOrder = () => {
            if(selectedStatus!==undefined) {
                const senderStatus = selectedStatus.split(":");

                const data = {
                    idStatus: senderStatus[0],
                    idOrder: senderStatus[1],
                    idUser: localStorage.getItem('AUTHOR_ID')
                }


                api.post("/statusOrder/", data).then(() => {
                    
                    window.alert("Status adicionado com sucesso!");
                    closeStatus();
                    reloadData();
                    getStatus();

                    api.post('/history/', {
                        idUser: localStorage.getItem("AUTHOR_ID"),
                        page: "Due List",
                        after: `Order Status/?/${selectedStatusName}`,
                        action: "update",
                        SO: post.soLine,
                    }).catch(console.error);
                    
                }).catch(console.error);
            } else {
                window.alert("Please select a status for this order.");
            }
        }

        const updateStatusOrder = (e) => {
            e.target.disabled = true;
            const statusSender = selectedStatus.split(":");
            const dataRequest = {
                idStatus: statusSender[0],
                idUser: localStorage.getItem('AUTHOR_ID'),
                idOrder: post.id
            }

            api.patch(`statusOrder/${statusOrder[0].idOrderStatus}/`, dataRequest)
            .then(() => {
                window.alert("Status atualizado com sucesso!");
                closeStatus();
                reloadData();
                getStatus();

                api.post('/history/', {
                    idUser: localStorage.getItem("AUTHOR_ID"),
                    page: "Due List",
                    after: `Order Status/?/${selectedStatusName}`,
                    before: `Order Status/?/${status[0]}`,
                    action: "update",
                    SO: post.soLine,
                }).catch(console.error);
            }).catch(console.error);
        }

        const formatDate = (date) => {
            if (date.indexOf('-') === -1) return date;
            if(date.indexOf('T') === -1){
                date =  date.split(' ');
                date = date[0].split('-');
            } else {
                date =  date.split('T');
                date = date[0].split('-');
                return `${date[2]}/${date[1]}/${date[0]}`;
            }
            return `${date[2]}/${date[1]}/${date[0]}`;
        }

        const formatDateTime = (date) => {
            if (date.indexOf('-') === -1) return date;
            date =  date.split('T');
            let time = date[1].split('.');
            date = date[0].split('-');
            time = time[0].split(':');
            return `${date[2]}/${date[1]}/${date[0]} ${time[0]}:${time[1]}`;
        }

        const firstDate = formatDate(post.firstDate);
        const schedIDate = formatDate(post.schedIDate);
        const PCInvoiceDate = formatDate(post.PCInvoiceDate);
        const previsionTrianom = formatDate(post.previsionTrianom);
        const confDeliveryDate = formatDate(post.confDeliveryDate);
        const statusOrderDate = statusOrder.length > 0 ? formatDateTime(statusOrder[0].Date):null;

        const [releaseDateExternal, setReleaseDateExternal] = useState(post.releaseDate!=null ? formatDate(post.releaseDate) : null);
        const [previsionDate, setPrevisionDate] = useState(post.previsionDate!=null ? formatDate(post.previsionDate) : null);
        const [supplier, setSupplier] = useState(post.supplier);
        const [returnDays, setReturnDays] = useState(post.returnDays);

        const saveExternalMode = () => {
            const supplier = document.getElementById('supplierExternal').value;
            const days = document.getElementById('daysExternal').value;
            const releaseDateTime = document.getElementById('dateExternal').value;

            api.patch(`/logMapExternalCalc/${post.id}/`, {
                supplier: supplier.toString(),
                returnDays: parseInt(days),
                releaseDate: `${releaseDateTime}`,
            }).then((response) => {
                window.alert("Success to update the External Service");
                setReleaseDateExternal(formatDate(response.data.releaseDate));
                setPrevisionDate(formatDate(response.data.prevision));
                setSupplier(response.data.supplier);
                setReturnDays(response.data.returnDays);
                closeExternalMode();
            }).catch(console.error);
        }

        return (
            <>
                <tr style={index%2===0?null:{backgroundColor: '#dfdfdf', boxShadow: '0px 0px 5px gray'}}>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                {post.situation!== 'undefined'?(
                                    <div style={{
                                        border: [post.situation === 'billed'?'1px solid #25ccc1':'1px solid #ffc559'],
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '100%',
                                        boxShadow: [post.situation === 'billed'?'inset 0px 0px 5px #25ccc1':'inset 0px 0px 5px #ffc559'],
                                        backgroundColor: [post.situation === 'billed'?'#25ccc1':'#ffb700'],
                                        color: "#FFFFFF"
                                    }}>
                                        <span className=" text-sm">
                                            {index + 1}
                                        </span>
                                    </div>
                                ):(
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '100%',
                                        color: "#000",
                                        boxShadow: '0px 0px 5px gray'
                                    }}>
                                        <span className="mb-0 text-sm">
                                            {index + 1}
                                        </span>
                                    </div>
                                )}
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"prevSystem" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.previsionFatSystem}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"prevSystem" + index}
                                >
                                    {post.previsionFatSystem}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"custname" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.custName}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"custname" + index}
                                >
                                    {post.custName}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"docNumber" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.documentNumber}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"docNumber" + index}
                                >
                                    {post.documentNumber}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"item" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.item}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"item" + index}
                                >
                                    {post.item}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"openValueLocal" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {openValue.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"})}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"openValueLocal" + index}
                                >
                                    {openValue.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"})}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"itemCateg" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.itemCategory}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"itemCateg" + index}
                                >
                                    {post.itemCategory}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"firstDate" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {firstDate}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"firstDate" + index}
                                >
                                    {firstDate}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"schedIDate" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {schedIDate}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"schedIDate" + index}
                                >
                                    {schedIDate}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"materialDescript" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.materialDescript}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"materialDescript" + index}
                                >
                                    {post.materialDescript}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"materialNumber" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {post.materialNumber}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"materialNumber" + index}
                                >
                                    {post.materialNumber}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td>
                        <Media className="align-items-center">
                            <Media>
                                <span id={"prevTrianom" + index} style={{fontSize: '1.0em', textOverflow: 'ellipsis', maxWidth: '20ch', overflow: 'hidden'}}>
                                    {previsionTrianom}
                                </span>
                                <UncontrolledTooltip
                                    delay={0}
                                    placement="bottom"
                                    target={"prevTrianom" + index}
                                >
                                    {previsionTrianom}
                                </UncontrolledTooltip>
                            </Media>
                        </Media>
                    </td>
                    <td/>
                    <td>
                        <Media className="align-items-center">
                            <Media style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'space-around'
                            }}>
                                {orderState===true?(
                                    <>
                                    <FormControl  required className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-outlined-label" style={{
                                            padding: '0'
                                        }}>
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={selectedStatus}
                                            onChange={handleChange}
                                            label="Permission"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {statusData.map((status, index) => (
                                                <MenuItem key={`status-${index}`} onClick={handleOptionChange} value={`${status.idStatus}:${post.id}`}>
                                                    <em id={status.name}>{status.name}</em>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around'
                                    }}>
                                        <Button color="success" size="sm" onClick={status!==undefined?updateStatusOrder:saveStatusOrder}>
                                            {status!==undefined?"Update":"Save"}
                                        </Button>
                                        <Button size="sm" onClick={closeStatus} color="danger">
                                            ✘
                                        </Button>
                                    </div>
                                    </>
                                ):(
                                    <>
                                        {loaderItem?(
                                            <div style={{
                                                width: "50px",
                                                height: "26px"
                                            }}>
                                                <Loader/>
                                            </div>
                                        ):(
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: "row"
                                            }}>
                                                {status!==undefined?(
                                                    <>
                                                        <Button style={{
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '10ch',
                                                            overflow: 'hidden'
                                                        }} size="sm" id={"status" + index} onClick={openStatus} color="default">
                                                            {status[0]}
                                                        </Button>
                                                    </>
                                                ):(
                                                    <Button size="sm" onClick={openStatus} color="primary">
                                                        Add Status
                                                    </Button>
                                                )}
                                                <Button size="sm" color="primary" id={"expand"+ index} onClick={openModal}>
                                                    ...
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Media>
                        </Media>
                    </td>
                </tr>
                <tr>
                    <td style={{padding: 0}} colSpan="14">
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={modalState}
                            onClose={closeModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={modalState}>
                            <div className={classes.paper}>
                                <div style={{
                                    width: '100%',
                                    height: '45px',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                    padding: '5px',
                                    justifyContent: 'space-between'
                                }}>
                                    <h2 id="modal-modal-title" style={{margin: '0px'}}>
                                        Detailed information
                                    </h2>
                                    <Button size="sm" color="danger" outline onClick={closeModal}>
                                        Close
                                    </Button>
                                </div>
                                <div style={{
                                    width: 'auto',
                                    minWidth: '20px',
                                    height: '70vh',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    padding: '5px',
                                    boxSizing: 'border-box',
                                }}>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Sales Rep
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Logistic Responsible
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Cust. number
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Doc Type
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                AG Region
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.salesRep}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.competenceName}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.custNumber}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.docType}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.AGRegion}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                GR-quantity
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Ordercode
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Comm. Quantity
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                External Stock
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Delivery Block
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.GRQuantity}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.ordercode}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.commQuantity}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.externalStock}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.deliveryBlock}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Term Description
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Incoterms
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Route
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                SP. Carrier Partner
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                SP. Name
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.termDescription}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.incoterms}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.route}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.spCarrierPartner}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.deliveryBlock}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Confirmation Type SC
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Date of notification
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Full Delivery
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                PC Invoice
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                PC Invoice Date
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.confirmationTypeSC}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.dateOfNotification}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.fullDelivery}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.PCInvoice}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {PCInvoiceDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Delivery Factory
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                SO / linha
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                ETA Trianon
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Importation
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Import No.
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {weaklyDays[post.deliveryFactory]}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.soLine}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {previsionTrianom}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {autoForms.importation}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.importNo}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Billing Forecast
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Material Days
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Dead Line Fat.
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Producing Company
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Conf. Delivery Date
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.previsionFatSystem}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.materiaDays}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.deadLineFat}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {post.producingCompany}
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                marginLeft: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6'
                                            }}>
                                                {confDeliveryDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        minWidth: '10px',
                                        width: 'auto',
                                        height: 'auto',
                                        minHeight: '45px',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: '#11cdef',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Prevision Fat. (Week)
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                External Service
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Supplier
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Return Days
                                            </div>
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                // boxShadow: '0px 0px 5px black',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                fontWeight: '600',
                                            }}>
                                                Release Date
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: 'auto',
                                            minHeight: '30px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                        }}>
                                            {!editMode?(
                                                <>
                                                <div id={`week` + index} onDoubleClick={openEditMode} style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6',
                                                    userSelect: 'none',
                                                    cursor: 'pointer'
                                                }}>
                                                    {post.previsionWeek}
                                                </div>
                                                <UncontrolledTooltip
                                                    delay={0}
                                                    placement="top"
                                                    target={`week` + index}
                                                >
                                                    Double click to edit the week.
                                                </UncontrolledTooltip>
                                                </>
                                            ):(
                                                <div onDoubleClick={closeEditMode} style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6'
                                                }}>
                                                    <FormControl variant="standard" required className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-outlined-label">
                                                            Week
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={selectedStatusWeek}
                                                            onChange={handleChangeWeek}
                                                            label="Prev. Fat. Week"
                                                        >
                                                            <MenuItem value="">
                                                                <em>None</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE1">
                                                                <em>WE1</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE2">
                                                                <em>WE2</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE3">
                                                                <em>WE3</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE4">
                                                                <em>WE4</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE5">
                                                                <em>WE5</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE6">
                                                                <em>WE6</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE7">
                                                                <em>WE7</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE8">
                                                                <em>WE8</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE9">
                                                                <em>WE9</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE10">
                                                                <em>WE10</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE11">
                                                                <em>WE11</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE12">
                                                                <em>WE12</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE13">
                                                                <em>WE13</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE14">
                                                                <em>WE14</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE15">
                                                                <em>WE15</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE16">
                                                                <em>WE16</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE17">
                                                                <em>WE17</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE18">
                                                                <em>WE18</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE19">
                                                                <em>WE19</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE20">
                                                                <em>WE20</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE22">
                                                                <em>WE22</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE23">
                                                                <em>WE23</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE24">
                                                                <em>WE24</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE25">
                                                                <em>WE25</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE26">
                                                                <em>WE26</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE27">
                                                                <em>WE27</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE28">
                                                                <em>WE28</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE29">
                                                                <em>WE29</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE30">
                                                                <em>WE30</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE31">
                                                                <em>WE31</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE32">
                                                                <em>WE32</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE33">
                                                                <em>WE33</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE34">
                                                                <em>WE34</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE35">
                                                                <em>WE35</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE36">
                                                                <em>WE36</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE37">
                                                                <em>WE37</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE38">
                                                                <em>WE38</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE39">
                                                                <em>WE39</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE40">
                                                                <em>WE40</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE41">
                                                                <em>WE41</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE42">
                                                                <em>WE42</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE43">
                                                                <em>WE43</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE44">
                                                                <em>WE44</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE45">
                                                                <em>WE45</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE46">
                                                                <em>WE46</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE47">
                                                                <em>WE47</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE48">
                                                                <em>WE48</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE49">
                                                                <em>WE49</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE50">
                                                                <em>WE50</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE51">
                                                                <em>WE51</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE52">
                                                                <em>WE52</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE53">
                                                                <em>WE53</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE54">
                                                                <em>WE54</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE55">
                                                                <em>WE55</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE56">
                                                                <em>WE56</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE57">
                                                                <em>WE57</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE58">
                                                                <em>WE58</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE59">
                                                                <em>WE59</em>
                                                            </MenuItem>
                                                            <MenuItem value="WE60">
                                                                <em>WE60</em>
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Button color="primary" onClick={updateOrderWeek} size="sm">
                                                        Save
                                                    </Button>
                                                </div>
                                            )}
                                            <div style={{
                                                width: '200px',
                                                height: 'auto',
                                                minHeight: '30px',
                                                color: '#5c5c5c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '1px',
                                                textAlign: 'center',
                                                boxSizing: 'border-box',
                                                padding: '2px',
                                                backgroundColor: '#e6e6e6',
                                                userSelect: 'none',
                                            }}>
                                                {post.externalService?"Yes":"No"}
                                            </div>
                                            {!editExternalMode?(
                                                <>
                                                <div onDoubleClick={openExternalMode} style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6',
                                                    userSelect: 'none',
                                                    cursor: [post.externalService?'pointer':'default']
                                                }}>
                                                        {supplier}
                                                </div>
                                                <div onDoubleClick={openExternalMode} style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6',
                                                    userSelect: 'none',
                                                    cursor: [post.externalService?'pointer':'default']
                                                }}>
                                                    {returnDays}
                                                </div>
                                                <div onDoubleClick={openExternalMode} style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6',
                                                    userSelect: 'none',
                                                    cursor: [post.externalService?'pointer':'default']
                                                }}>
                                                    {releaseDateExternal}
                                                </div>
                                                </>
                                            ):(
                                                <>
                                                    <div style={{
                                                        width: '600px',
                                                        height: 'auto',
                                                        minHeight: '30px',
                                                        color: '#5c5c5c',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '1px',
                                                        textAlign: 'center',
                                                        boxSizing: 'border-box',
                                                        padding: '2px',
                                                        backgroundColor: '#e6e6e6',
                                                        userSelect: 'none',
                                                        flexDirection: 'column'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            marginBottom: '5px'
                                                        }}>
                                                            <Input id="supplierExternal" placeholder="Supplier" defaultValue={supplier} type="text" style={{
                                                                width: '200px',
                                                                height: '30px'
                                                            }}/>
                                                            <Input id="daysExternal" placeholder="Return Days" defaultValue={returnDays} type="number" min="0" style={{
                                                                width: '200px',
                                                                height: '30px'
                                                            }}/>
                                                            <Input
                                                            id="dateExternal"
                                                            defaultValue={new Date().getFullYear() + "-11-23T10:30:00"} 
                                                            type="date" 
                                                            style={{
                                                                width: '200px',
                                                                height: '30px'
                                                            }}/>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row'
                                                        }}>
                                                            <Button color="primary" onClick={saveExternalMode} type="button" size="sm">
                                                                Save
                                                            </Button>
                                                            <Button color="danger" onClick={closeExternalMode} type="button" size="sm">
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {post.externalService?(
                                        <div style={{
                                            width: '200px',
                                            height: 'auto',
                                            minHeight: '45px',
                                            boxShadow: '0px 0px 5px gray',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                            marginBottom: '20px',
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                height: 'auto',
                                                minHeight: '30px',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                backgroundColor: '#11cdef',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    // boxShadow: '0px 0px 5px black',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    fontWeight: '600',
                                                }}>
                                                    Prevision Date
                                                </div>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: 'auto',
                                                minHeight: '30px',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: '200px',
                                                    height: 'auto',
                                                    minHeight: '30px',
                                                    color: '#5c5c5c',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '1px',
                                                    textAlign: 'center',
                                                    boxSizing: 'border-box',
                                                    padding: '2px',
                                                    backgroundColor: '#e6e6e6',
                                                }}>
                                                    {previsionDate}
                                                </div>
                                            </div>
                                        </div>
                                    ):null}
                                </div>
                                <div style={{
                                    width: '100%',
                                    minHeight: '5px',
                                    height: 'auto',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box',
                                    padding: '5px',
                                }}>
                                    {statusOrder.length > 0 ? (
                                        <div style={{
                                        width: '160px',
                                        minHeight: '55px',
                                        height: 'auto',
                                        textAlign: 'center',
                                        boxShadow: '0px 0px 5px gray',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        boxSizing: 'border-box',
                                    }}>
                                        <h1 style={{
                                            fontSize: '0.9em',
                                            fontFamily: 'calibri',
                                            width: '100%',
                                            boxShadow: '0px 0px 5px gray',
                                            margin: '0'
                                        }}>
                                            Last Status Update:
                                        </h1>
                                        <p style={{
                                            fontSize: '1.0em',
                                            fontFamily: 'calibri',
                                            margin: '0',
                                            padding: '0',
                                        }}>
                                            {statusOrderDate}
                                        </p>
                                        <p style={{
                                            fontSize: '1.0em',
                                            fontFamily: 'calibri',
                                            margin: '0',
                                            padding: '0',
                                        }}>
                                            {userOrder?`${userOrder.first_name} ${userOrder.last_name}`:null}
                                        </p>
                                    </div>
                                    ): null}
                                    <FormControl variant="outlined" required className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-outlined-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={selectedStatus}
                                            onChange={handleChange}
                                            label="Permission"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {statusData.map((status, index) => (
                                                <MenuItem key={`statusdata-${index}`} value={`${status.idStatus}:${post.id}`}>
                                                    <em>{status.name}</em>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button color="primary" size="sm" onClick={status!==undefined?updateStatusOrder:saveStatusOrder}>
                                        {status!==undefined?"Update":"Save"}
                                    </Button>
                                </div>
                            </div>
                            </Fade>
                        </Modal>
                    </td>
                </tr>
            </>
        )
    }

    return (
        <div style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '98%',
        }}>            
            <div style={{
                width:'310px',
                height: [filterState===true?'150px':'35px'],
                float: 'left',
                transition: '0.5s',
                overflow: 'hidden',
            }}>
                <div style={{
                    width:'300px',
                    height: '150px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        marginBottom: '10px'
                    }}>
                        {filterState===false?(
                            <Button color="primary" onClick={openFilter} size="sm" type="button">
                                Filter
                            </Button>
                        ):(
                            <Button color="danger" onClick={closeFilter} size="sm" type="button">
                                Close
                            </Button>
                        )}
                        <>
                            {filterStats?(
                                <Button color="danger" onClick={removeFilter} outline size="sm" type="button">
                                    Remove Filter
                                </Button>
                            ):null}
                        </>
                    </div>
                    <div style={{
                        width: '100%',
                        backgroundColor: '#fff',
                        padding: '15px',
                        boxSizing: 'border-box',
                        borderRadius: '15px',
                        boxShadow: '0px 0px 2px gray'
                    }}>
                        <Input onChange={handlerInputFilter} id="field" bsSize="sm" style={{marginBottom: '10px'}} type="select">
                            <option value={false}>Fields</option>
                            {filterFields.map((filter, index) => (<option key={`filter-${index}`} value={filter[0]}>{filter[1]}</option>))}
                        </Input>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: 'space-around'
                        }}>
                            {searchFilter.field !== "externalService"?(
                                <Input id="value" value={searchFilter.value} onChange={handlerInputFilter} type="text" bsSize="sm" style={{width:'70%'}}/>
                            ):(
                                <div className="custom-control custom-checkbox">
                                    <input
                                        className="custom-control-input"
                                        id="value"
                                        type="checkbox"
                                        onClick={handlerInputFilter}
                                    />
                                    <label className="custom-control-label" htmlFor="value">
                                        Value
                                    </label>
                                </div>
                            )}
                            <Button color="info" disabled={searchFilter.field === "false"?true:false} onClick={searchField} size="sm" type="button" style={{width:'20%'}}>
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {loaderList?(
                <LoaderBox message="Loading orders. Please wait..."/>
            ):(
                <Table className="align-items-center"style={{
                    height: 'auto',
                    minHeight: '10px',
                    maxHeight: '65vh',
                    overflow: 'auto',
                    display: 'block'
                }} responsive>
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Nº</th>
                            <th scope="col">Billing Forecast</th>
                            <th scope="col">Cust. Name</th>
                            <th scope="col">SO</th>
                            <th scope="col">Item</th>
                            <th scope="col">Open Value</th>
                            <th scope="col">Item Categ.</th>
                            <th scope="col">First Date</th>
                            <th scope="col">Sched. l. date</th>
                            <th scope="col">Material Descript.</th>
                            <th scope="col">Material Number</th>
                            <th scope="col">ETA Trianon</th>
                            <th scope="col"/>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logMapData!==undefined?(
                            <>
                            {logMapData.results.length > 0?logMapData.results.map((post, index) => (<ListItem key={`listitem-${index}`} post={post} index={index}/>)):(
                                <tr>
                                    <td colSpan="24">
                                        No data.
                                    </td>
                                </tr>
                            )}
                            </>
                        ):(
                        <tr>
                            <td colSpan={12}>
                                Error to collect orders. (Server possible offline...)
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}
            <div style={{
                width: '100%',
                minHeight: '5px',
                height: 'auto',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <nav aria-label="...">
                    {logMapData!==undefined?(
                        <>
                        {logMapData.count>0?(
                            <Pagination>
                                {logMapData.previous===null?(
                                    <PaginationItem className="disabled">
                                        <PaginationLink
                                            style={{boxShadow: '0px 0px 5px gray'}}
                                            href="#"
                                            onClick={e => e.preventDefault}
                                            tabIndex="-1"
                                        >
                                            <i className="fa fa-angle-left" />
                                            <span className="sr-only">Previous</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                ):(
                                    <PaginationItem>
                                        <PaginationLink
                                            style={{boxShadow: '0px 0px 5px gray'}}
                                            href="#"
                                            onClick={() => getData(logMapData.previous)}
                                            tabIndex="-1"
                                        >
                                            <i className="fa fa-angle-left" />
                                            <span className="sr-only">Previous</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                <PaginationItem className="active">
                                    <PaginationLink style={{cursor: 'default'}} href="#" onClick={e => e.preventDefault()}>
                                        {logMapData.page}
                                    </PaginationLink>
                                </PaginationItem>
                                {logMapData.next===null?(
                                    <PaginationItem className="disabled">
                                        <PaginationLink style={{boxShadow: '0px 0px 5px gray'}} href="#" onClick={e => e.preventDefault()}>
                                            <i className="fa fa-angle-right" />
                                            <span className="sr-only">Next</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                ):(
                                    <PaginationItem>
                                        <PaginationLink style={{boxShadow: '0px 0px 5px gray'}} href="#" onClick={() => getData(logMapData.next)}>
                                            <i className="fa fa-angle-right" />
                                            <span className="sr-only">Next</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <div style={{
                                        width: [expandState===true?'150px':'36px'],
                                        height: '36px',
                                        boxShadow: '0px 0px 2px gray',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '36px',
                                        transition: '0.5s',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: '150px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            }}>
                                            <PaginationLink style={{boxShadow: [expandState===false?'0px 0px 5px gray':'0px 0px 2px gray'], margin: '0', marginRight: '5px'}}href="#"
                                            onClick={expandState===false?expandPagination:closePagination}>
                                                <i className="ni ni-world-2" />
                                                <span className="sr-only">Search</span>
                                            </PaginationLink>
                                            <input type="number" value={goPage} max={logMapData.lastPage} onChange={handlerGopage} min="1" style={{
                                                width:'50px',
                                                border: '0px',
                                                boxShadow: '0px 0px 2px black',
                                                borderRadius: '10px',
                                                height: '25px',
                                                marginRight: '10px',
                                                paddingLeft: '5px',
                                                boxSizing: 'border-box'
                                            }}/>
                                            <Button color="primary" style={{borderRadius: '10px'}} onClick={() => goToPage(goPage)} outline size="sm" type="button">
                                                Go
                                            </Button>
                                        </div>
                                    </div>
                                </PaginationItem>
                            </Pagination>
                        ):null}
                        </>
                    ):null}
                </nav>
            </div>
        </div>
    )
}

const FinancesPage = () => {
    const [uploadPage, setUploadPage] = useState(false);
    const openUploadPage = () => setUploadPage(true);
    const closeUploadPage = () => setUploadPage(false);
    
    return (
        <div style={{
            boxSizing: 'border-box',
            paddingTop: '15px'
        }}>
            <div style={{
                float: 'right',
                width: "100%",
                marginRight: '1vw',
                marginBottom: '15px',
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
            }}>
                {uploadPage===false?(
                    <Button color="primary" size="sm" onClick={openUploadPage} type="button">
                        Upload excel
                    </Button>
                ):(
                    <Button color="danger" size="sm" onClick={closeUploadPage} type="button">
                        Back to list
                    </Button>
                )}
            </div>
            {uploadPage===false?(
                <ListLogMap/>
            ):(
                <UploadPage/>
            )}
        </div>
    )
}

export default FinancesPage;