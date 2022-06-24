export const download_file = {
    methods: { 
        getUrlDownload(record, documentType){

            let url = null

            switch (documentType)
            {
                case 'document':
                    url = `${this.getBaseUrl()}/print/${documentType}/${record.external_id}/${this.getPrintFormatPdf()}`
                    break
            
                case 'sale_note':
                case 'order_note':
                    url = record.print_ticket
                    break

                case 'purchase':
                    url = record.print_a4
                    break
            }

            return url

        },
        async downloadOpenFile(url, filename){

            const context = this
            const file_transfer = new FileTransfer()
            const encode_uri = encodeURI(url)
            const file_url = `${cordova.file.externalRootDirectory}Download/${filename}.pdf`

            await file_transfer.download(
                encode_uri, 
                file_url, 
                (entry) => {
                    context.execFileOpener(file_url)
                },  
                (error) => {
                    context.showAlert('Error al descargar'+JSON.stringify(error))
                    console.log('Error status: '+ JSON.stringify(error))
                }, 
                false,
                {}
            )

        },
        execFileOpener(file_url){

            const context = this

            cordova.plugins.fileOpener2.showOpenWithDialog(
                file_url,
                'application/pdf',
                {
                    error : (e) => {
                        context.showAlert(`Error: '${e.status} - Error mensaje: ${e.message}`)
                    },
                    success : () => {
                        // console.log('file opened successfully')
                        context.hideLoading()
                    },
                    // position : [0, 0]
                }
            )

        },
    }
}
