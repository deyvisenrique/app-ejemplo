<template>
  <f7-page class="page-red-white" color="white">
    <f7-toolbar tabbar :position="isBottom ? 'bottom' : 'top'" bg-color="white" color="red" class="no-shadow">
      <f7-link
        href="/"
        icon-md="material:home">
        Inicio
      </f7-link>
      <f7-link
        tab-link-active
        tab-link="#"
        icon-md="material:insert_drive_file"
        class="text-align-center">
        Crear <br> comprobantes
      </f7-link>
      <f7-link
        href="/documents/"
        icon-md="material:view_stream"
        class="text-align-center">
        Listado de <br> comprobantes
      </f7-link>
      <f7-link
        href="/report/"
        icon-md="material:equalizer">
        Reportes
      </f7-link>
    </f7-toolbar>

    <f7-block>
      <f7-row>
        <f7-col width="90">
          <a class="link back text-color-white">
            <i class="icon icon-back"></i>
            <span class="">{{ title }}</span>
          </a>
        </f7-col>
        <f7-col width="10">
          <f7-link class="panel-open text-color-white text-align-right" open-panel="right" icon="fas fa-bars"></f7-link>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-card class="card-100 padding-top padding-horizontal no-shadow" color="red">

      <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
        <items-form :showDialog.sync="popupOpened" ref="form_items_car" @addItemsCar="addItems"></items-form>
      </f7-popup>

      <f7-popup
        class="demo-popup"
        :opened="popupCustomerOpened"
        @popup:closed="popupCustomerOpened = false">
        <customer-form
          :codeType="codeType"
          :customerId="form.customer_id"
          :showDialog.sync="popupCustomerOpened"
          ref="form_customer_car"
          @addCustomerCar="addCustomer"
        ></customer-form>
      </f7-popup>

      <f7-block>
        <form class="list no-hairlines-md" id="demo-form">
          <ul style="margin-bottom: 25% !important;">
            <f7-row>
              <f7-col width="50">
                <div class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Serie</div>
                    <div class="item-input-wrap input-dropdown-wrap">
                      <select v-model="form.serie_documento" placeholder="Please choose..." >
                        <template v-for="(row, index) in series">
                          <option :value="row.number" :key="index">{{row.number}}</option>
                        </template>
                      </select>
                    </div>
                  </div>
                </div>
              </f7-col>
              <f7-col width="50">
                <div class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Fecha Emisión</div>
                    <div class="item-input-wrap">
                      <input name="date" v-model="form.fecha_de_emision" type="date" />
                    </div>
                  </div>
                </div>
              </f7-col>
              <f7-col width="50">
                <div class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Orden de Compra</div>
                    <div class="item-input-wrap">
                      <input required validate v-model="form.numero_orden_de_compra" type="text" />
                      <span class="input-clear-button"></span>
                    </div>
                  </div>
                </div>
              </f7-col>
              <f7-col width="50">
                <div class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-title item-label">Fecha Vencimiento</div>
                    <div class="item-input-wrap">
                      <input name="date" v-model="form.fecha_de_vencimiento" type="date" />
                    </div>
                  </div>
                </div>
              </f7-col>
            </f7-row>

            <li>
              <f7-col>
                <f7-card style="font-weight:bold;color:#0f233c;background:#ddd;border-radius: 15px;">
                  <f7-card-content>
                    <f7-row>
                      <f7-col width="15" class="align-self-center">
                        <div class="badge bg-color-white">
                          <f7-icon icon="fas fa-user" size="24" color="blue"></f7-icon>
                        </div>
                      </f7-col>
                      <f7-col width="75" class="text-align-left">
                        <small>CLIENTE</small><br>
                        <small class="no-margin">{{this.form.datos_del_cliente_o_receptor ? this.form.datos_del_cliente_o_receptor.apellidos_y_nombres_o_razon_social : ''}}</small>
                      </f7-col>
                      <f7-col width="10" class="align-self-center">
                        <div class="badge bg-color-white text-align-right color-blue">
                          <f7-link @click="popupCustomerOpened = true" style="color:#0f233c;" icon="fas fa-arrow-right"></f7-link>
                        </div>
                      </f7-col>
                    </f7-row>
                  </f7-card-content>
                </f7-card>
              </f7-col>
            </li>

            <li style="margin-bottom: 5%;" class="item-content item-input">
              <br />
              <div class="data-table">
                <table>
                  <thead>
                    <tr>
                      <th class="numeric-cell"></th>
                      <th class="label-cell">#</th>
                      <th class="medium-cell">Descripcion</th>
                      <th class="medium-only">Cantidad</th>

                      <th class="medium-only text-align-right">Precio</th>
                      <th class="medium-only text-align-right">Subtotal</th>
                      <th class="medium-only text-align-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in form.items" :key="index">
                      <td class="numeric-cell">
                        <f7-icon
                          @click.native="deleteItem(row.item_id, index)"
                          color="red"
                          material="cancel"
                        ></f7-icon>
                      </td>
                      <td class="label-cell text-color-blue">{{index + 1 }}</td>
                      <td class="numeric-cell text-color-blue">{{row.item.description}}</td>
                      <td class="numeric-cell text-color-blue">{{row.quantity}}</td>

                      <td class="numeric-cell text-color-blue">S/.&nbsp;{{ Number(row.unit_price).toFixed(2)}}</td>
                      <td class="numeric-cell text-color-blue">S/.&nbsp;{{row.total_value}}</td>
                      <td class="numeric-cell text-color-blue">S/.&nbsp;{{row.total}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>

            <li class="padding-vertical">
              <f7-button @click="popupOpened = true" fill color="blue" class="text-align-left padding-left">
                <small>
                  <f7-icon icon="fas fa-plus"></f7-icon>
                  Añadir producto
                </small>
              </f7-button>
            </li>

            <li class="padding-bottom">
              <f7-card style="font-weight:bold;background:#d61a0c;border-radius: 15px;font-size: 12px;">
                <f7-card-content class="text-color-white">
                  <f7-row>
                    <f7-col width="50" class="padding-left">
                      <h2 class="no-padding no-margin-top" style="margin-bottom: -10px;">{{form.total_taxed}}</h2>
                      <small>OP.GRAVADA</small> <br><br>
                      <h2 class="no-padding no-margin-top" style="margin-bottom: -10px;">{{form.total_igv}}</h2>
                      <small>IGV</small>
                    </f7-col>
                    <f7-col width="50" class="align-self-center">
                      <h1 class="no-padding no-margin">{{form.total}}</h1>
                      TOTAL
                    </f7-col>
                  </f7-row>
                </f7-card-content>
              </f7-card>
              <f7-row class="btn-actions">
                <f7-col width="10" class="">
                  <f7-button raised fill color="gray"  @click="cancel">
                    <f7-icon icon="fas fa-trash"></f7-icon>
                  </f7-button>
                </f7-col>
                <f7-col width="80" class="">
                </f7-col>
                <f7-col width="10" class="">
                  <f7-button raised fill color="green"  @click="send">
                    <f7-icon icon="fas fa-check"></f7-icon>
                  </f7-button>
                </f7-col>
              </f7-row>
            </li>
          </ul>
        </form>
      </f7-block>
    </f7-card>
  </f7-page>
</template>

<style scoped>
.m-text {
  text-align: left;
  font-size: 12px;
  font-weight: bold;
}
.m-text-r {
  text-align: center;
}
.footer-text {
  position: absolute;
  margin-top: 2%;
  width: 50%;
  padding-left: 1%;
}
.footer-data {
  width: 50%;
  color: #fff;
  background: #17a2b8;
  margin: auto;
  border-right: 30px solid #fff;
  border-left: 30px solid #fff;
  border-bottom: 73px solid transparent;
  text-align: center;
}
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

import moment from "moment";
import _ from "lodash";
import ItemsForm from "components/document/ItemsForm";
import CustomerForm from "components/document/CustomerForm";

import { auth } from "mixins_/auth";

export default {
  name: "FormDocument",
  components: { ItemsForm, CustomerForm },
  mixins: [auth],
  data: function() {
    // Must return an object
    return {
      codeType: "",
      isBottom: true,
      search_item: "",
      form: {},
      popupOpened: false,
      popupCustomerOpened: false,
      title: "",
      series:[]
    };
  },
  computed: {},
  async created() {
    this.codeType = this.$f7route.params.cod;
    await this.initForm();
    //this.getTables();
    await this.selectDocumentType();
    await this.getSeries()
  },
  methods: {
    async getSeries() {

      const self = this;
      self.$f7.preloader.show();
      await this.$http.get(`${this.returnBaseUrl()}/document/series`, this.getHeaderConfig()).then(response => {

          let all_series = response.data;
          this.series = _.filter(all_series, {document_type_id:this.form.codigo_tipo_documento})
          this.initSeries()

        })
        .catch(err => {})
        .then(() => {
          self.$f7.preloader.hide();
        })

    },
    initSeries(){
      this.form.serie_documento = (this.series.length > 0) ? this.series[0].number : null
    },
    deleteItem(id, index) {
      this.form.items.splice(index, 1);
      this.$refs.form_items_car.delete_parent(id);
      this.calculateTotal()
    },
    addItems(rows) {

      let contex = this
      contex.popupOpened = false;
      rows.forEach(record => {
        contex.form.items.push(record)
      });
      this.calculateTotal();
    },
    addCustomer(row) {
      this.popupCustomerOpened = false;
      this.form.customer_id = row.id;
      this.form.datos_del_cliente_o_receptor = {
        codigo_tipo_documento_identidad: row.identity_document_type_id,
        numero_documento: row.number,
        apellidos_y_nombres_o_razon_social: row.name,
        codigo_pais: row.country_id,
        ubigeo: row.district_id ? row.district_id : '',
        direccion: row.address,
        correo_electronico: row.email,
        telefono: row.telephone
      };
    },
    cancel() {
      this.initForm();
      this.$f7router.navigate("/");
    },

    getFormatter() {
      return {
        serie_documento: this.form.serie_documento,
        numero_documento: this.form.numero_documento,
        fecha_de_emision: this.form.fecha_de_emision,
        hora_de_emision: this.form.hora_de_emision,
        codigo_tipo_operacion: this.form.codigo_tipo_operacion,
        codigo_tipo_documento: this.form.codigo_tipo_documento,
        codigo_tipo_moneda: "PEN",
        fecha_de_vencimiento: this.form.fecha_de_vencimiento,
        datos_del_cliente_o_receptor: this.form.datos_del_cliente_o_receptor,
        totales: {
          total_exportacion: this.form.total_exportation,
          total_operaciones_gravadas: this.form.total_taxed,
          total_operaciones_inafectas: this.form.total_unaffected,
          total_operaciones_exoneradas: this.form.total_exonerated,
          total_operaciones_gratuitas: this.form.total_free,
          total_impuestos_bolsa_plastica: 0.0,
          total_igv: this.form.total_igv,
          total_impuestos: this.form.total_taxes,
          total_valor: this.form.total_value,
          total_venta: this.form.total
        },
        items: this.form.items.map(x => {
          return {
            codigo_interno: x.item.internal_id,
            descripcion: x.item.description,
            codigo_producto_sunat: x.item.item_code,
            unidad_de_medida: x.item.unit_type_id,
            cantidad: x.quantity,
            valor_unitario: x.unit_value,
            codigo_tipo_precio: "01",
            precio_unitario: x.unit_price,
            codigo_tipo_afectacion_igv: x.affectation_igv_type_id,
            total_base_igv: x.total_base_igv,
            porcentaje_igv: x.percentage_igv,
            total_igv: x.total_igv,
            total_impuestos_bolsa_plastica: x.total_plastic_bag_taxes,
            total_impuestos: x.total_taxes,
            total_valor_item: x.total_value,
            total_item: x.total
          };
        })
      };
    },

    validate() {
      const self = this;

      if (!this.form.serie_documento) {
        self.$f7.dialog.alert(`Debe seleccionar una serie.`, "Mensaje");
        return false;
      }

      if (this.form.items.length == 0) {
        self.$f7.dialog.alert(`Debe agregar productos.`, "Mensaje");

        return false;
      }

      if (!this.form.customer_id) {
        self.$f7.dialog.alert(
          `Debe seleccionar un cliente.`,
          "Mensaje"
        );

        return false;
      }

      return true;
    },
    send() {
      const self = this;

      let valid = this.validate();

      if (!valid) return;

      self.$f7.preloader.show();

      this.$http
        .post(`${this.returnBaseUrl()}/documents`, this.getFormatter(), this.getHeaderConfig())
        .then(response => {
          let data = response.data;
          if (data.success) {
            this.initForm();

            self.$f7.dialog.alert(
              `Comprobante registrado:<br> ${data.data.number}`,
              "Mensaje"
            );
            self.$f7router.navigate("/documents/");
          } else {
            alert("No se registro la Compra");
          }
        })
        .catch(err => {
          alert(`${err.message}`);
        })
        .then(() => {
          self.$f7.preloader.hide();
        });
    },
    selectDocumentType() {
      if (this.form.codigo_tipo_documento == "01") {
        // this.form.serie_documento = "F001";
        this.title = "Factura Electrónica";
      } else if (this.form.codigo_tipo_documento == "03") {
        // this.form.serie_documento = "B001";
        this.title = "Boleta Electrónica";
      }
    },
    calculateTotal() {
      let total_discount = 0;
      let total_charge = 0;
      let total_exportation = 0;
      let total_taxed = 0;
      let total_exonerated = 0;
      let total_unaffected = 0;
      let total_free = 0;
      let total_igv = 0;
      let total_value = 0;
      let total = 0;
      let total_plastic_bag_taxes = 0;
      this.form.items.forEach(row => {
        if (row.affectation_igv_type_id === "10") {
          total_taxed += parseFloat(row.total_value);
        }
        if (row.affectation_igv_type_id === "20") {
          total_exonerated += parseFloat(row.total_value);
        }
        if (row.affectation_igv_type_id === "30") {
          total_unaffected += parseFloat(row.total_value);
        }
        if (row.affectation_igv_type_id === "40") {
          total_exportation += parseFloat(row.total_value);
        }
        if (["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) < 0) {
          total_free += parseFloat(row.total_value);
        }
        if (
          ["10", "20", "30", "40"].indexOf(row.affectation_igv_type_id) > -1
        ) {
          total_igv += parseFloat(row.total_igv);
          total += parseFloat(row.total);
        }
        total_value += parseFloat(row.total_value);
        total_plastic_bag_taxes += parseFloat(row.total_plastic_bag_taxes);
      });

      this.form.total_exportation = _.round(total_exportation, 2);
      this.form.total_taxed = _.round(total_taxed, 2);
      this.form.total_exonerated = _.round(total_exonerated, 2);
      this.form.total_unaffected = _.round(total_unaffected, 2);
      this.form.total_free = _.round(total_free, 2);
      this.form.total_igv = _.round(total_igv, 2);
      this.form.total_value = _.round(total_value, 2);
      this.form.total_taxes = _.round(total_igv, 2);
      this.form.total = _.round(total + this.form.total_plastic_bag_taxes, 2);
    },

    initForm() {
      this.form = {
        total_taxed: 0,
        total_plastic_bag_taxes: 0,
        total_igv: 0,
        total: 0,
        serie_documento: "",
        numero_documento: "#",
        fecha_de_emision: moment().format("YYYY-MM-DD"),
        hora_de_emision: moment().format("HH:mm:ss"),
        codigo_tipo_operacion: "0101",
        codigo_tipo_documento: this.$f7route.params.cod,
        codigo_tipo_moneda: "PEN",
        fecha_de_vencimiento: moment().format("YYYY-MM-DD"),
        numero_orden_de_compra: "",
        informacion_adicional: "",
        datos_del_cliente_o_receptor: {},
        totales: {},
        items: []
      };

      this.initSeries()

    }
  }
};
</script>
