
import _ from "lodash"
import {functions_theme_premiun} from "mixins_/functions_theme_premiun"

export const general_functions = {
    mixins: [functions_theme_premiun],
    data(){
        return {
            general_theme: {
                css_color_fill: null,
                class_menu_text_color: null,
                class_header_text_color: null,
                class_text_color: null,
                css_color_fill_dark: null,
                class_bg_header: null,
                class_bg_body: null,
                class_waves_color_fill: null,
                class_box_color: null,
                class_box_color_shade: null,
                class_box_color_tint: null,
                name_color_theme: null,
                class_button_color: null,
            }
        }
    },
    computed: {
        applyDirectSendDocumentsWhatsapp()
        {
            const config = this.getInitialConfiguration()

            if(config != undefined && !_.isEmpty(config))
            {
                if(config.direct_send_documents_whatsapp != undefined) return config.direct_send_documents_whatsapp
            }

            return false
        }
    },
    methods: {
        isPosMode(app_mode = null)
        {
            const _app_mode = app_mode ? app_mode : this.getStorage('app_mode')
            return _app_mode === 'pos'
        },
        generalSuccessNotification(message, title = 'Notificación')
        {
            this.showGeneralNotification({
                icon: '<span class="material-icons text-color-green" style="font-size: 15px">check_circle</span>',
                title:  title,
                subtitle: message,
                closeTimeout: 2000,
            })
        },
        generalErrorNotification(message, close_timeout = 2000, title = 'Notificación')
        {
            this.showGeneralNotification({
                icon: '<span class="material-icons text-color-red" style="font-size: 15px">highlight_off</span>',
                title:  title,
                subtitle: message,
                closeTimeout: close_timeout,
            })
        },
        showAlert(message, title = 'Mensaje')
        {
            this.showDialogMessage({
                title: title,
                text: message ,
                buttons: [
                    {text: 'Aceptar'}
                ]
            })
        },
        showLoading()
        {
            this.$f7.preloader.show()
        },
        hideLoading()
        {
            this.$f7.preloader.hide()
        },
        showGeneralNotification(params)
        {
            this.$f7.notification.create(params).open()
        },
        showDialogMessage(params)
        {
            this.$f7.dialog.create(params).open()
        },
        showDialogConfirm(params)
        {
            this.$f7.dialog.create(params).open()
        },
        // storage
        setStorage(key, value, is_object = false)
        {
            localStorage.setItem(key, (is_object) ? JSON.stringify(value) : value)
        },
        getStorage(key, is_object = false)
        {
            const data = localStorage.getItem(key)

            if(data && is_object) return JSON.parse(data)

            return data
        },
        removeStorage(key)
        {
            return localStorage.removeItem(key)
        },
        // storage
        getInitialConfiguration()
        {
            const data = this.getStorage('app_configuration', true)

            if(data) return data

            // si no existe configuracion registrada en storage, se retornan valores por defecto

            return {
                show_image_item: true,
                print_format_pdf: 'ticket',
                printer_name: null,
                direct_print: false,
                direct_print: false,
                default_document_type: '03',
                has_igv_31556: false,
                igv_31556_percentage: 0.10,
                direct_send_documents_whatsapp: false,
                // number_columns_list_items_sale: 2,
            }

        },
        getPrintFormatPdf()
        {
            return (this.configuration.print_format_pdf) ? this.configuration.print_format_pdf : 'ticket'
        },
        getBaseUrl()
        {
            return this.getStorage('api_url')
        },
        async findGeneralDefaultCustomer(document_type_id = null)
        {
            const param_document_type_id = document_type_id ? `/${document_type_id}` : ''
            return await this.$http.get(`${this.returnBaseUrl()}/persons/default-customer${param_document_type_id}`, this.getHeaderConfig())
        },
        async getGeneralCustomers()
        {
            return await this.$http.get(`${this.returnBaseUrl()}/document/customers`, this.getHeaderConfig())
        },
        hasPermissionInModule(module, permissions = null)
        {
            const _permissions = permissions ? permissions : this.getStorage('permissions', true)
            const row = _.find(_permissions, {value: module})

            return !_.isEmpty(row)
        },
        getStoragePermissions()
        {
            return this.getStorage('permissions', true)
        },
        redirectHome()
        {
            this.$f7router.navigate('/')
        },
        redirectRoute(route)
        {
            this.$f7router.navigate(route)
        },
        reloadCurrentPage()
        {
            this.$f7router.refreshPage()
        },
        redirectMainRoute(route)
        {
            this.$f7.views.main.router.navigate(route)
        },
        generalResponse(success = true, message = null)
        {
            return {
                success: success,
                message: message,
            }
        },
        getGeneralFormButtons(){
            return [
                {
                    text: 'Imprimir',
                    cssClass: 'text-center',
                    close: false
                },
                {
                    text: 'Ir al listado',
                    cssClass: 'text-center',
                },
                {
                    text: 'Continuar',
                    cssClass: 'text-center'
                },
            ]
        },
        roundNumber(number, decimals = 2){
            return _.round(number, decimals)
        },
        generalSleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        getThemeSettings()
        {
            const custom_theme_premiun = this.existThemePremiun()
            const allowed_theme_premiun = this.allowedThemePremiun(custom_theme_premiun)

            const theme = {
                theme_color: 'blue',
                card_color: 'multicolor'
            }

            if(this.getStorage('app_configuration') === null)
            {
                this.setStorage('app_configuration', theme, true)
            }

            const config = this.getStorage('app_configuration', true)

            // const theme_color = config.theme_color // blue | red | dark
            this.general_theme.theme_color = config.theme_color

            // asigna tema premiun
            if(allowed_theme_premiun) this.setThemePremiun()


            const is_unicolor_boxes = config.card_color == 'unicolor' ? true : false

            // logo
            this.general_theme.css_color_fill = '#fff'
            this.general_theme.css_color_fill_dark = '#4A2CB3'

            // estilos en header
            this.general_theme.class_bg_header = 'bg-blue-magenta'
            this.general_theme.class_bg_body = 'bg-color-white'
            this.general_theme.class_waves_color_fill = 'shape-fill'


            this.general_theme.class_menu_text_color = 'text-color-white'
            this.general_theme.class_header_text_color = 'text-color-white'


            // estilos en home
            this.general_theme.class_box_color = 'bg-blue'
            this.general_theme.class_box_color_shade = is_unicolor_boxes ? 'bg-blue' :'bg-color-blue-shade'
            this.general_theme.class_box_color_tint = is_unicolor_boxes ? 'bg-blue' :'bg-color-blue-tint'
            this.general_theme.class_text_color = 'text-color-white'

            // estilos de contenido
            this.general_theme.name_color_theme = 'bluemagenta'

            // panel
            // let class_button_color = 'bg-blue'
            this.general_theme.class_button_color = 'bg-blue'


            switch (this.general_theme.theme_color) {
                case 'red':
                    this.general_theme.css_color_fill_dark = '#cb2027'
                    this.general_theme.class_bg_header = 'bg-color-red'
                    this.general_theme.class_waves_color_fill = 'shape-fill-red'
                    this.general_theme.class_box_color = 'bg-color-red'
                    this.general_theme.class_box_color_shade = is_unicolor_boxes ? 'bg-color-red' :'bg-color-red-shade'
                    this.general_theme.class_box_color_tint = is_unicolor_boxes ? 'bg-color-red' :'bg-color-red-tint'
                    this.general_theme.name_color_theme = 'red'
                    this.general_theme.class_button_color = 'bg-color-red'
                    break;
                case 'dark':
                    this.general_theme.css_color_fill_dark = '#1A1F1D'
                    this.general_theme.class_bg_header = 'bg-color-black'
                    this.general_theme.class_waves_color_fill = 'shape-fill-black'
                    this.general_theme.class_box_color = 'bg-color-black'
                    this.general_theme.class_box_color_shade = is_unicolor_boxes ? 'bg-color-black' :'bg-color-black-shade'
                    this.general_theme.class_box_color_tint = is_unicolor_boxes ? 'bg-color-black' :'bg-color-black-tint'
                    this.general_theme.name_color_theme = 'black'
                    this.general_theme.class_button_color = 'bg-color-black'
                    break;
                default:
                    break;
            }

            // asigna datos para tema premiun
            if(allowed_theme_premiun) this.setValuesThemePremiun()


            return {
                theme_color: this.general_theme.theme_color,
                is_unicolor_boxes: is_unicolor_boxes,
                class_bg_home_icon : 'home-icon home-icon-'+this.general_theme.theme_color,
                class_bg_header: this.general_theme.class_bg_header,
                class_bg_body: this.general_theme.class_bg_body,
                css_color_fill: this.general_theme.css_color_fill,
                class_waves_color_fill: this.general_theme.class_waves_color_fill,
                class_menu_text_color: this.general_theme.class_menu_text_color,
                class_box_color: this.general_theme.class_box_color,
                class_box_color_shade: this.general_theme.class_box_color_shade,
                class_box_color_tint: this.general_theme.class_box_color_tint,
                class_text_color: this.general_theme.class_text_color,
                css_color_fill_dark: this.general_theme.css_color_fill_dark,
                class_header_text_color: this.general_theme.class_header_text_color,
                name_color_theme: this.general_theme.name_color_theme,
                class_button_color: this.general_theme.class_button_color,
            }
        },
    }
}


