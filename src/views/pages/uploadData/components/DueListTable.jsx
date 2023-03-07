import React, { useState } from 'react';
import './styles/style-duelist-table.css';
import {
    Button,
    Input,
    Media,
    Table, UncontrolledTooltip
} from "reactstrap";

import {
    formatDate,
    formatDateTime,
    toReal
} from '../../../../utils/conversor';
import { Backdrop, Fade, FormControl, InputLabel, MenuItem, Modal, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { api } from 'services/api';

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
        padding: '10px',
        borderRadius: '5px',
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "12ch",
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

const weaklyDays = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarqua-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
    'Undefined'
]

export const TableList = (props) => {
    return (
        <Table id="custom-duelist-table" className="align-items-center" responsive>
            {props.children}
        </Table>
    )
};

export const THeadList = () => {
    return (
        <thead className="thead-light">
            <tr>
                <th scope="col">Nº</th>
                <th scope="col">Cust. Name</th>
                <th scope="col">SO</th>
                <th scope="col">Item</th>
                <th scope="col">Open Value</th>
                <th scope="col">Item Categ.</th>
                <th scope="col">Sched. l. date</th>
                <th scope="col">Material Descript.</th>
                <th scope="col">Material Number</th>
                <th scope="col">ETA Trianon</th>
                <th scope='col'>Week</th>
                <th scope="col">Status</th>
            </tr>
        </thead>
    )
};

export const RenderRowList = (props) => {
    const { data, ordersStatus, reload, endpoint } = props;

    const weList = [];

    for ( let i = 1; i < 61; i++ ){
        const value = `WE${i}`;

        weList.push(
            <MenuItem value={value}>
                <em>{value}</em>
            </MenuItem>
        )
    }

    const filterOrderStatus = (idOrder) => {

        const status = ordersStatus.filter((statusRelation) => statusRelation.order_status.indexOf(idOrder) > -1);
        let statusIndex = 0;
        if (status.length > 0) {
            statusIndex = ordersStatus.indexOf(status[0]);
            return [status[0], statusIndex];
        }
        return null;
    }

    if (data) {
        if (data.length > 0){
            return data.map((order, i) => (<RowList key={`row-${i}`} order={order} i={i} weList={weList} filterOrderStatus={filterOrderStatus} reload={reload} endpoint={endpoint} ordersStatus={ordersStatus}/>));
        } else {
            return (
                <tr>
                    <td colSpan={12}>
                        No orders to load.
                    </td>
                </tr>
            )
        }
    } else {
        return (
            <tr>
                <td colSpan={12}>
                    Error to collect orders. (Server possible offline...)
                </td>
            </tr>
        )
    }
};

const RenderMediaList = (props) => {
    return (
        <Media className="align-items-center">
            <Media>
                <span id={`order-${props.index}-${props.id}`} className="custom-duelist-span">
                    {props.data?props.data:null}
                </span>
                <UncontrolledTooltip
                    delay={0}
                    placement="bottom"
                    target={`order-${props.index}-${props.id}`}
                >
                    {props.data?props.data:null}
                </UncontrolledTooltip>
            </Media>
        </Media>
    )
}

