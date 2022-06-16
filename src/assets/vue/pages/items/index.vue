<template>
    <f7-page class="page-red-white" color="white"  infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh">

        <f7-block>
            <f7-row>
                <f7-col width="90">
                    <a class="link back text-color-white">
                        <i class="icon icon-back"></i>
                        <span class="">Productos</span>
                    </a>
                </f7-col>
                <f7-col width="10">
                    <f7-link class="panel-open text-color-white text-align-right" open-panel="right" icon="fas fa-bars"></f7-link>
                </f7-col>
            </f7-row>
        </f7-block>

        <f7-card class="card-100 padding-top no-shadow" color="red" style="min-height: 90%">
            
            <f7-block class="">
                <f7-row>
                    <f7-col width="75">
                        <div class="searchbar searchbar-inline" style="margin:4%">
                            <div class="searchbar-input-wrap">
                                <input type="search" placeholder="Buscar" style="font-size:12px" v-model="form.input" @input="searchRecords"/>
                                <i class="searchbar-icon"></i>
                                <button  class="input-clear-button" @click="clickClearInput"></button>
                            </div>
                        </div>
                    </f7-col>
                    <f7-col width="15" class="text-align-center">
                        <f7-button @click="clickCreate()" color="blue" fill small open-panel="right" icon="fas fa-plus"></f7-button>
                        <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                    </f7-col>
                </f7-row>
            </f7-block>

            <f7-block>
                <div>
                    <div class="row" v-if="records.length > 0">
                        <div class="col-50" v-for="(row, index) in records" :key="index">
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <img :src="row.image_url" class="image-max-width">
                                        <span class="text-align-center"><b>{{row.description}}</b></span><br>
                                        <span class="text-align-center">{{row.internal_id}}</span><br>
                                        <span class="float-right"><b>{{row.show_sale_unit_price}}</b></span><br>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    
                                    <a href="#" class="link" @click="clickCreate(row.id)">
                                        <span class="material-icons">edit</span>
                                    </a>
                                    <a href="#" class="link">
                                        <span class="material-icons">check_circle</span>
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

        <item-form :showDialog.sync="showDialog"
                    :recordId="recordId"></item-form>

    </f7-page>
</template>

<script>

    import _ from "lodash";
    import { auth } from "mixins_/auth";
    import { deletable } from "mixins_/deletable";
    import {general_functions} from "mixins_/general_functions"
    import queryString from "query-string";
    import ItemForm from './partials/form.vue'

    export default {
        name: "IndexItems",
        components: { ItemForm },
        mixins: [auth, deletable, general_functions],
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
            }
        },
        computed: {
        },
        async created() {
            await this.initForm()
            await this.initLoadingText()
            await this.getRecords()
            await this.events()
        },
        methods: {
            clickDelete(id){
                
                this.destroy(`${this.returnBaseUrl()}/items/${id}`).then(() =>
                    this.$eventHub.$emit('reloadData')
                )

            },
            events(){

                this.$eventHub.$on('reloadData', ()=>{
                    this.initData()
                })

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
                    input : null
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