export const functions_direct_print = {
    data: function () {
        return {
        }
    },
    methods: {
        isAllowedDirectPrint(param_configuration = null)
        {
            const configuration = param_configuration ? param_configuration : this.getInitialConfiguration()

            return (configuration.direct_print && configuration.printer_name)
        },
        generalCheckConnectionSendPrint()
        {
            const context = this

            BTPrinter.connected(
                function (data)
                {
                    // si esta conectada la impresora
                    if(data)
                    {
                        //este método debe declararse en el componente que usa este mixin e implementar la función "generalPrinterDocument()" que realizará la impresión
                        context.generalPrinterDocument()
                    }
                    else
                    {
                        context.showAlert('Impresora desconectada.')
                    }

                },
                function (error)
                {
                    context.showAlert(`Ocurrió un error al imprimir: ${error}`)
                }
            )
        },
        printerConnect(printer_name)
        {
            const context = this

            BTPrinter.connect(
                function(data)
                {
                    if(data) context.generalSuccessNotification('Impresora conectada')
                },
                function(error)
                {
                    context.generalSuccessNotification(`Ocurrió un error al conectar: ${error}`)
                },
                printer_name
            )
        },
        printerDisconnect(printer_name)
        {
            const context = this

            BTPrinter.disconnect(
                function(data)
                {
                    if(data) context.generalSuccessNotification('Impresora desconectada')
                },
                function(error)
                {
                    context.generalSuccessNotification(`Ocurrió un error al desconectar: ${error}`)
                },
                printer_name
            )
        },
    }
}


