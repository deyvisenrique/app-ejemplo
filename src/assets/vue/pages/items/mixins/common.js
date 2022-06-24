// funciones que se usaran para el formulario de registro de item desde el listado y al generar cpe

export const common = {
    data: function () {
        return {
            categories: []
        }
    },
    methods: { 
        async getTables(){
            
            this.showLoading()
                    
            await this.$http.get(`${this.returnBaseUrl()}/items/tables`, this.getHeaderConfig())
                    .then(response => {
                        this.categories = response.data.categories
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .then(()=>{
                        this.hideLoading()
                    })
        },
    }
}