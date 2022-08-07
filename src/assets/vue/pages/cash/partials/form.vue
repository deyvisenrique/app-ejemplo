<template>
<f7-sheet class="demo-sheet default-h40-modal padding-top" :opened="showDialog" @sheet:closed="close">
    <f7-page-content>
        <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
            <f7-link small sheet-close class="no-margin no-padding text-color-gray">
                <f7-icon material="close"></f7-icon>
            </f7-link>
        </f7-block>
        <f7-block style="margin-top: 0px !important" color="green">
            <form class="list no-hairlines-md" id="demo-form-customer">
                <ul>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Saldo inicial *</div>
                            <div class="item-input-wrap">
                                <input v-model="form.beginning_balance" required  type="number" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Número de Referencia</div>
                            <div class="item-input-wrap">
                                <input v-model="form.reference_number" type="text" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <f7-button style="width: 40%;" fill round color="green" @click="submit">Guardar</f7-button>
                    </li>
                </ul>
            </form>
        </f7-block>
    </f7-page-content>
</f7-sheet>
</template>

<script>

    import {auth} from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"

    export default {
        props: ['showDialog', 'recordId'],
        mixins: [auth, general_functions],
        data: function () {
            return {
                resource: 'cash',
                form: {},
            }
        },
        watch: {
            showDialog(newValue) {
                if (newValue) {
                    this.open()
                }
            }
        },
        async created() {
            await this.initForm()
        },
        methods: {
            open() {
                this.getRecord()
            },
            async getRecord() {

                if (this.recordId) {

                    this.showLoading()

                    await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/record/${this.recordId}`, this.getHeaderConfig())
                        .then(response => {
                            this.form = response.data.data
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.hideLoading()
                        })

                }

            },
            initForm() {

                this.form = {
                    id: null,
                    user_id: null,
                    date_opening: null,
                    time_opening: null,
                    date_closed: null,
                    time_closed: null,
                    beginning_balance: 0,
                    final_balance: 0,
                    income: 0,
                    state: true,
                    reference_number: null
                }

            },
            submit() {

                this.showLoading()

                this.$http.post(`${this.returnBaseUrl()}/${this.resource}`, this.form, this.getHeaderConfig())
                    .then(response => {

                        this.showAlert(`${response.data.msg ? response.data.msg : response.data.message}`)

                        if (response.data.success) {
                            this.$eventHub.$emit('reloadData')
                            this.close()
                        }

                    })
                    .catch(error => {

                        if (error.response.status === 422) {
                            const errors = error.response.data.message
                            let validator = this.validationErros(errors)

                            if (!validator.success) {
                                this.showAlert(`Validaciones: <br>${validator.message}`)
                            }

                        } else {
                            console.log(error)
                            alert(`Ocurrió un error al guardar: ${error}`)
                        }

                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },

            validationErros(errors) {

                let message = ''
                let error = {
                    success: true
                }

                if (errors.beginning_balance) {
                    message += `${errors.beginning_balance[0]} <br>`
                }

                if (message != '') {
                    error = {
                        success: false,
                        message: message
                    }
                }

                return error

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            }
        }
    }
</script>
