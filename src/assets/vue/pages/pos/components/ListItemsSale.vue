<template>
    <f7-page infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh" :color="theme.name_color_theme" :class="theme.class_bg_body">

        <header-layout :title="header_title" :showButtonBack="false"></header-layout>

        <f7-card class="card-100 padding-top no-shadow" :color="theme.name_color_theme" style="min-height: 90%">
            <f7-block class="">
                <f7-row>
                    <f7-col width="70" style="border: 1px solid #8e8e93;border-radius: 5px;">
                        <div class="searchbar searchbar-inline" style="margin:8px">
                            <div class="searchbar-input-wrap">
                                <input type="search" placeholder="Buscar" style="font-size:16px;height: 19px;" v-model="form_search.input" @input="searchRecords"/>
                                <i class="searchbar-icon"></i>
                                <button  class="input-clear-button" @click="clickClearInput"></button>
                            </div>
                        </div>
                    </f7-col>
                    <f7-col width="10" class="text-align-center">
                        <f7-button @click="clickSearchBarcode" :color="theme.name_color_theme" fill  open-panel="right" icon="fas fa-camera" class="bg-secondary"></f7-button>
                    </f7-col>
                    <f7-col width="10" class="text-align-center">
                        <f7-button @click="clickCreate()" :color="theme.name_color_theme" fill  open-panel="right" icon="fas fa-plus" class="bg-secondary"></f7-button>
                    </f7-col>
                    <f7-col width="10" class="text-align-center">
                        <f7-button
                            @click="card_mode = !card_mode"
                            :color="theme.name_color_theme"
                            fill
                            :icon="iconGrid()"
                            open-panel="right"
                            class="bg-primary">
                        </f7-button>
                    </f7-col>
                </f7-row>
            </f7-block>

            <f7-row class="padding-horizontal">
                <f7-col width="100">
                    <div class="c-horizontal-scroll mp-div-category margin-bottom">
                        <span v-for="(category, index) in categories" :key="index" style="display: table-cell; padding-right: 5px">
                            <f7-button :key="index" @click="clickSearchByCategory(index, category.id)" :color="theme.name_color_theme" fill medium :class="category.selected ? 'bg-secondary' : ''">
                                {{ getCategoryName(category) }}
                            </f7-button>
                        </span>
                    </div>
                </f7-col>
            </f7-row>

            <f7-block>
                <div class="list inset">
                    <template v-if="!card_mode">
                        <div class="item-content"
                            v-for="(row, index) in records"
                            :key="index"
                            @click="selected(index)"
                            :class="isSelectedRecord(index) ? 'custom-border-selected-item bg-white-shade' : ''">
                            <div class="item-media">
                                <div :style="parserUrl(row.image_url)" style="width: 30px;height: 30px;background-size: cover;"></div>
                            </div>
                            <div class="item-inner">
                                <div class="item-title">
                                    <div class="item-header" v-if="row.unit_type_id !== 'ZZ'">Stock:{{row.stock}}</div>
                                    {{ row.full_description }}
                                </div>
                                <div class="item-after">{{row.currency_type_symbol+' '+row.sale_unit_price}}</div>
                            </div>
                        </div>
                        <template v-if="form_search.input && records.length == 0">
                            <f7-button @click="clickCreate()" :color="theme.name_color_theme" fill small open-panel="right" icon="fas fa-plus" class="bg-secondary"> Agregar Producto: {{ form_search.input }}</f7-button>
                        </template>
                    </template>
                    <template v-else>
                        <div class="row">
                            <template v-if="records.length > 0">
                                <div class="col-50" v-for="(row, index) in records" :key="index">

                                    <div class="card no-margin-horizontal no-padding-horizontal" :class="isSelectedRecord(index) ? 'custom-border-selected-item bg-white-shade' : ''">

                                        <div @click="selected(index)">

                                            <div :style="parserUrl(row.image_url)" class="card-header align-items-flex-end image-max-width"></div>

                                            <div class="card-content card-content-padding">
                                                <div class="item-input-wrap">
                                                    <span class="item-description">{{row.full_description}}</span>

                                                    <span class="">
                                                        <div class="">
                                                            <div class="float-left"><b>{{ row.currency_type_symbol }} {{row.sale_unit_price}}</b></div>
                                                            <template v-if="row.unit_type_id !== 'ZZ'">
                                                                <div class="float-right stock-item" 
                                                                :class="{ 'stock-negative': row.stock < 0 }"><i class="fas fa-box"></i> {{row.stock}}</div><br>
                                                            </template>
                                                            <!-- <input required validate v-model="row.sale_unit_price" type="number" /> -->
                                                        </div>
                                                    </span>
                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card-footer display-flex justify-content-center">
                                            <div class="stepper stepper-small stepper-raised stepper-init full-max-width">
                                                <div class="stepper-button-minus" @click="calculateQuantity(-1, index)"></div>
                                                <div class="stepper-input-wrap">
                                                    <input type="number" v-model="row.quantity" min="0" step="1" />
                                                </div>
                                                <div class="stepper-button-plus" @click="calculateQuantity(1, index)"></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="col-100">
                                    <h3 class="text-align-center">
                                        {{ loading_text }}
                                    </h3>
                                </div>
                            </template>
                            <template v-if="form_search.favorite == 1">
                                <div class="col-50">
                                    <div class="card no-margin-horizontal no-padding-horizontal">
                                        <div class="card-content card-content-padding">
                                            <div class="item-input-wrap text-align-center">
                                                <span class=""><b>Como añadir productos Favoritos?</b></span>
                                                <p>
                                                    ve al listado <br> haz click al <br>
                                                    <span class="material-icons text-color-purple">favorite_border</span>
                                                </p>
                                                <f7-button :color="theme.name_color_theme" fill medium class="bg-secondary" @click.native="goItems()">
                                                Ir al listado
                                                </f7-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </f7-block>
        </f7-card>

        <f7-fab position="right-bottom" class="margin-right" :color="theme.name_color_theme" v-if="quantitySelectedRecords() > 0" @click="sendListItems">
            <f7-icon ios="f7:shopping_cart" aurora="f7:shopping_cart" md="material:shopping_cart" >
                <f7-badge class="bg-secondary" :color="theme.name_color_theme">
                    {{ quantitySelectedRecords() }}
                </f7-badge>
            </f7-icon>
        </f7-fab>

        <item-form :showDialog.sync="showDialog"
            :recordId="recordId"
            :alternativeName="form_search.input"></item-form>

    </f7-page>
