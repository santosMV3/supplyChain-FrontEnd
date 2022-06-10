import React, {useState} from 'react';

import {Button, Pagination, PaginationItem, PaginationLink} from "reactstrap";

import "./styles/style-duelist-pagination.css";

export const DueListPagination = (props) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchPagination, setSearchPagination] = useState(false);
    const openPagination = () => setSearchPagination(true);
    const closePagination = () => setSearchPagination(false);

    const { data, reload } = props;

    const maxPage = () => {
        let maxPageNumber = 0;
        
        if(data[0]){
            const fullPage = [data[0] / 40, data[0] % 40];
            maxPageNumber = fullPage[1] > 0 ? parseInt(fullPage[0]) + 1 : fullPage[0];
        }

        return maxPageNumber;
    }

    const changeInput = (e) => {
        const maxPageNumber = maxPage();
        if(e.target.value === "") e.target.value = 0;
        if(e.target.value > maxPageNumber) e.target.value = maxPageNumber;
        setPageNumber(e.target.value);
    }

    const goToPage = () => {
        if(data[4].indexOf("?") > -1 && data[4].indexOf("page=") > -1) {
            const urlParams = new URLSearchParams(data[4].split("?")[1]);
            const page = urlParams.get('page').toString();
            const indexInit = data[4].indexOf(`page=${page}`);
            const indexEnd = indexInit + 5 + page.length;
            const pagePart = data[4].slice(indexInit, indexEnd);
            const newUrl = data[4].replace(pagePart, `page=${pageNumber}`);
            reload(newUrl);
        } else {
            reload(data[4].indexOf("?") > -1 ? `${data[4]}&page=${pageNumber}` : `${data[4]}?page=${pageNumber}`);
        }
    }

    return data[0] > 0 ?(
        <div id="container-duelist-custom-pagination-general">
            <nav aria-label="...">
                <Pagination>
                    <PaginationItem className={data[1] && reload?'':'disabled'}>
                        <PaginationLink
                            style={{boxShadow: '0px 0px 5px gray'}}
                            tabIndex="-1"
                            onClick={() => reload(data[1])}
                        >
                            <i className="fa fa-angle-left"/>
                            <span className="sr-only">Previous</span>
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                        <PaginationLink style={{cursor: 'default'}}>
                            {data ? parseInt(data[3]) : 0}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={data[2] && reload?'':'disabled'}>
                        <PaginationLink style={{boxShadow: '0px 0px 5px gray'}}
                        onClick={() => reload(data[2])}>
                            <i className="fa fa-angle-right"/>
                            <span className="sr-only">Next</span>
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={maxPage() > 1 ? "":"disabled"}>
                        <div id={searchPagination ? "container-duelist-custom-pagination" : "container-duelist-custom-pagination-closed"}>
                            <div id="container-duelist-custom-pagination-inputs">
                                <PaginationLink onClick={searchPagination ? closePagination : openPagination} id="pagination-link-duelist">
                                    <i className="ni ni-world-2"/>
                                    <span className="sr-only">Search</span>
                                </PaginationLink>
                                <input type="number" min="1" max={() => maxPage()} value={pageNumber} onChange={changeInput} id="input-search-duelist-pagination"/>
                                <Button id="button-search-duelist-pagination" onClick={goToPage} color="primary" outline size="sm" type="button">
                                    Go
                                </Button>
                            </div>
                        </div>
                    </PaginationItem>
                </Pagination>
            </nav>
        </div>
    ): null
}
