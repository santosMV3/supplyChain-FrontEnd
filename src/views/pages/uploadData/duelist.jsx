import React, {useEffect, useState} from 'react';

import "../style.css";

import {
    TableList,
    THeadList,
    RenderRowList
} from './components/DueListTable.jsx'
import {DuelistFilter} from "./components/DueListFilter";
import {DueListPagination} from "./components/DueListPagination";
import {api} from "../../../services/api";

const Duelist = () => {
    const [logMapData, setLogMapData] = useState({
        results: null,
        previous: null,
        next: null,
        count: 0,
        now: 0,
        nowEndpoint: null,
    });
    const [logOrderStatus, setOrderStatus] = useState([]);

    const getLogMapData = (endpoint="/logisticMap/") => {
        api.get(endpoint).then((res) => {
            let data = res.data;
            if (endpoint.indexOf("?") > -1 && endpoint.indexOf("page=") > -1){
                const urlParams = new URLSearchParams(endpoint.split("?")[1]);
                data.now = urlParams.get('page');
            } else {
                data.now = 1;
            }
            data.nowEndpoint = endpoint;
            setLogMapData(data);
        }).catch(console.error);
    }

    function getStatus() {
        api.get("/status/").then((res) => {
            setOrderStatus(res.data);
        }).catch(console.error);
    }

    const executeAPIFunctions = (endpoint="/logisticMap/") => {
        getStatus();
        getLogMapData(endpoint);
    }

    useEffect(() => {
        executeAPIFunctions();
    }, []);

    return (
        <div id="ContainerPage">
            <DuelistFilter reload={executeAPIFunctions} endpoint={logMapData.nowEndpoint}/>
            <TableList>
                <THeadList/>
                <tbody>
                    <RenderRowList reload={executeAPIFunctions} endpoint={logMapData.nowEndpoint} data={logMapData.results} ordersStatus={logOrderStatus}/>
                </tbody>
            </TableList>
            <DueListPagination data={[logMapData.count, logMapData.previous, logMapData.next, logMapData.now, logMapData.nowEndpoint]} reload={executeAPIFunctions}/>
        </div>
    )
}

export default Duelist;