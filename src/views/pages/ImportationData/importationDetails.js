import React, { useEffect, useState } from "react"

import { 
    Button,
    Input,
    UncontrolledTooltip,
} from "reactstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { formatDateAmerican, formatDate } from "utils/conversor";
import LoaderBox from "../components/custom/loader/loaderBox";
import { api } from "services/api";

registerLocale('pt-br', ptBR);

const ImportationLine = ({post, deleteFactory, getImp}) => {

    const [impUpdate, setImpUpdate] = useState({
        docSap: post.docSap,
        imp: post.imp,
        prevChegadaTrianon: post.prevChegadaTrianon,
        liberadoFaturamento: post.liberadoFaturamento,
        automatic: false
    });

    const [editMode, setEditMode] = useState(false);
    const openEditMode = () => setEditMode(true);
    const closeEditMode = () => setEditMode(false);

    const handlerInput = (e) => {
        if (Object.keys(e).length === 0) return setImpUpdate({...impUpdate, "prevChegadaTrianon": formatDateAmerican(e)});
        if(e.target.type=== "number"){
            if(e.target.value === "") e.target.value = 0;
            if(e.target.value > 99999) e.target.value = 99999;
        }

        if (e.target.type === "checkbox") return setImpUpdate({...impUpdate, [e.target.name]: e.target.checked});


        setImpUpdate({...impUpdate, [e.target.name]: e.target.value});
    }

    const updateImpExecute = (e) => {
        e.target.disabled = true;
        api.patch(`/importationDetails/${post.id}/`, impUpdate).then(() => {
            let historicData = {
                page: "Importation Details",
                before: null,
                after: null,
                action: null,
                so: []
            }

            if (impUpdate.imp !== post.imp) {
                historicData.so.push({
                    before: `Old imp value: "${post.imp}"`,
                    after: `New imp value: "${impUpdate.imp}" for Doc Sap: "${impUpdate.docSap}"`,
                    action: "update"
                })
            }

            if (impUpdate.docSap !== post.docSap) {
                historicData.so.push({
                    before: `Old DocSap value: "${post.DocSap}"`,
                    after: `New DocSap value: "${impUpdate.docSap}"`,
                    action: "update"
                })
            }

            if (impUpdate.prevChegadaTrianon !== post.prevChegadaTrianon) {
                historicData.so.push({
                    before: `Old Prevision Trianom value: "${post.prevChegadaTrianon}"`,
                    after: `New Prevision Trianom value: "${impUpdate.prevChegadaTrianon}" for Doc Sap: "${impUpdate.docSap}"`,
                    action: "update"
                })
            }

            if (impUpdate.liberadoFaturamento !== post.liberadoFaturamento) {
                historicData.so.push({
                    before: `Old Released to Invoiced value: "${post.liberadoFaturamento}"`,
                    after: `New Released to Invoiced value: "${impUpdate.liberadoFaturamento}" for Doc Sap: "${impUpdate.docSap}"`,
                    action: "update"
                })
            }

            const historicBody = historicData.so.shift();
            if(historicBody){
                historicData.action = historicBody.action;
                historicData.after = historicBody.after;
                historicData.before = historicBody.before;

                api.post(`/history/`, historicData).then(() => {
                    window.alert("Update Sucess!");
                    e.target.disabled = false;
                    closeEditMode();
                    getImp({loader: false});  
                });
            } else {
                closeEditMode();
            }

        }).catch(console.error);
    }

    const formatData = (data) => {
        if(data !== null || data.indexOf('-') > -1){
            data = data.split(' ');
            data = data[0].split('-');
            return `${data[2]}/${data[1]}/${data[0]}`;
        } else {
            return data
        }
    }

    const prevChegadaTrianon = post.prevChegadaTrianon ? formatData(post.prevChegadaTrianon):"No Data";

    return (
        <>
            {editMode===false?(
                <tr>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.docSap}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.imp}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {prevChegadaTrianon}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.liberadoFaturamento===false?"No":"Yes"}
                    </td>
                    <td style={{
                        display: 'flex',
                        flexDirection: 'row',
                        boxSizing: 'border-box',
                        padding: '5px',
                        height: '40px',
                        alignItems: 'center'
                    }}>
                        <Button color="primary" outline size="sm" onClick={openEditMode}>
                            Edit
                        </Button>
                        <Button color="danger" size="sm" outline onClick={() => deleteFactory(post.id, post.docSap)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            ):(
                <tr>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" onChange={handlerInput} defaultValue={post.docSap} name="docSap" max="99999" min="0" type="number" style={{
                            width: '75px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" onChange={handlerInput} name="imp" defaultValue={post.imp} type="text" style={{
                            width: '150px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}} onDoubleClick={() => {
                        setImpUpdate({...impUpdate, "prevChegadaTrianon": null});
                    }} id={`date-field-${post.docSap}`}>
                        <DatePicker
                            type="date"
                            locale="pt-br"
                            onChange={handlerInput}
                            value={formatDate(impUpdate.prevChegadaTrianon)}
                            name="releaseDate"
                            dateFormat="dd/MM/yyyy"
                            style={{
                                width: '150px',
                                margin: '0 auto'
                            }}
                        />
                        <UncontrolledTooltip
                            delay={0}
                            placement="left"
                            target={`date-field-${post.docSap}`}
                        >
                            Double click to clear date field
                        </UncontrolledTooltip>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" onClick={handlerInput} type="checkbox" defaultChecked={post.liberadoFaturamento===true?true:false} name="liberadoFaturamento" style={{
                            position: 'relative',
                            margin: 'auto',
                            display: 'block'
                        }}/>
                    </td>
                    <td style={{
                        display: 'flex',
                        flexDirection: 'row',
                        boxSizing: 'border-box',
                        padding: '5px',
                        height: '40px',
                        alignItems: 'center'
                    }}>
                        <Button size="sm" color="success" outline onClick={updateImpExecute}>
                            Save
                        </Button>
                        <Button size="sm" color="danger" outline onClick={closeEditMode}>
                            Cancel
                        </Button>
                    </td>
                </tr>
            )}
        </>
    )
}

