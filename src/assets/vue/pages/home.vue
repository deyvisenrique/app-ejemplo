<template>
<f7-page class="page-red" color="white">

    <f7-popup class="demo-popup" :opened="splash" @popup:closed="popupOpened = false">
        <f7-page style="background:#676666">
            <f7-block>
                <img v-if="fp_logo_white" :width="width_img" :height="height_img" class="center" :src="fp_logo_white" alt />
            </f7-block>
        </f7-page>
    </f7-popup>

    <f7-block>
        <f7-row>
            <f7-col width="70">
                <p class="text-align-center">
                    <img v-if="fp_logo_white" :src="fp_logo_white" alt="FacturaloPeru" width="60%" />
                </p>
            </f7-col>
            <f7-col width="20">
                <f7-link class="panel-open text-color-white padding-top margin-top text-align-right" open-panel="right" icon="fas fa-bars"></f7-link>
            </f7-col>
        </f7-row>
    </f7-block>

    <f7-block>
        <f7-row v-if="isOffline">
            <p style="color:red;">SIN ACCESO A INTERNET, VERIFICA TU CONEXION.</p>
        </f7-row>
        <f7-row>
            <f7-col width="33">
                <f7-card @click.native="go('cpe')" class="bg-red-dark" style="margin: 1px;">
                    <div style="float:right;margin-top:-20px;margin-right: -5px;background-color: #0f233c; border-radius: 50%;padding:8px;" color="blue">
                        <f7-icon material="center_focus_strong" size="30px" color="white"></f7-icon>
                    </div>
                    <f7-card-content class="text-align-center">
                        <p style="font-size: .8em;" class="padding-top text-color-white">VALIDAR <br> CPE</p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="33">
                <f7-card @click.native="go('report')" class="bg-red-dark" style="margin: 1px;">
                    <div style="float:right;margin-top:-20px;margin-right: -5px;background-color: #0f233c; border-radius: 50%;padding:8px;" color="blue">
                        <f7-icon material="equalizer" size="30px" color="white"></f7-icon>
                    </div>
                    <f7-card-content class="text-align-center">
                        <p style="font-size: .8em; margin-top: 5px;" class="padding-top text-color-white">REPORTES</p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="33">
                <f7-card @click.native="go('ls_doc')" class="bg-red-dark" style="margin: 1px;">
                    <div style="float:right;margin-top:-20px;margin-right: -5px;background-color: #0f233c; border-radius: 50%;padding:8px;" color="blue">
                        <f7-icon material="view_stream" size="30px" color="white"></f7-icon>
                    </div>
                    <f7-card-content class="text-align-center" style="padding: 15px;">
                        <p style="font-size: .7em" class="padding-top text-color-white">LISTA DE COMPROBANTES</p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
        </f7-row>
    </f7-block>
    <f7-block-title class="text-color-white" style="padding-left: 10px;">
        Crear Comprobantes
    </f7-block-title>
    <f7-block>
        <f7-row no-gap>
            <f7-col width="100">
                <f7-card @click.native="go('nw_doc')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" class="fa fa-file-invoice fa-fw padding-left padding-right"></f7-icon>
                            FACTURA ELECTRÓNICA
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('nw_docb')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" class="fa fa-receipt fa-fw padding-left padding-right"></f7-icon>
                            BOLETA ELECTRÓNICA
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
        </f7-row>
        <f7-row no-gap>
            <f7-col width="100">
                <f7-card @click.native="go('sale_note')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="note_add" class=" fa-fw padding-left padding-right"></f7-icon>
                            NOTA DE VENTA
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('order_note')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="note_add" class=" fa-fw padding-left padding-right"></f7-icon>
                            PEDIDO
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('purchase')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="note_add" class=" fa-fw padding-left padding-right"></f7-icon>
                            COMPRAS
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('items')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="shopping_cart" class=" fa-fw padding-left padding-right"></f7-icon>
                            PRODUCTOS
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('customers')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="people" class=" fa-fw padding-left padding-right"></f7-icon>
                            CLIENTES
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
            <f7-col width="100">
                <f7-card @click.native="go('cash')" class="">
                    <f7-card-content>
                        <p class="no-padding-vertical">
                            <f7-icon size="20px" color="blue" material="monetization_on" class=" fa-fw padding-left padding-right"></f7-icon>
                            CAJA
                        </p>
                    </f7-card-content>
                </f7-card>
            </f7-col>
        </f7-row>
    </f7-block>
</f7-page>
</template>

<script>
import logo from "assets/images/logo9_b.png";
import FpLogoDark from "assets/images/facturaloperu.png";
//import FpLogoWhite from "assets/images/fp_logo_white.png";

export default {
    components: {},
    data: function () {
        // Must return an object
        return {
            fp_logo_dark: FpLogoDark,
            fp_logo_white: null,
            user: "",
            password: "",
            splash: true,
            isOffline: false,
            width_img: '',
            height_img: '',

        };
    },
    created() {
        // this.verifytoken();

        if (localStorage.url_logo) {
            this.fp_logo_white = localStorage.url_logo
            this.width_img = 100
            this.height_img = 100
        }

        var self = this;
        window.addEventListener("online", function () {
            self.isOffline = false;
        });
        window.addEventListener("offline", function () {
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
                    self.$f7router.navigate("/items/")
                    break
                case "customers":
                    self.$f7router.navigate("/customers/")
                    break
                case "cash":
                    self.$f7router.navigate("/cash/")
                    break
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
