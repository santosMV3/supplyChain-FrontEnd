import React, { useEffect, useState } from 'react';
import { Card, CardHeader, Col, Row } from 'reactstrap';
import NotificationAlert from "react-notification-alert";

import "./styles/style.css";

import { api } from "../../../services/api";
import { DuelistFilter } from '../uploadData/components/DueListFilter';
import { DueListPagination } from '../uploadData/components/DueListPagination';
import ChangesComponent from "./components/changes";
import { filterFieldsUpdate } from 'services/duelistFilters';
import DuelistTableComponent, { DuelistTablePreparedComponent } from './components/duelist';
import { ConfirmModal } from './components/modals';
import { SuccessAlert } from 'components/Alerts';
import { ErrorAlert } from 'components/Alerts';

const BatchPage = () => {
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
    const [filters, setFilters] = useState([]);

    const [ changesList, setChangesList ] = useState([]);
    const [ ordersAdded, setOrdersAdded ] = useState([]);

    const [modalState, setModalState] = useState(false);
    const closeModal = () => setModalState(false);

    const notificationAlertRef = React.useRef(null);

    const [alert, setAlert] = useState(null);

    const notify = (data={title: "Attention", message: ""}) => {
        let options = {
        place: "tc",
        message: (
            <div className="alert-text">
                <span className="alert-title" data-notify="title">
                    {" "}
                    {data.title}
                </span>
                <span data-notify="message">
                    {data.message}
                </span>
            </div>
        ),
        type: "danger",
        icon: "ni ni-bell-55",
        autoDismiss: 7,
        };
        notificationAlertRef.current.notificationAlert(options);
    };


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

            let logMapDataCopy = data.results;
            const OrdersAddedIDs = ordersAdded.map((order) => order.id);
            const logMapDataFiltered = logMapDataCopy.filter((order) => OrdersAddedIDs.indexOf(order.id) === -1);
            data.results = logMapDataFiltered;
            
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

    const getFilters = (filters) => {
        setFilters([...filters]);
    }

    const addOrders = (ordersSelected) => {
        if (filters.length === 0) return notify({ message: "It is not possible to add orders without filters.", title: "Attention" });
        let ordersCopy = [...ordersAdded];
        let ordersCopyIDs = ordersCopy.map((orderCopy => orderCopy.id));
        const ordersFiltered = ordersSelected.filter((order) => ordersCopyIDs.indexOf(order.id) === -1);
        ordersCopy = ordersCopy.concat(ordersFiltered);
        ordersCopyIDs = ordersCopy.map((orderCopy => orderCopy.id));
        const logMapFiltered = logMapData.results.filter((order) => ordersCopyIDs.indexOf(order.id) === -1);

        setLogMapData({...logMapData, results: logMapFiltered});
        setOrdersAdded(ordersCopy);

    }

    const removeOrder = (index) => {
        const ordersCopy = [...ordersAdded];
        ordersCopy.splice(index, 1);
        setOrdersAdded(ordersCopy);
    }

    const addAllOrders = (e=null) => {
        if (filters.length === 0 && e) {
            notify({ message: "It is not possible to add orders without filters.", title: "Attention" });
            return e.target.checked = false;
        }
        if (filters.length === 0) return notify({ message: "It is not possible to add orders without filters.", title: "Attention" });
        let ordersCopy = [...ordersAdded];
        const ordersCopyIDs = ordersCopy.map((order) => order.id);
        const logMapFiltered = logMapData.results.filter((order) => ordersCopyIDs.indexOf(order.id) === -1);
        ordersCopy = ordersCopy.concat(logMapFiltered);
        setOrdersAdded(ordersCopy);
        setLogMapData({...logMapData, results: []});
        if (e) e.target.checked = false;
    }

    const removeAllOrders = (e) => {
        let logMapDataResults = logMapData.results;
        logMapDataResults = logMapDataResults.concat(ordersAdded);
        setLogMapData({...logMapData, results: logMapDataResults});
        setOrdersAdded([]);
        if (e) e.target.checked = false;
    }

    const validateFields = () => {
        if (ordersAdded.length > 0 && changesList.length > 0) return true;
        return false;
    }

    const openModal = () => {
        if (validateFields()) return setModalState(true);
        return notify({message: "Required information is missing. (Changes and Orders)"});
    };

    const executeMultipleUpdate = () => {
        const orderIDs = ordersAdded.map((order) => order.id);
        
        const changes = []
        const fieldNames = []

        changesList.forEach((change) => {
            const filterFiltered = filterFieldsUpdate.filter((filter) => filter[1] === change.field)[0];
            changes.push({field: filterFiltered[0], field_name: filterFiltered[1], value: change.value});
            fieldNames.push(filterFiltered[0])
        })

        closeModal();
        api.post('multiplesUpdates', {orders: orderIDs, changes: changes, names: fieldNames}).then(() => {
            setAlert(<SuccessAlert message="Success to execute multiple update!" setalert={setAlert}/>);
            setOrdersAdded([]);
            setChangesList([]);
        }).catch((error) => {
            setAlert(<ErrorAlert message="A Error has ocurred..." setalert={setAlert}/>);
            console.error(error);
            console.error(error.response.data);
        })
    }

    useEffect(() => {
        executeAPIFunctions();
    }, []);

    return (
        <div>
            {alert}
            <div className="rna-wrapper">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <ChangesComponent 
            filterFields={filterFieldsUpdate} 
            stateList={changesList} 
            setListState={setChangesList} 
            orderStatus={logOrderStatus}
            weList={weList}
            notify={notify}/>
            <Card>
                <CardHeader className="border-0">
                    <Row>
                    <Col xs="6">
                        <h3 className="mb-0">Filter:</h3>
                    </Col>
                    </Row>
                </CardHeader>
                <DuelistFilter reload={executeAPIFunctions} endpoint={logMapData.nowEndpoint} orderStatus={logOrderStatus} isOpen={true} getFilters={getFilters}/>
            </Card>
            <DuelistTableComponent data={logMapData.results} addOrders={addOrders} addAllOrders={addAllOrders}/>
            <DueListPagination data={[logMapData.count, logMapData.previous, logMapData.next, logMapData.now, logMapData.nowEndpoint]} reload={executeAPIFunctions}/>
            <DuelistTablePreparedComponent data={ordersAdded} removeAllOrders={removeAllOrders} openModal={openModal} removeOrder={removeOrder}/>
            <ConfirmModal modalState={modalState} closeModal={closeModal} ordersAdded={ordersAdded} execute={executeMultipleUpdate}/>
        </div>
    )
}

export default BatchPage;