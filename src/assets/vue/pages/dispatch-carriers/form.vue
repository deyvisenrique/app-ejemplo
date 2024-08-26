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
                    <select v-model="form.serie_documento" placeholder="Seleccionar">
                      <option v-for="(row, index) in series" :value="row.number" :key="index">{{row.number}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Establecimiento</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="origin_address" placeholder="Seleccionar" @change="changeOriginAddress">
                      <option v-for="(row, index) in establishments" :value="row.id" :key="index">{{row.description}} : {{row.address}}</option>
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
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Datos del conductor</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="selectedDriver" placeholder="Seleccionar" @change="addDriver"
                    :disabled="selectedDrivers.length >= 3">
                      <option v-for="(row, index) in drivers" :value="row" :key="index">{{row.number}} - {{ row.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col v-show="selectedDrivers.length > 0" width="100" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th class="numeric-cell" width="5%"></th>
                    <th class="label-cell">Conductor</th>
                    <th class="label-cell">Número</th>
                    <th class="label-cell">Nombre</th>
                    <th class="label-cell">Licencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in selectedDrivers" :key="index">
                    <td class="no-padding numeric-cell">
                      <f7-button @click.native="removeDriver(index)">
                        <f7-icon color="red" material="cancel"></f7-icon>
                      </f7-button>
                    </td>
                    <td class="no-padding label-cell text-align-center">{{ (index===0)?'Principal':'Secundario' }}</td>
                    <td class="no-padding label-cell text-align-left">{{row.number}}</td>
                    <td class="no-padding label-cell">{{row.name}}</td>
                    <td class="no-padding label-cell">{{row.license}}</td>
                  </tr>
                </tbody>
              </table>
            </f7-col>
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Datos del vehículo</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="selectedTransport" placeholder="Seleccionar" @change="addVehicle"
                    :disabled="selectedTransports.length >= 3">
                      <option v-for="(row, index) in transports" :value="row" :key="index">{{row.plate_number}} - {{ row.model }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col v-show="selectedTransports.length > 0" width="100" class="data-table">
              <table>
                <thead>
                  <tr>
                    <th class="numeric-cell" width="5%"></th>
                    <th class="label-cell">Vehículo</th>
                    <th class="label-cell">Placa</th>
                    <th class="label-cell">Modelo</th>
                    <th class="label-cell">Marca</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in selectedTransports" :key="index">
                    <td class="no-padding numeric-cell">
                      <f7-button @click.native="removeVehicle(index)">
                        <f7-icon color="red" material="cancel"></f7-icon>
                      </f7-button>
                    </td>
                    <td class="no-padding label-cell text-align-center">{{ (index===0)?'Principal':'Secundario' }}</td>
                    <td class="no-padding label-cell text-align-left">{{row.plate_number}}</td>
                    <td class="no-padding label-cell">{{row.model}}</td>
                    <td class="no-padding label-cell">{{row.brand}}</td>
                  </tr>
                </tbody>
              </table>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Unidad de medida</div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select v-model="form.unidad_peso_total" placeholder="Seleccionar">
                      <option v-for="(row, index) in unit_types" :value="row.id" :key="index">{{row.description}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="50">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Peso total</div>
                  <div class="item-input-wrap">
                    <input required validate v-model="form.peso_total" type="number" min="0.01" step="0.01"/>
                  </div>
                </div>
              </div>
            </f7-col>
            <f7-col width="100">
              <div class="item-content item-input no-padding-horizontal">
                <div class="item-inner no-padding-horizontal">
                  <div class="item-title item-label">Observaciones</div>
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
              <f7-row @click="popupRemitenteOpened = true">
                <f7-col width="15" class="align-self-center">
                  <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                </f7-col>
                <f7-col width="75" class="text-align-left">
                  <small>REMITENTE</small><br>
                  <small class="no-margin">{{form.datos_remitente ? form.datos_remitente.apellidos_y_nombres_o_razon_social : ''}}</small>
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
                    <span>Punto de partida</span>
                    <f7-button v-show="!isObjectEmpty(form.datos_remitente)" @click="addressOpen(true)" class="text-align-left padding-left">
                      <small>
                        <f7-icon icon="fas fa-plus"></f7-icon>
                        Nuevo
                      </small>
                    </f7-button>
                  </div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select required validate v-model="direccion_remitente" placeholder="Seleccionar" @change="changeSenderAddress">
                      <option v-for="(row, index) in sender_addresses" :value="row.id" :key="index">{{row.address}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
          </f7-row>
          <li class="no-padding-horizontal margin-top">
            <f7-block class="bg-white-shade block-strong inset no-margin">
              <f7-row @click="popupDestinatarioOpened = true">
                <f7-col width="15" class="align-self-center">
                  <f7-icon icon="fas fa-user" size="24" :color="theme.name_color_theme"></f7-icon>
                </f7-col>
                <f7-col width="75" class="text-align-left">
                  <small>DESTINATARIO</small><br>
                  <small class="no-margin">{{form.datos_destinatario ? form.datos_destinatario.apellidos_y_nombres_o_razon_social : ''}}</small>
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
                    <f7-button v-show="!isObjectEmpty(form.datos_destinatario)" @click="addressOpen(false)" class="text-align-left padding-left">
                      <small>
                        <f7-icon icon="fas fa-plus"></f7-icon>
                        Nuevo
                      </small>
                    </f7-button>
                  </div>
                  <div class="item-input-wrap input-dropdown-wrap">
                    <select required validate v-model="direccion_destinatario" placeholder="Seleccionar" @change="changeReceiverAddress">
                      <option v-for="(row, index) in receiver_addresses" :value="row.id" :key="index">{{row.address}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </f7-col>
          </f7-row>
          <f7-row class="item-content item-input no-padding-horizontal">
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

    <f7-popup class="demo-popup" :opened="popupRemitenteOpened" @popup:closed="popupRemitenteOpened = false">
      <customer-form :codeType="codeType" :customerId="form.remitente_id" :showDialog.sync="popupRemitenteOpened" ref="form_customer_car" @addCustomerCar="addRemitente"></customer-form>
    </f7-popup>

    <f7-popup class="demo-popup" :opened="popupDestinatarioOpened" @popup:closed="popupDestinatarioOpened = false">
      <customer-form :codeType="codeType" :customerId="form.destinatario_id" :showDialog.sync="popupDestinatarioOpened" ref="form_customer" @addCustomerCar="addDestinatario"></customer-form>
    </f7-popup>

    <f7-popup class="demo-document" :opened="popupDocumentOpened" @popup:closed="popupDocumentOpened = false">
      <reference-document-form :showDialog.sync="popupDocumentOpened" ref="form_document_car" @addDocument="addDocument" dispatchType="31"></reference-document-form>
    </f7-popup>
    
    <f7-popup class="demo-popu" :opened="popupAddressOpened" @popup:closed="popupAddressOpened = false">
      <dispatch-address-form :personId="customer_id" :showDialog.sync="popupAddressOpened" @addAddress="addAddress" ref="dispatch_address_form"></dispatch-address-form>
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
            popupRemitenteOpened: false,
            popupDestinatarioOpened: false,
            popupDocumentOpened: false,
            popupAddressOpened: false,
            title: "Guía de Remisión Transportista",
            all_payment_method_types: [],
            payment_destinations: [],
            series: [],
            allSeries:[],
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
            direccion_remitente: '',
            direccion_destinatario: '',
            sender_addresses: {},
            receiver_addresses: {},
            drivers: [],
            transports: [],
            driver: '',
            transport: '',
            theme: {},
            customer_id:null,
            remitente_id: null,
            destinatario_id:null,
            is_remitente: false,
            selectedTransport: null,
            selectedTransports: [],
            selectedDriver: null,
            selectedDrivers: [],
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
          codigo_tipo_documento: '31',
          fecha_de_emision: moment().format("YYYY-MM-DD"),
          hora_de_emision: moment().format("HH:mm:ss"),
          unidad_peso_total: 'KGM',
          items: [],
          indicador_de_transbordo: false,
          numero_de_placa: '',
          datos_del_emisor: {},
          documento_relacionado: [],
          datos_remitente: {},
          datos_destinatario: {},
          chofer: [],
          vehiculo: [],
          chofer_secundario:null,
          vehiculo_secundario:null,
        };
        this.initSeries()
        this.origin_address = ''
        this.driver = ''
        this.transport = ''
        this.direccion_remitente = ''
        this.direccion_destinatario = ''
      },
      async getTables() {
        const self = this;
        self.$f7.preloader.show();
        await this.$http.get(`${this.returnBaseUrl()}/dispatches/tables`, this.getHeaderConfig())
          .then(response => {
            this.establishments = response.data.establishments
            this.unit_types = response.data.unitTypes
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
        await this.$http.get(`${this.returnBaseUrl()}/document/series-dispatch`, this.getHeaderConfig())
          .then(response => {
              let all_series = response.data;
              this.allSeries = response.data;
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
      addDocument(row) {
        this.popupDocumentOpened = false;
        this.form.documento_relacionado.push(row)
      },
      deleteDocument(index) {
        this.form.documento_relacionado.splice(index, 1);
      },
      addRemitente(row) {
        this.popupRemitenteOpened = false;
        this.form.remitente_id = row.id;
        this.remitente_id = row.id;
        this.form.datos_remitente = {
          codigo_tipo_documento_identidad: row.identity_document_type_id,
          numero_documento: row.number,
          apellidos_y_nombres_o_razon_social: row.name,
          codigo_pais: row.country_id,
          ubigeo: row.district_id ? row.district_id : '',
          direccion: row.address,
          correo_electronico: row.email,
          telefono: row.telephone,
          descripcion_tipo_documento_identidad: row.identity_document_type_description
        };
        this.sender_addresses = row.addresses
      },
      addDestinatario(row) {
        this.popupDestinatarioOpened = false;
        this.form.destinatario_id = row.id;
        this.destinatario_id = row.id;
        this.form.datos_destinatario = {
          codigo_tipo_documento_identidad: row.identity_document_type_id,
          numero_documento: row.number,
          apellidos_y_nombres_o_razon_social: row.name,
          codigo_pais: row.country_id,
          ubigeo: row.district_id ? row.district_id : '',
          direccion: row.address,
          correo_electronico: row.email,
          telefono: row.telephone,
          descripcion_tipo_documento_identidad: row.identity_document_type_description
        };
        this.receiver_addresses = row.addresses
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
      deleteItem(id, index) {
        this.form.items.splice(index, 1);
        this.$refs.form_items_car.delete_parent(id);
      },
      changeOriginAddress() {
        let establishment =  _.find(this.establishments, {id : this.origin_address})
        this.form.datos_del_emisor = {
          codigo_pais: establishment.country_id,
          ubigeo: establishment.district_id,
          direccion: establishment.address,
          correo_electronico: establishment.email,
          telefono: establishment.telephone,
          codigo_del_domicilio_fiscal: establishment.code
        },
        this.series = _.filter(this.allSeries, {
            'establishment_id': this.origin_address,
            'document_type_id': this.form.codigo_tipo_documento
        });
        this.initSeries()
      },
      changeSenderAddress() {
        if(this.form.remitente_id) {
          let delivery =  _.find(this.sender_addresses, {id : this.direccion_remitente})
          this.form.direccion_remitente_id = delivery.id
        } else {
          this.direccion_remitente = null
        }
      },
      changeReceiverAddress() {
        if(this.form.remitente_id) {
          let delivery =  _.find(this.receiver_addresses, {id : this.direccion_destinatario})
          this.form.direccion_destinatario_id = delivery.id
        } else {
          this.direccion_destinatario = null
        }
      },
      changeDriver() {
        let driver =  _.find(this.drivers, {id :  _.head(this.selectedDrivers).id})
        this.form.chofer = {
          codigo_tipo_documento_identidad: driver.identity_document_type_id,
          numero_documento: driver.number,
          nombres: driver.name,
          apellidos: driver.name,
          numero_licencia: driver.license,
          telefono: driver.telephone,
        }
        if (this.selectedDrivers.length > 1) {
          this.form.chofer_secundario = this.selectedDrivers.slice(1).map(driver => {
              return {
                codigo_tipo_documento_identidad: driver.identity_document_type_id,
                numero_documento: driver.number,
                nombres: driver.name,
                apellidos: driver.name,
                numero_licencia: driver.license,
                telefono: driver.telephone,
              };
          });
        }
      },
      changeTransport() {
        let transport =  _.find(this.transports, {id : _.head(this.selectedTransports).id})
        this.form.vehiculo = {
          numero_de_placa: transport.plate_number,
          certificado_habilitacion_vehicular: transport.tuc,
          modelo: transport.model,
          marca: transport.brand,
        }
        if (this.selectedTransports.length > 1) {
            this.form.vehiculo_secundario = this.selectedTransports.slice(1).map(transport => {
                return {
                    numero_de_placa: transport.plate_number,
                    modelo: transport.model,
                    marca: transport.brand,
                    certificado_habilitacion_vehicular: transport.tuc,
                };
            });
        }
      },
      cancel() {
        this.initForm();
        this.$f7router.navigate("/");
      },
      async send() {
        const self = this;
        this.$f7.preloader.show();
        
        try {
          this.setDataSecondary();
          if (this.selectedDrivers.length > 0) {
            await this.changeDriver();
          }
          if (this.selectedTransports.length > 0) {
            await this.changeTransport();
          }

          let valid = this.validate();
          if (!valid) {
            this.$f7.preloader.hide();
            return;
          }

          let dispatchResponse = await this.$http.post(`${this.returnBaseUrl()}/dispatch-carrier`, this.getFormatter(), this.getHeaderConfig());
          let dispatchData = dispatchResponse.data;

          if (dispatchData.success) {
            this.initForm();
            await this.changeSenderAddress()
            await this.changeReceiverAddress()

            let formSend = {
              external_id: dispatchData.data.external_id
            };

            const dialog = self.$f7.dialog.create({
              title: 'Comprobante registrado',
              text: `Número: ${dispatchData.data.number}`,
              buttons: self.getOptionsButtons(),
              onClick: function(dialog, index){
                self.clickOptionsButtons(dialog, index, dispatchData);
              },
              verticalButtons: true,
            }).open();

            let sendResponse = await this.$http.post(`${this.returnBaseUrl()}/dispatches/send`, formSend, this.getHeaderConfig());
            
            if (sendResponse.data.success) {
              dialog.params.text = `Número: ${dispatchData.data.number}<br>Enviando comprobante...`;
              dialog.$el.find('.dialog-text').html(dialog.params.text);

              let statusResponse = await this.$http.post(`${this.returnBaseUrl()}/dispatches/status_ticket`, formSend, this.getHeaderConfig());
              dialog.params.text = `Número: ${dispatchData.data.number}<br>Comprobante Enviado<br>Estado : <b>${statusResponse.data.message}</b>`;
              dialog.$el.find('.dialog-text').html(dialog.params.text);
            } else {
              dialog.params.text = `Número: ${dispatchData.data.number}<br>Error al enviar comprobante.`;
              dialog.$el.find('.dialog-text').html(dialog.params.text);
            }
          } else {
            self.$f7.dialog.alert("No se registró la guía", "Error");
          }
        } catch (err) {
            self.$f7.dialog.alert(`${err.message}`, "Inconvenientes al enviar guía");
        } finally {
          this.$f7.preloader.hide();
        }
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
        if (!this.form.datos_del_emisor.codigo_del_domicilio_fiscal) {
          this.$f7.dialog.alert(`Debe seleccionar un establecimiento.`, "Mensaje")
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
        if (!this.form.remitente_id) {
          this.$f7.dialog.alert(`Debe seleccionar un cliente remitente.`, "Mensaje")
          return false
        }
        if (!this.form.destinatario_id) {
          this.$f7.dialog.alert(`Debe seleccionar un cliente destinatario.`, "Mensaje")
          return false
        }
        if (!this.form.direccion_remitente_id) {
          this.$f7.dialog.alert(`Debe seleccionar direccion de partida.`, "Mensaje")
          return false
        }
        if (!this.form.direccion_destinatario_id) {
          this.$f7.dialog.alert(`Debe seleccionar direccion de llegada.`, "Mensaje")
          return false
        }
        if (!this.form.peso_total) {
          this.$f7.dialog.alert(`Debe indicar el peso total.`, "Mensaje")
          return false
        }
        if (this.form.chofer.length == 0) {
          this.$f7.dialog.alert(`Debe seleccionar un chofer`, "Mensaje")
          return false
        }
        if (this.form.vehiculo.length == 0) {
          this.$f7.dialog.alert(`Debe seleccionar un transporte`, "Mensaje")
          return false
        }
        return true
      },
      getFormatter() {
        return this.form
      },
      getInitialSettings() {
        this.theme = this.getThemeSettings()
      },
      addressOpen(is_remitente){
        this.customer_id = (is_remitente==true)?this.remitente_id:this.destinatario_id;
        this.popupAddressOpened = true;
        this.is_remitente = is_remitente;
        if (this.$refs.dispatch_address_form) {
          this.$refs.dispatch_address_form.handleIsRemitenteChange(this.is_remitente);
        }
      },
      isObjectEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      },
      addAddress(row) {
        if(this.is_remitente){
          this.sender_addresses.push(row);
          this.direccion_remitente = row.id;
          this.changeSenderAddress();
        }else{
          this.receiver_addresses.push(row);
          this.direccion_destinatario = row.id;
          this.changeReceiverAddress();
        }
        
        this.popupAddressOpened = false;
      },
      addVehicle() {
        if (this.selectedTransport && !this.selectedTransports.includes(this.selectedTransport)) {
          this.selectedTransports.push(this.selectedTransport);
        }
      },
      removeVehicle(index) {
        this.selectedTransports.splice(index, 1);
        this.selectedTransport = null;
      },
      addDriver() {
        if (this.selectedDriver && !this.selectedDrivers.includes(this.selectedDriver)) {
            this.selectedDrivers.push(this.selectedDriver);
        }
      },
      removeDriver(index) {
        this.selectedDrivers.splice(index, 1);
        this.selectedDriver = null;
      },
      setDataSecondary(){
        this.form.chofer = [];
        this.form.vehiculo = [];
        this.form.chofer_secundario = null;
        this.form.vehiculo_secundario = null;
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