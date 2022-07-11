<template>
<f7-page class="" color="bluemagenta">
    <header-layout title="Cotización"></header-layout>

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
                <f7-row>
                    <f7-col width="100">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Dirección de envío</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.shipping_address" type="text" />
                                </div>
                            </div>
                        </div>
                    </f7-col>
                    
                    <f7-col width="100">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Observación</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.observation" type="text" />
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
    import {download_file} from "mixins_/download_file"

    export default {
        name: "FormOrderNote",
        components: {
            ItemsForm,
            CustomerForm,
            HeaderLayout
        },
        mixins: [auth, general_functions, download_file],
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
            // this.initForm();
            // this.getTables();
        },

        methods: {
        }
    };
</script>
