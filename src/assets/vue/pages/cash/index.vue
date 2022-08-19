<template>
    <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body" infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh">

        <header-layout title="Caja"></header-layout>

        <f7-card class="card-100 padding-top no-shadow" :color="theme.name_color_theme"  style="min-height: 90%">

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
                        <f7-button @click="clickCreate()" :color="theme.name_color_theme"  fill small open-panel="right" icon="fas fa-plus" class="bg-secondary"></f7-button>
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
                                                                <span class="material-icons text-color-green">check_circle</span>
                                                            </template>
                                                            <template v-else>
                                                                <span class="material-icons text-color-red">highlight_off</span>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </span>

                                            </div>
                                            <div class="col-10 padding-top">

                                                <a href="#" class="link" @click="clickReports(row.id)">
                                                    <span class="material-icons text-color-bluemagenta">picture_as_pdf</span>
                                                </a>
                                                <a href="#" class="link text-color-teal mt-15" @click="clickEmail(row.id)">
                                                    <span class="material-icons">mail</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-footer" v-if="row.state">

                                    <a href="#" class="link text-color-blue" @click="clickCreate(row.id)">
                                        <span class="material-icons">edit</span>
                                    </a>
                                    <template>
                                        <a href="#" class="link" @click="clickClose(row.id)">
                                            <span class="material-icons text-color-red">highlight_off</span>
                                        </a>
                                    </template>
                                    <a href="#" class="link" @click="clickDelete(row.id)">
                                        <span class="material-icons text-color-red">delete</span>
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

        <cash-reports :showDialog.sync="showDialogReports"
                    :recordId="recordId"></cash-reports>
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
    import CashReports from './partials/reports.vue'
    import HeaderLayout from "components/layout/Header"

    export default {
        name: "IndexCash",
        components: { CashForm, EmailForm, HeaderLayout, CashReports },
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
                showDialogReports: false,
                recordId: null,
                configuration: {},
                locked_query: false,
                url_email:null,
                params_email: null,
                theme: {},
            }
        },
        computed: {
        },
        async created() {
            await this.loadConfiguration()
            await this.getInitialSettings()
            await this.initForm()
            await this.initLoadingText()
            await this.getRecords()
            await this.events()
        },
        methods: {
            clickReports(recordId){
                console.log(recordId)
                this.recordId = recordId
                this.showDialogReports = true
            },
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
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
