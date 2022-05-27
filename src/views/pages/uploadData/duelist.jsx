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
    const [logMapData, setLogMapData] = useState([]);
    const [logOrderStatus, setOrderStatus] = useState([]);

    const getLogMapData = () => {
        api.get("/logisticMap/").then((res) => {
            setLogMapData(res.data.results);
        }).catch(console.error);
    }

    const getOrderStatus = () => {
        api.get("/statusOrder/").then((res) => {
            setOrderStatus(res.data);
        }).catch(console.error);
    }

    useEffect(() => {
        getLogMapData();
        getOrderStatus();
    }, []);

    return (
        <div id="ContainerPage">
            <DuelistFilter/>
            <TableList>
                <THeadList/>
                <tbody>
                    <RenderRowList data={logMapData} ordersStatus={logOrderStatus}/>
                </tbody>
            </TableList>
            <DueListPagination/>
        </div>
    )
}

export default Duelist;