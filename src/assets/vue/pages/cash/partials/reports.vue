<template>
<f7-sheet class="demo-sheet default-h70-modal padding-top" :opened="showDialog" @sheet:closed="close">
    <f7-page-content>
        <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
            <f7-link small sheet-close class="no-margin no-padding text-color-red">
                <f7-icon material="close"></f7-icon>
            </f7-link>
        </f7-block>
        <f7-block  color="red"> 
            
            <template v-for="(row, index) in data">

                <div :key="index">
                    <div class="block-title" >{{row.title}}</div>
                    <div class="list">
                        <ul>
                            <li v-for="(option, index) in row.options" :key="index">
                                <label class="item-radio item-radio-icon-start item-content">
                                    <input type="radio" name="demo-radio-start" @change="changeOption(option)"/>
                                    <i class="icon icon-radio"></i>
                                        <div class="item-inner">
                                        <div class="item-title">{{option.title}}</div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

            </template>
        </f7-block>
        
    </f7-page-content>
</f7-sheet>
</template>

<script>

    import {auth} from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"
    import {download_file} from "mixins_/download_file"

    export default {
        props: ['showDialog', 'recordId'],
        mixins: [auth, general_functions, download_file],
        data: function () {
            return {
                resource: 'cash',
                data: [],
            }
        },
        watch: {
            showDialog(newValue) {
                if (newValue) {
                    this.open()
                }
            }
        },
        async created() {
            await this.initData()
        },
        methods: {
            initData(){
                this.data = []
            },
            async open() 
            {
                await this.setData()
            },

            async changeOption(option)
            {
                await this.saveFileInSystem(option.url, option.filename, true)

                // await this.showLoading()
                // await this.generalSleep(500)
                // // await this.downloadOpenFile(option.url, option.filename, true)
                // await this.downloaFileToPrint(option.url, option.filename, true) //definido en mixin download_file
                // await this.hideLoading()

            },
            setData() {

                const base_url = `${this.returnBaseUrl()}/${this.resource}`
                const extension = 'pdf'

                this.data = [
                    {
                        title: 'Reporte general',
                        options: [
                            {
                                title: 'PDF A4',
                                url: `${base_url}/general-report/${this.recordId}`,
                                filename: `${this.recordId}_general_report_a4.${extension}`
                            },
                            {
                                title: 'PDF Ticket',
                                url: `${base_url}/general-report/${this.recordId}/ticket`,
                                filename: `${this.recordId}_general_report_ticket.${extension}`
                            }
                        ]
                    },
                    {
                        title: 'Reporte productos',
                        options: [
                            {
                                title: 'PDF A4',
                                url: `${base_url}/product-report/${this.recordId}`,
                                filename: `${this.recordId}_product_report.${extension}`
                            },
                        ]
                    },
                    {
                        title: 'Reporte efectivo' ,
                        options: [
                            {
                                title: 'Ingresos',
                                url: `${base_url}/income-summary-report/${this.recordId}`,
                                filename: `${this.recordId}_income_summary_report.${extension}`
                            },
                            {
                                title: 'Ingresos y egresos',
                                url: `${base_url}/income-egress-report/${this.recordId}`,
                                filename: `${this.recordId}_income_egress_report.${extension}`
                            },
                        ]
                    },
                ]

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initData()
            }
        }
    }
</script>
