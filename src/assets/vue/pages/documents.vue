<template>
<f7-page class="page-red" color="white">

    <f7-toolbar tabbar :position="isBottom ? 'bottom' : 'top'" bg-color="white" color="red" class="no-shadow">
        <f7-link href="/" icon-md="material:home">
            Inicio
        </f7-link>
        <f7-link href="/form-document/01" icon-md="material:insert_drive_file" class="text-align-center">
            Crear <br> comprobantes
        </f7-link>
        <f7-link tab-link-active tab-link="#" icon-md="material:view_stream" class="text-align-center">
            Listado de <br> comprobantes
        </f7-link>
        <f7-link href="/report/" icon-md="material:equalizer">
            Reportes
        </f7-link>
    </f7-toolbar>

    <f7-block>
        <f7-row>
            <f7-col width="90">
                <a href="/" class="link text-color-white">
                    <i class="icon icon-back"></i>
                    <span class="">Listado de comprobantes</span>
                </a>
            </f7-col>
            <f7-col width="10">
                <f7-link class="panel-open text-color-white text-align-right" open-panel="right" icon="fas fa-bars"></f7-link>
            </f7-col>
        </f7-row>
    </f7-block>

    <f7-card class="card-100 padding-top padding-horizontal">

        <div class="toolbar tabbar tabbar-labels no-shadow bg-color-white color-blue" style="z-index: auto;">
            <div class="toolbar-inner toolbar-docs">
                <a href="#tab-invoices" @click="show('invoices')" class="tab-link bg-color-white tab-link-active">
                    <f7-icon class="fas fa-file" size="12"></f7-icon>
                    Factura
                </a>
                <a href="#tab-tickets" @click="show('tickets')" class="tab-link bg-color-white">
                    <f7-icon class="fas fa-file text-color-white" size="12"></f7-icon>
                    Boleta
                </a>
                <a href="#tab-notes" @click="show('notes')" class="tab-link bg-color-white">
                    <f7-icon class="fas fa-file" size="12"></f7-icon>
                    Nota
                </a>
                <a href="#tab-order-notes" @click="show('order_notes')" class="tab-link bg-color-white">
                    <f7-icon class="fas fa-file" size="12"></f7-icon>
                    Pedidos
                </a>
                <a href="#tab-purchases" @click="show('purchases')" class="tab-link bg-color-white">
                    <f7-icon class="fas fa-file" size="12"></f7-icon>
                    Compras
                </a>
            </div>
        </div>
        <div class="tabs-animated-wrap">
            <div class="tabs">
                <div id="tab-invoices" class="page-content tab tab-active">
                    <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".item-title, .item-after"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list>
                    <f7-list media-list class="search-list margin-horizontal">
                        <f7-list-item v-for="item in source_invoice" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;">
                                                {{ item.customer_name }}
                                            </div>
                                            RUC: {{ item.customer_number }}
                                            <p>
                                                <f7-icon icon="fas fa-fw fa-calendar-alt" color="red"></f7-icon>{{ item.created_at }}
                                            </p>
                                            <span style="font-size: 16px; font-weight: bold">
                                                Total:
                                                {{ item.total }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    {{item.number}}
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickPreviewPdf(item, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-search"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickDownloadPdf(item, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-download"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="whatsap(item.customer_telephone, item.external_id)" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fab fa-whatsapp"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="email(item.id, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-envelope"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'document', 'a4')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-file-pdf"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-receipt"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-tickets" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".item-title, .item-after"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list>
                    <f7-list media-list class="search-list margin-horizontal">
                        <f7-list-item v-for="item in source_ticket" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;">
                                                {{ item.customer_name }}
                                            </div>
                                            RUC: {{ item.customer_number }}
                                            <p>
                                                <f7-icon icon="fas fa-fw fa-calendar-alt" color="red"></f7-icon>{{ item.created_at }}
                                            </p>
                                            <span style="font-size: 16px; font-weight: bold">
                                                Total:
                                                {{ item.total }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    {{item.number}}
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickPreviewPdf(item, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-search"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickDownloadPdf(item, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-download"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="whatsap(item.customer_telephone, item.external_id)" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fab fa-whatsapp"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="email(item.id, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-envelope"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'document', 'a4')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-file-pdf"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'document')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-receipt"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-notes" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".item-title, .item-after"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list>
                    <f7-list media-list class="search-list margin-horizontal">
                        <f7-list-item v-for="item in source_note" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;">
                                                {{ item.customer_name }}
                                            </div>
                                            RUC: {{ item.customer_number }}
                                            <p>
                                                <f7-icon icon="fas fa-fw fa-calendar-alt" color="red"></f7-icon>{{ item.created_at }}
                                            </p>
                                            <span style="font-size: 16px; font-weight: bold">
                                                Total:
                                                {{ item.total }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    {{item.number_full}}
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                </f7-col>

                                                
                                                <f7-col width="50">
                                                    <f7-button @click="clickPreviewPdf(item, 'sale_note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-search"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickDownloadPdf(item, 'sale_note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-download"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_a4)" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fab fa-whatsapp"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="email(item.id, 'sale-note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-envelope"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'sale-notes', 'a4')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-file-pdf"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'sale-notes')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-receipt"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-order-notes" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".item-title, .item-after"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list>
                    <f7-list media-list class="search-list margin-horizontal">
                        <f7-list-item v-for="item in source_order_note" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;">
                                                {{ item.customer_name }}
                                            </div>
                                            RUC: {{ item.customer_number }}
                                            <p>
                                                <f7-icon icon="fas fa-fw fa-calendar-alt" color="red"></f7-icon>{{ item.created_at }}
                                            </p>
                                            <span style="font-size: 16px; font-weight: bold">
                                                Total:
                                                {{ item.total }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    {{item.identifier}}
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickPreviewPdf(item, 'order_note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-search"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickDownloadPdf(item, 'order_note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-download"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_a4)" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fab fa-whatsapp"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="email(item.id, 'order-note')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-envelope"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'order-notes', 'a4')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-file-pdf"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                                <f7-col width="50">
                                                    <f7-button @click="download(item.external_id, 'order-notes')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-receipt"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-purchases" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".item-title, .item-after"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list>
                    <f7-list media-list class="search-list margin-horizontal">
                        <f7-list-item v-for="item in source_purchases" :key="item.id" class="list-documents margin-bottom">
                            <span slot="title" style="font-size: 11px;">
                                <strong>{{ item.supplier_name }}</strong>
                                <br>
                                RUC: {{ item.supplier_number }}
                            </span>
                            <span slot="after">
                                {{item.number}}
                            </span>
                            <span slot="subtitle">
                                <f7-block class="no-padding">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left" style="border-right: 1px solid #ccc">
                                            <p>
                                                <f7-icon icon="fas fa-fw fa-calendar-alt" color="red"></f7-icon>{{ item.created_at }}
                                            </p>
                                            <span style="font-size: 16px; font-weight: bold">
                                                Total:
                                                {{ item.total }}
                                                <span v-if="item.currency_type_id == 'PEN'">./S</span>
                                                <span v-if="item.currency_type_id == 'USD'">$</span>
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right" style="padding-top: 15px;">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                </f7-col>
                                                
                                                <f7-col width="50">
                                                    <f7-button @click="clickPreviewPdf(item, 'purchase')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-search"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="clickDownloadPdf(item, 'purchase')" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fas fa-download"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_a4)" class="block" color="red">
                                                        <f7-icon style="font-size: 1.5em;" class="icon fab fa-whatsapp"></f7-icon>
                                                    </f7-button>
                                                </f7-col>

                                                <f7-col width="50">
                                                    <f7-button @click="email(item.id, 'purchase')" color="red" style="padding-left: 0px;">
                                                        <f7-icon material="email"></f7-icon>
                                                    </f7-button>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
            </div>
        </div>

        <f7-sheet class="demo-sheet" :opened="sendMailOpen" @sheet:closed="
          sendMailOpen = false;
          initformEmail();
        ">
            <f7-toolbar>
                <div class="left"></div>
                <div class="right">
                    <f7-link sheet-close>Cancelar</f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-block>
                    <div class="list no-hairlines-md">
                        <ul>
                            <li class="item-content item-input item-input-outline">
                                <div class="item-inner">
                                    <div class="item-title item-floating-label">E-mail</div>
                                    <div class="item-input-wrap">
                                        <input v-model="form_email.email" type="email" placeholder="Your e-mail" />
                                        <span class="input-clear-button"></span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="item-inner">
                                    <div class="item-input-wrap">
                                        <f7-button style="width: 104%;" @click="sendEmail" outline>Enviar</f7-button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </f7-block>
                
                <preview-pdf :showDialog.sync="showDialogPreviewPdf"
                            :record="record"
                            :documentType="documentType"></preview-pdf>

            </f7-page-content>
        </f7-sheet>
    </f7-card>
</f7-page>
</template>

<script>
    //const url = "https://demo.facturador.pro/api";
    import _ from "lodash";
    import {auth} from "mixins_/auth";
    import PreviewPdf from 'components/document/PreviewPdf'
    import {general_functions} from "mixins_/general_functions"
    import {download_file} from "mixins_/download_file"

    export default {
        name: "documents",
        mixins: [auth, general_functions, download_file],
        components: {
            PreviewPdf
        },
        data: function () {
            // Must return an object
            return {
                sendMailOpen: false,
                isBottom: true,
                source: [],
                sourceClone: [],
                text_seacrh: "",
                source_invoice: [],
                source_ticket: [],
                source_note: [],
                source_order_note: [],
                source_purchases: [],
                form_email: {},
                count: 0,
                documentType: null,
                showDialogPreviewPdf: false,
                configuration: {},
                record: {},
            };
        },
        computed: {
            countDoc() {
                return this.count;
            }
        },
        created() {
            this.loadConfiguration()
            this.initformEmail()
            this.getDataPurchases()
            this.getData()
            this.getDataSaleNote()
            this.getDataOrderNote()
        },
        methods: {
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            clickPreviewPdf(record, documentType){

                this.record = record
                this.documentType = documentType
                this.showDialogPreviewPdf = true

            },
            async clickDownloadPdf(row, documentType){

                await this.showLoading()
                const url =  this.getUrlDownload(row, documentType)
                await this.downloadOpenFile(url, row.filename)
                await this.hideLoading()

            },
            show(type) {
                const self = this;
                switch (type) {
                    case 'invoices':
                        self.count = self.source_invoice.length;
                        break;
                    case 'tickets':
                        self.count = self.source_ticket.length;
                        break;
                    case 'notes':
                        self.count = self.source_note.length;
                        break;
                    case 'purchases':
                        self.count = self.source_purchases.length;
                        break;
                    case 'order_notes':
                        self.count = self.source_order_note.length;
                        break;
                }
            },
            initformEmail() {
                this.form_email = {
                    email: null,
                    id: null
                };
            },
            whatsap(phone, external_id, print_a4 = null) {
                const self = this;

                self.$f7.dialog
                    .create({
                        text: "WhattsApp (9 dígitos)",
                        on: {
                            opened: function () {}
                        },
                        content: `
                <div class="dialog-input-field input">
                    <input type="tel" name="dialog-wasap" placeholder="Ingrese numero celular" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="dialog-input dialog-wasap">
                </div>`,
                        buttons: [{
                                text: "Cancel",
                                keyCodes: null,
                                color: null
                            },
                            {
                                text: "Ok",
                                bold: true,
                                keyCodes: null
                            }
                        ],
                        onClick(dialog, e) {
                            if (e == 1) {

                                let number = (dialog.$el.find('.dialog-wasap').val()).toString()

                                if (number.length == 9) {
                                    let link_pdf = (print_a4) ? print_a4 : `${localStorage.api_url}/print/document/${external_id}/a4`;
                                    let message = `Hola, revisa tu comprobante ingresando a este link ${link_pdf}`;
                                    let message_ = message.split(" ").join("%20");
                                    window.open(`https://wa.me/51${number}/?text=${message_}`, "_system");
                                } else {
                                    self.$f7.dialog.alert(
                                        `Ingrese correctamente los dígitos`,
                                        "WhatsApp"
                                    );
                                }
                            }
                        }
                    }).open();

            },

            validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            sendEmail(type) {
                if (!this.form_email.email) {
                    alert("Ingrese Email.");
                    return false;
                }

                if (!this.validateEmail(this.form_email.email)) {
                    alert("Ingrese un Email valido.");
                    return false;
                }

                const self = this;
                self.$f7.preloader.show();

                this.$http
                    .post(
                        `${this.returnBaseUrl()}/${type}/email`,
                        this.form_email,
                        this.getHeaderConfig()
                    )
                    .then(response => {
                        if (response.data.success) {
                            alert(`${response.data.message}`);
                            this.initformEmail();
                        }
                    })
                    .catch(err => {
                        alert("Sucedio un error.");
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                        self.sendMailOpen = false;
                    });
            },
            email(id, type) {
                const self = this;
                self.initformEmail();
                self.form_email.id = id;
                //  this.sendMailOpen = true;
                self.$f7.dialog.prompt("Ingresa el Email", "", function (value) {
                    if (value) {
                        self.form_email.email = value;
                        self.sendEmail(type);
                    } else {
                        alert("Ingrese el Email.");
                    }
                });
            },
            applyFilters() {
                this.source_invoice = _.filter(this.source, {
                    document_type_id: "01"
                });
                this.source_ticket = _.filter(this.source, {
                    document_type_id: "03"
                });

                this.show(1);
                //this.source_nota =  _.filter(this.source, { document_type_id: '01' });
            },
            go() {
                this.$f7router.navigate("/form-document/");
            },
            download(external_id, type = "document", format = null) {
                if (type == "document") {
                    if (format == "a4") {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/print/${type}/${external_id}/a4`,
                            "_system",
                            "location=yes"
                        );
                    } else {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/print/${type}/${external_id}/ticket`,
                            "_system",
                            "location=yes"
                        );
                    }
                } else if (type == "sale-notes") {
                    if (format == "a4") {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/${type}/print/${external_id}/a4`,
                            "_system",
                            "location=yes"
                        );
                    } else {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/${type}/print/${external_id}/ticket`,
                            "_system",
                            "location=yes"
                        );
                    }
                } else if (type == "order-notes") {
                    if (format == "a4") {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/${type}/print/${external_id}/a4`,
                            "_system",
                            "location=yes"
                        );
                    } else {
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/${type}/print/${external_id}/ticket`,
                            "_system",
                            "location=yes"
                        );
                    }
                }
            },

            clean() {
                this.source = this.sourceClone;
            },
            search() {
                let texx = this.text_seacrh;
                if (texx.length > 0) {
                    this.source = this.sourceClone.filter(row => {
                        return row.number.includes(texx);
                    });
                } else {
                    this.source = this.sourceClone;
                }
            },
            getHeaderConfig() {
                let token = localStorage.api_token;
                let axiosConfig = {
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                };

                return axiosConfig;
            },

            getData() {
                const self = this;
                self.$f7.preloader.show();

                this.$http
                    .get(`${this.returnBaseUrl()}/documents/lists`, this.getHeaderConfig())
                    .then(response => {
                        self.source = response.data.data;
                        this.applyFilters();
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            },
            getDataSaleNote() {
                const self = this;
                this.$http
                    .get(`${this.returnBaseUrl()}/sale-note/lists`, this.getHeaderConfig())
                    .then(response => {
                        self.source_note = response.data.data;
                    })
                    .catch(err => {})
                    .then(() => {});
            },
            getDataOrderNote() {
                const self = this;
                this.$http
                    .get(`${this.returnBaseUrl()}/order-notes/lists`, this.getHeaderConfig())
                    .then(response => {
                        self.source_order_note = response.data.data;
                    })
                    .catch(err => {})
                    .then(() => {});
            },
            getDataPurchases() {
                const self = this;
                this.$http
                    .get(`${this.returnBaseUrl()}/purchases/records`, this.getHeaderConfig())
                    .then(response => {
                        self.source_purchases = response.data.data;
                        // console.log(self.source_purchases)
                    })
                    .catch(err => {})
                    .then(() => {});
            },
            statusColor(status) {
                switch (status) {
                    case 'Registrado':
                        status = 'gray'
                        break;
                    case 'Aceptado':
                        status = 'green'
                        break;
                    case 'Anulado':
                        status = 'red'
                        break;
                    case 'Por anular':
                        status = 'orange'
                        break;
                    case 'Rechazado':
                        status = 'black'
                        break;
                    default:
                        status = 'green'
                        break;
                }

                return status;
            }
        }
    };
</script>
