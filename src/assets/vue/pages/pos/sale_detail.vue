<template>
    <f7-page class="" color="bluemagenta">

        <header-layout :title="geTitle" hrefBack="/list-items-sale/" :overwriteBackRoute="true"></header-layout>

        <f7-block>

            <template v-if="document_types.length > 0">
                <f7-segmented raised>
                    <template v-for="(row, index) in document_types">
                        <f7-button @click="clickChangeDocumentType(row.id)" :class="form.document_type_id === row.id ? 'button-active':''">{{row.text}}</f7-button>
                    </template>
                </f7-segmented>
            </template>
            <template v-else>
                <f7-button class="button-active">NO TIENE PERMISOS ASIGNADOS</f7-button>
            </template>
 
            <div class="data-table margin-bottom padding-top">
                <table>
                    <thead>
                        <tr>
                            <th class="numeric-only">#</th>
                            <th class="label-cell">Producto</th>
                            <th class="label-cell">P. Unitario</th>
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
                                        <input type="number" v-model="row.quantity" min="0" step="1" @change="changeQuantity(index)" />
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
 
        <f7-fab position="left-bottom" class="margin-right" color="red" @click="clickDeleteItems">
            <f7-icon ios="f7:delete" aurora="f7:delete" md="material:delete"></f7-icon>
        </f7-fab>

        <f7-fab position="right-bottom" class="margin-right" color="bluemagenta" @click="clickPayment">
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
                document_types: [],
                form:{
                    total: 0
                },
                currency_type: {
                    symbol: 'S/'
                },
                list_items_sale: [],
                resource: 'documents',
                pos_document_types: []
            }
        },
        computed: {
            geTitle(){
                return `Total ${this.currency_type.symbol} ${this.form.total}`
            }
        },
        async created() {
            await this.getTables()
            await this.initForm()
            await this.initData()
        },
        methods: {
            getDocumentType(id)
            {
                return _.find(this.document_types, {id:id})
            },
            getPosDocumentTypes()
            {
                const generals = this.getStorage('generals', true)
                return generals ? generals.pos_document_types : []
            },
            clickChangeDocumentType(document_type_id)
            {
                this.form.document_type_id = document_type_id
            },
            getShortDescriptionDocumentType(document_type)
            {
                let description = null

                switch (document_type.id) 
                {
                    case '01':
                        description = 'FACTURA'
                        break
                    case '03':
                        description = 'BOLETA'
                        break
                    case '80':
                        description = 'N. VENTA'
                        break
                }

                return description
            },
            getDocumentTypesToButtons(document_types)
            {
                this.pos_document_types = this.getPosDocumentTypes()
                const permissions = this.getStoragePermissions()
                let allowed_document_types = []

                document_types.forEach(row => {
                    
                    const doc_permission = _.find(this.pos_document_types, {document_type_id : row.id})

                    if(doc_permission)
                    {
                        const has_permission = this.hasPermissionInModule(doc_permission.module, permissions)

                        if(has_permission)
                        {
                            const text = this.getShortDescriptionDocumentType(row)

                            allowed_document_types.push({
                                id: row.id,
                                text: text,
                                cssClass: 'text-align-center',
                                description: row.description,
                            })
                        }

                    }
                })

                return allowed_document_types
            },
            clickPayment()
            {
                const context = this
                const document_type = this.getDocumentType(this.form.document_type_id)

                if(!document_type) return this.showAlert('No ha seleccionado un tipo de documento, no puede continuar.')

                this.saveFormInStorage()
                this.redirectRoute(`/sale-payment-pos/${document_type.description}`)

                // this.showDialogConfirm({
                //     title: this.document_types.length === 0 ? 'NO TIENE PERMISOS ASIGNADOS' : 'TIPO DE COMPROBANTE',
                //     buttons: this.document_types,
                //     verticalButtons: true,
                //     onClick: function(dialog, index){
                //         context.clickOptionsButtons(dialog, index)
                //     },
                // })

            },
            // clickOptionsButtons(dialog, index){

            //     this.form.document_type_id = this.document_types[index].id
            //     this.saveFormInStorage()
            //     this.redirectRoute(`/sale-payment-pos/${this.document_types[index].text}`)

            // },
            saveFormInStorage()
            {
                this.setStorage('form_sale_detail', this.form, true)
            },
            clickDeleteItems(){

                this.removeStorage('list_items_sale')
                this.redirectRoute('/list-items-sale/')

            },
            async getTables() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/tables-sale-detail`, this.getHeaderConfig())
                            .then(response => {
                                this.document_types = this.getDocumentTypesToButtons(response.data.document_types)
                                this.affectation_igv_types = response.data.affectation_igv_types
                            })
                            .then(() => {
                                this.hideLoading()
                            })

            },
            initForm() 
            {
                this.form = {
                    prefix: 'NV',
                    series_id: null,
                    establishment_id: null,
                    date_of_issue: moment().format('YYYY-MM-DD'),
                    time_of_issue: moment().format('HH:mm:ss'),
                    date_of_due: moment().format('YYYY-MM-DD'),
                    customer_id: null,
                    currency_type_id: 'PEN',
                    document_type_id: null,
                    exchange_rate_sale: 1,
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
                    subtotal: 0,
                    total: 0,
                }

                this.setDefaultDocumentType()

            },
            setDefaultDocumentType()
            {
                this.form.document_type_id = this.document_types.length > 0 ? this.document_types[0].id : null
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
                    is_set: false,
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
                    this.calculateQuantityItem(index, result)
                }
            },
            changeQuantity(index)
            {
                const quantity = this.form.items[index].quantity

                if(quantity <= 0)
                {
                    this.showAlert('La cantidad debe ser mayor a 0.')
                }
                else
                {
                    this.calculateQuantityItem(index, quantity)
                }
            },
            calculateQuantityItem(index, quantity)
            {
                
                const item_sale = _.find(this.list_items_sale, {item_id : this.form.items[index].item_id})
                item_sale.quantity = quantity

                this.form.items[index] = this.calculateDataItem(item_sale)
                this.calculateTotal()
                this.updateQuantityItemsStorage(index)

            },
            updateQuantityItemsStorage(index)
            {
                const quantity = this.form.items[index].quantity

                const item_sale = _.find(this.list_items_sale, {item_id: this.form.items[index].item_id})
                
                item_sale.quantity = parseFloat(quantity)

                this.setStorage('list_items_sale', this.list_items_sale, true)
            },
        }
    }
</script>
