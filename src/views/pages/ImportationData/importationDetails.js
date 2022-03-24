import React, { useEffect, useState } from "react"

import { 
    Button,
    Input
 } from "reactstrap";

import { api } from "services/api";

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
            window.alert("Update Sucess!");
            e.target.disabled = false;
            closeEditMode();
            getImp();
        }).catch(console.error);
    }

    const formatData = (data) => {
        if(data.indexOf('-') > -1){
            data = data.split(' ');
            data = data[0].split('-');
            return `${data[2]}/${data[1]}/${data[0]}`;
        } else {
            return data
        }
    }

    const prevChegadaTrianon = formatData(post.prevChegadaTrianon);

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
                        <Button color="danger" size="sm" outline onClick={() => deleteFactory(post.id)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            ):(
                <tr>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input size="sm" onChange={handlerInput} defaultValue={post.docSap} name="docSap" max="99999" min="0" type="number" style={{
                            width: '75px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input size="sm" onChange={handlerInput} name="imp" defaultValue={post.imp} type="text" style={{
                            width: '150px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input size="sm" onChange={handlerInput} name="prevChegadaTrianon" defaultValue={post.prevChegadaTrianon} type="text" style={{
                            width: '150px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input size="sm" onClick={handlerInput} type="checkbox" defaultChecked={post.liberadoFaturamento===true?true:false} name="liberadoFaturamento" style={{
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
    const [impCreate, setImpCreate] = useState({
        docSap: "",
        imp: "",
        prevChegadaTrianon: "",
        liberadoFaturamento: false,
        automatic: false
    });
    const [registerState, setRegisterState] = useState(false);
    const openRegister = () => setRegisterState(true);
    const closeRegister = () => setRegisterState(false);

    useEffect(() => {
        const getImp = () => {
            api.get("/importationDetails/").then((response) => setImpData(response.data)).catch(console.error);
        }

        getImp();
    }, []);

    const getImp = () => {
        api.get("/importationDetails/").then((response) => setImpData(response.data)).catch(console.error);
    }

    const deleteFactory = (idImp) => {
        if(!(window.confirm("Confirm to delete the Importation Date:"))) return null;
        api.delete(`/importationDetails/${idImp}`).then(() => {
            window.alert('Deleted success.');
            getImp();
        }).catch(console.error);
    }

    const handlerInput = (e) => {
        if(e.target.type=== "number"){
            if(e.target.value === "") e.target.value = 0;
            if(e.target.value > 99999) e.target.value = 99999;
        }

        if (e.target.type === "checkbox") return setImpCreate({...impCreate, [e.target.id]: e.target.checked});

        setImpCreate({...impCreate, [e.target.id]: e.target.value});
    }

    const createImpDate = () => {
        api.post('/importationDetails/', impCreate).then(() => {
            window.alert("Create success!");
            getImp();
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
                                Released for billing
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
                                {impData.map((post) => (<ImportationLine post={post} deleteFactory={deleteFactory} getImp={getImp}/>))}
                            </>
                        ):(
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>
                                    There are no records in memory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {registerState?(
                    <tr>
                        <td style={{boxSizing: 'border-box', padding: '5px'}}>
                            <Input size="sm" id="docSap" onChange={handlerInput} max="99999" min="0" type="number" style={{
                                width: '75px',
                                margin: '0 auto'
                            }}/>
                        </td>
                        <td style={{boxSizing: 'border-box', padding: '5px'}}>
                            <Input size="sm" id="imp" onChange={handlerInput} type="text" style={{
                                width: '150px',
                                margin: '0 auto'
                            }}/>
                        </td>
                        <td style={{boxSizing: 'border-box', padding: '5px'}}>
                            <Input size="sm" id="prevChegadaTrianon" onChange={handlerInput} type="text" style={{
                                width: '150px',
                                margin: '0 auto'
                            }}/>
                        </td>
                        <td style={{boxSizing: 'border-box', padding: '5px'}}>
                            <Input size="sm" type="checkbox" onClick={handlerInput} id="liberadoFaturamento" style={{
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
                            <Button color="success" outline size="sm" onClick={createImpDate}>
                                Save
                            </Button>
                            <Button color="danger" outline size="sm" onClick={closeRegister}>
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
                </table>
            </div>
        </>
    )
}

export default ImportationDetails;