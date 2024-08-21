<template>
<f7-page :class="theme.class_bg_header" :color="theme.name_color_theme">

    <f7-block>
        <f7-row class="display-flex align-items-center">
            <f7-col width="20" :class="theme.class_menu_text_color">
                <a @click="closePopup" class="link" :class="theme.class_menu_text_color">
                    <i class="fas fa-angle-left custom-icon-back-form"></i>
                </a>
            </f7-col>
            <f7-col width="70" :class="theme.class_menu_text_color" class="custom-title-form">
                Listado de Productos
            </f7-col>
            <f7-col width="10">
                <a href="#" class="link navbar-tooltip" :class="theme.class_menu_text_color">
                    <i class="icon f7-icons if-not-md">info</i>
                    <i class="icon material-icons if-md">info_outline</i>
                </a>
            </f7-col>
        </f7-row>
    </f7-block>

    <f7-card class="card-100 no-padding no-shadow" :class="theme.class_bg_body" :color="theme.name_color_theme" style="min-height: 90%">
        <f7-card class="padding" no-shadow>
            <f7-row>
                <f7-col width="70" style="border: 1px solid #8e8e93;border-radius: 5px;">
                    <div class="searchbar searchbar-inline" style="margin:4%">
                        <div class="searchbar-input-wrap">
                            <input type="search" placeholder="Buscar" style="font-size:12px" v-model="search_item" @input="inputSearchItem"/>
                            <i class="searchbar-icon"></i>
                            <span class="input-clear-button"></span>
                        </div>
                    </div>
                </f7-col>
                <f7-col width="15" class="text-align-center">
                    <f7-button @click="clickSearchBarcode" :color="theme.name_color_theme" class="bg-secondary" fill small open-panel="right" icon="fas fa-camera"></f7-button>
                    <span class="" style="font-size: 10px;line-height: 10px !important;">BUSCAR</span>
                </f7-col>

                <f7-col width="15" class="text-align-center">
                    <f7-button @click="addForm = !addForm" :color="theme.name_color_theme" class="bg-secondary" fill small open-panel="right" icon="fas fa-plus"></f7-button>
                    <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                </f7-col>
            </f7-row>

            <f7-row class="no-padding-horizontal">
                <f7-col width="100">
                    <div class="c-horizontal-scroll mp-div-category padding-vertical" >
                        <template v-for="(category, index) in categories">
                            <!-- <span class="c-span-card" :key="index" @click="clickSearchByCategory(category.id)"><b>{{ getCategoryName(category) }}</b></span> -->
                            <span :key="index" style="display: table-cell; padding-right: 5px">
                                <f7-button :key="index" @click="clickSearchByCategory(category.id)" :color="theme.name_color_theme" fill medium :class="category.selected ? 'bg-secondary' : ''">
                                    {{ getCategoryName(category) }}
                                </f7-button>
                            </span>
                        </template>
                    </div>
                </f7-col>
            </f7-row>
        </f7-card>

        <f7-block style="padding-left: 8px;padding-right: 8px;">
            <div class="list inset ">
                <p v-if="items_car.length == 0">
                    No tienes productos agregados
                </p>

                <template v-if="configuration.show_image_item">

                    <div class="row" v-if="items_car.length > 0">

                        <div class="col-50" v-for="(item, index) in items_car" :key="index">
                            <div class="card no-margin-horizontal no-padding-horizontal" :class="item.quantity > 0 ? 'custom-border-selected-item bg-white-shade' : ''">

                                <div @click="add(index)">

                                    <div :style="'background-image:url('+item.item.image+')'" class="card-header align-items-flex-end image-max-width"></div>
                                    <div class="card-content card-content-padding">

                                        <div class="item-input-wrap">

                                            <!-- <div @click="add(index)" class="item-media" style="min-width: 0px !important;">
                                                <f7-icon :material="item.quantity > 0 ? 'check_box' : 'check_box_outline_blank'" class="text-color-bluemagenta"></f7-icon> -->
                                                <!-- <span>{{ item.quantity > 0 ? 'Agregado' : 'Agregar'}}</span> -->
                                            <!-- </div> -->

                                            <span class="text-align-center"><b>{{ item.full_description }}</b></span>
                                            <span class="">
                                                <div class="item-content no-padding-left">
                                                    <div class="item-media">{{ item.item.currency_type_symbol }}</div>
                                                    <input required validate v-model="item.item.sale_unit_price" type="number" />
                                                </div>
                                            </span>

                                            <template v-if="item.item.unit_type_id !== 'ZZ'">
                                                <span class="fs-14"><b>Stock: {{ item.item.stock }}</b></span>
                                            </template>

                                            <br>

                                        </div>
                                    </div>
                                </div>

                                <div class="card-footer display-flex justify-content-center">
                                    <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                        <div class="stepper-button-minus" @click="calculate(-1, index)"></div>
                                        <div class="stepper-input-wrap">
                                            <input type="number" v-model="item.quantity" min="0" step="1" />
                                        </div>
                                        <div @click="calculate(1, index)" class="stepper-button-plus"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
                <template v-else>
                    <ul>
                        <li v-for="(item, index) in items_car" :key="index" class="list-documents">
                            <div class="item-content padding-horizontal margin-vertical">
                                <div @click="add(index)" class="item-media" style="min-width: 0px !important;">
                                    <f7-icon :material="item.quantity > 0 ? 'check_box' : 'check_box_outline_blank'" :class="theme.name_color_theme"></f7-icon>
                                </div>
                                <div class="item-inner">
                                    <div class="item-title" :color="theme.name_color_theme" style="font-size: .9em">
                                        {{ item.full_description }}

                                        <div class="item-content">
                                            <div class="item-media">S/.</div>
                                            <input required validate v-model="item.item.sale_unit_price" type="number" />
                                        </div>
                                    </div>

                                    <div class="item-after" style="width: 101px;">

                                        <div class="stepper stepper-raised stepper-init stepper-small bg-color-white">
                                            <div class="stepper-button-minus" @click="calculate(-1, index)"></div>
                                            <div class="stepper-input-wrap">
                                                <input type="number" v-model="item.quantity" min="0" step="1" />
                                            </div>
                                            <div @click="calculate(1, index)" class="stepper-button-plus"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>

            </div>
        </f7-block>
    </f7-card>

    <f7-sheet class="demo-sheet default-h-modal" :opened="addForm" @sheet:closed="addForm = false">
        <f7-toolbar class="bg-white">
            <div class="left padding-horizontal">
                <div class="custom-title-form padding-left text-color-gray">
                    Nuevo Producto
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
                            <f7-row class="">
                                <f7-col width="75">
                                    <div class="item-inner" style="width:100% !important">
                                        <div class="item-title item-label">Código de barras</div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.barcode" type="text"/>
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="25" class="text-align-right padding-top">
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
                                            <input v-model="form.purchase_unit_price" step="any" type="number" />
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
                                            <input v-model="form.stock" step="any" type="number" />
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
                                            <input v-model="form.stock_min" step="any" type="number" />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </f7-col>
                        </f7-row>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Cargar imágen
                                </div>
                                <div class="item-input-wrap">
                                    <input class="button" type='file' id="input_image" @change="changeUploadImage">
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input" v-if="form.temp_path">
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <img :src="form.temp_path" style="max-width: 100%">
                                    </div>
                                </div>
                            </div>
                        </li>


                        <li class="item-content item-input">
                            <div class="item-inner">
                                <f7-button fill round :color="theme.name_color_theme" @click="submit" class="padding-horizontal bg-secondary">Guardar</f7-button>
                            </div>
                        </li>
                    </ul>
                </form>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

    <f7-sheet style="height:65%;" class="demo-sheet" :opened="sheetConfirm" @sheet:closed="sheetConfirm = false">
        <f7-page-content>
            <f7-block class="shadow text-align-right no-margin-vertical no-padding-vertical">
                <f7-link sheet-close class="no-padding text-color-red">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block :color="theme.name_color_theme">
                <div class="data-table margin-bottom">
                    <table>
                        <thead>
                            <tr>
                                <th class="numeric-only">#</th>
                                <th class="label-cell">Producto</th>
                                <th class="numeric-only">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in itemsCar" :key="index">
                                <td class="numeric-only">{{ index + 1 }}</td>
                                <td class="label-cell">{{ item.description }}</td>
                                <td class="numeric-only">{{ item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <f7-button :color="theme.name_color_theme" @click="send" small fill>
                    Confirmar
                </f7-button>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

    <f7-fab position="right-bottom" class="margin-right" :color="theme.name_color_theme" v-if="countCar > 0" @click="send">
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:shopping_cart" >
            <f7-badge class="bg-secondary" :color="theme.name_color_theme">
                {{ countCar }}
            </f7-badge>
        </f7-icon>
    </f7-fab>

</f7-page>
</template>

<style scoped>
    .page-content {
        padding-top: 2% !important;
    }

    .swiper-slide {
        background: red;
        /* text-align: center; */
        /* font-size: 18px; */
        /* line-height: 1px; */
        width: 20px !important;
        height: 20px !important;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        padding: 50px;
    }
</style>

<script>

    import {auth} from "mixins_/auth";
    import _ from "lodash";
    import {calculateRowItem} from "js_/helpers/functions";
    import {upload_image} from "mixins_/upload_image"
    import {general_functions, scanner} from "mixins_/general_functions"

    export default {
        mixins: [auth, upload_image, general_functions, scanner],
        name: "ItemsForm",
        components: {},
        props: ["showDialog"],

        data: function () {
            return {
                sheetConfirm: false,
                filteCart_b: false,
                search_item: "",
                items_car: [],
                items_car_base: [],
                addForm: false,
                items: [],
                affectation_igv_types: [],
                categories: [],
                form: {},
                configuration: {},
                search_category_id: null,
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
            };
        },
        computed: {
            countCar() {
                return _.filter(this.items_car, function (o) {
                    return o.quantity > 0;
                }).length;
            },

            itemsCar() {
                return _.filter(this.items_car, function (o) {
                    return o.quantity > 0;
                });
            }
        },
        mounted() {

            this.$f7.tooltip.create({
                targetEl: '.navbar-tooltip',
                text: 'El código interno es obligatorio para visualizar los productos'
            })

        },
        created() {
            this.loadConfiguration()
            this.getInitialSettings()
            this.initForm();
            this.getTables();
        },
        methods: {
            getCategoryName(category){
                return category.name.toUpperCase()
            },
            clearCategories(){
                this.form.category_id = null
            },
            clickSearchByCategory(category_id){
                console.log(category_id)
                this.categories.map(function(element) {
                    if(element.id == category_id) {
                        element.selected = true
                    } else {
                        element.selected = false
                    }
                })
                this.search_category_id = category_id
                this.searchItems()
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
            inputSearchItem(){

                if (this.search_item.length > 1)
                {
                    this.searchItems()
                }
                else if (this.search_item.length == 0)
                {
                    this.initItems()
                }

            },
            clickSearchBarcode(){

                const context = this

                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        if(result.text)
                        {
                            this.search_item = result.text
                            this.searchItems(1)
                        }
                    },
                    (error) => {
                        context.showAlert(`Error al escanear: ${error}`)
                    },
                    context.scanner_configuration
                )

            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            blurQuantity(index, quantity) {
                // console.log(quantity)
                // // this.calculate(quantity, index)
                // console.log(this.items_car[index])
                // this.add(index, quantity)
            },
            cancel() {
                this.items_car.forEach(element => (element.quantity = 0));
            },
            closePopup() {
                this.$emit("update:showDialog", false);
            },
            initForm() {
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
                };

                this.cleanInputImage()

            },
            submit() {

                const self = this;
                self.$f7.preloader.show();
                this.$http
                    .post(`${this.returnBaseUrl()}/item`, this.form, this.getHeaderConfig())
                    .then(response => {

                        self.$f7.dialog.alert(`${response.data.msg}`, "Mensaje");

                        if (response.data.success) {

                            this.initForm()
                            this.initFormItem()
                            let it = response.data.data;
                            this.addForm = false;
                            self.items_car.push({
                                full_description: it.full_description,
                                description: it.description,
                                id: it.id,
                                quantity: 0,
                                sale_unit_price: it.sale_unit_price,
                                item: it
                            });

                            this.search_item =  it.internal_id
                            this.searchItems()
                        }

                    })
                    .catch(error => {

                        // console.log( error.response.data.message)
                        if (error.response.status === 422) {
                            let errors = error.response.data.message

                            let validator = this.validationErros(errors)
                            if (!validator.success) {
                                self.$f7.dialog.alert(`Validaciones: <br>${validator.message}`, "Mensaje");
                            }

                        } else {
                            console.log(error)
                            alert("Sucedio un error al guardar.");
                        }
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
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
            delete_parent(id) {
                let o = this.items_car.find(x => x.id == id);
                o.quantity = 0;
                this.send();
            },
            initFormItem() {
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
                };
            },
            send() {
                const self = this;
                self.sheetConfirm = false;
                let send_items = this.items_car
                    .filter(x => x.quantity > 0 && x.item.sale_unit_price > 0)
                    .map(o => {

                        let obj = self.initFormItem();

                        obj.quantity = o.quantity;
                        (obj.item = o.item), //_.find(self.items, { id: o.id });
                        (obj.unit_price_value = obj.item.sale_unit_price);
                        obj.has_igv = obj.item.has_igv;
                        obj.affectation_igv_type_id = obj.item.sale_affectation_igv_type_id;

                        let unit_price = obj.has_igv ? obj.unit_price_value : obj.unit_price_value * 1.18;

                        if(this.configuration.has_igv_31556) {
                            unit_price = obj.has_igv ? obj.unit_price_value : obj.unit_price_value * (1 + this.configuration.igv_31556_percentage)
                        }
                        obj.igv_31556_percentage = this.configuration.has_igv_31556 ? (this.configuration.igv_31556_percentage * 100) : 18

                        obj.unit_price = unit_price;
                        obj.item.unit_price = unit_price;
                        obj.item.presentation = null;

                        obj.charges = [];
                        obj.discounts = [];
                        obj.attributes = [];
                        obj.affectation_igv_type = _.find(this.affectation_igv_types, {
                            id: obj.affectation_igv_type_id
                        });

                        obj.input_description = o.item.description;

                        let row = calculateRowItem(obj, "PEN", 1);

                        return row;
                    });

                this.$emit("addItemsCar", send_items);

                this.initItems();
            },
            add(index, quantity = 1) {
                if (this.items_car[index].quantity > 0) {
                    this.items_car[index].quantity = 0;
                } else {
                    this.items_car[index].quantity = quantity;
                    // this.items_car[index].quantity = 1;
                }
            },
            calculate(value, index) {
                let q = parseFloat(this.items_car[index].quantity);
                let resul = (q += parseFloat(value));
                this.items_car[index].quantity = resul < 0 ? 0 : resul;
            },

            initItems() {
                this.search_item = "";
                let datos = this.items_car_base.map(x => {
                    return {
                        full_description: x.full_description,
                        description: x.description,
                        id: x.id,
                        quantity: 0,
                        sale_unit_price: x.sale_unit_price,
                        item: x
                    };
                });
                this.items_car = datos;
            },
            getTables() {
                const self = this;
                self.$f7.preloader.show();
                this.$http
                    .get(`${this.returnBaseUrl()}/document/tables`, this.getHeaderConfig())
                    .then(response => {
                        let source = response.data.data;
                        self.items_car_base = source.items;
                        self.affectation_igv_types = source.affectation_types;
                        self.categories = source.categories;

                        self.initItems();
                    })
                    .catch(err => {})
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            },

            async searchItems(search_by_barcode = 0) {

                if (this.search_item.length > 1 || this.search_category_id)
                {
                    const self = this;
                    self.$f7.preloader.show()

                    let parameters = `input=${this.search_item}&search_by_barcode=${search_by_barcode}`
                    if(this.search_category_id) parameters += `&category_id=${this.search_category_id}`

                    await this.$http.get(`${this.returnBaseUrl()}/document/search-items?${parameters}`, this.getHeaderConfig())
                                .then(response => {
                                    this.items_car = this.getItemsCar(response.data.data.items)
                                    this.setItemSearchBarcode(search_by_barcode)
                                    this.search_category_id = null
                                })
                                .catch(err => {
                                    alert("Error");
                                })
                                .then(() => {
                                    self.$f7.preloader.hide();
                                })
                }
            },
            setItemSearchBarcode(search_by_barcode){

                if(this.items_car.length == 1 && search_by_barcode)
                {
                    this.calculate(1, 0)
                }

            },
            getItemsCar(items){

                return items.map(x => {
                    return {
                        full_description: x.full_description,
                        description: x.description,
                        id: x.id,
                        quantity: 0,
                        sale_unit_price: x.sale_unit_price,
                        item: x
                    }
                })

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    };
</script>
