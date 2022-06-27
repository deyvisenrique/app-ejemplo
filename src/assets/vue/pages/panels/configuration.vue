<template>
  <f7-page>
    <f7-block class="bg-blue-magenta no-margin-top elevation-9">
      <f7-block class="text-align-right no-margin-top padding-top">
        <f7-link class="transparent panel-previous" color="white" @click="back">
          <i class="fas fa-times"></i>
        </f7-link>
      </f7-block>
      <f7-block class="no-margin-vertical">
        <p class="text-color-white">
          <f7-icon material="verified_user" size="44px" class="padding-right"></f7-icon>
        </p>
      </f7-block>
      <f7-block class="no-margin-top padding-bottom">
        <p class="text-color-white">Cuenta</p>
      </f7-block>
    </f7-block>
    <f7-block class="no-padding-top">
      <form class="form-store-data" id="demo-form">
        <f7-list no-hairlines-md>
          <f7-list-input
            outline
            floating-label
            type="url"
            clear-button
            label="URL"
            placeholder="https://demo.facturador.pro"
            required
            validate
            :value="form.url"
            @input="form.url = $event.target.value"
          >
          </f7-list-input>
          <f7-list-input
            outline
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
            outline
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
    </f7-block>
    <div class="footer">
      <f7-block>
        <f7-button class="padding-horizontal" color="pink" @click="submit" fill round>
          Guardar
        </f7-button>
      </f7-block>
    </div>
  </f7-page>
</template>

<style  scoped>
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
  name: "Configuration",
  components: {},
  data: function() {
    return {
      form: {}
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      this.form = {
        email: localStorage.user_email,
        password: localStorage.user_password,
        url: localStorage.api_url
      };
    },
    submit() {
      if (!this.form.email || !this.form.password || !this.form.url) {
        return;
      }

      this.$http
        .post(`${this.form.url}/api/login`, {
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
          alert("No se logro conexion con la URL, verifique la URL.");
        })
        .then(() => {
          self.$f7.preloader.hide();
        });
    },
    saveToken(token, name, email) {
      localStorage.api_token = token;
      localStorage.user_name = name;
      localStorage.user_email = email;

      localStorage.api_url = this.form.url;
    },
    back() {
      this.$f7router.navigate("/panel-right/");
    },
  }
};
</script>
