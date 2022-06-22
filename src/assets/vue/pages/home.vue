<template>
  <f7-page>

    <!-- logo de cambio de pagina -->
    <f7-popup class="demo-popup" :opened="splash" @popup:closed="popupOpened = false">
      <f7-page class="bg-blue-magenta">
        <f7-block class="padding-vertical bg-color-white no-margin-vertical">
          <br><br><br>
        </f7-block>
        <f7-block class="padding-vertical display-flex justify-content-center bg-color-white no-margin-vertical">
          <img v-if="fp_logo_white" :width="width_img" :height="height_img" class="center padding-vertical margin-vertical" :src="fp_logo_white" alt />
        </f7-block>
        <f7-block class=" display-flex justify-content-center no-margin bg-color-white">
          <img :src="img_icons" alt="icons" width="70%"  class="center">
        </f7-block>
      </f7-page>
    </f7-popup>

    <header-layout></header-layout>

    <f7-block class="bg-color-red padding" v-if="isOffline">
      <p class="text-color-white text-align-center">SIN ACCESO A INTERNET, VERIFICA TU CONEXIÓN.</p>
    </f7-block>

    <f7-block>
      <f7-row>
        <f7-col>
          <f7-card @click.native="go('report')" class="bg-purple">
            <f7-card-content class="">
              <p class="padding-top text-color-white"><br>Reportes</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col>
          <f7-card @click.native="go('ls_doc')" class="bg-blue">
            <f7-card-content class="">
              <p class="padding-top text-color-white">Lista de comprobantes</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
      </f7-row>
      <f7-row>
        <f7-col>
          <f7-card @click.native="go('cpe')" class="bg-dark-blue">
            <f7-card-content class="">
              <p class="padding-top text-color-white"><br> Validar cpe</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col>
          <f7-card @click.native="go('nw_doc')" class="bg-purple">
            <f7-card-content class="">
              <p class="padding-top text-color-white">Factura electrónica</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
      </f7-row>
      <f7-row>
        <f7-col>
          <f7-card @click.native="go('nw_docb')" class="bg-blue">
            <f7-card-content class="">
              <p class="padding-top text-color-white">Boleta electrónica</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col>
          <f7-card @click.native="go('sale_note')" class="bg-dark-blue">
            <f7-card-content class="">
              <p class="padding-top text-color-white"><br> Nota de venta</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
      </f7-row>
      <f7-row>
        <f7-col>
          <f7-card @click.native="go('order_note')" class="bg-purple">
            <f7-card-content class="">
              <p class="padding-top text-color-white"><br> Pedido</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col>
          <f7-card @click.native="go('purchase')" class="bg-blue">
            <f7-card-content class="">
              <p class="padding-top text-color-white"><br> Compras</p>
            </f7-card-content>
          </f7-card>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
  import logo from "assets/images/tulogo.png";
  import icons from "assets/images/icons-01.svg";
  import HeaderLayout from "components/layout/Header";

  export default {
    components: {HeaderLayout},
    data: function() {
      // Must return an object
      return {
        fp_logo_white: logo,
        user: "",
        password: "",
        splash: true,
        isOffline: false,
        width_img: '',
        height_img: '',
        img_icons: icons
      };
    },
    created() {
      // this.verifytoken();

      if(localStorage.url_logo){
        this.fp_logo_white = localStorage.url_logo
        this.width_img = 100
        this.height_img = 100
      }

      var self = this;
      window.addEventListener("online", function() {
        self.isOffline = false;
      });
      window.addEventListener("offline", function() {
        self.isOffline = true;
      });
    },
    mounted() {
      setTimeout(this.verifytoken, 1000); // 2500);
    },
    methods: {
      go(name) {
        const self = this;

        if (self.isOffline) {
          return false;
        }

        switch (name) {
          case "ls_doc":
            self.$f7router.navigate("/documents/");
            break;
          case "nw_doc":
            self.$f7router.navigate("/form-document/01");
            break;
          case "nw_docb":
            self.$f7router.navigate("/form-document/03");
            break;
          case "report":
            self.$f7router.navigate("/report/");
            break;
          case "cpe":
            self.$f7router.navigate("/cpe/");
            break;
          case "sale_note":
            self.$f7router.navigate("/form-sale-note/");
            break;
          case "order_note":
            self.$f7router.navigate("/form-order-note/");
            break;
          case "purchase":
            self.$f7router.navigate("/form-purchase/");
            break;
          case "items":
            self.$f7router.navigate("/items/");
            break;
        }
      },
      verifytoken() {
        const self = this;
        if (!localStorage.api_token) {
          this.splash = false;
          self.$f7router.navigate("/login/");
        } else {
          this.splash = false;
        }
      }
    }
  };
</script>
