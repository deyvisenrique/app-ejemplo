<template>
<div>

    <template v-if="currentShowLogoConfiguration">
        <f7-block :class="theme.class_bg_header" class="no-margin-vertical padding-top">
            <f7-row class="display-flex align-items-center">
                <f7-col width="33">
                    <f7-link href="/" v-if="theme.theme_color != 'white'">
                        <logo heightLogo="40" alternativePercentage="40%"></logo>
                    </f7-link>
                    <!-- tema: {{ theme.theme_color }} <br>
                    unicolor: {{ theme.is_unicolor_boxes }} <br> -->
                </f7-col>
                <f7-col width="33" class="text-align-center">
                    <f7-link href="/" v-if="theme.theme_color == 'white'">
                        <logo heightLogo="40" alternativePercentage="40%"></logo>
                    </f7-link>
                </f7-col>
                <f7-col width="33" class="">
                    <f7-button panel-open="right" class="text-align-right" :class="theme.class_menu_text_color"><i class="fas fa-bars"></i></f7-button>
                </f7-col>
            </f7-row>
        </f7-block>
    </template>

    <f7-block :class="theme.class_bg_header" class="no-margin-vertical padding-bottom" v-if="title">
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
            <f7-col width="10">
                <template v-if="menuPositionTwo">
                    <f7-button panel-open="right" class="text-align-right" :class="theme.class_menu_text_color"><i class="fas fa-bars"></i></f7-button>
                </template>
            </f7-col>
        </f7-row>
    </f7-block>
    <header-waves :title="title" v-if="theme.theme_color != 'white'"></header-waves>

    <change-client></change-client>

</div>
</template>

<script>

    import logoOficialLight from "assets/images/logo/logo-light.svg"
    import HeaderWaves from "./HeaderWaves.vue"
    import Logo from "./Logo.vue"
    import {general_functions, set_logo} from "mixins_/general_functions"
    import ChangeClient from '../multi-users/ChangeClient.vue'

    export default {
        mixins: [general_functions, set_logo],
        name: "HeaderLayout",
        props: ["title", 'showButtonBack', 'hrefBack', 'overwriteBackRoute', 'showLogoConfiguration', 'menuPositionTwo'],
        components: {
            HeaderWaves,
            logoOficialLight,
            Logo,
            ChangeClient
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
            currentShowLogoConfiguration()
            {
                if(this.showLogoConfiguration !== undefined) return this.showLogoConfiguration
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
