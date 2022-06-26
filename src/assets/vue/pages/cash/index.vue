<template>
    <f7-page class="page-red-white" color="white"  infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh">

        <f7-block>
            <f7-row>
                <f7-col width="90">
                    <a class="link back text-color-white">
                        <i class="icon icon-back"></i>
                        <span class="">Caja</span>
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
                    <f7-col width="85">
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

                        <div class="col-100" v-for="(row, index) in records" :key="index">
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">

                                        <div class="row">

                                            <div class="col-90">

                                                <span class="d-block c-padding-2"><b>Apertura:</b> {{row.opening}}</span>
                                                <span class="d-block c-padding-2" v-if="!row.state"><b> Cierre</b>: {{row.closed}}</span>
                                                <span class="d-block c-padding-2"><b> Saldo inicial</b>: S/ {{row.beginning_balance}}</span>
                                                <span class="d-block c-padding-2" v-if="!row.state"><b> Saldo final</b>: S/ {{row.final_balance}}</span>
                                                <span class="d-block c-padding-2" v-if="row.reference_number"> <b>Referencia:</b> {{row.reference_number}}</span>
                                                <span class="d-block c-padding-2" v-if="!row.state"><b> Ingreso</b>: S/ {{row.income}}</span>

                                                <span class="d-block c-padding-2"> 
                                                    <div class="row">
                                                        <div class="col-40">
                                                            <b>Estado:</b> 
                                                            {{row.state_description}}
                                                        </div>
                                                        <div class="col-60">
                                                            <template v-if="row.state">
                                                                <span class="material-icons icon-color-success">check_circle</span>
                                                            </template>
                                                            <template v-else>
                                                                <span class="material-icons icon-color-danger">highlight_off</span>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </span>

                                            </div>
                                            <div class="col-10 padding-top">

                                                <template v-if="row.state">
                                                    <a href="#" class="link" @click="clickCreate(row.id)">
                                                        <span class="material-icons">edit</span>
                                                    </a>
                                                    <template v-if="row.state">
                                                        <a href="#" class="link" @click="clickClose(row.id)">
                                                            <span class="material-icons icon-color-danger">highlight_off</span>
                                                        </a>
                                                    </template>
                                                    <a href="#" class="link" @click="clickDelete(row.id)">
                                                        <span class="material-icons icon-color-danger">delete</span>
                                                    </a>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-footer">
                                    <a href="#" class="link" >
                                        <span class="material-icons icon-color-danger">picture_as_pdf</span>
                                    </a>
                                    <a href="#" class="link" >
                                        <span class="material-icons icon-color-success">description</span>
                                    </a>
                                    <a href="#" class="link" @click="clickEmail(row.id)">
                                        <span class="material-icons">mail</span>
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

        <cash-form :showDialog.sync="showDialog"
                    :recordId="recordId"></cash-form>

        <email-form :showDialog.sync="showDialogEmail"
                    :url="url_email"
                    :recordId="recordId"
                    ></email-form>

    </f7-page>
</template>

<script>

    import _ from "lodash"
    import { auth } from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"
    import {deletable} from "mixins_/deletable"
    import queryString from "query-string"
    import CashForm from './partials/form.vue'
    import EmailForm from 'components/document/EmailForm.vue'

    

    export default {
        name: "IndexCash",
        components: { CashForm, EmailForm },
        mixins: [auth, general_functions, deletable],
        data: function () {
            return {
                resource: 'cash',
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
                showDialogEmail: false,
                recordId: null,
                configuration: {},
                locked_query: false,
                url_email:null,
                params_email: null,
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
            clickEmail(id){

                this.url_email = `${this.returnBaseUrl()}/${this.resource}/email`
                this.recordId = id
                this.showDialogEmail = true

            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            clickClose(id){

                this.closeCash(`${this.returnBaseUrl()}/${this.resource}/close/${id}`).then(() =>
                    this.$eventHub.$emit('reloadData')
                )

            },
            clickDelete(id){
                
                this.destroy(`${this.returnBaseUrl()}/${this.resource}/${id}`).then(() =>
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

                if(!recordId)
                {
                    this.checkOpenCash()
                }
                else
                {
                    this.showDialog = true
                }
                
            },
            async checkOpenCash(){
                
                this.showLoading()
                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/check-open-cash`, this.getHeaderConfig())
                        .then(response => {

                            if(response.data.success)
                            {
                                this.showAlert(response.data.message)
                            }
                            else
                            {
                                this.showDialog = true
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.hideLoading()
                        })

            },
            clickClearInput(){
                this.form.input = null
                this.initData()
            },
            initLoadingText(){
                this.loading_text = 'Sin datos'
            },
            async searchRecords(){

                if(this.form.input.length > 1)
                {
                    await this.initData()
                }

            },
            initForm(){
                this.form = {
                    input : null,
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

                if(this.locked_query) return

                this.show_preloader = true
                this.loading_text = 'Cargando...'
                this.locked_query = true

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/records?${this.getQueryParameters()}`, this.getHeaderConfig())
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

                            this.locked_query = false
                            
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
