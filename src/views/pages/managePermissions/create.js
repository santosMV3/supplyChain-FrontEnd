import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel} from '@material-ui/core';
import React, {useState, useEffect} from 'react';

import {
    Button,
    Row,
    Col,
    Container,
    FormGroup,
    Input,
    Card,
    CardHeader,
    CardBody,
    Form,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import { api } from 'services/api';

const CreatePermission = ({...props}) => {
    const permissionsState = {
        "name": "",
        "idPages": ""
    }
    const [pagesState, setPagesState] = useState([]);

    const getPages = async () => {
        try {
            api.get('/pages').then((response) => {
                setPagesState(response.data);
            }).catch(console.error);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        let abortController = new AbortController();
        getPages();
        return () => abortController.abort();
    }, []);

    const executeCreate = (e) => {
        e.preventDefault();
        let permissions = "";

        const inputPages = [].slice.call(document.getElementsByClassName('pageInput'));

        inputPages.forEach((input) => {
            if (input.checked === true) {
                const crud = ['view', 'create', 'edit', 'delete'];
                let subPermissions = "";
                crud.forEach((option) => {
                    const optionCheck = document.getElementById(input.id + option);
                    if (optionCheck.checked === true) {
                        subPermissions += optionCheck.value;
                    }
                });
                permissions += `${input.value}.${subPermissions},`;
            }
        });

        permissions = permissions.slice(0, permissions.length - 1);
        if (permissions === "") return window.alert("Selecione alguma permissão.");

        permissionsState.name = document.getElementById('name').value;
        permissionsState.idPages = permissions

        api.post('/permissions/', permissionsState).then(() => {
            api.post("/history/", { page: "Permissions", after: `Created a new permission: "${permissionsState.name}"`, action: "create" }).then(() => {
                window.alert("Permission has created successfully!");
                props.closeCreate();
            }).catch(console.error);
        }).catch(console.error)
    }

    const PageInput = ({post}) => {
        const [expanded, setExpanded] = useState('');
        const handlerExpand = (e) => {
            const crud = ['view', 'create', 'edit', 'delete'];

            if ((e.target.id).toLowerCase() === "admin") {
                const inputPages = [].slice.call(document.getElementsByClassName('pageInput'));
                if (e.target.checked === true) {
                    inputPages.forEach((page) => {
                        page.checked = true;
                        if (page.id !== "admin") page.disabled = true

                        crud.forEach((option) => {
                            const optionCheck = document.getElementById(page.id + option);
                            optionCheck.checked = true;
                        });
                    });
                } else {
                    inputPages.forEach((page) => {
                        page.checked = false;
                        if (page.id !== "admin") page.disabled = false
                        crud.forEach((option) => {
                            const optionCheck = document.getElementById(page.id + option);
                            optionCheck.checked = false;
                        });
                    });
                }
            } else {
                if (e.target.checked) {
                    setExpanded('');
                    crud.forEach((option) => {
                        const optionCheck = document.getElementById(e.target.id + option);
                        optionCheck.checked = true;
                        optionCheck.disabled = false;
                    });
                } else {
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
            <>
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
                                    style={{margin: '0'}}
                                    control={
                                        <Col className="col-auto" style={{padding: '0'}}>
                                            <label className="custom-toggle">
                                                <input type="checkbox" onChange={handlerExpand} value={post.idPage}
                                                       className="pageInput" id={post.name}/>
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
                            <AccordionDetails style={{backgroundColor: "#fcfcfc", userSelect: "none"}}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around"
                                }}>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name + "view"}
                                            type="checkbox"
                                            value="v"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name + "view"}>
                                            View
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name + "create"}
                                            type="checkbox"
                                            value="c"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name + "create"}>
                                            Create
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name + "edit"}
                                            type="checkbox"
                                            value="e"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name + "edit"}>
                                            Edit
                                        </label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id={post.name + "delete"}
                                            type="checkbox"
                                            value="d"
                                            disabled="true"
                                        />
                                        <label className="custom-control-label" htmlFor={post.name + "delete"}>
                                            Delete
                                        </label>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col lg="6" md="8">
                        <Card className="bg-secondary border-0">
                            <CardHeader className="bg-transparent" style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: "1.4em"
                            }}>
                                Create a New Permission:
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5" style={{borderBottom: "0.5px solid #DFDFDF"}}>
                                <Form role="form" onSubmit={executeCreate}>
                                    <FormGroup>
                                        <InputGroup className="input-group-merge input-group-alternative mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-hat-3"/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Name:"
                                                type="text"
                                                id="name"
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <div style={{
                                        width: '300px',
                                        height: "300px",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: 'space-around',
                                        overflow: "auto",
                                        boxSizing: "border-box",
                                        padding: "5px",
                                        margin: '0 auto',
                                    }}>
                                        {pagesState.map((post, index) => (
                                            <PageInput key={`pagestate-${index}`} post={post}/>))}
                                    </div>
                                    <div className="text-center">
                                        <Button className="mt-4" color="info" type="submit">
                                            Create Permission
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CreatePermission;