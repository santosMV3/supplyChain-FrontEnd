import React, {useState} from 'react';
import "./styles/style-duelist-filter.css";
import {Button, Input, UncontrolledTooltip} from "reactstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { formatDateAmerican, formatDate } from "../../../../utils/conversor";
import filterFields, { filterOnlyFields } from "../../../../services/duelistFilters";

registerLocale('pt-br', ptBR);

export const DuelistFilter = (props) => {

    const { reload, endpoint, orderStatus } = props;

    const [filterValue, setFilterValue] = useState({
        field: "",
        value: "",
        values: []
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

    const [filterType, setFilterType] = useState("string");

    const [keyMore, setKeyMore] = useState(null);

    const handlerInputFilter = (e) => {
        if (Object.keys(e).length == 0) return setFilterValue({...filterValue, "value": formatDateAmerican(e)});

        let filterObject = null;
        if(e.target.name === "field"){
            filterObject = filterFields.filter((filterItem) => filterItem[1] === e.target.value);
            if (filterObject[0].length < 3 || filterObject[0][2] === "string") setFilterType("string");
            else setFilterType(filterObject[0][2]);
        }

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
        filterData.value = filterType === "boolean" && filterData.value === "" ? false : filterData.value;
        filterData.field = filterField;
        filterData.status = likeMode;
        filterData.type = String(filterType);
        filterData.values = [filterType === "boolean" && filterData.value === "" ? false : filterData.value];

        // const copyFilters = filters.filter((item) => item.field[0] === filterValue.field);
        // if (copyFilters.length > 0) return window.alert("Filter name has exist.");
        let filterFiltered = filters.filter((filterItem) => filterItem.field[0].replace("not_", "") == filterData.field[0]);
        if(filterFiltered.length > 0) {
            filterFiltered = filterFiltered[0];
            const filtersCopy = [...filters];
            const filterFilteredIndex = filtersCopy.indexOf(filterFiltered[0]);

            filterFiltered.values.push(filterData.value)

            filtersCopy[filterFilteredIndex] = filterFiltered;
        } else {
            setFilters([...filters, filterData]);
        }
        
        setFilterValue({
            field: "",
            value: "",
            values: []
        });
        closeColorMode();
        closeStatusMode();
    }

    const deleteFilter = (e) => {
        const AllIndex = e.target.value;
        let copyFilters = [...filters];

        if( AllIndex[1] === 0 && copyFilters[AllIndex[0]].values.length === 1) {
            copyFilters.splice(e.target.value, 1);
        } else {
            copyFilters[AllIndex[0]].values.splice(AllIndex[1], 1);
        }

        setFilters(copyFilters);
    }

    const editFilter = (index) => {
        let filterItem = filters[index[0]];
        setFilterValue({
            field: filterItem.field[1],
            value: filterItem.values[index[1]]
        });
        setLikeMode((filterItem.field[0].indexOf("not_") > -1) || (filterItem.field[0] === "excludeStatus") ? false : true);
        deleteFilter({ target: { value: index } });
        if(filterItem.field[1] === "Status") openStatusMode();
        if(filterItem.field[1] === "Color") openColorMode();
    }

    const searchFilters = () => {
        let url = `/logisticMapFilter/?`;
        filters.forEach((filterItem) => {
            let allFilterItemValues = "";

            filterItem.values.forEach((filterItemValue) => {
                allFilterItemValues += `${filterItemValue}|`;
            });
            allFilterItemValues = allFilterItemValues.slice(0, allFilterItemValues.length - 1);
            url += `${filterItem.field[0]}=${allFilterItemValues}&`;
        });
        url = url.slice(0, url.length - 1);
        reload(url);
    }

    const handleKeyPress = (e) => {
        if (e.key === "Control") setKeyMore('Control');
        if (e.key === "Enter" && !keyMore) return addFilter();
        if (e.key === "Enter" && keyMore === "Control") {
            setKeyMore(null);
            return searchFilters();
        }
    }

    const handleKeyUp = (e) => {
        if (keyMore) setKeyMore(null);
    }


    return (
        <>
        <div id="container-duelist-filter" onKeyDownCapture={handleKeyPress} onKeyUpCapture={handleKeyUp} className={filterState ? "container-duelist-filter-opened" : "container-duelist-filter-closed"}>
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
                        <Button color="danger" onClick={() => reload("/logisticMapFilter/")} outline size="sm" type="button">
                            Remove Filter
                        </Button>
                    ):null}
                </div>
                <div id="container-duelist-filter-input">
                    <Input id="duelist-filter-input-select" onChange={handlerInputFilter} value={filterValue.field} name='field' bsSize="sm" type="select">
                        <option value="">Fields</option>
                        {filterOnlyFields.map((field, index) => (<option key={`filter-field-${index}`} value={field}>{field}</option>))}
                    </Input>
                    {filterType === "boolean" ? (
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
                    ): filterType === "date" ? (
                        <div id='duelist-filter-input-select-status' onDoubleClick={clearFilterInputValue}>
                            <DatePicker
                            type="date"
                            locale="pt-br"
                            onChange={handlerInputFilter}
                            value={formatDate(filterValue.value)}
                            dateFormat="dd/MM/yyyy"
                            isClearable={true}/>
                        </div>
                    ) : filterType === "string" ? (
                        <Input id="duelist-filter-input-text" onChange={handlerInputFilter} value={filterValue.value} name='value' type="text" bsSize="sm"/>
                    ) : filterType === "select" && (
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
                                    {colorMode && (
                                        <Input id="duelist-filter-input-select-status" name='value' value={filterValue.value} onChange={handlerInputFilter} bsSize="sm" type="select">
                                            <option value="">Colors</option>
                                            <option value="billed">Green</option>
                                            <option value="transport">Yellow</option>
                                            <option value="undefined">White</option>
                                        </Input>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    <div id="duelist-filter-container-buttons">
                        <Button id="duelist-filter-button-like" className='duelist-filter-button' color={likeMode ? "info":"danger"} onClick={likeMode ? closeLikeMode:openLikeMode} size="sm" type="button">
                            {likeMode?"Have":"Don't Have"}
                        </Button>
                        <Button id="duelist-filter-button-add" className="duelist-filter-button" onClick={addFilter} color="info" size="sm" type="button">
                            Add
                        </Button>
                        <Button id="duelist-filter-button-search" className="duelist-filter-button" onClick={searchFilters} color="info" size="sm" type="button">
                            Search
                        </Button>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="duelist-filter-button-add"
                        >
                            Press <b>"ENTER"</b> to add a filter too.
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="duelist-filter-button-search"
                        >
                            Press <b>"CTRL + ENTER"</b> to search too.
                        </UncontrolledTooltip>
                    </div>
                </div>
                <div className='duelist-filter-container-bubble'>
                    {filters.map((filterItem, index) => 
                        filterItem.values.map((filterItemValue, indexItem) => (
                            <div key={`${index}-filter-item`} onDoubleClick={() => editFilter([index, indexItem])} className={filterItem.status?'duelist-filter-bubble':'duelist-filter-bubble-not-like'}>
                                <div className='duelist-filter-bubble-title'>
                                    {filterItem.field[1]}:&nbsp;
                                </div>
                                <div>
                                    {
                                        filterItemValue.length === 0 ? "Empty":
                                        filterItem.type === "string" ? filterItemValue:
                                        filterItem.type === "boolean" ? filterItemValue ? "Yes" : "No":
                                        filterItem.type === "date" ? formatDate(filterItemValue):
                                        filterItem.type === "select" && filterItemValue.replace("billed", "Green").replace("undefined", "White").replace("transport", "Yellow")
                                    }
                                    &nbsp;
                                </div>
                                <Button color='danger' outline onClick={deleteFilter} value={[index, indexItem]} className='button-filter-bubble-delete' size='sm'>
                                    x
                                </Button>
                            </div>
                        )))}
                </div>
            </div>
        </div>
        </>
    )
}
