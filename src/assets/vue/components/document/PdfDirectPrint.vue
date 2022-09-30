<template>
    <body id='html_print_document'></body>
</template>

<script>

    import {general_functions} from 'mixins_/general_functions'
    import * as htmlToImage from 'html-to-image'
    import {auth} from 'mixins_/auth'

    export default {
        mixins: [general_functions, auth],
        props: {
            document: {
                type: Object,
                required: true,
            },
            response: {
                type: Object,
                required: true,
            },
            payments: {
                type: Array,
                required: true,
            },
        },
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

                    await this.printFromText() // metodo linea por linea

                    /*
                     * Modo documento desde imagen
                     * pdf a imagen y de ahi al metodo de impresion
                     */

                    // await this.setPdfToHtml()

                    // await this.convertHtmlToImage()

                    // imprimir imagen
                    // BTPrinter.printBase64(
                    //     function(data)
                    //     {
                    //         context.generalSuccessNotification('Impresión en proceso')
                    //     },
                    //     function(error)
                    //     {
                    //         context.showAlert(`Error en proceso de impresión: ${error}`)
                    //     },
                    //     this.image_base_64,
                    //     '0'
                    // )

                }
                catch(error)
                {
                    context.showAlert(`Error inesperado: ${error}`)
                }

                await context.hideLoading()
                this.html_print_document.innerHTML = ''
                await context.initData()

            },
            printFromText()
            {
                console.log(this.document)
                console.log(this.response)

                // logo
                BTPrinter.printImageUrl(function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                }, `${this.getStorage('url_logo')}`,'1'); // url, centro

                // empresa ruc
                const document_header = `${this.getStorage('api_url')} \n ${this.getStorage('ruc')} \n\n`
                BTPrinter.printTextSizeAlign(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, document_header,'11','1')//string, size:Reduzided Double height size, align:centro

                // empresa info (no obtenido todavia)

                // tipo y numero de documento
                const document_number = `${this.response.number} \n\n`
                BTPrinter.printTextSizeAlign(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, document_number,'11','1')//string, size:Reduzided Double height size, align:centro

                // cliente
                const document_customer = `FECHA DE EMISIÓN: ${this.document.date_of_issue} \n F. VENCIMIENTO: ${this.document.date_of_issue} \n CLIENTE: ${this.document.datos_del_cliente_o_receptor.apellidos_y_nombres_o_razon_social} \n ${this.document.datos_del_cliente_o_receptor.codigo_tipo_documento_identidad}: ${this.document.datos_del_cliente_o_receptor.numero_documento}\n\n`
                BTPrinter.printText(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, document_customer)

                // items
                this.document.items.forEach(element => {
                    let item_desc = `${element.item.description}`
                    let item_amounts = `${element.quantity} ${element.item.unit_type_id}    ${element.item.unit_price}    ${element.total}`

                    BTPrinter.printText(function(data){
                        console.log(data)
                    },function(err){
                        console.log(err)
                    }, item_desc)
                    BTPrinter.printTextSizeAlign(function(data){
                        console.log(data)
                    },function(err){
                        console.log(err)
                    }, item_amounts,'0','2') // string, normal size, align: right
                })

                // totales
                const document_totals = `OP. GRAVADAS: ${this.document.currency_type_id == 'PEN' ? 'S/' : this.document.currency_type_id} ${this.document.total_taxed} \n IGV: ${this.document.currency_type_id == 'PEN' ? 'S/' : this.document.currency_type_id} ${this.document.total_taxes} \n TOTAL: ${this.document.currency_type_id == 'PEN' ? 'S/' : this.document.currency_type_id} ${this.document.total}`
                BTPrinter.printTextSizeAlign(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, document_totals,'0','2') // string, normal size, align: right

                // info extra
                const document_footer = `SON: ${this.response.number_to_letter} \n VENDEDOR: ${this.getStorage('user_name')} \n HASH: ${this.response.hash}`
                BTPrinter.printText(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, document_footer)

                // pagos
                BTPrinter.printText(function(data){
                    console.log(data)
                },function(err){
                    console.log(err)
                }, "Pagos")
                this.document.payments.forEach(element => {
                    let payment = this.payments.find(pay => pay.id == this.document.payment_condition_id)
                    let pay_description = `${payment.name} - ${element.payment}`
                    BTPrinter.printTextSizeAlign(function(data){
                        console.log(data)
                    },function(err){
                        console.log(err)
                    }, pay_description,'0','1') // string, normal size, align: left
                })

                // qr code
                BTPrinter.printBase64(function(data){
                    console.log(data);
                },function(err){
                    console.log(err);
                }, this.response.qr,'1'); //base64 string, align:center

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
