<template>
    <f7-page class="" color="bluemagenta">

        <header-layout :title="geTitle" hrefBack="/list-items-sale/" :overwriteBackRoute="false" :showButtonBack="false"></header-layout>

        <f7-block >
            <f7-row>
                <f7-col width="65" style="height:auto"> 
                    <f7-card class="card-100 padding no-shadow" color="red" style="min-height: 90%">
                        <f7-block class="">
                            <f7-row>
                                <f7-col width="70">
                                    <div class="searchbar searchbar-inline" style="margin:4%">
                                        <div class="searchbar-input-wrap">
                                            <input type="search" placeholder="Buscar" style="font-size:12px" v-model="form.input" @input="searchRecords"/>
                                            <i class="searchbar-icon"></i>
                                            <button  class="input-clear-button" @click="clickClearInput"></button>
                                        </div>
                                    </div>
                                </f7-col>
                                <f7-col width="15" class="text-align-center">
                                    <f7-button @click="clickSearchBarcode" color="bluemagenta" fill small open-panel="right" icon="fas fa-camera"></f7-button>
                                    <span class="" style="font-size: 10px;line-height: 10px !important;">BUSCAR</span>
                                </f7-col>
                                <f7-col width="15" class="text-align-center">
                                    <f7-button @click="clickCreateItem()" color="bluemagenta" fill small open-panel="right" icon="fas fa-plus"></f7-button>
                                    <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                                </f7-col>
                            </f7-row>
                        </f7-block>
                
                        <f7-row class="padding-horizontal">

                            <f7-col width="10">
                                <template v-if="form.favorite == 1">
                                    <span class="padding-top margin-top material-icons text-color-purple" @click="clickFavorite">favorite</span>
                                </template>
                                <template v-else>
                                    <span class="padding-top margin-top material-icons text-color-purple" @click="clickFavorite">favorite_border</span>
                                </template>
                            </f7-col>

                            <f7-col width="90">
                                <div class="c-horizontal-scroll c-h-50 mp-div-category">
                                    <template v-for="(category, index) in categories">
                                        <span 
                                            class="c-padding-span-card c-span-card c-margin-span-card"
                                            :class="category.selected ? 'selected-span-card' : ''" 
                                            :key="index" 
                                            @click="clickSearchByCategory(index, category.id)">
                                            <b>{{ getCategoryName(category) }}</b>
                                        </span>
                                    </template>
                                </div>
                            </f7-col>
                        </f7-row>
                        <div class="list inset">
                            <div class="row" v-if="records.length > 0">
                                <div class="col-25" v-for="(row, index) in records" :key="index">

                                    <div class="card no-margin-horizontal no-padding-horizontal" :class="isSelectedRecord(index) ? 'custom-border-selected-item bg-white-shade' : ''">

                                        <div @click="selected(index)">

                                            <div :style="'background-image:url('+row.image_url+')'" class="card-header align-items-flex-end image-max-width"></div>

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
                    </f7-card>
                     
                </f7-col>
                <f7-col  width="35">
                    <f7-card class="card-100 padding-top no-shadow" >
                        <f7-block>
                            <sale-detail-pos
                                ref="refSaleDetailPos"
                                :landscape-mode="true"
                                @mountedSaleDetailPos="mountedSaleDetailPos"
                                @updateDataInListItem="updateDataInListItem">
                            </sale-detail-pos>
                        </f7-block>

                        
                        <f7-block v-if="load_sale_detail_pos">
                            <payment-pos
                                :landscape-mode="true">
                            </payment-pos>
                        </f7-block>
 
                    </f7-card>
                </f7-col>
            </f7-row>
        </f7-block>
 
        <item-form :showDialog.sync="showDialogItem"
                    :recordId="recordItemId"></item-form>
    </f7-page>
</template>
<script>

    import _ from 'lodash'
    import {auth} from 'mixins_/auth'
    import {general_functions, operations} from 'mixins_/general_functions'
    import HeaderLayout from 'components/layout/Header'
    import SaleDetailPos from './components/SaleDetail.vue'
    import PaymentPos from './components/Payment.vue'
    import ItemForm from '../items/partials/form.vue'

    import {fn_list_items_sale} from "./mixins/pos_functions"

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
                form: {},
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

            // list item sale

        },
        async mounted()
        {
            // await this.checkLoadPayment()
        },
        methods: {
            inputEventsLandscapePos()
            {
                // evento que inicializa los datos cuando se culmina el registro del documento en Payment
                this.$eventHub.$on('initializeDataLandscape', ()=>{

                    this.initFormSearch()
                    this.initLoadingText()
                    this.getRecords()

                })
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
        }
    }
</script>
