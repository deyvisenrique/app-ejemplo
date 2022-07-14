
export const general_functions = {
    methods: {
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
        hasPermissionInModule(module, permissions = null)
        {
            const _permissions = permissions ? permissions : this.getStorage('permissions', true)
            const row = _.find(_permissions, {value: module})
            
            return !_.isEmpty(row)
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

