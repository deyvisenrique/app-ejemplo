<template>
    <f7-block class="no-margin-vertical margin-top" v-if="isMultiUserEnabled">
        <f7-row class="display-flex align-items-center">
            <f7-col width="100">
                <div class="item-content item-input no-padding-horizontal">
                    <div class="item-inner no-padding-horizontal">
                        <div class="item-input-wrap input-dropdown-wrap" style="width:100%">
                            <select 
                                v-model="form.multi_user_id"
                                @change="changeUser"
                            > 
                                <option 
                                    v-for="option in multi_users"
                                    :key="option.id"
                                    :label="option.client_full_name"
                                    :value="option.id"
                                >
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </f7-col>
        </f7-row>
    </f7-block>
</template>

<script>

    import { general_functions } from 'mixins_/general_functions'
    import { auth } from 'mixins_/auth'

    export default {
        mixins: [general_functions, auth],
        name: 'ChangeClient',
        props: [

        ],
        data: function () {
            return {
                resource: 'multi-users',
                multi_users: [],
                form: {},
                old_multi_user_id: null,
                errors: {}
            };
        },
        async created() 
        {
            await this.initForm()
            await this.getRecords()
        },
        computed: {
            isMultiUserEnabled()
            {
                return this.getStorage('multi_user_enabled') == 'true'
            },
            currentRouteName() 
            {
                return this.$f7router.currentRoute.path
            }
        },
        watch:{
            'form.multi_user_id'(newVal, oldVal)
            {
                this.old_multi_user_id = oldVal
            }
        },
        methods: 
        {
            initForm()
            {
                this.form = {
                    multi_user_id: null,
                    is_destination: false,
                    fqdn: null,
                }
            },
            getInternetProtocol()
            {
                const api_url = this.getStorage('api_url')

                const parse = api_url.split('://')

                return parse[0]
            },
            saveClientInitialData(data) 
            {
                this.setStorage('api_token', data.api_token)
                this.setStorage('user_name', data.user_name)
                this.setStorage('user_email', data.user_email)

                const internet_protocol = this.getInternetProtocol()

                const api_url = `${internet_protocol}://${this.form.fqdn}`

                this.setStorage('api_url', api_url)

                const logo = data.app_logo

                if (data.ruc && logo)
                {
                    this.setStorage('ruc', data.ruc)
                    this.setStorage('url_logo', `${api_url}/storage/uploads/logos/${logo}`)
                }
                else
                {
                    if(!logo) this.removeStorage('url_logo')
                }

                this.setStorage('company', data.company, true)

                if (data.app_configuration) this.setStorage('app_configuration', data.app_configuration, true)

            },
            redirectToHome()
            {
                location.reload()
            },
            async changeClient() 
            {
                this.showLoading()

                await this.$http.post(`${this.returnBaseUrl()}/multi-users/change-client`, this.form, this.getHeaderConfig())
                            .then(response => {

                                const data = response.data

                                if (data.success)
                                {
                                    this.saveClientInitialData(data)
                                    this.redirectToHome()
                                }
                                else
                                {
                                    this.showAlert(data.message)
                                    this.form.multi_user_id = this.old_multi_user_id
                                }
                            })
                            .catch(error => {
                                this.showAlert(`Ocurrió un error: ${error.message}`)
                            })
                            .finally(() => {
                                this.hideLoading()
                            })
            },
            changeUser() 
            {
                const row = _.find(this.multi_users, { id : this.form.multi_user_id})
                this.form.is_destination = row.is_destination
                this.form.fqdn = row.fqdn
                this.changeClient()
            },
            async getRecords()
            {
                await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/records`, this.getHeaderConfig())
                            .then(response => {
                                this.multi_users = response.data
                            })
            },
        }
    }
</script>
