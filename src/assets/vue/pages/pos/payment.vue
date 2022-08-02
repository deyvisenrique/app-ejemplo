<template>
    <f7-page class="" color="bluemagenta">

        <header-layout :title="geTitle" hrefBack="/sale-detail-pos/" :overwriteBackRoute="true"></header-layout>

        <f7-block>
            <form class="list no-hairlines-md" id="demo-form">
                <ul>
                    <li class="no-padding-horizontal margin-top">
                        <f7-block class="bg-white-shade block-strong inset no-margin">
                            <f7-row @click="popupCustomerOpened = true">
                                <f7-col width="15" class="align-self-center">
                                    <f7-icon icon="fas fa-user" size="24" color="deeppurple"></f7-icon>
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
                        
                        <template v-if="isInvoiceDocument">

                            <f7-col width="50" >
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
                            </f7-col>

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

                        <template>
                            <template v-if="isCashPayment">
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Metodo de pago</div>
                                            <div class="item-input-wrap input-dropdown-wrap">
                                                <select v-model="form_payment.payment_method_type_id">
                                                    <template v-for="(row, index) in cash_payment_method_types">
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
                                            <div class="item-title item-label">Referencia</div>
                                            <div class="item-input-wrap">
                                                <input v-model="form_payment.reference" type="text" />
                                                <span class="input-clear-button"></span>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Monto a pagar</div>
                                            <div class="item-input-wrap">
                                                <input required validate v-model="form_payment.payment" type="number" @input="inputPayment" min="0"/>
                                                <span class="input-clear-button"></span>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col :width="isInvoiceDocument ? 100 : 50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Destino</div>
                                            <div class="item-input-wrap input-dropdown-wrap">
                                                <select v-model="form_payment.payment_destination_id">
                                                    <template v-for="(row, index) in payment_destinations">
                                                        <option :value="row.id" :key="index">{{row.description}}</option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </f7-col>
                            </template>

                            <template v-if="isCreditPayment">
                                <f7-col width="50">
                                    <div class="item-content item-input no-padding-horizontal">
                                        <div class="item-inner no-padding-horizontal">
                                            <div class="item-title item-label">Metodo de pago</div>
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

                    <div class="no-padding-horizontal padding-top">
                        <f7-block class="bg-white-shade block-strong inset no-margin">
                            <f7-row>
                                <f7-col>
                                    <h4>Total</h4>
                                    <template v-if="payment_change > 0 && isCashPayment">
                                        <p>Vuelto</p>
                                    </template>
                                </f7-col>
                                <f7-col class="text-align-right">
                                    <h4>{{currency_type.symbol}} {{form.total}}</h4>
                                    <template v-if="payment_change > 0 && isCashPayment">
                                        <p>{{currency_type.symbol}} {{payment_change}}</p>
                                    </template>
                                </f7-col>
                            </f7-row>
                        </f7-block>
                    </div>
   
                </ul>
            </form>
        </f7-block>
 
        <f7-popup class="demo-popup" :opened="popupCustomerOpened" @popup:closed="popupCustomerOpened = false">
            <customer-form :codeType="form.document_type_id" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
        </f7-popup>

        <!-- <f7-fab position="left-bottom" class="margin-right" color="red" @click="clickDeleteItems">
            <f7-icon ios="f7:delete" aurora="f7:delete" md="material:delete"></f7-icon>
        </f7-fab> -->

        <f7-fab position="center-bottom" class="margin-right" color="bluemagenta" @click.prevent="clickSubmit">
            <f7-icon ios="f7:check" aurora="f7:check" md="material:check"></f7-icon>
        </f7-fab>

    </f7-page>
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
    import {store_cash} from "../cash/mixins/cash"

    export default {
        name: 'SalePaymentPos',
        components: {
            CustomerForm,
            HeaderLayout
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
                form_payment: {},
                form_fee: {},
                cash_payment_method_types: [],
                credit_payment_method_types: [],
                default_customer: null,
                configuration: {},
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
        async created() {
            await this.loadConfiguration()
            await this.loadForm()
            await this.getTables()
            await this.initData()
        },
        methods: {
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },

            //generar documento
            clickSubmit()
            {
                if(this.isInvoiceDocument)
                {
                    this.sendInvoice()
                }
                else
                {
                    this.sendSaleNote()
                }

                // alert("fin---"+JSON.stringify(this.configuration))

            },
            sendSaleNote()
            {
                const valid = this.validate()
                if (!valid) return

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/sale-note`, this.getFormSaleNote(), this.getHeaderConfig())
                    .then(response => {

                        const data = response.data

                        if (data.success) 
                        {
                            this.showDialogOptions(data)
                            this.storeCashDocument(data.data.id)
                        } 
                        else 
                        {
                            this.showAlert('Ocurrió un error al registrar la venta.')
                        }
                    })
                    .catch(err => {
                        this.showAlert(`Ocurrió un error al registrar la venta: ${err.message}`)
                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },
            getFormSaleNote()
            {   
                let new_form = this.form

                new_form.payments = this.getFormPaymentSaleNote()
                return new_form
            },
            getFormPaymentSaleNote(){

                if(!isNaN(this.form_payment.payment) && parseFloat(this.form_payment.payment) > 0)
                {
                    return [
                        {
                            date_of_payment: this.form.date_of_issue,
                            payment_destination_id: this.form_payment.payment_destination_id,
                            payment_method_type_id: this.form_payment.payment_method_type_id,
                            reference: this.form_payment.reference,
                            payment: this.form_payment.payment
                        }
                    ]
                }

                return []

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
            async sendDirectPrint(data)
            {
                let html_text = null 

                await this.$http.get(`${this.returnBaseUrl()}/document-print-pdf-text/document/${data.data.external_id}/ticket_50`, this.getHeaderConfig())
                    .then((response)=>{
                        html_text=response.data
                        // alert(html_text)
                    })
                    .catch((error)=>{
                        alert(error)
                        console.log(error)
                    })

                const context = this 
                BTPrinter.printTextSizeAlign(function (data) {
                    // alert("alig")
                    context.generalSuccessNotification('Impresión en proceso')
                    // alert(data)
                }, 
                function (err) {
                    
                    alert(`Error: ${err}`)

                }, html_text, '00', '1');

            },
            async toPrint(data)
            {
                if(this.configuration.direct_print && this.isInvoiceDocument)
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
            clickOptionsButtons(dialog, index, data){

                // Imprimir
                if(index === 0)
                {
                    this.toPrint(data)
                }
                // Continuar
                else if (index === 1)
                {
                    this.cleanDataStorage()
                    this.redirectRoute('/list-items-sale/')
                }
            },
            getOptionsButtons(){
                return [
                    {
                        text: 'Imprimir',
                        cssClass: 'text-center',
                        close: false
                    },
                    {
                        text: 'Continuar',
                        cssClass: 'text-center'
                    },
                ]
            },
            sendInvoice()
            {
                const valid = this.validate()
                if (!valid) return

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/${this.resource}`, this.getFormDocument(), this.getHeaderConfig())
                    .then(response => {

                        const data = response.data

                        if (data.success) 
                        {
                            this.showDialogOptions(data)
                            this.storeCashDocument(data.data.id)
                        } 
                        else 
                        {
                            this.showAlert('Ocurrió un error al registrar la venta.')
                        }
                    })
                    .catch(err => {
                        this.showAlert(`Ocurrió un error al registrar la venta: ${err.message}`)
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
                            // nombre_producto_pdf: x.name_product_pdf,
                        };
                    }),
                    pagos: this.getFormPaymentDocument(),
                    cuotas: this.getFormFee()
                };
            },
            getFormPaymentDocument()
            {
                if(this.isCashPayment && !isNaN(this.form_payment.payment) && parseFloat(this.form_payment.payment) > 0)
                {
                    return [
                        {
                            codigo_destino_pago: this.form_payment.payment_destination_id,
                            codigo_metodo_pago: this.form_payment.payment_method_type_id,
                            referencia: this.form_payment.reference,
                            pago_recibido: this.form_payment.payment_received,
                            monto: this.form_payment.payment
                        }
                    ]
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
            validateCashPayment(){

                if(this.isCashPayment)
                {
                    if(!this.form_payment.payment_destination_id)
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
            //generar documento

            async initData()
            {
                await this.filterSeries()
                await this.setDefaultCustomer()
                
                await this.setDefaultSeries()
                await this.initFormPayment()
                await this.initFormFee()

                await this.setPaymentMethodTypes()
                await this.setPaymentDestinations()


                // asignar monto a pagar
                this.calculatePaymentFeeAmount()
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
            setPaymentDestinations(){

                const payment_destination_cash = _.find(this.payment_destinations, {id: 'cash'})


                if(payment_destination_cash)
                {
                    this.form_payment.payment_destination_id = payment_destination_cash.id
                }
                else
                {
                    this.form_payment.payment_destination_id = this.payment_destinations.length > 0 ? this.payment_destinations[0].id : null
                }

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
            initFormPayment(){

                this.form_payment = {
                    payment_method_type_id: '01',
                    payment_destination_id: null,
                    reference: null,
                    payment: 0,
                    payment_received: true,
                }

            },
            initFormFee(){

                this.form_fee = {
                    payment_method_type_id: null,
                    amount: 0,
                    date: null,
                }
            },
            setDefaultCustomer(){

                if(!this.default_customer)
                {
                    this.showLoading()
                    this.findGeneralDefaultCustomer()
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

            },
            allowSetCustomer(customer){

                let allow = true

                if(this.form.codigo_tipo_documento == '01' && customer.identity_document_type_id != '6')
                {
                    allow = false
                }

                return allow
            },
            changePaymentCondition() {

                this.setDataPayment()
                this.setDataPaymentFee()
                this.calculatePaymentFeeAmount()

            },
            setDataPayment(){

                if (this.isCashPayment)
                {
                    this.initFormPayment()
                    this.form_payment.payment_method_type_id = (this.cash_payment_method_types.length > 0) ? this.cash_payment_method_types[0].id:null
                    this.setPaymentDestinations()
                }

            },
            changePaymentMethodTypeFee(){

                const payment_method_type = _.find(this.credit_payment_method_types, {id : this.form_fee.payment_method_type_id})

                if(payment_method_type)
                {
                    const number_days = payment_method_type.number_days ? payment_method_type.number_days : 1
                    this.form_fee.date = moment(this.form.fecha_de_emision).add(number_days, 'days').format('YYYY-MM-DD')
                }

            },
            calculatePaymentFeeAmount() {

                if(this.isCashPayment)
                {
                    this.form_payment.payment = this.form.total
                    this.inputPayment()
                }
                else
                {
                    this.form_fee.amount = this.form.total
                }
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
                this.payment_change = this.roundNumber(parseFloat(this.form_payment.payment) - parseFloat(this.form.total))
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
        }
    }
</script>
