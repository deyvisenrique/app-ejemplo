
export const general_functions = {
    computed: {
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
            this.form.subtotal = _.round(total, 2)
            this.form.total = _.round(total, 2)
        }
    }
}

