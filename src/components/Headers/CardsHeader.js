/*!

=========================================================
* Argon Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
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

function CardsHeader() {
  const [billedOrders, setBilledOrders] = React.useState(0);
  const [billedOrdersLoged, setBilledOrdersLoged] = React.useState(0);
  const [billedValues, setBilledValues] = React.useState("R$ 0,00");
  const [billedValuesLogged, setBilledValuesLogged] = React.useState("R$ 0,00");

  React.useEffect(() => {

    let abortController = new AbortController();

    const getFirstId = () => {
      api.get("/statusFirst/").then((status) => {
        api.get(`/statusOrder?idStatus=${status.data.idStatus}`).then((response) => {

          Promise.all(response.data.map((order) => api.get(`/logisticMap/${order.idOrder}`))).then((orders) => {
            let data = orders.map((order) => order.data);
            data = data.map((order) => Math.abs(parseFloat(order.openValueLocalCurrency)));
            let totalValue = 0;
            data.forEach((value) => {
              totalValue+=value;
            });

            setBilledValues(totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
          }).catch(console.error);
          api.get('/logMapAnalitic').then((analitic) => {
            setBilledOrders(analitic.data.total - response.data.length);
          }).catch(console.error);

          const user = localStorage.getItem("AUTHOR_ID");

          api.get(`/statusOrder?idStatus=${status.data.idStatus}&idUser=${user}`).then((logedData) => {
            
            Promise.all(logedData.data.map((order) => api.get(`/logisticMap/${order.idOrder}`))).then((orders) => {
              let values = orders.map((order) => Math.abs(parseFloat(order.data.openValueLocalCurrency)));
              let valueTotal = 0;

              values.forEach((value) => {
                valueTotal+=value;
              });
              setBilledValuesLogged(valueTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));
            }).catch(console.error);
            
            api.get(`/users/${user}`).then((user) => {
              user = user.data;
              const name = `${user.first_name} ${user.last_name}`;
              api.get(`/logisticMap?competenceName=${name}`).then((orders) => {
                orders = orders.data;
                if(orders.count === 0) return setBilledOrdersLoged(orders.count);
                else {
                  let count = orders.count;
                  setBilledOrdersLoged(count);
                }
              }).catch(console.error);
            }).catch(console.error);
          }).catch(console.error);
        }).catch(console.error);
      }).catch(console.error);
    }
    getFirstId();

    return () => {
      abortController.abort();
    }
  }, []);

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
                        >
                          Invoiced Value by you
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0" style={{
                          fontSize: '1.0em'
                        }}>
                          {billedValuesLogged}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
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
                          Total Invoiced Values
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0" style={{
                          fontSize: '1.0em'
                        }}>{billedValues}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
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
                        <span className="h2 font-weight-bold mb-0">{billedOrdersLoged}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow">
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
                        <span className="h2 font-weight-bold mb-0">{billedOrders}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
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
