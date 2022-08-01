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
                            <input type="checkbox" v-model="form.direct_print" @change="submit"/>
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
                devices: [],
            }
        },
        async created() {
            await this.initForm()
            await this.initData()
            await this.initDirectPrint()
        },
        methods: {
            printerConnect()
            {
                BTPrinter.connect(
                    function(data)
                    {
                        // alert("Success");
                        // alert(data)
                    },
                    function(err)
                    {
                        // alert("Error");
                        // alert(err)
                    },
                    this.form.printer_name
                )
            },
            testPrint()
            {
                const context = this

                BTPrinter.connected(
                    function (data) 
                    {
                        // alert(data)
                        if(data)
                        {
                            context.sendPrinter()
                            context.showAlert("Prueba realizada, verifique los datos del usuario en la impresión.")
                        }
                        else
                        {
                            context.showAlert("Impresora no configurada")
                        }

                    }, 
                    function (error) 
                    {
                        context.showAlert(`Ocurrió un error al imprimir: ${error}`)
                    }
                );
            },
            async sendPrinter()
            {
                // BTPrinter.printText(function(data){
                //     alert("Success");
                //     alert(data)
                // },function(err){
                //     alert("Error");
                //     alert(`my err: ${err}`)
                // }, "String to Print")

                // let html_pdf = null 

                // await this.$http.get(`${this.returnBaseUrl()}/document-print-pdf/document/07d8b891-8964-4388-bce8-9c0ce8527284/ticket_50`, this.getHeaderConfig())
                //     .then((response)=>{
                //         html_pdf=response.data
                //         alert(html_pdf)
                //     })
                //     .catch((error)=>{
                //         alert(error)
                //         console.log(error)
                //     })

                
                const text_test = `Prueba impresión \nRUC: ${this.getStorage('ruc')} \nCliente: ${this.getStorage('api_url')} \nUsuario: ${this.getStorage('user_name')} \nCorreo: ${this.getStorage('user_email')}`


                BTPrinter.printTextSizeAlign(function (data) {
                    // alert("alig")
                    // alert(data)
                }, 
                function (err) {
                    
                    alert(`Error: ${err}`)

                }, text_test, '00', '1');
            },

            changeSelectedDevice(index)
            {
                const device = this.devices[index]
                this.form.printer_name = device.name
                this.setStorage(this.key_storage, this.form, true)

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
                        this.printerConnect()
                    }

                }
            },
            getDevicesData(data)
            {
                if(data && _.isArray(data))
                {
                    return _.chunk(data, 3).map((device)=>{
    
                        if(device.length === 3)
                        {
                            return {
                                name: device[0],
                                mac_address: device[1],
                                type: device[2],
                                selected: false,
                            }
                        }
                    })
                }

                return []
            },
            initDirectPrint()
            {
                const context = this

                BTPrinter.list(
                    function(data)
                    {
                        context.devices = context.getDevicesData(data)
                        context.checkSelectedDevice()
                    },
                    function(error)
                    {
                        context.showAlert(`Ocurrió un error al listar los dispositivos: ${error}`)
                    }
                )
                
            },
            initData(){

                const data = this.getStorage(this.key_storage, true)
                if(data) this.form = data

            },
            initForm() {
                this.form = {
                    show_image_item: false,
                    print_format_pdf: 'ticket',
                    direct_print: false,
                    printer_name: null,
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
                            location.reload()
                            // this.redirectRoute('/')
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
