<template>
 
    <f7-sheet class="demo-sheet" color="bluemagenta" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical padding-top">
                <f7-link small sheet-close class="no-margin-horizontal  text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
                
            <f7-block style="margin-top: 0px !important;" color="bluemagenta">
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
            <!-- <f7-block class="display-flex justify-content-center">
                <f7-button style="width: 40%;" fill round color="pink" @click="sendEmail" outline>Enviar</f7-button>
            </f7-block> -->
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
            submit(){

                if(!this.form.documents[0].description)
                {
                    return this.showAlert('El motivo de anulación es obligatorio')
                }

                // this.showLoading()

                // this.$http.post(`${this.url}`, this.form, this.getHeaderConfig())
                //     .then(response => {

                //         if (response.data.success) {
                //             this.showAlert('Correo electrónico enviado')
                //             this.close()
                //         }

                //     })
                //     .catch(error => {

                //         console.log(error)
                //         alert(`Ocurrió un error al guardar: ${error}`)

                //     })
                //     .then(() => {
                //         this.hideLoading()
                //     })

            },
            initForm(){

                this.form = {
                    date_of_reference: null,
                    documents: [
                        {
                            document_id: null,
                            description: null,
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
                this.title = `Anular comprobante: ${document.number}`

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            }
        }
    }
</script>
