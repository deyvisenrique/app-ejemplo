<template>
<f7-page class="" color="">
    <header-layout></header-layout>
    <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical">
        <f7-row>
            <f7-col width="10">
            <a class="link back text-color-white" href="/">
                <i class="fas fa-angle-left"></i>
            </a>
            </f7-col>
            <f7-col width="80" class="text-color-white text-align-center">
                Pedido
            </f7-col>
            <f7-col width="10"></f7-col>
        </f7-row>
    </f7-block>

    <f7-block>
        <form class="list no-hairlines-md" id="demo-form">
            <ul>
                <f7-row>
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
                                <div class="item-title item-label">Fecha de Entrega</div>
                                <div class="item-input-wrap">
                                    <input name="date" v-model="form.delivery_date" type="date" />
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
                                    <f7-icon icon="fas fa-user" size="24" color="deeppurple"></f7-icon>
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
                    <f7-button @click="popupOpened = true" fill color="blue" class="text-align-left padding-left">
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
                                <f7-button fill round small color="pink" @click="send">
                                    Aceptar
                                </f7-button>
                            </f7-col>
                        </f7-row>
                    </f7-block>
                </li>

            </ul>
        </form>
    </f7-block>

    <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
        <items-form :showDialog.sync="popupOpened" ref="form_items_car" @addItemsCar="addItems"></items-form>
    </f7-popup>

    <f7-popup class="demo-popup" :opened="popupCustomerOpened" @popup:closed="popupCustomerOpened = false">
        <customer-form :codeType="codeType" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
    </f7-popup>
</f7-page>
</template>

<script>
    const url = "https://demo.facturador.pro/api";
    import moment from "moment";
    import _ from "lodash";
    import ItemsForm from "components/document/ItemsForm";
    import CustomerForm from "components/document/CustomerForm";
    import {auth} from "mixins_/auth";
    import {general_functions} from "mixins_/general_functions";
    import HeaderLayout from "components/layout/Header";

    export default {
        name: "FormOrderNote",
        components: {
            ItemsForm,
            CustomerForm,
            HeaderLayout
        },
        mixins: [auth, general_functions],
        data: function () {
            // Must return an object
            return {
                codeType: "",
                isBottom: true,
                popupCustomerOpened: false,
                search_item: "",
                customers: [],
                form: {},
                popupOpened: false,
                api_url: localStorage.api_url,
                default_customer: null,
            };
        },
        computed: {},
        created() {
            this.initForm();
            this.getTables();
        },

        methods: {
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
                this.popupCustomerOpened = false;
                this.form.customer_id = row.id;
                this.form.datos_del_cliente_o_receptor = {
                    codigo_tipo_documento_identidad: row.identity_document_type_id,
                    numero_documento: row.number,
                    apellidos_y_nombres_o_razon_social: row.name,
                    codigo_pais: "PE",
                    ubigeo: "150101",
                    direccion: row.address,
                    correo_electronico: row.email,
                    telefono: "427-1148"
                };
            },
            addItems(rows) {
                // console.log(rows)
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
                if (this.form.items.length == 0) {
                    self.$f7.dialog.alert(`Debe agregar productos.`, "Facturador PRO APP");

                    return false;
                }

                if (!this.form.customer_id) {
                    self.$f7.dialog.alert(
                        `Debe seleccionar un cliente.`,
                        "Facturador PRO APP"
                    );

                    return false;
                }

                return true;
            },

            send() {
                const self = this;

                let valid = this.validate();

                if (!valid) return;

                self.$f7.preloader.show();

                this.$http
                    .post(`${this.returnBaseUrl()}/order-notes`, this.form, this.getHeaderConfig())
                    .then(response => {
                        let data = response.data;
                        if (data.success) {
                            this.initForm();

                            self.$f7.dialog.alert(
                                `Pedido registrado: PD-${data.data.id}`,
                                "Facturador PRO APP"
                            );
                            self.$f7router.navigate("/documents/");
                        } else {
                            alert("No se registro la Compra");
                        }
                    })
                    .catch(err => {
                        alert(`${err.message}`);
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
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
                this.form.total = _.round(total, 2);
            },

            initForm() {
                this.form = {
                    prefix: "PD",
                    establishment_id: 1,
                    delivery_date: '',
                    date_of_due: '',
                    date_of_issue: moment().format("YYYY-MM-DD"),
                    time_of_issue: moment().format("HH:mm:ss"),
                    customer_id: null,
                    currency_type_id: "PEN",
                    purchase_order: null,
                    exchange_rate_sale: 0.01,
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

                this.setDefaultCustomer()

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
            }
        }
    };
</script>
