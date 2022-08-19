<template>
    <f7-page class="" :color="theme.name_color_theme">
        <payment></payment>
    </f7-page>
</template>

<script>

    import Payment from '../components/Payment.vue'
    import {general_functions} from 'mixins_/general_functions'

    export default {
        name: 'SalePaymentPosPage',
        components: {
            Payment
        },
        mixins: [
            general_functions,
        ],
        data: function () {
            return {

            }
        },
        computed: {
        },
        async created() {
            await this.getInitialSettings()
        },
        methods: {
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
