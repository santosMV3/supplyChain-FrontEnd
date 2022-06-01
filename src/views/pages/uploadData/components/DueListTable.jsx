import React from 'react';
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
    const { data, ordersStatus } = props;

    const filterOrderStatus = (id) => {
        return ordersStatus.filter((order) => order.idOrder === id);
    }

    return data.length ? data.map((order, i) => (
        (
            <tr key={`row-${i}`} className="custom-duelist-row">
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
                    <RenderMediaList index={i} data={order.previsionFatSystem}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.custName}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.documentNumber}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.item}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={toReal(order.openValueLocalCurrency)}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.itemCategory}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={formatDate(order.firstDate)}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={formatDate(order.schedIDate)}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.materialDescript}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={order.materialNumber}/>
                </td>
                <td>
                    <RenderMediaList index={i} data={formatDate(order.previsionTrianom)}/>
                </td>
                <td/>
                <td>
                    <Media className="align-items-center">
                        <Media>
                            <Button size="sm" color="primary" onClick={() => window.alert("Status Added")}>
                                New Status
                            </Button>
                            <Button size="sm" color="primary">
                                ...
                            </Button>
                        </Media>
                    </Media>
                </td>
            </tr>
        )
    )):(
        <tr>
            <td colSpan={12}>
                Error to collect orders. (Server possible offline...)
            </td>
        </tr>
    )
};

export const RenderMediaList = (props) => {
    const cellID = (Math.random() * 1000000).toFixed()
    return (
        <Media className="align-items-center">
            <Media>
                <span id={`order-${props.index}-${cellID}`} className="custom-duelist-span">
                    {props.data?props.data:null}
                </span>
                <UncontrolledTooltip
                    delay={0}
                    placement="bottom"
                    target={`order-${props.index}-${cellID}`}
                >
                    {props.data?props.data:null}
                </UncontrolledTooltip>
                </Media>
        </Media>
    )
}