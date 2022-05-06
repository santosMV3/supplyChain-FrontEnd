import React, { useState, useEffect } from "react";
// react plugin used to create charts
import { Pie, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
} from "reactstrap";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";

import {
  chartExample2,
  chartExample6
} from "variables/charts.js";
import { api } from "services/api";

function Dashboard() {
  const [billedOrders, setBilledOrders] = useState([]);
  const [WEOrdersState, setWEOrdersState] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["Orders"],
    totalQuatity: 0,
    totalInvoiced: 0,
    datasets: [
      {
        data: [0],
        label: "Not Invoiced: ",
        maxBarThickness: 10,
        backgroundColor: 'rgba(255, 17, 0, 1)',
        borderColor: 'rgba(255, 17, 0, 1)',
        borderWidth: 1,
      },
      {
        data: [0],
        label: "Invoiced: ",
        maxBarThickness: 10,
        backgroundColor: 'rgba(0, 255, 51, 1)',
        borderColor: 'rgba(0, 255, 51, 1))',
        borderWidth: 1,
      }
    ]
  });

  const [statusValues, setStatusValues] = useState({
    labels: ["Orders"],
    totalQuatity: 0,
    totalInvoiced: 0,
    datasets: [
      {
        data: [0],
        label: "Not Invoiced: ",
        maxBarThickness: 10,
        backgroundColor: 'rgba(255, 17, 0, 1)',
        borderColor: 'rgba(255, 17, 0, 1)',
        borderWidth: 1,
      },
      {
        data: [0],
        label: "Invoiced: ",
        maxBarThickness: 10,
        backgroundColor: 'rgba(0, 255, 51, 1)',
        borderColor: 'rgba(0, 255, 51, 1))',
        borderWidth: 1,
      }
    ]
  });

  const [externalData, setExternalData] = useState({
    returnPeriodExceeded: 0,
    returnPeriod: 0,
    noneValues: 0,
    total: 0
  });

  const [kpiData, setKpiData] = useState({
    noTransporter: 0,
    prePayment: 0,
    withTransporter: 0,
    noPrePayment: 0,
    totalOrders: 0
  })

  useEffect(() => {
    let abortController = new AbortController();
    const getCompetences = () => {
      Promise.all([
        api.get(`/statusFirst`),
        api.get('/logMapExternalServices/'),
        api.get('/logMapKPIItens/'),
        api.get('/logMapToInvoice/')
      ]).then((response) => {
        // REQUISITION #1
        const idStatus = response[0].data.idStatus;
        api.get(`/statusOrder?idStatus=${idStatus}`).then((orderStatus) => {
          Promise.all(orderStatus.data.map((status) => api.get(`/logisticMap/${status.idOrder}`))).then((orders) => {
            orders = orders.map((order) => order.data);
            Promise.all([
              api.get("/logMapCompetence"),
              api.get(`/logisticMapWE`)
            ]).then((multiData) => {
              const competencesTotal = multiData[0].data;
              orders.forEach((order) => {
                const index = competencesTotal.competences.indexOf(order.competenceName);
                const data = {
                  nome: competencesTotal.competences[index],
                  value: competencesTotal.values[index],
                  quantity: competencesTotal.quantity[index],
                }

                order.total = data;
              });
              setBilledOrders(orders);
              setWEOrdersState(multiData[1].data);
            }).catch(console.error);
          });
        }).catch(console.error);

        //REQUISITION #2
        setExternalData(response[1].data);

        //REQUISTION #3
        setKpiData(response[2].data);

        //REQUISITION #4
        setChartData({
          labels: ['Orders'],
          totalQuatity: parseInt(response[3].data.quantityInvoiced) + parseInt(response[3].data.quantityOrders),
          totalInvoiced: 0,
          datasets: [
            {
              data: [response[3].data.quantityOrders],
              label: "Not Invoiced: ",
              maxBarThickness: 10,
              backgroundColor: 'rgba(255, 17, 0, 1)',
              borderColor: 'rgba(255, 17, 0, 1)',
              borderWidth: 1,
            },
            {
              data: [response[3].data.quantityInvoiced],
              label: "Invoiced: ",
              maxBarThickness: 10,
              backgroundColor: 'rgba(0, 255, 51, 1)',
              borderColor: 'rgba(0, 255, 51, 1))',
              borderWidth: 1,
            }
          ]
        });
        setStatusValues({
          labels: ["Orders"],
          totalQuatity: parseFloat(response[3].data.valueInvoiced) + parseFloat(response[3].data.valueOrders),
          totalInvoiced: 0,
          datasets: [
            {
              data: [response[3].data.valueOrders],
              label: "Not Invoiced: ",
              maxBarThickness: 10,
              backgroundColor: 'rgba(255, 17, 0, 1)',
              borderColor: 'rgba(255, 17, 0, 1)',
              borderWidth: 1,
            },
            {
              data: [response[3].data.valueInvoiced],
              label: "Invoiced: ",
              maxBarThickness: 10,
              backgroundColor: 'rgba(0, 255, 51, 1)',
              borderColor: 'rgba(0, 255, 51, 1))',
              borderWidth: 1,
            }
          ]
        });
      }).catch(console.error);
    }

    getCompetences();
    return () => abortController.abort();
  }, []);

  const BilledGraphicQuantity = ({...props}) => {
    const chartData = {
      labels: [],
      totalUnvoiced: 0,
      datasets: [
        {
          data: [],
          label: "Invoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(0, 255, 51, 1)',
          borderColor: 'rgba(0, 255, 51, 1)',
          borderWidth: 1,
        },
        {
          data: [],
          label: "Unvoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    const competenceNames = [];
    const competenceQuantity = [];
    const unvoicedQuantity = [];
    let totalUnvoiced = 0;
    props.billedOrders.filter((order) => {

      const index = competenceNames.indexOf(order.competenceName);

      if(index === -1){
        competenceNames.push(order.competenceName);
        competenceQuantity.push(1);
        return unvoicedQuantity.push(order.total.quantity);
      } else {
        return competenceQuantity[index] += 1;
      }

    });

    unvoicedQuantity.forEach((value) => totalUnvoiced+=value);

    chartData.labels = competenceNames;
    chartData.datasets[0].data = competenceQuantity;
    chartData.datasets[1].data = unvoicedQuantity;
    chartData.totalUnvoiced = totalUnvoiced;


    return (
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Quantity:</h5>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="chart">
                <Bar
                  data={chartData}
                  options={chartExample2.options}
                  className="chart-canvas"
                  id="chart-bars"
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total Invoiced: {props.billedOrders.length}</h5>
          <h5 className="h4 mb-0">Total Unvoiced: {chartData.totalUnvoiced}</h5>
        </div>
      </div>
    )
  }

  const BilledGraphicValues = ({...props}) => {
    const chartData = {
      labels: [],
      total: 0,
      totalUnvoiced: 0,
      datasets: [
        {
          data: [],
          label: "Invoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(0, 255, 51, 1)',
          borderColor: 'rgba(0, 255, 51, 1)',
          borderWidth: 1,
        },
        {
          data: [],
          label: "Unvoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    const competenceNames = [];
    const competenceValues = [];
    const unvoicedValues = [];
    let total = 0;
    let totalUnvoiced = 0;
    props.billedOrders.filter((order) => {

      const index = competenceNames.indexOf(order.competenceName);
      const value = parseFloat(order.openValueLocalCurrency);

      if(index === -1){
        competenceNames.push(order.competenceName);
        competenceValues.push(value);
        unvoicedValues.push(order.total.value);
      } else {
        competenceValues[index] += value;
      }

      return total+=value;
    });

    // totalUnvoiced = 
    
    unvoicedValues.forEach((value) => totalUnvoiced+=value);

    chartData.labels = competenceNames;
    chartData.datasets[0].data = competenceValues;
    chartData.datasets[1].data = unvoicedValues;
    chartData.total = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    chartData.totalUnvoiced = totalUnvoiced.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});


    return (
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Values (R$):</h5>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="chart">
                <Bar
                  data={chartData}
                  options={chartExample2.options}
                  className="chart-canvas"
                  id="chart-bars"
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total Invoiced: {chartData.total}</h5>
          <h5 className="h4 mb-0">Total Unvoiced: {chartData.totalUnvoiced}</h5>
        </div>
      </div>
    )
  }

  const StatusValuesChart = () => {
    const Chart = ({...props}) => {
      return (
        <Bar
          data={props.chartData}
          options={chartExample2.options}
          className="chart-canvas"
          id="chart-bars"
        />
      )
    }

    return (
    <>
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Status to Invoice (Quantity)</h5>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="chart" style={{textAlign: 'center'}}>
                <Chart chartData={chartData}/>
              </div>
            </CardBody>
          </Card>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total: {chartData.totalQuatity}</h5>
        </div>
      </div>
    </>
    );
  }

  const StatusValuesChartNotInvoiced = () => {
    const Chart = ({...props}) => {
      return (
        <Bar
          data={props.chartData}
          options={chartExample2.options}
          className="chart-canvas"
          id="chart-bars"
        />
      )
    }

    return (
    <>
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Status to Invoice (Values)</h5>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="chart" style={{textAlign: 'center'}}>
                <Chart chartData={statusValues}/>
              </div>
            </CardBody>
          </Card>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total: {statusValues.totalQuatity.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })}</h5>
        </div>
      </div>
    </>
    );
  }

  const PrevisonWEChart = () => {
    const [totalWEChart, setTotalWEChart] = useState("R$ 0,00");
    const Chart = ({...props}) => {
      const data = {
        labels: [],
        total: 0,
        datasets: [{
          label: 'Orders Per Weekly',
          data: [],
          backgroundColor: [
            'rgb(105,105,105)'
          ],
          hoverOffset: 4
        }]
      };
      let weNames = [];
      const weValues = [];
      let total = 0.0;
      props.data.forEach((order) => {
        const index = weNames.indexOf(order.previsionWeek);
        if(index === -1) weNames.push(order.previsionWeek);
      });

      function comparaNumeros(a,b) { if (a === b) return 0; if (a < b) return -1; if (a > b) return 1; }

      const colorGen = (index, opacity=1) => {
        const colors = [];
        for(let i = 0; i < index; i++){
          let r = Math.random() * 255;
          let g = Math.random() * 255;
          let b = Math.random() * 255;
          const color = `rgba(${r}, ${g}, ${b}, ${opacity})`;

          colors.push(color);
        }

        return colors;
      }

      let values = weNames.map((name) => parseInt(name.replace("WE", "")));
      values.sort(comparaNumeros);
      weNames = values.map((name) => `WE${name}`);

      props.data.forEach((order) => {
        const index = weNames.indexOf(order.previsionWeek);
        if(!weValues[index]) return weValues[index] = parseFloat(order.openValueLocalCurrency);
        return weValues[index] += parseFloat(order.openValueLocalCurrency);
      });
      data.labels = weNames;
      data.datasets[0].data = weValues;
      data.datasets[0].backgroundColor = colorGen(weNames.length);

      data.datasets[0].data.forEach((value) => {
        return total += value;
      });

      setTotalWEChart(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

      return (
        <Card>
            <CardHeader>
              <h5 className="h3 mb-0">Prevision Weekly (R$)</h5>
            </CardHeader>
            <CardBody>
              <div className="chart">
                <Pie
                  data={data}
                  options={props.options}
                  className="chart-canvas"
                  id="chart-pie"
                />
              </div>
            </CardBody>
          </Card>
      )
    }
    return (
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          {WEOrdersState.length>0?(<Chart data={WEOrdersState} options={chartExample6.options}/>):(
            <>
              <Card>
                <CardHeader>
                  <h5 className="h3 mb-0">Prevision Weekly (R$)</h5>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{textAlign: 'center'}}>
                    No orders with registered week
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px'
        }}>
          <h5 className="h4 mb-0">Total: {totalWEChart}</h5>
        </div>
      </div>
    )
  }

  const ExternalServicesChart = () => {
    const data = {
      labels: ['Exceeded Date', 'Pending Date', 'No date'],
      total: 0,
      datasets: [{
        label: 'Prevision',
        data: [externalData.returnPeriodExceeded, externalData.returnPeriod, externalData.noneValues],
        backgroundColor: [
          'rgba(0, 255, 51, 1)',
          'rgba(255, 17, 0, 1)',
          'rgb(47,79,79)'
        ],
        hoverOffset: 4
      }]
    };

    const Chart = () => {
      return (
        <Card>
          <CardHeader>
            <h5 className="h3 mb-0">Prevision External Services Date</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={chartExample6.options}
                className="chart-canvas"
                id="chart-pie"
              />
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
    <>
    <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          {externalData.total!==0?(<Chart/>):(
            <>
            <CardHeader>
            <h5 className="h3 mb-0">Prevision External Services Date</h5>
            </CardHeader>
            <CardBody>
              <div className="chart" style={{textAlign: 'center'}}>
                No external services registered
              </div>
            </CardBody>
            </>
          )}
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px'
        }}>
          <h5 className="h4 mb-0">Total: {externalData.total}</h5>
        </div>
      </div>
    </>)
  }

  const TransporterOrders = () => {
    const data = {
      labels: ['No Carrier', 'With Carrier'],
      total: 0,
      datasets: [{
        label: 'Carrier Orders',
        data: [kpiData.noTransporter, kpiData.withTransporter],
        backgroundColor: [
          'rgba(255, 17, 0, 1)',
          'rgb(47,79,79)'
        ],
        hoverOffset: 4
      }]
    };

    const Chart = () => {
      return (
        <Card>
          <CardHeader>
            <h5 className="h3 mb-0">No Carrier Orders:</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={chartExample6.options}
                className="chart-canvas"
                id="chart-pie"
              />
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
    <>
    <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Chart/>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px'
        }}>
          <h5 className="h4 mb-0">Total: {kpiData.totalOrders}</h5>
        </div>
      </div>
    </>)
  }

  const PrePaymentOrders = () => {
    const data = {
      labels: ['Prepayment', 'Regular Payment'],
      total: 0,
      datasets: [{
        label: 'Carrier Orders',
        data: [kpiData.prePayment, kpiData.noPrePayment],
        backgroundColor: [
          'rgba(0, 255, 51, 1)',
          'rgb(47,79,79)'
        ],
        hoverOffset: 4
      }]
    };

    const Chart = () => {
      return (
        <Card>
          <CardHeader>
            <h5 className="h3 mb-0">Prepayment Orders:</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={chartExample6.options}
                className="chart-canvas"
                id="chart-pie"
              />
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
    <>
    <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '445px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "400px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Chart/>
        </div>
        <div style={{
          width: '100%',
          height: '45px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          boxSizing: 'border-box',
          padding: '10px'
        }}>
          <h5 className="h4 mb-0">Total: {kpiData.totalOrders}</h5>
        </div>
      </div>
    </>)
  }

  return (
    <>
      <CardsHeader name="Default" parentName="Dashboards" />
      <Container className="mt--6" fluid style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '20px'
      }}>
        {billedOrders.length === 0?
        <>
          <div style={{
            width: "48%",
            boxShadow: "0px 0px 5px gray",
            borderRadius: "10px",
            height: '445px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: "100%",
              height: "400px",
              overflow: 'hidden',
              boxShadow: "0px 0px 2px gray",
            }}>
              <Card>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h5 className="h3 mb-0">Orders Quantity:</h5>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{textAlign: 'center'}}>
                      No invoiced orders
                  </div>
                </CardBody>
              </Card>
            </div>
            <div style={{
              width: '100%',
              height: '45px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              boxSizing: 'border-box',
              padding: '10px',
              justifyContent: "space-around"
            }}>
              <h5 className="h4 mb-0">Total Invoiced: 0</h5>
              <h5 className="h4 mb-0">Total Unvoiced: 0</h5>
            </div>
          </div>
          <div style={{
            width: "48%",
            boxShadow: "0px 0px 5px gray",
            borderRadius: "10px",
            height: '445px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: "100%",
              height: "400px",
              overflow: 'hidden',
              boxShadow: "0px 0px 2px gray",
            }}>
              <Card>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h5 className="h3 mb-0">Orders Values (R$):</h5>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart" style={{textAlign: 'center'}}>
                      No invoiced orders
                  </div>
                </CardBody>
              </Card>
            </div>
            <div style={{
              width: '100%',
              height: '45px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              boxSizing: 'border-box',
              padding: '10px',
              justifyContent: "space-around"
            }}>
              <h5 className="h4 mb-0">Total Invoiced: R$0,00</h5>
              <h5 className="h4 mb-0">Total Unvoiced: R$0,00</h5>
            </div>
          </div>
        </>:(
          <>
            <BilledGraphicQuantity billedOrders={billedOrders}/>
            <BilledGraphicValues billedOrders={billedOrders}/>
          </>
        )}
      </Container>
      <Container fluid style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '20px'
      }}>
        <StatusValuesChart/>
        <StatusValuesChartNotInvoiced/>
      </Container>
      <Container fluid style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '20px'
      }}>
        <ExternalServicesChart/>
        <TransporterOrders/>
      </Container>
      <Container fluid style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '20px'
      }}>
        <PrePaymentOrders/>
        <PrevisonWEChart/>
      </Container>
    </>
  );
}

export default Dashboard;
