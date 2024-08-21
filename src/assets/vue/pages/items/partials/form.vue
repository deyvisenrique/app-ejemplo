<template>
    <f7-sheet class="demo-sheet default-h-modal" :opened="showDialog" @sheet:closed="close">
        <f7-toolbar class="bg-white">
            <div class="left padding-horizontal">
                <div class="custom-title-form padding-left text-color-gray">
                    <span v-if="recordId">Editar</span>
                    <span v-else>Nuevo</span>
                    Producto
                </div>
            </div>
            <div class="right padding-horizontal">
                <f7-link small sheet-close class="no-margin no-padding text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </div>
        </f7-toolbar>
        <f7-page-content>
            <f7-block style="margin-top: 0px !important;" :color="theme.name_color_theme">
                <form class="list no-hairlines-md" id="demo-form-item">
                    <ul>
                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Código interno</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.internal_id" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content item-input">
                            <f7-row class="full-width-95">
                                <f7-col width="90">
                                    <div class="item-inner" style="width:100% !important">
                                        <div class="item-title item-label">Código de barras</div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.barcode" type="text"/>
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="10" class="text-align-center padding-top">
                                    <f7-button @click="clickGetBarcode" color="deeppurple" fill open-panel="right" icon="fas fa-camera"></f7-button>
                                </f7-col>
                            </f7-row>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Nombre</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.description" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Descripción</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.name" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <f7-row>
                            <f7-col width="70">
                                <li class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">
                                            Precio Unitario (Venta) *
                                        </div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.sale_unit_price" required validate step="any" type="number" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                            <f7-col width="30">
                                <li class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">
                                            Incluye IGV
                                        </div>
                                        <div class="item-input-wrap">
                                            <label class="toggle toggle-init">
                                                <input type="checkbox" v-model="form.has_igv" />
                                                <span class="toggle-icon"></span>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                        </f7-row>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Categoría
                                </div>
                                <div class="item-input-wrap">
                                    <select v-model="form.category_id">
                                        <option v-for="(option, index) in categories" :value="option.id" :key="index">{{ option.name }}</option>
                                    </select>
                                    <button class="input-clear-button" @click.prevent="clearCategories"></button>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Afectación
                                </div>
                                <div class="item-input-wrap">
                                    <select v-model="form.sale_affectation_igv_type_id">
                                        <option v-for="(option, index) in affectation_igv_types" :value="option.id" :key="index">{{ option.description }}</option>
                                    </select>
                                    <button class="input-clear-button" @click.prevent="clearCategories"></button>
                                </div>
                            </div>
                        </li>

                        <f7-row>
                            <f7-col width="100">
                                <li class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">
                                            Precio Unitario de Compra
                                        </div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.purchase_unit_price" validate step="any" type="number" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                            <f7-col width="50">
                                <li class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">
                                            Stock
                                        </div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.stock" validate step="any" type="number" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                            <f7-col width="50">

                                <li class="item-content item-input">
                                    <div class="item-inner">
                                        <div class="item-title item-label">
                                            Stock mínimo
                                        </div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.stock_min" validate step="any" type="number" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                        </f7-row>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Cargar imagen
                                </div>
                                <div class="item-input-wrap">
                                    <input class="button" type='file' id="input_image" @change="changeUploadImage">
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input" v-if="form.image_url">
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <img :src="form.image_url" style="max-width: 100%">
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <f7-button fill round :color="theme.name_color_theme" class="bg-secondary padding-horizontal" @click="submit">Guardar</f7-button>
                            </div>
                        </li>
                    </ul>
                </form>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

</template>

