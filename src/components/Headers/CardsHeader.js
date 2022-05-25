import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// reactstrap components
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";
import { api } from "services/api";

import InlineLoader from "views/pages/components/custom/loader/inlineLoader";

function CardsHeader() {
  const [billedOrders, setBilledOrders] = React.useState(0);
  const [billedOrdersLoged, setBilledOrdersLoged] = React.useState(0);
  const [billedValues, setBilledValues] = React.useState("R$ 0,00");
  const [billedValuesLogged, setBilledValuesLogged] = React.useState("R$ 0,00");
  const [loaderState, setLoaderState] = React.useState(true);

  const getKPIsData = () => {
    const loggedUserID = localStorage.getItem('AUTHOR_ID');
    Promise.all([
      api.get('/statusFirst/'),
      api.get(`/users/${loggedUserID}/`),
      api.get('/statusOrder/'),
      api.get('/logMapAnalitic/')
    ])
        .then((response) => {
          const fullName = `${response[1].data.first_name} ${response[1].data.last_name}`;
          let idOrdersStatus = response[2].data.filter((orderStatus) => orderStatus.idStatus === response[0].data.idStatus);
          idOrdersStatus = idOrdersStatus.map((orderStatus) => orderStatus.idOrder);
          Promise.all(idOrdersStatus.map((order) => api.get(`/logisticMap/${order}/`)))
              .then((orders) => {
                let values = 0;
                orders.forEach((order) => values+=parseFloat(order.data.openValueLocalCurrency));

                // #2 KPI
                setBilledValues(values.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));

                // #4 KPI
                setBilledOrders(parseInt(response[3].data.total) - parseInt(response[2].data.length));

                let loggedStatusOrders = response[2].data.filter((orderStatus) => orderStatus.idUser === response[1].data.id);
                loggedStatusOrders = loggedStatusOrders.filter((orderStatus) => orderStatus.idStatus === response[0].data.idStatus);

                Promise.all(loggedStatusOrders.map((orderStatus) => api.get(`/logisticMap/${orderStatus.idOrder}/`)))
                    .then((loggedOrders) => {

                      // #1 KPI
                      let loggedValues = 0;
                      loggedOrders.forEach((order) => loggedValues+=parseFloat(order.data.openValueLocalCurrency));
                      setBilledValuesLogged(loggedValues.toLocaleString('pt-BR', {style: 'currency', currency: "BRL"}));

                      // #3 KPI
                      api.get(`/logisticMap?competenceName=${fullName}`)
                          .then((orders) => {
                            setBilledOrdersLoged(parseInt(orders.data.count) - parseInt(loggedStatusOrders.length));
                            setLoaderState(false);
                          })
                          .catch((error) => {
                            console.error(error);
                            setLoaderState(false);
                          });

                    })
                    .catch((error) => {
                      console.error(error);
                      setLoaderState(false);
                    });
              })
              .catch((error) => {
                console.error(error);
                setLoaderState(false);
              });

        })
        .catch((error) => {
          console.error(error);
          setLoaderState(false);
        });
  }

  React.useEffect(() => {
    let abortController = new AbortController();
    getKPIsData();
    return () => {
      abortController.abort();
    }
  }, []);

  const ContainerInlineLoader = () => {
    return (
      <div style={{
        width: "75px",
        marginLeft: "-10px"
      }}>
        <InlineLoader/>
      </div>
    )
  }

  return (
    <>
      <div className="header bg-info pb-6">
        <Container fluid>
          <div className="header-body">
            
            <Row>
              <Col md="6" xl="3">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                          style={{padding: "0px", margin: "0px"}}
                        >
                          Your Invoiced Values
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0" style={{
                          fontSize: '1.0em'
                        }}>
                          {loaderState?(<ContainerInlineLoader/>):billedValuesLogged}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow" style={{width: "43px", height: "43px"}}>
                          <i className="ni ni-money-coins" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      <span className="text-nowrap">Total invoiced values by you</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col md="6" xl="3">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          All Invoiced Values
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0" style={{
                          fontSize: '1.0em'
                        }}>
                          {loaderState?(<ContainerInlineLoader/>):billedValues}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow" style={{width: "43px", height: "43px"}}>
                          <i className="ni ni-money-coins" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      <span className="text-nowrap">Total invoiced values by all</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col md="6" xl="3">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Orders to Invoice
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loaderState?(<ContainerInlineLoader/>):billedOrdersLoged}
                          </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow" style={{width: "43px", height: "43px"}}>
                          <i className="ni ni-chart-bar-32" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      {/* <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span> */}
                      <span className="text-nowrap">Your orders to invoice.</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col md="6" xl="3">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Unvoiced Orders
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loaderState?(<ContainerInlineLoader/>):billedOrders}
                          </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow" style={{width: "43px", height: "43px"}}>
                          <i className="ni ni-chart-bar-32" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      {/* <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span> */}
                      <span className="text-nowrap">Orders available to invoice</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

CardsHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default CardsHeader;
