 
export const general_functions = {
    methods: {
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
