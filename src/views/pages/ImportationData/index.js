import React, { useEffect, useState } from 'react';
import {api} from '../../../services/api';

import {
    Button,
    Input,
} from "reactstrap";


const FactoryItem = ({deleteFactory, post, getFactory}) => {
    const [factoryUpdateData, setFactoryUpdateData] = useState({
        PC: post.PC,
        fabrica: post.fabrica,
        dataEmbarque: post.dataEmbarque,
        fields: post.fields
    });

    const [editState, setEditState] = useState(false);
    const openEditMode = () => setEditState(true);
    const closeEditMode = () => setEditState(false);

    const fields = post.fields.split(',');

    const handlerFields = (e) => {
        if(e.target.value === "") e.target.value = 0;
        if(e.target.value > 100) e.target.value = 100;

        const fields = Array.from(document.getElementsByClassName(("inputFieldEdit" + post.id)));
        let values = "";
        fields.forEach((field) => {
            values += field.value + ",";
        });
        values = values.slice(0, (values.length - 1));
        setFactoryUpdateData({...factoryUpdateData, fields: values.toString()});
    }

    const handlerInput = (e) => {
        if(e.target.id===("PC" + post.id)){
            if(e.target.value === "") e.target.value = 0;
            if(e.target.value > 9999) e.target.value = 9999;
        }
        setFactoryUpdateData({...factoryUpdateData, [e.target.name]: e.target.value});
    }

    const updateFactory = () => {       
        api.patch(`/factoryDate/${post.id}/`, factoryUpdateData).then(() => {
            window.alert("Factory updated success.");
            getFactory();
            closeEditMode();
        }).catch(console.error)
    }

    return (
        <tr>
            {editState===false?(
                <>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.PC}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.fabrica}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {post.dataEmbarque}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[0]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[1]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[2]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[3]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[4]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[5]}
                    </td>
                    <td style={{
                        boxSizing: 'border-box',
                        padding: '5px 15px',
                        boxShadow: '0px 0px 1px black',
                        textAlign: 'center'
                    }}>
                        {fields[6]}
                    </td>
                    <td style={{
                        display: 'flex',
                        flexDirection: 'row',
                        boxSizing: 'border-box',
                        padding: '5px',
                        height: '40px',
                        alignItems: 'center'
                    }}>
                        <Button color="primary" onClick={openEditMode} size="sm" outline>
                            Edit
                        </Button>
                        <Button size="sm" outline color="danger" onClick={() => {deleteFactory(post.id)}}>
                            Delete
                        </Button>
                    </td>
                </>
            ):(
                <>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" id={"PC" + post.id} name="PC" onChange={handlerInput} max="9999" min="0" type="number" defaultValue={post.PC} style={{
                            width: '70px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" id={"fabrica" + post.id} name="fabrica" onChange={handlerInput} defaultValue={post.fabrica} type="text" style={{
                            width: '150px',
                            margin: '0 auto',
                            textAlign: 'center'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" id={"dataEmbarque" + post.id} name="dataEmbarque" onChange={handlerInput} defaultValue={post.dataEmbarque} type="text" style={{
                            width: '150px',
                            margin: '0 auto',
                            textAlign: 'center'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[0]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[1]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[2]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[3]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[4]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[5]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
                        }}/>
                    </td>
                    <td style={{boxSizing: 'border-box', padding: '5px'}}>
                        <Input bsSize="sm" type="number" className={"inputFieldEdit" + post.id} onChange={handlerFields} defaultValue={fields[6]} min="0" max="100" style={{
                            width: '60px',
                            margin: '0 auto'
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
                        <Button size="sm" color="success" outline onClick={updateFactory}>
                            Save
                        </Button>
                        <Button size="sm" color="danger" outline onClick={closeEditMode}>
                            Cancel
                        </Button>
                    </td>
                </>
            )}
        </tr>
    )
}

