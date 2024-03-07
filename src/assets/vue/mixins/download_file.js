import moment from "moment"

export const download_file = {

    data: function () {
        return {
            general_download_folder_name: 'Download',
            general_external_path_download: `${cordova.file.externalRootDirectory}Download`

        }
    },
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
                case 'quotation':
                    url = record.print_ticket
                    break
                case 'purchase':
                    url = record.print_a4
                    break
                case 'dispatch':
                    // http://1.prox.oo/downloads/dispatch/pdf/31ce171e-002e-487f-9d00-0cbf459eeaec
                    url = `${this.getBaseUrl()}/downloads/${documentType}/pdf/${record.external_id}`
                    break
            }

            return url

        },
        getDownloadAuthorization(authorization){

            let options = {}

            if(authorization)
            {
                options.headers = {'Authorization': `Bearer ${this.getStorage('api_token')}`}
            }

            return options

        },
        async downloadOpenFile(url, filename, authorization = false){

            const context = this
            const file_transfer = new FileTransfer()
            const encode_uri = encodeURI(url)
            const file_url = `${cordova.file.externalRootDirectory}${this.general_download_folder_name}/${filename}.pdf`

            await file_transfer.download(
                encode_uri,
                file_url,
                (entry) => {
                    context.execFileOpener(file_url)
                    // context.generalSuccessNotification('Archivo descargado')
                },
                (error) => {
                    context.showAlert('Error al descargar'+JSON.stringify(error))
                    console.log('Error status: '+ JSON.stringify(error))
                },
                false,
                this.getDownloadAuthorization(authorization)
            )

        },
        downloadFileInAppBrowser(url)
        {
            cordova.InAppBrowser.open(
                url,
                "_system",
                "location=yes"
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
        async downloaFileToPrint(url, filename, authorization = false){

            const context = this
            const file_transfer = new FileTransfer()
            const encode_uri = encodeURI(url)
            const file_url = `${cordova.file.externalRootDirectory}${this.general_download_folder_name}/${filename}.pdf`

            await file_transfer.download(
                encode_uri,
                file_url,
                (entry) => {
                    cordova.plugins.printer.print(file_url)
                },
                (error) => {
                    context.showAlert('Error al descargar'+JSON.stringify(error))
                    console.log('Error status: '+ JSON.stringify(error))
                },
                false,
                this.getDownloadAuthorization(authorization)
            )
        },
        // alternate download and save file

        async getBlobFile(url)
        {
            const response = await this.$http.get(`${url}`,  this.getHttpHeadersDownload())

            return new Blob([response.data], { type: 'application/pdf' })
        },
        async fsSaveFile(dir_entry, url, input_filename, exec_file_opener, append_time = true, extension = 'pdf')
        {
            const context = this
            const file_data = await context.getBlobFile(url)
            const filename = append_time ? `${input_filename}_${moment().format('YYYYMMDD_HHmmss')}.${extension}` : `${input_filename}.${extension}`
            const full_path = `${this.general_external_path_download}/${filename}`

            dir_entry.getFile(
                filename,
                { create: true, exclusive: false },
                (file_entry) => {
                    console.log("device file_entry:"+JSON.stringify(file_entry))

                    context.fsWriteFile(file_entry, file_data, exec_file_opener, full_path)
                },
                (error_create_file) => {
                    context.showAlert(`Error al crear archivo: ${JSON.stringify(error_create_file)}`)
                }
            )
        },
        fsWriteFile(file_entry, file_data, exec_file_opener, full_path)
        {
            const context = this

            file_entry.createWriter(
                (file_writer) => {

                    file_writer.onwriteend = (success) => {
                        context.fsShowResponse(success, exec_file_opener, full_path)
                    }

                    file_writer.onerror = (error) => {
                        context.showAlert(`Error al escribir archivo: ${JSON.stringify(error)}`)
                    }

                    file_writer.write(file_data)
                }
            )
        },
        fsShowResponse(success, exec_file_opener, full_path = null)
        {
            const context = this

            if(success.target)
            {
                const response = success.target.error

                if(response == null || _.isEmpty(response))
                {
                    if(exec_file_opener)
                    {
                        context.execFileOpener(full_path)
                    }
                    else
                    {
                        context.generalSuccessNotification(`El archivo se almacenó correctamente, verifíquelo en Descargas`)
                    }
                }
                else
                {
                    context.showAlert(`Error al guardar archivo: ${JSON.stringify(response)}`)
                }
            }
            else
            {
                context.showAlert(`Error al guardar archivo: not success.target`)
            }
        },
        async saveFileInSystem(url, filename, exec_file_opener = false)
        {
            const context = this
            // const path = `${cordova.file.externalRootDirectory}${this.general_download_folder_name}`

            await this.showLoading()
            await this.generalSleep(300)

            try
            {
                await window.requestFileSystem(
                    LocalFileSystem.PERSISTENT,
                    0,
                    (fs) => {
                        window.resolveLocalFileSystemURL(this.general_external_path_download, async (dir_entry) => {
                            await context.fsSaveFile(dir_entry, url, filename, exec_file_opener)
                            await context.hideLoading()
                        })
                    },
                    (error_load_fs) => {
                        context.showAlert(`Error al cargar sistema de archivos: ${JSON.stringify(error_load_fs)}`)
                        context.hideLoading()
                    }
                )
            }
            catch(error)
            {
                context.hideLoading()
                context.showAlert(`Error desconocido: ${error}`)
            }

        },



    }
}
