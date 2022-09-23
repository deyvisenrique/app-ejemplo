export const upload_image = {
    methods: {
        
        changeUploadImage(){

            const input_image = document.getElementById('input_image').files[0] 

            if(input_image)
            {
                const formData = new FormData()
                formData.append("file", input_image)
                
                this.$f7.preloader.show()
    
                this.$http.post(`${this.returnBaseUrl()}/items/upload-temp-image`, formData, this.getHeaderConfig())
                        .then(response => {
                            const data = response.data.data

                            if(response.data.success)
                            {
                                this.form.temp_path = data.temp_path
                                // this.form.temp_path = data.temp_image
                                this.form.image_url = data.temp_image
                                this.form.image = data.filename
                            }
                            else
                            {
                                this.$f7.dialog.alert(response.data.message, 'Mensaje')
                                this.cleanInputImage()
                            }

                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .then(() => {
                            this.$f7.preloader.hide()
                        })
            }
            else
            {
                this.cleanInputImage()
            }

        },
        cleanInputImage(){
            
            this.form.temp_path = null
            this.form.image = null
            this.form.image_url = null

            const input_image = document.getElementById('input_image')
            if(input_image) input_image.value = null

        },
    }
}
