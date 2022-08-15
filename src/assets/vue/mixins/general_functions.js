
export const general_functions = {
    computed: {
    },
    methods: {
        isPosMode(app_mode = null){
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
        async findGeneralDefaultCustomer()
        {
            return await this.$http.get(`${this.returnBaseUrl()}/persons/default-customer`, this.getHeaderConfig())
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
        redirectHome()
        {
            this.$f7router.navigate('/')
        },
        redirectRoute(route)
        {
            this.$f7router.navigate(route)
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
        getThemeSettings() {
            const config = JSON.parse(this.getStorage('app_configuration'))
            const theme_color = config.theme_color // white | blue | red | dark
            const is_unicolor_boxes = config.card_color == 'unicolor' ? true : false
            // logo
            const css_color_fill = theme_color == 'white' ? '#00B19A' : '#fff'
            let css_color_fill_dark = '#4A2CB3'
            // estilos en header
            let class_bg_header = 'bg-blue-magenta'
            let class_bg_body = 'bg-color-white'
            let class_waves_color_fill = 'shape-fill'
            let class_menu_text_color = theme_color == 'white' ? 'text-color-teal' : 'text-color-white'
            const class_header_text_color = theme_color == 'white' ? 'text-color-teal' : 'text-color-white'
            // estilos en home
            let class_box_color = 'bg-blue'
            let class_box_color_shade = is_unicolor_boxes ? 'bg-blue' :'bg-color-blue-shade'
            let class_box_color_tint = is_unicolor_boxes ? 'bg-blue' :'bg-color-blue-shade'
            let class_text_color = theme_color == 'white' ? '' : 'text-color-white'
            // estilos de contenido
            let name_color_theme = 'bluemagenta'
            // panel
            let class_button_color = 'bg-blue'


            switch (theme_color) {
                case 'white':
                    css_color_fill_dark = '#00B19A'
                    class_bg_header = 'bg-color-white-shade'
                    class_bg_body = 'bg-color-white-shade'
                    class_waves_color_fill = 'shape-fill-white'
                    class_box_color = 'bg-color-white'
                    class_box_color_shade = 'bg-color-white'
                    class_box_color_tint = 'bg-color-white'
                    name_color_theme = 'teal'
                    class_button_color = 'bg-color-teal'
                    break;
                case 'red':
                    css_color_fill_dark = '#cb2027'
                    class_bg_header = 'bg-color-red'
                    class_waves_color_fill = 'shape-fill-red'
                    class_box_color = 'bg-color-red'
                    class_box_color_shade = is_unicolor_boxes ? 'bg-color-red' :'bg-color-red-shade'
                    class_box_color_tint = is_unicolor_boxes ? 'bg-color-red' :'bg-color-red-tint'
                    name_color_theme = 'red'
                    class_button_color = 'bg-color-red'
                    break;
                case 'dark':
                    css_color_fill_dark = '#1A1F1D'
                    class_bg_header = 'bg-color-black'
                    class_waves_color_fill = 'shape-fill-black'
                    class_box_color = 'bg-color-black'
                    class_box_color_shade = is_unicolor_boxes ? 'bg-color-black' :'bg-color-black-shade'
                    class_box_color_tint = is_unicolor_boxes ? 'bg-color-black' :'bg-color-black-tint'
                    name_color_theme = 'black'
                    class_button_color = 'bg-color-black'
                    break;
                default:
                    break;
            }

            return {
                theme_color: theme_color,
                is_unicolor_boxes: is_unicolor_boxes,
                class_bg_home_icon : 'home-icon home-icon-'+theme_color,
                class_bg_header: class_bg_header,
                class_bg_body: class_bg_body,
                css_color_fill: css_color_fill,
                class_waves_color_fill: class_waves_color_fill,
                class_menu_text_color: class_menu_text_color,
                class_box_color: class_box_color,
                class_box_color_shade: class_box_color_shade,
                class_box_color_tint: class_box_color_tint,
                class_text_color: class_text_color,
                css_color_fill_dark: css_color_fill_dark,
                class_header_text_color: class_header_text_color,
                name_color_theme: name_color_theme,
                class_button_color: class_button_color,
            }
        }
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
        async printPdfDocument(external_id)
        {
            let html_pdf = null
            const print_format_pdf = (this.configuration.print_format_pdf) ? this.configuration.print_format_pdf : 'ticket'
            this.showLoading()

            await this.$http.get(`${this.returnBaseUrl()}/document-print-pdf/document/${external_id}/${print_format_pdf}`, this.getHeaderConfig())
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

            this.form.items.forEach(row => {
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

            this.form.total_exportation = _.round(total_exportation, 2)
            this.form.total_taxed = _.round(total_taxed, 2)
            this.form.total_exonerated = _.round(total_exonerated, 2)
            this.form.total_unaffected = _.round(total_unaffected, 2)
            this.form.total_free = _.round(total_free, 2)
            this.form.total_igv = _.round(total_igv, 2)
            this.form.total_value = _.round(total_value, 2)
            this.form.total_taxes = _.round(total_igv, 2)
            this.form.total = _.round(total, 2)
        }
    }
}

