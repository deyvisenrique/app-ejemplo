<template>
<f7-page class="panel-dark">
    <f7-block>
        <f7-row>
            <f7-col width="30">
                <p class="text-color-white text-align-right">
                    <f7-icon material="check_circle" size="44px"></f7-icon>
                </p>
            </f7-col>
            <f7-col width="70">
                <p class="text-color-white text-align-right">{{user}} <br> {{email}}</p>
            </f7-col>
        </f7-row>
    </f7-block>
    <hr>

    <div class="footer">
        <f7-block>
            <f7-button transparent color="white" @click="go('configuration')">
                <f7-icon material="settings" size="20"></f7-icon>
                Configuración
            </f7-button>
            <f7-button transparent color="white" @click="go('login')">
                <f7-icon material="verified_user" size="20"></f7-icon>
                Accesos
            </f7-button>
            <f7-button transparent color="white" @click="logout">
                <f7-icon material="timer_off" size="20"></f7-icon>
                Cerrar Sesión
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
export default {
    components: {},
    data: function () {
        return {
            email: localStorage.user_email,
            user: localStorage.user_name,
        }
    },
    methods: {
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
