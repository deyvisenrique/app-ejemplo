<template>
    <f7-page class="">
        <f7-block class="bg-blue-magenta no-margin-top elevation-9">
            <f7-block class="text-align-right no-margin-top padding-top">
                <f7-link class="transparent panel-previous" color="white" @click="back">
                <i class="fas fa-times"></i>
                </f7-link>
            </f7-block>
            <f7-block class="no-margin-vertical">
                <p class="text-color-white">
                <f7-icon material="settings" size="44px" class="padding-right"></f7-icon>
                </p>
            </f7-block>
            <f7-block class="no-margin-top padding-bottom">
                <p class="text-color-white">Configuración</p>
            </f7-block>
        </f7-block>
        <f7-block class="no-padding-horizontal">
            <f7-list>
                <f7-list-item title="Imagen en productos">
                    <template #after>
                        <label class="toggle toggle-init color-blue">
                            <input type="checkbox" v-model="form.show_image_item" @change="submit"/>
                            <span class="toggle-icon"></span>
                        </label>
                    </template>
                </f7-list-item>
            </f7-list>
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
