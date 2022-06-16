 
export const general_functions = {
    methods: {
        showAlert(message) 
        {
            this.$f7.dialog.alert(message, "Mensaje")
        },
        showLoading() 
        {
            this.$f7.preloader.show()
        },
        hideLoading() 
        {
            this.$f7.preloader.hide()
        }
    }
}
