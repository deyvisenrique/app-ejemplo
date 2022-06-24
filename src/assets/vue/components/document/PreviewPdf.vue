
                                            

<template> 
    <f7-sheet class="demo-sheet default-h80-modal padding-top" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
                <f7-link small sheet-close class="no-margin no-padding text-color-red">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block style="margin-top: 0px !important;" color="red"> 
                <div>
                    <div class="card-content card-content-padding">
                        <div v-if="url_preview">
                            <iframe 
                                :src="url_preview"
                                frameborder="0"
                                scrolling="no" 
                                width="100%" 
                                height="800px"
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
        props: ['showDialog', 'externalId', 'documentType'],
        mixins: [general_functions],
        data: function () {
            return {
                configuration: {},
                url_preview: null,
                gview: 'https://docs.google.com/gview?url='
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
        },
        methods: {
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            setUrlPreview(){

                this.showLoading()
                // this.url_preview = `${this.gview}https://demo.facturalo.pro/print/document/bf096fd0-c9be-4905-b654-9e30bbc27373/ticket&embedded=true`
                this.url_preview = `${this.gview}${this.getBaseUrl()}/print/${this.documentType}/${this.externalId}/${this.getPrintFormatPdf()}&embedded=true`
                this.hideLoading()

            },
            async open(){
                await this.setUrlPreview()
            },
            close() {
                this.$emit('update:showDialog', false)
            } 
        }
    }
</script>
