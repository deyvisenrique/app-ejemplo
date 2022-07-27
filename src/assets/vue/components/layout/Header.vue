<template>
<div>
    <f7-block class="bg-blue-magenta no-margin-vertical padding-vertical elevation-9">
        <f7-row class="display-flex align-items-center">
            <f7-col width="50">
                <f7-link href="/">
                    <img v-if="logo" :src="logo" alt="FacturaloPeru" width="100%" style="max-height: 80px;" />
                </f7-link>
            </f7-col>
            <f7-col width="50" class="">
                <f7-button panel-open="right" class="text-align-right text-color-white"><i class="fas fa-bars"></i></f7-button>
            </f7-col>
        </f7-row>
    </f7-block>
    <f7-block class="bg-blue-magenta padding-vertical no-margin-vertical" v-if="title">
        <f7-row class="display-flex align-items-center">
            <f7-col width="10">
                <a class="link back text-color-white" @click="clickHrefBack">
                    <template v-if="showBackHome">
                        <i class="fas fa-angle-left custom-icon-back-form"></i>
                    </template>
                </a>
            </f7-col>
            <f7-col width="80" class="text-color-white text-align-center custom-title-form">
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
    import {general_functions, set_logo} from "mixins_/general_functions"

    export default {
        mixins: [general_functions, set_logo],
        name: "HeaderLayout",
        props: ["title", 'showButtonBack', 'hrefBack'],
        components: {
            HeaderWaves,
            logoOficialLight
        },
        data: function () {
            return {
                logo: logoOficialLight,
            };
        },
        async created() {
            await this.events()
            await this.checkAppLogo()
        },
        computed:{
            showBackHome(){
                if(this.showButtonBack !== undefined) return this.showButtonBack

                return true
            },
            hrefBackHome(){

                if(this.hrefBack !== undefined) return this.hrefBack

                return '/'
            }
        },
        methods: {
            clickHrefBack(){
                // @todo por revisar funcion/componente f7, para que no redireccione al home por defecto
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

            }
        }
    }
</script>
