import React, { useEffect, useState } from 'react';

import { Button, Input } from 'reactstrap';
import { api } from "services/api";

const ImportationLine = ({post, deleteExt, getExtData}) => {
    const [extDataUpdate, setExtDataUpdate] = useState({
        SSKProject: post.SSKProject,
        externalServices: post.externalServices,
        documentNumber: post.documentNumber
    });

    const [editMode, setEditMode] = useState(false);
    const openEditMode = () => setEditMode(true);
    const closeEditMode = () => setEditMode(false);


    const handlerInput = (e) => {
        if (e.target.type === "checkbox") return setExtDataUpdate({...extDataUpdate, [e.target.name]: e.target.checked});
        if(e.target.name === "SSKProject") {
            if(e.target.value === "") return setExtDataUpdate({...extDataUpdate, [e.target.name]: "none"});
        }
        setExtDataUpdate({...extDataUpdate, [e.target.name]: e.target.value});
    }

    const updateExternalService = () => {
        api.patch(`/externalServices/${post.id}/`, extDataUpdate).then((response) => {
            Promise.all([
                // api.post("/history/", { before: post.SSKProject, after: extDataUpdate.SSKProject, page: "External Services", action: "update" }),
                api.post("/history/", { before: post.externalServices.toString(), after: extDataUpdate.externalServices.toString(), page: "External Services", action: "update" }),
                // api.post("/history/", { before: post.documentNumber, after: extDataUpdate.documentNumber, page: "External Services", action: "update" })
            ]).then(() => {
                window.alert("Update success!");
                closeEditMode();
                getExtData();
            }).catch(console.error);
        }).catch(console.error);
    }

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
                        {post.documentNumber}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.SSKProject}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.externalServices===true?"Sim":"Não"}
                    </td>
                    <td style={{
                        display: 'flex',
                        flexDirection: 'row',
                        boxSizing: 'border-box',
                        padding: '5px',
                        height: '40px',
                        alignItems: 'center'
                    }}>
                        <Button size="sm" color="primary" outline onClick={openEditMode}>
                            Edit
                        </Button>
                        <Button size="sm" color="danger" outline onClick={() => deleteExt(post.id)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            ):(
                <tr>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" name="documentNumber" defaultValue={post.documentNumber} onChange={handlerInput} type="text" style={{
                            width: '150px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" name="SSKProject" defaultValue={post.SSKProject} onChange={handlerInput} type="text" style={{
                            width: '150px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="checkbox" defaultChecked={post.externalServices} onClick={handlerInput} name="externalServices" style={{
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
                        <Button color="success" outline size="sm" onClick={updateExternalService}>
                            Save
                        </Button>
                        <Button color="danger" outline size="sm" onClick={closeEditMode}>
                            Cancel
                        </Button>
                    </td>
                </tr>
            )}
        </>
    )
}

const ExternalServices = () => {
    const [extData, setExtData] = useState([]);
    const [extCreate, setExtCreate] = useState({
        documentNumber: "",
        externalServices: false,
        SSKProject: "none"
    });
    const [registerState, setRegisterState] = useState(false);
    const openRegister = () => setRegisterState(true);
    const closeRegister = () => setRegisterState(false);

    const getExtData = () => {
        api.get('externalServices').then((response) => setExtData(response.data)).catch(console.error);
    }

    useEffect(() => {
        let abortController = new AbortController();
        getExtData();
        return () => abortController.abort();
    }, []);

    const deleteExt = (idExt) => {
        if(!(window.confirm("Confirm to delete the External Service:"))) return null;
        api.delete(`/externalServices/${idExt}`).then(() => {
            window.alert('Deleted success.');
            getExtData();
        }).catch(console.error);
    }

    const handlerInput = (e) => {
        if (e.target.type === "checkbox") return setExtCreate({...extCreate, [e.target.id]: e.target.checked});
        if(e.target.id === "SSKProject") {
            if(e.target.value === "") return setExtCreate({...extCreate, [e.target.id]: "none"});
        }
        setExtCreate({...extCreate, [e.target.id]: e.target.value});
    }

    const createExternalService = () => {
        api.post('/externalServices/', extCreate).then(() => {
            Promise.all([
                // api.post("/history/", { after: extCreate.SSKProject, page: "External Services", action: "create" }),
                api.post("/history/", { after: extCreate.externalServices.toString(), page: "External Services", action: "create" }),
                // api.post("/history/", { after: extCreate.documentNumber, page: "External Services", action: "create" })
            ]).then(() => {
                window.alert("Create Success!");
                getExtData();
                closeRegister();
            }).catch(console.error);
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
                                Document Number
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
                                SSK (Projects)
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
                                External Services
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
                        {extData.length > 0 ? (
                            <>
                                {extData.map((post, index) => (<ImportationLine key={`importation-${index}`} post={post} deleteExt={deleteExt} getExtData={getExtData} />))}
                            </>
                        ):(
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center'}}>
                                    There are no records in memory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tbody>
                        {registerState?(
                        <tr>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" id="documentNumber" onChange={handlerInput} type="text" style={{
                                    width: '150px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" id="SSKProject" onChange={handlerInput} type="text" style={{
                                    width: '150px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="checkbox" onClick={handlerInput} id="externalServices" style={{
                                    position: 'relative',
                                    margin: 'auto',
                                    display: 'block'
                                }}/>
                            </td>
                            <td style={{
                                boxSizing: 'border-box',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                                }}>
                                <Button color="success" size="sm" outline onClick={createExternalService}>
                                    Save
                                </Button>
                                <Button color="danger" size="sm" outline onClick={closeRegister}>
                                    Cancel
                                </Button>
                            </td>
                        </tr>
                        ):(
                        <tr>
                            <td style={{boxSizing: 'border-box', padding: '5px'}} colSpan="5">
                                <div onDoubleClick={openRegister} style={{
                                    width: '100%',
                                    height: '30px',
                                    backgroundColor: 'rgb(255, 255, 255)',
                                    boxShadow: '0px 0px 2px gray',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                    paddingLeft: '5px'
                                }}>
                                    Double click unlock register.
                                </div>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ExternalServices;