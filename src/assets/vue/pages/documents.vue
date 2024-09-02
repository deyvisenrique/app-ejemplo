<template>
<f7-page color="green">
    <header-layout title="Listado de comprobantes"></header-layout>

    <f7-block class="display-flex justify-content-space-around no-margin-horizontal no-padding-horizontal">
        <f7-button
            :outline="!activeClass.invoices"
            small
            :color="activeClass.invoices ? theme.name_color_theme : 'gray'"
            :fill="activeClass.invoices"
            href="#tab-invoices"
            class="tab-link bg-secondary"
            @click="show('invoices')"
            style="text-transform:capitalize; font-weight: 400;">
            Factura
        </f7-button>
        <f7-button
            :outline="!activeClass.tickets"
            small
            :color="activeClass.tickets ? theme.name_color_theme : 'gray'"
            :fill="activeClass.tickets"
            href="#tab-tickets"
            class="tab-link bg-secondary"
            @click="show('tickets')"
            style="text-transform:capitalize; font-weight: 400;">
            Boleta
        </f7-button>
        <f7-button
            :outline="!activeClass.notes"
            small
            :color="activeClass.notes ? theme.name_color_theme : 'gray'"
            :fill="activeClass.notes"
            href="#tab-notes"
            class="tab-link bg-secondary"
            @click="show('notes')"
            style="text-transform:capitalize; font-weight: 400;">
            Nota
        </f7-button>
        <f7-button
            :outline="!activeClass.orderNotes"
            small
            :color="activeClass.orderNotes ? theme.name_color_theme : 'gray'"
            :fill="activeClass.orderNotes"
            href="#tab-order-notes"
            class="tab-link bg-secondary"
            @click="show('order_notes')"
            style="text-transform:capitalize; font-weight: 400;">
            Pedidos
        </f7-button>
        <f7-button
            :outline="!activeClass.purchases"
            small
            :color="activeClass.purchases ? theme.name_color_theme : 'gray'"
            :fill="activeClass.purchases"
            href="#tab-purchases"
            class="tab-link bg-secondary"
            @click="show('purchases')"
            style="text-transform:capitalize; font-weight: 400;">
            Compras
        </f7-button>
        <f7-button
            :outline="!activeClass.quotations"
            small
            :color="activeClass.quotations ? theme.name_color_theme : 'gray'"
            :fill="activeClass.quotations"
            href="#tab-quotations"
            class="tab-link bg-secondary"
            @click="show('quotations')"
            style="text-transform:capitalize; font-weight: 400;">
            Cotización
        </f7-button>
        <f7-button
            :outline="!activeClass.dispatches"
            small
            :color="activeClass.dispatches ? theme.name_color_theme : 'gray'"
            :fill="activeClass.dispatches"
            href="#tab-dispatches"
            class="tab-link bg-secondary"
            @click="show('dispatches')"
            style="text-transform:capitalize; font-weight: 400;">
            G.R. Remitente
        </f7-button>
        <f7-button
            :outline="!activeClass.carrier_dispatches"
            small
            :color="activeClass.carrier_dispatches ? theme.name_color_theme : 'gray'"
            :fill="activeClass.carrier_dispatches"
            href="#tab-carrier-dispatches"
            class="tab-link bg-secondary"
            @click="show('carrier_dispatches')"
            style="text-transform:capitalize; font-weight: 400;">
            G.R. Transportista
        </f7-button>
    </f7-block>

    <f7-block class="no-padding">
        <div class="tabs-animated-wrap">
            <div class="tabs">
                <div id="tab-invoices" class="page-content tab tab-active">

                    <f7-block>
                        <f7-row>
                            <f7-col width="70">
                                <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>
                            </f7-col>

                            <f7-col width="25">
                                <div class="item-content item-input">
                                    <div class="item-inner">

                                        <div class="item-input-wrap input-dropdown-wrap padding-top">
                                            <select v-model="form_search.state_type_id" @change="changeStateType()">
                                                <option v-for="(row, index) in state_types" :value="row.id" :key="index">{{row.description}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>
                        </f7-row>
                    </f7-block>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_invoice.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_invoice" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px; font-size: 16px; font-weight: bold" class="invoice-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            <span class="text-color-gray">
                                                RUC: <span class="invoice-customer-number">{{ item.customer_number }}</span><br>
                                                {{ item.created_at }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="invoice-number">{{item.number}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <div style="font-size: 16px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                    </div>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col v-if="item.state_type_id === '05'">
                                            <f7-button size="35" icon @click="clickVoided(item)" color="red">
                                                <f7-icon size="18" class="icon fas fa-ban"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="clickToPrint(item, 'document')" color="purple">
                                                <f7-icon size="18" class="icon fas fa-print"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="clickPreviewPdf(item, 'document')" color="blue">
                                                <f7-icon size="18" class="icon fas fa-search"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="clickDownloadPdf(item, 'document')" color="blue-shade">
                                                <f7-icon size="18" class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="whatsap(item.customer_telephone, item.external_id)" color="green">
                                                <f7-icon size="18" class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="email(item.id, 'document', item.customer_email)" color="purple">
                                                <f7-icon size="18" class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button size="35" icon @click="download(item.external_id, 'document', 'a4')" color="lightblue">
                                                <f7-icon size="18" class="icon fas fa-file-pdf"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" icon @click="download(item.external_id, 'document')" color="deeppurple">
                                                <f7-icon size="18" class="icon fas fa-receipt"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-tickets" class="page-content tab">

                    <f7-block>
                        <f7-row>
                            <f7-col width="75">
                                <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>
                            </f7-col>

                            <f7-col width="25">
                                <div class="item-content item-input no-padding-horizontal">
                                    <div class="item-inner no-padding-horizontal">

                                        <div class="item-input-wrap input-dropdown-wrap padding-top">
                                            <select v-model="form_search.state_type_id" @change="changeStateType()">
                                                <option v-for="(row, index) in state_types" :value="row.id" :key="index">{{row.description}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </f7-col>
                        </f7-row>
                    </f7-block>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_ticket.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".ticket-customer, .ticket-customer-number, .ticket-number"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list> -->

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_ticket" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px; font-size: 16px; font-weight: bold" class="ticket-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            <span class="text-color-gray">
                                                RUC: <span class="ticket-customer-number">{{ item.customer_number }}</span><br>
                                                {{ item.created_at }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="ticket-number">{{item.number}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <div style="font-size: 16px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                    </div>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>

                                        <f7-col>
                                            <f7-button size="35" icon @click="clickToPrint(item, 'document')" color="purple">
                                                <f7-icon size="18" class="icon fas fa-print"></f7-icon>
                                            </f7-button>
                                        </f7-col>

                                        <f7-col>
                                            <f7-button size="35" @click="clickPreviewPdf(item, 'document')" color="blue">
                                                <f7-icon size="18" class="icon fas fa-search"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" @click="clickDownloadPdf(item, 'document')" color="blue-shade">
                                                <f7-icon size="18" class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" @click="whatsap(item.customer_telephone, item.external_id)" color="green">
                                                <f7-icon size="18" class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button size="35" @click="email(item.id, 'document', item.customer_email)" color="purple">
                                                <f7-icon size="18" class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button @click="download(item.external_id, 'document', 'a4')" color="lightblue">
                                                <f7-icon class="icon fas fa-file-pdf"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="download(item.external_id, 'document')" color="deeppurple">
                                                <f7-icon class="icon fas fa-receipt"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-notes" class="page-content tab">


                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_note.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".note-customer, .note-customer-number, .note-number"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list> -->

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_note" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="note-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            <span class="text-color-gray">
                                                RUC: <span class="note-customer-number">{{ item.customer_number }}</span><br>
                                                {{ item.created_at }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="note-number">{{item.number_full}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <br>
                                                    <span style="font-size: 16px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button @click="clickPreviewPdf(item, 'sale_note')" color="blue">
                                                <f7-icon class="icon fas fa-search"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="clickDownloadPdf(item, 'sale_note')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_a4)" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="email(item.id, 'sale-note', item.customer_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button @click="download(item.external_id, 'sale-notes', 'a4')" color="lightblue">
                                                <f7-icon class="icon fas fa-file-pdf"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="download(item.external_id, 'sale-notes')" color="deeppurple">
                                                <f7-icon class="icon fas fa-receipt"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-order-notes" class="page-content tab">

                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_order_note.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".order-notes-customer, .order-notes-customer-number, .order-notes-number"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list> -->

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_order_note" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="order-notes-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            RUC: <span class="order-notes-customer-number"></span>{{ item.customer_number }} <br>
                                            {{ item.created_at }}
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="order-notes-number">{{item.identifier}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge> <br>
                                                    <span style="font-size: 16px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button size="35" icon @click="clickToPrint(item, 'orderNote')" color="purple">
                                                <f7-icon size="18" class="icon fas fa-print"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="clickPreviewPdf(item, 'order_note')" color="blue">
                                                <f7-icon class="icon fas fa-search"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="clickDownloadPdf(item, 'order_note')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_a4)" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="email(item.id, 'order-note', item.customer_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button @click="download(item.external_id, 'order-notes', 'a4')" color="lightblue">
                                                <f7-icon class="icon fas fa-file-pdf"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="download(item.external_id, 'order-notes')" color="deeppurple">
                                                <f7-icon class="icon fas fa-receipt"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-purchases" class="page-content tab">


                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_purchases.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- <f7-searchbar placeholder="Buscar" :clear-button="true" search-container=".search-list" search-in=".purchases-customer, .purchases-customer-number, .purchases-number"></f7-searchbar>
                    <f7-list class="searchbar-not-found">
                        <f7-list-item title="No se encontraron resultados" class="padding-left margin-left"></f7-list-item>
                    </f7-list> -->

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_purchases" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="purchases-customer">
                                                {{ item.supplier_name }}
                                            </div>
                                            RUC: <span class="purchases-customer-number"></span>{{ item.supplier_number }} <br>
                                            {{ item.created_at }}
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="purchases-number">{{item.number}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge> <br>
                                                    <span style="font-size: 15px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                        <span v-if="item.currency_type_id == 'PEN'">./S</span>
                                                        <span v-if="item.currency_type_id == 'USD'">$</span>
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button @click="clickPreviewPdf(item, 'purchase')" color="blue">
                                                <f7-icon class="icon fas fa-search"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="clickDownloadPdf(item, 'purchase')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="whatsap(item.supplier_telephone, item.external_id, item.print_a4)" class="block" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="email(item.id, 'purchase', item.supplier_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-quotations" class="page-content tab">


                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>

                    <div class="searchbar-not-found list" style="display: block;" v-if="source_quotations.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_quotations" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="note-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            <span class="text-color-gray">
                                                RUC: <span class="note-customer-number">{{ item.customer_number }}</span><br>
                                                {{ item.created_at }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="note-number">{{item.number_full}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <br>
                                                    <span style="font-size: 16px; font-weight: bold">
                                                        Total:
                                                        {{ item.total }}
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button @click="clickDownloadPdf(item, 'quotation')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_ticket)" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col>
                                            <f7-button @click="email(item.id, 'quotations', item.customer_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-dispatches" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>
                    <div class="searchbar-not-found list" style="display: block;" v-if="source_dispatches.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_dispatches" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="note-customer">
                                                {{ item.customer_name }}
                                            </div>
                                            <span class="text-color-gray">
                                                RUC: <span class="note-customer-number">{{ item.customer_number }}</span><br>
                                                {{ item.date_of_issue }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="note-number">{{item.number}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <br>
                                                    <span style="font-size: 16px; font-weight: bold">
                                                        Entrega:
                                                        {{ item.date_of_shipping }}
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button @click="download(item.external_id, 'dispatch','a4')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col v-if="item.state_type_id=='01'">
                                            <f7-button
                                                 @click="clickSendDispatch(item.external_id,'dispatch')" color="blue-shade">
                                                <f7-icon class="icon fa fa-paper-plane"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col v-if="item.state_type_id=='03'">
                                            <f7-button @click="clickStatusDispatch(item.external_id, 'dispatch')" color="blue-shade">
                                                <f7-icon class="icon fa fa-retweet"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_ticket)" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                        <!-- <f7-col>
                                            <f7-button @click="email(item.id, 'dispatch', item.customer_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                    </f7-row>
                                </f7-block>
                            </span>
                        </f7-list-item>
                    </f7-list>
                </div>
                <div id="tab-carrier-dispatches" class="page-content tab">
                    <f7-searchbar placeholder="Buscar" :value="search_input" @input="search_input = $event.target.value" :clear-button="true" ></f7-searchbar>
                    <div class="searchbar-not-found list" style="display: block;" v-if="source_carrier_dispatches.length == 0">
                        <ul>
                            <li class="padding-left margin-left">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">No se encontraron resultados</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <f7-list media-list class="search-list">
                        <f7-list-item v-for="item in source_carrier_dispatches" :key="item.id" class="list-documents margin-bottom">
                            <span slot="subtitle">
                                <f7-block class="no-padding no-margin-vertical">
                                    <f7-row>
                                        <f7-col width="60" class="text-align-left">
                                            <!-- <div style="word-break: break-all !important; white-space: pre-line !important; margin-top: -25px;" class="note-customer">
                                                Origen: {{item.sender_number}} {{ item.sender_name }}
                                            </div> -->
                                            <span class="text-color-gray">
                                                Origen: <span class="note-customer-number">{{ item.sender_number }}</span>
                                                {{ item.sender_name }}
                                                <br>
                                                Destino: <span class="note-customer-number">{{ item.receiver_number }}</span>
                                                {{ item.receiver_name }}
                                            </span>
                                        </f7-col>
                                        <f7-col width="40" class="text-align-right">
                                            <f7-row>
                                                <f7-col width="100">
                                                    <span class="note-number">{{item.number}}</span>
                                                </f7-col>
                                                <f7-col width="100">
                                                    <f7-badge :color="statusColor(item.state_type_description)" style="width: 100%">
                                                        {{ item.state_type_description }}
                                                    </f7-badge>
                                                    <br>
                                                    <span style="font-size: 16px; font-weight: bold">
                                                        Entrega:
                                                        {{ item.date_of_shipping }}
                                                    </span>
                                                </f7-col>
                                            </f7-row>
                                        </f7-col>
                                    </f7-row>
                                    <f7-row>
                                        <f7-col>
                                            <f7-button @click="download(item.external_id, 'dispatch','a4')" color="blue-shade">
                                                <f7-icon class="icon fas fa-download"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col v-if="item.state_type_id=='01'">
                                            <f7-button
                                                 @click="clickSendDispatch(item.external_id,'dispatch-carrier')" color="blue-shade">
                                                <f7-icon class="icon fa fa-paper-plane"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <f7-col v-if="item.state_type_id=='03'">
                                            <f7-button @click="clickStatusDispatch(item.external_id, 'dispatch-carrier')" color="blue-shade">
                                                <f7-icon class="icon fa fa-retweet"></f7-icon>
                                            </f7-button>
                                        </f7-col>
                                        <!-- <f7-col>
                                            <f7-button @click="whatsap(item.customer_telephone, item.external_id, item.print_ticket)" color="green">
                                                <f7-icon class="icon fab fa-whatsapp"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
                                        <!-- <f7-col>
                                            <f7-button @click="email(item.id, 'quotations', item.customer_email)" color="purple">
                                                <f7-icon class="icon fas fa-envelope"></f7-icon>
                                            </f7-button>
                                        </f7-col> -->
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
          initFormEmail();
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

                <voided-form :showDialog.sync="showDialogVoided"
                            :record="record"></voided-form>

            </f7-page-content>
        </f7-sheet>
    </f7-block>
</f7-page>
</template>

<script>
    //const url = "https://demo.facturador.pro/api";
    import _ from "lodash";
    import {auth} from "mixins_/auth";
    import PreviewPdf from 'components/document/PreviewPdf'
    import {general_functions, print_pdf_document} from "mixins_/general_functions"
    import {download_file} from "mixins_/download_file"
    import HeaderLayout from "components/layout/Header"
    import queryString from "query-string"
    import VoidedForm from './invoices/partials/voided.vue'

    export default {
        name: "documents",
        mixins: [auth, general_functions, download_file, print_pdf_document],
        components: {
            PreviewPdf,
            HeaderLayout,
            VoidedForm
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
                activeClass: {
                    invoices: true,
                    tickets: false,
                    notes: false,
                    orderNotes: false,
                    purchases: false,
                    quotations: false,
                    dispatches: false,
                    carrier_dispatches: false,
                },
                form_search: {
                    input: null,
                    document_type_id: '01',
                    type: 'invoices',
                    state_type_id: 'all', //aplica para invoices
                },
                search_input: null,
                state_types: [],
                showDialogVoided: false,
                source_quotations: [],
                theme: {},
                source_dispatches: [],
                source_carrier_dispatches: [],
            };
        },
        watch: {
            search_input: function(val) {
                if (val.length > 0)
                {
                    this.searchData(val)
                }
            },
        },
        computed: {
            countDoc() {
                return this.count;
            }
        },
        async created() {
            await this.checkPermissions()
            await this.getTables()
            this.loadConfiguration()
            await this.getInitialSettings()
            this.initFormEmail()
            this.getDataDocuments()
            this.events()
            // this.getDataPurchases()
            // this.getDataSaleNote()
            // this.getDataOrderNote()
        },
        methods: {
            events(){

                this.$eventHub.$on('reloadDocuments', ()=>{
                    this.getDataDocuments()
                })

            },
            clickVoided(row){
                // console.log(row)
                this.record = row
                this.showDialogVoided = true
            },
            changeStateType(){
                this.getDataDocuments()
            },
            getTables(){

                this.showLoading()

                this.$http.get(`${this.returnBaseUrl()}/documents/tables`,  this.getHeaderConfig())
                        .then(response => {
                            this.state_types = response.data.state_types
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .then(() => {
                            this.hideLoading()
                        })

            },
            checkPermissions(){

                if(!this.hasPermissionInModule('documents'))
                {
                    this.showAlert('No tiene permiso a esta sección.')
                    this.$f7router.navigate("/")
                }

            },
            searchData(input){

                this.form_search.input = input

                switch (this.form_search.type) {
                    case 'invoices':
                        this.getDataDocuments()
                        break;
                    case 'notes':
                        this.getDataSaleNote()
                        break;
                    case 'order_notes':
                        this.getDataOrderNote()
                        break;
                    case 'purchases':
                        this.getDataPurchases()
                        break;
                    case 'quotations':
                        this.getDataQuotations()
                        break;
                }

            },
            loadConfiguration(){
                this.configuration = this.getInitialConfiguration()
            },
            clickPreviewPdf(record, documentType){

                this.record = record
                this.documentType = documentType
                this.showDialogPreviewPdf = true

            },
            clickToPrint(record, documentType){

                if (record && documentType) {
                    this.printPdfDocument(record.external_id, documentType)
                }

            },
            async clickDownloadPdf(row, documentType){

                const url =  await this.getUrlDownload(row, documentType)
                this.downloadFileInAppBrowser(url)

                // await this.showLoading()
                // const url =  await this.getUrlDownload(row, documentType)
                // await this.generalSleep(500)

                // const filename = row.id
                // // const filename = _.replace(row.filename, /-/gi, '')
                // // console.log("filename:", filename)

                // await this.downloadOpenFile(
                //     url,
                //     filename
                // )

                // await this.hideLoading()
            },
            setDataFormSearch(type, document_type_id = null, input = null){

                this.form_search.type = type
                this.form_search.document_type_id = document_type_id
                this.form_search.input = input
                this.form_search.state_type_id = 'all'
                this.search_input = input

            },
            show(type) {
                const self = this
                switch (type)
                {
                    case 'invoices':
                        self.count = self.source_invoice.length
                        this.resetActiveClass()
                        this.activeClass.invoices = true
                        this.setDataFormSearch('invoices', '01')
                        this.getDataDocuments()
                        break

                    case 'tickets':
                        self.count = self.source_ticket.length
                        this.resetActiveClass()
                        this.activeClass.tickets = true
                        this.setDataFormSearch('invoices', '03')
                        this.getDataDocuments()
                        break

                    case 'notes':
                        self.count = self.source_note.length
                        this.resetActiveClass()
                        this.activeClass.notes = true
                        this.setDataFormSearch('notes', '80')
                        this.getDataSaleNote()
                        break

                    case 'purchases':
                        self.count = self.source_purchases.length
                        this.resetActiveClass()
                        this.activeClass.purchases = true
                        this.setDataFormSearch('purchases')
                        this.getDataPurchases()
                        break

                    case 'order_notes':
                        self.count = self.source_order_note.length
                        this.resetActiveClass()
                        this.activeClass.orderNotes = true
                        this.setDataFormSearch('order_notes')
                        this.getDataOrderNote()
                        break

                    case 'quotations':
                        self.count = self.source_quotations.length
                        this.resetActiveClass()
                        this.activeClass.quotations = true
                        this.setDataFormSearch('quotations')
                        this.getDataQuotations()
                        break
                    case 'dispatches':
                        self.count = self.source_dispatches.length
                        this.resetActiveClass()
                        this.activeClass.dispatches = true
                        this.setDataFormSearch('dispatches')
                        this.getDataDispatches()
                        break
                    case 'carrier_dispatches':
                        self.count = self.source_carrier_dispatches.length
                        this.resetActiveClass()
                        this.activeClass.carrier_dispatches = true
                        this.setDataFormSearch('carrier_dispatches')
                        this.getDataCarrierDispatches()
                        break
                }
            },
            resetActiveClass(){
                for (let prop in this.activeClass) {
                    if (this.activeClass.hasOwnProperty(prop)) {
                        this.activeClass[prop] = false;
                    }
                }
            },
            initFormEmail() {
                this.form_email = {
                    email: null,
                    id: null
                };
            },
            whatsap(phone, external_id, print_a4 = null) {
                const self = this;

                self.$f7.dialog.create({
                    text: "WhattsApp (9 dígitos)",
                    on: {
                        opened: function () {}
                    },
                    content: `<div class="dialog-input-field input">
                                <input type="tel" name="dialog-wasap" placeholder="Ingrese numero celular" ${phone ? 'value='+phone : ''} pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" class="dialog-input dialog-wasap">
                            </div>`,
                    buttons: [
                        {
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
                    onClick(dialog, e)
                    {
                        if (e == 1)
                        {
                            let number = (dialog.$el.find('.dialog-wasap').val()).toString()

                            if (number.length == 9)
                            {
                                let link_pdf = (print_a4) ? print_a4 : `${localStorage.api_url}/print/document/${external_id}/a4`;
                                let message = `Hola, revisa tu comprobante ingresando a este link ${link_pdf}`;
                                let message_ = message.split(" ").join("%20");
                                window.open(`https://wa.me/51${number}/?text=${message_}`, "_system");
                            }
                            else
                            {
                                self.$f7.dialog.alert(
                                    `Ingrese correctamente los dígitos`,
                                    "WhatsApp"
                                );
                            }
                        }
                    }
                }).open();

            },
            // getLinkPdf(document_type, print_a4 = null){

            //     let link_pdf = null

            //     switch (document_type) {
            //         case 'value':
            //             break;

            //         default:
            //             link_pdf = (print_a4) ? print_a4 : `${localStorage.api_url}/print/document/${external_id}/a4`
            //             break;
            //     }

            //     return link_pdf
            // },
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
                            this.showAlert(`${response.data.message}`)
                            this.initFormEmail();
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
            email(id, type, default_email = null) {
                const self = this;
                self.initFormEmail();
                self.form_email.id = id;
                //  this.sendMailOpen = true;
                self.$f7.dialog.prompt(
                    "Ingresa el Email",
                    "", //titulo
                    function (value)
                    {
                        if (value) {
                            self.form_email.email = value;
                            self.sendEmail(type);
                        } else {
                            alert("Ingrese el Email.");
                        }
                    },
                    ()=>{},
                    default_email
                )
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


                if (type == "dispatch") {
                    let a4 =(format)?format:'a4';
                        cordova.InAppBrowser.open(
                            `${localStorage.api_url}/print/${type}/${external_id}/${a4}`,
                            "_system",
                            "location=yes"
                        );
                }else if (type == "document") {
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

            getQueryParameters() {

                return queryString.stringify({
                    ...this.form_search
                })

            },
            async getDataDocuments() {

                const self = this
                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/documents/records?${this.getQueryParameters()}`,  this.getHeaderConfig())
                    .then(response => {

                        if(this.form_search.document_type_id === '01')
                        {
                            this.source_invoice = response.data.data
                        }
                        else
                        {
                            this.source_ticket = response.data.data
                        }

                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },
            getDataSaleNote() {

                const self = this

                this.showLoading()

                this.$http
                    .get(`${this.returnBaseUrl()}/sale-note/lists?${this.getQueryParameters()}`, this.getHeaderConfig())
                    .then(response => {
                        self.source_note = response.data.data
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
            },
            getDataOrderNote() {

                const self = this
                this.showLoading()

                this.$http
                    .get(`${this.returnBaseUrl()}/order-notes/lists?${this.getQueryParameters()}`, this.getHeaderConfig())
                    .then(response => {
                        self.source_order_note = response.data.data;
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })

            },
            getDataPurchases() {

                const self = this

                this.showLoading()

                this.$http
                    .get(`${this.returnBaseUrl()}/purchases/records?${this.getQueryParameters()}`, this.getHeaderConfig())
                    .then(response => {
                        self.source_purchases = response.data.data
                        // console.log(self.source_purchases)
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
            },
            async getDataQuotations() {

                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/quotations/list?${this.getQueryParameters()}`, this.getHeaderConfig())
                    .then(response => {
                        this.source_quotations = response.data.data
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })

            },
            async getDataDispatches() {
                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/dispatches/records?${this.getQueryParameters()}`,  this.getHeaderConfig())
                    .then(response => {
                        this.source_dispatches = response.data.data
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
            },
            async getDataCarrierDispatches() {
                this.showLoading()

                await this.$http.get(`${this.returnBaseUrl()}/dispatch-carrier/records?${this.getQueryParameters()}`,  this.getHeaderConfig())
                    .then(response => {
                        this.source_carrier_dispatches = response.data.data
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
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
                    case 'Enviado':
                        status = 'blue'
                        break;
                    default:
                        status = 'green'
                        break;
                }

                return status;
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },

            async clickSendDispatch(id,type) {
                this.showLoading()
                let formSend = {
                    external_id: id
                };

                await this.$http.post(`${this.returnBaseUrl()}/dispatches/send`, formSend, this.getHeaderConfig())
                    .then(response => {
                        if(type=='dispatch'){
                            this.getDataDispatches();
                        }else{
                            this.getDataCarrierDispatches()
                        }
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
            },

            async clickStatusDispatch(id,type) {
                this.show_send_dispatch = false;
                this.showLoading()
                let formSend = {
                    external_id: id
                };
                await this.$http.post(`${this.returnBaseUrl()}/dispatches/status_ticket`, formSend, this.getHeaderConfig())
                    .then(response => {
                        if(type=='dispatch'){
                            this.getDataDispatches()
                        }else{
                            this.getDataCarrierDispatches()
                        }
                    })
                    .catch(err => {})
                    .then(() => {
                        this.hideLoading()
                    })
            },
        }
    };
</script>
