<template>
    <f7-page :class="theme.class_bg_body" :color="theme.name_color_theme">

        <header-layout :title="header_title" :showLogoConfiguration="false" hrefBack="/list-items-sale/" :overwriteBackRoute="false" :showButtonBack="false" :menuPositionTwo="true"></header-layout>

        <f7-block class="no-padding no-margin-vertical">
            <f7-row>
                <f7-col width="60" class="">
                    <f7-card class="card-100 no-padding no-margin-bottom no-shadow" :color="theme.name_color_theme">

                        <f7-row class="padding-top padding-horizontal">
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
                        <f7-row class="margin-bottom padding-horizontal">
                            <f7-col width="100">
                                <div class="c-horizontal-scroll mp-div-category">
                                    <span v-for="(category, index) in categories" :key="index" style="display: table-cell; padding-right: 5px">
                                        <f7-button :key="index" @click="clickSearchByCategory(index, category.id)" :color="theme.name_color_theme" fill medium :class="category.selected ? 'bg-secondary' : ''">
                                            {{ getCategoryName(category) }}
                                        </f7-button>
                                    </span>
                                </div>
                            </f7-col>
                        </f7-row>
                        <div style="overflow-y: scroll;height: calc(100vh - 235px);">
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
                                        <f7-button @click="clickCreateItem()" :color="theme.name_color_theme" fill small open-panel="right" icon="fas fa-plus" class="bg-secondary"> Registrar Producto: {{ form_search.input }}</f7-button>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="row" v-if="records.length > 0">
                                        <div class="col-33" v-for="(row, index) in records" :key="index">

                                            <div class="card no-margin-horizontal no-padding-horizontal" :class="isSelectedRecord(index) ? 'custom-border-selected-item bg-white-shade' : ''">

                                                <div @click="selected(index)">

                                                    <div :style="parserUrl(row.image_url)" class="card-header align-items-flex-end image-max-width"></div>

                                                    <div class="card-content card-content-padding">
                                                        <div class="item-input-wrap">
                                                            <span class="text-align-center"><b>{{row.full_description}}</b></span>

                                                            <span class="">
                                                                <div class="item-content no-padding-left">
                                                                    <div class="item-media">{{ row.currency_type_symbol }} {{row.sale_unit_price}}</div>
                                                                </div>
                                                            </span>

                                                            <template v-if="row.unit_type_id !== 'ZZ'">
                                                                <span class="text-align-center"><b>Stock: {{row.stock}}</b></span><br>
                                                            </template>
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
                                    </div>
                                    <div class="row" v-else>
                                        <div class="col-100">
                                            <h3 class="text-align-center">
                                                {{ loading_text }}
                                            </h3>
                                        </div>
                                    </div>
                                </template>

                                <div class="data-table-footer text-align-center">
                                    <div class="data-table-pagination">
                                        <span class="data-table-pagination-label">Total {{ pagination.total }}</span>
                                        <a href="#" class="link" :class="pagination.current_page == pagination.from ? 'disabled' : ''" @click="prevPage">
                                            <i class="icon icon-prev color-gray"></i>
                                        </a>
                                        <a>
                                            {{ pagination.current_page }}
                                        </a>
                                        <a href="#" class="link" :class="pagination.current_page === pagination.last_page ? 'disabled' : ''" @click="nextPage">
                                            <i class="icon icon-next color-gray"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </f7-card>

                </f7-col>
                <f7-col  width="40" style="overflow-y: scroll;height: calc(100vh - 95px);">
                    <f7-card class="card-100 no-padding no-margin no-shadow">

                        <div class="margin-right">
                            <sale-detail-pos
                                ref="refSaleDetailPos"
                                :landscape-mode="true"
                                @mountedSaleDetailPos="mountedSaleDetailPos"
                                @updateDataInListItem="updateDataInListItem">
                            </sale-detail-pos>
                        </div>

                        <!-- mostrar si el componente sale detail pos se encuentra creado -->
                        <div class="margin-right" v-if="load_sale_detail_pos">
                            <payment-pos
                                :landscape-mode="true">
                            </payment-pos>
                        </div>

                    </f7-card>
                </f7-col>
            </f7-row>
        </f7-block>

        <item-form :showDialog.sync="showDialogItem"
            :recordId="recordItemId"
            :alternativeName="form_search.input"></item-form>
    </f7-page>
</template>
<script>

    import _ from 'lodash'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import SaleDetailPos from '../components/SaleDetail.vue'
    import PaymentPos from '../components/Payment.vue'
    import ItemForm from '../../items/partials/form.vue'

    import {fn_list_items_sale} from "../mixins/pos_functions"

    export default {
        name: 'LandscapePos',
        components: {
            HeaderLayout,
            SaleDetailPos,
            PaymentPos,
            ItemForm,
        },
        mixins: [
            auth,
            general_functions,
            operations,
            fn_list_items_sale,
        ],
        data: function () {
            return {
                // list item sale
                records: [],
                loading_text: null,
                show_preloader: true,
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
                loading_text: null,
                recordItemId: null,
                configuration: {},
                categories: [],
                // list item sale

                load_sale_detail_pos: false,
                showDialogItem: false,
                theme: {},
                card_mode: true,
            }
        },
        computed: {
            geTitle(){
                return `Punto de venta`
            }
        },
        async created() {
            // list item sale
            await this.loadConfiguration()
            await this.checkOrientation()
            await this.initFormSearch()
            await this.initLoadingText()
            await this.getCategories()
            await this.getRecords()
            await this.events()
            await this.inputEventsLandscapePos()
            await this.getInitialSettings()

            // list item sale

        },
        async mounted()
        {
            // await this.checkLoadPayment()
        },
        methods: {
            inputEventsLandscapePos()
            {
            },
            clickCreateItem(recordItemId = null)
            {
                this.recordItemId = recordItemId
                this.showDialogItem = true
            },
            async updateDataInListItem()
            {
                await this.initializeQuantityRecords()
                this.checkSelectedRecords()
            },
            async initializeQuantityRecords()
            {
                await this.records.forEach(element => {
                    element.quantity=0
                })
            },
            async mountedSaleDetailPos()
            {
                this.load_sale_detail_pos = true
            },
            loadConfiguration()
            {
                this.configuration = this.getInitialConfiguration()
            },
            prevPage()
            {
                this.current_page--
                this.getRecords()
            },
            nextPage()
            {
                this.current_page++
                this.getRecords()
            },
            async getRecords() {

                this.showLoading()
                this.loading_text = 'Cargando...'

                await this.$http.get(`${this.returnBaseUrl()}/items/records-sale?${this.getQueryParameters()}`, this.getHeaderConfig())
                        .then(response => {
                            this.records = response.data.data
                            this.pagination = response.data.meta
                            this.pagination.per_page = parseInt(response.data.meta.per_page)
                            this.loading_text = 'Sin datos'
                            this.checkSelectedRecords()
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(()=>{

                            this.hideLoading()
                            if(this.records.length == 0) this.initLoadingText()

                        })

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
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
