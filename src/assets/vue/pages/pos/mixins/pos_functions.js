 //funciones que se comparten con el modo landscape

import queryString from "query-string"

export const fn_list_items_sale = {
    
    data: function () {
        return {
        }
    },
    methods: { 
        async searchRecords()
        {
            if(this.form_search.input.length > 2)
            {
                await this.initDataListItems()
            }
        },
        events(){

            this.$eventHub.$on('reloadData', ()=>{
                this.initDataListItems()
            })

        },
        clickClearInput()
        {
            this.form_search.input = null
            this.initDataListItems()
        },
        initLoadingText()
        {
            this.loading_text = 'Sin datos'
        },
        quantitySelectedRecords() 
        {
            return this.getListItemsSale().length
        },
        getListItemsSale()
        {
            const list_items_sale = this.getStorage('list_items_sale', true)

            if(list_items_sale) return list_items_sale

            return []
        },
        getCategoryName(category){
            return category.name.toUpperCase()
        },
        clickSearchByCategory(index, category_id)
        {
            this.selectedCategory(index)
            this.form_search.category_id = category_id
            this.initDataListItems()
        },
        selectedCategory(index)
        {
            this.categories = this.categories.map((row)=>{
                row.selected = false
                return row
            })

            this.categories[index].selected = true
        },
        async getCategories() {

            this.showLoading()

            await this.$http.get(`${this.returnBaseUrl()}/items/table/categories`, this.getHeaderConfig())
                        .then(response => {
                            this.categories = response.data
                            this.categories.unshift({id: null, name: 'TODOS', selected: false})
                        })
                        .then(() => {
                            this.hideLoading()
                        })

        },
        clickFavorite()
        {
            this.form_search.favorite = (this.form_search.favorite === 1) ? 0 : 1
            this.initDataListItems()
        },
        getSelectedRecords()
        {
            return this.records.filter((row) => {
                return row.quantity > 0
            })
        },
        isSelectedRecord(index)
        {
            return this.records[index].quantity > 0
        },
        saveSelectedItems(current_selected_item)
        {
            let list_items_sale = this.getListItemsSale()
            const selected_records = this.getSelectedRecords()
            let data = []

            // si existen productos guardados en storage
            if(list_items_sale.length > 0)
            {
                // se valida la cantidad para determinar si se elimina el producto
                if(current_selected_item.quantity <= 0)
                {
                    _.remove(list_items_sale, {item_id : current_selected_item.item_id})
                }
                else
                {
                    // se buscan los productos registrados en storage
                    selected_records.forEach(row => {

                        const item_sale = _.find(list_items_sale, {item_id : row.item_id})

                        // si no existe el producto seleccionado en el storage, se agrega
                        if(!item_sale)
                        {
                            list_items_sale.push({...row})
                        }
                        else
                        {
                            // si existe se regulariza cantidad
                            item_sale.quantity = row.quantity
                        }
                    })
                }

                data = list_items_sale
            }
            else
            {
                data = selected_records
            }

            this.setStorage('list_items_sale', data, true)
        },
        selected(index, quantity = 1)
        {
            this.records[index].quantity = (this.records[index].quantity > 0) ? 0 : quantity
            this.saveSelectedItems(this.records[index])
            this.quantitySelectedRecords()
        },
        calculateQuantity(value, index) 
        {
            let quantity = parseFloat(this.records[index].quantity)
            let result = (quantity += parseFloat(value))
            this.records[index].quantity = (result < 0) ? 0 : result
            this.saveSelectedItems(this.records[index])
        },
        findItem(item_id)
        {
            return _.find(this.records, {item_id:item_id})
        },
        checkSelectedRecords(){

            const selected_records = this.getStorage('list_items_sale', true)

            if(selected_records)
            {
                selected_records.forEach(sr_row => {
                    
                    const find_item = this.findItem(sr_row.item_id)

                    if(find_item)
                    {
                        find_item.quantity = sr_row.quantity
                        find_item.sale_unit_price = sr_row.sale_unit_price
                    }
                })
            }

        },
        clickSearchBarcode(){

            const context = this
            cordova.plugins.barcodeScanner.scan(
                (result) => {
                    if(result.text)
                    {
                        context.form_search.input = result.text
                        context.form_search.search_by_barcode = 1
                        context.initDataListItems()
                        context.form_search.search_by_barcode = 0
                    }
                },
                (error) => {
                    context.showAlert(`Error al escanear: ${error}`)
                },
                context.scanner_configuration
            )

        },
        async initDataListItems(){

            this.current_page = 1
            this.records = []
            await this.getRecords()

        },
        getQueryParameters() {

            return queryString.stringify({
                page: this.current_page,
                ...this.form_search
            })

        },
        initFormSearch(){
            this.form_search = {
                input : null,
                search_by_barcode : 0,
                category_id: null,
                favorite : 0,
            }
        },
        checkOrientation()
        {
            const portrait = window.matchMedia('(orientation: portrait)')
            const context = this

            portrait.addEventListener('change', function(e) {
                if(e.matches) 
                {
                    context.redirectRoute('/list-items-sale/')
                }
                else
                {
                    context.redirectRoute('/landscape-pos/')
                }
            })
        },

    }
}

