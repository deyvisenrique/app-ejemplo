<template>
<div>
    <f7-block :class="theme.class_bg_header" class="no-margin-vertical padding-vertical">
        <f7-row class="display-flex align-items-center">
            <f7-col width="50">
                <f7-link href="/">
                    <logo heightLogo="60"></logo>
                </f7-link>
                <!-- tema: {{ theme.theme_color }} <br>
                unicolor: {{ theme.is_unicolor_boxes }} <br> -->
            </f7-col>
            <f7-col width="50" class="">
                <f7-button panel-open="right" class="text-align-right" :class="theme.class_menu_text_color"><i class="fas fa-bars"></i></f7-button>
            </f7-col>
        </f7-row>
    </f7-block>
    <f7-block :class="theme.class_bg_header" class="padding-vertical no-margin-vertical" v-if="title">
        <f7-row class="display-flex align-items-center">
            <f7-col width="10">

                <template v-if="overwriteRoute">

                    <a :class="theme.class_header_text_color" @click="clickRedirectBack">
                        <template v-if="showBackHome">
                            <i class="fas fa-angle-left custom-icon-back-form"></i>
                        </template>
                    </a>

                </template>
                <template v-else>

                    <a class="link back" :class="theme.class_header_text_color" href="/">
                        <template v-if="showBackHome">
                            <i class="fas fa-angle-left custom-icon-back-form"></i>
                        </template>
                    </a>

                </template>

            </f7-col>
            <f7-col width="80" class="text-align-center custom-title-form" :class="theme.class_header_text_color">
                {{ title }}
            </f7-col>
            <f7-col width="10"></f7-col>
        </f7-row>
    </f7-block>
    <header-waves :title="title"></header-waves>
</div>
</template>

<script>

    import logoOficialLight from "assets/images/logo/logo-light.svg"
    import HeaderWaves from "./HeaderWaves.vue"
    import Logo from "./Logo.vue"
    import {general_functions, set_logo} from "mixins_/general_functions"

    export default {
        mixins: [general_functions, set_logo],
        name: "HeaderLayout",
        props: ["title", 'showButtonBack', 'hrefBack', 'overwriteBackRoute'],
        components: {
            HeaderWaves,
            logoOficialLight,
            Logo
        },
        data: function () {
            return {
                logo: logoOficialLight,
                theme: {},
            };
        },
        async created() {
            await this.events()
            await this.checkAppLogo()
            await this.checkTheme()
        },
        computed:{
            overwriteRoute()
            {
                if(this.overwriteBackRoute !== undefined) return this.overwriteBackRoute

                return false
            },
            showBackHome()
            {
                if(this.showButtonBack !== undefined) return this.showButtonBack
                return true
            },
            hrefBackHome()
            {
                if(this.hrefBack !== undefined) return this.hrefBack
                return '/'
            }
        },
        methods: {
            clickRedirectBack(){
                return this.redirectRoute(this.hrefBackHome)
            },
            checkAppLogo(){

                const url_logo = this.getStorage('url_logo')
                if (url_logo) this.logo = url_logo

            },
            events(){

                this.$eventHub.$on('updateGenerals', (generals)=>{
                    this.setAppLogo(generals)
                })

            },
            checkTheme() {
                this.theme = this.getThemeSettings()
            }
        }
    }
</script>
