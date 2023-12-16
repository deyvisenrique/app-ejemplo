<template>
<f7-page :class="theme.class_bg_body">

    <!-- logo de cambio de pagina -->
    <f7-popup class="demo-popup" :opened="splash" @popup:closed="popupOpened = false">
        <f7-page :class="theme.class_bg_header">
            <f7-block class="padding-vertical no-margin-vertical" :class="theme.class_bg_body">
                <br><br><br>
            </f7-block>
            <f7-block class="padding-vertical display-flex justify-content-center no-margin-vertical" v-if="logo" :class="theme.class_bg_body">
                <logo heightLogo="80" alternativePercentage="40%" :isDark="true" class="display-flex justify-content-center"></logo>
                <!-- <img :width="width_img" :height="height_img" class="center padding-vertical margin-vertical margin-horizontal" :src="logo" alt /> -->
            </f7-block>
            <f7-block class="display-flex justify-content-center no-margin" :class="theme.class_bg_body">
                <img :src="img_icons" alt="icons" width="70%" class="center">
            </f7-block>
            <f7-block :class="[configuration.header_waves === 1 ? 'display-flex' : 'display-none', theme.class_bg_body]" class="no-margin-top no-margin-vertical no-padding-horizontal">
                <div class="waves" style="transform: rotate(180deg);">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 180" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" :class="theme.class_waves_color_fill"></path>
                    </svg>
                </div>
            </f7-block>
        </f7-page>
    </f7-popup>

    <header-layout></header-layout>

    <f7-block class="bg-color-red padding" v-if="isOffline">
        <p class="text-color-white text-align-center">SIN ACCESO A INTERNET, VERIFICA TU CONEXIÓN.</p>
    </f7-block>

    <f7-block v-if="hasPermissions">

        <template v-if="!is_pos_mode">
            <f7-row>
                <f7-col v-if="checkPermissions('invoice')">
                    <f7-card no-shadow :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_tint]" @click.native="setAppMode('pos')" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="display" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">Modo <br> POS</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('invoice')">
                    <f7-card no-shadow :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_tint]" @click.native="go('nw_doc')" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-invoice" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">Factura <br> electrónica</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('invoice-ticket')">
                    <f7-card no-shadow @click.native="go('nw_docb')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-invoice" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">Boleta <br> electrónica</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('sale-note')">
                    <f7-card no-shadow @click.native="go('sale_note')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-sale" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">Nota de venta</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('order-note')">
                    <f7-card no-shadow @click.native="go('order_note')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_tint]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color"><br> Pedido</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('invoice')">
                    <f7-card no-shadow @click.native="go('dispatch')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-sale" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">
                                Guía de remisión<br>  remitente
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('invoice')">
                    <f7-card no-shadow @click.native="go('dispatch-carrier')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-sale" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">
                                Guía de remisión transportista
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('quotation')">
                    <f7-card no-shadow @click.native="go('quotation')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-sale" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">
                                <br> Cotización
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('documents')">
                    <f7-card no-shadow @click.native="go('ls_doc')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_tint]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="file-list" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">Lista de <br> comprobantes</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('purchase')">
                    <f7-card no-shadow @click.native="go('purchase')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="car-sale" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color">
                                <br> Compra
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('customers')">
                    <f7-card no-shadow @click.native="go('customers')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color]" style="cursor:pointer;">
                        <f7-card-content clases="">
                            <base-icon nameIcon="users" widthIcon="25" clases="padding-top text-align-center"></base-icon>
                            <p class="font-w-500 text-align-center" :class="theme.class_text_color">
                                <br>Clientes
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('cash')">
                    <f7-card no-shadow @click.native="go('cash')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content clases="">
                            <base-icon nameIcon="cash-machine" widthIcon="25" clases="text-align-center padding-top"></base-icon>
                            <p class="font-w-500 text-align-center" :class="theme.class_text_color">
                                <br>Caja
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col  v-if="checkPermissions('items')">
                    <f7-card no-shadow @click.native="go('items')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_tint]" style="cursor:pointer;">
                        <f7-card-content clases="">
                            <base-icon nameIcon="logistics" widthIcon="25" clases="padding-top text-align-center"></base-icon>
                            <p class="font-w-500 text-align-center" :class="theme.class_text_color">
                                <br>Productos
                            </p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>

            <f7-row>
                <f7-col v-if="checkPermissions('report-sales')">
                    <f7-card no-shadow @click.native="go('report-sales')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="bars" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color"><br>Reportes</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
                <f7-col v-if="checkPermissions('validate-document')">
                    <f7-card no-shadow @click.native="go('cpe')" :class="[theme.is_unicolor_boxes ? '' :'box-gradient',theme.class_box_color_shade]" style="cursor:pointer;">
                        <f7-card-content class="text-align-center">
                            <base-icon nameIcon="qr-code" widthIcon="25" clases="padding-top"></base-icon>
                            <p class="font-w-500" :class="theme.class_text_color"><br> Validar cpe</p>
                        </f7-card-content>
                    </f7-card>
                </f7-col>
            </f7-row>
        </template>
    </f7-block>
    <f7-block v-else>
        <f7-card class="card-warning">
            <f7-card-content class="">
                <f7-row>
                    <f7-col width="80">
                        <p class="text-color-white">No tiene permisos asignados, comuníquese con el administrador.</p>
                    </f7-col>
                    <f7-col width="20">
                        <span class="material-iconspadding-top icon-card-warning">warning</span>
                    </f7-col>
                </f7-row>
            </f7-card-content>
        </f7-card>
    </f7-block>

