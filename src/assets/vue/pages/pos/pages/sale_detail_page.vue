<template>
    <f7-page class="" :color="theme.name_color_theme">
        <sale-detail-pos></sale-detail-pos>
    </f7-page>
</template>

<script>

    import SaleDetailPos from '../components/SaleDetail.vue'
    import {general_functions} from 'mixins_/general_functions'

    export default {
        name: 'SaleDetailPosPage',
        components: {
            SaleDetailPos
        },
        mixins: [
            general_functions,
        ],
        data: function () {
            return {
                theme: {},
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
