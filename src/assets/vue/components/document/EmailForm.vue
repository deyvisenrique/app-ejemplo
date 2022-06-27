
                                            

<template> 
    
    <f7-sheet class="demo-sheet" :opened="showDialog" @sheet:closed="close">
        <f7-toolbar>
            <div class="left"></div>
            <div class="right">
                <!-- <f7-link sheet-close>Cancelar</f7-link> -->
            </div>
        </f7-toolbar>
        <f7-page-content>
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
                        <li>
                            <div class="item-inner">
                                <div class="item-input-wrap">
                                    <f7-button style="width: 104%;" @click="sendEmail" outline>Enviar</f7-button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
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
