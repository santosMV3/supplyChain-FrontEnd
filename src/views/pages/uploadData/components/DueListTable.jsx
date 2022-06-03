import React, { useState } from 'react';
import './styles/style-duelist-table.css';
import {
    Button,
    Media,
    Table, UncontrolledTooltip
} from "reactstrap";

import {
    formatDate,
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
        padding: '30px',
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
                <th scope="col">Billing Forecast</th>
                <th scope="col">Cust. Name</th>
                <th scope="col">SO</th>
                <th scope="col">Item</th>
                <th scope="col">Open Value</th>
                <th scope="col">Item Categ.</th>
                <th scope="col">First Date</th>
                <th scope="col">Sched. l. date</th>
                <th scope="col">Material Descript.</th>
                <th scope="col">Material Number</th>
                <th scope="col">ETA Trianon</th>
                <th scope="col"/>
                <th scope="col">Status</th>
            </tr>
        </thead>
    )
};

export const RenderRowList = (props) => {
    const { data, ordersStatus, reload, endpoint } = props;

    const filterOrderStatus = (idOrder) => {

        const status = ordersStatus.filter((statusRelation) => statusRelation.order_status.indexOf(idOrder) > -1);
        let statusIndex = 0;
        if (status.length > 0) {
            statusIndex = ordersStatus.indexOf(status[0]);
            return [status[0], statusIndex];
        }
        return null;
    }

    return data.length ? data.map((order, i) => (<RowList key={`row-${i}`} order={order} i={i} filterOrderStatus={filterOrderStatus} reload={reload} endpoint={endpoint} ordersStatus={ordersStatus}/>)):(
        <tr>
            <td colSpan={12}>
                Error to collect orders. (Server possible offline...)
            </td>
        </tr>
    )
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
    const { order, i, filterOrderStatus, reload, endpoint, ordersStatus } = props;
    const orderStatus = filterOrderStatus(order.id);
    const orderStatusSelected = orderStatus?orderStatus[0].idStatus:"";

    const [statusState, setStatusState] = useState([false, null]);
    const openStatusState = (e) => setStatusState([true, e.target.name]);
    const closeStatusState = () => setStatusState([false, null]);

    const [selectedStatus, setSelectedStatus] = useState(orderStatusSelected);

    const [modalState, setModalState] = useState(false);
    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    const handleSelect = (e) => {
        setSelectedStatus(e.target.value);
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
        
        if(action === "create") {
            api.post("/statusOrder/", data).then(() => {
                closeStatusState();
                window.alert("Successful to adding status.");
                reload(endpoint);
            }).catch((error) => {
                window.alert("Error adding status to order.");
                console.error(error);
            });
        } else if (action === "update") {
            api.patch(`statusOrder/${order.status_id}/`, data).then(() => {
                closeStatusState();
                window.alert("Success to update status.");
                reload(endpoint);
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
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={order.previsionFatSystem}/>
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
                    <RenderMediaList index={i} id={(Math.random() * 1000000).toFixed()} data={formatDate(order.firstDate)}/>
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
                <td/>
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
            <TableModal modalState={modalState} closeModal={closeModal} order={order}/>
        </>
    )
}

const TableModal = (props) => {
    const { modalState, closeModal, order } = props;
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
                        <Button size="sm" color="danger" outline onClick={closeModal}>
                            Close
                        </Button>
                    </div>
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
                                    Doc Type
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    AG Region
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
                                    GR-quantity
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
                                    Term Description
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
                                    SP. Name
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
                                    Confirmation Type SC
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Date of notification
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Full Delivery
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    PC Invoice
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    PC Invoice Date
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
                                    Billing Forecast
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Material Days
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Dead Line Fat.
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Producing Company
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
                                    Prevision Fat. (Week)
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    External Service
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Supplier
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Return Days
                                </div>
                                <div className='cell-title-list-duelist-modal'>
                                    Release Date
                                </div>
                            </div>
                            <div className='column-list-duelist-modal'>
                                <div className='cell-value-list-duelist-modal'>
                                    {order.previsionWeek ? order.previsionWeek : "N/A"}
                                </div>
                                <div className='cell-value-list-duelist-modal'>
                                    {order.externalService ? "Yes" : "No"}
                                </div>
                                <div className='cell-value-list-duelist-modal'>
                                    {order.supplier ? order.supplier : "N/A"}
                                </div>
                                <div className='cell-value-list-duelist-modal'>
                                    {order.returnDays ? order.returnDays : "N/A"}
                                </div>
                                <div className='cell-value-list-duelist-modal'>
                                    {order.releaseDate ? order.releaseDate : "N/A"}
                                </div>
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
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}