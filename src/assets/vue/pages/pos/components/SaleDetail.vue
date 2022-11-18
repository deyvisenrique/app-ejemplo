<template>

    <div>

        <template v-if="landscapeMode">
            <div class="data-table margin-bottom" style="margin-top: var(--f7-card-margin-vertical);">
                <table class="table-items">
                    <thead>
                        <tr>
                            <th class="numeric-only no-padding-left">#</th>
                            <th class="label-cell no-padding-left">
                                Producto
                                <span class="padding margin"></span>
                                <span class="padding"></span>
                            </th>
                            <th class="label-cell no-padding-left">P. Unitario</th>
                            <th class="numeric-only text-align-left no-padding-left">Cantidad</th>
                            <th class="numeric-only no-padding-left">M. Descuento</th>
                            <th class="numeric-only no-padding-left">Total</th>
                            <th class="numeric-only no-padding"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="form.items.length === 0">
                            <tr>
                                <td colspan="6" class="padding margin"><strong>No tiene productos agregados</strong></td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="(row, index) in form.items" :key="index">
                                <td class="numeric-only no-padding-left">{{ index + 1 }}</td>
                                <td class="label-cell no-padding-left">{{ row.item.description }}</td>
                                <td class="numeric-only no-padding-left">

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-input-wrap">
                                            <input class="input-amount-table" required validate v-model="row.unit_price" type="number"  @change="changeUnitPrice(index)" />
                                        </div>
                                    </div>

                                    <!-- <input class="input-quantity-table" required validate v-model="row.unit_price" type="number"  @change="changeUnitPrice(index)" /> -->
                                </td>
                                <td class="numeric-only padding text-align-center no-padding-left">

                                    <!--
                                    @todo Genera problemas en la propiedad quantity (no se actualiza)
                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-button-minus" @click="calculateQuantity(-1, index)"></div>
                                        <div class="stepper-input-wrap">
                                            <input type="number" v-model="row.quantity" min="0" step="1" @change="changeQuantity(index)" />
                                        </div>
                                        <div class="stepper-button-plus" @click="calculateQuantity(1, index)"></div>
                                    </div> -->
                                    <!-- {{ row.quantity }} -->

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-input-wrap">
                                            <input class="input-amount-table" required validate v-model="row.quantity" type="number"  @change="changeQuantity(index)" />
                                        </div>
                                    </div>

                                    <!-- <input class="input-quantity-table" required validate v-model="row.quantity" type="number"  @change="changeQuantity(index)" /> -->

                                </td>
                                <td class="numeric-only no-padding-left">

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-input-wrap">
                                            <input class="input-amount-table" required validate v-model="row.input_discount" type="number"  @change="changeInputDiscount(index)" />
                                        </div>
                                    </div>

                                    <!-- <input class="input-quantity-table" required validate v-model="row.input_discount" type="number"  @change="changeInputDiscount(index)" /> -->
                                </td>
                                <td class="numeric-only no-padding-left">{{ row.total }}</td>
                                <td class="no-padding">
                                    <a @click="clickDelete(index)">
                                        <f7-icon ios="f7:delete" color="red" aurora="f7:delete" md="material:delete" ></f7-icon>
                                    </a>
                                </td>
                            </tr>
                        </template>

                    </tbody>
                </table>
            </div>
        </template>
        <template v-else>

            <header-layout :title="geTitle" hrefBack="/list-items-sale/" :overwriteBackRoute="true"></header-layout>

            <f7-block>

                <!-- se mostrara cuando carga los tipos de documentos, y envia como prop all_document_types para no realizar otra consulta en el componente -->
                <template v-if="all_document_types.length > 0">
                    <document-type
                        :all-document-types="all_document_types"
                        @changeDocumentType="clickChangeDocumentType"
                        >
                    </document-type>
                </template>

                <div class="data-table margin-bottom padding-top">
                    <table>
                        <thead>
                            <tr>
                                <th class="numeric-only no-padding-left">#</th>
                                <th class="label-cell no-padding-left">
                                    Producto
                                    <span class="padding margin"></span>
                                    <span class="padding"></span>
                                </th>
                                <th class="label-cell no-padding-left">P. Unitario</th>
                                <th class="numeric-only text-align-left no-padding-left">Cantidad</th>
                                <th class="numeric-only no-padding-left">M. Descuento</th>
                                <th class="numeric-only no-padding-left">Total</th>
                                <th class="numeric-only no-padding"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in form.items" :key="index">
                                <td class="xsmall-only no-padding-left">{{ index + 1 }}</td>
                                <td class="label-cell no-padding-left">{{ row.item.description }}</td>
                                <td class="numeric-only no-padding-left">

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-input-wrap">
                                            <input class="input-amount-table" required validate v-model="row.unit_price" type="number"  @change="changeUnitPrice(index)" />
                                        </div>
                                    </div>
                                    <!-- <input class="input-quantity-table" required validate v-model="row.unit_price" type="number"  @change="changeUnitPrice(index)" /> -->

                                </td>
                                <td class="numeric-only no-padding-left">

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width mt-5">
                                        <div class="stepper-button-minus" @click="calculateQuantity(-1, index)"></div>
                                        <div class="stepper-input-wrap">
                                            <input type="number" v-model="row.quantity" min="0" step="1" @change="changeQuantity(index)" />
                                        </div>
                                        <div class="stepper-button-plus" @click="calculateQuantity(1, index)"></div>
                                    </div>

                                </td>
                                <td class="numeric-only no-padding-left">

                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-input-wrap">
                                            <input class="input-amount-table" required validate v-model="row.input_discount" type="number"  @change="changeInputDiscount(index)" />
                                        </div>
                                    </div>

                                    <!-- <input class="input-quantity-table" required validate v-model="row.input_discount" type="number"  @change="changeInputDiscount(index)" /> -->
                                </td>
                                <td class="numeric-only no-padding-left">{{ row.total }}</td>
                                <td class="no-padding">
                                    <a @click="clickDelete(index)">
                                        <f7-icon ios="f7:delete" color="red" aurora="f7:delete" md="material:delete" ></f7-icon>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <document-totals
                    :currency-type-symbol="currency_type.symbol"
                    :form="form">
                </document-totals>

            </f7-block>

            <f7-fab position="left-bottom" class="margin-right" color="red" @click="clickDeleteItems">
                <f7-icon ios="f7:delete" aurora="f7:delete" md="material:delete"></f7-icon>
            </f7-fab>

            <f7-fab position="right-bottom" class="margin-right" color="bluemagenta" @click="clickPayment">
                <f7-icon ios="f7:arrow_forward" aurora="f7:arrow_forward" md="material:arrow_forward"></f7-icon>
            </f7-fab>

        </template>

    </div>

