<template>
  <f7-page :color="theme.name_color_theme" :class="theme.class_bg_body">
    <header-layout :title="title"></header-layout>

    <f7-card class="padding margin-top" no-shadow>
      <form class="list no-hairlines-md" id="demo-form">
        <ul>
          <f7-row>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Serie</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.serie_documento" placeholder="Please choose...">
                      <option v-for="(row, index) in series" :value="row.number" :key="index">{{row.number}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Punto de partida</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="origin_address" placeholder="Please choose..." @change="changeOriginAddress">
                      <option v-for="(row, index) in establishments" :value="row.id" :key="index">{{row.address}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Fecha Emisión</div>
                  <div class="item-input-wrap">
                    <input name="date" v-model="form.fecha_de_emision" type="date" />
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Fecha Traslado</div>
                  <div class="item-input-wrap">
                    <input name="date" v-model="form.fecha_de_traslado" type="date" />
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Motivo de Traslado</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.codigo_motivo_traslado" placeholder="Please choose...">
                      <option v-for="(row, index) in transfer_reason_types" :value="row.id" :key="index">{{row.description}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Modo de Traslado</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.codigo_modo_transporte" placeholder="Please choose...">
                      <option v-for="(row, index) in transport_mode_types" :value="row.id" :key="index"> {{row.description}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="100" v-if="form.codigo_modo_transporte == '01'">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Datos del transportista</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="dispatcher" placeholder="Please choose..." @change="changeDispatcher">
                      <option v-for="(row, index) in dispatchers" :value="row.id" :key="index">{{row.name}} - {{ row.number }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50" v-if="form.codigo_modo_transporte == '02'">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Datos del conductor</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="driver" placeholder="Please choose..." @change="changeDriver">
                      <option v-for="(row, index) in drivers" :value="row.id" :key="index">{{row.number}} - {{ row.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50" v-if="form.codigo_modo_transporte == '02'">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Datos del vehículo</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="transport" placeholder="Please choose..." @change="changeTransport">
                      <option v-for="(row, index) in transports" :value="row.plate_number" :key="index">{{row.plate_number}} - {{ row.model }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="33">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Unidad de medida</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.unidad_peso_total" placeholder="Please choose...">
                      <option v-for="(row, index) in unit_types" :value="row.id" :key="index">{{row.description}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="33">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Peso total</div>
                  <div class="item-input-wrap">
                    <input required validate v-model="form.peso_total" type="number" min="0.01" step="0.01"/>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="33">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Número de paquetes</div>
                  <div class="item-input-wrap">
                    <input required validate v-model="form.numero_de_bultos" type="number" min="0"/>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Descripción de motivo de traslado</div>
                  <div class="item-input-wrap">
                    <input v-model="form.descripcion_motivo_traslado" type="text" />
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Observación</div>
                  <div class="item-input-wrap">
                    <input v-model="form.observaciones" type="text" />
                  </div>
                </div>
              </div>
            </f7-col>
          </f7-row>
          <li class="padding-vertical">
            <f7-button @click="popupDocumentOpened = true" class="bg-white-shade text-align-left padding-left">
              <small>
                <f7-icon icon="fas fa-plus"></f7-icon>
                Documento relacionado
              </small>
            </f7-button>
          </li>
          <f7-col v-show="form.documento_relacionado.length > 0" width="100" class="data-table">
            <table>
              <thead>
                <tr>
                  <th class="numeric-cell" width="5%"></th>
                  <th class="label-cell">Documento</th>
                  <th class="label-cell">Número</th>
                  <th class="medium-cell">Proveedor</th>
                  <th class="medium-cell">RUC</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in form.documento_relacionado" :key="index">
                  <td class="no-padding numeric-cell">
                    <f7-button @click.native="deleteDocument(index)">
                      <f7-icon color="red" material="cancel"></f7-icon>
                    </f7-button>
                  </td>
                  <td class="no-padding label-cell text-align-center">{{row.documento.descripcion}}</td>
                  <td class="no-padding numeric-cell text-align-left">{{row.numero}}</td>
                  <td class="no-padding padding-right numeric-cell">{{row.empresa}}</td>
                  <td class="no-padding padding-right numeric-cell">{{row.ruc}}</td>
                </tr>
              </tbody>
            </table>
          </f7-col>
          <li class="no-padding-horizontal margin-top">
            <f7-block class="bg-white-shade block-strong inset no-margin">
              <f7-row @click="popupCustomerOpened = true">
                <f7-col width="15" class="align-self-center">
                  <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                </f7-col>
                <f7-col width="75" class="text-align-left">
                  <small>CLIENTE</small><br>
                  <small class="no-margin">{{this.form.datos_del_cliente_o_receptor ? this.form.datos_del_cliente_o_receptor.apellidos_y_nombres_o_razon_social : ''}}</small>
                </f7-col>
                <f7-col width="10" class="align-self-center">
                  <div class="badge bg-color-white text-align-right color-blue">
                    <f7-link style="color:#0f233c;" icon="fas fa-arrow-right"></f7-link>
                  </div>
                </f7-col>
              </f7-row>
            </f7-block>
          </li>
          <f7-row class="item-content item-input no-padding-horizontal">
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label flex-container">
                    <span>Punto de llegada</span>
                    <f7-button v-show="!isObjectEmpty(form.datos_del_cliente_o_receptor)" @click="popupAddressOpened = true" class="text-align-left padding-left">
                      <small>
                        <f7-icon icon="fas fa-plus"></f7-icon>
                        Nuevo
                      </small>
                    </f7-button>
                  </div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select required validate v-model="delivery_address" placeholder="Please choose..." @change="changeDeliveryAddress">
                      <option v-for="(row, index) in delivery_addresses" :value="row.id" :key="index">{{row.address}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="100" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th class="numeric-cell" width="5%"></th>
                    <th class="label-cell">#</th>
                    <th class="medium-cell">Descripción</th>
                    <th class="medium-only text-align-right">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in form.items" :key="index">
                    <td class="no-padding numeric-cell">
                      <f7-button @click.native="deleteItem(row.item_id, index)">
                        <f7-icon color="red" material="cancel"></f7-icon>
                      </f7-button>
                    </td>
                    <td class="no-padding label-cell text-align-center">{{index + 1 }}</td>
                    <td class="no-padding numeric-cell text-align-left">{{row.input_description}}</td>
                    <td class="no-padding padding-right numeric-cell">{{row.quantity}}</td>
                  </tr>
                </tbody>
              </table>
            </f7-col>
          </f7-row>
          <li class="padding-vertical">
            <f7-button @click="popupOpened = true" fill :color="theme.name_color_theme+'-shade'" class="text-align-left padding-left">
              <small>
                <f7-icon icon="fas fa-plus"></f7-icon>
                Añadir producto
              </small>
            </f7-button>
          </li>
        </ul>
        <f7-row>
          <f7-col>
            <f7-button fill round small color="gray" @click="cancel">
              Cancelar
            </f7-button>
          </f7-col>
          <f7-col>
            <f7-button fill round small class="bg-secondary" :color="theme.name_color_theme" @click="send">
              Aceptar
            </f7-button>
          </f7-col>
        </f7-row>
      </form>
    </f7-card>
    <f7-popup class="demo-popup" :opened="popupOpened" @popup:closed="popupOpened = false">
      <items-form :showDialog.sync="popupOpened" ref="form_items_car" @addItemsCar="addItems"></items-form>
    </f7-popup>

    <f7-popup class="demo-popup" :opened="popupCustomerOpened" @popup:closed="popupCustomerOpened = false">
      <customer-form :codeType="codeType" :customerId="form.customer_id" :showDialog.sync="popupCustomerOpened" ref="form_customer_car" @addCustomerCar="addCustomer"></customer-form>
    </f7-popup>

    <f7-popup class="demo-document" :opened="popupDocumentOpened" @popup:closed="popupDocumentOpened = false">
      <reference-document-form :showDialog.sync="popupDocumentOpened" ref="form_document_car" @addDocument="addDocument" dispatchType="09"></reference-document-form>
    </f7-popup>

    <f7-popup class="demo-popu" :opened="popupAddressOpened" @popup:closed="popupAddressOpened = false">
      <dispatch-address-form :personId="form.customer_id" :showDialog.sync="popupAddressOpened" @addAddress="addAddress" ></dispatch-address-form>
    </f7-popup>
  </f7-page>
</template>

<script>
  import moment from "moment"
  import _ from "lodash"
  import ItemsForm from "components/document/ItemsForm"
  import CustomerForm from "components/document/CustomerForm"
  import { auth } from "mixins_/auth"
  import { general_functions } from "mixins_/general_functions"
  import {findGeneralDefaultSerie} from "js_/helpers/functions"
  import HeaderLayout from "components/layout/Header"
  import ReferenceDocumentForm from "components/dispatches/ReferenceDocuments"
  import DispatchAddressForm from "components/dispatches/DispatchAddress"

  export default {
    name: "FormDispatch",
    components: {
        ItemsForm,
        CustomerForm,
        HeaderLayout,
        ReferenceDocumentForm,
        DispatchAddressForm
    },
    mixins: [auth, general_functions],
    data: function () {
        return {
            codeType: "",
            isBottom: true,
            search_item: "",
            form: {},
            popupOpened: false,
            popupCustomerOpened: false,
            popupDocumentOpened: false,
            popupAddressOpened: false,
            title: "Guía de Remisión Remitente",
            all_payment_method_types: [],
            payment_destinations: [],
            series: [],
            payment_change: 0,
            form_payment: {},
            form_fee: {},
            cash_payment_method_types: [],
            credit_payment_method_types: [],
            configuration: {},
            default_customer: null,
            theme: {},
            establishments: {},
            transport_mode_types: {},
            transfer_reason_types: {},
            unit_types: {},
            origin_address: '',
            delivery_address: '',
            delivery_addresses: {},
            dispatchers: {},
            dispatcher: '',
            drivers: {},
            transports: {},
            driver: '',
            transport: '',
            theme: {},
        };
    },
    async created() {
      await this.loadConfiguration()
      await this.getTables()
      await this.initForm()
      await this.getSeries()
      this.getInitialSettings()
    },
    methods: {
      loadConfiguration(){
        this.configuration = this.getInitialConfiguration()
      },
      initForm() {
        this.form = {
          serie_documento: "",
          numero_documento: "#",
          fecha_de_emision: moment().format("YYYY-MM-DD"),
          hora_de_emision: moment().format("HH:mm:ss"),
          codigo_tipo_documento: '09',
          datos_del_cliente_o_receptor: {},
          items: [],
          numero_de_contenedor: '',
          codigo_de_puerto: '',
          indicador_de_transbordo: false,
          numero_de_placa: '',
          codigo_modo_transporte: this.transport_mode_types[0].id,
          codigo_motivo_traslado: this.transfer_reason_types[0].id,
          unidad_peso_total: this.unit_types[0].id,
          transportista: [],
          direccion_llegada: [],
          delivery_address: null,
          documento_relacionado: [],
          customer_id:null,
        };
        this.initSeries()
        this.dispatcher = ''
        this.origin_address = ''
        this.driver = ''
        this.transport = ''
      },
      async getTables() {
        const self = this;
        self.$f7.preloader.show();
        await this.$http.get(`${this.returnBaseUrl()}/dispatches/tables`, this.getHeaderConfig())
          .then(response => {
            this.establishments = response.data.establishments
            this.transport_mode_types = response.data.transportModeTypes
            this.transfer_reason_types = response.data.transferReasonTypes
            this.unit_types = response.data.unitTypes
            this.dispatchers = response.data.dispatchers
            this.drivers = response.data.drivers
            this.transports = response.data.transports
            // this.setDefaults()
          })
          .catch(err => {})
          .then(() => {
              self.$f7.preloader.hide();
          })
      },
      async getSeries() {
        const self = this;
        self.$f7.preloader.show();
        await this.$http.get(`${this.returnBaseUrl()}/document/series`, this.getHeaderConfig())
          .then(response => {
              let all_series = response.data;
              this.series = _.filter(all_series, {
                  document_type_id: this.form.codigo_tipo_documento
              })
              this.initSeries()
          })
          .catch(err => {})
          .then(() => {
              self.$f7.preloader.hide();
          })
      },
      initSeries() {
        const default_series = findGeneralDefaultSerie(this.series, this.form.codigo_tipo_documento)
        if(default_series) {
          this.form.serie_documento = default_series.number
        }
        else {
          this.form.serie_documento = (this.series.length > 0) ? this.series[0].number : null
        }
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
        this.delivery_addresses = row.addresses
      },
      addItems(rows) {
        this.popupOpened = false;
        rows.forEach(record => {
          let context = this
          context.popupOpened = false;
          rows.forEach(record => {
            context.form.items.push(record)
          });
        });
      },
      addDocument(row) {
        this.popupDocumentOpened = false;
        this.form.documento_relacionado.push(row)
      },
      deleteDocument(index) {
        this.form.documento_relacionado.splice(index, 1);
      },
      deleteItem(id, index) {
        this.form.items.splice(index, 1);
        this.$refs.form_items_car.delete_parent(id);
      },
      changeOriginAddress() {
        let establishment =  _.find(this.establishments, {id : this.origin_address})
        this.form.direccion_partida = {
          ubigeo: establishment.district_id,
          direccion: establishment.address,
          codigo_del_domicilio_fiscal: establishment.code
        }
        this.form.datos_del_emisor = {
          codigo_pais: establishment.country_id,
          ubigeo: establishment.district_id,
          direccion: establishment.address,
          correo_electronico: establishment.email,
          telefono: establishment.telephone,
          codigo_del_domicilio_fiscal: establishment.code
        }
      },
      changeDeliveryAddress() {
        if(this.form.customer_id) {
          let delivery =  _.find(this.delivery_addresses, {id : this.delivery_address})
          this.form.direccion_llegada = {
            ubigeo: delivery.location_id[2],
            direccion: delivery.address,
            codigo_del_domicilio_fiscal: delivery.code
          }
        } else {
          this.delivery_address = null
        }
      },
      changeDispatcher() {
        let dispatcher =  _.find(this.dispatchers, {id : this.dispatcher})
        this.form.transportista = {
          codigo_tipo_documento_identidad: dispatcher.identity_document_type_id,
          numero_documento: dispatcher.number,
          apellidos_y_nombres_o_razon_social: dispatcher.name,
          numero_mtc: dispatcher.number_mtc
        }
      },
      changeDriver() {
        let driver =  _.find(this.drivers, {id : this.driver})
        this.form.chofer = {
          codigo_tipo_documento_identidad: driver.identity_document_type_id,
          numero_documento: driver.number,
          nombres: driver.name,
          apellidos: driver.name,
          numero_licencia: driver.license,
        }
      },
      cancel() {
        this.initForm();
        this.$f7router.navigate("/");
      },
      send() {
        const self = this
        this.$f7.preloader.show();
        let valid = this.validate()
        if (!valid){
          this.$f7.preloader.hide();
          return
        }

        this.$http.post(`${this.returnBaseUrl()}/dispatches`, this.getFormatter(), this.getHeaderConfig())
          .then(response => {
            let data = response.data
            if (data.success) {
              this.initForm()
              this.changeDeliveryAddress()
              self.$f7.dialog.create({
                  title: 'Comprobante registrado',
                  text: data.data.number,
                  buttons: self.getOptionsButtons(),
                  onClick: function(dialog, index){
                    self.clickOptionsButtons(dialog, index, data)
                  },
                  verticalButtons: true,
              }).open()
            } else {
              alert("No se registro la Venta")
            }
          })
          .catch(err => {
            if(err.response.data.message) {
              self.$f7.dialog.alert(`${err.response.data.message}`, "Error")
            } else {
              self.$f7.dialog.alert(`${err.message}`, "Error")
            }
          })
          .then(() => {
            this.$f7.preloader.hide();
          })
      },
      getOptionsButtons(){
        return [
          {
            text: 'Descargar',
            cssClass: 'text-center',
            close: false
          },
          {
            text: 'Descargar ticket',
            cssClass: 'text-center',
            close: false
          },
          {
            text: 'Crear Nuevo',
            cssClass: 'text-center'
          },
        ]
      },
      clickOptionsButtons(dialog, index, data){
        // Descargar A4
        if (index === 0)
        {
          cordova.InAppBrowser.open(
            `${localStorage.api_url}/print/dispatch/${data.data.external_id}/a4`,
            "_system",
            "location=yes"
          )
        }
        else if (index === 1)
        {
          cordova.InAppBrowser.open(
            `${localStorage.api_url}/print/dispatch/${data.data.external_id}/ticket`,
            "_system",
            "location=yes"
          )
        }
      },
      validate() {
        if (!this.form.serie_documento) {
          this.$f7.dialog.alert(`Debe seleccionar una serie.`, "Mensaje")
          return false
        }
        if (this.form.items.length == 0) {
          this.$f7.dialog.alert(`Debe agregar productos.`, "Mensaje")
          return false
        }
        if (!this.form.fecha_de_traslado) {
          this.$f7.dialog.alert(`Debe agregar fecha de traslado.`, "Mensaje")
          return false
        }
        if (!this.form.customer_id) {
          this.$f7.dialog.alert(`Debe seleccionar un cliente.`, "Mensaje")
          return false
        }
        if (!this.form.direccion_partida) {
          this.$f7.dialog.alert(`Debe seleccionar direccion de partida.`, "Mensaje")
          return false
        }
        if (!this.form.direccion_llegada) {
          this.$f7.dialog.alert(`Debe seleccionar direccion de llegada.`, "Mensaje")
          return false
        }
        if (!this.form.peso_total) {
          this.$f7.dialog.alert(`Debe indicar el peso total.`, "Mensaje")
          return false
        }
        if(this.form.codigo_modo_transporte == '01') {
          if (!this.form.transportista) {
            this.$f7.dialog.alert(`Debe seleccionar un transportista`, "Mensaje")
            return false
          }
        }
        if(this.form.codigo_modo_transporte == '02') {
          if (!this.form.chofer) {
            this.$f7.dialog.alert(`Debe seleccionar un chofer`, "Mensaje")
            return false
          }
          if (!this.form.numero_de_placa) {
            this.$f7.dialog.alert(`Debe seleccionar un transporte`, "Mensaje")
            return false
          }
        }
        return true
      },
      getFormatter() {
        this.form.items.forEach(item => {
          item.cantidad = item.quantity,
          item.codigo_interno = item.item.internal_id
        })
        if(this.form.codigo_modo_transporte == '02') {
          delete this.form.transportista
        }
        if(this.form.codigo_modo_transporte == '01') {
          delete this.form.chofer
          delete this.form.numero_de_placa
          delete this.form.vehiculo
        }

        return this.form
      },
      changeTransport() {
        let transport =  _.find(this.transports, {plate_number : this.transport})
        this.form.numero_de_placa = this.transport
        this.form.vehiculo = {
          numero_de_placa: transport.plate_number,
          modelo: transport.model,
          marca: transport.brand
        }
      },
      getInitialSettings() {
        this.theme = this.getThemeSettings()
      },
      isObjectEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      },
      addAddress(row) {
        this.delivery_addresses.push(row);
        this.delivery_address= row.id;
        this.changeDeliveryAddress();
        this.popupAddressOpened = false;
      },
    }
  }
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: center;
}
</style>