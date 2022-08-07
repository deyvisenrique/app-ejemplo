<template>
    <f7-page class="" color="green">
        <f7-block class="bg-blue-magenta no-margin-top elevation-9">
            <f7-block class="text-align-right no-margin-top padding-top">
                <f7-link class="transparent panel-previous" color="green" @click="back">
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
                <f7-list-item smart-select :smart-select-params="{openIn: 'popover'}">
                    <template #title>
                        Formato PDF (CPE)
                        <span class="badge" v-if="form.print_format_pdf == 'ticket'">80mm</span>
                        <span class="badge" v-if="form.print_format_pdf == 'ticket_58'">58mm</span>
                        <span class="badge" v-if="form.print_format_pdf == 'ticket_50'">50mm</span>
                        <span class="badge" v-if="form.print_format_pdf == 'a4'">A4</span>
                    </template>
                    <select v-model="form.print_format_pdf" @change="submit" class="full-width bg-color-blue">
                        <option value="ticket">Ticket 80mm</option>
                        <option value="ticket_58">Ticket 58mm</option>
                        <option value="ticket_50">Ticket 50mm</option>
                        <option value="a4">A4</option>
                    </select>
                </f7-list-item>
            </f7-list>
        </f7-block>
        <div class="configuration-footer">
        </div>
    </f7-page>
</template>
<style>
  .demo-icon {
    background: #EE350F;
    color: #fff;
    border-radius: 50%;
    text-align: center;
  }
</style>
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

                        this.generalSuccessNotification(response.data.message)

                        // this.showAlert(response.data.message)

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
