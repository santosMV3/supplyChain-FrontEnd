import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
// reactstrap components

import {
    Button,
    ListGroupItem,
    ListGroup,
    Col,
    Container,
    NavbarBrand,
    Navbar,
    Form,
    Input,
    FormGroup,
    Label,
    Table,
    Media
} from "reactstrap";

import { Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    makeStyles,
    Backdrop,
    Fade,
    Modal,
} from '@material-ui/core';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { ExpandMore } from '@material-ui/icons';

import {useHistory} from "react-router-dom";
import {api} from "../../../services/api";

import {
    BodyInfo,
} from './components'

import ManageUsers from ".";

const createStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '600px',
      margin: 'auto auto',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      width: '100%',
      overflow: 'auto',
      padding: '0',
      borderRadius: 'inherit',
    },
}));

const useStyles = makeStyles((theme) => ({
    formControl: {
    marginBottom: '20px',
      minWidth: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const ListUsers = () => {
    const history = useHistory();
    const [usersData, setUsersData] = useState([]);

    const [createModalState, setCreateModal] = useState(false);
    const openCreateModal = () => setCreateModal(true);
    const closeCreateModal = () => setCreateModal(false);

    const CreateModal = ({...props}) => {
        const classes = createStyles();
        return (
            <div>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.open}
                onClose={props.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                >
                <Fade in={props.open}>
                    <div className={classes.paper}>
                        <ManageUsers refresh={reloadData} close={props.handleClose}/>
                    </div>
                </Fade>
                </Modal>
            </div>
        );
    }

    useEffect(() => {
        let abortController = new AbortController();
        const usersGetData = async () => {
            api.get('/users').then((data) => {
                setUsersData(data.data);
            }).catch((error) => {
                if(error.response){
                    window.alert(error.response.data.detail);
                    history.push('/auth/login');
                }
            });
        }
        usersGetData();
        return () => abortController.abort();
    }, []);

    const reloadData = (modal=false) => {
        api.get('/users').then((data) => setUsersData(data.data)).catch((error) => {
            if(error.response){
                window.alert(error.response.data.detail);
                history.push('/auth/login');
            }
        });

        if(modal) closeCreateModal();
    }

    const Users = ({post}) => {
        const [permission, setPermission] = useState([]);

        const [confirmDisable, setConfirmDisable] = useState(false);
        const openDisable = () => setConfirmDisable(true);
        const closeDisable = () => setConfirmDisable(false);

        const [editModalState, setEditModalState] = useState(false);
        const openModalEdit = () => setEditModalState(true);
        const closeModalEdit = () => setEditModalState(false);

        useEffect(() => {
            let abortController = new AbortController();
            const getPermission = () => {
                api.get(`/user-permission/?idUser=${post.id}`).then((response) => setPermission(response.data)).catch(console.error);
            }
            getPermission();
            return () => abortController.abort();
        }, []);
    
        const listStyle = {
            height: '40px',
            padding: '5px 15px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textTransform: 'capitalize'
        }
    
        const AccordionMore = ({data}) => {
            const [pages, setPages] = useState([]);

            const dateTimeJoined = data.post.date_joined.split('T');
            const dateJoined = dateTimeJoined[0].split('-');
            const dateTimeLastLogin = data.post.last_login!=null ? data.post.last_login.split('T'): null;
    
            const dateLogin = dateTimeLastLogin!=null ? dateTimeLastLogin[0].split('-') : null;
            const loginFormat = dateLogin===null ? 'Never Loged In.' : `${dateLogin[2]}/${dateLogin[1]}/${dateLogin[0]}`;

            useEffect(() => {
                let abortController = new AbortController();
                const getPages = () => {
                    if(permission[0] === undefined) return;
                    api.get(`/permissions/${permission[0].idPermission}/`).then(
                        (response) => setPages(response.data)
                    ).catch(console.error);
                }

                getPages();
                return () => abortController.abort();
            }, []);
            const GetPage = ({post}) => {
                const [pageName, setPageName] = useState([]);
                useEffect(() => {
                    let abortController = new AbortController();
                    const getPage = () => {
                        api.get(`/pages/${post[0]}/`).then((response) => setPageName(response.data)).catch(console.error);
                    }
                    getPage();
                    return () => abortController.abort();
                }, []);

                return (
                    <ListGroupItem style={listStyle}>{pageName.name}</ListGroupItem>
                )
            }
            const PageItem = ({...props}) => {
                    let pages = props.pages;
                    const pagesGroups = pages.idPages.split(",");
                    pages = [];
                    pagesGroups.forEach((page) => {
                        pages.push(page.split('.'));
                    });
                return (
                    <div>
                        <ListGroupItem style={{
                            minHeight: '40px',
                            height: 'auto',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '0',
                        }}>
                            <Accordion style={{
                                width: '100%'
                            }}>
                                <AccordionSummary expandIcon={<ExpandMore />} style={{
                                    width: '100%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    boxShadow: '0px 0px 5px gray'
                                }}>
                                    {props.pages.name}
                                </AccordionSummary>
                                <AccordionDetails style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '10px',
                                }}>
                                    <div style={{
                                        borderRadius: '10px',
                                        boxShadow: '0px 0px 5px gray'
                                    }}>
                                        <ListGroupItem className="active">
                                            Pages:
                                        </ListGroupItem>
                                        {pages.map((data, index) => (<GetPage key={`pageItem-${index}`} post={data}/>))}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </ListGroupItem>
                    </div>
                );
            }
    
            return (
                <div style={{
                    width: '100%',
                    minHeight: '100px',
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                }}>   
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        padding: '15px'
                    }}>
                        <div style={{
                            width: '100%',
                            borderRadius: '10px',
                            boxShadow: '0px 0px 5px gray',
                            backgroundColor: "#fff",
                            overflow: "hidden"
                        }}>
                            <Table className="align-items-center" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Joined</th>
                                        <th scope="col">Last Login</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">
                                            <Media className="align-items-center" style={{textAlign: 'center'}}>
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                        {data.post.first_name !== "" ? `${data.post.first_name} ${data.post.last_name}`:data.post.username}
                                                    </span>
                                                </Media>
                                            </Media>
                                        </th>
                                        <td>
                                            <Media className="align-items-center">
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                        {data.post.username}
                                                    </span>
                                                </Media>
                                            </Media>
                                        </td>
                                        <td>
                                            <Media className="align-items-center">
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                        {data.post.email}
                                                    </span>
                                                </Media>
                                            </Media>
                                        </td>
                                        <td>
                                            <Media className="align-items-center">
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                        {dateJoined[2]}/{dateJoined[1]}/{dateJoined[0]}
                                                    </span>
                                                </Media>
                                            </Media>
                                        </td>
                                        <td>
                                            <Media className="align-items-center">
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                        {loginFormat}
                                                    </span>
                                                </Media>
                                            </Media>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {pages.length===undefined?(
                        <BodyInfo>
                        <ListGroup style={{
                            boxShadow: "0px 0px 5px black",
                            // border: "1px solid black",
                            borderRadius: '5px',
                            overflow: 'hidden'
                        }}>
                            <ListGroupItem className="active" style={listStyle}>Permission:</ListGroupItem>
                            <PageItem pages={pages}/>
                        </ListGroup>
                    </BodyInfo>
                    ):null}
                </div>
            )
        }
    
        const ModalEdit = ({...props}) => {
            const [selected, setSelect] = useState(permission.length>0?permission[0].idPermission:"");
            const handleChange = (event) => {
                setSelect(event.target.value);
            };
            const classes = createStyles();
            const userData = {
                first_name: props.post.first_name,
                last_name: props.post.last_name,
                username: props.post.username,
                email: props.post.email,
                groups: props.post.groups,
                is_superuser: props.post.is_superuser,
            }
    
            const updateInfo = async (e) => {
                e.preventDefault();
    
                userData.first_name = document.getElementById('first_name').value;
                userData.last_name = document.getElementById('last_name').value;
                userData.username = document.getElementById('username').value;
                userData.email = document.getElementById('email').value;
                userData.permission = selected;
                userData.is_superuser = post.is_superuser;

    
                api.patch(`/users/${post.id}/`, userData).then(() => {
                    api.patch(`/user-permission/${permission[0].idUserPermission}/`,{idPermission: userData.permission})
                    .then((response) => {
                        window.alert("Update Succesfully!");
                        closeModalEdit();
                        reloadData();
                    }).catch(console.error);
                }).catch(console.error);
            }

            const UserForm = () => {
                const classes = useStyles();
                const [permission, setPermission] = useState([]);

                useEffect(() => {
                    let abortController = new AbortController();
                    const getPermissions = () => {
                        api.get('/permissions/').then((response) => setPermission(response.data))
                        .catch(console.error);
                    }

                    getPermissions();
                    return () => abortController.abort();
                }, []);

                return (
                    <>
                        <Navbar className="navbar-horizontal navbar-dark bg-default"expand="lg" style={{
                            width: '100%',
                            height: '50px'
                        }}>
                            <Container>
                                <NavbarBrand style={{cursor: 'default', userSelect:'none'}}>
                                    Edit Information
                                </NavbarBrand>
                                <Button color="danger" size="sm" type="button" onClick={closeModalEdit}>
                                    Close
                                </Button>
                            </Container>
                        </Navbar>
                        <Form onSubmit={updateInfo} style={{
                            padding: "15px"
                        }}>
                            <Label>Name:</Label>
                            <FormGroup style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Input placeholder="First Name" id="first_name" type="text" defaultValue={post.first_name} style={{width:"45%",}}/>
                                <Input placeholder="Last Name" id="last_name" type="text" defaultValue={post.last_name} style={{width:"45%",}}/>
                            </FormGroup>
                            <Label>Username:</Label>
                            <FormGroup>
                                <Input placeholder="Your new Username is..." defaultValue={post.username} required type="text" id="username"/>
                            </FormGroup>
                            <Label>E-mail:</Label>
                            <FormGroup>
                                <Input placeholder="Your new Email is..." required defaultValue={post.email} type="email" id="email"/>
                            </FormGroup>
                            <div style={{
                                width: '100%'
                            }}>
                                {post.is_superuser?null:(
                                    <FormControl variant="outlined" required className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-outlined-label">Permission</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={selected}
                                            onChange={handleChange}
                                            label="Permission"
                                        >
                                                <MenuItem value="">
                                                <em>None</em>
                                                </MenuItem>
                                                {permission.map((data, index) => (<MenuItem key={`permission-${index}`} value={data.idPermission}>{data.name}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                )}
                            </div>
                            <Button color="primary" type="submit" style={{float:"right", marginBottom:"15px"}}>
                                Save
                            </Button>
                        </Form>
                    </>
                )
            }
    
            return (
                <div>
                    <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={props.open}
                    onClose={props.close}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}>
                        <div className={classes.paper}>
                            <UserForm/>
                        </div>
                    </Modal>
                </div>
            )
        }

        const disableUser = (e) => {
            e.target.disabled = true;
            api.patch(`/users/${post.id}/`, {is_active: "false"}).then((response) => {
                window.alert("User disabled success!");
                reloadData();
            }).catch(console.error);
        }

        const enableUser = (e) => {
            e.target.disabled = true;
            api.patch(`/users/${post.id}/`, {is_active: "true"}).then((response) => {
                window.alert("User enabled success!");
                reloadData();
            }).catch(console.error);
        }

        return (
            <ListGroupItem className="px-0" style={{
                borderRadius: '10px',
            }}>
                <Accordion style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0px 0px 5px gray'
                }}>
                    <AccordionSummary expandIcon={<ExpandMore />} style={{
                        borderBottom: '1px solid gray'
                    }}>
                        <div className="col ml--2" style={{
                            width: "100%",
                            height: "inherit",
                            paddingLeft: "50px",
                        }}>
                            <h4 className="mb-0">
                                {post.username}&nbsp;{post.id.toString()===localStorage.getItem('AUTHOR_ID').toString()?"(you)":""}
                            </h4>
                            <small style={{color: '#525f7f'}}>
                                {post.first_name !== "" ? `${post.first_name} ${post.last_name}`:post.username}
                            </small>
                        </div>
                        {post.is_superuser?null:(
                            <>
                                <FormControlLabel 
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    style={{margin:'0'}}
                                    control={
                                    <Col className="col-auto" style={{padding: '0', marginRight: '10px'}}>
                                        {post.id.toString() === localStorage.getItem('AUTHOR_ID').toString()?(
                                            <Button color="primary" disabled outline size="sm" type="button" onClick={openModalEdit}>
                                                Edit
                                            </Button>
                                        ):(
                                            <Button color="primary" outline size="sm" type="button" onClick={openModalEdit}>
                                                Edit
                                            </Button>
                                        )}
                                        <ModalEdit 
                                        open={editModalState}
                                        close={closeModalEdit}
                                        post={post}/>
                                    </Col>
                                    }
                                />
                                {post.is_active === true?(
                                    <FormControlLabel 
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                        style={{margin:'0'}}
                                        control={
                                        <Col className="col-auto" style={{padding: '0'}}>
                                            {post.id.toString() === localStorage.getItem('AUTHOR_ID').toString()?(
                                                <Button color="danger" disabled outline size="sm" type="button">
                                                    Disable
                                                </Button>
                                            ):(
                                                <div>
                                                    {confirmDisable?(
                                                        <Button color="danger" outline size="sm" onMouseOut={closeDisable} onClick={disableUser} type="button">
                                                            Confirm
                                                        </Button>
                                                    ):(
                                                        <Button color="danger" outline size="sm" onClick={openDisable} type="button">
                                                            Disable
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </Col>
                                        }
                                    />
                                ):(
                                    <FormControlLabel 
                                        onClick={(event) => event.stopPropagation()}
                                        onFocus={(event) => event.stopPropagation()}
                                        style={{margin:'0'}}
                                        control={
                                        <Col className="col-auto" style={{padding: '0'}}>
                                            {post.id === localStorage.getItem('AUTHOR_ID')?null:(
                                                <div>
                                                    <Button color="success" outline onClick={enableUser} size="sm" type="button">
                                                        Enable
                                                    </Button>
                                                </div>
                                            )}
                                        </Col>
                                        }
                                    />
                                )}
                            </>
                        )}
                    </AccordionSummary>
                    <AccordionDetails style={{backgroundColor: "#5e72e4"}}>
                        <AccordionMore data={{post}}/>
                    </AccordionDetails>
                </Accordion>
            </ListGroupItem>
        )
    }

    return (
    <>
        <Container style={{
            width: "inherit",
            height: "450px",
            display: "block",
        }}>
            
            <div style={{
                width: '100%',
                minHeight: '50px',
                height: 'auto',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '15px',
                boxSizing: 'borderBox',
                justifyContent: 'flex-end'
            }}>
                <Button color="primary" size="sm" type="button" onClick={openCreateModal}>
                    Create new User
                </Button>
                <CreateModal
                open={createModalState}
                handleClose={closeCreateModal}/>
            </div>

            <ListGroup className="list" flush style={{
                width: '100%',
                height: '100%',
                boxShadow: '0px 0px 5px gray',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <div style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '5px',
                }}>
                    {usersData.map((data, index) => (<Users key={`userlist-${index}`} post={data}/>))}
                </div>
            </ListGroup>
      </Container>
    </>
    )
}

export default ListUsers
