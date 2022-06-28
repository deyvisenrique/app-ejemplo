<template>
<f7-page class="">
    <f7-block class="bg-blue-magenta no-margin-top elevation-9">
        <f7-block class="text-align-right no-margin-top padding-top">
            <f7-link panel-close class="text-color-white"><i class="fas fa-times"></i></f7-link>
        </f7-block>
        <f7-block class="no-margin-vertical">

            <f7-row>
                <f7-col width="75">
                    <p class="text-color-white">
                        <f7-icon material="check_circle" size="48px"></f7-icon>
                    </p>

                </f7-col>
                <f7-col width="25">
                    <p v-show="notifications.documents_not_sent > 0">
                        <a href="#" class="link navbar-tooltip-not-sent text-color-white">
                            <f7-icon material="notifications" size="22px">
                                <span class="badge color-red">{{ notifications.documents_not_sent }}</span>
                            </f7-icon>
                        </a>
                    </p>
                    
                    <p v-show="notifications.documents_regularize_shipping > 0"> 
                        <a href="#" class="link navbar-tooltip-regularize-shipping text-color-white">
                            <f7-icon material="warning" size="22px">
                                <span class="badge color-red">{{ notifications.documents_regularize_shipping }}</span>
                            </f7-icon>
                        </a>
                    </p>
                </f7-col>
            </f7-row>

        </f7-block>
        <f7-block class="no-margin-top padding-bottom">
            <p class="text-color-white">{{user}} <br> {{email}}</p>
        </f7-block>
    </f7-block>
    <f7-block class="bg-color-white margin-left">
        <f7-link @click="go('configuration')" color="black" class="display-block margin-vertical">
            <f7-icon material="settings" size="18"> </f7-icon>
            &nbsp;Configuración
        </f7-link>
        <f7-link @click="go('login')" color="black" class="display-block margin-vertical">
            <f7-icon material="verified_user" size="18"> </f7-icon>
            &nbsp;cuenta
        </f7-link>
    </f7-block>

    <div class="footer bg-color-white">
        <f7-block>
            <f7-button class="padding-horizontal" @click="logout" color="pink" fill round>
                Cerrar sesión
            </f7-button>
        </f7-block>
    </div>
</f7-page>
</template>

<style scoped>
.footer {
    text-align: center;
    z-index: 9999;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
}
</style>

<script>

    import {general_functions} from "mixins_/general_functions"
    import {auth} from "mixins_/auth"

    export default {
        mixins: [auth, general_functions],
        components: {},
        data: function () {
            return {
                email: localStorage.user_email,
                user: localStorage.user_name,
                notifications: {
                    documents_not_sent: 0,
                    documents_regularize_shipping: 0,
                }
            }
        },
        mounted() {
            this.createTooltips()
            this.getNotifications()
        },
        methods: {
            getNotifications(){

                if(!this.getStorage('api_token')) return
                
                this.showLoading()
                this.$http.get(`${this.returnBaseUrl()}/documents/notifications`, this.getHeaderConfig())
                    .then(response => {
                        
                        if(response.data.success)
                        {
                            this.notifications = response.data.data
                        }

                    })
                    .catch( error => {
                        console.log(error)
                    })
                    .then(() => {
                        this.hideLoading()
                    })
            },
            createTooltips(){
                
                this.$f7.tooltip.create({
                    targetEl: '.navbar-tooltip-regularize-shipping',
                    text: 'Comprobantes pendientes de rectificación'
                })

                this.$f7.tooltip.create({
                    targetEl: '.navbar-tooltip-not-sent',
                    text: 'Comprobantes pendientes de envío'
                })

            },
            go(type) {

                switch (type) {
                    case 'login':
                        this.$f7router.navigate("/configuration/");
                        break;
                    case 'configuration':
                        this.$f7router.navigate("/advanced-configuration/");
                        break;

                }
            },
            logout() {
                localStorage.removeItem("api_token");
                localStorage.removeItem("user_name");
                localStorage.removeItem("user_email");
                //localStorage.removeItem('api_url')
                //localStorage.removeItem('url_logo')
                location.reload();
                // this.$f7router.navigate("/");
            }
        }
    };
</script>
