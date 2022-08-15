<template>

    <!-- <f7-sheet class="demo-sheet default-h30-modal" style="" :opened="showDialog" @sheet:closed="close">
        <f7-toolbar>
            <div class="left"></div>
            <div class="right">
                <f7-link sheet-close>Cerrar</f7-link>
            </div>
        </f7-toolbar> -->
    <f7-sheet class="demo-sheet" :color="theme.name_color_theme" :opened="showDialog" @sheet:closed="close">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical padding-top">
                <f7-link small sheet-close class="no-margin-horizontal  text-color-gray">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block>
                <f7-row>
                    <f7-col width="85">
                        <div class="list no-hairlines-md" style="display:inline !important">
                            <ul>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-floating-label">Correo electrónico</div>
                                        <div class="item-input-wrap">
                                            <input v-model="form.email" type="email"  />
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </f7-col>
                    <f7-col width="15" class="mt-15" >
                        <f7-button  @click="sendEmail" outline icon="fas fa-envelope"></f7-button>
                    </f7-col>
                </f7-row>
            </f7-block>
            <!-- <f7-block class="display-flex justify-content-center">
                <f7-button style="width: 40%;" fill round :color="theme.name_color_theme" @click="sendEmail" outline>Enviar</f7-button>
            </f7-block> -->
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
            this.getInitialSettings()
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
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