</template>

<script>

    import _ from "lodash"
    import { auth } from "mixins_/auth"
    import {general_functions, scanner} from "mixins_/general_functions"
    import {deletable} from "mixins_/deletable"
    import ItemForm from '../../items/partials/form.vue'
    import HeaderLayout from "components/layout/Header"

    import {fn_list_items_sale} from "../mixins/pos_functions"

    export default {
        name: "ListItemsSale",
        components: { ItemForm, HeaderLayout },
        mixins: [auth, general_functions, deletable, scanner, fn_list_items_sale],
        data: function () {
            return {
                resource: 'items',
                records: [],
                form_search: {},
                current_page: 1,
                pagination: {
                    current_page: 0,
                    from: 0,
                    last_page: 0,
                    path: null,
                    per_page: 0,
                    to: 0,
                    total: 0
                },
                show_preloader: true,
                loading_text: null,
                showDialog: false,
                recordId: null,
                configuration: {},
                categories: [],
                theme: {},
                card_mode: true,
            }
        },
        computed: {
        },
        async created() {
            await this.checkOrientation()
            await this.loadConfiguration()
            await this.initFormSearch()
            await this.getInitialSettings()
            await this.initLoadingText()
            await this.getCategories()
            await this.getRecords()
            await this.events()
        },
        methods: {
            validateData()
            {
                let items_price_zero = 0
                const list_items_sale = this.getListItemsSale()

                list_items_sale.forEach(row => {
                    if(!row.sale_unit_price || isNaN(row.sale_unit_price) || parseFloat(row.sale_unit_price) <= 0) items_price_zero++
                })

                if(items_price_zero > 0) return this.generalResponse(false, 'El precio unitario de venta de los productos debe ser mayor a 0.')

                return this.generalResponse()
            },
            sendListItems()
            {
                const validate_data = this.validateData()
                if(!validate_data.success) return this.showAlert(validate_data.message)

                this.redirectRoute('/sale-detail-pos/')
            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            clickCreate(recordId = null){
                this.recordId = recordId
                this.showDialog = true
            },
            async pullToRefresh(e, done){

                await this.initDataListItems()
                done()

            },
            async loadMoreRecords(){

                const self = this

                if(this.current_page >= this.pagination.last_page)
                {
                    self.show_preloader = false
                    return
                }

                this.current_page++
                await this.getRecords()

            },
            async getRecords() {

                this.show_preloader = true
                this.loading_text = 'Cargando...'

                await this.$http.get(`${this.returnBaseUrl()}/items/records-sale?${this.getQueryParameters()}`, this.getHeaderConfig())
                        .then(response => {
                            this.records.push(...response.data.data)
                            this.pagination = response.data.meta
                            this.pagination.per_page = parseInt(response.data.meta.per_page)
                            this.loading_text = 'Sin datos'
                            this.checkSelectedRecords()
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(()=>{

                            this.show_preloader = false
                            if(this.records.length == 0) this.initLoadingText()

                        })

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
            goItems() {
                this.$f7router.navigate("/items/")
            },
            iconGrid() {
                return this.card_mode ? 'fas fa-grip-horizontal' : 'fas fa-list'
            },
            parserUrl(value){
                let url_parse = new URL(value).href;
                let class_string = `background-image:url('${url_parse}')`
                return class_string;
            }
        }
    }
</script>
