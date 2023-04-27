import React, { useEffect, useState } from 'react';
import { Table, Media, Button, Input, Container} from 'reactstrap';
import { api } from 'services/api';
import { InfoAlert, SuccessAlert, DangerAlert } from '../components/custom/alerts';
import LoaderBox from '../components/custom/loader/loaderBox';

const ListStatus = () => {
    const [statusData, setStatusData] = useState([]);

    const [openSuccessAlert, setSuccessAlert] = React.useState(false);
    const handleOpenSuccessAlert = (msg="Success!!!") => setSuccessAlert({status: true, message: msg});
    const handleCloseSuccess = () => setSuccessAlert({status: false});

    const [openInfoAlert, setInfoAlert] = React.useState(false);
    // const handleOpenInfoAlert = (msg="Info!!!") => setInfoAlert({status: true, message: msg});
    const handleCloseInfo = () => setInfoAlert({status: false});

    const [openDangerAlert, setDangerAlert] = React.useState(false);
    const handleOpenDangerAlert = (msg="Danger!!!") => setDangerAlert({status: true, message: msg});
    const handleCloseDanger = () => setDangerAlert({status: false});

    const [loader, setLoader] = useState(false);

    const getStatus = async () => {
        setLoader(true);
        api.get('/status/').then((response) => {
            setStatusData(response.data);
            setLoader(false);
        }).catch((error) => {
            console.error(error);
            setLoader(false);
        });
    }

    useEffect(() => {
        let abortController = new AbortController();
        getStatus();
        return () => abortController.abort();
    }, []);

    const NewStatus = () => {
        const [inputNew, setInputNew] = useState({
            state: false,
            colSpan: '3',
        });
        
        const newStatus = {
            name: ""
        };

        const enableNew = () => setInputNew({state: true, colSpan: '2'});
        const disableNew = () => setInputNew({state: false, colSpan: '3'});

        const createStatus = (e) => {
            const inputName = document.getElementById('inputName');
            const inputDescription = document.getElementById('inputDescription');
            const errorMessage = document.getElementById('errorMessage');
            if(inputName.value.length === 0){
                inputName.style.borderColor = '#ff0000';
                errorMessage.style.opacity = '1'
            } else {
                e.target.disabled = true;
                newStatus.name = inputName.value;
                if(inputDescription.value.length>0) newStatus.description = inputDescription.value;
                api.post('/status/', newStatus)
                .then(() => {
                    api.post("/history/", { page: "Status Management", after: `Created a new status: ${newStatus.name}`, action: "create" }).then(() => {
                        e.target.disabled = false;
                        getStatus();
                        handleOpenSuccessAlert('Status created success!');
                      }).catch(console.error);
                }).catch((error) => {
                    if(error.response) return handleOpenDangerAlert("This name is already in use!");
                    e.target.disabled = false;
                })
            }
        }
    
        return (
            <tr>
                <td colSpan={inputNew.colSpan} style={{padding:'0 16px'}}>
                    {inputNew.state===true?(
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            <div style={{width:'20%',
                                marginRight: '15px'
                            }}>
                                <Input placeholder="Name" bsSize='sm' type="text" id='inputName' style={{
                                    marginTop: '16px',
                                    transition: '0.5s',
                                }}/>
                                <div id="errorMessage" style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    color: "#ff0000",
                                    transition: '0.5s',
                                    opacity: '0',
                                    userSelect: 'none',
                                }}>
                                    Insert the name of the status!
                                </div>
                            </div>
                            <Input placeholder="Description" bsSize='sm' type="text" id='inputDescription' style={{
                                marginTop: '16px',
                                transition: '0.5s',
                                width: '75%'
                            }}/>
                        </div>
                    ):(
                        <div onDoubleClick={enableNew} style={{
                            border: '1px solid #dee2e6',
                            borderRadius: '5px',
                            color: '#8898aa',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box',
                            padding: '4px',
                            fontSize: '1.1em',
                            userSelect: 'none',
                            cursor: 'pointer',
                            margin: '17px 0'
                        }}>
                            &nbsp;Double click to create a new status.
                        </div>
                    )}
                </td>
                <td className="text-right" style={{padding:'0'}}>
                {inputNew.state===true? (
                    <Container style={{
                        width: '100%',
                        height: '100%',
                        padding: "0",
                    }}>
                        <Button color="success" outline size='sm' type="button" onClick={createStatus}>
                            Save
                        </Button>
                        <Button color="danger" outline size='sm' type="button" onClick={disableNew} style={{marginRight: '16px'}}>
                            Cancel
                        </Button>
                    </Container>
                ):null}
                </td>
            </tr>
        );
    
    }

    const ListItem = ({post}) => {
        const [editStatus, setEditStatus] = useState(false);
        const openEdit = () => setEditStatus(true);
        const closeEdit = () => setEditStatus(false);

        const [handleDelete, setHandlerDelete] = useState(false);
        const confirmDelete = () => setHandlerDelete(true);
        const closeDelete = () => setHandlerDelete(false);

        const deleteStatus = (e) => {
            e.target.disabled = true;
            api.patch(`/status/${e.target.value}/`, {is_active: false}).then(() => {
                let historicData = {
                    page: "Status Management",
                    before: null,
                    after: `${post.name} status disabled`,
                    action: "update",
                    so: []
                }

                api.post(`/history/`, historicData).then(() => {
                    e.target.disabled = true;
                    getStatus();
                    handleOpenSuccessAlert('Success for disable status!!!');
                }).catch(console.error);
            }
            ).catch(console.error);
        }

        const activeStatus = (e) => {
            e.target.disabled = true;
            api.patch(`/status/${e.target.value}/`, {is_active: true}).then(() => {
                let historicData = {
                    page: "Status Management",
                    before: null,
                    after: `${post.name} status enabled`,
                    action: "update",
                    so: []
                }

                api.post(`/history/`, historicData).then(() => {
                    e.target.disabled = true;
                    getStatus();
                    handleOpenSuccessAlert('Success for active status!!!');
                }).catch(console.error);
            }
            ).catch(console.error);
        }

        const updateStatus = (e) => {
            e.target.disabled = true;

            const data = {
                name: ""
            }

            const inputName = document.getElementById('updateName');
            const inputDescription = document.getElementById('updateDescription');

            data.name = inputName.value;
            if(inputDescription.value.length>0) data.description = inputDescription.value;

            api.patch(`/status/${post.idStatus}/`, data).then((response) => {
                let historicData = {
                    page: "Status Management",
                    before: null,
                    after: null,
                    action: null,
                    so: []
                }

                if(post.name !== data.name) historicData.so.push({
                    before: `Old status name: "${post.name}"`,
                    after: `New status name: "${data.name}"`,
                    action: "update",
                });

                if(post.description !== data.description) historicData.so.push({
                    before: `Old status description: "${post.description}"`,
                    after: `New status description: "${data.description}" for Status: "${data.name}"`,
                    action: "update",
                });

                const historicBody = historicData.so.shift();
                if(historicBody) {
                    historicData.before = historicBody.before;
                    historicData.after = historicBody.after;
                    historicData.action = historicBody.action;

                    api.post(`/history/`, historicData).then(() => {
                        e.target.disabled = false;
                        getStatus();
                        handleOpenSuccessAlert("Success for update status!!!");
                    }).catch(console.error);
                } else {
                    e.target.disabled = false;
                    getStatus();
                }
            }).catch(console.error);

        }

        return (
            <tr style={{borderBottom: '1px solid #e2e2e2'}}>
                <th scope="row">
                    <Media className="align-items-center" style={{textAlign: 'center'}}>
                        <Media>
                            {editStatus===true?(
                                <Input defaultValue={post.name} id="updateName" bsSize='sm' type="text" style={{
                                    width: '100px',
                                    textAlign: 'center'
                                }}/>
                            ):(
                                <span className="mb-0 text-sm">
                                    {post.name}
                                    {post.is_active===false?(<div style={{
                                        color: 'red',
                                        border: "1px solid red",
                                        boxSizing: "border-box",
                                        padding: "2px",
                                        borderRadius: "8px",
                                        fontSize: "0.9em",
                                        cursor: "default",
                                        userSelect: "none",
                                        marginTop: "5px"
                                    }}>
                                        Disabled
                                    </div>):null}
                                </span>
                            )}
                        </Media>
                    </Media>
                </th>
                <td>
                    <Media className="align-items-center">
                        <Media>
                            {editStatus===true?(
                                <Input defaultValue={post.description} id="updateDescription" bsSize='sm' type="text" style={{
                                    width: '40vw',
                                    textAlign: 'center'
                                }}/>
                            ):(
                                <span className="mb-0 text-sm">
                                    {post.description}
                                </span>
                            )}
                        </Media>
                    </Media>
                </td>
                <td className="text-right">
                    {handleDelete===false?(
                        <div>
                            {editStatus === true?(
                                <div>
                                    <Button color="success" outline onClick={updateStatus} size='sm' type="button">
                                        Confirm
                                    </Button>
                                    <Button color="danger" outline size='sm' type="button" onClick={closeEdit} value={post.idStatus}>
                                        Cancel
                                    </Button>
                                </div>
                            ):(
                                <div>
                                    <Button color="primary" outline onClick={openEdit} size='sm' type="button">
                                        Edit
                                    </Button>
                                    {post.is_active===true?(
                                        <Button color="danger" outline size='sm' type="button" value={post.idStatus} onClick={confirmDelete}>
                                            Disable
                                        </Button>
                                    ):(
                                        <Button color="success" outline size='sm' type="button" value={post.idStatus} onClick={activeStatus}>
                                            Active
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ):(
                        <div>
                            <Button color="danger" size='sm' type="button" value={post.idStatus} onMouseOut={closeDelete} onClick={deleteStatus}>
                                Confirm
                            </Button>
                        </div>
                    )}
                    <InfoAlert 
                    open={openInfoAlert.status}
                    onClose={handleCloseInfo}
                    message="Click to confirm delete status!"/>
                    <SuccessAlert
                    open={openSuccessAlert.status}
                    onClose={handleCloseSuccess}
                    message={openSuccessAlert.message}/>
                    <DangerAlert
                    open={openDangerAlert.status}
                    onClose={handleCloseDanger}
                    message={openDangerAlert.message}/>
                </td>
            </tr>
        )
    }

    return (
        <>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                padding: '30px'
            }}>
                {loader ? (
                    <LoaderBox/>
                ):(
                    <div style={{
                        width: '100%',
                        maxWidth: '1200px',
                        height: '60vh',
                        overflow: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 5px gray',
                        boxSizing: 'border-box',
                    }}>
                        <Table className="align-items-center" responsive>
                            <thead className="thead-light">
                                <NewStatus/>
                                <tr>
                                <th scope="col" style={{width:"50px", textAlign: 'center'}}>Name</th>
                                <th scope="col">Description</th>
                                <th scope="col" style={{width:"50px", textAlign: 'center'}}/>
                                </tr>
                            </thead>
                            <tbody>
                                {statusData.length>0
                                ?statusData.map((post, index) => (<ListItem key={`statuslist-${index}`} post={post}/>))
                                :(
                                    <tr>
                                        <td colSpan='3' style={{padding:'0'}}>
                                            <div style={{
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                padding: '5px',
                                                textAlign: 'center'
                                            }}>
                                                <h3>
                                                    No status registered.
                                                </h3>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

export default ListStatus;