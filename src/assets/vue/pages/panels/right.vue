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
    <f7-block class="margin-left">

        <template v-if="check_configuration">
            <f7-link @click="go('configuration')" color="black" class="display-block margin-vertical">
                <f7-icon material="settings" size="18"> </f7-icon>
                &nbsp;Configuración
            </f7-link>
        </template>

        <f7-link @click="go('login')" color="black" class="display-block margin-vertical">
            <f7-icon material="verified_user" size="18"> </f7-icon>
            &nbsp;cuenta
        </f7-link>

    </f7-block>

    <!-- <f7-block class="bg-color-white margin-left"  v-if="isPosMode()">

        <p>Menú</p>

        <f7-link  @click="go('pos')" color="black" class="display-block margin-vertical">
            <f7-icon material="shopping_cart" size="18"> </f7-icon>
            &nbsp;Punto de venta
        </f7-link>

        <f7-link v-if="checkPermissions('order-note')"  @click="go('order-note')" color="black" class="display-block margin-vertical">
            <f7-icon material="assignment" size="18"> </f7-icon>
            &nbsp;Pedido
        </f7-link>


        <f7-link v-if="checkPermissions('purchase')"  @click="go('purchase')" color="black" class="display-block margin-vertical">
            <f7-icon material="note_add" size="18"> </f7-icon>
            &nbsp;Compra
        </f7-link>

        <f7-link v-if="checkPermissions('quotation')"  @click="go('quotation')" color="black" class="display-block margin-vertical">
            <f7-icon material="content_paste" size="18"> </f7-icon>
            &nbsp;Cotización
        </f7-link>

        <f7-link v-if="checkPermissions('documents')"  @click="go('ls_doc')" color="black" class="display-block margin-vertical">
            <f7-icon material="format_list_numbered" size="18"> </f7-icon>
            &nbsp;Lista de comprobantes
        </f7-link>

        <f7-link v-if="checkPermissions('validate-document')"  @click="go('cpe')" color="black" class="display-block margin-vertical">
            <f7-icon material="assignment_turned_in" size="18"> </f7-icon>
            &nbsp;Validar cpe
        </f7-link>

        <f7-link v-if="checkPermissions('report-sales')"  @click="go('report-sales')" color="black" class="display-block margin-vertical">
            <f7-icon material="equalizer" size="18"> </f7-icon>
            &nbsp;Reportes
        </f7-link>


        <f7-link v-if="checkPermissions('cash')"  @click="go('cash')" color="black" class="display-block margin-vertical">
            <f7-icon material="monetization_on" size="18"> </f7-icon>
            &nbsp;Caja
        </f7-link>

        <f7-link v-if="checkPermissions('customers')"  @click="go('customers')" color="black" class="display-block margin-vertical">
            <f7-icon material="people" size="18"> </f7-icon>
            &nbsp;Clientes
        </f7-link>

        <f7-link v-if="checkPermissions('items')"  @click="go('items')" color="black" class="display-block margin-vertical">
            <f7-icon material="add_shopping_cart" size="18"> </f7-icon>
            &nbsp;Productos
        </f7-link>

    </f7-block> -->

    <div class="footer bg-color-white">
        <f7-block>
            <f7-button class="padding-horizontal" @click="logout" color="green" fill round>
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
                },
                check_configuration: false
            }
        },
        mounted() {
            this.createTooltips()
            this.getNotifications()
            this.checkConfiguration()
        },
        created(){
            this.events()
            console.log("isPosMode",this.isPosMode())
        },
        computed: {
        },
        methods: {
            checkPermissions(value){

                // const row = _.find(this.permissions, {value: value})

                // return !_.isEmpty(row)
                return true

            },
            events(){

                this.$eventHub.$on('updatePermissions', (permissions) => {
                    this.checkConfiguration(permissions)
                })

            },
            checkConfiguration(permissions){
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
            go(type) {

                switch (type) {
                    case 'login':
                        this.$f7router.navigate("/configuration/");
                        break;
                    case 'configuration':
                        this.$f7router.navigate("/advanced-configuration/");
                        break;

                    // redireccion en modo pos
                    case "pos":
                        this.$f7router.navigate("/list-items-sale/")
                        break
                    case "ls_doc":
                        this.$f7router.navigate("/documents/")
                        break
                    case "report-sales":
                        this.$f7router.navigate("/report-sales/")
                        break
                    case "cpe":
                        this.$f7router.navigate("/cpe/")
                        break
                    case "order_note":
                        this.$f7router.navigate("/form-order-note/")
                        break
                    case "purchase":
                        this.$f7router.navigate("/form-purchase/")
                        break
                    case "items":
                        this.$f7router.navigate("/items/")
                        break
                    case "customers":
                        this.$f7router.navigate("/customers/")
                        break
                    case "cash":
                        this.$f7router.navigate("/cash/")
                        break
                    case "quotation":
                        this.$f7router.navigate("/form-quotation/")
                    // redireccion en modo pos

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
            }
        }
    };
</script>
