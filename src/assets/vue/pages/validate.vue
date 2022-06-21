<template>
    <f7-page class="page-red" color="white">
        <f7-block>
            <div class="left">
                <a class="link back text-color-white">
                    <i class="icon icon-back"></i>
                    <span class="if-not-md">Back</span>
                </a>
            </div>
        </f7-block>
        <f7-block-title class="text-align-center text-color-white">
            <p>Escanea el código QR del comprobante para validar el estado.</p>
        </f7-block-title>

        <f7-block>
            <f7-row>
                <f7-col>
                    <f7-button class="button-fill" @click="openScanner" color="blue">Escanear</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>

        <template v-if="form.success">
            <f7-block >
                <f7-card  class="demo-card-header-pic padding">
                    <f7-card-content>
                        <div class="row">
                            <div class="col-100">
                                <span class="c-text-bold">Código:</span>
                                {{form.data.state_type_id}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-70">
                                <span class="c-text-bold">
                                    Estado del comprobante:
                                </span>
                                {{form.data.state_type_description}}
                            </div>
                            <div class="col-30">
                                <template v-if="form.data.state_type_id === '05'">
                                    <span class="material-icons icon-color-success">check_circle</span>
                                </template>
                                <template v-else>
                                    <span class="material-icons icon-color-danger">highlight_off</span>
                                </template>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-100">
                                <span class="c-text-bold">Estado de la empresa:</span>
                                {{form.data.state_ruc}}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-100">
                                <span class="c-text-bold">Condición de la empresa:</span>
                                {{form.data.condition_ruc}}
                            </div>
                        </div>
                    </f7-card-content>
                </f7-card>
            </f7-block>
        </template>

        <template v-else-if="form.message">
            <f7-block>
                <f7-card  class="demo-card-header-pic">
                    <f7-card-content>
                        <div class="row">
                            <div class="col-100">
                               <span class="c-text-bold">Error en la petición:</span> {{ form.message }}
                            </div>
                        </div>
                    </f7-card-content>
                </f7-card>
            </f7-block>
        </template>

    </f7-page>
</template>

<script>

    import {auth} from "mixins_/auth"
    import {general_functions, scanner} from "mixins_/general_functions"

    export default {
        name: 'ValidateDocument',
        mixins: [auth, general_functions, scanner],
        data() {
            return {
                form: {},
            }
        },
        created() {
            this.initForm()
        },
        methods: {
            initForm() {
                this.form = {
                    success: false,
                    message: null,
                    data: {
                        state_type_id: null,
                        state_type_description: null,
                        code_sunat: null,
                        message_sunat: null,
                        state_ruc: null,
                        condition_ruc: null
                    }
                }
            },
            openScanner() {

                const context = this 
                cordova.plugins.barcodeScanner.scan( 
                    (result) => { 
                        if(result.text) this.searchDocument(result.text)
                    }, 
                    (error) => { 
                        context.showAlert(`Error al escanear: ${error}`)
                    }, 
                    context.scanner_configuration
                )

            },
            getParams(qr_text) {

                const data = qr_text.split("|")

                return {
                    document_type_id: data[1],
                    series: data[2],
                    number: data[3],
                    total: data[5],
                    date_of_issue: data[6],
                }
            },
            searchDocument(data) {

                this.showLoading()

                this.$http
                    .post(`${this.returnBaseUrl()}/documents/validate-document`, this.getParams(data), this.getHeaderConfig())
                    .then(response => {
                        this.form = response.data
                    })
                    .catch(error => {
                        console.log(error)
                        this.showAlert(`Error en la petición: ${error}`)
                    })
                    .then(() => {
                        this.hideLoading()
                    })
            }
        }
    }

</script>
