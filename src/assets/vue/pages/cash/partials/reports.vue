<template>
<f7-sheet class="demo-sheet default-h40-modal padding-top" :opened="showDialog" @sheet:closed="close">
    <f7-page-content>
        <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
            <f7-link small sheet-close class="no-margin no-padding text-color-red">
                <f7-icon material="close"></f7-icon>
            </f7-link>
        </f7-block>
        <f7-block style="margin-top: 0px !important" color="red"> 
            
            <!-- <f7-block-title>Reporte general</f7-block-title>
            <f7-list simple-list>
                <f7-list-item title="Item 1">
                    <label class="radio"><input type="radio" name="demo-radio-inline" /><i class="icon-radio"></i></label> 
                </f7-list-item>
                <f7-list-item title="Item 2"></f7-list-item>
                <f7-list-item title="Item 3"></f7-list-item>
            </f7-list> -->
<div class="block-title">Radio Group</div>
    <div class="block-header">Icon in the beginning of the list item</div>
    <div class="list">
      <ul>
        <li>
          <label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start" value="Books" checked />
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Books</div>
            </div>
          </label>
        </li>
        <li>
          <label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start" value="Movies" />
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Movies</div>
            </div>
          </label>
        </li>
        <li>
          <label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start" value="Food" />
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Food</div>
            </div>
          </label>
        </li>
        <li>
          <label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start" value="Drinks" />
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Drinks</div>
            </div>
          </label>
        </li>
      </ul>
    </div>
        </f7-block>
        
    </f7-page-content>
</f7-sheet>
</template>

<script>

    import {auth} from "mixins_/auth"
    import {general_functions} from "mixins_/general_functions"

    export default {
        props: ['showDialog', 'recordId'],
        mixins: [auth, general_functions],
        data: function () {
            return {
                resource: 'cash',
                form: {},
            }
        },
        watch: {
            showDialog(newValue) {
                if (newValue) {
                    this.open()
                }
            }
        },
        async created() {
            await this.initForm()
        },
        methods: {
            open() {
                // this.getRecord()
            },
            async getRecord() {

                if (this.recordId) {

                    this.showLoading()

                    await this.$http.get(`${this.returnBaseUrl()}/${this.resource}/record/${this.recordId}`, this.getHeaderConfig())
                        .then(response => {
                            this.form = response.data.data
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.hideLoading()
                        })

                }

            },
            initForm() {

                this.form = {
                    id: null,
                    user_id: null,
                    date_opening: null,
                    time_opening: null,
                    date_closed: null,
                    time_closed: null,
                    beginning_balance: 0,
                    final_balance: 0,
                    income: 0, 
                    state: true,
                    reference_number: null
                }

            },
            submit() {

                this.showLoading()

                this.$http.post(`${this.returnBaseUrl()}/${this.resource}`, this.form, this.getHeaderConfig())
                    .then(response => {

                        this.showAlert(`${response.data.msg ? response.data.msg : response.data.message}`)

                        if (response.data.success) {
                            this.$eventHub.$emit('reloadData')
                            this.close()
                        }

                    })
                    .catch(error => {

                        if (error.response.status === 422) {
                            const errors = error.response.data.message
                            let validator = this.validationErros(errors)

                            if (!validator.success) {
                                this.showAlert(`Validaciones: <br>${validator.message}`)
                            }

                        } else {
                            console.log(error)
                            alert(`Ocurrió un error al guardar: ${error}`)
                        }

                    })
                    .then(() => {
                        this.hideLoading()
                    })

            },

            validationErros(errors) {

                let message = ''
                let error = {
                    success: true
                }

                if (errors.beginning_balance) {
                    message += `${errors.beginning_balance[0]} <br>`
                }

                if (message != '') {
                    error = {
                        success: false,
                        message: message
                    }
                }

                return error

            },
            close() {
                this.$emit('update:showDialog', false)
                this.initForm()
            }
        }
    }
</script>
