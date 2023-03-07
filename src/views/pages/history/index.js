import React, { useEffect, useState } from "react";
import {
    Col,
    Container,
    Row,
    Button,
} from "reactstrap";
import { api } from "services/api";

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '0px solid #000',
        boxShadow: theme.shadows[5],
        padding: '30px',
        borderRadius: '5px',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    }));

const HistoryPage = () => {
    const [historyData, setHistoryData] = useState([]);
    const [filterState, setFilterState] = useState(false);
    // const openFilterMode = () => setFilterState(true);
    const closeFilterMode = () => {
        const getHistoric = () => {
            api.get('/history/').then((response) => {
                setHistoryData(response.data.results);
            }).catch();
        }

        getHistoric();
        setFilterState(false);
    }

    useEffect(() => {
        let abortController = new AbortController();
        const getHistoric = () => {
            api.get('/history/').then((response) => {
                setHistoryData(response.data.results);
            }).catch();
        }

        getHistoric();
        return () => abortController.abort();
    }, []);

    const HistoricItem = ({...props}) => {
        let { historic } = props;

        const [historyState, setHistoryState] = useState(false);
        const openHistory = () => setHistoryState(true);
        const closeHistory = () => setHistoryState(false);

        const formatDateTime = (datetime) => {
            datetime = datetime.split("T");
            const date = datetime[0].split("-");
            const timeZone = datetime[1].split(".");
            const time = timeZone[0].split(":");

            return `${date[2]}/${date[1]}/${date[0]} ${time[0]}:${time[1]}`;
        }

        let historicItens = []

        let ordenedHistoric = {...historic}
        const historicSO = ordenedHistoric.SO
        const historicPage = ordenedHistoric.page
        ordenedHistoric = Object.assign({}, ordenedHistoric, { idHistoric: true });

        console.log(ordenedHistoric)

        historicItens = historicItens.concat(ordenedHistoric.so_item)
        historicItens.push(ordenedHistoric);
        historicItens.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        
        delete ordenedHistoric["so_item"];
        delete ordenedHistoric["page"];
        delete ordenedHistoric["SO"];

        historic = historicItens[0];
        delete historic.idHistoric;

        historicItens.splice(0, 1);

        historic.page = historicPage;
        historic.SO = historicSO;
        historic.so_item = historicItens;

        // console.log(historic.so_item)


        const datetime = formatDateTime(historic.datetime);
        const user = historic.user.first_name && historic.user.last_name ? `${historic.user.first_name} ${historic.user.last_name}` : `${historic.user.username}`;

        const ChangeItem = ({...props}) => {
            const before = props.data.before;
            const afterValues = props.data.after;
            const user = props.data.user.first_name && props.data.user.last_name ? `${props.data.user.first_name} ${props.data.user.last_name}` : `${props.data.user.username}`;

            return (
                <>
                    <div style={{
                        width: "100%",
                        height: "30px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: [props.index%2===0?"#c7e8ed":"#9dbec2"],
                    }}>
                        <div style={{
                            width: "50%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <p className="mt-3 text-sm">
                                <span className="text-danger mr-2">
                                    <i className="fa fa-arrow-down" />
                                </span>
                            </p>
                            {before && before.length > 0?(
                                <>
                                    {before}
                                </>
                            ):(
                                <>
                                    No previous history.
                                </>
                            )}
                        </div>
                        <div style={{
                            width: "50%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <p className="mt-3 text-sm">
                                <span className="text-success mr-2">
                                    <i className="fa fa-arrow-up" />
                                </span>
                            </p>
                            {afterValues}
                        </div>
                    </div>
                    {props.data.idHistoric ? (
                        <>
                            <div style={{
                                backgroundColor: [props.index%2===0?"#c7e8ed":"#9dbec2"],
                                boxShadow: "0px 30px 2px black"
                            }}>
                                <div style={{
                                    width: "50%",
                                    minHeight: "1px",
                                    height: "auto",
                                    margin: "0 auto",
                                    boxSizing: "border-box",
                                    padding: "5px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                }}>
                                    <div>
                                        <span style={{fontWeight: "bold"}}>User:</span> {user}
                                    </div>
                                    <div>
                                        <span style={{fontWeight: "bold"}}>Datetime:</span> {formatDateTime(props.data.datetime)}
                                    </div>
                                </div>
                            </div>
                        </>
                    ):null}
                </>
            )
        }

        return (
            <>
            <tr style={{
                lineHeight: '0px',
                backgroundColor: [props.index%2 === 0?"#FFFFFF":"#efefef"],
                boxShadow: "0px 0px 5px gray"
            }}>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    { user }
                </td>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    {historic.page}
                </td>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    {historic.action}
                </td>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    { datetime }
                </td>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    {historic.SO?historic.SO:"Not an a SO"}
                </td>
                <td style={{
                    textAlign: "center",
                    fontSize: "1.0em",
                    fontFamily: "calibri",
                    height: '1px',
                    padding: '5px',
                }}>
                    <Button color="primary" size="sm" onClick={historyState?closeHistory:openHistory} id={historic.id + "toggler"} >
                        Expand
                    </Button>
                </td>
            </tr>
            <tr>
                <td colSpan="6">
                    <div style={{
                        width: '100%',
                        height: [historyState?"auto":"0px"],
                        transition: "0.5s",
                        overflow: "hidden",
                        minHeight: [historyState?"5px":"0px"],
                    }}>
                        <ChangeItem data={historic} index={0}/>
                        {historic.so_item.map((soHistoric, index) => (<ChangeItem data={soHistoric} key={`historic-${index}`} index={index + 1}/>))}
                    </div>
                </td>
            </tr>
            </>
        )
    }

    const Filter = () => {
        const [selectValue, setSelectValue] = useState(undefined);
        const [filterValue, setFilterValue] = useState("");

        const classes = useStyles();

        const filters = [
            ["User", "idUser"],
            ["SO", "SO"],
            ["Action", "action"],
            ["Page", "page"]
        ];

        const handlerSelect = (e) => {
            setSelectValue(e.target.value);
        }

        const handlerInput = (e) => {
            setFilterValue(e.target.value);
        }

        const searchFilter = () => {

            if(!selectValue) return window.alert("Please select an option to filter.");

            if(filterValue.length < 1) return window.alert("Type something to filter.");

            api.get(`/history?${selectValue}=${filterValue}`).then((response) => {
                setHistoryData(response.data.results);
            }).catch(console.error);
            setFilterState(true);
        }

        return (
            <div style={{
                width: [filterState?'480px':'400px'],
                boxShadow: "0px 0px 2px black",
                borderRadius: "10px",
                margin: "5px auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                transition: '0.5s'
            }}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label" style={{
                        padding: '0'
                    }}>
                        Filter
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={selectValue}
                        onChange={handlerSelect}
                        label="Permission"
                    >
                        <MenuItem value={undefined}>
                            <em>None</em>
                        </MenuItem>
                        {filters.map((fill, index) => (
                            <MenuItem key={`fill-${index}`} value={fill[1]}>
                                <em>{fill[0]}</em>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input type="text" onChange={handlerInput} placeholder="Insert something to filter:" value={filterValue} style={{
                    borderRadius: '5px',
                    border: "none",
                    boxShadow: "0px 0px 2px black",
                    boxSizing: "border-box",
                    padding: "3px",
                    fontSize: "0.9em",
                }}/>
                <Button color="default" style={{margin: "0"}} onClick={searchFilter} size="sm">
                    Search
                </Button>
                {filterState?(
                    <Button color="danger" style={{margin: "0"}} onClick={closeFilterMode} size="sm">
                        Reset
                    </Button>
                ):null}
            </div>
        )
    }

    return (
        <Container>
            <Filter/>
            <Row className="justify-content-center">
                <Col style={{padding: '0'}}>
                    <div style={{
                        width: '97%',
                        height: '75vh',
                        backgroundColor: '#ffffff',
                        boxShadow: '0px 0px 5px gray',
                        borderRadius: '10px',
                        margin: '10px auto',
                        overflow: 'auto',
                    }}>
                        <table style={{
                            width: '100%',
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            boxShadow: '0px 0px 5px gray',  
                        }}>
                            <thead>
                                <tr style={{backgroundColor: "rgb(225, 225, 225)"}}>
                                    <th style={{
                                        fontSize: '0.9em',
                                        fontFamily: 'calibri',
                                        textAlign: 'center',
                                        padding: "5px"
                                    }}>
                                        User
                                    </th>
                                    <th style={{
                                        fontSize: '0.9em',
                                        fontFamily: 'calibri',
                                        textAlign: 'center',
                                        padding: "5px"
                                    }}>
                                        Page
                                    </th>
                                    <th style={{
                                        fontSize: '0.9em',
                                        fontFamily: 'calibri',
                                        textAlign: 'center',
                                        padding: "5px"
                                    }}>
                                        Action
                                    </th>
                                    <th style={{
                                        fontSize: '0.9em',
                                        fontFamily: 'calibri',
                                        textAlign: 'center',
                                        padding: "5px"
                                    }}>
                                        Datetime
                                    </th>
                                    <th style={{
                                        fontSize: '0.9em',
                                        fontFamily: 'calibri',
                                        textAlign: 'center',
                                        padding: "5px"
                                    }}>
                                        SO
                                    </th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.length === 0?(
                                    <tr style={{
                                        lineHeight: '0px'
                                    }}>
                                        <td colSpan="5" style={{
                                            textAlign: "center",
                                            fontSize: "1.0em",
                                            fontFamily: "calibri",
                                            height: '1px',
                                            padding: '15px',
                                        }}>
                                            There are no registered records
                                        </td>
                                    </tr>
                                ):(
                                    <>
                                        {historyData.map((historic, index) => (
                                            <HistoricItem key={`historic-${index}`} historic={historic} index={index}/>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default HistoryPage;