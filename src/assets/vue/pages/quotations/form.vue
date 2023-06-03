<template>
<f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">
    <header-layout title="Cotización"></header-layout>

    <f7-card class="padding margin-top" no-shadow>
        <form class="list no-hairlines-md" id="demo-form">
            <ul>
                <f7-row>

                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Serie</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <select v-model="form.series" placeholder="Please choose...">
                                        <option v-for="(row, index) in series" :value="row.number" :key="index">{{row.number}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </f7-col>

                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Tiempo de Validez</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.date_of_due" type="text" />
                                </div>
                            </div>
                        </div>
                    </f7-col>

                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Tiempo de Entrega</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.delivery_date" type="text" />
                                </div>
                            </div>
                        </div>
                    </f7-col>

                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Dirección de envío</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.shipping_address" type="text" />
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
                                <small class="no-margin">{{ this.form.customer_name }}</small>
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
                                    <th class="label-cell" width="5%">#</th>
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
                            </f7-col>
                            <f7-col class="text-align-right">
                                <p>{{form.total_taxed}}</p>
                                <p>{{form.total_igv}}</p>
                                <h3>{{form.total}}</h3>
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
        <customer-form :codeType="null" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
    </f7-popup>
</f7-page>
</template>

<script>

    import moment from 'moment'
    import _ from 'lodash'
    import ItemsForm from 'components/document/ItemsForm'
    import CustomerForm from 'components/document/CustomerForm'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import {download_file} from 'mixins_/download_file'

    export default {
        name: 'FormQuotation',
        components: {
            ItemsForm,
            CustomerForm,
            HeaderLayout
        },
        mixins: [
            auth,
            general_functions,
            download_file,
            operations
        ],
        data: function () {
            return {
                isBottom: true,
                popupCustomerOpened: false,
                customers: [],
                form: {},
                popupOpened: false,
                default_customer: null,
                series: [],
                theme: {},
                resource: 'quotations'
            }
        },
        computed: {},
        created() {
            this.initForm()
            this.getInitialSettings()
            this.getOnlyCustomers()
            this.getTables()
        },
        methods:
        {
            async getTables()
            {
                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/tables`, this.getHeaderConfig())
                                .then(response => {
                                    this.series = response.data.series
                                    this.setDataFromTables()
                                })
                                .catch(err => {
                                    console.log(err)
                                    alert(`${err.message}`)
                                })
                                .then(() => {
                                    this.hideLoading()
                                })
            },
            setDataFromTables()
            {
                this.form.series = this.series.length > 0 ? this.series[0].number : null
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
            addCustomer(row) {
                this.popupCustomerOpened = false
                this.form.customer_id = row.id
                this.form.customer_name = row.name
            },
            addItems(rows) {

                this.popupOpened = false

                rows.forEach(record => {
                    this.form.items.push(this.getNewItem(record))
                })

                this.calculateTotal()
            },
            getNewItem(record){

                let new_item = { ...record }
                new_item.item.presentation = new_item.item.presentation ? new_item.item.presentation : []
                return new_item

            },
            cancel() {
                this.initForm()
                this.redirectHome()
            },
            validateData() {

                if (this.form.items.length == 0)  return this.generalResponse(false, 'Debe agregar productos.')

                if (!this.form.customer_id) return this.generalResponse(false, 'Debe seleccionar un cliente.')

                return this.generalResponse()
            },
            send(){

                const valid = this.validateData()
                if (!valid.success) return this.showAlert(valid.message)

                this.showLoading()

                this.$http.post(`${this.returnBaseUrl()}/quotations`, this.form, this.getHeaderConfig())
                        .then(response => {

                            const data = response.data

                            if (data.success)
                            {
                                this.initForm()
                                this.showDialogOptions(data)
                                this.setDataFromTables()
                            }
                            else
                            {
                                this.showAlert('No se registro la cotización')
                            }
                        })
                        .catch(err => {
                            this.showAlert(`No se registro la cotización: ${err.message}`)
                        })
                        .then(() => {
                            this.hideLoading()
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
                    title: 'Cotización registrada',
                    text: data.data.number_full,
                    buttons: context.getGeneralFormButtons(),
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
                    this.redirectRoute('/documents/')
                }

            },
            calculateTotal() {
                this.generalCalculateTotal()
            },
            initForm(){

                this.form = {
                    document_type_id: "U5",
                    series: null,
                    number: "#",
                    prefix: 'COT',
                    establishment_id: null,
                    date_of_issue: moment().format('YYYY-MM-DD'),
                    time_of_issue: moment().format('HH:mm:ss'),
                    customer_id: null,
                    customer_name: null,
                    currency_type_id: 'PEN',
                    exchange_rate_sale: 1,
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
                    items: [],
                    payments: [],
                    delivery_date: null,
                    date_of_due: null,
                    shipping_address: null,
                }

                this.setDefaultCustomer()

            },
            getOnlyCustomers()
            {
                this.showLoading()
                this.getGeneralCustomers()
                    .then(response => {
                        this.customers = response.data.data.customers
                        this.hideLoading()
                    })

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
            deleteItem(id, index) {
                this.form.items.splice(index, 1);
                this.calculateTotal()
                // console.log(this.$refs.form_items_car.length);
                this.$refs.form_items_car.delete_parent(id);
                this.calculateTotal()
            },
        }
    }
</script>
