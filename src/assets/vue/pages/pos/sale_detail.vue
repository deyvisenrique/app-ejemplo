<template>
    <f7-page class="" color="bluemagenta">

        <header-layout :title="geTitle" hrefBack="/xxxxx"></header-layout>

        <f7-block>
            <div class="data-table margin-bottom">
                <table>
                    <thead>
                        <tr>
                            <th class="numeric-only">#</th>
                            <th class="label-cell">Producto</th>
                            <th class="label-cell">Precio</th>
                            <th class="numeric-only text-align-center">Cantidad</th>
                            <th class="numeric-only">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in form.items" :key="index">
                            <td class="numeric-only">{{ index + 1 }}</td>
                            <td class="label-cell">{{ row.item.description }}</td>
                            <td class="numeric-only">{{ row.unit_price }}</td>
                            <td class="numeric-only padding">
                                
                                <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                    <div class="stepper-button-minus" @click="calculateQuantity(-1, index)"></div>
                                    <div class="stepper-input-wrap">
                                        <input type="number" v-model="row.quantity" min="0" step="1" />
                                    </div>
                                    <div class="stepper-button-plus" @click="calculateQuantity(1, index)"></div>
                                </div>

                            </td>
                            <td class="numeric-only">{{ row.total }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="no-padding-horizontal padding-top">
                <f7-block class="bg-white-shade block-strong inset no-margin">
                    <f7-row>
                        <f7-col>
                            <h3>OP. Gravada</h3>
                            <h3>IGV</h3>
                        </f7-col>
                        <f7-col class="text-align-right">
                            <h3>{{currency_type.symbol}} {{form.total_taxed}}</h3>
                            <h3>{{currency_type.symbol}} {{form.total_igv}}</h3>
                        </f7-col>
                    </f7-row>
                </f7-block>
            </div>
        </f7-block>
 
        <f7-fab position="left-bottom" class="margin-right" color="red">
            <f7-icon ios="f7:delete" aurora="f7:delete" md="material:delete" >
            </f7-icon>
        </f7-fab>

        <f7-fab position="right-bottom" class="margin-right" color="bluemagenta">
            <f7-icon ios="f7:arrow_forward" aurora="f7:arrow_forward" md="material:arrow_forward"></f7-icon>
        </f7-fab>
    </f7-page>
</template>

<script>

    import moment from 'moment'
    import _ from 'lodash'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import {calculateRowItem} from "js_/helpers/functions"

    export default {
        name: 'SaleDetailPos',
        components: {
            HeaderLayout
        },
        mixins: [
            auth, 
            general_functions, 
            operations
        ],
        data: function () {
            return {
                affectation_igv_types: [],
                form:{},
                currency_type: {
                    symbol: 'S/'
                },
                list_items_sale: []
            }
        },
        computed: {
            geTitle(){
                return `Total ${this.currency_type.symbol} ${this.form.total}`
            }
        },
        async created() {
            await this.getAffectationIgvTypes()
            await this.initForm()
            await this.initData()
        },
        methods: {
            async getAffectationIgvTypes() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/items/table/affectation_igv_types`, this.getHeaderConfig())
                            .then(response => {
                                this.affectation_igv_types = response.data
                            })
                            .then(() => {
                                this.hideLoading()
                            })

            },
            initForm() 
            {
                this.form = {
                    serie_documento: null,
                    numero_documento: '#',
                    fecha_de_emision: moment().format('YYYY-MM-DD'),
                    hora_de_emision: moment().format('HH:mm:ss'),
                    codigo_tipo_operacion: '0101',
                    codigo_tipo_documento: this.$f7route.params.cod,
                    codigo_tipo_moneda: 'PEN',
                    fecha_de_vencimiento: moment().format('YYYY-MM-DD'),
                    datos_del_cliente_o_receptor: {},
                    totales: {},
                    items: [],
                    payment_condition_id: '01',
                    total_plastic_bag_taxes: 0,
                    total_exportation: 0,
                    total_taxed: 0,
                    total_exonerated: 0,
                    total_unaffected: 0,
                    total_free: 0,
                    total_igv: 0,
                    total_value: 0,
                    total_taxes: 0,
                    total: 0,
                };

            },
            getFormItem() 
            {
                return {
                    item_id: null,
                    item: {},
                    affectation_igv_type_id: null,
                    affectation_igv_type: {},
                    has_isc: false,
                    system_isc_type_id: null,
                    calculate_quantity: false,
                    percentage_isc: 0,
                    suggested_price: 0,
                    quantity: 1,
                    aux_quantity: 1,
                    unit_price_value: 0,
                    unit_price: 0,
                    charges: [],
                    discounts: [],
                    attributes: [],
                    has_igv: null,
                    input_description: null,
                    name_product_pdf: null,
                    presentation: null,
                }
            },
            getTransformDataItem(data)
            {
                return data.map(row => {
                    return this.calculateDataItem(row)
                })

            },
            calculateDataItem(row)
            {
                let form_item = this.getFormItem()

                form_item.item = row
                form_item.quantity = row.quantity
                form_item.unit_price_value = form_item.item.sale_unit_price

                form_item.has_igv = form_item.item.has_igv
                form_item.affectation_igv_type_id = form_item.item.sale_affectation_igv_type_id

                const unit_price = this.roundNumber((form_item.has_igv ? form_item.unit_price_value : form_item.unit_price_value * 1.18), 6)

                form_item.unit_price = unit_price
                form_item.item.unit_price = unit_price


                form_item.affectation_igv_type = _.find(this.affectation_igv_types, {
                    id: form_item.affectation_igv_type_id
                })

                form_item.input_description = row.description

                return calculateRowItem(form_item, 'PEN', 1)

            },
            async initData()
            {
                this.list_items_sale = this.getStorage('list_items_sale', true)

                this.form.items = await this.getTransformDataItem(this.list_items_sale)

                this.calculateTotal()

            },
            calculateTotal()
            {
                this.generalCalculateTotal() //definido en mixin operations
            },
            calculateQuantity(value, index) 
            {
                let quantity = parseFloat(this.form.items[index].quantity)
                let result = (quantity += parseFloat(value))

                if(result <= 0)
                {
                    this.showAlert('La cantidad debe ser mayor a 0.')
                }
                else
                {
                    this.form.items[index].quantity = result
                    const item_sale = _.find(this.list_items_sale, {item_id : this.form.items[index].item_id})
                    item_sale.quantity = result

                    this.form.items[index] = this.calculateDataItem(item_sale)
                    this.calculateTotal()
                }
            },
        }
    }
</script>
