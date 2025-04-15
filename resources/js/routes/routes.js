/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// import Dashboard from "../views/Dashboard.js";
import Icons from "../views/Icons.js";
import Logout from "../views/Auth/logout.js";
import Administrators from "../views/users/index.js";
import Administratorsform from "../views/users/user-form.js";
import Shopeedata from "../views/shopee/csvdata.js";
import Shopeeproducts from "../views/shopee/index.js";
import Apis from "../views/settings/apis.js";
import Shopoffers from "../views/shopee/shops.js";
import ShopProducts from "../views/shopee/shopproducts.js";
import Logs from "../views/logs/index.js";
import React from "react";
import ProductsCategory from "../views/shopee/productcategory.js";
import Apishopeepage from "../views/apis/shopee.js";
import Apifacebookpage from "../views/apis/facebook.js";
import Apisxpage from "../views/apis/x.js";
import Apiinstagram from "../views/apis/instagram.js";
import Apithreads from "../views/apis/threads.js";
import Settingsharing from "../views/apis/sharings.js";
import Dashboard from "../views/dashboard/index.js";
import ReportPost from "../views/reports/posts.js";
import ReportCommission from "../views/reports/commissions.js";
import PageProducts from "../views/shopee/pageproducts.js";
// const Dashboard = React.lazy(() => import('../views/Dashboard'))
const BackendRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    sidebar: true,
    actived: false
  },
    // Shopee data reader csv
  {
    path: "/shopee",
    name: "Shopee",
    icon: "nc-icon nc-cart-simple",
    component: Shopeedata,
    layout: "/admin",
    sidebar: true,
    actived: false,
    submenu:[
      {
        path: "/shopee/data",
        name: "CSV Import",
        icon: "nc-icon nc-tap-01",
        component: Shopeedata,
        layout: "/admin",
        sidebar: true,
        actived: false,
      },
      {
        path: "/shopee/products",
        name: "Products",
        icon: "nc-icon nc-notes",
        component: Shopeeproducts,
        layout: "/admin",
        sidebar: true,
        actived: false
      },
      {
        path: "/shopee/page/:id",
        name: "Page Filter",
        icon: "nc-icon nc-square-pin",
        component: PageProducts,
        activedPath: '/shopee/products',
        layout: "/admin",
        sidebar: false,
        actived: false
      },
      {
          path: "/shopee-shop",
          name: "Shops Offers",
          icon: "nc-icon nc-square-pin",
          component: Shopoffers,
          layout: "/admin",
          sidebar: true,
          actived: false
      },
      {
          path: "/shopee-shop/:id",
          name: "Shops Offers",
          icon: "nc-icon nc-square-pin",
          component: ShopProducts,
          activedPath: '/shopee/products',
          layout: "/admin",
          sidebar: false,
          actived: false
      },
      {
          path: "/shopee-category/:id",
          name: "Category",
          icon: "nc-icon nc-vector",
          component: ProductsCategory,
          activedPath: '/shopee/products',
          layout: "/admin",
          sidebar: false,
          actived: false
      },
    ]
  },
  // Report //
  {
    path: "/reports",
    name: 'Report',
    icon: 'nc-icon nc-notes',
    component: Apis,
    layout: "/admin",
    sidebar: true,
    actived: false,
    submenu: [
      {
        path: "/reports/commission",
        name: "Commissions",
        icon: "nc-icon nc-stre-right",
        component: ReportCommission,
        actived: false,
        sidebar: true,
        layout: "/admin",
      },
      {
        path: "/reports/post",
        name: "Posts",
        icon: "nc-icon nc-stre-right",
        component: ReportPost,
        actived: false,
        sidebar: true,
        layout: "/admin",
      },
    ]
  },
  // Setting Apis
  {
    path: "/apis",
    name: 'Setting',
    icon: 'nc-icon nc-settings-gear-64',
    component: Apis,
    layout: "/admin",
    sidebar: true,
    actived: false,
    submenu: [
      {
        path: "/apis/shopee",
        name: "Shopee",
        icon: "nc-icon nc-stre-right",
        component: Apishopeepage,
        actived: false,
        sidebar: true,
        layout: "/admin",
      },
      {
        path: "/apis/facebook",
        name: "Facebook",
        icon: "nc-icon nc-stre-right",
        component: Apifacebookpage,
        actived: false,
        sidebar: true,
        layout: "/admin",
      },
      {
        path: "/apis/sharing",
        name: "Filters",
        icon: "nc-icon nc-stre-right",
        component: Settingsharing,
        actived: false,
        sidebar: true,
        layout: "/admin",
      },

      // {
      //   path: "/apis/threads",
      //   name: "Threads",
      //   icon: "nc-icon nc-stre-right",
      //   component: Apithreads,
      //   actived: false,
      //   layout: "/admin",
      // },
      // {
      //   path: "/apis/x",
      //   name: "X (Twister)",
      //   icon: "nc-icon nc-stre-right",
      //   component: Apisxpage,
      //   actived: false,
      //   layout: "/admin",
      // },
    ]
  },
    // Logs Apis
    {
      path: "/logs",
      name: 'Logs',
      icon: 'nc-icon nc-bullet-list-67',
      component: Logs,
      layout: "/admin",
      sidebar: true,
      actived: false
    },
  // Manage Users
  {
    path: "/users",
    name: "Administrators",
    icon: "nc-icon nc-circle-09",
    component: Administrators,
    layout: "/admin",
    sidebar: true,
    actived: false
  },
  {
    path: "/users/create",
    name: "Edit Administrators",
    icon: "nc-icon nc-circle-09",
    component: Administratorsform,
    layout: "/admin",
    sidebar: false
  },  
  {
    path: "/users/edit/:id",
    name: "Edit Administrators",
    icon: "nc-icon nc-circle-09",
    component: Administratorsform,
    layout: "/admin",
    sidebar: false
  },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "nc-icon nc-notes",
  //   component: TableList,
  //   layout: "/admin",
  //   sidebar: true
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-paper-2",
  //   component: Typography,
  //   layout: "/admin",
  //   sidebar: true
  // },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
    sidebar: false
  },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin",
  //   sidebar: true
  // },
  {
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-lock-circle-open",
    component: Logout,
    layout: "/admin",
    sidebar: true,
    upgrade: true
  }
];

export default BackendRoutes;
