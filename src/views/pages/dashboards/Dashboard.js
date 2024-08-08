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

import LoaderBox from "../components/custom/loader/loaderBox";

var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529",
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent",
};

function Dashboard() {
  const [billedOrders, setBilledOrders] = useState({});
  const [WEOrdersState, setWEOrdersState] = useState([]);
  const [WEOrdersUnvoicedsState, setWEOrdersUnvoicedsState] = useState([]);

  const [kpiLoader, setKpiLoader] = useState(false);
  const openKPILoader = () => setKpiLoader(true);
  const closeKPILoader = () => setKpiLoader(false);

  const [ cardsData, setCardsData ] = useState({});

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
  });

  const [kpiOrderStatus, setKpiOrderStatus] = useState({});

  useEffect(() => {
    let abortController = new AbortController();

    const getDashboardData = async () => {
      try {
        openKPILoader()
        const response = await api.get("/dashboard/")

        const responseData = await response.data;
        const invoicedData = await responseData.graphic_invoiced_orders

        setBilledOrders(responseData);
        setWEOrdersState(responseData.graphic_prevision_week);
        setWEOrdersUnvoicedsState(responseData.graphic_prevision_week_invoiceds);
        setExternalData(responseData.graphic_external_services);
        setKpiData(responseData.graphic_payment_transport);
        setCardsData(responseData.graphic_cards_data);
        setKpiOrderStatus(invoicedData);

        setStatusValues();
        closeKPILoader()
      } catch (error) {
        console.error(error);
        closeKPILoader()
        window.alert("Error to get the Dashboard Data");
      }
    }

    // getCompetences();
    getDashboardData();
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
          label: "Not Invoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    chartData.labels = props.billedOrders ? props.billedOrders.competences : [];
    chartData.datasets[0].data = props.billedOrders ? props.billedOrders.invoiced_orders : [];
    chartData.datasets[1].data = props.billedOrders ? props.billedOrders.unvoiced_orders : [];
    chartData.totalUnvoiced = props.billedOrders ? props.billedOrders.totalUnvoiced : [];

    return (
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
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
                  options={
                    {
                      tooltips: {
                        callbacks: {
                          label: function (item, data) {
                            return " " + item.yLabel.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                          },
                        },
                      },
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              color: colors.gray[200],
                              zeroLineColor: colors.gray[200],
                            },
                            ticks: {
                              callback: function (value) {
                                if (!(value % 10)) {
                                  //return '$' + value + 'k'
                                  return value.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                                }
                              },
                            },
                          },
                        ],
                      },
                    }
                  }
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
          <h5 className="h4 mb-0">Total Invoiced: {props.billedOrders ? props.billedOrders.total_invoiced.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.") : 0}</h5>
          <h5 className="h4 mb-0">Total Not Invoiced: {props.billedOrders ? props.billedOrders.total_unvoiced.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.") : 0}</h5>
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
          label: "Not Invoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    chartData.labels = props.billedOrders ? props.billedOrders.competences : [];
    chartData.datasets[0].data = props.billedOrders ? props.billedOrders.invoiced_values : [];
    chartData.datasets[1].data = props.billedOrders ? props.billedOrders.unvoiced_values : [];
    chartData.total = props.billedOrders ? props.billedOrders.total_invoiced_values.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 0
    chartData.totalUnvoiced = props.billedOrders ? props.billedOrders.total_unvoiced_values.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 0


    return (
      <div style={{
        width: "48%",
        boxShadow: "0px 0px 5px gray",
        borderRadius: "10px",
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
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
                  options={
                    {
                      tooltips: {
                        callbacks: {
                          label: function (item, data) {
                            return ' R$ ' + item.yLabel.toFixed(2).replace('.',',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
                          },
                        },
                      },
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              color: colors.gray[200],
                              zeroLineColor: colors.gray[200],
                            },
                            ticks: {
                              callback: function (value) {
                                if (!(value % 10)) {
                                  //return '$' + value + 'k'
                                  return value.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                                }
                              },
                            },
                          },
                        ],
                      },
                    }
                  }
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
          <h5 className="h4 mb-0">Total Not Invoiced: {chartData.totalUnvoiced}</h5>
        </div>
      </div>
    )
  }

  const StatusValuesChart = (props) => {
    const chartData = {
      labels: props.data && props.data.status_names,
      total_quantity:props.data && props.data.status_total_quantity,
      total_values:props.data && props.data.status_total_values,
      datasets: [
        {
          data: props.data && props.data.status_quantity,
          label: "Unvoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    const Chart = () => {
      return (
        <Bar
          data={chartData}
          options={
            {
              tooltips: {
                callbacks: {
                  label: function (item, data) {
                    return " " + item.yLabel.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                  },
                },
              },
              scales: {
                yAxes: [
                  {
                    gridLines: {
                      color: colors.gray[200],
                      zeroLineColor: colors.gray[200],
                    },
                    ticks: {
                      callback: function (value) {
                        if (!(value % 10)) {
                          //return '$' + value + 'k'
                          return " " + value.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                        }
                      },
                    },
                  },
                ],
              },
            }
          }
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Status to Invoice (Quantity):</h5>
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
          <h5 className="h4 mb-0">Total: {chartData.total_quantity && chartData.total_quantity.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}</h5>
        </div>
      </div>
    </>
    );
  }

  const StatusValuesChartNotInvoiced = (props) => {
    const chartData = {
      labels: props.data && props.data.status_names,
      total_quantity:props.data && props.data.status_total_quantity,
      total_values:props.data && props.data.status_total_values,
      datasets: [
        {
          data: props.data && props.data.status_values,
          label: "Unvoiced: ",
          maxBarThickness: 10,
          backgroundColor: 'rgba(255, 17, 0, 1)',
          borderColor: 'rgba(255, 17, 0, 1)',
          borderWidth: 1,
        }
      ]
    }

    const Chart = () => {
      return (
        <Bar
          data={chartData}
          options={
            {
              tooltips: {
                callbacks: {
                  label: function (item, data) {
                    return ' R$ ' + item.yLabel.toFixed(2).replace('.',',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
                  },
                },
              },
              scales: {
                yAxes: [
                  {
                    gridLines: {
                      color: colors.gray[200],
                      zeroLineColor: colors.gray[200],
                    },
                    ticks: {
                      callback: function (value) {
                        if (!(value % 10)) {
                          //return '$' + value + 'k'
                          return value.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.");
                        }
                      },
                    },
                  },
                ],
              },
            }
          }
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          <Card>
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h5 className="h3 mb-0">Orders Status to Invoice (Values):</h5>
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
          <h5 className="h4 mb-0">Total: R$ {chartData.total_values && chartData.total_values.toFixed(2).replace('.',',').replace(/\d(?=(\d{3})+\,)/g, '$&.')}</h5>
        </div>
      </div>
    </>
    );
  }

  const PrevisonWEChart = (props) => {
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

      function comparaNumeros(a,b) { 
        if (a === b) return 0;
        if (a < b) return -1;
        if (a > b) return 1;
       }

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
              <h5 className="h3 mb-0">{props.title}:</h5>
            </CardHeader>
            <CardBody>
              <div className="chart">
                <Pie
                  data={data}
                  options={{
                    tooltips: {
                      callbacks: {
                        // this callback is used to create the tooltip label
                        label: function(tooltipItem, data) {
                          let dataLabel = " " + data.labels[tooltipItem.index];
                          const value = ": R$ " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toFixed(2).replace('.',',').replace(/\d(?=(\d{3})+\,)/g, '$&.')
  
                          dataLabel += value
  
                          return dataLabel;
                        }
                      }
                    }
                  }}
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
          overflow: 'hidden',
          boxShadow: "0px 0px 2px gray",
        }}>
          {props.data.length>0?(<Chart data={props.data ? props.data : []} title={props.title} />):(
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
          padding: '10px',
          justifyContent: "space-around"
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
          'rgba(255, 17, 0, 1)',
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
            <h5 className="h3 mb-0">Prevision External Services Date (Not Invoiced):</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={{
                  tooltips: {
                    callbacks: {
                      // this callback is used to create the tooltip label
                      label: function(tooltipItem, data) {
                        let dataLabel = " " + data.labels[tooltipItem.index];
                        const value = ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")

                        dataLabel += value

                        return dataLabel;
                      }
                    }
                  }
                }}
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
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
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total: {externalData.total && externalData.total.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}</h5>
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
            <h5 className="h3 mb-0">No Carrier Orders (Not Invoiced):</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={{
                  tooltips: {
                    callbacks: {
                      // this callback is used to create the tooltip label
                      label: function(tooltipItem, data) {
                        let dataLabel = " " + data.labels[tooltipItem.index];
                        const value = ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")

                        dataLabel += value

                        return dataLabel;
                      }
                    }
                  }
                }}
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
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
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total: {kpiData.totalOrders && kpiData.totalOrders.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}</h5>
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
            <h5 className="h3 mb-0">Prepayment Orders (Not Invoiced):</h5>
          </CardHeader>
          <CardBody>
            <div className="chart">
              <Pie
                data={data}
                options={{
                  tooltips: {
                    callbacks: {
                      // this callback is used to create the tooltip label
                      label: function(tooltipItem, data) {
                        let dataLabel = " " + data.labels[tooltipItem.index];
                        const value = ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")

                        dataLabel += value

                        return dataLabel;
                      }
                    }
                  }
                }}
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
        height: '545px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: "100%",
          height: "500px",
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
          padding: '10px',
          justifyContent: "space-around"
        }}>
          <h5 className="h4 mb-0">Total: {kpiData.totalOrders && kpiData.totalOrders.toString().replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1.")}</h5>
        </div>
      </div>
    </>)
  }

  return (
    <>
      <CardsHeader name="Default" parentName="Dashboards" cardsData={cardsData} loader={kpiLoader}/>
      {kpiLoader?(
        <LoaderBox message="Loading KPIs. Please wait..."/>
      ):(
        <>
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
                height: '545px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: "100%",
                  height: "500px",
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
                height: '545px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: "100%",
                  height: "500px",
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
                <BilledGraphicQuantity billedOrders={billedOrders?.graphic_invoiceds}/>
                <BilledGraphicValues billedOrders={billedOrders?.graphic_invoiceds}/>
              </>
            )}
          </Container>
          <Container fluid style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: '20px'
          }}>
            <StatusValuesChart data={kpiOrderStatus}/>
            <StatusValuesChartNotInvoiced data={kpiOrderStatus}/>
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
            <PrevisonWEChart title="Prevision Weekly (R$) (Not Invoiceds)" data={WEOrdersState}/>
            <PrevisonWEChart title="Prevision Weekly (R$) (Invoiceds)" data={WEOrdersUnvoicedsState}/>
        </Container>
        <Container fluid style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: '20px'
        }}>
          <PrePaymentOrders/>
        </Container>
        </>
      )}
    </>
  );
}

export default Dashboard;