<script>

    import {auth} from "mixins_/auth"
    import {upload_image} from "mixins_/upload_image"
    import {general_functions} from "mixins_/general_functions"
    import {common} from "../mixins/common"

    export default {
        props: ['showDialog', 'recordId', 'alternativeName'],
        mixins: [auth, upload_image, general_functions, common],
        data: function () {
            return {
                resource: 'items',
                records: [],
                form: {},
                theme: {},
                affectation_igv_types: [
                    {id:'10', description: 'Gravado - Operación Onerosa'},
                    {id:'11', description: 'Gravado – Retiro por premio'},
                    {id:'12', description: 'Gravado – Retiro por donación'},
                    {id:'13', description: 'Gravado – Retiro'},
                    {id:'14', description: 'Gravado – Retiro por publicidad'},
                    {id:'15', description: 'Gravado – Bonificaciones'},
                    {id:'16', description: 'Gravado – Retiro por entrega a trabajadores'},
                    {id:'17', description: 'Gravado – IVAP'},
                    {id:'20', description: 'Exonerado - Operación Onerosa'},
                    {id:'21', description: 'Exonerado – Transferencia Gratuita'},
                    {id:'30', description: 'Inafecto - Operación Onerosa'},
                    {id:'31', description: 'Inafecto – Retiro por Bonificación'},
                    {id:'32', description: 'Inafecto – Retiro'},
                    {id:'33', description: 'Inafecto – Retiro por Muestras Médicas'},
                    {id:'34', description: 'Inafecto - Retiro por Convenio Colectivo'},
                    {id:'35', description: 'Inafecto – Retiro por premio'},
                    {id:'36', description: 'Inafecto - Retiro por publicidad'},
                    {id:'37', description: 'Inafecto - Transferencia gratuita'},
                    {id:'40', description: 'Exportación de bienes o servicios'}
                ],
            }
        },
        computed: {
        },
        watch: {
            showDialog(newValue)
            {
                if(newValue)
                {
                    this.open()
                }
            }
        },
        async created() {
            await this.initForm()
            await this.getInitialSettings()
            await this.getTables()
        },
        methods: {
            clearCategories(){
                this.form.category_id = null
            },
            clickGetBarcode(){

                const context = this
                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        if(result.text) this.form.barcode = result.text
                    },
                    (error) => context.showAlert(`Error al escanear: ${error}`),
                    context.scanner_configuration
                )

            },
            open(){
                this.getRecord()
            },
            async getRecord(){

                if(this.recordId)
                {

                    this.showLoading()

                    await this.$http.get(`${this.returnBaseUrl()}/items/record/${this.recordId}`, this.getHeaderConfig())
                            .then(response => {

                                this.form = response.data.data

                            })
                            .catch(error => {
                                console.log(error)
                            })
                            .then(()=>{
                                this.hideLoading()
                            })

                } else {
                    this.form.name = this.alternativeName
                    this.form.description = this.alternativeName
                }

            },
            initForm(){

                this.form = {
                    id: null,
                    item_type_id: "01",
                    internal_id: null,
                    item_code: null,
                    item_code_gs1: null,
                    description: null,
                    name: null,
                    second_name: null,
                    unit_type_id: "NIU",
                    currency_type_id: "PEN",
                    sale_unit_price: 0,
                    purchase_unit_price: 0,
                    has_isc: false,
                    system_isc_type_id: null,
                    percentage_isc: 0,
                    suggested_price: 0,
                    sale_affectation_igv_type_id: "10",
                    purchase_affectation_igv_type_id: "10",
                    calculate_quantity: false,
                    stock: 0,
                    stock_min: 1,
                    has_igv: true,
                    has_perception: false,
                    item_unit_types: [],
                    percentage_of_profit: 0,
                    percentage_perception: 0,
                    image_url: null,
                    is_set: false,
                    account_id: null,
                    category_id: null,
                    brand_id: null,
                    date_of_due: null,
                    lot_code: null,
                    lots_enabled: false,
                    lots: [],
                    image: null,
                    temp_path: null,
                    barcode: null,
                }

                this.cleanInputImage()
            },
            itemValidations(){

                if(this.recordId)
                {
                    if(!this.form.internal_id) return this.generalResponse(false, 'El campo código interno es obligatorio.')
                }

                return this.generalResponse()
            },
            submit(){

                const item_validations = this.itemValidations()
                if(!item_validations.success) return this.showAlert(item_validations.message)

                this.$f7.preloader.show()

                const resource = (this.recordId) ? 'items/update' : 'item'
                this.$http.post(`${this.returnBaseUrl()}/${resource}`, this.form, this.getHeaderConfig())
                    .then(response => {

                        this.showAlert(`${response.data.msg ? response.data.msg : response.data.message}`)

                        if (response.data.success)
                        {
                            this.$eventHub.$emit('reloadData')
                            this.close()
                        }

                    })
                    .catch(error => {

                        if (error.response.status === 422)
                        {
                            const errors = error.response.data.message
                            let validator = this.validationErros(errors)

                            if (!validator.success) {
                                this.showAlert(`Validaciones: <br>${validator.message}`)
                            }

                        }
                        else
                        {
                            console.log(error)
                            alert(`Ocurrió un error al guardar: ${error}`)
                        }

                    })
                    .then(() => {
                        this.$f7.preloader.hide()
                    })

            },

            validationErros(errors) {

                let message = ''
                let error = {
                    success: true
                }

                if (errors.internal_id) {
                    message += `${errors.internal_id[0]} <br>`
                }

                if (errors.description) {
                    message += `${errors.description[0]} <br>`
                }

                if (errors.sale_unit_price) {
                    message += `${errors.sale_unit_price[0]} <br>`
                }

                if (message != '') {
                    error = {
                        success: false,
                        message: message
                    }
                }

                return error

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
