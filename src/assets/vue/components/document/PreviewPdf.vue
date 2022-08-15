


<template>
    <f7-sheet class="demo-sheet default-h80-modal padding-top" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
                <f7-link small sheet-close class="no-margin no-padding text-color-red">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block style="margin-top: 0px !important;" :color="theme.name_color_theme">
                <div>
                    <div class="card-content card-content-padding">
                        <div v-if="url_preview">
                            <iframe
                                :src="url_preview"
                                frameborder="0"
                                scrolling="no"
                                width="100%"
                                height="800px"
                                SameSite="None"
                                >
                            </iframe>
                        </div>
                    </div>
                </div>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

</template>

<script>

    import {general_functions} from "mixins_/general_functions"

    export default {
        props: ['showDialog', 'record', 'documentType'],
        mixins: [general_functions],
        data: function () {
            return {
                configuration: {},
                url_preview: null,
                gview: 'https://docs.google.com/gview?embedded=true&url=',
                theme: {},
            }
        },
        watch: {
            showDialog(newValue)
            {
                if(newValue)
                {
                    this.open()
                }
            }
        },
        created() {
            this.loadConfiguration()
            this.getInitialSettings()
        },
        methods: {
            initUrl(){
                this.url_preview = null
            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            async setUrlPreview(){


                this.showLoading()
                // this.url_preview = `${this.gview}https://demo.facturalo.pro/print/document/bf096fd0-c9be-4905-b654-9e30bbc27373/ticket&embedded=true`
                this.url_preview = await this.getUrlPreview()
                this.hideLoading()

            },
            getUrlPreview(){

                let url = null

                switch (this.documentType) {
                    case 'document':
                        url = `${this.gview}${this.getBaseUrl()}/print/${this.documentType}/${this.record.external_id}/${this.getPrintFormatPdf()}`
                        break

                    case 'sale_note':
                    case 'order_note':
                        url = `${this.gview}${this.record.print_ticket}`
                        break

                    case 'purchase':
                        url = `${this.gview}${this.record.print_a4}`
                        break
                }

                return url

            },
            async open(){
                await this.setUrlPreview()
            },
            close() {
                this.$emit('update:showDialog', false)
                this.initUrl()
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
