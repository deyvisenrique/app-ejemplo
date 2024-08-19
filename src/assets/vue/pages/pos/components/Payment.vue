<template>
    <div>
        <template v-if="landscapeMode">

            <form class="list no-hairlines-md padding-bottom" id="demo-form">
                <ul>
                    <li class="no-padding-horizontal margin-top">
                        <f7-block class="bg-white-shade block-strong inset no-margin">
                            <f7-row @click="popupCustomerOpened = true">
                                <f7-col width="15" class="align-self-center">
                                    <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                                </f7-col>
                                <f7-col width="75" class="text-align-left">
                                    <small>CLIENTE</small><br>
                                    <small class="no-margin">{{this.form.datos_del_cliente_o_receptor ? this.form.datos_del_cliente_o_receptor.apellidos_y_nombres_o_razon_social : ''}}</small>
                                </f7-col>
                                <f7-col width="10" class="align-self-center">
                                    <div class="badge bg-color-white text-align-right color-blue">
                                        <f7-link style="color:#0f233c;" icon="fas fa-arrow-right"></f7-link>
                                    </div>
                                </f7-col>
                            </f7-row>
                        </f7-block>
                    </li>

                    <div class="padding-top margin-top">
                        <document-type
                            @changeDocumentType="clickChangeDocumentType"
                            >
                        </document-type>
                    </div>

                    <f7-row class="padding-top">
                        <f7-col width="50">
                            <div class="item-content item-input no-padding-horizontal">
                                <div class="item-inner no-padding-horizontal">
                                    <div class="item-title item-label">Serie</div>
                                    <div class="item-input-wrap input-dropdown-wrap">
                                        <select v-model="form.series_id" placeholder="Please choose...">
                                                <option v-for="(row, index) in series" :value="row.id" :key="index">{{row.number}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </f7-col>
                        <f7-col width="50">
                            <div class="item-content item-input no-padding-horizontal">
                                <div class="item-inner no-padding-horizontal">
                                    <div class="item-title item-label">Fecha Emisión</div>
                                    <div class="item-input-wrap">
                                        <input name="date" v-model="form.date_of_issue" type="date" />
                                    </div>
                                </div>
                            </div>
                        </f7-col>

                        <template v-if="isInvoiceDocument">

                            <!-- <f7-col width="50" >
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Orden de Compra</div>
                                        <div class="item-input-wrap">
                                            <input required validate v-model="form.numero_orden_de_compra" type="text" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>

                            <f7-col width="50">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Fecha Vencimiento</div>
                                        <div class="item-input-wrap">
                                            <input name="date" v-model="form.date_of_due" type="date" />
                                        </div>
                                    </div>
                                </div>
                            </f7-col> -->

                            <f7-col width="50">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Condición de pago</div>
                                        <div class="item-input-wrap input-dropdown-wrap">
                                            <select v-model="form.payment_condition_id" @change="changePaymentCondition">
                                                <option :value="row.id" v-for="(row, index) in payment_conditions" :key="index">{{ row.name }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>

                        </template>

                        <f7-col :width="isInvoiceDocument ? '50' : '100'">
                            <div class="item-content item-input no-padding-horizontal">
                                <div class="item-inner no-padding-horizontal">
                                    <div class="item-title item-label">Destino</div>
                                    <div class="item-input-wrap input-dropdown-wrap">
                                        <select v-model="payment_destination_id" @change="changePaymentDestination">
                                            <template v-for="(row, index) in payment_destinations">
                                                <option :value="row.id" :key="index">{{row.description}}</option>
                                            </template>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </f7-col>

                        <template>
                            <template v-if="isCashPayment">
                                <table>
                                    <tbody>
                                        <tr v-for="(row, index) in form.payments" :key="index">
                                            <td width="49%">

                                                <div class="item-content item-input no-padding-horizontal">
                                                    <div class="item-inner no-padding-horizontal">
                                                        <div class="item-title item-label" v-if="index === 0">Método de pago</div>
                                                        <div class="item-input-wrap input-dropdown-wrap">
                                                            <select v-model="row.payment_method_type_id">
                                                                <template v-for="(row, index) in cash_payment_method_types">
                                                                    <option :value="row.id" :key="index">{{row.description}}</option>
                                                                </template>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>

                                                <div class="item-content item-input no-padding-horizontal" style="margin-left:10px;">
                                                    <div class="item-inner no-padding-horizontal">
                                                        <div class="item-title item-label" v-if="index === 0">Monto a pagar</div>
                                                        <div class="item-input-wrap">
                                                            <input required validate v-model="row.payment" type="number" @input="inputPayment" min="0"/>
                                                            <!-- <span class="input-clear-button"></span> -->
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="no-padding">
                                                <!-- <template v-if="index !== 0">
                                                    <a @click="clickAddDeletePayment(index)">
                                                        <f7-icon ios="f7:delete" color="red" aurora="f7:delete" md="material:delete" ></f7-icon>
                                                    </a>
                                                </template> -->
                                                <f7-button @click="clickAddDeletePayment(index)" :disabled="index == 0" small class="no-padding-horizontal">
                                                    <f7-icon ios="f7:delete" :color="index == 0? 'gray' : 'red'" aurora="f7:delete" md="material:delete" ></f7-icon>
                                                </f7-button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">
                                                <f7-button small @click="clickAddPayment" :color="theme.name_color_theme" icon-md="material:add_circle">
                                                    Nuevo Pago
                                                </f7-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </template>

                            <template v-if="isCreditPayment">
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Método de pago</div>
                                            <div class="item-input-wrap input-dropdown-wrap">
                                                <select v-model="form_fee.payment_method_type_id" @change="changePaymentMethodTypeFee">
                                                    <template v-for="(row, index) in credit_payment_method_types">
                                                        <option :value="row.id" :key="index">{{row.description}}</option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Fecha pago</div>
                                            <div class="item-input-wrap">
                                                <input name="date" v-model="form_fee.date" type="date" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Monto de la cuota</div>
                                            <div class="item-input-wrap">
                                                <input required validate v-model="form_fee.amount" type="number" min="0"/>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                            </template>
                        </template>
                    </f7-row>

                    <document-totals
                        :currency-type-symbol="currency_type.symbol"
                        :show-all-totals="true"
                        :payment-change="payment_change"
                        :is-cash-payment="isCashPayment"
                        :form="form">
                    </document-totals>

                </ul>
            </form>

        </template>
        <template v-else>

            <header-layout :title="geTitle" hrefBack="/sale-detail-pos/" :overwriteBackRoute="true"></header-layout>

            <f7-block>
                <form class="list no-hairlines-md" id="demo-form">
                    <ul>

                        <f7-row class="">
                            <f7-col width="50">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Serie</div>
                                        <div class="item-input-wrap input-dropdown-wrap">
                                            <select v-model="form.series_id" placeholder="Please choose...">
                                                <template v-for="(row, index) in series">
                                                    <option :value="row.id" :key="index">{{row.number}}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>
                            <f7-col width="50">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Fecha Emisión</div>
                                        <div class="item-input-wrap">
                                            <input name="date" v-model="form.date_of_issue" type="date" />
                                        </div>
                                    </div>
                                </div>
                            </f7-col>
                        </f7-row>

                        <li class="no-padding-horizontal margin-top">
                            <f7-block class="bg-white-shade block-strong inset no-margin">
                                <f7-row @click="popupCustomerOpened = true">
                                    <f7-col width="15" class="align-self-center">
                                        <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                                    </f7-col>
                                    <f7-col width="75" class="text-align-left">
                                        <small>CLIENTE</small><br>
                                        <small class="no-margin">{{this.form.datos_del_cliente_o_receptor ? this.form.datos_del_cliente_o_receptor.apellidos_y_nombres_o_razon_social : ''}}</small>
                                    </f7-col>
                                    <f7-col width="10" class="align-self-center">
                                        <div class="badge bg-color-white text-align-right color-blue">
                                            <f7-link style="color:#0f233c;" icon="fas fa-arrow-right"></f7-link>
                                        </div>
                                    </f7-col>
                                </f7-row>
                            </f7-block>
                        </li>

                        <f7-row class="padding-top">

                            <template v-if="isInvoiceDocument">

                                <!-- <f7-col width="50" >
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Orden de Compra</div>
                                            <div class="item-input-wrap">
                                                <input required validate v-model="form.numero_orden_de_compra" type="text" />
                                                <span class="input-clear-button"></span>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>

                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Fecha Vencimiento</div>
                                            <div class="item-input-wrap">
                                                <input name="date" v-model="form.date_of_due" type="date" />
                                            </div>
                                        </div>
                                    </div>
                                </f7-col> -->

                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Condición de pago</div>
                                            <div class="item-input-wrap input-dropdown-wrap">
                                                <select v-model="form.payment_condition_id" @change="changePaymentCondition">
                                                    <option :value="row.id" v-for="(row, index) in payment_conditions" :key="index">{{ row.name }}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>

                            </template>

                            <f7-col :width="isInvoiceDocument ? '50' : '100'">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">
                                        <div class="item-title item-label">Destino</div>
                                        <div class="item-input-wrap input-dropdown-wrap">
                                            <select v-model="payment_destination_id" @change="changePaymentDestination">
                                                <template v-for="(row, index) in payment_destinations">
                                                    <option :value="row.id" :key="index">{{row.description}}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>

                            <template>
                                <template v-if="isCashPayment">
                                    <table style="width:100% !important">
                                        <tbody>
                                            <tr v-for="(row, index) in form.payments" :key="index">

                                                <td  style="width:52% !important">
                                                    <div class="item-content item-input no-padding-horizontal">
                                                        <div class="item-inner no-padding-horizontal">
                                                            <div class="item-title item-label" v-if="index === 0">Método de pago</div>
                                                            <div class="item-input-wrap input-dropdown-wrap">
                                                                <select v-model="row.payment_method_type_id">
                                                                    <template v-for="(row, index) in cash_payment_method_types">
                                                                        <option :value="row.id" :key="index">{{row.description}}</option>
                                                                    </template>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td  style="width:50% !important">

                                                    <div class="item-content item-input no-padding-horizontal" style="margin-left:15px;">
                                                        <div class="item-inner no-padding-horizontal">
                                                            <div class="item-title item-label" v-if="index === 0"> Monto a pagar</div>
                                                            <div class="item-input-wrap" >
                                                                <input required validate v-model="row.payment" type="number" @input="inputPayment" min="0"/>
                                                                <!-- <span class="input-clear-button"></span> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="no-padding-horizontal">

                                                        <f7-button @click="clickAddDeletePayment(index)" :disabled="index == 0" small class="no-padding-horizontal">
                                                            <f7-icon ios="f7:delete" :color="index == 0? 'gray' : 'red'" aurora="f7:delete" md="material:delete" ></f7-icon>
                                                        </f7-button>

                                                    <!-- <template v-if="index === 0">
                                                        <a @click="clickAddPayment">
                                                            <f7-icon class="" ios="f7:add_circle" aurora="f7:add_circle" md="material:add_circle"></f7-icon>
                                                        </a>
                                                    </template>
                                                    <template v-else>
                                                        <a @click="clickAddDeletePayment(index)">
                                                            <f7-icon ios="f7:delete" color="red" aurora="f7:delete" md="material:delete" ></f7-icon>
                                                        </a>
                                                    </template> -->
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <f7-col class="text-align-center">
                                        <f7-button small @click="clickAddPayment" :color="theme.name_color_theme" icon-md="material:add_circle">
                                            Nuevo Pago
                                        </f7-button>
                                    </f7-col>

                                </template>

                                <template v-if="isCreditPayment">
                                    <f7-col width="50">
                                        <div class="item-content item-input no-padding-horizontal">
                                            <div class="item-inner no-padding-horizontal">
                                                <div class="item-title item-label">Método de pago</div>
                                                <div class="item-input-wrap input-dropdown-wrap">
                                                    <select v-model="form_fee.payment_method_type_id" @change="changePaymentMethodTypeFee">
                                                        <template v-for="(row, index) in credit_payment_method_types">
                                                            <option :value="row.id" :key="index">{{row.description}}</option>
                                                        </template>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </f7-col>
                                    <f7-col width="50">
                                        <div class="item-content item-input no-padding-horizontal">
                                            <div class="item-inner no-padding-horizontal">
                                                <div class="item-title item-label">Fecha pago</div>
                                                <div class="item-input-wrap">
                                                    <input name="date" v-model="form_fee.date" type="date" disabled/>
                                                </div>
                                            </div>
                                        </div>
                                    </f7-col>
                                    <f7-col width="50">
                                        <div class="item-content item-input no-padding-horizontal">
                                            <div class="item-inner no-padding-horizontal">
                                                <div class="item-title item-label">Monto de la cuota</div>
                                                <div class="item-input-wrap">
                                                    <input required validate v-model="form_fee.amount" type="number" min="0"/>
                                                </div>
                                            </div>
                                        </div>
                                    </f7-col>
                                </template>
                            </template>
                        </f7-row>

                        <template v-if="isCashPayment">
                            <document-totals
                                :currency-type-symbol="currency_type.symbol"
                                :show-all-totals="true"
                                :payment-change="payment_change"
                                :is-cash-payment="isCashPayment"
                                :form="form">
                            </document-totals>
                        </template>

                    </ul>
                </form>

            </f7-block>

        </template>

        <div style="position: relative">
            <f7-fab style="position: fixed" position="right-bottom" class="margin-right no-margin-bottom" :color="theme.name_color_theme" @click.prevent="clickSubmit" v-if="form.total">
                <f7-icon ios="f7:check" aurora="f7:check" md="material:check"></f7-icon>
            </f7-fab>
        </div>

        <pdf-direct-print ref="pdf_direct_print" :document="form" :response="response_data" :payments="payment_conditions"></pdf-direct-print>

        <send-document-whatsapp
            :showDialog.sync="showDialogSendDocumentWhatsapp"
            :params="params_send_document_whatsapp"
            @closeSendDocumentWhatsapp="closeSendDocumentWhatsapp"
            :response="response_data_options"
            >
        </send-document-whatsapp>

        <f7-popup class="demo-popup" :opened="popupCustomerOpened" @popup:closed="popupCustomerOpened = false">
            <customer-form :codeType="form.document_type_id" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
        </f7-popup>
    </div>

</template>

<script>

    import moment from 'moment'
    import _ from 'lodash'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations, print_pdf_document} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import {findGeneralDefaultSerie} from "js_/helpers/functions"
    import CustomerForm from "components/document/CustomerForm"
    import {download_file} from "mixins_/download_file"
    import {store_cash} from "../../cash/mixins/cash"
    // import * as htmlToImage from 'html-to-image'
    import PdfDirectPrint from 'components/document/PdfDirectPrint'

    import DocumentTotals from './partials/DocumentTotals.vue'
    import DocumentType from './partials/DocumentType.vue'
    import SendDocumentWhatsapp from 'components/document/SendDocumentWhatsapp.vue'

    export default {
        props: {
            landscapeMode: {
                type: Boolean,
                required: false,
                default: false
            },
        },
        name: 'SalePaymentPos',
        components: {
            CustomerForm,
            HeaderLayout,
            PdfDirectPrint,
            DocumentTotals,
            DocumentType,
            SendDocumentWhatsapp
        },
        mixins: [
            auth,
            general_functions,
            operations,
            download_file,
            store_cash,
            print_pdf_document
        ],
        data: function () {
            return {
                form:{
                    total: 0
                },
                currency_type: {
                    symbol: 'S/'
                },
                resource: 'documents',
                customers: [],
                series: [],
                payment_destinations: [],
                payment_conditions: [],
                popupCustomerOpened: false,

                all_series: [],
                all_payment_method_types: [],
                payment_change: 0,
                form_fee: {},
                cash_payment_method_types: [],
                credit_payment_method_types: [],
                default_customer: null,
                configuration: {},
                payment_destination_id: null,
                theme: {},

                response_data: {},
                showDialogSendDocumentWhatsapp: false,
                params_send_document_whatsapp: {},
                response_data_options: {},
                form_email: {},
                hasSendMail: false,
            }
        },
        computed: {
            geTitle(){
                return `${this.$f7route.params.document_type_description}`
            },
            isCreditPayment: function(){
                return (this.form.payment_condition_id === '02')
            },
            isCashPayment: function(){
                return (this.form.payment_condition_id === '01')
            },
            isInvoiceDocument()
            {
                return (['01', '03'].includes(this.form.document_type_id))
            }
        },
        async created()
        {
            await this.loadConfiguration()
            await this.getInitialSettings()
            await this.loadForm()
            await this.getTables()
            await this.initData()
            await this.inputEventsPayment()
            await this.initParamsSendDocumentWhatsapp()
        },
        mounted()
        {
            // console.log("applyDirectSendDocumentsWhatsapp", this.applyDirectSendDocumentsWhatsapp)
        },
        methods: {
            initParamsSendDocumentWhatsapp()
            {
                this.params_send_document_whatsapp = {
                    id: null,
                    format: null,
                    document_type_id: null,
                    phone_number: null,
                }
            },
            clickChangeDocumentType(document_type_id)
            {
                this.form.document_type_id = document_type_id

                if(this.landscapeMode)
                {
                    this.setDataFromChangeDocumentType(document_type_id)
                }
            },
            inputEventsPayment()
            {
                // para cambio en datos del documento - tipo documento, totales, items... Obs: no usar para consultas a api
                this.$eventHub.$on('eventUpdateDataFormSale', (form_sale) => {
                    this.setUpdateDataFormSale(form_sale)
                })
            },
            setUpdateDataFormSale(form_sale)
            {
                this.form.items = form_sale.items
                this.form.subtotal = form_sale.subtotal
                this.form.total = form_sale.total
                this.form.total_discount = form_sale.total_discount
                this.form.total_exonerated = form_sale.total_exonerated
                this.form.total_exportation = form_sale.total_exportation
                this.form.total_free = form_sale.total_free
                this.form.total_igv = form_sale.total_igv
                this.form.total_plastic_bag_taxes = form_sale.total_plastic_bag_taxes
                this.form.total_taxed = form_sale.total_taxed
                this.form.total_taxes = form_sale.total_taxes
                this.form.total_unaffected = form_sale.total_unaffected
                this.form.total_value = form_sale.total_value

                // console.log("upd form_sale", form_sale)

                this.calculateAmountPayments()
                this.calculatePaymentFee()
            },
            async setDataFromChangeDocumentType(document_type_id)
            {
                this.form.document_type_id = document_type_id
                this.default_customer = null

                await this.filterSeries()
                await this.setDefaultCustomer()
                await this.setDefaultSeries()
            },
            loadConfiguration()
            {
                this.configuration = this.getInitialConfiguration()
            },

            //generar documento
            clickSubmit()
            {
                if(!this.form.document_type_id) return this.showAlert('No ha seleccionado un tipo de documento, no puede continuar.')

                if(this.isInvoiceDocument)
                {
                    this.sendInvoice()
                }
                else
                {
                    this.sendSaleNote()
                }

            },
            sendSaleNote()
            {
                const valid = this.validate()
                if (!valid) return

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/sale-note`, this.form, this.getHeaderConfig())
                    .then(response => {

                        const data = response.data

                        if (data.success)
                        {
                            this.response_data = data.data
                            this.response_data_options = data
                            this.showDialogOptions(data)
                            this.storeCashDocument(data.data.id)
                        }
                        else
                        {
                            this.showAlert('Ocurrió un error al registrar la venta.')
                        }
                    })
                    .catch(error => {
                        this.showAlert(`Ocurrió un error al registrar la venta: ${error.response.data.message}`)
                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },
            showDialogOptions(data)
            {
                const context = this

                context.showDialogConfirm({
                    title: 'Documento registrado',
                    text: data.data.number,
                    buttons: context.getOptionsButtons(),
                    onClick: function(dialog, index){
                        context.clickOptionsButtons(dialog, index, data)
                    },
                    verticalButtons: true,
                })

            },
            closeSendDocumentWhatsapp()
            {
                this.showDialogOptions(this.response_data_options)
            },
            sendDirectPrint(data)
            {
                const document_type = this.isInvoiceDocument ? 'document' : 'saleNote'
                const external_id = data.data.external_id
                const format = this.configuration.print_format_pdf
                const extend_pdf_height = 150

                this.$refs.pdf_direct_print.sendPrintDocument(document_type, external_id, format, extend_pdf_height)
            },
            async toPrint(data)
            {
                if(this.configuration.direct_print)
                {
                    this.sendDirectPrint(data)
                }
                else
                {
                    if(this.isInvoiceDocument)
                    {
                        this.printPdfDocument(data.data.external_id)
                    }
                    else
                    {
                        await this.showLoading()
                        await this.downloaFileToPrint(data.data.print_ticket, data.data.filename) //definido en mixin download_file
                        await this.hideLoading()
                    }
                }
            },
            actionsForButtonContinue()
            {
                this.cleanDataStorage()

                if(this.landscapeMode)
                {
                    //para inicializar los componentes
                    this.reloadCurrentPage()
                }
                else
                {
                    this.redirectRoute('/list-items-sale/')
                }
            },
            clickOptionsButtons(dialog, index, data){
                // Imprimir
                if(index === 0)
                {
                    this.toPrint(data)
                }
                // Continuar
                else if (index === 1)
                {
                    this.actionsForButtonContinue()
                }
                else if (index === 2)
                {
                    this.sendDocumentMessageWhatsapp(data.data.id, this.form.document_type_id, data.links ? data.links.pdf : null)
                }
                else if (index === 3)
                {
                    this.sendToEmail(data.data.id, this.form.document_type_id)
                }
            },
            sendDocumentMessageWhatsapp(id, document_type_id, url_pdf)
            {
                this.params_send_document_whatsapp.id = id
                this.params_send_document_whatsapp.url_pdf = url_pdf
                this.params_send_document_whatsapp.document_type_id = document_type_id
                this.params_send_document_whatsapp.format = this.configuration.print_format_pdf

                this.showDialogSendDocumentWhatsapp = true
            },
            getOptionsButtons()
            {
                let options = [
                    {
                        text: 'Imprimir',
                        cssClass: 'text-align-center',
                        close: false
                    },
                    {
                        text: 'Continuar',
                        cssClass: 'text-align-center'
                    },
                    {
                        text: 'Whatsapp',
                        cssClass: 'text-align-center'
                    },
                    {
                        text: 'Correo',
                        cssClass: 'text-align-center'
                    },
                ]

                // if(this.applyDirectSendDocumentsWhatsapp)
                // {
                //     options.push({
                //         text: 'Enviar comprobante',
                //         cssClass: 'text-align-center'
                //     })
                // }

                return options
            },
            initFormEmail() {
                this.form_email = {
                    email: null,
                    id: null
                };
            },
            sendToEmail(id, type, default_email = null) {
                this.initFormEmail();
                this.hasSendMail = true
                this.form_email.id = id;
                let response = this.response_data_options
                const self = this;
                let document_type = ''
                switch (type) {
                    case '80':
                        document_type = 'sale-note'
                        break;
                    default:
                        document_type = 'document'
                        break;
                }
                self.$f7.dialog.prompt(
                    "Ingresa el Email",
                    "", //titulo
                    function (value)
                    {
                        self.form_email.email = value;
                        self.sendEmail(document_type)
                    },
                    ()=>{},
                    default_email
                ).on('dialogClose', function () {
                    if(self.hasSendMail) {
                        self.showDialogOptions(response)
                    }
                })
            },
            validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            sendEmail(type) {
                if (!this.form_email.email) {
                    alert("Ingrese Email.");
                    return false;
                }
                if (!this.validateEmail(this.form_email.email)) {
                    alert("Ingrese un Email valido.");
                    return false;
                }
                this.hasSendMail = false;

                this.$f7.preloader.show();
                this.$http
                    .post(
                        `${this.returnBaseUrl()}/${type}/email`,
                        this.form_email,
                        this.getHeaderConfig()
                    )
                    .then(response => {
                        if (response.data.success) {
                            this.showAlert(`${response.data.message}`)
                            this.showDialogOptions(this.response_data_options)
                            this.initFormEmail();
                        }
                    })
                    .catch(err => {
                        console.error(err)
                        alert("Sucedio un error.");
                    })
                    .finally(() => {
                        this.$f7.preloader.hide();
                    });
            },
            sendInvoice()
            {
                // console.log(this.getFormDocument())
                // return

                const valid = this.validate()
                if (!valid) return

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/${this.resource}`, this.getFormDocument(), this.getHeaderConfig())
                    .then(response => {

                        const data = response.data

                        if (data.success)
                        {
                            this.response_data = data.data
                            this.response_data_options = data
                            this.showDialogOptions(data)
                            this.storeCashDocument(data.data.id)
                        }
                        else
                        {
                            this.showAlert('Ocurrió un error al registrar la venta.')
                        }
                    })
                    .catch(error => {
                        this.showAlert(`Ocurrió un error al registrar la venta: ${error.response.data.message}`)
                    })
                    .then(() => {
                        this.hideLoading()
                    })
            },
            cleanDataStorage()
            {
                this.removeStorage('form_sale_detail')
                this.removeStorage('list_items_sale')
            },
            getFormDocument() {

                const context = this
                const series = _.find(this.series, {id : this.form.series_id})

                return {
                    serie_documento: series.number,
                    numero_documento: '#',
                    fecha_de_emision: this.form.date_of_issue,
                    hora_de_emision: this.form.time_of_issue,
                    codigo_tipo_operacion: '0101',
                    codigo_tipo_documento: this.form.document_type_id,
                    codigo_tipo_moneda: this.form.currency_type_id,
                    fecha_de_vencimiento: this.form.date_of_due,
                    datos_del_cliente_o_receptor: this.form.datos_del_cliente_o_receptor,
                    codigo_condicion_de_pago: this.form.payment_condition_id,
                    totales: {
                        total_exportacion: this.form.total_exportation,
                        total_operaciones_gravadas: this.form.total_taxed,
                        total_operaciones_inafectas: this.form.total_unaffected,
                        total_operaciones_exoneradas: this.form.total_exonerated,
                        total_operaciones_gratuitas: this.form.total_free,
                        total_impuestos_bolsa_plastica: this.form.total_plastic_bag_taxes,
                        total_igv: this.form.total_igv,
                        total_impuestos: this.form.total_taxes,
                        total_valor: this.form.total_value,
                        total_descuentos: this.form.total_discount ? this.form.total_discount : 0,
                        total_venta: this.form.total
                    },
                    items: this.form.items.map(x => {
                        return {
                            codigo_interno: x.item.internal_id,
                            descripcion: x.item.description,
                            codigo_producto_sunat: x.item.item_code,
                            unidad_de_medida: x.item.unit_type_id,
                            cantidad: x.quantity,
                            valor_unitario: x.unit_value,
                            codigo_tipo_precio: '01',
                            precio_unitario: x.unit_price,
                            codigo_tipo_afectacion_igv: x.affectation_igv_type_id,
                            total_base_igv: x.total_base_igv,
                            porcentaje_igv: x.percentage_igv,
                            total_igv: x.total_igv,
                            total_impuestos_bolsa_plastica: x.total_plastic_bag_taxes,
                            total_impuestos: x.total_taxes,
                            total_valor_item: x.total_value,
                            total_item: x.total,
                            total_descuentos: x.total_discount ? x.total_discount : 0,
                            descuentos: context.getDiscountsDocument(x),
                            nombre_producto_pdf: x.name_product_pdf,
                        };
                    }),
                    pagos: this.getFormPaymentDocument(),
                    cuotas: this.getFormFee()
                };
            },
            getDiscountsDocument(row)
            {
                if(row.discounts)
                {
                    if(row.discounts.length > 0)
                    {
                        return row.discounts.map((discount) => {
                            return {
                                codigo: discount.discount_type_id,
                                descripcion: discount.description,
                                factor: discount.factor,
                                monto: discount.amount,
                                base: discount.base,
                            }
                        })
                    }
                }

                return []
            },
            validate()
            {
                const self = this

                if (!this.form.series_id) {
                    self.$f7.dialog.alert(`Debe seleccionar una serie.`, "Mensaje")
                    return false
                }

                if (this.form.items.length == 0) {
                    self.$f7.dialog.alert(`Debe agregar productos.`, "Mensaje")
                    return false
                }

                if (!this.form.customer_id) {
                    self.$f7.dialog.alert(
                        `Debe seleccionar un cliente.`,
                        "Mensaje"
                    )

                    return false
                }

                const validate_credit_payment = this.validateCreditPayment()
                if(!validate_credit_payment) return validate_credit_payment


                const validate_cash_payment = this.validateCashPayment()
                if(!validate_cash_payment) return validate_cash_payment

                return true
            },
            //generar documento

            async initData()
            {
                await this.filterSeries()
                await this.setDefaultCustomer()

                await this.setDefaultSeries()
                await this.initPayments()
                await this.initFormFee()

                await this.setPaymentMethodTypes()
                await this.setPaymentDestinations()

                await this.clickAddPayment()


                // asignar monto a pagar
                this.calculatePaymentFee()
            },
            setDefaultSeries() {

                const default_series = findGeneralDefaultSerie(this.series, this.form.document_type_id)

                if(default_series)
                {
                    this.form.series_id = default_series.id
                }
                else
                {
                    this.form.series_id = (this.series.length > 0) ? this.series[0].id : null
                }

            },
            setDefaultCustomer(){

                if(!this.default_customer)
                {
                    this.showLoading()
                    this.findGeneralDefaultCustomer(this.form.document_type_id)
                        .then((response)=>{

                            if(response.data.success)
                            {
                                if(this.allowSetCustomer(response.data.data))
                                {
                                    this.default_customer = response.data.data
                                    this.addCustomer(this.default_customer)
                                }
                            }

                            this.hideLoading()

                        })
                        .catch((error)=>{
                            console.log(error)
                        })
                }
                else
                {
                    this.addCustomer(this.default_customer)
                }

            },
            addCustomer(row) {

                this.popupCustomerOpened = false
                this.form.customer_id = row.id

                this.form.datos_del_cliente_o_receptor = {
                    codigo_tipo_documento_identidad: row.identity_document_type_id,
                    numero_documento: row.number,
                    apellidos_y_nombres_o_razon_social: row.name,
                    codigo_pais: row.country_id,
                    ubigeo: row.district_id ? row.district_id : '',
                    direccion: row.address,
                    correo_electronico: row.email,
                    telefono: row.telephone
                }

                this.params_send_document_whatsapp.phone_number = row.telephone

            },
            allowSetCustomer(customer){

                let allow = true

                if(this.form.codigo_tipo_documento == '01' && customer.identity_document_type_id != '6')
                {
                    allow = false
                }

                return allow
            },
            loadForm()
            {
                this.form = this.getStorage('form_sale_detail', true)
            },
            clickDeleteItems(){

                this.removeStorage('list_items_sale')
                this.redirectRoute('/list-items-sale/')

            },
            async getTables() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/tables-sale-payment`, this.getHeaderConfig())
                            .then(response => {
                                this.customers = response.data.customers
                                this.all_series = response.data.series
                                this.all_payment_method_types = response.data.payment_method_types
                                this.payment_destinations = response.data.payment_destinations
                                this.payment_conditions = response.data.payment_conditions
                            })
                            .then(() => {
                                this.hideLoading()
                            })

            },
            filterSeries()
            {
                this.series = _.filter(this.all_series, {
                    document_type_id: this.form.document_type_id
                })
            },
            // pagos

            initPayments()
            {
                this.form.payments = []
            },
            initFormFee(){

                this.form_fee = {
                    payment_method_type_id: null,
                    amount: 0,
                    date: null,
                }
            },
            validateCashPayment(){

                if(this.isCashPayment)
                {
                    if(!this.payment_destination_id)
                    {
                        this.showAlert('El destino de pago es obligatorio, aperture caja o cuentas bancarias')
                        return false
                    }
                }

                return true
            },
            validateCreditPayment(){

                if(this.isCreditPayment)
                {
                    if(!this.form_fee.amount || this.form_fee.amount <= 0)
                    {
                        this.showAlert('El monto es obligatorio y debe ser mayor a 0')
                        return false
                    }

                    if(parseFloat(this.form_fee.amount) > parseFloat(this.form.total))
                    {
                        this.showAlert('El monto neto pendiente de pago debe ser menor o igual al importe total del comprobante')
                        return false
                    }
                }

                return true
            },
            setPaymentMethodTypes(){
                this.cash_payment_method_types = this.filterPaymentMethodTypes(false)
                this.credit_payment_method_types = this.filterPaymentMethodTypes(true)
            },
            //formas de pago
            filterPaymentMethodTypes(is_credit){

                return this.all_payment_method_types.filter(row => {
                    return row.is_credit == is_credit
                })

            },
            setPaymentDestinations()
            {
                const payment_destination_cash = _.find(this.payment_destinations, {id: 'cash'})

                if(payment_destination_cash)
                {
                    this.payment_destination_id = payment_destination_cash.id
                }
                else
                {
                    this.payment_destination_id = this.payment_destinations.length > 0 ? this.payment_destinations[0].id : null
                }

            },
            changePaymentCondition() {

                this.setDataPayment()
                this.setDataPaymentFee()
                this.calculatePaymentFee()

            },
            setDataPayment(){

                this.initPayments()

                if (this.isCashPayment)
                {
                    this.clickAddPayment()
                }

            },
            getTotalPayments()
            {
                return  _.sumBy(this.form.payments, (row)=>{
                    return parseFloat(row.payment)
                })
            },
            getFormPaymentDocument()
            {
                const total_payments = this.getTotalPayments()

                if(this.isCashPayment && !isNaN(total_payments) && total_payments > 0)
                {
                    return this.form.payments.map((row) => {
                        return {
                            codigo_destino_pago: row.payment_destination_id,
                            codigo_metodo_pago: row.payment_method_type_id,
                            referencia: row.reference,
                            pago_recibido: true,
                            monto: row.payment
                        }
                    })
                }

                return []
            },
            getFormFee()
            {
                if(this.isCreditPayment)
                {
                    return [
                        {
                            fecha: this.form_fee.date,
                            codigo_tipo_moneda: this.form.currency_type_id,
                            monto: this.form_fee.amount,
                            codigo_metodo_de_pago: this.form_fee.payment_method_type_id,
                        }
                    ]
                }

                return []
            },
            changePaymentDestination()
            {
                _.forEach(this.form.payments, row => {
                    row.payment_destination_id = this.payment_destination_id
                })
            },
            clickAddPayment()
            {
                const payment_method_type_id = (this.cash_payment_method_types.length > 0) ? this.cash_payment_method_types[0].id:null

                this.form.payments.push({
                    date_of_payment: moment().format('YYYY-MM-DD'),
                    payment_method_type_id: payment_method_type_id,
                    reference: null,
                    payment_destination_id: this.payment_destination_id,
                    payment: 0,
                })

                this.calculateAmountPayments()

            },
            calculateAmountPayments()
            {
                const amount = _.round(this.form.total / this.form.payments.length, 2)

                _.forEach(this.form.payments, row => {
                    row.payment = amount
                })

                this.inputPayment()
            },
            clickAddDeletePayment(index)
            {
                this.form.payments.splice(index, 1)
                this.calculateAmountPayments()
            },
            changePaymentMethodTypeFee(){

                const payment_method_type = _.find(this.credit_payment_method_types, {id : this.form_fee.payment_method_type_id})

                if(payment_method_type)
                {
                    const number_days = payment_method_type.number_days ? payment_method_type.number_days : 1
                    this.form_fee.date = moment(this.form.fecha_de_emision).add(number_days, 'days').format('YYYY-MM-DD')
                }

            },
            calculatePaymentFee()
            {
                this.form_fee.amount = this.form.total
            },
            setDataPaymentFee(){

                if (this.isCreditPayment)
                {
                    this.initFormFee()
                    this.form_fee.payment_method_type_id = (this.credit_payment_method_types.length > 0) ? this.credit_payment_method_types[0].id:null
                    this.changePaymentMethodTypeFee()
                }

            },
            inputPayment(){
                this.payment_change = this.roundNumber(this.getTotalPayments() - parseFloat(this.form.total))
            },
            // pagos
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
