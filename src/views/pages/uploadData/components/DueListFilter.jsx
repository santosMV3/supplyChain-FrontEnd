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

    const { reload, endpoint, orderStatus, isOpen, executeExport } = props;

    const [filterValue, setFilterValue] = useState({
        field: "",
        value: "",
        values: []
    });
    const [filters, setFilters] = useState([]);
    const [filterState, setFilterState] = useState(isOpen);
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

    const [filterType, setFilterType] = useState(null);

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
        return setFilterValue({...filterValue, [e.target.name]: String(e.target.value).replace("@not@", "")});
    }

    const clearFilterInputValue = () => {
        setFilterValue({...filterValue, "value": ""});
    }

    const addFilter = () => {
        if (!filterValue.field) return window.alert("Insert a filter to search.");
        // if (!filterValue.value && filterValue.field != "previsionWeek") return window.alert("Insert a value or and a filter to search.");
        let filterField = filterFields.filter((filterItem) => filterItem[1] === filterValue.field);
        filterField = filterField[0];

        let filterData = {...filterValue};
        filterData.value = filterType === "boolean" && filterData.value === "" ? false : filterData.value;

        if (filterField[0] !== "orderStatus" && filterField[0] !== "excludeStatus"){
            if (filterType !== "boolean"){
                filterData.value = likeMode ? filterData.value : `@not@${filterData.value}`;
            } else {
                filterData.value = likeMode ? filterData.value : !(filterData.value);
            }
        } else {
            filterField[0] = likeMode? "orderStatus" : "excludeStatus";
        }

        filterData.field = filterField;
        filterData.status = [likeMode];
        filterData.type = String(filterType);
        filterData.values = [filterType === "boolean" && filterData.value === "" ? false : filterData.value];

        // const copyFilters = filters.filter((item) => item.field[0] === filterValue.field);
        // if (copyFilters.length > 0) return window.alert("Filter name has exist.");
        let filterFiltered = filters.filter((filterItem) => filterItem.field[0].replace("@not@", "") == filterData.field[0]);
        if(filterFiltered.length > 0) {
            filterFiltered = filterFiltered[0];
            const filtersCopy = [...filters];
            const filterFilteredIndex = filtersCopy.indexOf(filterFiltered[0]);

            filterFiltered.values.push(filterData.value)
            filterFiltered.status.push(likeMode);

            filtersCopy[filterFilteredIndex] = filterFiltered;
        } else {
            setFilters([...filters, filterData]);
        }
        
        setFilterValue({
            field: "",
            value: "",
            values: []
        });
        openLikeMode();
        closeColorMode();
        closeStatusMode();
        setFilterType(null);
    }

    const deleteFilter = (e) => {
        const index = e.target.value;
        let copyFilters = [...filters];
        let filterItem = copyFilters[index[0]];

        if (filterItem.values.length === 1){
            copyFilters.splice(index[0], 1);
        } else {
            filterItem.values.splice(index[1], 1);
            filterItem.status.splice(index[1], 1);
            copyFilters[index[0]] = filterItem;
        }

        setFilters(copyFilters);
    }

    const editFilter = (index) => {
        let filterItem = filters[index[0]];
        setFilterType(filterItem.type);
        
        if ( filterItem.type !== "boolean" ){
            setFilterValue({
                field: filterItem.field[1],
                value: String(filterItem.values[index[1]]).replace("@not@", "")
            });
        } else {
            setFilterValue({
                field: filterItem.field[1],
                value: filterItem.values[index[1]]
            });
        }
        setLikeMode((String(filterItem.values[index[1]]).indexOf("@not@") > -1) || (filterItem.field[0] === "excludeStatus") ? false : true);
        deleteFilter({ target: { value: index } });
        if(filterItem.field[1] === "Status") openStatusMode();
        if(filterItem.field[1] === "Color") openColorMode();
    }

    const getFilterParams = () => {
        const data = {
            filters: [],
            status_filter: [],
            status_exclude: [],
            multiple_filters: [],
            multiple_status_filters: [],
            multiple_status_exclude: []
        }

        filters.forEach((filterItem) => {
            if (filterItem.values.length === 1){
                filterItem.values.forEach((value) => {
                    if (filterItem.field[0] === "orderStatus") return data.status_filter.push([filterItem.field[0], value]);
                    if (filterItem.field[0] === "excludeStatus") return data.status_exclude.push([filterItem.field[0], value]);
                    return data.filters.push([filterItem.field[0], value]);
                });
            }
        });

        return data;
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
        <div id="container-duelist-filter" className={filterState ? "container-duelist-filter-opened" : "container-duelist-filter-closed"}>
            <div id="container-duelist-filter-itens">
                {!(isOpen) ? (
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
                        <Button color="default" size='sm' type='button' onClick={(e) => executeExport(e, getFilterParams())}>
                            Export Excel
                        </Button>
                    </div>
                ):null}
                <div id="container-duelist-filter-input" onKeyDownCapture={handleKeyPress} onKeyUpCapture={handleKeyUp} tabIndex="0">
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
                            Press <b>"ENTER"</b> to add a filter.
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="duelist-filter-button-search"
                        >
                            Press <b>"CTRL + ENTER"</b> to search.
                        </UncontrolledTooltip>
                    </div>
                </div>
                <div className='duelist-filter-container-bubble'>
                    {filters.map((filterItem, index) => 
                        filterItem.values.map((filterItemValue, indexItem) => (
                            <div key={`${index}-filter-item-${indexItem}`} onDoubleClick={() => editFilter([index, indexItem])} className={filterItem.status[indexItem]?'duelist-filter-bubble':'duelist-filter-bubble-not-like'}>
                                <div className='duelist-filter-bubble-title'>
                                    {filterItem.field[1]}:&nbsp;
                                </div>
                                <div>
                                    {
                                        filterItemValue.length === 0 ? "Empty":
                                        filterItem.type === "string" ? filterItemValue.replace("@not@", "") :
                                        filterItem.type === "boolean" ? filterItemValue ? "Yes" : "No":
                                        filterItem.type === "date" ? String(formatDate(filterItemValue)).replace("@not@", ""):
                                        filterItem.type === "select" && filterItemValue.replace("billed", "Green").replace("undefined", "White").replace("transport", "Yellow").replace("@not@", "")
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
