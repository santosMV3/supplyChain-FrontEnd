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

import LoaderBox from '../components/custom/loader/loaderBox';

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
    const [loader, setLoader] = useState(false);
    const [weList, setWeList] = useState([]);

    const getLogMapData = (endpoint="/logisticMapFilter/", options={ loader: true }) => {
        if (options.loader) setLoader(true);
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
            setLoader(false);
        }).catch((error) => {
            console.error(error);
            setLoader(false);
        });
    }

    function getStatus() {
        api.get("/status/?is_active=true").then((res) => {
            setOrderStatus(res.data);
        }).catch(console.error);
    }

    const getWeeks = () => {
        api.get("weeks").then((response) => {
            setWeList(response.data);
        }).catch(console.error);
    }

    const executeAPIFunctions = (endpoint="/logisticMapFilter/", options={ loader: true }) => {
        getStatus();
        getLogMapData(endpoint, options);
        getWeeks();
    }

    useEffect(() => {
        executeAPIFunctions();
    }, []);

    return (
        <div id="ContainerPage">
            <DuelistFilter reload={executeAPIFunctions} endpoint={logMapData.nowEndpoint} orderStatus={logOrderStatus}/>
            {loader ? (
                <LoaderBox message="Loading orders... Please wait!"/>
            ) : (
                <>
                    <TableList>
                        <THeadList/>
                        <tbody>
                            <RenderRowList reload={executeAPIFunctions} endpoint={logMapData.nowEndpoint} data={logMapData.results} ordersStatus={logOrderStatus} weList={weList}/>
                        </tbody>
                    </TableList>
                    <DueListPagination data={[logMapData.count, logMapData.previous, logMapData.next, logMapData.now, logMapData.nowEndpoint]} reload={executeAPIFunctions}/>
                </>
            )}
        </div>
    )
}

export default Duelist;