import Home from './assets/vue/pages/home.vue';

import FormDocument from './assets/vue/pages/invoices/form.vue';
import FormSaleNote from './assets/vue/pages/sale-notes/form.vue';
import FormOrderNote from './assets/vue/pages/order-notes/form.vue';
import FormPurchase from './assets/vue/pages/purchases/form.vue';
import FormQuotation from './assets/vue/pages/quotations/form.vue';
import FormDispatch from './assets/vue/pages/dispatches/form.vue';
import FormDispatchCarrier from './assets/vue/pages/dispatch-carriers/form.vue';

import IndexItems from './assets/vue/pages/items/index.vue';
import IndexCustomers from './assets/vue/pages/customers/index.vue';
import IndexCash from './assets/vue/pages/cash/index.vue';

import Validate from './assets/vue/pages/validate.vue';
import ReportSales from './assets/vue/pages/reports/sales.vue';
import Documents from './assets/vue/pages/documents.vue';

import Login from './assets/vue/pages/login.vue';
import PanelRightPage from './assets/vue/pages/panels/right.vue';
import Configuration from './assets/vue/pages/panels/configuration.vue';
import AdvancedConfiguration from './assets/vue/pages/panels/advanced_configuration.vue';

import ListItemsSale from './assets/vue/pages/pos/components/ListItemsSale.vue'
import SaleDetailPosPage from './assets/vue/pages/pos/pages/sale_detail_page.vue'
import SalePaymentPosPage from './assets/vue/pages/pos/pages/payment_page.vue'
import LandscapePosPage from './assets/vue/pages/pos/pages/landscape_pos_page.vue'


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
    path: '/report-sales/',
    component: ReportSales
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
  {
    path: '/form-quotation/',
    component: FormQuotation
  },
  {
    path: '/list-items-sale/',
    component: ListItemsSale
  },
  {
    path: '/sale-detail-pos/',
    component: SaleDetailPosPage
  },
  {
    path: '/sale-payment-pos/:document_type_description',
    component: SalePaymentPosPage
  },
  {
    path: '/landscape-pos/',
    component: LandscapePosPage
  },
  {
    path: '/form-dispatch/',
    component: FormDispatch
  },
  {
    path: '/form-dispatch-carrier/',
    component: FormDispatchCarrier
  }
];
