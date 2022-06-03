import React, {useState} from 'react';

import "./styles/style-duelist-filter.css";
import {Button, Input} from "reactstrap";

export const DuelistFilter = (props) => {

    const { reload, endpoint } = props;

    const [filterValue, setFilterValue] = useState({
        field: null,
        value: null
    });
    const [filterState, setFilterState] = useState(false);
    const openFilterState = () => setFilterState(true);
    const closeFilterState = () => setFilterState(false);

    const filterFields = [
        ["salesRep", "Sales Rep"],
        ["competenceName", 'COMPETENCE NAME (Z2 PARTNER)'],
        ["custNumber", 'CUST. NUMBER'],
        ["custName", 'CUST. NAME'],
        ["docType", 'Doc Type'],
        ["AGRegion", 'AG Region'],
        ["documentNumber", 'Document number'],
        ["item", 'Item'],
        ["PONumber", 'PO Number'],
        ["openValueLocalCurrency", 'Open Value: Local Currency'],
        ["firstDate", 'First Date'],
        ["schedIDate", 'Sched. l. date'],
        ["SOCreationDate", 'SO Creation Date'],
        ["confDeliveryDate", 'Conf.Deliverydat'],
        ["delay", 'Delay'],
        ["deliveryDate", 'Delivery Date'],
        ["availabilityCustomerDelvDate", 'Availability customer delv date'],
        ["itemCategory", 'Item categ.'],
        ["purchNo", 'Purch. no.'],
        ["producingCompany", 'Producing Company'],
        ["importNo", 'Import No.'],
        ["GRDate", 'GR-date'],
        ["GRQuantity", 'GR-quantity'],
        ["materialNumber", 'Materialnumber'],
        ["materialDescript", 'Material descript.'],
        ["ordercode", 'Ordercode'],
        ["commQuantity", 'Comm.quantity'],
        ["externalStock", 'External stock'],
        ["deliveryBlock", 'Delivery block'],
        ["termDescription", 'Term Description'],
        ["incoterms", 'Incoterms 1'],
        ["route", 'Route'],
        ["spCarrierPartner", 'SP Carrier Partner'],
        ["spName", 'SP Name'],
        ["confirmationTypeSC", 'Confirmation type SC'],
        ["dateOfNotification", 'Date of notification'],
        ["fullDelivery", 'full delivery'],
        ["PCInvoice", 'PC Invoice'],
        ["PCInvoiceDate", 'PC Invoice Date'],
        ["soLine", "SO LINHA"],
        ["externalService", "External Service", "check"]
    ];

    const handlerInputFilter = (e) => {
        if (e.target.type === "checkbox") return setFilterValue({...filterValue, [e.target.name]: e.target.checked});
        setFilterValue({...filterValue, [e.target.name]: e.target.value});
    }

    const actionFilter = () => {
        if (reload && filterValue.field && filterValue.value){
            closeFilterState();
            reload(`/logisticMap?${filterValue.field}=${filterValue.value}`);
        }
    }

    return (
        <div id="container-duelist-filter"
             className={filterState ? "container-duelist-filter-opened" : "container-duelist-filter-closed"}>
            <div id="container-duelist-filter-itens">
                <div id="container-duelist-filter-button">
                    {filterState ? (
                        <Button color="danger" size="sm" type="button" onClick={closeFilterState}>
                            Close
                        </Button>
                    ) : (
                        <Button color="primary" size="sm" type="button" onClick={openFilterState}>
                            Filter
                        </Button>
                    )}
                    {endpoint && endpoint.indexOf("?") > -1 ? (
                        <Button color="danger" onClick={() => reload()} outline size="sm" type="button">
                            Remove Filter
                        </Button>
                    ):null}
                </div>
                <div id="container-duelist-filter-input">
                    <Input id="duelist-filter-input-select" onChange={handlerInputFilter} name='field' bsSize="sm" type="select">
                        <option value={null}>Fields</option>
                        {filterFields.map((field, index) => (<option key={`filter-field-${index}`} value={field[0]}>{field[1]}</option>))}
                    </Input>
                    <div id="container-duelist-filter-search-input">
                        {filterValue.field === "externalService" ? (
                            <div className="custom-control custom-checkbox">
                                <input
                                    className="custom-control-input"
                                    id="value"
                                    name='value'
                                    type="checkbox"
                                    onClick={handlerInputFilter}
                                />
                                <label className="custom-control-label" htmlFor="value">
                                    Value
                                </label>
                            </div>
                        ):(
                            <Input id="duelist-filter-input-text" onChange={handlerInputFilter} name='value' type="text" bsSize="sm"/>
                        )}
                        <Button id="duelist-filter-button-search" onClick={actionFilter} color="info" size="sm" type="button">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
