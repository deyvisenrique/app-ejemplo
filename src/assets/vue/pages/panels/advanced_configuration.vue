<template>
    <f7-page class="panel-dark">
        <f7-block>
            <p center class="text-color-white">
                <f7-icon material="settings" class="padding-right padding-left"></f7-icon>
                Configuración
            </p>
        </f7-block>
        <hr>
        <f7-block>
            <f7-card color="red">
                <f7-card-content>
                    <f7-row no-gap>
                        <f7-col>
                            <div>
                                <p>Mostrar imágen en productos</p>
                                <label class="toggle toggle-init color-blue">
                                    <input type="checkbox" v-model="form.show_image_item" @change="submit"/>
                                    <span class="toggle-icon"></span>
                                </label>
                            </div>
                        </f7-col>
                    </f7-row>
                    
                    <f7-row no-gap>
                        <f7-col>
                            <div>
                                <p>Formato de impresión (CPE)</p>
                                <select v-model="form.print_format_pdf" @change="submit" class="full-width custom-select-bgcolor">
                                    <option value="ticket">Ticket 80mm</option>
                                    <option value="ticket_58">Ticket 58mm</option>
                                    <option value="ticket_50">Ticket 50mm</option>
                                    <option value="a4">A4</option>
                                </select>
                            </div>

                        </f7-col>
                    </f7-row>

                </f7-card-content>
            </f7-card>
        </f7-block>
        <div class="configuration-footer">
            <f7-block>
                <!-- <f7-button class="trasnparent" color="white" @click="submit">
                    <f7-icon material="save" size="20"></f7-icon>
                    Guardar
                </f7-button> -->
                <f7-button class="trasnparent panel-previous" color="white" @click="back">
                    <f7-icon material="keyboard_arrow_left" size="20"></f7-icon>
                    Volver
                </f7-button>
            </f7-block>
        </div>
    </f7-page>
</template>

<script>

    import {general_functions} from "mixins_/general_functions"
    import { auth } from "mixins_/auth"

    export default {
        mixins: [auth, general_functions],
        name: "AdvancedConfiguration",
        components: {},
        data: function () {
            return {
                form: {},
                resource: 'app-configurations',
                key_storage: 'app_configuration',
            }
        },
        created() {
            this.initForm()
            this.initData()
        },
        methods: {
            initData(){

                const data = this.getStorage(this.key_storage, true)
                if(data) this.form = data

            },
            initForm() {
                this.form = {
                    show_image_item: false,
                    print_format_pdf: 'ticket',
                }
            },
            submit() {

                this.showLoading()
                this.$http.post(`${this.returnBaseUrl()}/${this.resource}`, this.form, this.getHeaderConfig())
                    .then(response => {

                        this.showAlert(response.data.message)
                        
                        if(response.data.success)
                        {
                            this.setStorage(this.key_storage, response.data.data, true)
                            // this.$eventHub.$emit('reloadPageItem')
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
            back() {
                this.$f7router.navigate("/panel-right/")
            },
        }
    }
</script>