import moment from 'moment'
import {calculateRowItem} from "js_/helpers/functions"

export const fn_sale_detail = {

    methods: {
        saveFormInStorage()
        {
            this.setStorage('form_sale_detail', this.form, true)
        },
        clickDelete(index)
        {
            // se elimina item del listado de ventas, registra en storage
            _.remove(this.list_items_sale, {item_id : this.form.items[index].item_id})
            this.saveListItemsSale()

            // se elimina item del form para facturacion
            this.form.items.splice(index, 1)
            this.calculateTotal()

        },
        findItemInListSale(item_id)
        {
            return _.find(this.list_items_sale, {item_id : item_id})
        },
        changeUnitPrice(index)
        {
            const unit_price = parseFloat(this.form.items[index].unit_price)

            if(unit_price <= 0)
            {
                return this.showAlert('El precio unitario debe ser mayor a 0.')
            }

            const item_sale = this.findItemInListSale(this.form.items[index].item_id)
            item_sale.sale_unit_price = unit_price

            this.form.items[index] = this.calculateDataItem(item_sale)
            this.calculateTotal()
            this.saveListItemsSale()

        },
        calculateQuantity(value, index) 
        {
            let quantity = parseFloat(this.form.items[index].quantity)
            let result = (quantity += parseFloat(value))

            if(result <= 0)
            {
                this.showAlert('La cantidad debe ser mayor a 0.')
            }
            else
            {
                this.form.items[index].quantity = result
                this.calculateQuantityItem(index, result)
            }
        },
        changeQuantity(index)
        {
            const quantity = this.form.items[index].quantity

            if(quantity <= 0)
            {
                this.showAlert('La cantidad debe ser mayor a 0.')
            }
            else
            {
                this.calculateQuantityItem(index, quantity)
            }
        },
        calculateQuantityItem(index, quantity)
        {
            
            const item_sale = this.findItemInListSale(this.form.items[index].item_id)
            item_sale.quantity = quantity

            this.form.items[index] = this.calculateDataItem(item_sale)
            this.calculateTotal()
            this.updateQuantityItemsStorage(index)

        },
        updateQuantityItemsStorage(index)
        {
            const quantity = this.form.items[index].quantity

            const item_sale = this.findItemInListSale(this.form.items[index].item_id)
            
            item_sale.quantity = parseFloat(quantity)

            this.saveListItemsSale()
        },
        saveListItemsSale()
        {
            this.setStorage('list_items_sale', this.list_items_sale, true)
        },
        changeInputDiscount(index)
        {
            let input_discount = parseFloat(this.form.items[index].input_discount)

            if(input_discount < 0)
            {
                input_discount = 0
                this.showAlert('El monto de descuento debe ser mayor a 0.')
            }

            // inicializar variables descuento
            const item_sale = this.findItemInListSale(this.form.items[index].item_id)
            item_sale.discounts = []
            item_sale.input_discount = input_discount

            // agregar descuento
            if(input_discount > 0)
            {
                const discount_type_id = '00'
                const discount_type = _.find(this.item_discount_types, { id : discount_type_id})

                if(!discount_type) this.showAlert('No se ubicó el tipo de descuento, verifique que el servicio en el facturador se encuentre disponible.')
                
                item_sale.discounts.push({
                    discount_type_id: discount_type_id,
                    discount_type: discount_type,
                    description: discount_type.description,
                    percentage: input_discount,
                    factor: 0,
                    amount: 0,
                    base: 0,
                    is_amount: true
                })
            }
        
            // procesar descuento o inicializar valores
            this.form.items[index] = this.calculateDataItem(item_sale)
            this.calculateTotal()
            this.saveListItemsSale()

        },
        async initDataSaleDetail()
        {
            this.list_items_sale = this.getStorage('list_items_sale', true)

            this.form.items = await this.getTransformDataItem(this.list_items_sale)

            this.calculateTotal()

        },
        calculateTotal()
        {
            this.generalCalculateTotal() //definido en mixin operations
        },
        getTransformDataItem(data)
        {
            return data.map(row => {
                return this.calculateDataItem(row)
            })
        },
        calculateDataItem(row)
        {
            let form_item = this.getFormItem()

            form_item.item = row
            // console.log("form_item.item.sale_unit_price", form_item.item.sale_unit_price)

            form_item.quantity = row.quantity
            form_item.unit_price_value = form_item.item.sale_unit_price

            form_item.has_igv = form_item.item.has_igv
            form_item.affectation_igv_type_id = form_item.item.sale_affectation_igv_type_id

            const unit_price = this.roundNumber((form_item.has_igv ? form_item.unit_price_value : form_item.unit_price_value * 1.18), 6)

            form_item.unit_price = unit_price
            form_item.item.unit_price = unit_price
            // console.log("unit_price", unit_price)


            form_item.affectation_igv_type = _.find(this.affectation_igv_types, {
                id: form_item.affectation_igv_type_id
            })

            form_item.input_description = row.description

            // data descuentos
            if(row.discounts)
            {
                // se maneja solo 1 dscto por item
                if(row.discounts.length === 1)
                {
                    form_item.discounts = row.discounts
                    form_item.input_discount = row.input_discount

                    //se asigna monto de descuento al campo "percentage", ya que este se usa para calculos en functions
                    form_item.discounts[0].percentage = row.input_discount 
                }
            }
            // data descuentos

            return calculateRowItem(form_item, 'PEN', 1)

        },
        getFormItem() 
        {
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
                has_igv: null,
                is_set: false,
                input_description: null,
                name_product_pdf: null,
                presentation: null,
                input_discount: 0,
            }
        },
        initForm() 
        {
            this.form = {
                prefix: 'NV',
                series_id: null,
                establishment_id: null,
                date_of_issue: moment().format('YYYY-MM-DD'),
                time_of_issue: moment().format('HH:mm:ss'),
                date_of_due: moment().format('YYYY-MM-DD'),
                customer_id: null,
                currency_type_id: 'PEN',
                document_type_id: null,
                exchange_rate_sale: 1,
                datos_del_cliente_o_receptor: {},
                totales: {},
                items: [],
                payment_condition_id: '01',
                total_plastic_bag_taxes: 0,
                total_exportation: 0,
                total_taxed: 0,
                total_exonerated: 0,
                total_unaffected: 0,
                total_free: 0,
                total_igv: 0,
                total_value: 0,
                total_taxes: 0,
                subtotal: 0,
                total_discount: 0,
                total: 0,
                payments: [],
            }

            this.setDefaultDocumentType()

        },
        setDefaultDocumentType()
        {
            if(this.configuration.default_document_type)
            {
                this.form.document_type_id = (_.some(this.document_types, {id : this.configuration.default_document_type})) ? this.configuration.default_document_type : this.setInitialDefaultDocumentType()
            }
            else
            {
                this.setInitialDefaultDocumentType()
            }
        },
        setInitialDefaultDocumentType()
        {
            this.form.document_type_id = this.document_types.length > 0 ? this.document_types[0].id : null
        },
        async getTablesSaleDetail() {

            this.showLoading()

            await this.$http.get(`${this.returnBaseUrl()}/documents/tables-sale-detail`, this.getHeaderConfig())
                        .then(response => {
                            this.document_types = this.getDocumentTypesToButtons(response.data.document_types)
                            this.affectation_igv_types = response.data.affectation_igv_types
                            this.item_discount_types = response.data.item_discount_types
                        })
                        .then(() => {
                            this.hideLoading()
                        })

        },
        clickChangeDocumentType(document_type_id)
        {
            this.form.document_type_id = document_type_id
        },
        getShortDescriptionDocumentType(document_type)
        {
            let description = null

            switch (document_type.id) 
            {
                case '01':
                    description = 'FACTURA'
                    break
                case '03':
                    description = 'BOLETA'
                    break
                case '80':
                    description = 'N. VENTA'
                    break
            }

            return description
        },
        getDocumentTypesToButtons(document_types)
        {
            this.pos_document_types = this.getPosDocumentTypes()
            const permissions = this.getStoragePermissions()
            let allowed_document_types = []

            document_types.forEach(row => {
                
                const doc_permission = _.find(this.pos_document_types, {document_type_id : row.id})

                if(doc_permission)
                {
                    const has_permission = this.hasPermissionInModule(doc_permission.module, permissions)

                    if(has_permission)
                    {
                        const text = this.getShortDescriptionDocumentType(row)

                        allowed_document_types.push({
                            id: row.id,
                            text: text,
                            cssClass: 'text-align-center',
                            description: row.description,
                        })
                    }

                }
            })

            return allowed_document_types
        },
        getDocumentType(id)
        {
            return _.find(this.document_types, {id:id})
        },
        getPosDocumentTypes()
        {
            const generals = this.getStorage('generals', true)
            return generals ? generals.pos_document_types : []
        },
    }
}