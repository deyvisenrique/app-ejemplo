// usa el mixin general_functions y auth

export const deletable = {
    methods: {
        destroy(url)
        {
            return new Promise((resolve) => {
                
                this.showDialogConfirm({
                    title: 'Eliminar',
                    text: '¿Desea eliminar el registro?',
                    buttons: [
                        {
                            text: 'Cancelar',
                        },
                        {
                            text: 'Eliminar',
                            onClick: () => this.httpDelete(url, resolve)
                        },
                    ]
                })
            })
        },
        changeActive(url, active)
        {
            return new Promise((resolve) => {
                
                let title = null
                let text = null

                if(active)
                {
                    title = 'Habilitar'
                    text = '¿Desea habilitar el registro?'
                }
                else
                {
                    title = 'Inhabilitar'
                    text = '¿Desea inhabilitar el registro?'
                }
                
                this.showDialogConfirm({
                    title: title,
                    text: text ,
                    buttons: [
                        {
                            text: 'Cancelar'
                        },
                        {
                            text: 'Aceptar',
                            onClick: () => this.httpGet(url, resolve)
                        },
                    ]
                })
            })
        },
        closeCash(url)
        {
            return new Promise((resolve) => {
                
                this.showDialogConfirm({
                    title: 'Cerrar caja',
                    text: '¿Está seguro de cerrar la caja?',
                    buttons: [
                        {
                            text: 'Cancelar',
                        },
                        {
                            text: 'Cerrar',
                            onClick: () => this.httpGet(url, resolve)
                        },
                    ]
                })
            })
        },
        httpGet(url, resolve)
        {
            this.showLoading()
            this.$http.get(url, this.getHeaderConfig())
                .then(res => {
                    this.showAlert(res.data.message)
                    resolve()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        this.showAlert('Error al realizar la petición')
                    } else {
                        console.log(error.response.data.message)
                    }
                })
                .then(()=>{
                    this.hideLoading()
                })
        },
        httpDelete(url, resolve)
        {
            this.showLoading()
            this.$http.delete(url, this.getHeaderConfig())
                .then(res => {
                    this.showAlert(res.data.message)
                    resolve()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        this.showAlert('Error al intentar eliminar')
                    } else {
                        console.log(error.response.data.message)
                    }
                })
                .then(()=>{
                    this.hideLoading()
                })

        },

    }
}
