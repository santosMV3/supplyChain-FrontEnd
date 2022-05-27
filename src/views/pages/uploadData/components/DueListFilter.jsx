import React, {useState} from 'react';

import "./styles/style-duelist-filter.css";
import {Button, Input} from "reactstrap";

export const DuelistFilter = () => {
    const [filterState, setFilterState] = useState(false);
    const openFilterState = () => setFilterState(true);
    const closeFilterState = () => setFilterState(false);

    return (
        <div id="container-duelist-filter"
             class={filterState ? "container-duelist-filter-opened" : "container-duelist-filter-closed"}>
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
                    <Button color="danger" outline size="sm" type="button">
                        Remove Filter
                    </Button>
                </div>
                <div id="container-duelist-filter-input">
                    <Input id="duelist-filter-input-select" bsSize="sm" type="select">
                        <option value={null}>Fields</option>
                    </Input>
                    <div id="container-duelist-filter-search-input">
                        <Input id="duelist-filter-input-text" type="text" bsSize="sm"/>
                        {/*<div className="custom-control custom-checkbox">*/}
                        {/*    <input*/}
                        {/*        className="custom-control-input"*/}
                        {/*        id="value"*/}
                        {/*        type="checkbox"*/}
                        {/*    />*/}
                        {/*    <label className="custom-control-label" htmlFor="value">*/}
                        {/*        Value*/}
                        {/*    </label>*/}
                        {/*</div>*/}
                        <Button id="duelist-filter-button-search" color="info" size="sm" type="button">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
