import React, { useEffect, useState } from "react"
import AuthHeader from "components/Headers/AuthHeader"
import classnames from "classnames";
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
import './components/style.css';
import endressLogo from "../../../assets/img/brand/ehLogo_400x400.png";
import mv3Logo from "../../../assets/img/brand/LogoMV3.png";

// Custom styles imports
import {ImageLogo,
    Imagefigure,
    MV3Figure,
    MV3img
} from "../components/custom/login";
import NotifyComponent, { showNotify } from "components/notifications/notify";
import { api } from "services/api";
import { signOut, isSignedIn } from "services/security";
import { useHistory, useParams } from 'react-router-dom';

export default function ResetPassword() {
    const history = useHistory();
    const { code } = useParams();
    // const setFocusedEmailFalse = () => setfocusedEmail(false);
    const [focusedPassword, setfocusedPassword] = React.useState(false);
    const notifyRef = React.useRef(null);
    const [ showPassValid, setShowPassValid ] = useState(false);
    const handleShowPassValid = () => setShowPassValid(!showPassValid);
    const [ previewPassword, setPreviewPassword ] = useState(false);
    const handlePreviewPassword = () => setPreviewPassword(!previewPassword);
    const [ passValid, setPassValid ] = useState({
        upperCase: false,
        lowerCase: false,
        number: false,
        special: false,
        minChar: false,
    });

    const [userRegister, setUserRegister] = useState({
        password: "",
        passwordConfirm: ""
    });

    const passExpiredVerify = async () => {
        try {
            const response = await api.get("/api-token-verify");
            if (!response.data.password_expired) return history.push("/admin/dashboard");
        } catch (error) {
            console.error(error);
        }
    }

    const verifyIsSigned = async () => {
        if(isSignedIn()){
            const date = new Date().toISOString()
            api.patch(`/users/${localStorage.getItem('AUTHOR_ID')}/`, {last_login: date}).catch((error) => {
                if(error.response){
                const detail = error.response.data.detail
                if(detail === "Token inválido.") {
                    localStorage.clear();
                    return history.push('/auth/login');
                }
                return console.info(detail);
            }
                return console.error(error);
            });
        }else{
            history.push('/auth/login');
        }
    }

    const verifyWithCode = async () => {
        try {
            const response = await api.get(`/recover/${code}`);
            return response.data;
        } catch (error) {
            window.alert("Code invalid or expired, please try again");
            history.push('/auth/login');
        }
    }

    useEffect(async () => {
        if (!code) {
            await Promise.all([
                verifyIsSigned(),
                passExpiredVerify(),
            ]);
        } else {
            await verifyWithCode();
        }
    }, []);

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

    const enableConfirm = () => {
        if (userRegister.password === "" || userRegister.passwordConfirm === "") return false;
        if (userRegister.password === userRegister.passwordConfirm) return true;
    }

    const verifyPassowordForce = () => {
        if (!passValid.upperCase) {
            showNotify(
                notifyRef,
                "Password Validation Failed",
                "Password must be have at one uppercase letter.",
                "danger"
            );
            return true;
        }
    
        if (!passValid.lowerCase) {
            showNotify(notifyRef,
                "Password Validation Failed",
                "Password must be have at one lowercase letter.",
                "danger");   
            return true;
        }

        if (!passValid.number) {
            showNotify(notifyRef, "Password Validation Failed", 
        "Password must be have at one number.", "danger");
            return true;
        }

        if (!passValid.special) {
            showNotify(notifyRef, "Password Validation Failed", 
        "Password must be have at one special charácter.", "danger");
            return true;
        }

        if (!passValid.minChar) {
            showNotify(notifyRef, "Password Validation Failed", 
        "Password must be have at least 8 characters long.", "danger");
            return true;
        }

        if (!enableConfirm()) {
            showNotify(notifyRef, "Error", "Passwords not match", "danger");
            return true;
        }

        return false;
    }

    const executeFormWithLogin = async (e) => {
        e.preventDefault();
        if (verifyPassowordForce()) return;

        try {
            await api.post("/api-token-verify", userRegister);
            showNotify(notifyRef, "Password Update Success", "Sucess updating your password", "success");
            signOut();
            return history.push("/auth/login");
        } catch (error) {
            console.log(api.defaults)
            if (error.response && error.response.data.detail && error.response.status != 500) return showNotify(notifyRef, "Error", error.response.data.detail, "danger");
            if (error.response && error.response.status == 400) return showNotify(notifyRef, "Error", error.response.data.message, "danger");
            return showNotify(notifyRef, "Error", "Internal Error", "danger");
        }
    }

    const executeFormWithCode = async(e) => {
        e.preventDefault();
        if (verifyPassowordForce()) return;
        try {
            await api.post("execute/recover", {...userRegister, code});
            showNotify(notifyRef, "Password Update Success", "Sucess updating your password", "success");
            signOut();
            return history.push("/auth/login");
        } catch (error) {
            console.log(api.defaults)
            if (error.response && error.response.data.detail && error.response.status != 500) return showNotify(notifyRef, "Error", error.response.data.detail, "danger");
            if (error.response && error.response.status == 400) return showNotify(notifyRef, "Error", error.response.data.message, "danger");
            return showNotify(notifyRef, "Error", "Internal Error", "danger");
        }
    }

    const executeForm = async (e) => {
        if (code) {
            await executeFormWithCode(e);
        } else {
            await executeFormWithLogin(e);
        }
    }

    return (
        <>
            <AuthHeader/>
            <NotifyComponent notifyRef={notifyRef}/>
            <Container className="mt--9 pb-5">
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
                                <small>Insert a new password:</small>
                            </div>
                            <Form role="form" onSubmit={executeForm}>
                                <FormGroup style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "10px"
                                }}>
                                    {previewPassword && (
                                        <div
                                        style={{
                                            animation: "fadeIn 1s ease-in-out",
                                            opacity: "1",
                                            fontSize: "1.0em",
                                            boxShadow: "0px 0px 2px gray",
                                            padding: "3px",
                                            borderRadius: "10px",
                                            marginBottom: "4px"
                                        }}>
                                            <i className="fa fa-eye"/>&nbsp;
                                            {userRegister.password}
                                        </div>
                                    )}
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
                                        value={userRegister.password}
                                        />
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText onClick={handlePreviewPassword}>
                                                {previewPassword ?( <i className="fa fa-eye" />) : (<i className="fa fa-eye-slash" />) }
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup
                                className={classnames({
                                    focused: focusedPassword,
                                })}
                                >
                                    <InputGroup style={{marginBottom: "5px"}} className="input-group-merge input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                        placeholder="Confirm password"
                                        type="password"
                                        id="passwordConfirm"
                                        value={userRegister.passwordConfirm}
                                        onChange={handlerInput}
                                        />
                                    </InputGroup>
                                    {showPassValid && (
                                        <div style={{
                                            transition: "0.5s",
                                            width: "100%",
                                            boxShadow: "0px 0px 2px gray",
                                            padding: "5px",
                                            borderRadius: "4px",
                                            backgroundColor: "#FFF",
                                            marginBottom: "5px",
                                            opacity: "1",
                                            animation: "fadeIn 1s ease-in-out",
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
                                    )}
                                </FormGroup>
                                <div className="text-center">
                                    <Button
                                        className="my-4"
                                        color="info"
                                        type="submit"
                                    >
                                        Update password
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
    )
}