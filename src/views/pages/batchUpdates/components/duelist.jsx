import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardHeader,
    Row,
    Col,
    UncontrolledTooltip,
    Table,
    Media
} from "reactstrap";

const RenderMediaList = (props) => {
    const { field, id, children } = props;

    return (
        <Media className="align-items-center">
            <Media>
                <span id={`order-${id}-${field}`} className="custom-duelist-span">
                    {children?children:null}
                </span>
                <UncontrolledTooltip
                    delay={0}
                    placement="bottom"
                    target={`order-${id}-${field}`}
                >
                    {children?children:null}
                </UncontrolledTooltip>
            </Media>
        </Media>
    )
}

const RenderRowList = (props) => {
    const { data, index, checked, selectOrder } = props;
    
    return (
        <tr>
            <td>
                <div className="custom-control custom-checkbox">
                    <input
                    className="custom-control-input"
                    id={`table-check-${data.id}`}
                    type="checkbox"
                    defaultChecked={checked}
                    onClick={() => {selectOrder(data)}}
                    />
                    <label
                    className="custom-control-label"
                    htmlFor={`table-check-${data.id}`}
                    style={{width: "0px"}}
                    />
                </div>
            </td>
            <td>
                <RenderMediaList field="documentNumber" id={data.id}>
                    {data.documentNumber}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="item" id={data.id}>
                    {data.item}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="custName" id={data.id}>
                    {data.custName}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="competenceName" id={data.id}>
                    {data.competenceName}
                </RenderMediaList>
            </td>
            <td>
                <Media className="align-items-center">
                    <Media>
                        { data.situation !== 'undefined'? (
                            <div className="custom-duelist-index" style={{
                                boxShadow: [data.situation === 'billed' ? 'inset 0px 0px 5px #25ccc1' : 'inset 0px 0px 5px #ffc559'],
                                backgroundColor: [data.situation === 'billed' ? '#25ccc1' : '#ffb700'],
                                border: [data.situation === 'billed' ? '1px solid #25ccc1' : '1px solid #ffc559']
                            }}>
                                <span className=" text-sm">
                                    {index}
                                </span>
                            </div>
                        ) : (
                            <div className="custom-duelist-index-undefined">
                                <span className=" text-sm">
                                    {index}
                                </span>
                            </div>
                        )}
                    </Media>
                </Media>
            </td>
        </tr>
    )
}

const RenderRowPreparedList = (props) => {
    const { data, index, removeOrder } = props;
    
    return (
        <tr>
            <td>
                <a
                className="table-action table-action-delete"
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    removeOrder(index-1);
                }}
                >
                    <i className="fas fa-trash" />
                </a>
            </td>
            <td>
                <RenderMediaList field="documentNumber" id={data.id}>
                    {data.documentNumber}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="item" id={data.id}>
                    {data.item}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="custName" id={data.id}>
                    {data.custName}
                </RenderMediaList>
            </td>
            <td>
                <RenderMediaList field="competenceName" id={data.id}>
                    {data.competenceName}
                </RenderMediaList>
            </td>
            <td>
                <Media className="align-items-center">
                    <Media>
                        { data.situation !== 'undefined'? (
                            <div className="custom-duelist-index" style={{
                                boxShadow: [data.situation === 'billed' ? 'inset 0px 0px 5px #25ccc1' : 'inset 0px 0px 5px #ffc559'],
                                backgroundColor: [data.situation === 'billed' ? '#25ccc1' : '#ffb700'],
                                border: [data.situation === 'billed' ? '1px solid #25ccc1' : '1px solid #ffc559']
                            }}>
                                <span className=" text-sm">
                                    {index}
                                </span>
                            </div>
                        ) : (
                            <div className="custom-duelist-index-undefined">
                                <span className=" text-sm">
                                    {index}
                                </span>
                            </div>
                        )}
                    </Media>
                </Media>
            </td>
        </tr>
    )
}

const DuelistTableComponent = (props) => {
    const { data, addOrders, addAllOrders } = props;

    const [ ordersSelected, setOrdersSelected ] = useState([]);

    const orderSelected = (order) => {
        return ordersSelected.indexOf(order) > -1 ? true : false
    }

    const selectOrder = (order) => {
        const ordersCopy = [...ordersSelected];

        if (orderSelected(order)) {
            const index = ordersCopy.indexOf(order);
            ordersCopy.splice(index, 1);
        } else {
            ordersCopy.push(order);
        }
        return setOrdersSelected(ordersCopy);
    }

    return (
        <>
        <Card>
            <CardHeader className="border-0">
                <Row>
                <Col xs="6">
                    <h3 className="mb-0">Duelist Orders:</h3>
                </Col>
                </Row>
            </CardHeader>

            <div className='my-custom-div-table'>
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                    <tr>
                        <th>
                            <div className="custom-control custom-checkbox">
                                <input
                                className="custom-control-input"
                                id="table-check-all"
                                type="checkbox"
                                onClick={(e) => addAllOrders(e)}
                                />
                                <label
                                className="custom-control-label"
                                htmlFor="table-check-all"
                                style={{width: "0px"}}>
                                    Check Page
                                </label>
                            </div>
                        </th>
                        <th>SO</th>
                        <th>Item</th>
                        <th>Cust. Name</th>
                        <th>Logistic Responsible</th>
                        <th>
                            <div>
                                <Button color="primary" size="sm" type="button" onClick={() => {
                                    addOrders(ordersSelected);
                                    setOrdersSelected([]);
                                }}>
                                    Add
                                </Button>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {data ? (
                            data.map((order, index) => (<RenderRowList data={order} index={(index + 1)} key={`order-duelist-${order.id}`} checked={orderSelected(order)} selectOrder={selectOrder}/>))
                        ) : null}
                    </tbody>
                </Table>
            </div>
        </Card>
        </>
    )
}

export const DuelistTablePreparedComponent = (props) => {
    const { data, removeAllOrders, openModal, removeOrder } = props;

    const [ ordersSelected, setOrdersSelected ] = useState([]);

    const orderSelected = (order) => {
        return ordersSelected.indexOf(order) > -1 ? true : false
    }


    return (
        <>
        <Card>
            <CardHeader className="border-0">
                <Row>
                <Col xs="6">
                    <h3 className="mb-0">Duelist Orders Prepareds:</h3>
                </Col>
                </Row>
            </CardHeader>

            <div className='my-custom-div-table'>
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                    <tr>
                        <th>
                            <div className="custom-control custom-checkbox">
                                <input
                                className="custom-control-input"
                                id="table-remove-all"
                                type="checkbox"
                                onClick={(e) => removeAllOrders(e)}
                                />
                                <label
                                className="custom-control-label"
                                htmlFor="table-remove-all"
                                style={{width: "0px"}}>
                                    Remove All
                                </label>
                            </div>
                        </th>
                        <th>SO</th>
                        <th>Item</th>
                        <th>Cust. Name</th>
                        <th>Logistic Responsible</th>
                        <th>
                            <div>
                            <Button
                            color="default"
                            onClick={openModal}
                            >
                                Change
                            </Button>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        {data ? (
                            data.map((order, index) => (<RenderRowPreparedList data={order} index={(index + 1)} key={`order-duelist-prepared-${order.id}`} removeOrder={removeOrder}/>))
                        ) : null}
                    </tbody>
                </Table>
            </div>
        </Card>
        </>
    )
}

export default DuelistTableComponent;