export const scanner = {
    data: function () {
        return {
            scanner_configuration: {
                showTorchButton: true,
                torchOn: false,
                saveHistory: true,
                prompt: 'Coloque un código de barras/qr dentro del área de escaneo',
                disableAnimations: false,
                disableSuccessBeep: false
            }
        }
    },
    methods: {
    }
}


export const set_logo = {
    data: function () {
        return {
        }
    },
    methods: {

        setAppLogo(_generals = null)
        {
            const generals = _generals ? _generals : this.getStorage('generals', true)

            const general_app_logo = generals.app_logo
            const url_logo = this.getStorage('url_logo')

            if(general_app_logo && (general_app_logo !== url_logo))
            {
                this.setStorage('url_logo', general_app_logo)
                this.logo = general_app_logo
            }
            else
            {
                if (url_logo) this.logo = url_logo
            }

        }
    }
}


export const print_pdf_document = {
    data: function () {
        return {
        }
    },
    methods: {
        async printPdfDocument(external_id, model)
        {
            let html_pdf = null
            const print_format_pdf = (this.configuration.print_format_pdf) ? this.configuration.print_format_pdf : 'ticket'
            this.showLoading()

            await this.$http.get(`${this.returnBaseUrl()}/document-print-pdf/${model}/${external_id}/${print_format_pdf}`, this.getHeaderConfig())
                        .then((response)=>{
                            html_pdf=response.data
                        })
                        .catch((error)=>{
                            console.log(error)
                        })

            cordova.plugins.printer.print(html_pdf)

            this.hideLoading()
        }

    }
}


export const operations = {
    data: function () {
        return {
        }
    },
    methods: {
        // usado en modo pos, cpe, nv - cotizacion
        generalCalculateTotal()
        {
            let total_exportation = 0
            let total_taxed = 0
            let total_exonerated = 0
            let total_unaffected = 0
            let total_free = 0
            let total_igv = 0
            let total_value = 0
            let total = 0
            let total_plastic_bag_taxes = 0
            let total_discount = 0

            this.form.items.forEach(row => {

                total_discount += parseFloat(row.total_discount)

                if (row.affectation_igv_type_id === "10") {
                    total_taxed += parseFloat(row.total_value)
                }
                if (row.affectation_igv_type_id === "20") {
                    total_exonerated += parseFloat(row.total_value)
                }
                if (row.affectation_igv_type_id === "30") {
                    total_unaffected += parseFloat(row.total_value)
                }
                if (row.affectation_igv_type_id === "40") {
                    total_exportation += parseFloat(row.total_value)
                }
                if (["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) < 0) {
                    total_free += parseFloat(row.total_value)
                }
                if (
                    ["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) > -1
                ) {
                    total_igv += parseFloat(row.total_igv)
                    total += parseFloat(row.total)
                }
                total_value += parseFloat(row.total_value)
                total_plastic_bag_taxes += parseFloat(row.total_plastic_bag_taxes)
            })

            this.form.total_discount = _.round(total_discount, 2)
            this.form.total_exportation = _.round(total_exportation, 2)
            this.form.total_taxed = _.round(total_taxed, 2)
            this.form.total_exonerated = _.round(total_exonerated, 2)
            this.form.total_unaffected = _.round(total_unaffected, 2)
            this.form.total_free = _.round(total_free, 2)
            this.form.total_igv = _.round(total_igv, 2)
            this.form.total_value = _.round(total_value, 2)
            this.form.total_taxes = _.round(total_igv, 2)
            this.form.subtotal = _.round(total, 2)
            this.form.total = _.round(total, 2)
        }
    }
}

