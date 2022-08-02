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

                <f7-list-item title="Impresión directa">
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

    import {general_functions, functions_direct_print} from "mixins_/general_functions"
    import { auth } from "mixins_/auth"

    export default {
        mixins: [
            auth, 
            general_functions, 
            functions_direct_print
        ],
        name: "AdvancedConfiguration",
        components: {},
        data: function () {
            return {
                form: {},
                resource: 'app-configurations',
                key_storage: 'app_configuration',
                devices: [],
            }
        },
        async created() {
            await this.initForm()
            await this.initData()
            await this.initDirectPrint() 
        },
        mounted(){
        },
        computed:{
            enabledDirectPrint()
            {
                return this.form.direct_print
            }
        },
        methods: { 
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
                if(this.enabledDirectPrint)
                {
                    this.listDevices()
                }
            },
            listDevices()
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
        }
    }
</script>
