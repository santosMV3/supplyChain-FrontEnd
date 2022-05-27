import React, {useState} from 'react';

import {Button, Pagination, PaginationItem, PaginationLink} from "reactstrap";

import "./styles/style-duelist-pagination.css";

export const DueListPagination = () => {
    const [searchPagination, setSearchPagination] = useState(false);
    const openPagination = () => setSearchPagination(true);
    const closePagination = () => setSearchPagination(false);

    return (
        <div id="container-duelist-custom-pagination-general">
            <nav aria-label="...">
                <Pagination>
                    <PaginationItem>
                        <PaginationLink
                            style={{boxShadow: '0px 0px 5px gray'}}
                            tabIndex="-1"
                        >
                            <i className="fa fa-angle-left"/>
                            <span className="sr-only">Previous</span>
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                        <PaginationLink style={{cursor: 'default'}}>
                            0
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink style={{boxShadow: '0px 0px 5px gray'}}>
                            <i className="fa fa-angle-right"/>
                            <span className="sr-only">Next</span>
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <div id={searchPagination ? "container-duelist-custom-pagination" : "container-duelist-custom-pagination-closed"}>
                            <div id="container-duelist-custom-pagination-inputs">
                                <PaginationLink onClick={searchPagination ? closePagination : openPagination} id="pagination-link-duelist">
                                    <i className="ni ni-world-2"/>
                                    <span className="sr-only">Search</span>
                                </PaginationLink>
                                <input type="number" min="1" id="input-search-duelist-pagination"/>
                                <Button id="button-search-duelist-pagination" color="primary" outline size="sm" type="button">
                                    Go
                                </Button>
                            </div>
                        </div>
                    </PaginationItem>
                </Pagination>
            </nav>
        </div>
    )
}
