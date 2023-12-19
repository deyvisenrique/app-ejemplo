<template>
<f7-page>
    <f7-block class="no-margin-top no-margin-bottom" :class="theme.class_bg_header">
        <f7-block class="no-margin-vertical">
            <f7-row>
                <f7-col width="75">
                    <p :class="theme.class_header_text_color">{{userData.username}} <br> {{userData.email}}</p>
                </f7-col>
                <f7-col width="25">
                    <f7-block class="text-align-right no-margin no-padding">
                        <f7-link panel-close :class="theme.class_menu_text_color">
                            <h2><i class="fas fa-times"></i></h2>
                        </f7-link>
                    </f7-block>
                </f7-col>
            </f7-row>
        </f7-block>
        <PartialMenu />
    </f7-block>
    <f7-block class="no-margin-top">
        <PartialNotifications v-show="notifications.documents_not_sent > 0 ||
notifications.documents_regularize_shipping > 0" :theme="theme" :notifications="notifications"/>
        <PartialConfigurations />
    </f7-block>
    <div :class="showBlockFooter ? 'block-footer bg-color-white pt-1' : 'footer bg-color-white'">
        <f7-block>
            <f7-button class="padding-horizontal bg-secondary" @click="logout" :color="theme.name_color_theme" fill round>
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
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
}
</style>

<script>

    import {mapState} from 'vuex'
    import {general_functions} from "mixins_/general_functions"
    import {auth} from "mixins_/auth"
    import PartialMenu from  "./partials/menu.vue"
    import PartialNotifications from  "./partials/notifications.vue"
    import PartialConfigurations from  "./partials/configurations.vue"

    export default {
        mixins: [auth, general_functions],
        components: {
            PartialMenu,
            PartialNotifications,
            PartialConfigurations
        },
        data: function () {
            return {
                notifications: {
                    documents_not_sent: 0,
                    documents_regularize_shipping: 0,
                },
                check_configuration: false,
                check_is_pos_mode: false,
                current_permissions: [],
                theme: {},
                user_data: this.userData,
            }
        },
        mounted() {
            this.createTooltips()
            this.getNotifications()
            this.getInitialSettings()
            this.checkConfiguration()
        },
        created(){
            this.events()
            this.checkPosMode()
        },
        computed: {
            ...mapState(['userData']),
            showBlockFooter()
            {
                const all_permissions = this.getAllPermissions()
                const check_all_permissions = all_permissions ? all_permissions : []

                return this.check_is_pos_mode && check_all_permissions.length > 5
            }
        },
        methods: {
            getAllPermissions()
            {
                return this.current_permissions.length > 0 ? this.current_permissions : this.getStoragePermissions()
            },
            checkPermissions(value)
            {
                const all_permissions = this.getAllPermissions()

                return this.hasPermissionInModule(value, all_permissions)
            },
            checkPosMode(is_pos_mode = null)
            {
                this.check_is_pos_mode = this.isPosMode(is_pos_mode)
            },
            events(){

                this.$eventHub.$on('updatePermissions', (permissions) => {
                    this.current_permissions = permissions
                })

                this.$eventHub.$on('appMode', (is_pos_mode) => {
                    this.checkPosMode(is_pos_mode)
                })

            },
            checkConfiguration(permissions)
            {
                this.check_configuration = this.hasPermissionInModule('configuration', permissions)
            },
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
            go(type)
            {
                switch (type)
                {
                    case 'login':
                        this.redirectRoute('/configuration/')
                        break
                    case 'configuration':
                        this.redirectRoute('/advanced-configuration/')
                        break
                }

                // redireccion en modo pos
                this.redirectPosMode(type)
            },
            isRedirectMainView(type)
            {
                return !['login', 'configuration'].includes(type)
            },
            redirectPosMode(type)
            {
                if(this.check_is_pos_mode)
                {
                    switch(type)
                    {
                        case 'pos':
                            this.redirectMainRoute('/list-items-sale/')
                            break
                        case 'ls_doc':
                            this.redirectMainRoute('/documents/')
                            break
                        case 'report-sales':
                            this.redirectMainRoute('/report-sales/')
                            break
                        case 'cpe':
                            this.redirectMainRoute('/cpe/')
                            break
                        case 'order-note':
                            this.redirectMainRoute('/form-order-note/')
                            break
                        case 'purchase':
                            this.redirectMainRoute('/form-purchase/')
                            break
                        case 'items':
                            this.redirectMainRoute('/items/')
                            break
                        case 'customers':
                            this.redirectMainRoute('/customers/')
                            break
                        case 'cash':
                            this.redirectMainRoute('/cash/')
                            break
                        case 'quotation':
                            this.redirectMainRoute('/form-quotation/')
                            break
                        case "dispatch":
                            this.redirectMainRoute("/form-dispatch/");
                            break
                    }


                    if(this.isRedirectMainView(type))
                    {
                        this.$eventHub.$emit('closePanel')
                    }

                }

            },
            logout() {
                localStorage.removeItem("api_token")
                localStorage.removeItem("user_name")
                localStorage.removeItem("user_email");
                //localStorage.removeItem('api_url')
                //localStorage.removeItem('url_logo')
                location.reload();
                // this.$f7router.navigate("/");
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    };
</script>
