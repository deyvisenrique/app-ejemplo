<template>

    <f7-sheet class="demo-sheet" color="bluemagenta" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical padding-top">
                <f7-link small sheet-close class="no-margin-horizontal  text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block>
                <div class="list no-hairlines-md">
                    <ul>
                        <li class="item-content item-input item-input-outline ">
                            <div class="item-inner full-width">
                                <div class="item-title item-floating-label">Correo electrónico</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.email" type="email"  />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </f7-block>
            <f7-block class="display-flex justify-content-center">
                <f7-button style="width: 40%;" fill round color="pink" @click="sendEmail" outline>Enviar</f7-button>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

</template>

<script>

    import {general_functions} from "mixins_/general_functions"
    import { auth } from "mixins_/auth"

    export default {
        props: ['showDialog', 'url', 'recordId'],
        mixins: [auth, general_functions],
        data: function () {
            return {
                form: {},
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
        },
        methods: {
            sendEmail(){

                if(!this.form.email)
                {
                    return this.showAlert('El correo electrónico es obligatorio')
                }

                this.showLoading()

                this.$http.post(`${this.url}`, this.form, this.getHeaderConfig())
                    .then(response => {

                        if (response.data.success) {
                            this.showAlert('Correo electrónico enviado')
                            this.close()
                        }

                    })
                    .catch(error => {

                        console.log(error)
                        alert(`Ocurrió un error al guardar: ${error}`)

                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },
            initForm(){

                this.form = {
                    email: null,
                    cash_id: this.recordId
                }

            },
            async open(){
                await this.initForm()
            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            }
        }
    }
</script>
