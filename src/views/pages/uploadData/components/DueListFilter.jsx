import React, {useState} from 'react';

import "./styles/style-duelist-filter.css";
import {Button, Input} from "reactstrap";

export const DuelistFilter = (props) => {

    const { reload, endpoint } = props;

    const [filterValue, setFilterValue] = useState({
        field: "",
        value: ""
    });
    const [filters, setFilters] = useState([]);
    const [filterState, setFilterState] = useState(false);
    const openFilterState = () => setFilterState(true);
    const closeFilterState = () => setFilterState(false);

    const filterFields = [
        ["salesRep", "Sales Rep"],
        ["competenceName", "Logistic Responsible"],
        ["custNumber","Cust. Number"],
        ["custName","Cust. Name"],
        ["docType","Document Type"],
        ["AGRegion","Region"],
        ["documentNumber","SO"],
        ["item","Item"],
        ["PONumber","PO Number"],
        ["openValueLocalCurrency","Open Value"],
        ["firstDate","First Date"],
        ["schedIDate","Sched. L. Date"],
        ["SOCreationDate","SO Creation Date"],
        ["confDeliveryDate","Conf. Delivery Date"],
        ["delay","Delay"],
        ["deliveryDate","Delivery Date"],
        ["availabilityCustomerDelvDate","Customer Delv. Date"],
        ["itemCategory","Categ"],
        ["purchNo","Purch. No."],
        ["producingCompany","PC"],
        ["importNo","Import. No."],
        ["GRDate","GR. Date"],
        ["GRQuantity","GR. Quantity"],
        ["materialNumber","Material Number"],
        ["materialDescript","Material Descript"],
        ["ordercode","Ordercode"],
        ["commQuantity","Comm. Quantity"],
        ["externalStock","External Stock"],
        ["deliveryBlock","Delivery Block"],
        ["termDescription","Payment"],
        ["incoterms","Incoterms"],
        ["route","Route"],
        ["spCarrierPartner","SP. Carrier Partner"],
        ["spName","Carrier"],
        ["confirmationTypeSC","Confirm. SC."],
        ["dateOfNotification","Date Of Notification"],
        ["fullDelivery","Full. Delivery"],
        ["PCInvoice","PC. Invoice"],
        ["PCInvoiceDate","PC. Invoice Date"],
        ["situation","Status Color"],
        ["deliveryFactory","Delivery Factory"],
        ["importation","Importation"],
        ["previsionTrianom","ETA TRIANON"],
        ["previsionFatSystem","Est. NF. Date (sys)"],
        ["materiaDays","Material Days"],
        ["deadLineFat","Dead Line Fat."],
        ["previsionWeek","Prevision Week"],
        ["externalService","Ext. Service"],
        ["supplier","Supplier"],
        ["returnDays","Return Days"],
        ["releaseDate","Release Date"],
        ["previsionDate","Prevision Date"],
    ];

    const handlerInputFilter = (e) => {
        if (e.target.type === "checkbox") return setFilterValue({...filterValue, [e.target.name]: e.target.checked});
        setFilterValue({...filterValue, [e.target.name]: e.target.value});
    }

    const addFilter = () => {
        if (!filterValue.field) return window.alert("Insert a value or and a filter to search.");
        // if (!filterValue.value && filterValue.field != "previsionWeek") return window.alert("Insert a value or and a filter to search.");

        let filterField = filterFields.filter((filterItem) => filterItem[0] === filterValue.field);
        filterField = filterField[0];

        let filterData = {...filterValue};
        filterData.field = filterField;

        const copyFilters = filters.filter((item) => item.field[0] === filterValue.field);
        if (copyFilters.length > 0) return window.alert("Filter name has exist.");
        setFilters([...filters, filterData]);

        setFilterValue({
            field: "",
            value: ""
        });
    }

    const deleteFilter = (e) => {
        let copyFilters = [...filters];
        copyFilters.splice(e.target.value, e.target.value + 1);
        setFilters(copyFilters);
    }

    const editFilter = (index) => {
        let filterItem = filters[index];
        setFilterValue({
            field: filterItem.field[0],
            value: filterItem.value
        });
        deleteFilter({ target: { value: index } });
    }

    const searchFilters = () => {
        let url = `/logisticMapFilter/?`;
        filters.forEach((filterItem) => {
            url += `${filterItem.field[0]}=${filterItem.value}&`;
        });
        url = url.slice(0, url.length - 1);
        reload(url);
    }

    return (
        <div id="container-duelist-filter" className={filterState ? "container-duelist-filter-opened" : "container-duelist-filter-closed"}>
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
                    <Input id="duelist-filter-input-select" onChange={handlerInputFilter} value={filterValue.field} name='field' bsSize="sm" type="select">
                        <option value="">Fields</option>
                        {filterFields.sort().map((field, index) => (<option key={`filter-field-${index}`} value={field[0]}>{field[1]}</option>))}
                    </Input>
                    {filterValue.field === "externalService" ? (
                        <div className="custom-control custom-checkbox duelist-filter-input-checkbox">
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
                        <Input id="duelist-filter-input-text" onChange={handlerInputFilter} value={filterValue.value} name='value' type="text" bsSize="sm"/>
                    )}
                    <div id="duelist-filter-container-buttons">
                        <Button id="duelist-filter-button-search" onClick={addFilter} color="info" size="sm" type="button">
                            Adicionar
                        </Button>
                        <Button id="duelist-filter-button-search" onClick={searchFilters} color="info" size="sm" type="button">
                            Buscar
                        </Button>
                    </div>
                </div>
                <div className='duelist-filter-container-bubble'>
                    {filters.map((filterItem, index) => (
                        <div key={`${index}-filter-item`} onDoubleClick={() => editFilter(index)} className='duelist-filter-bubble'>
                            <div className='duelist-filter-bubble-title'>
                                {filterItem.field[1]}:&nbsp;
                            </div>
                            <div>
                                {filterItem.value.length > 0 ? filterItem.value:"Null"}&nbsp;
                            </div>
                            <Button color='danger' outline onClick={deleteFilter} value={index} className='button-filter-bubble-delete' size='sm'>
                                x
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
