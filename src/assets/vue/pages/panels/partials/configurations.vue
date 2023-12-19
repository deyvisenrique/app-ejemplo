<template>
    <div>
        <f7-list class="no-margin-top">
            <f7-list-item title="Configuración de cuenta" @click.native="pageLogin()" link="#"></f7-list-item>
            <f7-list-item title="Listado de productos con imagen">
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
            <template v-if="check_is_pos_mode">
                <f7-list-item smart-select :smart-select-params="{openIn: 'popover'}">
                    <template #title>
                        Documento por defecto
                        <span class="badge">{{ getSelectedDocumentType() }}</span>
                    </template>
                    <select v-model="form.default_document_type" @change="saveOnlyConfigStorage" class="full-width bg-color-blue">
                        <option v-for="(option, index) in default_document_types" :value="option.id" :key="index">{{ option.description }}</option>
                    </select>
                </f7-list-item>
                <f7-list-item title="Agregar impresora bluetooth">
                    <template #after>
                        <label class="toggle toggle-init color-blue">
                            <input type="checkbox" v-model="form.direct_print" @change="changeDirectPrint"/>
                            <span class="toggle-icon"></span>
                        </label>
                    </template>
                </f7-list-item>
                <template v-if="form.direct_print">
                    <f7-list-item v-if="form.printer_name" :title="`Impresora: ${form.printer_name}`">
                        <f7-button @click="testPrint">
                            Prueba
                        </f7-button>
                    </f7-list-item>
                    <f7-block-title><b>Dispositivos sincronizados</b></f7-block-title>
                    <template v-if="devices.length > 0">
                        <f7-list>
                            <f7-list-item radio radio-icon="start" :checked="device.selected" :title="device.name" name="demo-radio-start" v-for="(device, index) in devices" :key="index" @change="changeSelectedDevice(index)"></f7-list-item>
                        </f7-list>
                    </template>
                    <template v-else>
                        <f7-block-header class="padding-horizontal">No tiene dispositivos sincronizados</f7-block-header>
                    </template>
                </template>
            </template>
        </f7-list>
    </div>
</template>

<script>
import {general_functions, functions_direct_print} from "mixins_/general_functions"
import {auth} from "mixins_/auth"