const RowList = (props) => {
    const classes = useStyles();
    const { order, i, filterOrderStatus, reload, endpoint, ordersStatus, weList } = props;
    const orderStatus = filterOrderStatus(order.id);
    const orderStatusSelected = orderStatus?orderStatus[0].idStatus:"";

    const [statusState, setStatusState] = useState([false, null]);
    const openStatusState = (e) => setStatusState([true, e.target.name]);
    const closeStatusState = () => setStatusState([false, null]);

    const [selectedStatus, setSelectedStatus] = useState(orderStatusSelected);
    const [weState, setWeState] = useState(order.previsionWeek);
    const [ weEditMode, setWeEditMode ] = useState(false);

    const [modalState, setModalState] = useState(false);
    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    const handleSelect = (e) => {
        setSelectedStatus(e.target.value);
    }

    const handlerInput = async (e) => {
        setWeState(e.target.value);
        await updateOrder();
    }

    const updateOrder = async () => {
        api.patch(`/logisticMap/${order.id}/`, {previsionWeek: weState}).then((response) => {
            const historicData = {
                page: "duelist",
                before: order.previsionWeek,
                after: weState,
                action: "update",
            }
            api.post("/history/", historicData).then(() => {
                setWeState(response.data.previsionWeek);
            }).catch(console.error);
        }).catch((error) => {
            console.error(error);
        });
    }

    const saveStatusOrder = (e) => {
        if (selectedStatus === "") return window.alert("Select a status!");
        if (orderStatusSelected === selectedStatus) return closeStatusState();
        const action = statusState[1];
        const orderId = e.target.value;
        const user = localStorage.getItem('AUTHOR_ID');

        const data = {
            idStatus:selectedStatus,
            idUser:user,
            idOrder:orderId,
        }

        const statusName = ordersStatus.filter((status) => status.idStatus === selectedStatus)[0].name
        const oldStatusName = ordersStatus.filter((status) => status.idStatus === orderStatusSelected)[0].name

        if(action === "create") {
            api.post("/statusOrder/", data).then(() => {
                api.post("/history/", { page: "DueList", after: `Added the status ${statusName} for this order.`, action: "create", SO: order.soLine }).then(() => {
                    closeStatusState();
                    window.alert("Successful to adding status.");
                    reload(endpoint);
                }).catch(console.error);
            }).catch((error) => {
                window.alert("Error adding status to order.");
                console.error(error);
            });
        } else if (action === "update") {
            api.patch(`statusOrder/${order.status_id}/`, {idStatus: data.idStatus, idUser: data.idUser}).then(() => {
                api.post("/history/", { page: "DueList", before: `Old status ${oldStatusName}`, after: `Added the status ${statusName} for this order.`, action: "update", SO: order.soLine }).then(() => {
                    closeStatusState();
                    window.alert("Success to update status.");
                    reload(endpoint);
                }).catch(console.error);
            }).catch((error) => {
                window.alert("Error updating status of this order.");
                console.error(error);
            })
        }
    }

    return (
        <>
            <tr className="custom-duelist-row">
                <td>
                    <Media className="align-items-center">
                        <Media>
                            { order.situation !== 'undefined'? (
                                <div className="custom-duelist-index" style={{
                                    boxShadow: [order.situation === 'billed' ? 'inset 0px 0px 5px #25ccc1' : 'inset 0px 0px 5px #ffc559'],
                                    backgroundColor: [order.situation === 'billed' ? '#25ccc1' : '#ffb700'],
                                    border: [order.situation === 'billed' ? '1px solid #25ccc1' : '1px solid #ffc559']
                                }}>
                                    <span className=" text-sm">
                                        {i + 1}
                                    </span>
                                </div>
                            ) : (
                                <div className="custom-duelist-index-undefined">
                                    <span className=" text-sm">
                                        {i + 1}
                                    </span>
                                </div>
                            )}
                        </Media>
                    </Media>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.custName}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.documentNumber}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.item}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={toReal(order.openValueLocalCurrency)}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.itemCategory}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={formatDate(order.schedIDate)}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.materialDescript}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.materialNumber}/>
                </td>
                <td>
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={formatDate(order.previsionTrianom)}/>
                </td>
                <td>
                    {weEditMode ? (
                        <FormControl variant="standard" required className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">
                                Week
                            </InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Permission"
                            value={weState}
                            onChange={handlerInput}
                            name="previsionWeek">
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {weList}
                            </Select>
                        </FormControl>
                    ) : (
                        <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.previsionWeek}/>
                    )}
                </td>
                <td>
                    {statusState[0]?(
                        <Media className="align-items-center">
                            <Media className='custom-duelist-media-select-status'>
                                <FormControl required className={classes.formControl}>
                                    <InputLabel className='custom-duelist-input-label-material' id="demo-simple-select-outlined-label">
                                        Status
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Permission"
                                        value={selectedStatus}
                                        onChange={handleSelect}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {ordersStatus.map((statusItem, index) => (
                                            <MenuItem key={`status-item-${index}`} value={statusItem.idStatus}>
                                                <em>{statusItem.name}</em>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button size="sm" onClick={saveStatusOrder} value={order.id} color="success">
                                    ✔
                                </Button>
                                <Button size="sm" onClick={closeStatusState} color="danger">
                                    ✘
                                </Button>
                            </Media>
                        </Media>
                    ):(
                        <Media className="align-items-center">
                            <Media>
                                {orderStatus?(
                                    <Button className='custom-duelist-button-status' onClick={openStatusState} name="update" size="sm" color="default">
                                        {orderStatus[0].name}
                                    </Button>
                                ):(
                                    <Button className='custom-duelist-button-no-status' onClick={openStatusState} name="create" size="sm" color="primary">
                                        Add Status
                                    </Button>
                                )}
                                <Button size="sm" onClick={openModal} color="primary">
                                    ...
                                </Button>
                            </Media>
                        </Media>
                    )}
                </td>
            </tr>
            <TableModal
                weList={weList}
                ordersStatus={ordersStatus}
                selectedStatus={selectedStatus}
                modalState={modalState}
                reload={reload}
                endpoint={endpoint}
                closeModal={closeModal}
                order={order}
                selectedStatusName={orderStatus}
            />
        </>
    )
}

const TableModal = (props) => {
    const { 
        modalState, 
        closeModal, 
        order, 
        weList, 
        reload, 
        endpoint,
        selectedStatus,
        ordersStatus,
        selectedStatusName
    } = props;

    const orderStatusSelected = selectedStatusName?selectedStatusName[0].idStatus:"";

    const [orderStatus, setOrderStatus] = useState(selectedStatus);

    const [statusMode, setStatusMode] = useState([false, null]);
    const openStatusMode = (e) => setStatusMode([true, e.target.name]);
    const closeStatusMode = () => setStatusMode([false, null]);

    const [modalEdit, setModalEdit] = useState(false);
    const openEditMode = () => setModalEdit(true);
    const closeEditMode = () => setModalEdit(false);

    const [expandNotes, setExpandNotes] = useState(false);
    const openExpandNotes = () => setExpandNotes(true);
    const closeExpandNotes = () => setExpandNotes(false);

    const [weState, setWeState] = useState({
        previsionWeek: order.previsionWeek,
        supplier: order.supplier,
        returnDays: order.returnDays,
        releaseDate: order.releaseDate
    });

    const [commentState, setCommentState] = useState({
        comment: "",
        idOrder: order.id,
        idUser: localStorage.getItem("AUTHOR_ID")
    });

    const handlerComment = (e) => {
        let comment = e.target.value;
        if(comment.length > 500) return;
        return setCommentState({...commentState, [e.target.name]: comment});
    }

    const handlerInput = (e) => {
        setWeState({...weState, [e.target.name]: e.target.value});
    }

    const handlerStatusSelect = (e) => {
        setOrderStatus(e.target.value);
    }

    const saveStatusOrder = (e) => {
        if (orderStatus === "") return window.alert("Select a status.");
        if (orderStatus === orderStatusSelected) return closeStatusMode();
        const action = statusMode[1];
        const orderId = e.target.value;
        const user = localStorage.getItem('AUTHOR_ID');

        const data = {
            idStatus:orderStatus,
            idUser:user,
            idOrder:orderId,
        }

        const statusName = ordersStatus.filter((status) => status.idStatus === orderStatus)[0].name
        const oldStatusName = ordersStatus.filter((status) => status.idStatus === orderStatusSelected)[0].name
        
        if(action === "create") {
            api.post("/statusOrder/", data).then(() => {
                api.post("/history/", { page: "DueList", after: `Added the status ${statusName} for this order.`, action: "create", SO: order.soLine }).then(() => {
                    closeStatusMode();
                    window.alert("Successful to adding status.");
                    reload(endpoint);
                    closeModal();
                }).catch(console.error);
            }).catch((error) => {
                window.alert("Error adding status to order.");
                console.error(error);
            });
        } else if (action === "update") {
            api.patch(`statusOrder/${order.status_id}/`, data).then(() => {
                api.post("/history/", { page: "DueList", before: `Old status ${oldStatusName}`, after: `Added the status ${statusName} for this order.`, action: "update", SO: order.soLine }).then(() => {
                    closeStatusMode();
                    window.alert("Success to update status.");
                    console.log(selectedStatusName)
                    reload(endpoint);
                    closeModal();
                }).catch(console.error);
            }).catch((error) => {
                window.alert("Error updating status of this order.");
                console.error(error);
            })
        }
    }

    const updateOrder = () => {
        if(order.externalService && weState.returnDays && weState.releaseDate) {
            api.patch(`/logMapExternalCalc/${order.id}/`, weState).then(() => {
                api.post(`/history/`, {
                    page: "DueList",
                    before: order.previsionWeek,
                    after: weState.previsionWeek,
                    action: "update",
                    SO: order.soLine,
                    so: [
                        {
                            before: order.returnDays,
                            after: weState.returnDays,
                            action: "update"
                        },{
                            before: order.releaseDate,
                            after: weState.releaseDate,
                            action: "update"
                        }
                    ]
                }).then(() => {
                    window.alert("Order update success!");
                    reload(endpoint);
                    closeEditMode();
                })
            }).catch((error) => {
                window.alert("Error to update this order.");
                console.error(error);
                console.log(weState);
            });
        } else {
            api.patch(`/logisticMap/${order.id}/`, {
                previsionWeek: weState.previsionWeek,
                supplier: weState.supplier
            }).then(() => {
                api.post(`/history/`, {
                    page: "DueList",
                    before: order.previsionWeek,
                    after: weState.previsionWeek,
                    action: "update",
                    SO: order.soLine,
                    so: [
                        {
                            before: order.returnDays,
                            after: weState.returnDays,
                            action: "update"
                        },{
                            before: order.supplier,
                            after: weState.supplier,
                            action: "update"
                        }
                    ]
                }).then(() => {
                    window.alert("Order update success!");
                    reload(endpoint);
                    closeEditMode();
                })
            }).catch((error) => {
                window.alert("Error to update this order.");
                console.error(error);
            });
        }
    }

    const createNote = () => {
        if(commentState.comment.length === 0) return window.alert("Insert a comment to create a note!");
        api.post('/orderNotes/', {
            idOrder: order.id,
            comment: commentState.comment,
            idUser: commentState.idUser
        }).then(() => {
            api.post("/history/", {page: "duelist", after: commentState.comment, action: "create", SO: order.soLine}).then(() => {
                window.alert("Comment created success!");
                setCommentState({...commentState, comment: ""});
                reload(endpoint);
            }).catch(console.error)
        }).catch((error) => {
            window.alert("Error to create this comment...");
            console.error(error);
        });
    }

    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalState}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={modalState}>
                <div className={classes.paper}>
                    <div className='header-duelist-modal'>
                        <h2 id="modal-modal-title" className='header-title-duelist-modal'>
                            Detailed information - {order.id}
                        </h2>
                        <div className='buttons-header-duelist-modal'>
                            {statusMode[0]?(
                                <Media className='custom-duelist-media-select-status'>
                                    <FormControl required className={classes.formControl}>
                                        <InputLabel className='custom-duelist-input-label-material' id="demo-simple-select-outlined-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            label="Permission"
                                            value={orderStatus}
                                            onChange={handlerStatusSelect}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {ordersStatus.map((statusItem, index) => (
                                                <MenuItem key={`status-modal-item-${index}`} value={statusItem.idStatus}>
                                                    <em>{statusItem.name}</em>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button size="sm" outline onClick={saveStatusOrder} value={order.id} color="success">
                                        ✔
                                    </Button>
                                    <Button size="sm" outline onClick={closeStatusMode} color="danger">
                                        ✘
                                    </Button>
                                </Media>
                            ):(
                                <Button size="sm" name={selectedStatusName?"update":"create"} className='action-button-duelist-modal' color="primary" outline onClick={openStatusMode}>
                                    {selectedStatusName?selectedStatusName[0].name:"Add Status"}
                                </Button>
                            )}
                            {expandNotes?(
                                <Button size="sm" className='action-button-duelist-modal' color="danger" outline onClick={closeExpandNotes}>
                                    Close Notes
                                </Button>
                            ):(
                                <Button size="sm" className='action-button-duelist-modal' color="default" outline onClick={openExpandNotes}>
                                    Open Notes
                                </Button>
                            )}
                            <Button size="sm" className='action-button-duelist-modal' color="danger" outline onClick={closeModal}>
                                Close
                            </Button>
                        </div>
                    </div>
                    <div className='container-body-duelist-modal'>
                        <div className='container-list-duelist-modal'>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Sales Rep
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Logistic Responsible
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Cust. number
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Document Type
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Region
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.salesRep}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.competenceName}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.custNumber}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.docType}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.AGRegion}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        GR. Quantity
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Ordercode
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Comm. Quantity
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        External Stock
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Delivery Block
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.GRQuantity}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.ordercode}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.commQuantity}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.externalStock}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.deliveryBlock}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Payment
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Incoterms
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Route
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        SP. Carrier Partner
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Carrier
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.termDescription}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.incoterms}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.route}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.spCarrierPartner}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.spName}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Confirm. SC.
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Date of notification
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Full. Delivery
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        PC. Invoice
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        PC. Invoice Date
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.confirmationTypeSC}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.dateOfNotification ? order.dateOfNotification : "N/A"}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.fullDelivery}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.PCInvoice}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {formatDate(order.PCInvoiceDate)}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Delivery Factory
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        SO - Linha
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        ETA Trianon
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Importation
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Import No.
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {weaklyDays[order.deliveryFactory]}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.soLine}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {formatDate(order.previsionTrianom)}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.importation}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.importNo}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Est. NF. Date (sys)
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Material Days
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Dead Line Fat.
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        PC Invoice
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Conf. Delivery Date
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.previsionFatSystem}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.materiaDays}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.deadLineFat}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.producingCompany}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {formatDate(order.confDeliveryDate)}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal'>
                                        Route
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        First Date
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        SO Creation Date
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        Purch. no.
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.route}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {formatDate(order.firstDate)}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {formatDate(order.SOCreationDate)}
                                    </div>
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.purchNo}
                                    </div>
                                </div>
                            </div>
                            <div className='row-list-duelist-modal'>
                                <div className='column-list-duelist-modal'>
                                    <div className='cell-title-list-duelist-modal clickable-duelist' onDoubleClick={modalEdit?closeEditMode:openEditMode}>
                                        Prevision Fat. (Week)
                                    </div>
                                    <div className='cell-title-list-duelist-modal'>
                                        External Service
                                    </div>
                                    <div className='cell-title-list-duelist-modal clickable-duelist' onDoubleClick={modalEdit?closeEditMode:openEditMode}>
                                        Supplier
                                    </div>
                                    <div className='cell-title-list-duelist-modal clickable-duelist' onDoubleClick={modalEdit?closeEditMode:openEditMode}>
                                        Return Days
                                    </div>
                                    <div className='cell-title-list-duelist-modal clickable-duelist' onDoubleClick={modalEdit?closeEditMode:openEditMode}>
                                        Release Date
                                    </div>
                                </div>
                                <div className='column-list-duelist-modal'>
                                    {modalEdit?(
                                        <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={closeEditMode}>
                                            <FormControl variant="standard" required
                                            className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">
                                                    Week
                                                </InputLabel>
                                                <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="demo-simple-select-outlined"
                                                label="Permission"
                                                value={weState.previsionWeek}
                                                onChange={handlerInput}
                                                name="previsionWeek">
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {weList}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    ):(
                                        <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={openEditMode}>
                                            {order.previsionWeek ? order.previsionWeek : "N/A"}
                                        </div>
                                    )}
                                    <div className='cell-value-list-duelist-modal'>
                                        {order.externalService ? "Yes" : "No"}
                                    </div>
                                    {modalEdit && order.externalService ? (
                                        <>
                                            <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={closeEditMode}>
                                                <Input id="supplierExternal"
                                                bsSize='sm'
                                                placeholder="Supplier"
                                                defaultValue={order.supplier}
                                                type="text"
                                                onChange={handlerInput}
                                                name="supplier"/>
                                            </div>
                                            <div className='cell-value-list-duelist-modal input-number clickable-duelist' onDoubleClick={closeEditMode}>
                                                <Input id="daysExternal"
                                                bsSize='sm'
                                                placeholder="Return Days"
                                                defaultValue={order.returnDays}
                                                type="number"
                                                min="0"
                                                onChange={handlerInput}
                                                name="returnDays"/>
                                            </div>
                                            <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={closeEditMode}>
                                                <Input
                                                id="dateExternal"
                                                defaultValue={new Date().getFullYear() + "-11-23T10:30:00"}
                                                type="date"
                                                bsSize='sm'
                                                onChange={handlerInput}
                                                name="releaseDate"/>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={openEditMode}>
                                                {order.supplier ? order.supplier : "N/A"}
                                            </div>
                                            <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={openEditMode}>
                                                {order.returnDays ? order.returnDays : "N/A"}
                                            </div>
                                            <div className='cell-value-list-duelist-modal clickable-duelist' onDoubleClick={openEditMode}>
                                                {order.releaseDate ? formatDate(order.releaseDate) : "N/A"}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {order.externalService ? (
                                <div className='row-list-duelist-modal'>
                                    <div className='column-list-duelist-modal'>
                                        <div className='cell-title-list-duelist-modal'>
                                            Prevision Date
                                        </div>
                                    </div>
                                    <div className='column-list-duelist-modal'>
                                        <div className='cell-value-list-duelist-modal'>
                                            {order.previsionDate ? formatDate(order.previsionDate) : "N/A"}
                                        </div>
                                    </div>
                                </div>
                            ):null}
                            {modalEdit?(
                                <div className='container-modal-edit-button'>
                                    <Button size="sm" color="success" onClick={updateOrder} id={`save-button-modal-${order.id}`} outline>
                                        Save
                                    </Button>
                                </div>
                            ):null}
                        </div>
                        <div>
                            <div className='barra-notes-duelist-modal' style={{
                                width: [expandNotes?"300px":"0px"],
                                transition: "0.5s",
                                overflow: "hidden"
                            }}>
                                <div className='container-notes-duelist-modal'>
                                    {order.comments.length > 0 ? (order.comments.map((note, index) => (
                                        <NoteItem note={note} reload={reload} endpoint={endpoint} order={order} key={`${note.id}-${index}`}/>
                                    ))) : (
                                        <div className='container-note-duelist-modal'>
                                            <div className="note-duelist-modal align-itens-center">
                                                <p>
                                                    No notes registered for this order.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='container-register-note-duelist-modal'>
                                    <div className='box-register-note-duelist-modal'>
                                        <Button color="primary" size='sm' onClick={createNote} outline> Salvar {order.id} </Button>
                                        <Input type='textarea' name='comment' onChange={handlerComment} value={commentState.comment}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}

const NoteItem = (props) => {
    const { note, endpoint, reload } = props;

    const [ buttonState, setButtonState ] = useState(false);
    const openActionButtons = () => setButtonState(true);
    const closeActionButtons = () => setButtonState(false);

    const [editMode, setEditMode] = useState(false);
    const openEditMode = () => setEditMode(true);
    const closeEditMode = () => setEditMode(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const openConfirmDelete = () => setConfirmDelete(true);
    const closeConfirmDelete = () => setConfirmDelete(false);

    const [valueEdit, setValueEdit] = useState({
        comment: note.comment
    });

    const handleInput = (e) => {
        if(e.target.value > 500) return;
        return setValueEdit({...valueEdit, [e.target.name]: e.target.value});
    }

    const updateNote = () => {
        if(valueEdit.comment.length === 0) return window.alert("Insert a comment to update this note!");

        api.patch(`/orderNotes/${note.id}/`, valueEdit).then(() => {
            api.post("/history/", {page: "duelist", before: note.comment, after: valueEdit.comment, action: "update", SO: props.order.soLine}).then(() => {
                window.alert("Comment updated success!");
                closeEditMode();
                reload(endpoint);
            }).catch(console.error);
        }).catch((error) => {
            window.alert("Error to update this comment...");
            console.error(error);
        });
    }

    const deleteNote = () => {
        api.delete(`/orderNotes/${note.id}/`).then(() => {
            api.post("/history/", {page: "duelist", before: note.comment, after: "Deleted this note.", action: "delete", SO: props.order.soLine}).then(() => {
                window.alert("Comment deleted success!");
                closeEditMode();
                reload(endpoint);
            }).catch(console.error);
        }).catch((error) => {
            window.alert("Error to delete this comment...");
            console.error(error);
        });
    }

    return (
        <div className='container-note-duelist-modal' onMouseEnter={openActionButtons} onMouseLeave={closeActionButtons}>
            <div className="note-duelist-modal">
                <div className='autor-note-duelist-modal'>
                    <div className='text-note-duelist-modal'>
                        {note.user.first_name.length > 0?`${note.user.first_name} ${note.user.last_name}`:`${note.user.username}`}
                        {localStorage.getItem("AUTHOR_ID") === note.idUser.toString() ? " (you)" : null}
                    </div>
                    {localStorage.getItem("AUTHOR_ID") === note.idUser.toString() ?(
                        <>
                            {editMode?(
                                <div>
                                    <Button color="primary" onClick={updateNote} size="sm">
                                        Save
                                    </Button>
                                    <Button color="danger" onClick={closeEditMode} size="sm">
                                        Close
                                    </Button>
                                </div>
                            ):(
                                <>
                                    <div style={{
                                        display: [buttonState? "block":"none"]
                                    }}>
                                        {confirmDelete?(
                                            <>
                                                <Button color="danger" onClick={deleteNote} onMouseLeave={closeConfirmDelete} size="sm">
                                                    Confirm
                                                </Button>
                                            </>
                                        ):(
                                            <>
                                                <Button color="primary" onClick={openEditMode} size="sm">
                                                    Edit
                                                </Button>
                                                <Button color="danger" onClick={openConfirmDelete} size="sm">
                                                    Dell
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ):null}
                    <div style={{
                        display: [(buttonState && localStorage.getItem("AUTHOR_ID") === note.idUser.toString()) || (confirmDelete && localStorage.getItem("AUTHOR_ID") === note.idUser.toString()) || (editMode && localStorage.getItem("AUTHOR_ID") === note.idUser.toString())?"none":"block"]
                    }} className='datetime-note-duelist-modal'>
                        {formatDateTime(note.dateComment)}
                    </div>
                </div>
                <p>
                    {editMode?(
                        <Input type='textarea' name='comment' value={valueEdit.comment} onChange={handleInput}/>
                    ): note.comment}
                </p>
            </div>
        </div>
    )
}