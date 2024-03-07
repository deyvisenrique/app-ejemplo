<template>
    <f7-block class="no-margin-top no-padding" style="max-width: 450px; margin: 0 auto;">
        <f7-row class="padding-bottom">
            <f7-col class="text-align-center">
                <div @click="go('pos')" style="cursor:pointer;">
                    <base-icon nameIcon="display" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">POS</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('invoice')">
                <div @click="go('nw_doc')" style="cursor:pointer;">
                    <base-icon nameIcon="file-invoice" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Factura</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('invoice-ticket')">
                <div @click="go('nw_docb')" style="cursor:pointer;">
                    <base-icon nameIcon="file-invoice" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Boleta</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('sale-note')">
                <div @click="go('sale-note')" style="cursor:pointer;">
                    <base-icon nameIcon="file-sale" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Nota de venta</small>
            </f7-col>
        </f7-row>
        <f7-row class="padding-bottom">
            <f7-col class="text-align-center" v-if="checkPermissions('order-note')">
                <div @click="go('order-note')" style="cursor:pointer;">
                    <base-icon nameIcon="file" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Pedido</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('quotation')">
                <div @click="go('quotation')" style="cursor:pointer;">
                    <base-icon nameIcon="file-sale" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Cotización</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('dispatches')">
                <div @click="go('dispatch')" style="cursor:pointer;">
                    <base-icon nameIcon="file-sale" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">G.R.<br> remitente</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('carrier_dispatches')">
                <div @click="go('dispatch-carrier')" style="cursor:pointer;">
                    <base-icon nameIcon="file-sale" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">G.R.<br> transportista</small>
            </f7-col>
        </f7-row>
        <f7-row class="padding-bottom">
            <f7-col class="text-align-center" v-if="checkPermissions('documents')">
                <div @click="go('ls_doc')" style="cursor:pointer;">
                    <base-icon nameIcon="file-list" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Listado</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('purchase')">
                <div @click="go('purchase')" style="cursor:pointer;">
                    <base-icon nameIcon="car-sale" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Compra</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('customers')">
                <div @click="go('customers')" style="cursor:pointer;">
                    <base-icon nameIcon="users" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500 text-align-center" :class="theme.class_text_color">Clientes</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('cash')">
                <div @click="go('cash')" style="cursor:pointer;">
                    <base-icon nameIcon="cash-machine" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500 text-align-center" :class="theme.class_text_color">Caja</small>
            </f7-col>
        </f7-row>
        <f7-row class="padding-bottom">
            <f7-col class="text-align-center"  v-if="checkPermissions('items')">
                <div @click="go('items')" style="cursor:pointer;">
                    <base-icon nameIcon="logistics" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500 text-align-center" :class="theme.class_text_color">Productos</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('report-sales')">
                <div @click="go('report-sales')" style="cursor:pointer;">
                    <base-icon nameIcon="bars" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Reportes</small>
            </f7-col>
            <f7-col class="text-align-center" v-if="checkPermissions('validate-document')">
                <div @click="go('cpe')" style="cursor:pointer;">
                    <base-icon nameIcon="qr-code" widthIcon="20" clases="no-padding no-margin"></base-icon>
                </div>
                <small class="font-w-500" style="line-height: 1;" :class="theme.class_text_color">Validador</small>
            </f7-col>
            <f7-col></f7-col>
        </f7-row>
    </f7-block>
</template>

<script>
import {general_functions} from "mixins_/general_functions"
import {auth} from "mixins_/auth"
import BaseIcon from 'components/layout/BaseIcon.vue';

export default {
    mixins: [auth, general_functions],
    components: {BaseIcon},
    data: function () {
        return {
            current_permissions: [],
            theme: {},
        }
    },
    created(){
        this.events()
    },
    mounted() {
        this.getInitialSettings()
    },
    methods: {
        getAllPermissions() {
            return this.current_permissions.length > 0 ? this.current_permissions : this.getStoragePermissions()
        },
        checkPermissions(value) {
            const all_permissions = this.getAllPermissions()
            return this.hasPermissionInModule(value, all_permissions)
        },
        events() {
            this.$eventHub.$on('updatePermissions', (permissions) => {
                this.current_permissions = permissions
            })
        },
        getInitialSettings() {
            this.theme = this.getThemeSettings()
        },
        go(type) {
            switch(type){
                case "nw_doc":
                    this.redirectMainRoute("/form-document/01");
                    break;
                case "nw_docb":
                    this.redirectMainRoute("/form-document/03");
                    break;
                case 'pos':
                    if (window.matchMedia('(orientation: portrait)').matches)
                    {
                        this.redirectMainRoute('/list-items-sale/')
                    }

                    if (window.matchMedia('(orientation: landscape)').matches)
                    {
                        this.redirectMainRoute('/landscape-pos/')
                    }
                    break
                case 'ls_doc':
                    this.redirectMainRoute('/documents/')
                    break
                case 'report-sales':
                    this.redirectMainRoute('/report-sales/')
                    break
                case 'cpe':
                    this.redirectMainRoute('/cpe/')
                    break
                case 'order-note':
                    this.redirectMainRoute('/form-order-note/')
                    break
                case 'purchase':
                    this.redirectMainRoute('/form-purchase/')
                    break
                case 'items':
                    this.redirectMainRoute('/items/')
                    break
                case 'customers':
                    this.redirectMainRoute('/customers/')
                    break
                case 'cash':
                    this.redirectMainRoute('/cash/')
                    break
                case 'quotation':
                    this.redirectMainRoute('/form-quotation/')
                    break
                case "dispatch":
                    this.redirectMainRoute("/form-dispatch/");
                    break
                case "dispatch-carrier":
                    this.redirectMainRoute("/form-dispatch-carrier/");
                    break
                case "sale-note":
                    this.redirectMainRoute("/form-sale-note/");
                    break
            }
            this.$eventHub.$emit('closePanel')
        }
    }
}
</script>