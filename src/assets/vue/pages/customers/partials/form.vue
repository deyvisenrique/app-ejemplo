<template>
<f7-sheet :color="theme.name_color_theme" :class="theme.class_bg_body" class="demo-sheet default-h-modal" :opened="showDialog" @sheet:closed="close">
    <f7-toolbar class="bg-white">
        <div class="left padding-horizontal">
            <div class="custom-title-form padding-left text-color-gray">
                <span v-if="recordId">Editar</span>
                <span v-else>Nuevo</span>
                Cliente
            </div>
        </div>
        <div class="right padding-horizontal">
            <f7-link small sheet-close class="no-margin no-padding text-color-gray">
                <f7-icon material="close"></f7-icon>
            </f7-link>
        </div>
    </f7-toolbar>
    <f7-page-content>
        <f7-block style="margin-top: 0px !important" :color="theme.name_color_theme">
            <form class="list no-hairlines-md" id="demo-form-customer">
                <ul>
                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Tipo Doc. Identidad</div>
                            <div class="item-input-wrap input-dropdown-wrap">
                                <select v-model="form.identity_document_type_id" placeholder="Please choose...">
                                    <option value="0">Doc.trib.no.dom.sin.ruc</option>
                                    <option value="1">DNI</option>
                                    <option value="6">RUC</option>
                                </select>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Número</div>

                            <div class="row no-gap" style="width:100%">
                                <div class="col-70">
                                    <div class="item-input-wrap">
                                        <input v-model="form.number" required validate type="text" :maxlength="maxLengthNumber" />
                                        <span class="input-clear-button"></span>
                                    </div>
                                </div>
                                <div class="col-25">
                                    <f7-button style="font-size: 12px;" @click="generalSearchServiceNumber" class="col" icon="fas fa-search fa-fw" fill color="deeppurple">
                                        <template v-if="form.identity_document_type_id === '6'">SUNAT</template>
                                        <template v-if="form.identity_document_type_id === '1'">RENIEC</template>
                                    </f7-button>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Nombre *</div>
                            <div class="item-input-wrap">
                                <input v-model="form.name" required validate type="text" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Nombre comercial</div>
                            <div class="item-input-wrap">
                                <input v-model="form.trade_name" type="text" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Dirección</div>
                            <div class="item-input-wrap">
                                <input v-model="form.address" type="text" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Teléfono</div>
                            <div class="item-input-wrap">
                                <input v-model="form.telephone" type="tel" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label">Correo electrónico</div>
                            <div class="item-input-wrap">
                                <input v-model="form.email" validate type="email" />
                                <span class="input-clear-button"></span>
                            </div>
                        </div>
                    </li>

                    <li class="item-content item-input">
                        <f7-button style="width: 40%;" fill round class="bg-secondary" :color="theme.name_color_theme" @click="submit">Guardar</f7-button>
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
    import {search_number} from "mixins_/search_number"

    export default {
        props: ['showDialog', 'recordId'],
        mixins: [auth, general_functions, search_number],
        data: function () {
            return {
                resource: 'persons',
                records: [],
                form: {},
                theme: {},
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
            await this.getInitialSettings()
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
                    type: 'customers',
                    identity_document_type_id: "6",
                    number: "",
                    name: null,
                    trade_name: null,
                    country_id: "PE",
                    department_id: null,
                    province_id: null,
                    district_id: null,
                    address: null,
                    telephone: null,
                    condition: null,
                    state: null,
                    email: null,
                    perception_agent: false,
                    percentage_perception: 0,
                    more_address: []
                };

            },
            validate() {

                if (!this.form.number) {
                    this.showAlert(`Ingresar el número`)

                    return false
                }

                if (!this.form.name)
                {
                    this.showAlert(`Ingresar el nombre`)
                    return false
                }

                return true
            },
            submit() {
                if (!this.validate()) return

                this.showLoading()

                const resource = (this.recordId) ? `${this.resource}/update` : 'person'

                this.$http.post(`${this.returnBaseUrl()}/${resource}`, this.form, this.getHeaderConfig())
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

                if (errors.number) {
                    message += `${errors.number[0]} <br>`
                }

                if (errors.name) {
                    message += `${errors.name[0]} <br>`
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
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
