<template>
    <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">

        <header-layout title="Reporte"></header-layout>

        <!-- filtros -->
        <f7-block class="list no-hairlines-md">
            <f7-row>
                <f7-col width="100" v-if="user_data.type === 'admin'">
                    <div class="item-content item-input no-padding-horizontal">
                        <div class="item-inner no-padding-horizontal">
                            <div class="item-title item-label">Establecimiento</div>

                            <div class="item-input-wrap input-dropdown-wrap">
                                <select v-model="form.establishment_id" @change="changeEstablishment">
                                    <template v-for="(row, index) in establishments">
                                        <option :value="row.id" :key="index">{{row.description}}</option>
                                    </template>
                                </select>
                            </div>
                        </div>
                    </div>
                </f7-col>

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
                <f7-list-item title="Total pedidos">
                    <template #after>
                        <span class="text-align-right padding-right text-color-pink">
                            {{general.totals.total_order_notes}}
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
            <f7-row class="padding-bottom">
                <f7-col class="padding-bottom">
                    <h4>
                        <i class="icon material-icons if-md">info_outline</i>
                        No incluye pedidos
                    </h4>
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
                resource: 'reports',
                establishments: [],
                user_data: {},
                theme: {},
            }
        },
        async created() {
            await this.initForm()
            await this.getInitialSettings()
            await this.getUserData()
            await this.filters()
            await this.getData()
        },
        mounted() {},
        methods: {
            getUserData(){
                const generals = this.getStorage('generals', true)
                this.user_data = generals.user_data
            },
            async filters() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/filters`, this.getHeaderConfig())
                            .then((response)=>{
                                this.establishments = response.data.establishments
                                this.setEstablishment()
                                this.hideLoading()
                            })

            },
            setEstablishment(){

                if(this.user_data.type === 'admin')
                {
                    this.form.establishment_id = this.establishments.length > 0 ? this.establishments[0].id : null
                }
                else
                {
                    this.form.establishment_id = null
                }

            },
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
            changeEstablishment(){
                this.getData()
            },
            initForm(){

                this.form = {
                    period: 'date',
                    date_start: moment().format('YYYY-MM-DD'),
                    date_end: moment().format('YYYY-MM-DD'),
                    month_start: moment().format('YYYY-MM'),
                    month_end: moment().format('YYYY-MM'),
                    establishment_id: null
                }

                this.user_data = {
                    establishment_id: null,
                    type: null,
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

            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },

        }
    }
</script>
