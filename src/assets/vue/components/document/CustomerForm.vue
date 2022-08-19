<template>
  <f7-page :class="theme.class_bg_header" :color="theme.name_color_theme">
    <f7-block>
      <f7-row class="display-flex align-items-center">
        <f7-col width="20" :class="theme.class_menu_text_color">
            <a @click="closePopup" class="link" :class="theme.class_menu_text_color">
                <i class="fas fa-angle-left custom-icon-back-form"></i>
            </a>
        </f7-col>
        <f7-col width="70" :class="theme.class_menu_text_color" class="custom-title-form">
            Listado de clientes
        </f7-col>
        <f7-col width="10">
          <f7-link @click="addForm = !addForm" :class="theme.class_menu_text_color" class="text-align-right" open-panel="right" icon="fas fa-plus"></f7-link>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-card class="card-100 padding no-shadow" :color="theme.name_color_theme" style="min-height: 90%">
      <f7-block style="padding:0px">
        <div class="searchbar searchbar-inline padding">
          <div class="searchbar-input-wrap">
            <input type="search" placeholder="Buscar cliente.." v-model="search_item" />
            <i class="searchbar-icon"></i>
            <span class="input-clear-button"></span>
          </div>
        </div>
        <div class="list inset">
          <ul>
            <li v-for="(item, index) in items" :key="index">
              <a @click="selected(item)" href="#" class="item-content" style="color:#212121">
                <div class="item-media">
                  <f7-icon :material="item.selected ? 'check_box' : 'check_box_outline_blank'"></f7-icon>
                </div>
                <div class="item-inner">
                  <div class="item-title">
                    {{item.name}}<br>
                    <small><span v-if="item.identity_document_type_id == '6'">RUC: </span>{{item.number}}</small>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </f7-block>
    </f7-card>

    <f7-sheet
      class="demo-sheet default-h-modal"
      :opened="addForm"
      @sheet:closed="addForm = false">
      <!-- Scrollable sheet content -->
      <f7-toolbar class="bg-white">
        <div class="left padding-horizontal">
          <div class="custom-title-form padding-left text-color-gray">
            Nuevo Cliente
          </div>
        </div>
        <div class="right padding-horizontal">
          <f7-link small sheet-close class="no-margin no-padding text-color-gray">
            <f7-icon material="close"></f7-icon>
          </f7-link>
        </div>
      </f7-toolbar>
      <f7-page-content>
        <f7-block style="margin-top: 0px !important;" :color="theme.name_color_theme">
          <form class="list no-hairlines-md" id="demo-form-customer">
            <ul>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Tipo Doc. Identidad</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.identity_document_type_id" placeholder="Seleccione">
                      <option value="1">DNI</option>
                      <option value="6">RUC</option>
                    </select>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Número</div>

                  <div class="row no-gap" style="width:100%">
                    <div class="col-70">
                      <div class="item-input-wrap">
                        <input
                          v-model="form.number"
                          required
                          validate
                          type="text"
                          :maxlength="maxLength"
                        />
                        <span class="input-clear-button"></span>
                      </div>
                    </div>
                    <div class="col-25">
                      <f7-button style="font-size: 12px;" @click="searchServiceNumberByType" class="col" icon="fas fa-search fa-fw" fill color="deeppurple">
                          <template v-if="form.identity_document_type_id === '6'">SUNAT</template>
                          <template v-if="form.identity_document_type_id === '1'">RENIEC</template>
                      </f7-button>
                    </div>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Nombre *</div>
                  <div class="item-input-wrap">
                    <input v-model="form.name" required validate type="text" />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Nombre comercial</div>
                  <div class="item-input-wrap">
                    <input v-model="form.trade_name" type="text" />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Dirección</div>
                  <div class="item-input-wrap">
                    <input v-model="form.address" type="text" />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Teléfono</div>
                  <div class="item-input-wrap">
                    <input v-model="form.telephone" type="tel" />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Correo electrónico</div>
                  <div class="item-input-wrap">
                    <input v-model="form.email" validate type="email" />
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>

              <li class="item-content item-input">
                <f7-button fill round :color="theme.name_color_theme" class="bg-secondary padding-horizontal" @click="submit">Guardar</f7-button>
              </li>
            </ul>
          </form>
        </f7-block>
      </f7-page-content>
    </f7-sheet>
  </f7-page>
</template>

<style scoped>
.page-content {
  padding-top: 2% !important;
}
</style>

<script>
import { auth } from "mixins_/auth"
import {general_functions} from "mixins_/general_functions"
import _ from "lodash";

