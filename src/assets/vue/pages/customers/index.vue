<template>
    <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body" infinite :infinite-distance="50" :infinite-preloader="show_preloader" @infinite="loadMoreRecords" ptr  @ptr:refresh="pullToRefresh">

        <header-layout title="Clientes"></header-layout>

        <f7-card class="card-100 padding-top no-shadow" :color="theme.name_color_theme" style="min-height: 90%">

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
                        <f7-button @click="clickCreate()" :color="theme.name_color_theme" fill small open-panel="right" class="bg-secondary" icon="fas fa-plus"></f7-button>
                        <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                    </f7-col>
                </f7-row>
            </f7-block>

            <f7-block>
                <div>
                    <div class="row" v-if="records.length > 0">
                        <div class="col-100" v-for="(row, index) in records" :key="index">
                            <div class="card" :class="!row.enabled ? 'border-disabled':''">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <div class="row">
                                            <div>
                                                <span class="text-align-center"><b>{{row.name}}</b></span><br>
                                                <span class="text-align-center"><b> {{row.identity_document_type_description}}</b>: {{row.number}}</span><br>
                                                <span class="text-align-center" v-if="row.address"> <b>Dirección:</b> {{row.address}}</span><br>
                                                <span class="text-align-center" v-if="row.telephone"> <b>Teléfono:</b> {{row.telephone}}</span><br>
                                            </div>
                                        </div>
                                        <f7-row class="display-flex justify-content-center padding-top">
                                            <f7-col class="text-align-center">
                                                <a href="#" class="link text-color-blue" @click="clickCreate(row.id)">
                                                    <span class="material-icons">edit</span>
                                                </a>
                                            </f7-col>
                                            <f7-col class="text-align-center">
                                                <a href="#" class="link" @click="clickChangeEnabled(row.id, row.enabled)">
                                                    <template v-if="row.enabled">
                                                        <span class="material-icons icon-color-danger">highlight_off</span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="material-icons text-color-green">check_circle</span>
                                                    </template>
                                                </a>
                                            </f7-col>
                                            <f7-col class="text-align-center">
                                                <a href="#" class="link" @click="clickDelete(row.id)">
                                                    <span class="material-icons icon-color-danger">delete</span>
                                                </a>
                                            </f7-col>
                                        </f7-row>
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
                </div>
            </f7-block>
        </f7-card>

        <person-form :showDialog.sync="showDialog"
                    :recordId="recordId"></person-form>

    </f7-page>
</template>

<script>

    import _ from "lodash"
    import { auth } from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"
    import {deletable} from "mixins_/deletable"
    import queryString from "query-string"
    import PersonForm from './partials/form.vue'
    import HeaderLayout from "components/layout/Header"

    export default {
        name: "IndexCustomers",
        components: { PersonForm, HeaderLayout },
        mixins: [auth, general_functions, deletable ],
        data: function () {
            return {
                resource: 'persons',
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
                configuration: {},
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
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            clickChangeEnabled(id, enabled){

                const enabled_param = enabled ? 0 : 1

                this.changeActive(`${this.returnBaseUrl()}/${this.resource}/change-enabled/${id}/${enabled_param}`, enabled_param).then(() =>
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

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/customers/records?${this.getQueryParameters()}`, this.getHeaderConfig())
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
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
