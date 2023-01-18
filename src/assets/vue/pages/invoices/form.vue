<template>
    <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">
        <header-layout :title="title"></header-layout>

        <f7-card class="padding margin-top" no-shadow>
            <form class="list no-hairlines-md" id="demo-form">
                <ul>
                    <f7-row>
                        <f7-col width="50">
                            <div class="item-content item-input no-padding-horizontal">
                                <div class="item-inner no-padding-horizontal">
                                    <div class="item-title item-label">Serie</div>
                                    <div class="item-input-wrap input-dropdown-wrap">
                                        <select v-model="form.serie_documento" placeholder="Please choose...">
                                            <template v-for="(row, index) in series">
                                                <option :value="row.number" :key="index">{{row.number}}</option>
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
                                        <input name="date" v-model="form.fecha_de_emision" type="date" />
                                    </div>
                                </div>
                            </div>
                        </f7-col>
                        <f7-col width="50">
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
                                        <input name="date" v-model="form.fecha_de_vencimiento" type="date" />
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
                                            <option value="01" selected>Contado</option>
                                            <option value="02">Crédito</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </f7-col>
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
                                <f7-col width="100">
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

                    <li class="item-content item-input no-padding-horizontal">
                        <br />
                        <div class="data-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="numeric-cell" width="5%"></th>
                                        <th class="label-cell">#</th>
                                        <th class="medium-cell">Descripción</th>
                                        <th class="medium-only">Cantidad</th>

                                        <th class="medium-only text-align-right">Precio</th>
                                        <th class="medium-only text-align-right">Subtotal</th>
                                        <th class="medium-only text-align-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in form.items" :key="index">
                                        <td class="no-padding numeric-cell">
                                            <f7-button @click.native="deleteItem(row.item_id, index)">
                                                <f7-icon color="red" material="cancel"></f7-icon>
                                            </f7-button>
                                        </td>
                                        <td class="no-padding label-cell text-align-center">{{index + 1 }}</td>
                                        <td class="no-padding numeric-cell">

                                            <!-- {{row.item.description}} -->
                                            <div class="item-input-wrap">
                                                <input v-model="row.input_description" required validate type="text" @input="setInputDescription(row)"/>
                                            </div>

                                        </td>
                                        <td class="no-padding numeric-cell">{{row.quantity}}</td>

                                        <td class="no-padding numeric-cell">S/.&nbsp;{{ Number(row.unit_price).toFixed(2)}}</td>
                                        <td class="no-padding numeric-cell">S/.&nbsp;{{row.total_value}}</td>
                                        <td class="no-padding numeric-cell">S/.&nbsp;{{row.total}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>

                    <li class="padding-vertical">
                        <f7-button @click="popupOpened = true" fill :color="theme.name_color_theme+'-shade'" class="text-align-left padding-left">
                            <small>
                                <f7-icon icon="fas fa-plus"></f7-icon>
                                Añadir producto
                            </small>
                        </f7-button>
                    </li>

                    <li class="no-padding-horizontal">
                        <f7-block class="bg-white-shade block-strong inset no-margin">
                            <f7-row>
                                <f7-col>
                                    <p>OP. Gravada</p>
                                    <p>IGV</p>
                                    <template v-if="payment_change > 0 && isCashPayment">
                                        <h3>Total</h3>
                                        <p>Vuelto</p>
                                    </template>
                                    <template v-else>
                                        <h3>Total</h3>
                                    </template>
                                </f7-col>
                                <f7-col class="text-align-right">
                                    <p>{{form.total_taxed}}</p>
                                    <p>{{form.total_igv}}</p>
                                    <template v-if="payment_change > 0 && isCashPayment">
                                        <h3>{{form.total}}</h3>
                                        <p>{{payment_change}}</p>
                                    </template>
                                    <template v-else>
                                        <h3>{{form.total}}</h3>
                                    </template>
                                </f7-col>
                            </f7-row>
                            <f7-row>
                                <f7-col>
                                    <f7-button fill round small color="gray" @click="cancel">
                                        Cancelar
                                    </f7-button>
                                </f7-col>
                                <f7-col>
                                    <f7-button fill round small class="bg-secondary" :color="theme.name_color_theme" @click="send">
                                        Aceptar
                                    </f7-button>
                                </f7-col>
                            </f7-row>
                        </f7-block>
                    </li>
                </ul>
            </form>
        </f7-card>

        <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
            <items-form :showDialog.sync="popupOpened" ref="form_items_car" @addItemsCar="addItems"></items-form>
        </f7-popup>

        <f7-popup class="demo-popup" :opened="popupCustomerOpened" @popup:closed="popupCustomerOpened = false">
            <customer-form :codeType="codeType" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
        </f7-popup>
    </f7-page>
</template>


<script>

    import moment from "moment"
    import _ from "lodash"
    import ItemsForm from "components/document/ItemsForm"
    import CustomerForm from "components/document/CustomerForm"
    import {auth } from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"
    import {findGeneralDefaultSerie} from "js_/helpers/functions"
    import {store_cash} from "../cash/mixins/cash"
    import HeaderLayout from "components/layout/Header"

    export default {
        name: "FormDocument",
        components: {
            ItemsForm,
            CustomerForm,
            HeaderLayout
        },
        mixins: [auth, general_functions, store_cash],
        data: function () {
            return {
                codeType: "",
                isBottom: true,
                search_item: "",
                form: {},
                popupOpened: false,
                popupCustomerOpened: false,
                title: "",
                all_payment_method_types: [],
                payment_destinations: [],
                series: [],
                payment_change: 0,
                form_payment: {},
                form_fee: {},
                cash_payment_method_types: [],
                credit_payment_method_types: [],
                configuration: {},
                default_customer: null,
                theme: {}
            };
        },
        computed: {
            isCreditPayment: function(){
                return (this.form.payment_condition_id === '02')
            },
            isCashPayment: function(){
                return (this.form.payment_condition_id === '01')
            },
        },
        async created() {
            await this.loadConfiguration()
            await this.getInitialSettings()
            this.codeType = this.$f7route.params.cod;
            await this.initForm();
            //this.getTables();
            await this.selectDocumentType()
            await this.getSeries()
            await this.getPaymentMethodType()

        },
        methods: {
            setInputDescription(row){

                if(row.input_description != row.item.description)
                {
                    row.name_product_pdf = row.input_description
                }
                else
                {
                    row.name_product_pdf = null
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
            allowSetCustomer(customer){

                let allow = true

                if(this.form.codigo_tipo_documento == '01' && customer.identity_document_type_id != '6')
                {
                    allow = false
                }

                return allow
            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            inputPayment(){
                this.payment_change = this.roundNumber(parseFloat(this.form_payment.payment) - parseFloat(this.form.total))
            },
            async getSeries() {

                const self = this;
                self.$f7.preloader.show();
                await this.$http.get(`${this.returnBaseUrl()}/document/series`, this.getHeaderConfig()).then(response => {

                        let all_series = response.data;
                        this.series = _.filter(all_series, {
                            document_type_id: this.form.codigo_tipo_documento
                        })
                        this.initSeries()

                    })
                    .catch(err => {})
                    .then(() => {
                        self.$f7.preloader.hide();
                    })

            },
            async getPaymentMethodType() {

                this.showLoading()
                await this.$http.get(`${this.returnBaseUrl()}/document/paymentmethod`, this.getHeaderConfig()).then(response => {

                        //mostrar metodos de pagos
                        this.all_payment_method_types = response.data.payment_method_type
                        this.setPaymentMethodTypes()

                        //mostrar destino de caja en venta
                        this.payment_destinations = response.data.payment_destinations
                        this.setPaymentDestinations()

                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
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
            setPaymentMethodTypes(){
                this.cash_payment_method_types = this.filterPaymentMethodTypes(false)
                this.credit_payment_method_types = this.filterPaymentMethodTypes(true)
            },
            initSeries() {

                const default_series = findGeneralDefaultSerie(this.series, this.form.codigo_tipo_documento)

                if(default_series)
                {
                    this.form.serie_documento = default_series.number
                }
                else
                {
                    this.form.serie_documento = (this.series.length > 0) ? this.series[0].number : null
                }

            },
            deleteItem(id, index) {
                this.form.items.splice(index, 1);
                this.calculateTotal()
                // console.log(this.$refs.form_items_car.length);
                this.$refs.form_items_car.delete_parent(id);
                this.calculateTotal()
            },
            addItems(rows) {

                let contex = this
                contex.popupOpened = false;
                rows.forEach(record => {
                    contex.form.items.push(record)
                });
                this.calculateTotal();
            },
            addCustomer(row) {
                this.popupCustomerOpened = false;
                this.form.customer_id = row.id;
                this.form.datos_del_cliente_o_receptor = {
                    codigo_tipo_documento_identidad: row.identity_document_type_id,
                    numero_documento: row.number,
                    apellidos_y_nombres_o_razon_social: row.name,
                    codigo_pais: row.country_id,
                    ubigeo: row.district_id ? row.district_id : '',
                    direccion: row.address,
                    correo_electronico: row.email,
                    telefono: row.telephone
                };
            },
            cancel() {
                this.initForm();
                this.$f7router.navigate("/");
            },
            //formas de pago
            filterPaymentMethodTypes(is_credit){

                return this.all_payment_method_types.filter(row => {
                    return row.is_credit == is_credit
                })

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
            getFormatter() {

                return {
                    serie_documento: this.form.serie_documento,
                    numero_documento: this.form.numero_documento,
                    fecha_de_emision: this.form.fecha_de_emision,
                    hora_de_emision: this.form.hora_de_emision,
                    codigo_tipo_operacion: this.form.codigo_tipo_operacion,
                    codigo_tipo_documento: this.form.codigo_tipo_documento,
                    codigo_tipo_moneda: "PEN",
                    fecha_de_vencimiento: this.form.fecha_de_vencimiento,
                    datos_del_cliente_o_receptor: this.form.datos_del_cliente_o_receptor,
                    codigo_condicion_de_pago: this.form.payment_condition_id,
                    totales: {
                        total_exportacion: this.form.total_exportation,
                        total_operaciones_gravadas: this.form.total_taxed,
                        total_operaciones_inafectas: this.form.total_unaffected,
                        total_operaciones_exoneradas: this.form.total_exonerated,
                        total_operaciones_gratuitas: this.form.total_free,
                        total_impuestos_bolsa_plastica: 0.0,
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
                            codigo_tipo_precio: "01",
                            precio_unitario: x.unit_price,
                            codigo_tipo_afectacion_igv: x.affectation_igv_type_id,
                            total_base_igv: x.total_base_igv,
                            porcentaje_igv: x.percentage_igv,
                            total_igv: x.total_igv,
                            total_impuestos_bolsa_plastica: x.total_plastic_bag_taxes,
                            total_impuestos: x.total_taxes,
                            total_valor_item: x.total_value,
                            total_item: x.total,
                            nombre_producto_pdf: x.name_product_pdf,
                        };
                    }),
                    pagos: this.getFormPayment(),
                    cuotas: this.getFormFee()
                };
            },
            getFormPayment(){

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
            getFormFee(){

                if(this.isCreditPayment)
                {
                    return [
                        {
                            fecha: this.form_fee.date,
                            codigo_tipo_moneda: this.form.codigo_tipo_moneda,
                            monto: this.form_fee.amount,
                            codigo_metodo_de_pago: this.form_fee.payment_method_type_id,
                        }
                    ]
                }

                return []

            },
            validate() {
                const self = this;

                if (!this.form.serie_documento) {
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
            send() {
                const self = this
                let valid = this.validate()
                if (!valid) return

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/documents`, this.getFormatter(), this.getHeaderConfig())
                    .then(response => {
                        let data = response.data
                        if (data.success) {
                            this.initForm()

                            self.$f7.dialog.create({
                                title: 'Comprobante registrado',
                                text: data.data.number,
                                buttons: self.getOptionsButtons(),
                                onClick: function(dialog, index){
                                    self.clickOptionsButtons(dialog, index, data)
                                },
                                verticalButtons: true,
                            }).open()

                            self.storeCashDocument(data.data.id)

                        } else {
                            alert("No se registro la Venta")
                        }
                    })
                    .catch(err => {
                        alert(`${err.message}`)
                    })
                    .then(() => {
                        this.hideLoading()
                    })
            },
            clickOptionsButtons(dialog, index, data){

                // Imprimir
                if(index === 0)
                {
                    this.toPrint(data)
                }
                // Descargar A4
                else if (index === 1)
                {
                    cordova.InAppBrowser.open(
                        `${localStorage.api_url}/print/document/${data.data.external_id}/a4`,
                        "_system",
                        "location=yes"
                    )
                }
                // Descargar Ticket
                else if (index === 2)
                {
                    cordova.InAppBrowser.open(
                        `${localStorage.api_url}/print/document/${data.data.external_id}/ticket`,
                        "_system",
                        "location=yes"
                    )
                }
                // Continuar
                else if (index === 3)
                {
                    this.redirectRoute('/documents/')
                }
                else if (index === 4)
                {
                    // self.$f7router.navigate("/documents/");
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
                        text: 'Descargar A4',
                        cssClass: 'text-center',
                        close: false
                    },
                    {
                        text: 'Descargar Ticket',
                        cssClass: 'text-center',
                        close: false
                    },
                    {
                        text: 'Ver Listado',
                        cssClass: 'text-center'
                    },
                    {
                        text: 'Crear Nuevo',
                        cssClass: 'text-center'
                    },
                ]
            },
            async toPrint(data){

                let html_pdf = null
                const print_format_pdf = (this.configuration.print_format_pdf) ? this.configuration.print_format_pdf : 'ticket'
                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/document-print-pdf/document/${data.data.external_id}/${print_format_pdf}`, this.getHeaderConfig())
                            .then((response)=>{
                                html_pdf=response.data
                            })
                            .catch((error)=>{
                                console.log(error)
                            })

                cordova.plugins.printer.print(html_pdf)

                this.hideLoading()

            },
            selectDocumentType() {
                if (this.form.codigo_tipo_documento == "01") {
                    // this.form.serie_documento = "F001";
                    this.title = "Factura Electrónica";
                } else if (this.form.codigo_tipo_documento == "03") {
                    // this.form.serie_documento = "B001";
                    this.title = "Boleta Electrónica";
                }
            },
            calculateTotal() {
                let total_discount = 0;
                let total_charge = 0;
                let total_exportation = 0;
                let total_taxed = 0;
                let total_exonerated = 0;
                let total_unaffected = 0;
                let total_free = 0;
                let total_igv = 0;
                let total_value = 0;
                let total = 0;
                let total_plastic_bag_taxes = 0;
                this.form.items.forEach(row => {
                    if (row.affectation_igv_type_id === "10") {
                        total_taxed += parseFloat(row.total_value);
                    }
                    if (row.affectation_igv_type_id === "20") {
                        total_exonerated += parseFloat(row.total_value);
                    }
                    if (row.affectation_igv_type_id === "30") {
                        total_unaffected += parseFloat(row.total_value);
                    }
                    if (row.affectation_igv_type_id === "40") {
                        total_exportation += parseFloat(row.total_value);
                    }
                    if (["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) < 0) {
                        total_free += parseFloat(row.total_value);
                    }
                    if (
                        ["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) > -1
                    ) {
                        total_igv += parseFloat(row.total_igv);
                        total += parseFloat(row.total);
                    }
                    total_value += parseFloat(row.total_value);
                    total_plastic_bag_taxes += parseFloat(row.total_plastic_bag_taxes);
                });

                this.form.total_exportation = _.round(total_exportation, 2);
                this.form.total_taxed = _.round(total_taxed, 2);
                this.form.total_exonerated = _.round(total_exonerated, 2);
                this.form.total_unaffected = _.round(total_unaffected, 2);
                this.form.total_free = _.round(total_free, 2);
                this.form.total_igv = _.round(total_igv, 2);
                this.form.total_value = _.round(total_value, 2);
                this.form.total_taxes = _.round(total_igv, 2);
                this.form.total = _.round(total + this.form.total_plastic_bag_taxes, 2);

                this.calculatePaymentFeeAmount()
            },

            initForm() {
                this.form = {
                    total_taxed: 0,
                    total_plastic_bag_taxes: 0,
                    total_igv: 0,
                    total: 0,
                    serie_documento: "",
                    numero_documento: "#",
                    fecha_de_emision: moment().format("YYYY-MM-DD"),
                    hora_de_emision: moment().format("HH:mm:ss"),
                    codigo_tipo_operacion: "0101",
                    codigo_tipo_documento: this.$f7route.params.cod,
                    codigo_tipo_moneda: "PEN",
                    fecha_de_vencimiento: moment().format("YYYY-MM-DD"),
                    numero_orden_de_compra: "",
                    informacion_adicional: "",
                    datos_del_cliente_o_receptor: {},
                    totales: {},
                    items: [],
                    payment_condition_id: '01'
                };

                // this.payment_change = 0
                this.initSeries()
                this.initFormPayment()
                this.initFormFee()
                this.setPaymentDestinations()

                this.setDefaultCustomer()

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
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    };
</script>

<style scoped>
    .m-text {
        text-align: left;
        font-size: 12px;
        font-weight: bold;
    }

    .m-text-r {
        text-align: center;
    }

    .footer-text {
        position: absolute;
        margin-top: 2%;
        width: 50%;
        padding-left: 1%;
    }

    .footer-data {
        width: 50%;
        color: #fff;
        background: #17a2b8;
        margin: auto;
        border-right: 30px solid #fff;
        border-left: 30px solid #fff;
        border-bottom: 73px solid transparent;
        text-align: center;
    }

    .footer {
        text-align: center;
        z-index: 9999;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        color: white;
        text-align: center;
    }
</style>