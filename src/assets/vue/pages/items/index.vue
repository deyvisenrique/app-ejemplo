<template>
    <f7-page infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh">

        <header-layout></header-layout>
        <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical">
            <f7-row>
                <f7-col width="10">
                <a class="link back text-color-white" href="/">
                    <i class="fas fa-angle-left"></i>
                </a>
                </f7-col>
                <f7-col width="80" class="text-color-white text-align-center">
                Productos
                </f7-col>
                <f7-col width="10"></f7-col>
            </f7-row>
        </f7-block>

        <f7-card class="card-100 padding-top no-shadow" color="red" style="min-height: 90%">
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
                        <f7-button @click="clickCreate()" color="bluemagenta" fill small open-panel="right" icon="fas fa-plus"></f7-button>
                        <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                    </f7-col>
                </f7-row>
            </f7-block>

            <f7-block>
                <div>
                    <div class="row" v-if="records.length > 0">
                        <div class="col-50" v-for="(row, index) in records" :key="index">
                            <div class="card no-margin-horizontal no-padding-horizontal" :class="!row.active ? 'border-disabled':''">
                                <template v-if="configuration.show_image_item">
                                    <div :style="'background-image:url('+row.image_url+')'" class="card-header align-items-flex-end image-max-width"></div>
                                </template>
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <span class="text-align-center"><b>{{row.description}}</b></span><br>
                                        <span class="text-align-center">{{row.internal_id}}</span><br>
                                        <span class="float-right"><b>{{row.show_sale_unit_price}}</b></span><br>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <a href="#" class="link" @click="clickCreate(row.id)">
                                        <span class="material-icons text-color-blue">edit</span>
                                    </a>
                                    <a href="#" class="link" @click="clickChangeActive(row.id, row.active)">
                                        <template v-if="row.active">
                                            <span class="material-icons icon-color-danger">highlight_off</span>
                                        </template>
                                        <template v-else>
                                            <span class="material-icons text-color-success">check_circle</span>
                                        </template>
                                    </a>
                                    <a href="#" class="link" @click="clickDelete(row.id)">
                                        <span class="material-icons icon-color-danger">delete</span>
                                    </a>
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
                </div>
            </f7-block>
        </f7-card>

        <!-- <f7-fab position="right-bottom" color="red" @click="pullToRefresh(this, ()=>{})">
            <f7-icon f7="arrow_upward"></f7-icon>
        </f7-fab> -->

        <item-form :showDialog.sync="showDialog"
                    :recordId="recordId"></item-form>

    </f7-page>
</template>

<script>

    import _ from "lodash"
    import { auth } from "mixins_/auth"
    import {general_functions, scanner} from "mixins_/general_functions"
    import {deletable} from "mixins_/deletable"
    import queryString from "query-string"
    import ItemForm from './partials/form.vue'
    import HeaderLayout from "components/layout/Header"

    export default {
        name: "IndexItems",
        components: { ItemForm, HeaderLayout },
        mixins: [auth, general_functions, deletable, scanner],
        data: function () {
            return {
                resource: 'items',
                records: [],
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
                show_preloader: true,
                loading_text: null,
                showDialog: false,
                recordId: null,
                configuration: {}
            }
        },
        computed: {
        },
        async created() {
            await this.loadConfiguration()
            await this.initForm()
            await this.initLoadingText()
            await this.getRecords()
            await this.events()
        },
        methods: {
            clickSearchBarcode(){

                const context = this
                cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        if(result.text)
                        {
                            context.form.input = result.text
                            context.form.search_by_barcode = 1
                            context.initData()
                            context.form.search_by_barcode = 0
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
            clickChangeActive(id, active){

                const active_param = active ? 0 : 1

                this.changeActive(`${this.returnBaseUrl()}/items/change-active/${id}/${active_param}`, active_param).then(() =>
                    this.$eventHub.$emit('reloadData')
                )

            },
            clickDelete(id){

                this.destroy(`${this.returnBaseUrl()}/items/${id}`).then(() =>
                    this.$eventHub.$emit('reloadData')
                )

            },
            events(){

                this.$eventHub.$on('reloadData', ()=>{
                    this.initData()
                })

                // this.$eventHub.$on('reloadPageItem', ()=>{
                //     this.$f7router.refreshPage()
                // })

            },
            clickCreate(recordId = null){
                this.recordId = recordId
                this.showDialog = true
            },
            clickClearInput(){
                this.form.input = null
                this.initData()
            },
            initLoadingText(){
                this.loading_text = 'Sin datos'
            },
            async searchRecords(){

                if(this.form.input.length > 2)
                {
                    await this.initData()
                }

            },
            initForm(){
                this.form = {
                    input : null,
                    search_by_barcode : 0,
                }
            },
            async pullToRefresh(e, done){

                await this.initData()
                done()

            },
            async initData(){

                this.current_page = 1
                this.records = []
                await this.getRecords()

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

                await this.$http.get(`${this.returnBaseUrl()}/items/records?${this.getQueryParameters()}`, this.getHeaderConfig())
                        .then(response => {
                            this.records.push(...response.data.data)
                            this.pagination = response.data.meta
                            this.pagination.per_page = parseInt(response.data.meta.per_page)
                            this.loading_text = 'Sin datos'
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(()=>{

                            this.show_preloader = false
                            if(this.records.length == 0) this.initLoadingText()

                        })

            },
            getQueryParameters() {

                return queryString.stringify({
                    page: this.current_page,
                    ...this.form
                })

            },
        }
    }
</script>
