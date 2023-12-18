<template>
    <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">
        <f7-block class="no-margin-vertical padding-vertical" :class="theme.class_bg_header" :color="theme.name_color_theme">
            <f7-row>
                <f7-col width="100">
                        <logo heightLogo="40" alternativePercentage="25%" class="display-flex justify-content-center"></logo>
                </f7-col>
            </f7-row>
        </f7-block>
        <f7-block :class="theme.class_bg_body" class="no-margin-top no-margin-vertical no-padding-horizontal display-flex">
            <div class="waves">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 180" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" :class="theme.class_waves_color_fill"></path>
                </svg>
            </div>
        </f7-block>

        <f7-block class="padding-top">
            <f7-card class="padding-top padding-bottom no-shadow">
            <f7-row no-gap>
                <f7-col>
                    <form class="form-store-data" id="demo-form">
                        <f7-list no-hairlines-md>

                            <div class="no-hairlines-md inline-labels">
                                <ul>
                                    <li class="">
                                        <span class="item-title item-label custom-w20 custom-label-top-input">URL</span>
                                        <div class="item-content item-input">
                                            <div class="item-inner">
                                                <div class="item-title item-label custom-w20">
                                                    <!-- {{ internet_protocol }} -->

                                                    <select v-model="internet_protocol">
                                                        <option value="https://">https://</option>
                                                        <option value="http://">http://</option>
                                                    </select>
                                                </div>
                                                <div class="item-input-wrap">
                                                    <input type="text" placeholder="demo.facturalo.pro" required validate v-model="url"><span class="input-clear-button"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <f7-list-input
                                floating-label
                                type="text"
                                clear-button
                                label="Correo electrónico"
                                placeholder="Correo electrónico"
                                name="name"
                                required
                                validate
                                :value="email"
                                @input="email = $event.target.value">
                            </f7-list-input>

                            <div class="no-hairlines-md inline-labels">
                                <ul>
                                    <li class="">
                                        <span class="item-title item-label custom-w20 custom-label-top-input-pw">Contraseña</span>
                                        <div class="item-content item-input" style="margin-top:-12px;">
                                            <div class="item-inner">
                                                <div class="item-input-wrap">
                                                    <input :type="is_type_password ? 'password':'text'" placeholder="Contraseña" required validate v-model="password">
                                                </div>
                                                <div class="item-title item-label custom-w10">
                                                    <i class="fas" :class="icon_class_eye" @click="clickShowPassword"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <span class="custom-w20 custom-label-top-input-pw">
                                            <f7-link class="link external" color="gray" :href="internet_protocol+url+'/password/reset'" target="BLANK">¿olvidaste la contraseña?</f7-link>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </f7-list>
                    </form>
                </f7-col>
            </f7-row>
            </f7-card>
        </f7-block>

        <f7-block class="display-flex justify-content-center">
            <f7-row tag="p">
                <f7-col>
                    <f7-button class="padding-horizontal" @click="login" :color="theme.name_color_theme" :class="theme.theme_color == 'blue' ? 'bg-secondary' : ''" large fill round>Iniciar sesión</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
    import {auth} from "mixins_/auth";
    import logoLight from "assets/images/logo/logo-light.svg";
    import {general_functions} from "mixins_/general_functions"
    import Logo from "components/layout/Logo.vue"

    export default {
        mixins: [auth, general_functions],
        components: { Logo },
        data: function () {
            return {
                email: "empresa1@gmail.com",
                password: "11111111111",
                url: "empresa1.demo4pro6.ibu.pe",
                logo: '',
                internet_protocol: 'https://',
                is_type_password: true,
                theme: {},
                icon_class_eye: 'fa-eye-slash'
            };
        },
        created() {
            if (localStorage.url_logo) {
                this.logo = localStorage.url_logo
            } else {
                this.logo = logoLight
            }

            this.setStorageApiUrl()
            this.getInitialSettings()
        },
        computed: {},
        methods: {
            clickShowPassword(){
                this.is_type_password = !this.is_type_password
                if(this.is_type_password){
                    this.icon_class_eye = 'fa-eye-slash'
                } else {
                    this.icon_class_eye = 'fa-eye'
                }
            },
            setStorageApiUrl(){

                const storage_api_url = localStorage.api_url

                if (storage_api_url)
                {
                    if(storage_api_url.includes(this.internet_protocol) || storage_api_url.includes('http://'))
                    {
                        const parse_url = storage_api_url.split('//')
                        if(parse_url.length == 2) this.url = parse_url[1]
                    }
                    else
                    {
                        this.url = storage_api_url
                    }
                }

            },
            saveToken(token, name, email, ruc = null, logo = null, app_logo_base64 = null) {
                localStorage.api_token = token;
                localStorage.user_name = name;
                localStorage.user_email = email;
                localStorage.app_logo_base64 = app_logo_base64;

                localStorage.api_url = `${this.internet_protocol}${this.url}`

                if (ruc && logo)
                {
                    localStorage.ruc = ruc
                    const url_logo = `${this.internet_protocol}${this.url}/storage/uploads/logos/${logo}`

                    localStorage.url_logo = url_logo
                    this.logo = url_logo
                }
                else
                {
                    if(!logo)
                    {
                        this.removeStorage('url_logo')
                        this.logo = null
                    }
                }

            },
            login() {

                if (!this.email || !this.password || !this.url) {
                    return this.showAlert('Los campos son obligatorios.');
                }

                const self = this;

                self.$f7.preloader.show();

                this.$http
                    .post(`${this.internet_protocol}${this.url}/api/login`, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                        let data = response.data;

                        if (data.success)
                        {
                            self.saveToken(data.token, data.name, data.email, data.ruc, data.app_logo, data.app_logo_base64)
                            self.setStorage('company', data.company, true)
                            if (data.app_configuration) self.setStorage('app_configuration', data.app_configuration, true)
                            self.$f7router.navigate("/")
                        }
                        else
                        {
                            alert("Usuario o Password incorrectos.");
                        }
                    })
                    .catch(err => {
                        this.showAlert("No se logro conexión con la URL, verifique la URL (Formato url: cliente.dominio.com).");
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    };
</script>
