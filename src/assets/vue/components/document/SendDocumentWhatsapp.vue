<template>

    <f7-sheet class="demo-sheet default-h45-modal padding-top"  :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical padding-top">
                <f7-link small sheet-close class="no-margin-horizontal  text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>

            <f7-block style="margin-top: 0px !important;" >
                <form class="list no-hairlines-md" id="demo-form-item">
                    <h3 class="padding-horizontal">
                        {{title}}
                        <span class="margin-left">
                            <f7-icon size="18" class="icon fab fa-whatsapp"></f7-icon>
                        </span>
                    </h3>
                    <ul>
                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Número de celular</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.phone_number" required validate type="number" maxlength="9" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <template v-if="!company.qr_api_enable_ws">
                                    <f7-button fill round class="padding-horizontal" @click="submit">Enviar</f7-button>
                                </template>
                                <template v-else>
                                    <f7-button fill round class="padding-horizontal" @click="submit_message_qr_api">Enviar</f7-button>
                                </template>
                            </div>
                            <div class="item-inner">
                                <f7-button type="success" fill round class="padding-horizontal" @click="submit_message">Enviar Url</f7-button>
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
        props: ['showDialog', 'params', 'response'],
        mixins: [auth, general_functions],
        data: function () {
            return {
                form: {},
                title: null,
                company: {},
                form_qr_api: {}
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
            this.getRecordQrApi()
            
        },
        methods: {
            validateData()
            {
                if(!this.form.phone_number) return this.generalResponse(false, 'El número es obligatorio.')

                if(this.form.phone_number.length !== 9) return this.generalResponse(false, 'El número de teléfono debe tener 9 dígitos.')

                return this.generalResponse()
            },
            async submit()
            {
                const validate_data = this.validateData()
                if(!validate_data.success) return this.showAlert(validate_data.message)

                this.showLoading()

                await this.$http.post(`${this.returnBaseUrl()}/documents/send-document-to-whatsapp`, this.form, this.getHeaderConfig())
                            .then(response => {

                                if(response.data.success)
                                {
                                    // this.close()
                                    this.generalSuccessNotification(response.data.message)
                                }
                                else
                                {
                                    this.generalErrorNotification(response.data.message, 4000)
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                            .then(() => {
                                this.hideLoading()
                            })

            },
            initForm()
            {
                this.form = {
                    id: null,
                    document_type_id: null,
                    phone_number: null,
                    format: null,
                }
            },
            async open()
            {
                await this.initForm()
                await this.setData()
                
            },
            setData()
            {
                this.title = `Enviar comprobante`

                this.form.id = this.params.id
                this.form.document_type_id = this.params.document_type_id
                this.form.format = this.params.format

                if(this.params.phone_number) this.form.phone_number = this.params.phone_number

            },
            getRecordQrApi(){
                this.$http
                    .get(`${this.returnBaseUrl()}/record/qrapi`, this.getHeaderConfig())
                    .then(response => {
                        this.company = response.data;
                    });
            },
            close()
            {
                this.$emit('closeSendDocumentWhatsapp')
                this.$emit('update:showDialog', false)
                this.initForm()
            },
            submit_message() {
                const validate_data = this.validateData()
                if(!validate_data.success) return this.showAlert(validate_data.message)
                // mensaje web de whatsapp
                let message = `Hola, revisa tu comprobante ingresando a este link ${this.params.url_pdf}`;
                let message_ = message.split(" ").join("%20");
                window.open(`https://wa.me/51${this.form.phone_number}/?text=${message_}`, "_system");
            },
            submit_message_qr_api(){
                const validate_data = this.validateData()
                if(!validate_data.success) return this.showAlert(validate_data.message)

                let response_ws = this.response.data_ws

                this.convertFileToBase64(response_ws.pdf_a4_filename)
                    .then(file_enode64 => {
                        this.setForm(file_enode64, response_ws.full_filename)

                        return this.$http.post(`${this.company.qr_api_url_ws}\\api\\message\\send\\pdf`, this.form_qr_api, {
                             headers: {
                                "Authorization" : `Bearer ${this.company.qr_api_key_ws}`
                            }
                        })
                        .then(response => {
                            
                            if (response.status === 200) {
                               return this.generalSuccessNotification("Documento enviado con exito") 
                            }
                        })
                        .catch(error => {
                            return this.generalErrorNotification("No se puedo enviar el documento")
                        })
                    })

            },
             setForm(base64file, full_filename) {
                let ws = this.response.data_ws
            this.form_qr_api = {
                file: base64file,
                number: `51${this.form.phone_number}`,
                message: ws.message_text,
                filename: full_filename 
            }
        },
        async convertFileToBase64(url) {
            try {
                const response = await fetch(url, this.getHeaderConfig()) 
                const blob = await response.blob();
                return await this.blobToBase64(blob);
            } catch (error) {
                return this.generalErrorNotification('Error al convertir el archivo a base64:')
            }
        },
        blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]); // Quitar la parte 'data:*/*;base64,'
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        },



        }
    }
</script>
