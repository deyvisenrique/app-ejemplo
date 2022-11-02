<template>
<f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">
    <header-layout title="Validador de comprobantes"></header-layout>

    <f7-block>
        <f7-row>
            <f7-col>
                <f7-button class="padding-horizontal" @click="openScanner" :color="theme.name_color_theme" large fill round>
                    Escanear
                </f7-button>
            </f7-col>
        </f7-row>
    </f7-block>

    <template v-if="form.success">
        <f7-block>
            <div class="data-table card">
                <table>
                    <thead>
                        <tr>
                            <th colspan="2" class="text-align-center">
                                <template v-if="form.data.state_type_id === '05'">
                                    <span class="material-icons text-color-green">check_circle</span>
                                </template>
                                <template v-else>
                                    <span class="material-icons text-color-red">highlight_off</span>
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Código</td>
                            <td>{{form.data.state_type_id}}</td>
                        </tr>
                        <tr>
                            <td>Estado del comprobante</td>
                            <td>{{form.data.state_type_description}}</td>
                        </tr>
                        <tr>
                            <td>Estado de la empresa</td>
                            <td>{{form.data.state_ruc}}</td>
                        </tr>
                        <tr>
                            <td>Condición de la empresa</td>
                            <td>{{form.data.condition_ruc}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </f7-block>
    </template>

    <template v-else-if="form.message">
        <f7-block class="bg-color-red padding">
            <p class="text-color-white text-align-center">Error en la petición </p>
            <p class="text-color-white text-align-center">{{ form.message }}</p>
        </f7-block>
    </template>

</f7-page>
</template>

<script>
import {
    auth
} from "mixins_/auth";
import HeaderLayout from "components/layout/Header";
import {
    general_functions,
    scanner
} from "mixins_/general_functions";

export default {
    name: 'ValidateDocument',
    components: {
        HeaderLayout
    },
    mixins: [auth, general_functions, scanner],
    data() {
        return {
            form: {},
            theme: {},
        }
    },
    created() {
        this.initForm()
        this.getInitialSettings()
    },
    methods: {
        initForm() {
            this.form = {
                success: false,
                message: null,
                data: {
                    state_type_id: null,
                    state_type_description: null,
                    code_sunat: null,
                    message_sunat: null,
                    state_ruc: null,
                    condition_ruc: null
                }
            }
        },
        openScanner() {
            const context = this
            cordova.plugins.barcodeScanner.scan(
                (result) => {
                    if (result.text) this.searchDocument(result.text)
                },
                (error) => {
                    context.showAlert(`Error al escanear: ${error}`)
                },
                context.scanner_configuration
            )
        },
        getParams(qr_text) {
            const data = qr_text.split("|")
            return {
                document_type_id: data[1],
                series: data[2],
                number: data[3],
                total: data[5],
                date_of_issue: data[6],
            }
        },
        searchDocument(data) {

            this.showLoading()

            this.$http
                .post(`${this.returnBaseUrl()}/documents/validate-document`, this.getParams(data), this.getHeaderConfig())
                .then(response => {
                    this.form = response.data
                })
                .catch(error => {
                    console.log(error)
                    this.showAlert(`Error en la petición: ${error}`)
                })
                .then(() => {
                    this.hideLoading()
                })
        },
        getInitialSettings() {
            this.theme = this.getThemeSettings()
        },
    }
}
</script>