</f7-page>
</template>

<script>

    import logoOficial from "assets/images/logo/logo-oficial.svg";
    import logoOficialLight from "assets/images/logo/logo-light.svg";
    import icons from "assets/images/icons-01.svg";
    import HeaderLayout from "components/layout/Header";
    import BaseIcon from 'components/layout/BaseIcon.vue';
    import {auth} from "mixins_/auth";
    import {general_functions, set_logo, functions_direct_print} from "mixins_/general_functions"
    import Logo from "components/layout/Logo"

    export default {
        mixins: [auth, general_functions, set_logo, functions_direct_print],
        components: {
            HeaderLayout,
            BaseIcon,
            logoOficial,
            Logo
        },
        data: function () {
            // Must return an object
            return {
                logo: logoOficialLight,
                logo_oficial: '',
                user: "",
                password: "",
                splash: true,
                isOffline: false,
                width_img: '45%',
                height_img: '45%',
                img_icons: icons,
                configuration: {},
                permissions: [],
                is_pos_mode: false,
                theme: {}
            };
        },
        async created() {

            await this.setInitialLogo()
            await this.getInitialSettings()

            var self = this;
            window.addEventListener("online", function () {
                self.isOffline = false;
            });
            window.addEventListener("offline", function () {
                self.isOffline = true;
            });

            this.checkDirectPrint()

        },
        mounted() {
            setTimeout(this.verifytoken, 1000); // 2500);
        },
        computed:{
            hasPermissions(){
                return this.permissions.length > 0
            }
        },
        methods: {
            checkDirectPrint()
            {
                if(this.is_pos_mode)
                {
                    const configuration = this.getInitialConfiguration()

                    if(this.isAllowedDirectPrint(configuration))
                    {
                        this.printerDisconnect(configuration.printer_name)
                        this.printerConnect(configuration.printer_name)
                    }
                }
            },
            setInitialLogo(){

                if (localStorage.url_logo)
                {
                    this.logo = localStorage.url_logo
                }

            },
            appendStyleByContent(content){

                const style = document.createElement('style')
                style.textContent = content
                document.head.appendChild(style)

            },
            setStyleThemeContent(style_settings){

                if(style_settings.style_theme_content)
                {
                    switch (style_settings.theme_color)
                    {
                        case 'red':
                        case 'dark':
                            this.appendStyleByContent(style_settings.style_theme_content)
                            break
                    }
                }

            },
            setStyleCardContent(style_settings){

                if(style_settings.style_card_content)
                {
                    switch (style_settings.card_color)
                    {
                        case 'unicolor':
                            this.appendStyleByContent(style_settings.style_card_content)
                            break
                    }
                }

            },
            async setInitialSettings(data){
                await this.setAppMode('pos')
                await this.setPermissions(data)
                await this.setAppLogo(data.generals)
                await this.setGenerals(data)

            },
            setAppMode(new_mode){
                this.setStorage('app_mode', new_mode)
                this.is_pos_mode = this.isPosMode(new_mode)
                if(this.is_pos_mode)
                {
                    this.checkCurrentOrientation()
                    // this.redirectRoute('/list-items-sale/')
                }
                this.$eventHub.$emit('appMode', new_mode)
            },
            checkCurrentOrientation()
            {
                const context = this

                if (window.matchMedia('(orientation: portrait)').matches)
                {
                    context.redirectRoute('/list-items-sale/')
                }

                if (window.matchMedia('(orientation: landscape)').matches)
                {
                    context.redirectRoute('/landscape-pos/')
                }
            },
            setGenerals(data){

                this.setStorage('generals', data.generals, true)
                this.$eventHub.$emit('updateGenerals', data.generals)

            },
            setPermissions(data){

                this.permissions = data.permissions
                this.setStorage('permissions', this.permissions, true)
                this.$eventHub.$emit('updatePermissions', this.permissions)

            },
            checkPermissions(value){

                const row = _.find(this.permissions, {value: value})

                return !_.isEmpty(row)

            },
            async getInitialSettings(){

                if(!this.getStorage('api_token')) return

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/app-configurations/initial-settings`,  this.getHeaderConfig())
                                .then(response => {

                                    this.setInitialSettings(response.data)

                                    this.configuration = this.getInitialConfiguration()
                                    this.configuration.header_waves = response.data.style_settings.header_waves
                                    this.setStorage('app_configuration', this.configuration, true)
                                    // this.$f7router.navigate("/"); // no funciona a la primera
                                })
                                .catch(error => {
                                    console.log(error)
                                    this.showAlert(`Ocurrió un error al cargar la configuración inicial: ${error.response.data.message}`)
                                })
                                .then(() => {
                                    this.hideLoading()
                                })

                this.theme = this.getThemeSettings()
            },
            go(name) {
                const self = this;

                if (self.isOffline) {
                    return false;
                }

                switch (name) {
                    case "ls_doc":
                        self.$f7router.navigate("/documents/");
                        break;
                    case "nw_doc":
                        self.$f7router.navigate("/form-document/01");
                        break;
                    case "nw_docb":
                        self.$f7router.navigate("/form-document/03");
                        break;
                    case "report-sales":
                        self.$f7router.navigate("/report-sales/");
                        break;
                    case "cpe":
                        self.$f7router.navigate("/cpe/");
                        break;
                    case "sale_note":
                        self.$f7router.navigate("/form-sale-note/");
                        break;
                    case "order_note":
                        self.$f7router.navigate("/form-order-note/");
                        break;
                    case "purchase":
                        self.$f7router.navigate("/form-purchase/");
                        break;
                    case "dispatch":
                        self.$f7router.navigate("/form-dispatch/");
                        break;
                    case "dispatch-carrier":
                        self.$f7router.navigate("/form-dispatch-carrier/");
                        break;
                    case "items":
                        self.$f7router.navigate("/items/")
                        break
                    case "customers":
                        self.$f7router.navigate("/customers/")
                        break
                    case "cash":
                        self.$f7router.navigate("/cash/")
                        break
                    case "quotation":
                        self.$f7router.navigate("/form-quotation/")
                        break
                }
            },
            verifytoken() {
                const self = this;
                if (!localStorage.api_token) {
                    this.splash = false;
                    self.$f7router.navigate("/login/");
                } else {
                    this.splash = false;
                }
            }
        }
    };
</script>
