<template>

    <f7-sheet class="demo-sheet default-h35-modal padding-top" color="green" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical padding-top">
                <f7-link small sheet-close class="no-margin-horizontal  text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>

            <f7-block style="margin-top: 0px !important;" color="green">
                <form class="list no-hairlines-md" id="demo-form-item">
                    <h3 class="padding-horizontal">{{title}}</h3>
                    <ul>
                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Motivo de anulación</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.documents[0].description" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <f7-button fill round color="red" class="padding-horizontal" @click="submit">Anular</f7-button>
                            </div>
                        </li>

                    </ul>
                </form>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

</template>

<script>

    import {general_functions} from "mixins_/general_functions"
    import { auth } from "mixins_/auth"

    export default {
        props: ['showDialog', 'record'],
        mixins: [auth, general_functions],
        data: function () {
            return {
                form: {},
                title: null,
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
            this.initForm()
        },
        methods: {
            getDataToApi(){

                let documentos = []

                this.form.documents.forEach(document => {
                    documentos.push({
                        external_id: document.external_id,
                        motivo_anulacion: document.description
                    })
                })

                return {
                    fecha_de_emision_de_documentos: this.form.date_of_reference,
                    documentos: documentos,
                }

            },
            async submit(){

                if(!this.form.documents[0].description)
                {
                    return this.showAlert('El motivo de anulación es obligatorio')
                }

                this.showLoading()

                await this.$http.post(`${this.returnBaseUrl()}/voided`, this.getDataToApi(), this.getHeaderConfig())
                    .then(response => {

                        // console.log(response)

                        if (response.data.success)
                        {
                            this.voidedQuery(response.data.data)
                        }
                        else{
                            this.showAlert('No se pudo generar la anulación.')
                        }

                    })
                    .catch(error => {
                        console.log(error)
                        this.showAlert(`Ocurrió un error al generar la anulación: ${error.response.data.message}`)
                        this.hideLoading()
                    })

            },
            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async voidedQuery(data){

                // this.showLoading()
                await this.sleep(5000)

                const form = {
                    external_id: data.external_id,
                    ticket: data.ticket
                }

                const error_message = 'Ocurrió un error al consultar el ticket de la anulación, debe consultarlo desde la web para finalizar el proceso'

                await this.$http.post(`${this.returnBaseUrl()}/voided/status`, form, this.getHeaderConfig())
                    .then(response => {

                        // console.log(response)

                        if (response.data.success)
                        {
                            this.showAlert(response.data.response.description)
                        }
                        else{
                            this.showAlert(`${error_message}.`)
                        }

                    })
                    .catch(error => {
                        console.log(error)
                        this.showAlert(`${error_message}, error: ${error.response.data.message}`)
                    })
                    .finally(() => {
                        this.$eventHub.$emit('reloadDocuments')
                        this.hideLoading()
                        this.close()
                    })

            },
            initForm(){

                this.form = {
                    date_of_reference: null,
                    documents: [
                        {
                            document_id: null,
                            description: null,
                            external_id: null,
                        }
                    ]
                }

            },
            async open(){
                await this.initForm()
                await this.setData()
            },
            setData(){

                const document = this.record
                this.form.date_of_reference = document.date_of_issue
                this.form.documents[0].document_id = document.id
                this.form.documents[0].external_id = document.external_id

                this.title = `Anular comprobante: ${document.number}`

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            }
        }
    }
</script>