</template>
<script>

    import moment from 'moment'
    import _ from 'lodash'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import {calculateRowItem} from "js_/helpers/functions"

    import DocumentTotals from './partials/DocumentTotals.vue'
    import DocumentType from './partials/DocumentType.vue'

    export default {
        props: {
            landscapeMode: {
                type: Boolean,
                required: false,
                default: false
            },
        },
        name: 'SaleDetailPos',
        components: {
            HeaderLayout,
            DocumentTotals,
            DocumentType
        },
        mixins: [
            auth,
            general_functions,
            operations
        ],
        data: function () {
            return {
                affectation_igv_types: [],
                all_document_types: [],
                form:{
                    total: 0,
                    items: []
                },
                currency_type: {
                    symbol: 'S/'
                },
                list_items_sale: [],
                resource: 'documents',
                item_discount_types: [],
                configuration: {},
            }
        },
        computed: {
            geTitle(){
                return `Total ${this.currency_type.symbol} ${this.form.total}`
            }
        },
        async created()
        {
            await this.loadConfiguration()
            await this.initForm()
            await this.getTables()
            await this.initData()
            await this.initFormLandscapeMode()
            await this.inputEventsSaleDetail()
        },
        async mounted()
        {
        },
        methods: {
            clickChangeDocumentType(document_type_id)
            {
                this.form.document_type_id = document_type_id
            },
            inputEventsSaleDetail()
            {
                //Modo Landscape - evento para actualizar items en SaleDetail al agregar/modificar en este listado de productos
                this.$eventHub.$on('eventSelectedItem', () => {
                    this.initData(true)
                })

            },
            async initFormLandscapeMode()
            {
                if(this.landscapeMode)
                {
                    await this.saveFormInStorage()
                    this.$emit('mountedSaleDetailPos')
                }
            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            getDocumentType(id)
            {
                return _.find(this.all_document_types, {id:id})
            },
            validateData()
            {
                if(this.form.items.length === 0) return this.generalResponse(false, 'Debe agregar productos.')

                let items_price_zero = 0
                let items_quantity_zero = 0
                let items_total_zero = 0

                this.form.items.forEach(row => {

                    if(!row.unit_price || isNaN(row.unit_price) || parseFloat(row.unit_price) <= 0) items_price_zero++
                    if(!row.quantity || isNaN(row.quantity) || parseFloat(row.quantity) <= 0) items_quantity_zero++
                    if(parseFloat(row.total) <= 0) items_total_zero++

                })

                if(items_price_zero > 0) return this.generalResponse(false, 'El precio unitario de venta de los productos debe ser mayor a 0, no puede continuar.')

                if(items_quantity_zero > 0) return this.generalResponse(false, 'La cantidad vendida de los productos debe ser mayor a 0, no puede continuar.')

                if(items_total_zero > 0) return this.generalResponse(false, 'El total por línea debe ser mayor a 0, no puede continuar.')

                return this.generalResponse()
            },
            clickPayment()
            {
                // validaciones
                const validate_data = this.validateData()
                if(!validate_data.success) return this.showAlert(validate_data.message)
                // validaciones

                const context = this
                const document_type = this.getDocumentType(this.form.document_type_id)

                if(!document_type) return this.showAlert('No ha seleccionado un tipo de documento, no puede continuar.')

                this.saveFormInStorage()
                this.redirectRoute(`/sale-payment-pos/${document_type.description}`)

            },
            changeInputDiscount(index)
            {
                let input_discount = parseFloat(this.form.items[index].input_discount)

                if(input_discount < 0)
                {
                    input_discount = 0
                    this.showAlert('El monto de descuento debe ser mayor a 0.')
                }

                // inicializar variables descuento
                const item_sale = this.findItemInListSale(this.form.items[index].item_id)
                item_sale.discounts = []
                item_sale.input_discount = input_discount

                // agregar descuento
                if(input_discount > 0)
                {
                    const discount_type_id = '00'
                    const discount_type = _.find(this.item_discount_types, { id : discount_type_id})

                    if(!discount_type) this.showAlert('No se ubicó el tipo de descuento, verifique que el servicio en el facturador se encuentre disponible.')

                    item_sale.discounts.push({
                        discount_type_id: discount_type_id,
                        discount_type: discount_type,
                        description: discount_type.description,
                        percentage: input_discount,
                        factor: 0,
                        amount: 0,
                        base: 0,
                        is_amount: true
                    })
                }

                // procesar descuento o inicializar valores
                this.form.items[index] = this.calculateDataItem(item_sale)
                this.calculateTotal()
                this.saveListItemsSale()

            },
            saveFormInStorage()
            {
                this.setStorage('form_sale_detail', this.form, true)
            },
            clickDeleteItems(){

                this.removeStorage('list_items_sale')
                this.redirectRoute('/list-items-sale/')

            },
            clickDelete(index)
            {
                // se elimina item del listado de ventas, registra en storage
                _.remove(this.list_items_sale, {item_id : this.form.items[index].item_id})

                // se elimina item del form para facturacion
                this.form.items.splice(index, 1)
                this.calculateTotal()
                this.saveListItemsSale()

            },
            async getTables() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/tables-sale-detail`, this.getHeaderConfig())
                            .then(response => {
                                this.all_document_types = response.data.document_types
                                this.affectation_igv_types = response.data.affectation_igv_types
                                this.item_discount_types = response.data.item_discount_types
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
                    total_discount: 0,
                    total: 0,
                    payments: [],
                }

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
                    input_discount: 0,
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
                // console.log("form_item.item.sale_unit_price", form_item.item.sale_unit_price)

                form_item.quantity = row.quantity
                form_item.unit_price_value = form_item.item.sale_unit_price

                form_item.has_igv = form_item.item.has_igv
                form_item.affectation_igv_type_id = form_item.item.sale_affectation_igv_type_id

                // console.log(this.configuration)
                form_item.igv_31556_percentage = this.configuration.has_igv_31556 ? (this.configuration.igv_31556_percentage * 100) : 18

                const unit_price = this.roundNumber((form_item.has_igv ? form_item.unit_price_value : (form_item.unit_price_value * (1 + form_item.igv_31556_percentage))), 6)

                form_item.unit_price = unit_price
                form_item.item.unit_price = unit_price
                // console.log("unit_price", unit_price)


                form_item.affectation_igv_type = _.find(this.affectation_igv_types, {
                    id: form_item.affectation_igv_type_id
                })

                form_item.input_description = row.description

                // data descuentos
                if(row.discounts)
                {
                    // se maneja solo 1 dscto por item
                    if(row.discounts.length === 1)
                    {
                        form_item.discounts = row.discounts
                        form_item.input_discount = row.input_discount

                        //se asigna monto de descuento al campo "percentage", ya que este se usa para calculos en functions
                        form_item.discounts[0].percentage = row.input_discount
                    }
                }
                // data descuentos

                return calculateRowItem(form_item, 'PEN', 1)

            },
            async initData(from_event = false)
            {
                this.list_items_sale = this.getStorage('list_items_sale', true)

                if(this.list_items_sale)
                {
                    this.form.items = await this.getTransformDataItem(this.list_items_sale)

                    this.calculateTotal()

                    // evento a Payment para actualizar form con datos de calculos, se dispara cuando modifican productos en el listado
                    if(from_event)
                    {
                        this.emitEventFormSale()
                    }
                }

            },
            calculateTotal()
            {
                this.generalCalculateTotal() //definido en mixin operations
            },
            findItemInListSale(item_id)
            {
                return _.find(this.list_items_sale, {item_id : item_id})
            },
            changeUnitPrice(index)
            {
                const unit_price = parseFloat(this.form.items[index].unit_price)

                if(unit_price <= 0)
                {
                    return this.showAlert('El precio unitario debe ser mayor a 0.')
                }

                const item_sale = this.findItemInListSale(this.form.items[index].item_id)
                item_sale.sale_unit_price = unit_price

                this.form.items[index] = this.calculateDataItem(item_sale)
                this.calculateTotal()
                this.saveListItemsSale()

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

                const item_sale = this.findItemInListSale(this.form.items[index].item_id)
                item_sale.quantity = quantity

                this.form.items[index] = this.calculateDataItem(item_sale)
                this.calculateTotal()
                this.updateQuantityItemsStorage(index)

            },
            updateQuantityItemsStorage(index)
            {
                const quantity = this.form.items[index].quantity

                const item_sale = this.findItemInListSale(this.form.items[index].item_id)

                item_sale.quantity = parseFloat(quantity)

                this.saveListItemsSale()

            },
            saveListItemsSale()
            {
                this.setStorage('list_items_sale', this.list_items_sale, true)

                if(this.landscapeMode)
                {
                    // evento para actualizar datos en listado
                    this.$emit('updateDataInListItem')
                    this.emitEventFormSale()
                }
            },
            emitEventFormSale()
            {
                // evento para actualizar datos en el componente Payment
                this.$eventHub.$emit('eventUpdateDataFormSale', this.form)
            }
        }
    }
</script>
