<template>
<f7-page class="page-red" color="white">

    <f7-block>
        <f7-row>
            <f7-col width="80" class="text-color-white">
                <a @click="closePopup" class="link text-color-white">
                    <i class="icon icon-back"></i>
                </a>
                Listado de Productos
            </f7-col>
            <f7-col width="10">
                <a href="#" class="link navbar-tooltip text-color-white">
                    <i class="icon f7-icons if-not-md">info</i>
                    <i class="icon material-icons if-md">info_outline</i>
                </a>
            </f7-col>
            <f7-col width="10">
                <a href="#" class="link" @click="sheetConfirm = !sheetConfirm">
                    <f7-icon color="white" material="shopping_cart">
                        <f7-badge color="blue">
                            {{ countCar }}
                        </f7-badge>
                    </f7-icon>
                </a>
            </f7-col>
        </f7-row>
    </f7-block>

    <f7-card class="card-100 padding no-shadow" color="red" style="min-height: 90%">
        <f7-block style="padding:0px">
            <f7-row>
                <f7-col width="75">
                    <div class="searchbar searchbar-inline" style="margin:4%">
                        <div class="searchbar-input-wrap">
                            <input type="search" placeholder="Buscar" style="font-size:12px" v-model="search_item" />
                            <i class="searchbar-icon"></i>
                            <span class="input-clear-button"></span>
                        </div>
                    </div>
                </f7-col>
                <f7-col width="15" class="text-align-center">
                    <f7-button @click="addForm = !addForm" color="blue" fill small open-panel="right" icon="fas fa-plus"></f7-button>
                    <span class="" style="font-size: 10px;line-height: 10px !important;">NUEVO</span>
                </f7-col>
            </f7-row>

            <div class="list inset ">
                <p v-if="items_car.length == 0">
                    No tienes productos agregados
                </p>
                <ul>
                    <li v-for="(item, index) in items_car" :key="index" class="list-documents">
                        <div class="item-content padding-horizontal margin-vertical">
                            <div @click="add(index)" class="item-media" style="min-width: 0px !important;">
                                <f7-icon :material="item.quantity > 0 ? 'check_box' : 'check_box_outline_blank'" class="text-color-blue"></f7-icon>
                            </div>
                            <div class="item-inner">
                                <div class="item-title text-color-blue" style="font-size: .9em">
                                    {{ item.full_description }}
                                    <!-- <div class="item-footer text-color-blue">
                      <label>S/. <input required validate v-model="item.item.sale_unit_price" type="number" /></label>
                    </div> -->

                                    <div class="item-content">
                                        <div class="item-media">S/.</div>
                                        <!-- <div class = "item-inner">
                          <div class = "item-input"> -->
                                        <input required validate v-model="item.item.sale_unit_price" type="number" />
                                        <!-- </div>
                        </div> -->
                                    </div>
                                </div>

                                <div class="item-after" style="width: 101px;">

                                    <div class="stepper stepper-raised stepper-init stepper-small bg-color-white">
                                        <div class="stepper-button-minus" @click="calculate(-1, index)"></div>
                                        <div class="stepper-input-wrap">
                                            <!-- <input
                          type="text"
                          :value="item.quantity"
                          min="0"
                          max="100"
                          step="1"
                          readonly
                        /> -->
                                            <input type="number" v-model="item.quantity" min="0" step="1" />
                                        </div>
                                        <div @click="calculate(1, index)" class="stepper-button-plus"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </f7-block>
    </f7-card>

    <f7-sheet style="height:55%;" class="demo-sheet" :opened="addForm" @sheet:closed="addForm = false">
        <f7-page-content>
            <f7-block class="text-align-right no-margin-vertical no-padding-vertical">
                <f7-link small sheet-close class="no-margin no-padding text-color-red">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block style="margin-top: 0px !important;" color="red">
                <form class="list no-hairlines-md" id="demo-form-item">
                    <ul>
                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Código interno</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.internal_id" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Nombre</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.description" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">Descripción</div>
                                <div class="item-input-wrap">
                                    <input v-model="form.name" required validate type="text" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Precio Unitario (Venta) *
                                </div>
                                <div class="item-input-wrap">
                                    <input v-model="form.sale_unit_price" required validate step="any" type="number" />
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>


                        <li class="item-content item-input">
                            <div class="item-inner">
                                <div class="item-title item-label">
                                    Cargar imágen
                                </div>
                                <div class="item-input-wrap">
                                    <input class="button" type='file' id="input_image" @change="changeUploadImage">
                                    <span class="input-clear-button"></span>
                                </div>
                            </div>
                        </li>

                        <li class="item-content item-input" v-if="form.temp_path">
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="item-input-wrap">
                                        <img :src="form.temp_path" style="max-width: 100%">
                                    </div>
                                </div>
                            </div>
                        </li>


                        <li class="item-content item-input">
                            <div class="item-inner">
                                <f7-button fill @click="submit">Guardar</f7-button>
                            </div>
                        </li>
                    </ul>
                </form>
            </f7-block>
        </f7-page-content>
    </f7-sheet>

    <f7-sheet style="height:65%;" class="demo-sheet" :opened="sheetConfirm" @sheet:closed="sheetConfirm = false">
        <f7-page-content>
            <f7-block class="shadow text-align-right no-margin-vertical no-padding-vertical">
                <f7-link sheet-close class="no-padding text-color-red">
                    <f7-icon material="close"></f7-icon>
                </f7-link>
            </f7-block>
            <f7-block color="red">
                <div class="data-table margin-bottom">
                    <table>
                        <thead>
                            <tr>
                                <th class="numeric-only">#</th>
                                <th class="label-cell">Producto</th>
                                <th class="numeric-only">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in itemsCar" :key="index">
                                <td class="numeric-only">{{ index + 1 }}</td>
                                <td class="label-cell">{{ item.description }}</td>
                                <td class="numeric-only">{{ item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <f7-button color="red" @click="send" small fill>
                    Confirmar
                </f7-button>
            </f7-block>
        </f7-page-content>
    </f7-sheet>
</f7-page>
</template>

<style scoped>
.page-content {
    padding-top: 2% !important;
}

</style>

<script>
import {
    auth
} from "mixins_/auth";
import _ from "lodash";
import {
    calculateRowItem
} from "js_/helpers/functions";

export default {
    //props: ["search_item"],
    mixins: [auth],
    name: "ItemsForm",
    components: {},
    props: ["showDialog"],

    data: function () {
        return {
            sheetConfirm: false,
            filteCart_b: false,
            search_item: "",
            items_car: [],
            items_car_base: [],
            addForm: false,
            items: [],
            affectation_igv_types: [],
            form: {},
            files: null
        };
    },
    computed: {
        countCar() {
            return _.filter(this.items_car, function (o) {
                return o.quantity > 0;
            }).length;
        },

        itemsCar() {
            return _.filter(this.items_car, function (o) {
                return o.quantity > 0;
            });
        }
    },
    mounted() {

        this.$f7.tooltip.create({
            targetEl: '.navbar-tooltip',
            text: 'El código interno es obligatorio para visualizar los productos'
        })

    },
    created() {
        this.initForm();
        this.getTables();
    },
    watch: {
        search_item: function (val) {
            if (val.length > 1) {
                this.searchItems();
            } else if (val.length == 0) {
                this.initItems();
            }
        }
        /*filteCart_b: function(val) {
          if (val) {
            this.items_car = _.filter(this.items_car_base, function(o) {
              return o.quantity > 0;
            });
          } else {
            this.items_car = this.items_car_base;
          }
        }*/
    },

    methods: {
        changeUploadImage(){

            const input_image = document.getElementById('input_image').files[0] 

            if(input_image)
            {
                const formData = new FormData()
                formData.append("file", input_image)
                
                this.$f7.preloader.show()
    
                this.$http.post(`${this.returnBaseUrl()}/items/upload-temp-image`, formData, this.getHeaderConfig())
                        .then(response => {
                            const data = response.data.data
                            this.form.temp_path = data.temp_image
                            this.form.image = data.filename
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .then(() => {
                            this.$f7.preloader.hide()
                        })
            }
            else
            {
                this.form.temp_path = null
                this.form.image = null
            }

        },

        blurQuantity(index, quantity) {
            // console.log(quantity)
            // // this.calculate(quantity, index)
            // console.log(this.items_car[index])
            // this.add(index, quantity)
        },
        cancel() {
            this.items_car.forEach(element => (element.quantity = 0));
        },
        closePopup() {
            this.$emit("update:showDialog", false);
        },
        initForm() {
            this.form = {
                id: null,
                item_type_id: "01",
                internal_id: null,
                item_code: null,
                item_code_gs1: null,
                description: null,
                name: null,
                second_name: null,
                unit_type_id: "NIU",
                currency_type_id: "PEN",
                sale_unit_price: 0,
                purchase_unit_price: 0,
                has_isc: false,
                system_isc_type_id: null,
                percentage_isc: 0,
                suggested_price: 0,
                sale_affectation_igv_type_id: "10",
                purchase_affectation_igv_type_id: "10",
                calculate_quantity: false,
                stock: 0,
                stock_min: 0,
                has_igv: true,
                has_perception: false,
                item_unit_types: [],
                percentage_of_profit: 0,
                percentage_perception: 0,
                image_url: null,
                is_set: false,
                account_id: null,
                category_id: null,
                brand_id: null,
                date_of_due: null,
                lot_code: null,
                lots_enabled: false,
                lots: [],
                image: null,
                temp_path: null,
            };

            this.cleanInputImage()
            
        },
        cleanInputImage(){
            
            const input_image = document.getElementById('input_image')
            if(input_image) input_image.value = null

        },
        submit() {

            const self = this;
            self.$f7.preloader.show();
            this.$http
                .post(`${this.returnBaseUrl()}/item`, this.form, this.getHeaderConfig())
                .then(response => {

                    self.$f7.dialog.alert(`${response.data.msg}`, "Mensaje");

                    if (response.data.success) {

                        this.initForm()
                        this.initFormItem()
                        let it = response.data.data;
                        this.addForm = false;
                        self.items_car.push({
                            full_description: it.full_description,
                            description: it.description,
                            id: it.id,
                            quantity: 0,
                            sale_unit_price: it.sale_unit_price,
                            item: it
                        });

                    }

                })
                .catch(error => {

                    // console.log( error.response.data.message)
                    if (error.response.status === 422) {
                        let errors = error.response.data.message

                        let validator = this.validationErros(errors)
                        if (!validator.success) {
                            self.$f7.dialog.alert(`Validaciones: <br>${validator.message}`, "Mensaje");
                        }

                    } else {
                        console.log(error)
                        alert("Sucedio un error al guardar.");
                    }
                })
                .then(() => {
                    self.$f7.preloader.hide();
                });
        },
        validationErros(errors) {

            let message = ''
            let error = {
                success: true
            }

            if (errors.internal_id) {
                message += `${errors.internal_id[0]} <br>`
            }

            if (errors.description) {
                message += `${errors.description[0]} <br>`
            }

            if (errors.sale_unit_price) {
                message += `${errors.sale_unit_price[0]} <br>`
            }

            if (message != '') {
                error = {
                    success: false,
                    message: message
                }
            }

            return error

        },
        delete_parent(id) {
            let o = this.items_car.find(x => x.id == id);
            o.quantity = 0;
            this.send();
        },
        initFormItem() {
            return {
                item_id: null,
                item: {},
                affectation_igv_type_id: null,
                affectation_igv_type: {},
                has_isc: false,
                system_isc_type_id: null,
                calculate_quantity: false,
                percentage_isc: 0,
                suggested_price: 0,
                quantity: 1,
                aux_quantity: 1,
                unit_price_value: 0,
                unit_price: 0,
                charges: [],
                discounts: [],
                attributes: [],
                has_igv: null
            };
        },

        send() {
            const self = this;
            self.sheetConfirm = false;
            let send_items = this.items_car
                .filter(x => x.quantity > 0 && x.item.sale_unit_price > 0)
                .map(o => {
                    let obj = self.initFormItem();
                    obj.quantity = o.quantity;
                    (obj.item = o.item), //_.find(self.items, { id: o.id });
                    (obj.unit_price_value = obj.item.sale_unit_price);
                    obj.has_igv = obj.item.has_igv;
                    obj.affectation_igv_type_id = obj.item.sale_affectation_igv_type_id;

                    let unit_price = obj.has_igv ?
                        obj.unit_price_value :
                        obj.unit_price_value * 1.18;

                    obj.unit_price = unit_price;
                    obj.item.unit_price = unit_price;
                    obj.item.presentation = null;

                    obj.charges = [];
                    obj.discounts = [];
                    obj.attributes = [];
                    obj.affectation_igv_type = _.find(this.affectation_igv_types, {
                        id: obj.affectation_igv_type_id
                    });

                    let row = calculateRowItem(obj, "PEN", 1);

                    return row;
                });

            this.$emit("addItemsCar", send_items);

            this.initItems();
        },
        add(index, quantity = 1) {
            if (this.items_car[index].quantity > 0) {
                this.items_car[index].quantity = 0;
            } else {
                this.items_car[index].quantity = quantity;
                // this.items_car[index].quantity = 1;
            }
        },
        calculate(value, index) {
            let q = parseFloat(this.items_car[index].quantity);
            let resul = (q += parseFloat(value));
            this.items_car[index].quantity = resul < 0 ? 0 : resul;
        },

        initItems() {
            this.search_item = "";
            let datos = this.items_car_base.map(x => {
                return {
                    full_description: x.full_description,
                    description: x.description,
                    id: x.id,
                    quantity: 0,
                    sale_unit_price: x.sale_unit_price,
                    item: x
                };
            });
            this.items_car = datos;
        },
        getTables() {
            const self = this;
            self.$f7.preloader.show();
            this.$http
                .get(`${this.returnBaseUrl()}/document/tables`, this.getHeaderConfig())
                .then(response => {
                    let source = response.data.data;
                    self.items_car_base = source.items;
                    self.affectation_igv_types = source.affectation_types;
                    self.initItems();
                })
                .catch(err => {})
                .then(() => {
                    self.$f7.preloader.hide();
                });
        },

        async searchItems() {
            if (this.search_item.length > 1) {
                const self = this;
                self.$f7.preloader.show();

                let parameters = `input=${this.search_item}`;

                await this.$http
                    .get(
                        `${this.returnBaseUrl()}/document/search-items?${parameters}`,
                        this.getHeaderConfig()
                    )
                    .then(response => {
                        this.items_car = response.data.data.items.map(x => {
                            return {
                                full_description: x.full_description,
                                description: x.description,
                                id: x.id,
                                quantity: 0,
                                sale_unit_price: x.sale_unit_price,
                                item: x
                            };
                        });
                    })
                    .catch(err => {
                        alert("Error");
                    })
                    .then(() => {
                        self.$f7.preloader.hide();
                    });
            } else {
                // this.initItems()
            }
        }
    }
};
</script>
