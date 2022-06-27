import Home from './assets/vue/pages/home.vue';

import FormDocument from './assets/vue/pages/invoices/form.vue';
import FormSaleNote from './assets/vue/pages/sale-notes/form.vue';
import FormOrderNote from './assets/vue/pages/order-notes/form.vue';
import FormPurchase from './assets/vue/pages/purchases/form.vue';

import IndexItems from './assets/vue/pages/items/index.vue';
import IndexCustomers from './assets/vue/pages/customers/index.vue';
import IndexCash from './assets/vue/pages/cash/index.vue';

import Validate from './assets/vue/pages/validate.vue';
import Report from './assets/vue/pages/report.vue';
import Documents from './assets/vue/pages/documents.vue';

import Login from './assets/vue/pages/login.vue';
import PanelRightPage from './assets/vue/pages/panels/right.vue';
import Configuration from './assets/vue/pages/panels/configuration.vue';
import AdvancedConfiguration from './assets/vue/pages/panels/advanced_configuration.vue';

// import PreviewPdf2 from './assets/vue/components/document/PreviewPdf2';



export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/panel-right/',
    component: PanelRightPage
  },
  {
    path: '/documents/',
    component: Documents
  },
  {
    path: '/form-document/:cod',
    component: FormDocument
  },
  {
    path: '/cpe/',
    component: Validate
  },
  {
    path: '/login/',
    component: Login
  },
  {
    path: '/report/',
    component: Report
  },
  {
    path: '/form-sale-note/',
    component: FormSaleNote
  },
  {
    path: '/form-order-note/',
    component: FormOrderNote
  },
  {
    path: '/configuration/',
    component: Configuration
  },
  {
    path: '/form-purchase/',
    component: FormPurchase
  },
  {
    path: '/items/',
    component: IndexItems
  },
  {
    path: '/advanced-configuration/',
    component: AdvancedConfiguration
  },
  {
    path: '/customers/',
    component: IndexCustomers
  },
  {
    path: '/cash/',
    component: IndexCash
  },
  // {
  //   path: '/pdf2/',
  //   component: PreviewPdf2
  // },
  
];
