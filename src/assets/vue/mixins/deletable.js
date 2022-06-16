export const deletable = {
    methods: {
        destroy(url) {
            return new Promise((resolve) => {

                this.$f7.dialog.confirm('¿Desea eliminar el registro?', 'Eliminar', () => {
                
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

                })

            })
        },

    }
}