export default {
  mixins: [auth,general_functions],
  name: "CustomerForm",
  components: {},
  props: ["showDialog", "codeType", 'customerId'],
  data: function() {
    return {
      search_item: "",
      addForm: false,
      items: [],
      items_base: [],
      form: {},
      theme: {},
    };
  },
  computed: {
    maxLength: function() {
      if (this.form.identity_document_type_id === "6") {
        return 11;
      }
      if (this.form.identity_document_type_id === "1") {
        return 8;
      }
    }
  },
  async created() {
    await this.initForm()
    await this.getInitialSettings()
    await this.getData()
  },
  watch: {
    search_item: function(val) {
       if (val.length > 1) {
        this.searchCustomers();
      } else if (val.length == 0) {
        this.initItems();
      }
    },
    showDialog: function(val) {
      if (val && !this.customerId) {
        this.cleanItemsSelected()
      }

      this.initItems()
    }
  },
  methods: {
    initForm() {
      this.form = {
        id: null,
        type: 'customers',
        identity_document_type_id: "6",
        number: "",
        name: null,
        trade_name: null,
        country_id: "PE",
        department_id: null,
        province_id: null,
        district_id: null,
        address: null,
        telephone: null,
        condition: null,
        state: null,
        email: null,
        perception_agent: false,
        percentage_perception: 0,
        more_address: []
      };

    },
    cleanItemsSelected(){
      this.items.forEach(item => (item.selected = false));
    },
    validate() {
      if (!this.form.number) {
        this.$f7.dialog.alert(
          `Ingresar el número a buscar`,
          "Facturador PRO APP"
        );

        return false;
      }

      if (!this.form.name) {
        this.$f7.dialog.alert(`Ingresar el nombre`, "Facturador PRO APP");
        return false;
      }

      return true;
    },
    submit() {

      if (!this.validate()) return;

      const self = this;
      self.$f7.preloader.show();
      this.$http
        .post(
          `${this.returnBaseUrl()}/person`,
          this.form,
          this.getHeaderConfig()
        )
        .then(response => {

          self.$f7.dialog.alert(`${response.data.msg}`, "Facturador PRO APP");

          if(response.data.success){

            this.addForm = false;
            this.initForm()
            let it = response.data.data;
            // self.items.push(it);
            self.items_base.push(it)
            this.initItems()

          }

        })
        .catch(error => {

          // console.log( error.response.data.message)
          if (error.response.status === 422) {
              let errors = error.response.data.message

              if(errors.number){
                self.$f7.dialog.alert(`Error: ${errors.number[0]}`, "Facturador PRO APP");
              }

          } else {
              console.log(error)
              alert("Sucedio un error al guardar.");
          }
        })
        .then(() => {
          self.$f7.preloader.hide();
        });
    },
    closePopup() {
      this.$emit("update:showDialog", false);
    },
    selected(item) {
      this.items.forEach(element => (element.selected = false));
      item.selected = !item.selected;

      this.$emit("addCustomerCar", item);
    },
    initItems()
    {
        const self = this;

        if (self.codeType == "01") {
            self.items = self.items_base.filter(
              o => o.identity_document_type_id == "6"
            );
        } else {
          self.items = self.items_base;
        }

    },
    getData() {
      const self = this;
      self.$f7.preloader.show();
      this.$http
        .get(
          `${this.returnBaseUrl()}/document/customers`,
          this.getHeaderConfig()
        )
        .then(response => {

          let source = response.data.data;

          self.items_base = source.customers;

          self.initItems()
        })
        .catch(err => {
          console.log(err);
        })
        .then(() => {
          self.$f7.preloader.hide();
        });
    },
    async searchServiceNumberByType() {
      if (this.form.number === "") {
        this.$f7.dialog.alert(
          `Ingresar el número a buscar`,
          "Facturador PRO APP"
        );

        return;
      }

      this.$f7.preloader.show();

      let identity_document_type_name = "";
      if (this.form.identity_document_type_id === "6") {
        identity_document_type_name = "ruc";
      }
      if (this.form.identity_document_type_id === "1") {
        identity_document_type_name = "dni";
      }
      //this.loading_search = true;

      try{
        let {data} = await this.$http.get(`${this.returnBaseUrl()}/service/${identity_document_type_name}/${this.form.number}`,this.getHeaderConfig());

        if (data.success) {

          let resource = data.data;

          if(identity_document_type_name == 'ruc')
          {
            this.form.name = resource.name;
            this.form.trade_name = resource.trade_name;
            this.form.address = resource.address;
            this.form.department_id = resource.department_id;
            this.form.province_id = resource.province_id;
            this.form.district_id = resource.district_id;
            this.form.phone = null;
          }
          else if(identity_document_type_name == 'dni')
          {
            this.form.name = resource.name;
            this.form.trade_name = null;
            this.form.address = resource.address;
            this.form.department_id = resource.department_id;
            this.form.province_id = resource.province_id;
            this.form.district_id = resource.district_id;
            this.form.phone = null;
          }
          this.$f7.dialog.alert(`Datos encontrados.`, "Facturador PRO APP");
        } else {
          this.$f7.dialog.alert(`No hay datos.`, "Facturador PRO APP");
        }

      }
      catch(error)
      {
        this.$f7.dialog.alert(`No hay datos.`, "Facturador PRO APP");
      }
      finally{
        this.$f7.preloader.hide();
      }

    },
    async searchCustomers()
    {

      if (this.search_item.length > 1) {

          const self = this;
          self.$f7.preloader.show();

          let parameters = `input=${this.search_item}&document_type_id=${this.codeType}`

          await this.$http.get(`${this.returnBaseUrl()}/document/search-customers?${parameters}`, this.getHeaderConfig())
            .then(response => {

              this.items = response.data.data.customers

          })
            .catch(err => {
              alert('Error')
            })
          .then(()=> {
              self.$f7.preloader.hide();
          })


      }
      else{
       // this.initItems()
      }
    },
    getInitialSettings() {
      this.theme = this.getThemeSettings()
    },
  }
};
</script>