export default {
    mixins: [
        general_functions,
        functions_direct_print,
        auth
    ],
    data: function () {
        return {
            form: {},
            resource: 'app-configurations',
            key_storage: 'app_configuration',
            devices: [],
            check_is_pos_mode: false,
            default_document_types: [
                {id: '01', description: 'FACTURA'},
                {id: '03', description: 'BOLETA'},
                {id: '80', description: 'N. VENTA'},
            ],
            theme: {},
        }
    },
    async created() {

        await this.events()
        await this.checkPosMode()
        await this.initForm()
        await this.getInitialSettings()
        await this.initData()
        await this.initDirectPrint()

    },
    mounted(){
    },
    computed:{
        enabledDirectPrint()
        {
            return this.form.direct_print
        },
    },
    methods: {
        getSelectedDocumentType()
        {
            const default_document_type_id = '03'
            this.form.default_document_type = this.form.default_document_type ? this.form.default_document_type : default_document_type_id

            const document_type = _.find(this.default_document_types, {id : this.form.default_document_type})
            if(document_type) return document_type.description
        },
        checkPosMode(is_pos_mode = null)
        {
            this.check_is_pos_mode = this.isPosMode(is_pos_mode)
        },
        events()
        {
            this.$eventHub.$on('appMode', (is_pos_mode) => {
                this.checkPosMode(is_pos_mode)
            })
        },
        async testPrint()
        {
            const context = this
            await context.showLoading()
            await context.generalSleep(1000)
            await context.printerDisconnect(this.form.printer_name)
            await context.printerConnect(this.form.printer_name)
            await context.generalCheckConnectionSendPrint()
            await context.hideLoading()
        },
        getTextTest()
        {
            return `Prueba impresión \nRUC: ${this.getStorage('ruc')} \nCliente: ${this.getStorage('api_url')} \nUsuario: ${this.getStorage('user_name')} \nCorreo: ${this.getStorage('user_email')}`
        },
        generalPrinterDocument()
        {
            const context = this
            const text_test = context.getTextTest()

            BTPrinter.printTextSizeAlign(
                function (data)
                {
                    if(data)
                    {
                        context.showAlert('Prueba realizada, verifique los datos del usuario en la impresión.')
                    }
                },
                function (error)
                {
                    context.showAlert(`Ocurrió un error al imprimir: ${error}`)
                },
                text_test,
                '00',
                '1'
            )
        },
        changeSelectedDevice(index)
        {
            const device = this.devices[index]
            this.form.printer_name = device.name
            this.setStorage(this.key_storage, this.form, true)
            this.redirectMainRoute('/')
            this.generalSuccessNotification('Impresora seleccionada')
        },
        checkSelectedDevice()
        {
            if(this.form.direct_print)
            {
                const printer = _.find(this.devices, {name : this.form.printer_name})

                if(printer)
                {
                    printer.selected = true
                }
            }
        },
        async setDevicesData(data)
        {
            if(data && _.isArray(data))
            {
                const parse_data = _.chunk(data, 3)

                await parse_data.forEach(device => {

                    if(device.length === 3)
                    {
                        this.devices.push({
                            name: device[0],
                            mac_address: device[1],
                            type: device[2],
                            selected: false,
                        })
                    }
                })

                await this.checkSelectedDevice()
            }
        },
        initDirectPrint()
        {
            if(this.enabledDirectPrint && this.check_is_pos_mode)
            {
                this.listDevices()
            }
        },
        btPrinterList()
        {
            const context = this

            BTPrinter.list(
                function(data)
                {
                    context.setDevicesData(data)
                },
                function(error)
                {
                    context.showAlert(`Ocurrió un error al listar los dispositivos: ${error}`)
                }
            )
        },
        listDevices()
        {
            const context = this
            const permissions = cordova.plugins.permissions

            permissions.hasPermission(
                permissions.BLUETOOTH_CONNECT,
                function(status)
                {
                    if (status.hasPermission)
                    {
                        context.btPrinterList()
                    }
                    else
                    {
                        permissions.requestPermission(
                            permissions.BLUETOOTH_CONNECT,
                            function(status)
                            {
                                if(!status.hasPermission) return alert("Error al solicitar permiso: "+JSON.stringify(status))
                                context.btPrinterList()
                            }
                            ,
                            function()
                            {
                                alert('El permiso BLUETOOTH no está activado.')
                            }
                        )

                    }
                }
            )

            // BTPrinter.list(
            //     function(data)
            //     {
            //         context.setDevicesData(data)
            //     },
            //     function(error)
            //     {
            //         context.showAlert(`Ocurrió un error al listar los dispositivos: ${error}`)
            //     }
            // )
        },
        initData()
        {
            const data = this.getStorage(this.key_storage, true)

            if(data)
            {
                this.form = {
                    show_image_item: data.show_image_item,
                    print_format_pdf: data.print_format_pdf,
                    direct_print: data.direct_print,
                    printer_name: data.printer_name,
                    default_document_type: data.default_document_type,
                    direct_send_documents_whatsapp: data.direct_send_documents_whatsapp,
                    // number_columns_list_items_sale: data.number_columns_list_items_sale ? data.number_columns_list_items_sale : 2,
                }
            }
        },
        initForm()
        {
            this.form = {
                show_image_item: false,
                print_format_pdf: 'ticket',
                direct_print: false,
                printer_name: null,
                default_document_type: '03',
                direct_send_documents_whatsapp: false,
                // number_columns_list_items_sale: 2
            }
        },
        async changeDirectPrint()
        {
            if(this.form.direct_print)
            {
                await this.listDevices()
            }
            else
            {
                await this.printerDisconnect()
                this.form.printer_name = null
                this.devices = []
                this.redirectMainRoute('/')
            }

            this.submit()
        },
        saveConfigStorage(data = null)
        {
            this.setStorage(this.key_storage, data ? data : this.form, true)
        },
        saveOnlyConfigStorage()
        {
            this.generalSuccessNotification('Configuración actualizada')
            this.saveConfigStorage()
        },
        submit()
        {

            this.showLoading()
            this.$http.post(`${this.returnBaseUrl()}/${this.resource}`, this.form, this.getHeaderConfig())
                .then(response => {

                    this.generalSuccessNotification(response.data.message)

                    if(response.data.success)
                    {
                        this.saveConfigStorage()
                        // this.setStorage(this.key_storage, response.data.data, true)
                    }

                })
                .catch(error => {

                    console.log(error)
                    this.showAlert(`Ocurrió un error al guardar: ${error}`)

                })
                .then(() => {
                    this.hideLoading()
                })

        },
        back() {
            this.$f7router.navigate("/panel-right/")
        },
        getInitialSettings() {
            this.theme = this.getThemeSettings()
        },
        pageLogin() {
            this.redirectRoute('/configuration/')
        }
    }
}
</script>