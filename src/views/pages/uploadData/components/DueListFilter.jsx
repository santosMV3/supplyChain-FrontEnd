import React, {useState} from 'react';
import "./styles/style-duelist-filter.css";
import {Button, Input} from "reactstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { formatDateAmerican, formatDate } from "../../../../utils/conversor";

registerLocale('pt-br', ptBR);

export const DuelistFilter = (props) => {

    const { reload, endpoint, orderStatus } = props;

    const [filterValue, setFilterValue] = useState({
        field: "",
        value: ""
    });
    const [filters, setFilters] = useState([]);
    const [filterState, setFilterState] = useState(false);
    const openFilterState = () => setFilterState(true);
    const closeFilterState = () => setFilterState(false);

    const [statusMode, setStatusMode] = useState(false);
    const openStatusMode = () => setStatusMode(true);
    const closeStatusMode = () => setStatusMode(false);
    
    const [colorMode, setColorMode] = useState(false);
    const openColorMode = () => setColorMode(true);
    const closeColorMode = () => setColorMode(false);
    
    const [likeMode, setLikeMode] = useState(true);
    const openLikeMode = () => setLikeMode(true);
    const closeLikeMode = () => setLikeMode(false);
    
    const filterFields = [
        ['orderStatus', 'Status'],
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
        ["firstDate","First Date", "date"],
        ["schedIDate","Sched. L. Date", "date"],
        ["SOCreationDate","SO Creation Date", "date"],
        ["confDeliveryDate","Conf. Delivery Date", "date"],
        ["delay","Delay"],
        ["deliveryDate","Delivery Date", "date"],
        ["availabilityCustomerDelvDate","Customer Delv. Date", "date"],
        ["itemCategory","Categ"],
        ["purchNo","Purch. No."],
        ["producingCompany","PC"],
        ["importNo","Import. No."],
        ["GRDate","GR. Date", "date"],
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
        ["dateOfNotification","Date Of Notification", "date"],
        ["fullDelivery","Full. Delivery"],
        ["PCInvoice","PC. Invoice"],
        ["PCInvoiceDate","PC. Invoice Date", "date"],
        ["situation","Color"],
        ["deliveryFactory","Delivery Factory"],
        ["importation","Importation"],
        ["previsionTrianom","ETA TRIANON", "date"],
        ["previsionFatSystem","Est. NF. Date (sys)", "date"],
        ["materiaDays","Material Days"],
        ["deadLineFat","Dead Line Fat."],
        ["previsionWeek","Prevision Fat. (Week)"],
        ["externalService","Ext. Service"],
        ["supplier","Supplier"],
        ["returnDays","Return Days"],
        ["releaseDate","Release Date", "date"],
        ["previsionDate","Prevision Date", "date"],
    ];

    const filterOnlyFields = filterFields.map((fieldItem) => fieldItem[1]).sort((a, b) => a.toUpperCase() == b.toUpperCase() ? 0 : a.toUpperCase() > b.toUpperCase() ? 1 : -1);

    const handlerInputFilter = (e) => {
        if (Object.keys(e).length == 0) return setFilterValue({...filterValue, "value": formatDateAmerican(e)});
        if(e.target.name === "field" && e.target.value === "Status"){
            setFilterValue({...filterValue, [e.target.name]: e.target.value});
            return openStatusMode();
        }
        else if(e.target.name === "field" && e.target.value === "Color"){
            setFilterValue({...filterValue, [e.target.name]: e.target.value});
            return openColorMode();
        }
        else if(e.target.name === "field"){
            closeColorMode();
            closeStatusMode();   
        }
        if (e.target.type === "checkbox") return setFilterValue({...filterValue, [e.target.name]: e.target.checked});
        return setFilterValue({...filterValue, [e.target.name]: e.target.value});
    }

    const clearFilterInputValue = () => {
        setFilterValue({...filterValue, "value": ""});
    }

    const addFilter = () => {
        if (!filterValue.field) return window.alert("Insert a filter to search.");
        // if (!filterValue.value && filterValue.field != "previsionWeek") return window.alert("Insert a value or and a filter to search.");
        let filterField = filterFields.filter((filterItem) => filterItem[1] === filterValue.field);
        filterField = filterField[0];

        if (filterField[0] !== "orderStatus"){
            filterField[0] = likeMode ? filterField[0] : `not_${filterField[0]}`;
        } else {
            filterField[0] = likeMode? "orderStatus" : "excludeStatus";
        }

        let filterData = {...filterValue};
        filterData.value = filterData.field === "Ext. Service" && filterData.value === "" ? false : filterData.value;
        filterData.field = filterField;
        filterData.status = likeMode;

        // const copyFilters = filters.filter((item) => item.field[0] === filterValue.field);
        // if (copyFilters.length > 0) return window.alert("Filter name has exist.");
        const filterFiltered = filters.filter((filterItem) => filterItem.field[0].replace("not_", "") == filterData.field[0]);
        if(filterFiltered.length > 0) return window.alert("This field is already being filtered.");
        setFilters([...filters, filterData]);
        setFilterValue({
            field: "",
            value: ""
        });
        closeColorMode();
        closeStatusMode();
    }

    const deleteFilter = (e) => {
        let copyFilters = [...filters];
        copyFilters.splice(e.target.value, e.target.value + 1);
        setFilters(copyFilters);
    }

    const editFilter = (index) => {
        let filterItem = filters[index];
        setFilterValue({
            field: filterItem.field[1],
            value: filterItem.value
        });
        setLikeMode((filterItem.field[0].indexOf("not_") > -1) || (filterItem.field[0] === "excludeStatus") ? false : true);
        deleteFilter({ target: { value: index } });
        if(filterItem.field[1] === "Status") openStatusMode();
        if(filterItem.field[1] === "Color") openColorMode();
    }

    const searchFilters = () => {
        let url = `/logisticMapFilter/?`;
        filters.forEach((filterItem) => {
            url += `${filterItem.field[0]}=${filterItem.value}&`;
        });
        url = url.slice(0, url.length - 1);
        console.log(url)
        reload(url);
    }

    return (
        <>
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
                        <Button color="danger" onClick={() => reload("/logisticMap/")} outline size="sm" type="button">
                            Remove Filter
                        </Button>
                    ):null}
                </div>
                <div id="container-duelist-filter-input">
                    <Input id="duelist-filter-input-select" onChange={handlerInputFilter} value={filterValue.field} name='field' bsSize="sm" type="select">
                        <option value="">Fields</option>
                        {filterOnlyFields.map((field, index) => (<option key={`filter-field-${index}`} value={field}>{field}</option>))}
                    </Input>
                    {filterValue.field === "Ext. Service" ? (
                        <div className="custom-control custom-checkbox duelist-filter-input-checkbox">
                            <input
                                className="custom-control-input"
                                id="value"
                                name='value'
                                type="checkbox"
                                onClick={handlerInputFilter}
                                defaultChecked={filterValue.value ? true : false}
                            />
                            <label className="custom-control-label" htmlFor="value">
                                Value
                            </label>
                        </div>
                    ): filterValue.field === "ETA TRIANON" ? (
                        <div id='duelist-filter-input-select-status' onDoubleClick={clearFilterInputValue}>
                            <DatePicker
                            type="date"
                            locale="pt-br"
                            onChange={handlerInputFilter}
                            value={formatDate(filterValue.value)}
                            name="releaseDate"
                            dateFormat="dd/MM/yyyy"
                            isClearable={true}/>
                        </div>
                    ) : (
                        <>
                            {statusMode ? (
                                <>
                                    <Input id="duelist-filter-input-select-status" name='value' value={filterValue.value} onChange={handlerInputFilter} bsSize="sm" type="select">
                                        <option value="">Orders status</option>
                                        {orderStatus.sort((a, b) => a.name - b.name).map((item, index) => (<option key={`filter-status-${index}`} value={item.name}>{item.name}</option>))}
                                    </Input>
                                </>
                            ):(
                                <>
                                    {colorMode ?(
                                        <Input id="duelist-filter-input-select-status" name='value' value={filterValue.value} onChange={handlerInputFilter} bsSize="sm" type="select">
                                            <option value="">Colors</option>
                                            <option value="billed">Green</option>
                                            <option value="transport">Yellow</option>
                                            <option value="undefined">White</option>
                                        </Input>
                                    ):(
                                        <Input id="duelist-filter-input-text" onChange={handlerInputFilter} value={filterValue.value} name='value' type="text" bsSize="sm"/>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    <div id="duelist-filter-container-buttons">
                        <Button id="duelist-filter-button-like" className='duelist-filter-button' color={likeMode ? "info":"danger"} onClick={likeMode ? closeLikeMode:openLikeMode} size="sm" type="button">
                            {likeMode?"Have":"Don't Have"}
                        </Button>
                        <Button className="duelist-filter-button" onClick={addFilter} color="info" size="sm" type="button">
                            Add
                        </Button>
                        <Button className="duelist-filter-button" onClick={searchFilters} color="info" size="sm" type="button">
                            Search
                        </Button>
                    </div>
                </div>
                <div className='duelist-filter-container-bubble'>
                    {filters.map((filterItem, index) => (
                        <div key={`${index}-filter-item`} onDoubleClick={() => editFilter(index)} className={filterItem.status?'duelist-filter-bubble':'duelist-filter-bubble-not-like'}>
                            <div className='duelist-filter-bubble-title'>
                                {filterItem.field[1]}:&nbsp;
                            </div>
                            <div>
                                {filterItem.field[1] === "ETA TRIANON" ? formatDate(filterItem.value) : filterItem.field[1] === "Ext. Service" ? filterItem.value ? "Yes" : "No" : filterItem.value.length > 0 ? filterItem.value.replace("billed", "Green").replace("undefined", "White").replace("transport", "Yellow"):"Null"}&nbsp;
                            </div>
                            <Button color='danger' outline onClick={deleteFilter} value={index} className='button-filter-bubble-delete' size='sm'>
                                x
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}
