<template>
  <f7-page :color="theme.name_color_theme">
    <f7-block class="no-margin-top" :class="theme.class_bg_header">
      <f7-block class="no-margin-vertical">
        <f7-row>
          <f7-col width="75">
            <p :class="theme.class_header_text_color">
              <f7-icon material="verified_user" size="44px" class="padding-right"></f7-icon>
            </p>
            <p :class="theme.class_header_text_color">Cuenta</p>
          </f7-col>
          <f7-col width="25">
            <f7-block class="text-align-right no-margin-top padding-top">
              <f7-link class="transparent panel-previous" :class="theme.class_menu_text_color" @click="back">
                <i class="fas fa-times"></i>
              </f7-link>
            </f7-block>
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-block>
    <f7-card class="no-padding-top no-padding-horizontal" no-shadow>
      <form class="form-store-data" id="demo-form">
        <f7-list no-hairlines-md>
          <f7-list-input floating-label type="text" clear-button label="URL" placeholder="demo.facturalo.pro" required validate :value="form.url" @input="form.url = $event.target.value">
            <template v-slot:media>
                <select v-model="internet_protocol">
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                </select>
            </template>
          </f7-list-input>
          <f7-list-input
            floating-label
            type="text"
            clear-button
            label="Correo"
            placeholder="Correo"
            name="name"
            required
            validate
            :value="form.email"
            @input="form.email = $event.target.value"
          >
          </f7-list-input>
          <f7-list-input
            floating-label
            type="password"
            clear-button
            label="Contraseña"
            placeholder="Contraseña"
            name="password"
            required
            :value="form.password"
            @input="form.password = $event.target.value"
          >
          </f7-list-input>
        </f7-list>
      </form>
    </f7-card>
    <div class="footer">
      <f7-block>
        <f7-button class="padding-horizontal bg-secondary" :color="theme.name_color_theme" @click="submit" fill round>
          Guardar
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
import {
    general_functions
} from "mixins_/general_functions"

export default {
  mixins: [general_functions],
  name: "Configuration",
  components: {},
  data: function() {
    return {
      form: {},
      internet_protocol: 'https://',
      theme: {},
    };
  },
  created() {
    this.initForm()
    this.getInitialSettings()
  },
  methods: {
    getStorageApiUrl(){

            const storage_api_url = localStorage.api_url

            if (storage_api_url) {
                if (storage_api_url.includes(this.internet_protocol) || storage_api_url.includes('http://') ) {
                    const parse_url = storage_api_url.split('//')
                    if (parse_url.length == 2) return parse_url[1]
                } else {
                    return storage_api_url
                }
            }

        },
        initForm() {

            this.form = {
                email: localStorage.user_email,
                password: localStorage.user_password,
                url: this.getStorageApiUrl()
                // url: localStorage.api_url
            };
        },
        submit() {
            if (!this.form.email || !this.form.password || !this.form.url) {
                return this.showAlert('Los campos son obligatorios.')
            }

            this.showLoading()
            this.$http
                .post(`${this.internet_protocol}${this.form.url}/api/login`, {
                    email: this.form.email,
                    password: this.form.password
                })
                .then(response => {

                    let data = response.data;
                    if (data.success) {
                        this.saveToken(data.token, data.name, data.email);
                        this.initForm();
                        location.reload();
                    } else {
                        alert("Usuario o Contraseña incorrecta.");
                    }
                })
                .catch(err => {
                    alert("No se logro conexión con la URL, verifique la URL.");
                })
                .then(() => {
                    this.hideLoading()
                });
        },
        saveToken(token, name, email) {
            localStorage.api_token = token;
            localStorage.user_name = name;
            localStorage.user_email = email;
            localStorage.api_url = `${this.internet_protocol}${this.form.url}`;
        },
        back() {
            this.$f7router.navigate("/panel-right/");
        },
    getInitialSettings() {
      this.theme = this.getThemeSettings()
    },
  }
}
</script>
