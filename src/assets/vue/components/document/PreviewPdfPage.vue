<template>
    <f7-page class="page-red-white" color="white"  >

    <f7-block>
        <f7-row>
            <f7-col width="90">
                <a href="/" class="link text-color-white">
                    <i class="icon icon-back"></i>
                    <span class="">Previsualizar</span>
                </a>
            </f7-col>
            <f7-col width="10">
                <f7-link class="panel-open text-color-white text-align-right" open-panel="right" icon="fas fa-bars"></f7-link>
            </f7-col>
        </f7-row>
    </f7-block>
    <f7-card class="card-100 padding-top padding-horizontal no-shadow" color="red" v-if="url_preview">
        <iframe
            :src="url_preview"
            frameborder="0"
            scrolling="no"
            width="100%"
            height="800px"
            >
        </iframe>
    </f7-card>

    </f7-page>
</template>

<script>

    import {general_functions} from "mixins_/general_functions"

    export default {
        // props: ['showDialog', 'record', 'documentType'],
        mixins: [general_functions],
        data: function () {
            return {
                configuration: {},
                url_preview: null,
                gview: 'https://docs.google.com/gview?url='
            }
        },
        computed: {
        },
        async created() {
            this.loadConfiguration()
            this.open()

        },
        methods: {

            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            setUrlPreview(){


                this.showLoading()
                this.url_preview = `${this.gview}https://demo.facturalo.pro/print/document/bf096fd0-c9be-4905-b654-9e30bbc27373/ticket&embedded=true`
                // this.url_preview = this.getUrlPreview()
                this.hideLoading()

            },
            getUrlPreview(){

                let url = null

                switch (this.documentType) {
                    case 'document':
                        url = `${this.gview}${this.getBaseUrl()}/print/${this.documentType}/${this.record.external_id}/${this.getPrintFormatPdf()}&embedded=true`
                        break

                    case 'sale_note':
                    case 'order_note':
                        url = `${this.gview}${this.record.print_ticket}&embedded=true`
                        break

                    case 'purchase':
                        url = `${this.gview}${this.record.print_a4}&embedded=true`
                        break
                }

                return url

            },
            async open(){
                await this.setUrlPreview()
            },
        }
    }
</script>
