/*!

=========================================================
* Argon Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
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
} from "reactstrap";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";

import {
  Imagefigure,
  ImageLogo,
  MV3Figure,
  MV3img
} from '../components/custom/login';

import endressLogo from "../../../assets/img/brand/ehLogo_400x400.png";
import mv3Logo from "../../../assets/img/brand/LogoMV3.png";
import {useHistory} from "react-router-dom";
import {api} from "../../../services/api";

function Register() {
  const history = useHistory();
  const [focusedName, setfocusedName] = React.useState(false);
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);


  const [userRegister, setUserRegister] = React.useState({
    email: "",
    username: "",
		password: ""
  });

  const handlerInput = (e) => {
    setUserRegister({...userRegister, [e.target.id]: e.target.value});
    console.log(userRegister);
  };

  const registerExecute = async (e) => {
    e.preventDefault();
    
    api.post('/users/', userRegister).then((response) => {
      return window.alert('usuario registrado com sucesso!');
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
        
        window.alert(message);
      }else{
        window.alert('Não foi possível se comunicar com o servidor...')
      }
    });

  }

  return (
    <>
      <AuthHeader/>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="bg-secondary border-0">
            <CardHeader className="bg-transparent" style={{
                paddingBottom: '0px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Imagefigure>
                  Endress+Hauser
                  <ImageLogo src={endressLogo}/>
                </Imagefigure>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5" style={{borderBottom: "0.5px solid #DFDFDF"}}>
                <div className="text-center text-muted mb-4">
                  <small>Sign up with credentials</small>
                </div>
                <Form role="form" onSubmit={registerExecute}>
                  <FormGroup
                    className={classnames({
                      focused: focusedName,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="username"
                        type="text"
                        id="username"
                        onFocus={() => setfocusedName(true)}
                        onBlur={() => setfocusedName(false)}
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedEmail,
                    })}
                  >
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
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(false)}
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
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
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(false)}
                        onChange={handlerInput}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-muted font-italic">
                    <small>
                      password strength:{" "}
                      <span className="text-success font-weight-700">
                        strong
                      </span>
                    </small>
                  </div>
                  <Row className="my-4">
                    <Col xs="12">
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id="customCheckRegister"
                          type="checkbox"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheckRegister"
                        >
                          <span className="text-muted">
                            I agree with the{" "}
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center">
                    <Button className="mt-4" color="info" type="submit">
                      Create account
                    </Button>
                  </div>
                </Form>
              </CardBody>
              <CardHeader className="bg-transparent" style={{
                paddingBottom: '0px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MV3Figure>
                  Developed By &nbsp;
                  <MV3img src={mv3Logo}/>
                </MV3Figure>
              </CardHeader>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
