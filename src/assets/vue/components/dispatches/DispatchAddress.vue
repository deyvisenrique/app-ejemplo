<template>
    <f7-page :class="theme.class_bg_header" :color="theme.name_color_theme">
    <f7-block>
      <f7-row class="display-flex align-items-center">
        <f7-col width="20" :class="theme.class_menu_text_color">
            <a @click="closePopup" class="link" :class="theme.class_menu_text_color">
                <i class="fas fa-angle-left custom-icon-back-form"></i>
            </a>
        </f7-col>
        <f7-col width="80" :class="theme.class_menu_text_color" class="custom-title-form">
            Nuevo punto de {{ title }}
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-card class="card-100 padding no-shadow" :color="theme.name_color_theme" style="min-height: 90%">
      <form class="list no-hairlines-md" id="demo-form-customer">
        <ul>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Direccion </div>
              <div class="item-input-wrap">
                <input v-model="form.address" required type="text" />
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Ubigeo</div>
              <div class="item-input-wrap">
                <div v-for="(level, index) in cascaderLevels" :key="index">
                  <select v-model="selectedValue[index]" @change="onSelectChange(index)">
                    <option v-for="item in level" :value="item.value" :key="item.value">
                      {{ item.label }}
                    </option>
                  </select>
                </div>
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>

          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Código de establecimiento </div>
              <div class="item-input-wrap">
                <input v-model="form.establishment_code" required type="text" />
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>

          <li class="item-content item-input">
            <f7-button fill round :color="theme.name_color_theme" class="bg-secondary padding-horizontal" @click="submit">Guardar</f7-button>
          </li>
        </ul>
      </form>
    </f7-card>

  </f7-page>
</template>

<script>
import {general_functions} from "mixins_/general_functions"
import { auth } from "mixins_/auth"
import _ from "lodash";

export default {
  mixins: [auth,general_functions],
  props: ["showDialog","personId"],
  data: function() {
    return {
      title:'llegada',
      form: {},
      theme: {},
      selectedValue: [],
      locations: [],
      cascaderLevels: [[]],
      currentLevel: 0,
    };
  },
  async created() {
    this.getInitialSettings()
    await this.getTables()
    this.initForm()
    this.initCascaderLevels();
  },
  methods: {
    async getTables() {
        const self = this;
        self.$f7.preloader.show();
        await this.$http.get(`${this.returnBaseUrl()}/dispatch-addresses/tables`, this.getHeaderConfig())
          .then(response => {
            this.locations = response.data.locations
          })
          .catch(err => {})
          .then(() => {
              self.$f7.preloader.hide();
          })
    },
    closePopup() {
      this.initForm();
      this.$emit("update:showDialog", false);
    },
    initForm() {
      this.form = {
        id: null,
        person_id: null,
        address: null,
        location_id: [],
        is_default:false,
        is_active: true,
        establishment_code: '0000'
      }
    },
    getInitialSettings() {
      this.theme = this.getThemeSettings()
    },
    changeDocumentType() {
      const selected = this.document_types.find(e => e.id === this.document_type)
      this.form.documento.id = selected.id
      this.form.documento.descripcion = selected.description
    },
    validate() {
      if (!this.form.address) {
        this.$f7.dialog.alert(`La dirección es requerida`, "Nueva Dirección");
        return false;
      }
      if (!this.form.person_id) {
        this.$f7.dialog.alert(`Cliente es requerido`, "Nueva Dirección");
        return false;
      }
      if (!this.form.establishment_code) {
        this.$f7.dialog.alert(`El código de establecimiento es requerido`, "Nueva Dirección");
        return false;
      }
      if (!this.form.location_id) {
        this.$f7.dialog.alert(`El ubigeo es requerido`, "Nueva Dirección");
        return false;
      }

      if (this.form.location_id.length<3) {
        this.$f7.dialog.alert(`Seleccionar ubigeo`, "Nueva Dirección");
        return false;
      }

      return true;
    },
    submit() {
      this.form.location_id = this.selectedValue;
      this.form.person_id = this.personId;
      
      if (!this.validate()) return;
      const self = this;
      self.$f7.preloader.show();
      this.$http
        .post(
          `${this.returnBaseUrl()}/dispatch-addresses/save`,
          this.form,
          this.getHeaderConfig()
        )
        .then(response => {

          self.$f7.dialog.alert(`Dirección guardada con éxito`, "Facturador PRO APP");

          if(response.data.success){
            let form_address ={
              address: this.form.address,
              code: this.form.establishment_code,
              id: response.data.id,
              location_id: this.form.location_id
            };
            this.$emit("addAddress", form_address)
            this.initForm()
            this.selectedValue = this.selectedValue.slice(0,1);
            this.cascaderLevels = this.cascaderLevels.slice(0,1);
          }

        })
        .catch(error => {
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
    initCascaderLevels() {
      this.cascaderLevels[0] = this.locations;
    },
    onSelectChange(level) {
      this.selectedValue = this.selectedValue.slice(0, level + 1);
      this.cascaderLevels = this.cascaderLevels.slice(0, level + 1);
      const selectedValue = this.selectedValue[level];
      const nextLevelOptions = this.getNextLevelOptions(this.locations, selectedValue);
      if (nextLevelOptions && this.selectedValue.length<3) {
        this.cascaderLevels.push(nextLevelOptions);
      }
      this.currentLevel = level + 1;
    },
    getNextLevelOptions(options, selectedValue) {
      for (const option of options) {
        if (option.value === selectedValue) {
          return option.children || [];
        }
      
        if (option.children) {
          const result = this.getNextLevelOptions(option.children, selectedValue);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    handleIsRemitenteChange(value) {
      this.title = (value===true)?'partida':'llegada';
    },
  }
}
</script>