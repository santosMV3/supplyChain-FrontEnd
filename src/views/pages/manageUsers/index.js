import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
// reactstrap components

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Navbar,
  NavbarBrand
} from "reactstrap";
import {useHistory} from "react-router-dom";
import {api} from "../../../services/api";
import {DangerAlert} from"../components/custom/alerts";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ManageUsers = ({...props}) => {
  const history = useHistory();
  const { showNotify, notifyRef } = props;


  const [userRegister, setUserRegister] = useState({
      email: "",
      username: "",
      password: "",
      groups: [],
      first_name: "",
      last_name: "",
      is_superuser: false,
      is_staff: false
    });
  
    const classes = useStyles();
    const [permission, setPermission] = useState([]);
    const [selected, setSelect] = useState('');

    const [ showPassValid, setShowPassValid ] = useState(false);
    const handleShowPassValid = () => setShowPassValid(!showPassValid);

    const [ passValid, setPassValid ] = useState({
      upperCase: false,
      lowerCase: false,
      number: false,
      special: false,
      minChar: false,
    });

    const handleChange = (event) => {
      setSelect(event.target.value);
    };
    const handlerInput = (e) => {
      if (e.target.id == "password") {
        const passwordValue = e.target.value;

        const hasUppercase = /[A-Z]/.test(passwordValue); // Verifica letras maiúsculas
        const hasLowercase = /[a-z]/.test(passwordValue); // Verifica letras minúsculas
        const hasSpecialChar = /[\W_]/.test(passwordValue); // Verifica caracteres especiais
        const hasMinLength = passwordValue.length > 8; // Verifica comprimento mínimo
        const hasNumber = /\d/.test(passwordValue); // Verifica números

        setPassValid({
          upperCase: hasUppercase,
          lowerCase: hasLowercase,
          number: hasNumber,
          special: hasSpecialChar,
          minChar: hasMinLength,
        });
      }
      setUserRegister({...userRegister, [e.target.id]: e.target.value});
    };

    const getPermissions = () => api.get('/permissions/').then((response) => {
      setPermission(response.data);
    }).catch(console.error);

    useEffect(() => {
      let abortController = new AbortController();
      getPermissions();
      return () => abortController.abort();
    }, []);

    const registerExecute = async (e) => {
      e.preventDefault();

      // const groupValue = document.getElementById('groups').value;
      const superuser = false;
      // if (groupValue === "") return window.alert('Por favor, selecione um grupo de usuário!');
      // userRegister.groups = [groupValue];
      userRegister.is_superuser = superuser;

      if (!passValid.upperCase) return showNotify(
          notifyRef,
          "Password Validation Failed",
          "Password must be have at one uppercase letter.",
          "danger"
        );
      if (!passValid.lowerCase) return showNotify(notifyRef,
        "Password Validation Failed",
        "Password must be have at one lowercase letter.",
        "danger");
      if (!passValid.number) return showNotify(notifyRef, "Password Validation Failed", 
      "Password must be have at one number.", "danger");
      if (!passValid.special) return showNotify(notifyRef, "Password Validation Failed", 
      "Password must be have at one special charácter.", "danger");
      if (!passValid.minChar) return showNotify(notifyRef, "Password Validation Failed", 
      "Password must be have at least 8 characters long.", "danger");

      api.post('/users/', userRegister).then((response) => {
        api.post('/user-permission/', {idUser: response.data.id, idPermission: selected})
        .then(() => {
          api.post("/history/", { page: "Users", after: `Created a new user: ${userRegister.username}`, action: "create" }).then(() => {
            showNotify(notifyRef, "Register Success", "Success to register a new user.", "success");
            props.refresh(true);
          }).catch(console.error);
        }).catch(console.error);
      }).catch((error) => {
        if(error.response){
          const data = error.response.data;
          let message = "";
  
          if (data.username){
            data.username.forEach(uniqueData => {
              message+= `\n ${uniqueData}`
            });
          } else if(data.detail){
            return history.push('/auth/login');
          }
          
          showNotify(notifyRef, "Register Failed", message, "danger");
        }else{
          showNotify(notifyRef, "Register Failed", "Failed to connect to the server.", "danger");
        }
      });
  
      }

  return (
      <>
    <Container>
      <Row className="justify-content-center">
        <Col style={{padding: '0'}}>
          <Card className="bg-secondary border-0">
          <Navbar className="navbar-horizontal navbar-dark bg-default"expand="lg" style={{
                width: '100%',
                height: '50px'
            }}>
                <Container>
                    <NavbarBrand style={{cursor: 'default', userSelect:'none'}}>
                        Create New User
                    </NavbarBrand>
                    <Button color="danger" size="sm" type="button" onClick={props.close}>
                        Close
                    </Button>
                </Container>
            </Navbar>
            <CardBody className="px-lg-5 py-lg-5" >
              <Form role="form" onSubmit={registerExecute}>
                <FormGroup>
                  <InputGroup className="input-group-merge input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Username"
                      type="text"
                      id="username"
                      onChange={handlerInput}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-merge input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      id="email"
                      onChange={handlerInput}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px"
                }}>
                  <InputGroup className="input-group-merge input-group-alternative mb-3" style={{
                    width: "48%",
                    marginRight: "15px"
                  }}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Firts Name"
                      type="text"
                      id="first_name"
                      onChange={handlerInput}
                    />
                  </InputGroup>
                  <InputGroup className="input-group-merge input-group-alternative mb-3" style={{
                    width: "48%"
                  }}>
                    <Input
                      placeholder="Last Name"
                      type="text"
                      id="last_name"
                      onChange={handlerInput}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px"
                }}>
                  <InputGroup className="input-group-merge input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      id="password"
                      onChange={handlerInput}
                      onFocus={handleShowPassValid}
                      onBlur={handleShowPassValid}
                    />
                  </InputGroup>
                  <div style={{
                    transition: "0.5s",
                    width: "100%",
                    boxShadow: "0px 0px 2px gray",
                    padding: "5px",
                    borderRadius: "4px",
                    backgroundColor: "#FFF",
                    marginBottom: "5px",
                    opacity: showPassValid ? "1" : "0"
                  }}>
                    <div style={{ color: passValid.upperCase ? "#2dce89" :"#f5365c" }}>
                      { passValid.upperCase ? (
                        <i className="fa fa-thumbs-up"/>
                      ) : (
                        <i className="fa fa-thumbs-down"/>
                      ) }
                      &nbsp;Upper-Case
                    </div>
                    <div style={{ color: passValid.lowerCase ? "#2dce89" :"#f5365c" }}>
                      { passValid.lowerCase ? (
                        <i className="fa fa-thumbs-up"/>
                      ) : (
                        <i className="fa fa-thumbs-down"/>
                      ) }
                      &nbsp;Lower-Case
                    </div>
                    <div style={{ color: passValid.number ? "#2dce89" :"#f5365c" }}>
                      { passValid.number ? (
                        <i className="fa fa-thumbs-up"/>
                      ) : (
                        <i className="fa fa-thumbs-down"/>
                      ) }
                      &nbsp;Number
                    </div>
                    <div style={{ color: passValid.special ? "#2dce89" :"#f5365c" }}>
                      { passValid.special ? (
                        <i className="fa fa-thumbs-up"/>
                      ) : (
                        <i className="fa fa-thumbs-down"/>
                      ) }
                      &nbsp;Special Character
                    </div>
                    <div style={{ color: passValid.minChar ? "#2dce89" :"#f5365c" }}>
                      { passValid.minChar ? (
                        <i className="fa fa-thumbs-up"/>
                      ) : (
                        <i className="fa fa-thumbs-down"/>
                      ) }
                      &nbsp;More than 8 characters
                    </div>
                  </div>
                </FormGroup>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
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
                      {permission.map((data, index) => (<MenuItem key={`menuitem-${index}`} value={data.idPermission}>{data.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                </div>
                <div className="text-center">
                  <Button className="mt-4" color="info" type="submit">
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <DangerAlert/>
    </Container>
  </>
  )
}

export default ManageUsers
