<template>
    <div class="no-padding-horizontal padding-vertical">
        <f7-block class="bg-white-shade block-strong inset no-margin">

            <template v-if="showOnlyTotals">
                <f7-row>
                    <f7-col>
                        <!-- <h4>Total</h4> -->
                        <!-- <template v-if="paymentChange > 0 && isCashPayment"> -->
                            <p>Vuelto</p>
                        <!-- </template> -->
                    </f7-col>
                    <f7-col class="text-align-right">
                        <!-- <h4>{{currencyTypeSymbol}} {{form.total}}</h4> -->
                        <!-- <template v-if="paymentChange > 0 && isCashPayment"> -->
                            <p>{{currencyTypeSymbol}} {{paymentChange}}</p>
                        <!-- </template> -->
                    </f7-col>
                </f7-row>
            </template>
            <template v-else-if="showAllTotals">

                <f7-row>
                    <f7-col>
                        <h4 class="no-margin-vertical">OP. Gravada</h4>
                        <h4 class="no-margin-vertical">IGV</h4>
                        <h4 class="no-margin-vertical">Descuentos</h4>
                        <template v-if="paymentChange > 0 && isCashPayment">
                            <p class="no-margin-vertical">Vuelto</p>
                        </template>
                    </f7-col>
                    <f7-col class="text-align-right">
                        <h4 class="no-margin-vertical text-white">{{currencyTypeSymbol}} {{form.total_taxed}}</h4>
                        <h4 class="no-margin-vertical text-white">{{currencyTypeSymbol}} {{form.total_igv}}</h4>
                        <h4 class="no-margin-vertical text-white">{{currencyTypeSymbol}} {{form.total_discount}}</h4>
                        <template v-if="paymentChange > 0 && isCashPayment">
                            <p class="no-margin-vertical text-white">{{currencyTypeSymbol}} {{paymentChange}}</p>
                        </template>
                    </f7-col>
                </f7-row>
                <f7-row class="border">
                    <f7-col>
                        <h3 class="no-margin-bottom text-color-black">Total</h3>
                    </f7-col>
                    <f7-col class="text-align-right">
                        <h3 class="no-margin-bottom text-color-black">{{currencyTypeSymbol}} {{form.total}}</h3>
                    </f7-col>
                </f7-row>

            </template>

            <!-- para mostrar totales modo portrait pantalla 2 - detalle -->
            <template v-else>
                <f7-row>
                    <f7-col>
                        <h3>OP. Gravada</h3>
                        <h3>IGV</h3>
                        <h3>Descuentos</h3>
                    </f7-col>
                    <f7-col class="text-align-right">
                        <h3>{{currencyTypeSymbol}} {{form.total_taxed}}</h3>
                        <h3>{{currencyTypeSymbol}} {{form.total_igv}}</h3>
                        <h3>{{currencyTypeSymbol}} {{form.total_discount}}</h3>
                    </f7-col>
                </f7-row>
            </template>

        </f7-block>
    </div>
</template>

<script>

    export default {
        props: {
            //para mostrar solo el total, modo portrait 3ra pantalla Payment
            showOnlyTotals: {
                type: Boolean,
                required: false,
                default: false
            },

            //para mostrar totales, modo landscape
            showAllTotals: {
                type: Boolean,
                required: false,
                default: false
            },

            // para vueltos
            paymentChange: {
                type: Number,
                required: false,
                default: 0
            },
            isCashPayment: {
                type: Boolean,
                required: false,
                default: false
            },
            // para vueltos

            form: {
                type: Object,
                required: true,
            },
            currencyTypeSymbol: {
                type: String,
                required: true,
            },
        },
        name: 'DocumentTotals',
        data: function () {
            return {

            }
        },
        computed: {
        },
        async created() {
        },
        methods: {
        }
    }
</script>
