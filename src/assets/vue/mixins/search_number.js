// usa el mixin general_functions para mostrar dialogos

export const search_number = {
    computed: {
        maxLengthNumber: function () {
            if (this.form.identity_document_type_id === "6") {
                return 11;
            }
            if (this.form.identity_document_type_id === "1") {
                return 8;
            }
        }
    },
    methods: { 
        async generalSearchServiceNumber() {

            if (this.form.number === '') 
            {
                this.showAlert('Ingresar el número a buscar')
                return
            }

            this.showLoading()

            let identity_document_type_name = ''

            if (this.form.identity_document_type_id === '6') {
                identity_document_type_name = 'ruc'
            }

            if (this.form.identity_document_type_id === '1') {
                identity_document_type_name = 'dni'
            }

            try {

                const { data } = await this.$http.get(`${this.returnBaseUrl()}/service/${identity_document_type_name}/${this.form.number}`, this.getHeaderConfig())

                if (data.success) {

                    let resource = data.data

                    if (identity_document_type_name == 'ruc') 
                    {
                        this.form.name = resource.name
                        this.form.trade_name = resource.trade_name
                        this.form.address = resource.address
                        this.form.department_id = resource.department_id
                        this.form.province_id = resource.province_id
                        this.form.district_id = resource.district_id
                        this.form.phone = null
                    } 
                    else if (identity_document_type_name == 'dni') 
                    {
                        this.form.name = resource.name
                        this.form.trade_name = null
                        this.form.address = resource.address
                        this.form.department_id = resource.department_id
                        this.form.province_id = resource.province_id
                        this.form.district_id = resource.district_id
                        this.form.phone = null
                    }

                    this.showAlert(`Datos encontrados.`)

                } 
                else 
                {
                    this.showAlert(`No hay datos.`)
                }

            }
            catch (error) 
            {
                this.showAlert(`No hay datos.`)
            }
            finally 
            {
                this.hideLoading()
            }

        },
    }
}
