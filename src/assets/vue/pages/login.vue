<template>
    <f7-page color="bluemagenta">
        <f7-block class="bg-blue-magenta no-margin-vertical padding-vertical">
            <f7-row>
                <f7-col width="100">
                    <p class="text-align-center">
                        <img v-if="logo" :src="logo" alt="FacturaloPeru" width="40%" />
                    </p>
                </f7-col>
            </f7-row>
        </f7-block>

        <f7-block>
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
                                                <div class="item-title item-label custom-w20">{{ internet_protocol }}</div>
                                                <div class="item-input-wrap">
                                                    <input type="text" placeholder="demo.facturalo.pro" required validate v-model="url"><span class="input-clear-button"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <!-- <f7-list-input
                                floating-label
                                type="url"
                                clear-button
                                label="URL"
                                placeholder="https://demo.facturalo.pro"
                                required
                                validate
                                :value="url"
                                @input="url = $event.target.value">
                            </f7-list-input> -->


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

                            <f7-list-input
                                floating-label
                                type="password"
                                clear-button
                                label="Contraseña"
                                placeholder="Contraseña"
                                name="password"
                                required
                                validate
                                :value="password"
                                @input="password = $event.target.value">
                                <span slot="info">
                                    <f7-link class="link external" color="gray" :href="internet_protocol+url+'/password/reset'" target="BLANK">¿olvidaste la contraseña?</f7-link>
                                </span>
                            </f7-list-input>
                        </f7-list>
                    </form>
                </f7-col>
            </f7-row>
        </f7-block>

        <f7-block class="display-flex justify-content-center">
            <f7-row tag="p">
                <f7-col>
                    <f7-button class="padding-horizontal" @click="login" color="pink" large fill round>Iniciar sesión</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
    import {auth} from "mixins_/auth";
    import logoLight from "assets/images/logo/logo-light.svg";
    import {general_functions} from "mixins_/general_functions"

    export default {
        mixins: [auth, general_functions],
        components: {},
        data: function () {
            return {
                email: "demo@gmail.com",
                password: "123456",
                url: "demo.facturalo.pro",
                logo: '',
                internet_protocol: 'https://'
            };
        },
        created() {
            if (localStorage.url_logo) {
                this.logo = localStorage.url_logo
            } else {
                this.logo = logoLight
            }

            this.setStorageApiUrl()
        },
        computed: {},
        methods: {
            setStorageApiUrl(){

                const storage_api_url = localStorage.api_url

                if (storage_api_url)
                {
                    if(storage_api_url.includes(this.internet_protocol))
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
            saveToken(token, name, email, ruc = null, logo = null) {
                localStorage.api_token = token;
                localStorage.user_name = name;
                localStorage.user_email = email;

                localStorage.api_url = `${this.internet_protocol}${this.url}`

                if (ruc && logo)
                {
                    localStorage.ruc = ruc
                    const url_logo = `${this.internet_protocol}${this.url}/storage/uploads/logos/${logo}`

                    localStorage.url_logo = url_logo
                    this.logo = url_logo
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
                        this.showAlert("No se logro conexion con la URL, verifique la URL (Formato url: cliente.dominio.com).");
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            }
        }
    };
</script>
