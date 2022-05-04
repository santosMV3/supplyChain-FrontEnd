import React, { useEffect, useState } from 'react';

import {
    Button,
    ListGroupItem,
    ListGroup,
    Col,
    Container,
    Navbar,
    NavbarBrand,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Input,
    InputGroupText,
    InputGroupAddon
} from "reactstrap";

import {
    BodyInfo,
    OtherInfo
} from "./components"

import "./components/style.css";

import { api } from 'services/api';

import { Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Modal,
    Fade,
    Backdrop,
    makeStyles
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import {DangerAlert} from '../components/custom/alerts/index'
import CreatePermission from './create';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      borderRadius: '10px',
      width: '40vw',
      minHeight: '25vh',
      height: 'auto',
      overflow: 'hidden'
    },
}));

const ListPermissions = () => {
    const [permissionsState, setPermissionState] = useState([]);
    const [registerState, setRegisterState] = useState(false);

    useEffect(() => {
        let abortController = new AbortController();
        const getPermissions = async () => {
            try {
                api.get('/permissions/').then((response) => {
                    setPermissionState(response.data);
                }).catch(console.error);
            } catch (error) {
                console.error(error);
            }
        }

        getPermissions();
        return () => abortController.abort();
    }, []);

    const getPermissions = () => {
        try {
            api.get('/permissions/').then((response) => {
                setPermissionState(response.data);
            }).catch(console.error);
        } catch (error) {
            console.error(error);
        }
    }

    const openRegister = () => setRegisterState(true);
    const closeRegister = () => {
        getPermissions();
        setRegisterState(false);
    };

    const PageItem = ( {post} ) => {
        const pageData = post.split('.');
        const pagePermissions = pageData[1];

        const [pageState, setPagesState] = useState([]);
          
        useEffect(() => {
            let abortController = new AbortController();
            const getPage = async () => {
                try {
                    api.get(`/pages/${pageData[0]}`).then((response) => {
                        return setPagesState(response.data);
                    }).catch(console.error);
                } catch (error) {
                    console.error(error);
                }
            }
            getPage();
            return () => abortController.abort();
        },[]);
            
    return (
        <ListGroupItem style={{
            width: "100%",
            height: "70px",
            padding: "0",
            marginBottom: '5px',
            overflow: "hidden",
            borderRadius: '5px',
            boxShadow: "0px 0px 5px gray"
        }}>
            <div style={{
                width: "100%",
                fontSize: "1.0em",
                boxSizing: "border-box",
                padding: "3px 10px",
                marginBottom: "5px"
            }}>
                <span style={{fontWeight: "bold"}}>Page:</span> {pageState.name}
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-around"
            }}>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        disabled="true"
                        checked={pagePermissions?pagePermissions.includes('v'):false}
                    />
                    <label className="custom-control-label">
                        View
                    </label>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        disabled="true"
                        checked={pagePermissions?pagePermissions.includes('c'):false}
                    />
                    <label className="custom-control-label">
                        Create
                    </label>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        disabled="true"
                        checked={pagePermissions?pagePermissions.includes('e'):false}
                    />
                    <label className="custom-control-label">
                        Edit
                    </label>
                </div>
                <div className="custom-control custom-checkbox">
                    <input
                        className="custom-control-input"
                        type="checkbox"
                        disabled="true"
                        checked={pagePermissions?pagePermissions.includes('d'):false}
                    />
                    <label className="custom-control-label">
                        Delete
                    </label>
                </div>
            </div>
        </ListGroupItem>
        )
    }

    const PermissionItem = ({ post }) => {
        const classes = useStyles();
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        const [dangerAlert, setDangerAlert] = useState({
            status: false,
            message: ""
        });
        const openDangerAlert = (msg="DANGER!!!") => setDangerAlert({status: true, message: msg});
        const closeDangerAlert = () => setDangerAlert({status: false});

        const postDate = post.createdAt.split('-');
        const localDate = `${postDate[2]}/${postDate[1]}/${postDate[0]}`

        const [usersAssociated, setUsersAssociated] = useState("");

        const pageData = post.idPages.split(',');

        const EditPermissionsModal = () => {
            const permissionsState = {
                "name": "",
                "idPages": ""
            }
            const [pagesState, setPagesState] = useState([]);

            useEffect(() => {
                let abortController = new AbortController();
                const getPages = async () => {
                    api.get('/pages').then((response) => {
                        setPagesState(response.data);
                    }).catch(console.error);
                }
                getPages();
                return () => abortController.abort();
            }, []);

            const PageInput = ({ post, data }) => {
                let pageData = ['-2'];
                data.forEach((page) => {
                    if(page.includes(post.idPage)) pageData = page;
                });
                if(pageData[0]!== '-2') pageData = pageData.split('.');

                const [expanded, setExpanded] = useState('');
                const handlerExpand = (e) => {
                    const crud = ['view', 'create', 'edit', 'delete'];

                    if ((e.target.id).toLowerCase() === "admin"){
                        const inputPages = [].slice.call(document.getElementsByClassName('pageInput'));
                        if (e.target.checked === true){
                            inputPages.forEach((page) => {
                                page.checked=true;
                                if(page.id !== "admin") page.disabled=true

                                crud.forEach((option) => {
                                    const optionCheck = document.getElementById(page.id + option);
                                    optionCheck.checked = true;
                                });
                            });
                        }
                        else {
                            inputPages.forEach((page) => {
                                page.checked=false;
                                if(page.id !== "admin") page.disabled=false
                                crud.forEach((option) => {
                                    const optionCheck = document.getElementById(page.id + option);
                                    optionCheck.checked = false;
                                });
                            });
                        }
                    } else {
                        if(e.target.checked){
                            setExpanded('true');
                            crud.forEach((option) => {
                                const optionCheck = document.getElementById(e.target.id + option);
                                optionCheck.disabled = false
                            });
                        }
                        else {
                            setExpanded('');
                            crud.forEach((option) => {
                                const optionCheck = document.getElementById(e.target.id + option);
                                optionCheck.checked = false
                                optionCheck.disabled = true
                            });
                        }
                    }
                }

                return (
                    <div style={{
                        width: "100%",
                        minHeight: "70px",
                        height: "auto",
                        borderRadius: "5px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 0px 3px black",
                        marginBottom: "10px"
                    }}>
                        <div style={{
                            width: "100%",
                            borderRadius: "10px",
                            alignItems: "center",
                            overflow: 'hidden'
                        }}>
                            <Accordion expanded={expanded} style={{
                                width: "100%",
                                minHeight: "10px",
                                height: 'auto'
                            }}>
                                <AccordionSummary style={{boxShadow: "0px 0px 3px gray"}}>
                                    <div className="col ml--2">
                                        <h4 className="mb-0" style={{textTransform: "uppercase"}}>
                                            {post.name}
                                        </h4>
                                    </div>
                                    <FormControlLabel 
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                        style={{margin:'0'}}
                                        control={
                                        <Col className="col-auto" style={{padding: '0'}}>
                                            <label className="custom-toggle">
                                                <input  type="checkbox" onChange={handlerExpand} value={post.idPage} className="pageInput" id={post.name}/>
                                                <span
                                                    className="custom-toggle-slider rounded-circle"
                                                    data-label-off="No"
                                                    data-label-on="Yes"
                                                />
                                            </label>
                                        </Col>
                                        }
                                    />
                                </AccordionSummary>
                                <AccordionDetails style={{backgroundColor: "#fcfcfc", userSelect:"none"}}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around"
                                }}>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name+"view"}
                                            type="checkbox"
                                            value="v"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name+"view"}>
                                            View
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name+"create"}
                                            type="checkbox"
                                            value="c"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name+"create"}>
                                            Create
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name+"edit"}
                                            type="checkbox"
                                            value="e"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name+"edit"}>
                                            Edit
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name+"delete"}
                                            type="checkbox"
                                            value="d"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name+"delete"}>
                                            Delete
                                        </label>
                                    </div>
                                </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                );
            }

            const executeCreate = (e) => {
                e.preventDefault();
                let permissions = "";
        
                const inputPages = [].slice.call(document.getElementsByClassName('pageInput'));
        
                inputPages.forEach((input) => {
                    if (input.checked === true){
                        const crud = ['view', 'create', 'edit', 'delete'];
                        let subPermissions = "";
                        crud.forEach((option) => {
                            const optionCheck = document.getElementById(input.id + option);
                            if(optionCheck.checked === true){
                                subPermissions += optionCheck.value;
                            }
                        });
                        permissions+=`${input.value}.${subPermissions},`;
                    }
                });
        
                permissions = permissions.slice(0, permissions.length-1);
                if (permissions === "") return window.alert("Selecione alguma permissão.");
        
                permissionsState.name = document.getElementById('name').value;
                permissionsState.idPages = permissions

        
                api.patch(`/permissions/${post.idPermission}/`, permissionsState).then(() => {
                    window.alert("Permission has updated successfully!");
                    getPermissions();
                    handleClose();
                }).catch(console.error);
                
            }

            return (
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <Navbar className="navbar-horizontal navbar-dark bg-default"expand="lg" style={{
                                width: '100%',
                                height: '50px'
                            }}>
                                <Container>
                                    <NavbarBrand style={{cursor: 'default', userSelect:'none'}}>
                                        Edit Permission
                                    </NavbarBrand>
                                    <Button color="danger" size="sm" type="button" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Container>
                            </Navbar>
                            <CardBody className="px-lg-5 py-lg-5" style={{borderBottom: "0.5px solid #DFDFDF"}}>
                                <Form role="form" onSubmit={executeCreate}>
                                    <FormGroup>
                                        <InputGroup className="input-group-merge input-group-alternative mb-3">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                            <i className="ni ni-hat-3" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Name:"
                                            type="text"
                                            id="name"
                                            required
                                            defaultValue={post.name}
                                        />
                                        </InputGroup>
                                    </FormGroup>
                                    <div style={{
                                        width: '100%',
                                        height: "300px",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: 'space-around',
                                        overflow: "auto",
                                        boxSizing: "border-box",
                                        padding: "5px"
                                    }}>
                                        <div style={{
                                            width: '220px'
                                        }}>
                                            {pagesState.map((data, index) => (<PageInput key={`pageinput-${index}`} post={data} data={pageData}/>))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Button className="mt-4" color="info" type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </div>
                    </Fade>
                </Modal>
            );
        }

        const ConfirmDeleteModal = (e) => {
            api.get(`/user-permission/?idPermission=${post.idPermission}`)
            .then( async (response) => {
                if(response.data.length > 0){
                    e.target.disabled = true;
                    response.data.forEach((permissionUser) => {
                        api.get(`/users/${permissionUser.idUser}/`)
                        .then((user) => {
                            const namesData = user.data.first_name!==undefined?user.data.first_name+ " " + user.data.last_name:user.data.username;
                            setUsersAssociated("bah");
                            openDangerAlert(namesData);
                        })
                        .catch(console.error);
                        openDangerAlert(usersAssociated);
                    });
                }
                else {
                    if(window.confirm('Do you want to delete this permission?')){
                        api.delete(`/permissions/${post.idPermission}/`).then(() => {
                            getPermissions();
                            window.alert('Permission deleted has successfully.');
                        }).catch(console.error);
                    }
                }
            })
            .catch(console.error);
        }

        return (
            <ListGroupItem>
                <Accordion style={{
                    width: "100%",
                    height: "inherit",
                }}>
                    <AccordionSummary expandIcon={<ExpandMore/>} style={{boxShadow: "0px 0px 3px gray",}}>
                        <div className="col ml--2">
                            <h4 className="mb-0">
                                {post.name}
                            </h4>
                        </div>
                        <FormControlLabel 
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            style={{margin:'0'}}
                            control={
                            <Col className="col-auto" style={{padding: '0'}}>
                                <Button color="success" outline size="sm" type="button" onClick={handleOpen}>
                                    Edit
                                </Button>
                                <EditPermissionsModal/>
                            </Col>
                            }
                        />
                        <FormControlLabel 
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            style={{margin:'0'}}
                            control={
                            <Col className="col-auto" style={{padding: '5'}}>
                                <Button color="danger" outline size="sm" type="button" onClick={ConfirmDeleteModal}>
                                    Delete
                                </Button>
                            </Col>
                            }
                        />
                    </AccordionSummary>
                    <AccordionDetails style={{backgroundColor: "#5e72e4"}}>
                        <BodyInfo>
                            {pageData.map((post, index) => (<PageItem key={`pagedataitem-${index}`} post={post}/>))}
                            <OtherInfo style={{
                                width: '100%',
                                height: '1ch',
                                textAlign: 'center',
                                color: '#fff'
                            }}>
                                <span style={{fontWeight:"bold"}}>Created:</span> {localDate}
                            </OtherInfo>
                        </BodyInfo>
                    </AccordionDetails>
                </Accordion>
                <DangerAlert
                open={dangerAlert.status}
                onClose={closeDangerAlert}
                message={dangerAlert.message}/>
            </ListGroupItem>
        )
    }

    return (
        <>
            <div style={{
                width: '100%',
                height: '50px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "flex-end",
                boxSizing: "border-box",
                padding: '0 15px'
            }}>
                {registerState?(
                    <Button color="danger" onClick={closeRegister} size="sm" type="button">
                        Close
                    </Button>
                ):(
                    <Button color="primary" onClick={openRegister} size="sm" type="button">
                        New Permission
                    </Button>
                )}
            </div>
            {registerState?(
                <CreatePermission/>
            ):(
                <Container style={{
                    width: "inherit",
                    height: "450px",
                    display: "block",
                }}>
                    <ListGroup className="list" flush style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '5px',
                    }}>
                        {permissionsState.length>0 ? permissionsState.map((post, index) => (<PermissionItem key={`permission-${index}`} post={post}/>)):(
                            <h2 style={{textAlign: "center", marginTop: "10px"}}>Nenhuma permissão cadastrada.</h2>
                        )}
                    </ListGroup>
                </Container>
            )}
        </>
    )
}

export default ListPermissions;