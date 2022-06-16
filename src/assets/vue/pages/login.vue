<template>
<f7-page class="page-red" color="white">
    <f7-block>
        <f7-row>
            <f7-col width="100">
                <p class="text-align-center">
                    <img v-if="fp_logo_white" :src="fp_logo_white" alt="FacturaloPeru" width="60%" />
                </p>
                <p class="text-align-center text-color-white padding-top">BIENVENIDO</p>
            </f7-col>
        </f7-row>
    </f7-block>

    <f7-card color="red">
        <f7-card-content>
            <f7-row no-gap>
                <f7-col>
                    <form class="form-store-data" id="demo-form">
                        <f7-list no-hairlines-md>
                            <f7-list-input outline floating-label type="text" clear-button label="Correo" placeholder="Correo" name="name" required validate :value="email" @input="email = $event.target.value">
                            </f7-list-input>
                            <f7-list-input outline floating-label type="password" clear-button label="Contraseña" placeholder="Contraseña" name="password" required validate :value="password" @input="password = $event.target.value">
                            </f7-list-input>
                            <f7-list-input outline floating-label type="url" clear-button label="URL" placeholder="https://demo.facturador.pro" required validate :value="url" @input="url = $event.target.value">
                            </f7-list-input>
                        </f7-list>
                    </form>
                </f7-col>
            </f7-row>
        </f7-card-content>
    </f7-card>

    <f7-block>
        <f7-row>
            <f7-col width="20"></f7-col>
            <f7-col width="60">
                <f7-button @click="login" color="red-secondary" fill raised>Ingresar</f7-button>
            </f7-col>
            <f7-col width="20"></f7-col>
        </f7-row>
    </f7-block>
</f7-page>
</template>

<script>
    import {auth} from "mixins_/auth";
    import FpLogoDark from "assets/images/facturaloperu.png";
    //import FpLogoWhite from "assets/images/fp_logo_white.png";
    import {general_functions} from "mixins_/general_functions"

    export default {
        mixins: [auth, general_functions],
        components: {},
        data: function () {
            return {
                email: "demo@gmail.com",
                password: "123456",
                url: "https://demo.facturalo.pro",
                fp_logo_dark: FpLogoDark,
                fp_logo_white: null,
            };
        },
        created() {
            if (localStorage.url_logo) {
                this.fp_logo_white = localStorage.url_logo
            }

            if (localStorage.api_url) {
                this.url = localStorage.api_url
            }

        },
        computed: {},
        methods: {

            saveToken(token, name, email, ruc = null, logo = null) {
                localStorage.api_token = token;
                localStorage.user_name = name;
                localStorage.user_email = email;

                localStorage.api_url = this.url
                if (ruc && logo) {
                    localStorage.ruc = ruc
                    localStorage.url_logo = `${this.url}/storage/uploads/logos/${logo}`
                    this.fp_logo_white = `${this.url}/storage/uploads/logos/${logo}`
                }
            },
            login() {
                if (!this.email || !this.password || !this.url) {
                    return;
                }

                const self = this;

                self.$f7.preloader.show();

                this.$http
                    .post(`${this.url}/api/login`, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                        let data = response.data;

                        if (data.success) 
                        {
                            self.saveToken(data.token, data.name, data.email, data.ruc, data.logo);
                            if (data.app_configuration) self.setStorage('app_configuration', data.app_configuration, true)
                            self.$f7router.navigate("/");
                        } 
                        else 
                        {
                            alert("Usuario o Password incorrectos.");
                        }
                    })
                    .catch(err => {
                        alert("No se logro conexion con la URL, verifique la URL.");
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            }
        }
    };
</script>
