<template>
    <f7-page class="">
        <header-layout></header-layout>

        <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical">
            <f7-row>
                <f7-col width="10">
                    <a class="link back text-color-white">
                        <i class="fas fa-angle-left custom-icon-back-form"></i>
                    </a>
                </f7-col>
                <f7-col width="80" class="text-color-white text-align-center custom-title-form">
                    Reporte
                </f7-col>
                <f7-col width="10"></f7-col>
            </f7-row>
        </f7-block>

        <!-- filtros -->
        <f7-block class="list no-hairlines-md">
            <f7-row>
                <f7-col width="100">
                    <div class="item-content item-input no-padding-horizontal">
                        <div class="item-inner no-padding-horizontal">
                            <div class="item-title item-label">Periodo</div>
                            
                            <div class="item-input-wrap input-dropdown-wrap">
                                <select v-model="form.period" @change="changePeriod">
                                    <option value="date">Por fecha</option>
                                    <option value="month">Por mes</option>
                                    <option value="between_dates">Entre fechas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </f7-col>

                <template v-if="form.period == 'date'">

                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Fecha</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <input name="date" v-model="form.date_start" type="date" @change="changeDate"/>
                                </div>
                            </div>
                        </div>
                    </f7-col>

                </template>
                
                <template v-else-if="form.period == 'month'">
                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Mes</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <input v-model="form.month_start" type="month" @change="changeMonth" />
                                </div>
                            </div>
                        </div>
                    </f7-col>
                </template>

                <template v-else-if="form.period == 'between_dates'">
                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Fecha inicio</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <input name="date" v-model="form.date_start" type="date" @change="changeDate"/>
                                </div>
                            </div>
                        </div>
                    </f7-col>
                    <f7-col width="50">
                        <div class="item-content item-input no-padding-horizontal">
                            <div class="item-inner no-padding-horizontal">
                                <div class="item-title item-label">Fecha término</div>
                                <div class="item-input-wrap input-dropdown-wrap">
                                    <input name="date" v-model="form.date_end" type="date" @change="changeDate"/>
                                </div>
                            </div>
                        </div>
                    </f7-col>
                </template>


            </f7-row>
        </f7-block>
        <!-- filtros -->

        <f7-block>
            <f7-list>
                <f7-list-item title="Total notas de venta">
                    <template #after>
                        <span class="text-align-right padding-right text-color-pink">
                            {{general.totals.total_sale_notes}}
                        </span>
                    </template>
                </f7-list-item>
                <f7-list-item title="Total comprobantes">
                    <template #after>
                        <span class="text-align-right padding-right text-color-blue">
                            {{general.totals.total_documents}}
                        </span>
                    </template>
                </f7-list-item>
            </f7-list>
        </f7-block>
        <f7-block class="bg-white-shade">
            <f7-row class="padding-horizontal">
                <f7-col width="70">
                    <h3>Total</h3>
                </f7-col>
                <f7-col width="30">
                    <h3>{{general.totals.total}}</h3>
                </f7-col>
            </f7-row>
        </f7-block>
        <f7-block class="padding-top padding-bottom">
            <f7-row class="padding-top padding-bottom">
                <f7-col class="padding-top padding-bottom">
                    <x-graph-line :all-data="general.graph"></x-graph-line>
                </f7-col>
            </f7-row>
        </f7-block>

    </f7-page>
</template>


<script>

    import xGraphLine from "components/graph/GraphLine.vue"
    import HeaderLayout from "components/layout/Header"
    import {auth} from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"
    import moment from "moment"

    export default {
        components: {
            xGraphLine,
            HeaderLayout
        },
        mixins: [auth, general_functions],
        data() {
            return {
                form: {},
                isBottom: true,
                general: {
                    totals: {},
                    graph: {}
                },
                resource: 'reports'
            }
        },
        async created() {
            await this.initForm()
            await this.getData()
        },
        mounted() {},
        methods: {
            changeMonth(){
                this.getData()
            },
            changeDate(){

                if (this.form.period === 'between_dates') 
                {
                    if(moment(this.form.date_start).isAfter(this.form.date_end))
                    {
                        this.form.date_end = this.form.date_start
                        this.showAlert('Fecha inicio no puede ser posterior a fecha término')
                        return
                    }
                    
                    if(moment(this.form.date_end).isBefore(this.form.date_start))
                    {
                        this.form.date_start = this.form.date_end
                        this.showAlert('Fecha término no puede ser posterior a fecha inicio')
                        return
                    }
                }

                this.getData()

            },
            changePeriod() {

                if (this.form.period === 'month') 
                {
                    this.form.month_start = moment().format('YYYY-MM')
                    this.form.month_end = moment().format('YYYY-MM')
                }
                
                if (this.form.period === 'date') 
                {
                    this.form.date_start = moment().format('YYYY-MM-DD')
                    this.form.date_end = moment().format('YYYY-MM-DD')
                }

                if (this.form.period === 'between_dates') 
                {
                    this.form.date_start = moment().startOf('month').format('YYYY-MM-DD')
                    this.form.date_end = moment().endOf('month').format('YYYY-MM-DD')
                }

                this.getData()

            },
            initForm(){

                this.form = {
                    period: 'date',
                    date_start: moment().format('YYYY-MM-DD'),
                    date_end: moment().format('YYYY-MM-DD'),
                    month_start: moment().format('YYYY-MM'),
                    month_end: moment().format('YYYY-MM')
                }

            },
            async getData() {

                this.showLoading()

                await this.$http.post(`${this.returnBaseUrl()}/${this.resource}/general-sale`, this.form, this.getHeaderConfig())
                            .then((response)=>{
                                this.general = response.data.data

                            })
                            .catch((error) => {

                                this.showAlert(`Ocurrió un error: ${error}`)

                            }).then(()=>{
                                this.hideLoading()
                            })

            }

        }
    }
</script>
