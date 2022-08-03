<template> 
    <body id='html_print_document'></body>
</template>

<script>

    import {general_functions} from 'mixins_/general_functions'
    import * as htmlToImage from 'html-to-image'
    import {auth} from 'mixins_/auth'

    export default {
        mixins: [general_functions, auth],
        data: function () {
            return {
                html_pdf: null,
                html_print_document: null,
                image_base_64: null,
                formats_allowed: []
            }
        },
        watch: {
        },
        created() { 
            this.initData()
        },
        methods: {
            initData()
            {
                this.html_pdf = null
                this.html_print_document = null
                this.image_base_64 = null

                this.formats_allowed = [
                    {
                        document_type: 'document',
                        formats: ['ticket_50', 'ticket_58', 'ticket'],
                        default: 'ticket'
                    },
                    {
                        document_type: 'saleNote',
                        formats: ['ticket_58', 'ticket'],
                        default: 'ticket'
                    }
                ]
            },
            async sendPrintDocument(document_type, external_id, format, extend_pdf_height = 200)
            {
                const context = this
                await context.showLoading()
                await context.generalSleep(500)

                try {

                    await this.setHtmlPdf(document_type, external_id, format, extend_pdf_height)

                    await this.setPdfToHtml()

                    await this.convertHtmlToImage()

                    // imprimir imagen
                    BTPrinter.printBase64(
                        function(data)
                        {
                            context.generalSuccessNotification('Impresión en proceso')
                        },
                        function(error)
                        {
                            context.showAlert(`Error en proceso de impresión: ${error}`)
                        }, 
                        this.image_base_64,
                        '0'
                    )

                } 
                catch(error) 
                {
                    context.showAlert(`Error inesperado: ${error}`)
                }

                await context.hideLoading()
                this.html_print_document.innerHTML = ''
                await context.initData()

            },
            getFormatPdf(document_type, param_format)
            {
                let default_format = 'ticket'
                const find_format = _.find(this.formats_allowed, { document_type : document_type})

                if(find_format)
                {
                    default_format = (find_format.formats.includes(param_format)) ? param_format : find_format.default
                }

                return default_format
            },
            async setHtmlPdf(document_type, external_id, format, extend_pdf_height)
            {
                const context = this
                const format_pdf = context.getFormatPdf(document_type, format)

                await context.$http.get(`${context.returnBaseUrl()}/document-print-pdf/${document_type}/${external_id}/${format_pdf}/${extend_pdf_height}`, context.getHeaderConfig())
                            .then((response)=>{
                                context.html_pdf = response.data
                            })
                            .catch((error)=>{
                                context.showAlert(`Ocurrió un error al obtener el pdf: ${error}`)
                            })
            },
            setPdfToHtml()
            {
                this.html_print_document = document.getElementById('html_print_document')
                this.html_print_document.innerHTML = this.html_pdf
            },
            async convertHtmlToImage()
            {
                const context = this

                await htmlToImage.toPng(document.getElementById('html_print_document'))
                                .then(function (dataUrl){
                                    context.image_base_64 = dataUrl
                                })
                                .catch((error)=>{
                                    context.showAlert(`Ocurrió un error convertir pdf: ${error}`)
                                })

            },
        }
    }
</script>
