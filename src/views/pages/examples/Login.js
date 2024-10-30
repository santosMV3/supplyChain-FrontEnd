import React, {useState, useRef} from "react";
import {useHistory} from "react-router-dom";
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

import NotifyComponent, { showNotify } from "components/notifications/notify";

import endressLogo from "../../../assets/img/brand/ehLogo_400x400.png";
import mv3Logo from "../../../assets/img/brand/LogoMV3.png";

// Custom styles imports
import {ImageLogo,
  Imagefigure,
  MV3Figure,
  MV3img
} from "../components/custom/login";

import {api} from "../../../services/api";
import LoaderBox from "../components/custom/loader/loaderBox";
import {signIn, isSignedIn} from "../../../services/security";

function Login() {
  const history = useHistory();
  const notifyRef = useRef(null);


  const [usuarioLogin, setUsuarioLogin] = useState({
    username: "",
    password: ""
  });
  const [loader, setLoader] = useState(false);

  const handlerInput = (e) => setUsuarioLogin({...usuarioLogin, [e.target.id]: e.target.value});

  const loginExecute = async (e) => {
    e.preventDefault();
    setLoader(true);
    api.post('/api-token-auth', usuarioLogin).then((response) => {
      signIn(response.data);
      setLoader(false);
      return history.push('/admin/dashboard');
    }).catch((error) => {
      const errorList = Object.entries(error.response.data)[0];
      setLoader(false);
      showNotify(notifyRef, "Error", errorList[1] ? errorList[1] : "Undefined error", "danger");
    })
  }

  const recoverExecute = (e) => {
    e.target.disabled = true;
    if (usuarioLogin.username === "") {
      e.target.disabled = false;
      return showNotify(notifyRef, "Error", "Username is required", "danger");
    }
    e.preventDefault();
    e.target.disabled = false;
    setLoader(true);
    api.post('/recover/', {username: usuarioLogin.username}).then(() => {
      setLoader(false);
      showNotify(notifyRef, "Info", "If have a user with this username a email are sended. Please check your inbox", "success");
    }).catch((error) => {
      setLoader(false);
      showNotify(notifyRef, "Error", "Failed to recover your password", "danger");
    });
  }

  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const setFocusedEmailTrue = () => setfocusedEmail(true);
  // const setFocusedEmailFalse = () => setfocusedEmail(false);

  const [focusedPassword, setfocusedPassword] = React.useState(false);
  if(isSignedIn()) history.push('/admin/dashboard');
  return (
    <>
      <AuthHeader/>
      <NotifyComponent notifyRef={notifyRef}/>
      <Container className="mt--9 pb-5">
        {loader ? (
          <LoaderBox/>
        ) : (
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className="bg-secondary border-0 mb-0">
                <CardHeader className="bg-transparent" style={{
                  paddingBottom: '0px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Imagefigure>
                    Endress+Hauser&nbsp;
                    <ImageLogo src={endressLogo}/>
                  </Imagefigure>
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5" style={{borderBottom: "0.5px solid #DFDFDF"}}>
                  <div className="text-center text-muted mb-4">
                    <small>Sign in with credentials</small>
                  </div>
                  <Form role="form" onSubmit={loginExecute}>
                    <FormGroup
                      className={classnames("mb-3", {
                        focused: focusedEmail,
                      })}
                    >
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Username"
                          type="text"
                          id="username"
                          onFocus={() => setFocusedEmailTrue()}
                          onBlur={() => setFocusedEmailTrue()}
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
                          onFocus={() => setFocusedEmailTrue()}
                          onBlur={() => setfocusedPassword(true)}
                          onChange={handlerInput}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="my-4" color="info" type="submit">
                        Sign in
                      </Button>
                      <Button className="my-4" color="info" type="button" onClick={recoverExecute}>
                        Recover Password
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
        )}
      </Container>
    </>
  );
}

export default Login;
