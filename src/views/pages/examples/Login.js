import React, {useState} from "react";
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

import endressLogo from "../../../assets/img/brand/ehLogo_400x400.png";
import mv3Logo from "../../../assets/img/brand/LogoMV3.png";

// Custom styles imports
import {ImageLogo,
  Imagefigure,
  MV3Figure,
  MV3img
} from "../components/custom/login";

import {api} from "../../../services/api";

import {signIn, isSignedIn} from "../../../services/security";

function Login() {
  const history = useHistory();

  const [usuarioLogin, setUsuarioLogin] = useState({
    username: "",
    password: ""
  });

  const handlerInput = (e) => setUsuarioLogin({...usuarioLogin, [e.target.id]: e.target.value});

  const loginExecute = async (e) => {

    e.preventDefault();
    api.post('/api-token-auth', usuarioLogin).then((response) => {
      signIn(response.data);

      return history.push('/admin/dashboard');
    }).catch(() => {
      window.alert('falha ao executar o login do usuario');
    })
  }

  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const setFocusedEmailTrue = () => setfocusedEmail(true);
  // const setFocusedEmailFalse = () => setfocusedEmail(false);

  const [focusedPassword, setfocusedPassword] = React.useState(false);
  if(isSignedIn()) history.push('/admin/dashboard');
  return (
    <>
      <AuthHeader/>
      <Container className="mt--8 pb-5">
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
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="info" type="submit">
                      Sign in
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
            <Row className="mt-3">
              <Col xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Forgot password?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Create new account</small>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