const FactoryPage = () => {
    const [factoryDataState, setFactoryDataState] = useState([]);
    const [factoryCreateState, setFactoryCreateState] = useState({
        PC: "",
        fabrica: "",
        dataEmbarque: "",
        fields: ""
    });
    const [registerState, setRegisterState] = useState(false);
    const openRegister = () => setRegisterState(true);
    const closeRegister = () => setRegisterState(false);

    useEffect(() => {
        let abortController = new AbortController();
        const getFactory = () => {
            api.get('/factoryDate/').then((response) => setFactoryDataState(response.data)).catch(console.error);
        };

        getFactory();
        return () => abortController.abort();
    }, []);

    const getFactory = () => {
        api.get('/factoryDate/').then((response) => setFactoryDataState(response.data)).catch(console.error);
    };

    const handlerFields = (e) => {
        if(e.target.value === "") return e.target.value = 0;
        if(e.target.value > 100) return e.target.value = 100;
    }

    const handlerInput = (e) => {
        if(e.target.id==="PC"){
            if(e.target.value === "") e.target.value = 0;
            if(e.target.value > 9999) e.target.value = 9999;
        }
        setFactoryCreateState({...factoryCreateState, [e.target.id]: e.target.value});
    }

    const saveFactory = () => {
        const fields = Array.from(document.getElementsByClassName('inputField'));
        let values = "";
        fields.forEach((field) => {
            values += field.value + ",";
        });
        values = values.slice(0, (values.length - 1));
        setFactoryCreateState({...factoryCreateState, fields: values.toString()});

        if(factoryCreateState.fabrica.length === 0) return window.alert('Insira o nome da fábrica!');
        if(factoryCreateState.dataEmbarque.length === 0) return window.alert('Insira a data de embarque!');
        if(factoryCreateState.PC.length === 0) return window.alert('Insira um PC!');
       
        api.post('/factoryDate/', factoryCreateState).then(() => {
            api.post("/history/", { page: "Boarding Date PC", after: `Created a new fabric: ${factoryCreateState.fabrica}`, action: "create" }).then(() => {
                window.alert("Factory created Success.");
                getFactory();
            }).catch(console.error);
        }).catch(console.error)

    }

    const deleteFactory = (idFactory) => {
        if(!(window.confirm("Confirm to delete the factory data:"))) return null;
        api.delete(`/factoryDate/${idFactory}`).then(() => {
            api.post("/history/", { page: "Boarding Date PC", after: `Deleted a fabric.`, action: "delete" }).then(() => {
                window.alert('Deleted success.');
                getFactory();
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
                                textAlign: 'center'
                            }}>
                                PC
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Factory
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Date of shipment
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Monday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Tuesday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Wednesday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Thursday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Friday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Saturday
                            </th>
                            <th style={{
                                boxSizing: 'border-box',
                                padding: '5px 15px',
                                boxShadow: '0px 0px 1px black',
                                position: 'sticky',
                                textAlign: 'center'
                            }}>
                                Sunday
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
                        {factoryDataState.length > 0?(
                            <>
                                {factoryDataState.map((post, index) => (<FactoryItem key={`factory-${index}`} deleteFactory={deleteFactory} getFactory={getFactory} post={post}/>))}
                            </>
                        ): (
                            <tr>
                                <td colSpan="11" style={{
                                    textAlign: 'center',
                                    boxSizing: 'border-box',
                                    padding: '5px'
                                }}>
                                    There are no records in memory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tbody>
                    {registerState?
                        (<tr>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" id="PC" max="9999" min="0" type="number" onChange={handlerInput} style={{
                                    width: '70px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" id="fabrica" onChange={handlerInput} type="text" style={{
                                    width: '150px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" id="dataEmbarque" onChange={handlerInput} type="text" style={{
                                    width: '150px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto'
                                }}/>
                            </td>
                            <td style={{boxSizing: 'border-box', padding: '5px'}}>
                                <Input bsSize="sm" type="number" className="inputField" defaultValue="0" onChange={handlerFields} min="0" max="100" style={{
                                    width: '60px',
                                    margin: '0 auto',
                                }}/>
                            </td>
                            <td style={{
                                boxSizing: 'border-box',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                                }}>
                                <Button onClick={saveFactory} size='sm' color='success' outline>
                                    Save
                                </Button>
                                <Button onClick={closeRegister} size='sm' color='danger' outline>
                                    Cancel
                                </Button>
                            </td>
                        </tr>):(<tr>
                            <td style={{boxSizing: 'border-box', padding: '5px'}} colSpan="11">
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
    )
}

const ImportationData = () => {
    return (
        <>
            <FactoryPage/>
        </>
    );
}

export default ImportationData;