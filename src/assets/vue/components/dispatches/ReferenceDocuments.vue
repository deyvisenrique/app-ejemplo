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
            Registrar Documento
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-card class="card-100 padding no-shadow" :color="theme.name_color_theme" style="min-height: 90%">
      <form class="list no-hairlines-md" id="demo-form-customer">
        <ul>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Número de documento <small class="color-gray">XXXX-N</small></div>
              <div class="item-input-wrap">
                <input v-model="form.numero" required type="text" />
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Tipo de documento</div>
              <div class="item-input-wrap input-dropdown-wrap">
                <select @change="changeDocumentType" required v-model="document_type" placeholder="Seleccione">
                  <option v-for="(document, index) in document_types" :value="document.id" :key="index">{{ document.description }}</option>
                </select>
              </div>
            </div>
          </li>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Proveedor</div>
              <div class="item-input-wrap">
                <input v-model="form.empresa" required validate type="text" />
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">RUC del proveedor</div>
              <div class="item-input-wrap">
                <input
                  v-model="form.ruc"
                  required
                  validate
                  type="text"
                  maxlength="11"
                />
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

export default {
  mixins: [general_functions],
  props: ["showDialog","dispatchType"],
  data: function() {
    return {
      form: {},
      theme: {},
      document_types: [],
      document_types_09: [
        {
          'id': '01',
          'description': 'Factura Electrónica',
          'conditional': '09'
        },
        {
          'id': '03',
          'description': 'Boleta Electrónica',
          'conditional': '09'
        }
      ],
      document_types_31: [
        {
          'id': '09',
          'description': 'Guía de remisión remitente',
          'conditional': '31'
        }
      ],
      document_type: null,
    };
  },
  async created() {
    await this.initForm()
    await this.getInitialSettings()
  },
  methods: {
    closePopup() {
      this.$emit("update:showDialog", false);
    },
    initForm() {
      if(this.dispatchType == '09') {
        this.document_types = this.document_types_09
      } else {
        this.document_types = this.document_types_31
      }

      this.form = {
        numero: null,
        empresa: null,
        ruc: null,
        documento: {
          id: null,
          descripcion: null
        }
      }
      this.document_type = null;
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
      if (!this.form.numero) {
        this.$f7.dialog.alert(`el número es requerido`, "Documento relacionado");
        return false;
      }
      if (!this.form.empresa) {
        this.$f7.dialog.alert(`el proveedor es requerido`, "Documento relacionado");
        return false;
      }
      if (!this.form.ruc) {
        this.$f7.dialog.alert(`el número de documento es requerido`, "Documento relacionado");
        return false;
      }
      if (!this.form.documento.id) {
        this.$f7.dialog.alert(`el tipo de documento es requerido`, "Documento relacionado");
        return false;
      }

      return true;
    },
    submit() {
      if (!this.validate()) return;
      this.$emit("addDocument", this.form)
      this.initForm()
    }
  }
}
</script>