const ImportationDetails = () => {
    const [impData, setImpData] = useState([]);
    const [loader, setLoader] = useState(false);

    const getImp = (options={loader: true}) => {
        if (options.loader) setLoader(true);
        api.get("/importationDetails/").then((response) => {
            setImpData(response.data);
            setLoader(false);
        }).catch((error) => {
            console.error(error);
            setLoader(false);
        });
    }

    useEffect(() => {
        let abortController = new AbortController();
        getImp();
        return () => abortController.abort();
    }, []);

    const deleteFactory = (idImp, docSap=undefined) => {
        if(!(window.confirm("Confirm to delete the Importation Date:"))) return null;
        api.delete(`/importationDetails/${idImp}`).then(() => {
            let historicData = {
                page: "Importation Details",
                before: `doc sap: "${docSap}"`,
                after: "Deleted this docSap.",
                action: "delete",
            }

            api.post(`/history/`, historicData).then(() => {
                window.alert('Deleted success.');
                getImp({loader: false});
            });
        }).catch(console.error);
    }

    return (
        <>
            <div style={{
                width: '100%',
                minHeight: '10px',
                boxSizing: 'border-box',
                padding: '5px',
                height: 'auto'
            }}>
                {loader ? (
                    <LoaderBox/>
                ):(
                    <table style={{
                        with: '100%',
                        minHeight: '10px',
                        maxHeight: '70vh',
                        height: 'auto',
                        margin: '0 auto',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0px 0px 5px gray',
                        fontFamily: 'calibri',
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#e1e1e1',
                                fontFamily: 'calibri',
                                fontSize: '0.9em'
                            }}>
                                <th style={{
                                    boxSizing: 'border-box',
                                    padding: '5px 15px',
                                    boxShadow: '0px 0px 1px black',
                                    position: 'sticky',
                                    textAlign: 'center',
                                    wordBreak: 'break-all',
                                    width: '150px'
                                }}>
                                    DOC SAP
                                </th>
                                <th style={{
                                    boxSizing: 'border-box',
                                    padding: '5px 15px',
                                    boxShadow: '0px 0px 1px black',
                                    position: 'sticky',
                                    textAlign: 'center',
                                    wordBreak: 'break-all',
                                    width: '150px'
                                }}>
                                    IMP
                                </th>
                                <th style={{
                                    boxSizing: 'border-box',
                                    padding: '5px 15px',
                                    boxShadow: '0px 0px 1px black',
                                    position: 'sticky',
                                    textAlign: 'center',
                                    wordBreak: 'break-all',
                                    width: '150px'
                                }}>
                                    ETA Trianom
                                </th>
                                <th style={{
                                    boxSizing: 'border-box',
                                    padding: '5px 15px',
                                    boxShadow: '0px 0px 1px black',
                                    position: 'sticky',
                                    textAlign: 'center',
                                    wordBreak: 'break-word',
                                    width: '150px'
                                }}>
                                    Released to invoice
                                </th>
                                <th/>
                            </tr>
                        </thead>
                        <tbody style={{
                            height: 'auto',
                            maxHeight: '200px',
                            overflow: 'scroll',
                            position: 'sticky'
                        }}>
                            {impData.length > 0?(
                                <>
                                    {impData.map((post, index) => (<ImportationLine key={`imp-${index}`} post={post} deleteFactory={deleteFactory} getImp={getImp}/>))}
                                </>
                            ):(
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center'}}>
                                        There are no records in memory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

export default ImportationDetails;