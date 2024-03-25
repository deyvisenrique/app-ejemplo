<template>
<f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">

    <header-layout title="Nota de Venta"></header-layout>

    <f7-card class="padding margin-top" no-shadow>
        <form class="list no-hairlines-md" id="demo-form">
            <ul>
                <f7-row>
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
                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Metodo de pago</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <select v-model="form_payment.payment_method_type_id">
                                        <template v-for="(row, index) in payment_method_types">
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
                    <f7-col width="50">
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
                </f7-row>

                <li class="no-padding-horizontal margin-top">
                    <f7-block class="bg-white-shade block-strong inset no-margin">
                        <f7-row @click="popupCustomerOpened = true">
                            <f7-col width="15" class="align-self-center">
                                <div class="badge bg-color-white">
                                    <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                                </div>
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
                                    <th class="numeric-cell">Descripción</th>
                                    <th class="medium-only">Cantidad</th>
                                    <th class="medium-only">Precio</th>
                                    <th class="medium-only">Subtotal</th>
                                    <th class="medium-only">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in form.items" :key="index">
                                    <td class="no-padding numeric-cell">
                                        <f7-button @click.native="deleteItem(row.item_id, index)">
                                            <f7-icon color="red" material="cancel"></f7-icon>
                                        </f7-button>
                                    </td>
                                    <td class="no-padding label-cell">{{index + 1 }}</td>
                                    <td class="no-padding numeric-cell">{{row.item.description}}</td>
                                    <td class="no-padding numeric-cell">{{row.quantity}}</td>
                                    <td class="no-padding numeric-cell">S/. {{ Number(row.unit_price).toFixed(2)}}</td>
                                    <td class="no-padding numeric-cell">S/. {{row.total_value}}</td>
                                    <td class="no-padding numeric-cell">S/. {{row.total}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>

                <li class="padding-vertical">
                    <f7-button @click="popupOpened = true" fill :color="theme.name_color_theme" class="text-align-left padding-left">
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
                                <h3>Total</h3>
                                <template v-if="payment_change > 0">
                                    <p>Vuelto</p>
                                </template>
                            </f7-col>
                            <f7-col class="text-align-right">
                                <p>{{form.total_taxed}}</p>
                                <p>{{form.total_igv}}</p>
                                <h3>{{form.total}}</h3>
                                <template v-if="payment_change > 0">
                                    <p>{{payment_change}}</p>
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
    import {auth} from "mixins_/auth"
    import {findGeneralDefaultSerie} from "js_/helpers/functions"
    import {general_functions} from "mixins_/general_functions"
    import {download_file} from "mixins_/download_file"
    import {store_cash} from "../cash/mixins/cash"
    import HeaderLayout from "components/layout/Header"

    export default {
        name: "FormSaleNote",
        components: {
            ItemsForm,
            CustomerForm,
            HeaderLayout
        },
        mixins: [auth, general_functions, store_cash, download_file],
        data: function () {
            // Must return an object
            return {
                codeType: "",
                isBottom: true,
                popupCustomerOpened: false,
                search_item: "",
                customers: [],
                form_payment: {},
                form: {},
                popupOpened: false,
                series: [],
                payment_method_type: [],
                payment_method_types: [],
                payment_destinations: [],
                default_customer: null,
                payment_change: 0,
                theme: {},
            }
        },
        computed: {},
        async created() {
            await this.initForm();
            await this.getInitialSettings()
            await this.getTables()
            await this.getSeries()
            await this.getPaymentMethodType()
        },

        methods: {
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
            inputPayment(){
                this.payment_change = this.roundNumber(parseFloat(this.form_payment.payment) - parseFloat(this.form.total))
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
            setDefaultCustomer(){

                if(!this.default_customer)
                {
                    this.showLoading()
                    this.findGeneralDefaultCustomer()
                        .then((response)=>{

                            if(response.data.success)
                            {
                                this.default_customer = response.data.data
                                this.addCustomer(this.default_customer)
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
            async getSeries() {

                const self = this;
                self.$f7.preloader.show();

                await this.$http.get(`${this.returnBaseUrl()}/sale-note/series`, this.getHeaderConfig()).then(response => {
                        this.series = response.data;
                        // this.form.series_id = (this.series.length > 0) ? this.series[0].id : null
                        this.initSeries()
                    })
                    .catch(err => {})
                    .then(() => {
                        self.$f7.preloader.hide();
                    })

            },
            addCustomer(row) {
                this.popupCustomerOpened = false;
                this.form.customer_id = row.id;
                this.form.datos_del_cliente_o_receptor = {
                    codigo_tipo_documento_identidad: row.identity_document_type_id,
                    numero_documento: row.number,
                    apellidos_y_nombres_o_razon_social: row.name,
                    codigo_pais: row.country_id,
                    ubigeo: row.district_id ? row.district_id : '150101',
                    direccion: row.address,
                    correo_electronico: row.email,
                    telefono: row.telephone
                };
            },
            addItems(rows) {
                let contex = this
                contex.popupOpened = false;
                rows.forEach(record => {
                    contex.form.items.push(record)
                });
                this.calculateTotal();
            },
            cancel() {
                this.initForm();
                this.$f7router.navigate("/");
            },

            validate() {
                const self = this;

                if (!this.form.series_id) {
                    self.$f7.dialog.alert(`Debe seleccionar una serie.`, "Mensaje");
                    return false;
                }

                if (this.form.items.length == 0) {
                    self.$f7.dialog.alert(`Debe agregar productos.`, "Mensaje");

                    return false;
                }

                if (!this.form.customer_id) {
                    self.$f7.dialog.alert(
                        `Debe seleccionar un cliente.`,
                        "Mensaje"
                    );

                    return false;
                }

                const validate_cash_payment = this.validateCashPayment()
                if(!validate_cash_payment) return validate_cash_payment

                return true;
            },
            validateCashPayment(){

                if(!this.form_payment.payment_destination_id)
                {
                    this.showAlert('El destino de pago es obligatorio, aperture caja o cuentas bancarias')
                    return false
                }

                return true
            },
            send() {
                const self = this;

                let valid = this.validate();

                if (!valid) return;

                self.$f7.preloader.show();

                this.calculateTotal();

                this.$http
                    .post(`${this.returnBaseUrl()}/sale-note`, this.form, this.getHeaderConfig())
                    .then(response => {
                        let data = response.data;
                        if (data.success) {

                            this.initForm()
                            self.storeCashDocument(null, data.data.id)
                            this.showDialogOptions(data)

                        } else {
                            alert("No se registro la Nota de venta")
                        }
                    })
                    .catch(err => {
                        alert(`${err.message}`)
                    })
                    .then(() => {
                        self.$f7.preloader.hide()
                    })
            },
            async toPrint(data){

                await this.showLoading()
                await this.downloaFileToPrint(data.data.print_ticket, data.data.filename) //definido en mixin download_file
                await this.hideLoading()

            },
            showDialogOptions(data){

                const context = this

                context.showDialogConfirm({
                    title: 'Nota de venta registrada',
                    text: data.data.number,
                    buttons: context.getOptionsButtons(),
                    onClick: function(dialog, index){
                        context.clickOptionsButtons(dialog, index, data)
                    },
                    verticalButtons: true,
                })

            },
            clickOptionsButtons(dialog, index, data){

                // Imprimir
                if(index === 0)
                {
                    this.toPrint(data)
                }
                // Ir listado
                else if (index === 1)
                {
                    this.$f7router.navigate("/documents/")
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
                        text: 'Ir al listado',
                        cssClass: 'text-center',
                    },
                    {
                        text: 'Continuar',
                        cssClass: 'text-center'
                    },
                ]
            },

            calculateTotal() {
                let total_discount = 0
                let total_charge = 0
                let total_exportation = 0
                let total_taxed = 0
                let total_exonerated = 0
                let total_unaffected = 0
                let total_free = 0
                let total_igv = 0
                let total_value = 0
                let total = 0
                let total_plastic_bag_taxes = 0
                this.form.items.forEach(row => {
                    if (row.affectation_igv_type_id === "10") {
                        total_taxed += parseFloat(row.total_value)
                    }
                    if (row.affectation_igv_type_id === "20") {
                        total_exonerated += parseFloat(row.total_value)
                    }
                    if (row.affectation_igv_type_id === "30") {
                        total_unaffected += parseFloat(row.total_value)
                    }
                    if (row.affectation_igv_type_id === "40") {
                        total_exportation += parseFloat(row.total_value)
                    }
                    if (["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) < 0) {
                        total_free += parseFloat(row.total_value)
                    }
                    if (
                        ["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) > -1
                    ) {
                        total_igv += parseFloat(row.total_igv)
                        total += parseFloat(row.total)
                    }
                    total_value += parseFloat(row.total_value)
                    total_plastic_bag_taxes += parseFloat(row.total_plastic_bag_taxes)
                })

                this.form.total_exportation = _.round(total_exportation, 2)
                this.form.total_taxed = _.round(total_taxed, 2)
                this.form.total_exonerated = _.round(total_exonerated, 2)
                this.form.total_unaffected = _.round(total_unaffected, 2)
                this.form.total_free = _.round(total_free, 2)
                this.form.total_igv = _.round(total_igv, 2)
                this.form.total_value = _.round(total_value, 2)
                this.form.total_taxes = _.round(total_igv, 2)
                this.form.total = _.round(total, 2)
                this.form.payments = this.getFormPayment()

                this.calculatePaymentAmount()
            },
            calculatePaymentAmount() {

                this.form_payment.payment = this.form.total
                this.inputPayment()

            },
            getFormPayment(){

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
            initForm() {
                this.form = {
                    document_type_id: "80",
                    prefix: "NV",
                    series_id: null,
                    establishment_id: null,
                    date_of_issue: moment().format("YYYY-MM-DD"),
                    time_of_issue: moment().format("HH:mm:ss"),
                    customer_id: null,
                    currency_type_id: "PEN",
                    purchase_order: null,
                    exchange_rate_sale: 0,
                    total_prepayment: 0,
                    total_charge: 0,
                    total_discount: 0,
                    total_exportation: 0,
                    total_free: 0,
                    total_taxed: 0,
                    total_unaffected: 0,
                    total_exonerated: 0,
                    total_igv: 0,
                    total_base_isc: 0,
                    total_isc: 0,
                    total_base_other_taxes: 0,
                    total_other_taxes: 0,
                    total_taxes: 0,
                    total_value: 0,
                    total: 0,
                    operation_type_id: null,
                    items: [],
                    charges: [],
                    discounts: [],
                    attributes: [],
                    guides: [],
                    payments: [],
                    additional_information: null,
                    actions: {
                        format_pdf: "a4"
                    },
                    apply_concurrency: false,
                    type_period: null,
                    quantity_period: 0,
                    automatic_date_of_issue: null,
                    enabled_concurrency: false
                }

                // this.form.series_id = (this.series.length > 0) ? this.series[0].id : null
                this.initSeries()
                this.setDefaultCustomer()
                this.initFormPayment()
                this.setPaymentDestinations()

            },
            initSeries(){

                const default_series = findGeneralDefaultSerie(this.series, '80')

                if(default_series)
                {
                    this.form.series_id = default_series.id
                }
                else
                {
                    this.form.series_id = (this.series.length > 0) ? this.series[0].id : null
                }

            },
            getTables() {
                const self = this;
                self.$f7.preloader.show();
                this.$http
                    .get(
                        `${this.returnBaseUrl()}/document/customers`,
                        this.getHeaderConfig()
                    )
                    .then(response => {
                        let source = response.data.data;
                        self.customers = source.customers;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            },
            async getPaymentMethodType() {

                const self = this;
                self.$f7.preloader.show();
                await this.$http.get(`${this.returnBaseUrl()}/document/paymentmethod`, this.getHeaderConfig()).then(response => {

                        //mostrar metodos de pagos
                        this.payment_method_types = response.data.payment_method_type.filter(row => {
                            return row.is_credit == false
                        })

                        //mostrar destino de caja en venta
                        this.payment_destinations = response.data.payment_destinations
                        this.setPaymentDestinations()

                    })
                    .catch(err => {})
                    .then(() => {
                        self.$f7.preloader.hide();
                    })

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
            deleteItem(id, index) {
                this.form.items.splice(index, 1);
                this.$refs.form_items_car.delete_parent(id);
                this.calculateTotal()
            },
        }
    };
</script>


<style scoped>
.navbar-cus {
    background: #17a2b8;
    color: white
}

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
