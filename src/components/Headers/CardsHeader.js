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

function CardsHeader(props) {
  const { cardsData, loader } = props;
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
                          {loader?(<ContainerInlineLoader/>):cardsData.user_invoiced_values && cardsData.user_invoiced_values.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow" style={{width: "43px", height: "43px"}}>
                          <i className="ni ni-money-coins" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm">
                      <span className="text-nowrap">Your values invoiceds</span>
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
                          {loader?(<ContainerInlineLoader/>): cardsData.total_invoiceds_values && cardsData.total_invoiceds_values.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                          {loader?(<ContainerInlineLoader/>):cardsData.user_unvoiced_orders && String(cardsData.user_unvoiced_orders).replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}
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
                          Not Invoiced Orders
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loader?(<ContainerInlineLoader/>):cardsData.total_unvoiceds && String(cardsData.total_unvoiceds).replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}
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
