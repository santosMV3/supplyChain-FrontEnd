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

import Dashboard from "views/pages/dashboards/Dashboard.js";
import Login from "views/pages/examples/Login.js";

// My Imports
import ListUsers from "views/pages/manageUsers/list";
import ListPermissions from "views/pages/managePermissions";
import ListStatus from "views/pages/manageStatus";
import UploadPage from "views/pages/uploadData";
import ImportationData from "views/pages/ImportationData";
import ImportationDetails from "./views/pages/ImportationData/importationDetails";
import ExternalServices from "views/pages/ImportationData/externalServices";
import HistoryPage from "views/pages/history";
import Duelist from "views/pages/uploadData/duelist";
import DuelistUpload from "views/pages/uploadData/uploadPage";

const routes = [
  {
    collapse: false,
    icon: "ni ni-chart-bar-32 text-primary",
    state: "dashboardItem",
    path: "/dashboard",
    name: "Dashboard",
    miniName: "D",
    component: Dashboard,
    layout: "/admin",
  },
  {
    collapse: false,
    name: "Users",
    icon: "ni ni-circle-08 text-orange",
    state: "UsersCollapse",
    path: "/users",
    miniName: "U",
    component: ListUsers,
    layout: "/admin",
  },
  {
    collapse: false,
    name: "Permissions",
    icon: "ni ni-key-25 text-yellow",
    state: "PermissionsCollapse",
    path: "/permissions",
    component: ListPermissions,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Examples",
    icon: "ni ni-ungroup text-orange",
    state: "examplesCollapse",
    invisible: true,
    views: [
      {
        path: "/login",
        name: "Login",
        miniName: "L",
        component: Login,
        layout: "/auth",
      },
    ],
  },
  {
    collapse: true,
    name: "Management",
    icon: "ni ni-folder-17 text-gray-dark",
    state: 'statusOption',
    views: [
      {
        path: "/boardingDate",
        miniName: "PC",
        component: ImportationData,
        layout: "/admin",
        name: "Boarding Date PC",
      },
      {
        path: "/status",
        miniName: "STATS",
        component: ListStatus,
        layout: "/admin",
        name: 'Status Management'
      },
      {
        path: "/importationDetails",
        miniName: "IMP",
        layout: "/admin",
        name: "Importation Details",
        component: ImportationDetails
      },
      {
        path: "/externalServices",
        miniName: "Ext",
        component: ExternalServices,
        layout: "/admin",
        name: 'External Services'
      }
    ],
  },
  {
    collapse: false,
    name: "Due List",
    icon: "ni ni-single-copy-04 text-green",
    state: "uploadOption",
    path: "/duelist",
    miniName: "DUE LIST",
    component: UploadPage,
    layout: "/admin"
  },
  {
    collapse: false,
    name: "Historic",
    icon: "ni ni-books text-black",
    state: "historicOption",
    path: "/historic",
    miniName: "HS",
    component: HistoryPage,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Due List 2",
    icon: "ni ni-single-copy-04 text-green",
    state: "listDuelist",
    views: [
      {
        name: "Due List - List",
        miniName: "DL",
        path: "/new/duelist/list",
        component: Duelist,
        layout: "/admin"
      },
      {
        name: "Due List - Upload",
        miniName: "DU",
        path: "/new/duelist/upload",
        component: DuelistUpload,
        layout: "/admin"
      }
    ]
  }
];

export default routes;
