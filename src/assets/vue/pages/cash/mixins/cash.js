
// usa el mixin general_functions para mostrar dialogos

export const store_cash = {
    data: function () {
        return {
        }
    },
    methods: {
        storeCashDocument(document_id = null, sale_note_id = null){
            
            const cash_document = {
                document_id : document_id,
                sale_note_id : sale_note_id,
            }
            
            this.showLoading()

            this.$http
                .post(`${this.returnBaseUrl()}/cash/store-cash-document`, cash_document, this.getHeaderConfig())
                .then(response => {
                    
                    if (!response.data.success) 
                    {
                        // this.showAlert('Ocurrió un problema al asociar el documento a caja.')
                        console.log('Ocurrió un problema al asociar el documento a caja.')
                    }

                })
                .catch(error => {
                    // this.showAlert()
                    console.log(`Ocurrió un problema al asociar el documento a caja.': ${error.message}`)
                })
                .then(() => {
                    this.hideLoading()
                })
        }, 

    }
}
