 //funciones que se comparten con el modo landscape

import queryString from "query-string"

// funciones para el listado de productos, en modo portrait y landscape, diferentes vistas, mismas funciones
export const fn_list_items_sale = {

    data: function () {
        return {
            header_title: 'PRODUCTOS',
            searchTimer: null,
        }
    },
    methods: {
        setHeaderTitle(new_title = null)
        {
            this.header_title = new_title ? new_title.toUpperCase() : 'PRODUCTOS'
        },
        searchRecords()
        {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.initDataListItems()
            }, 500);
            // if(this.form_search.input.length > 2)
            // {
            //     await this.initDataListItems()
            // }
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

            //filtro para favoritos
            if(this.categories[index].favorite)
            {
                this.clickFavorite()
            }
            else
            {
                this.selectedCategory(index)
                this.form_search.category_id = category_id
                this.form_search.favorite = null
                this.initDataListItems()
            }

            this.setHeaderTitle(!category_id ? null : this.categories[index].name)
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

                            //se agrega favoritos como categoria para que no distorsione el card en vista
                            this.categories.unshift({id: -1, name: 'FAVORITOS', selected: false, favorite: true})
                        })
                        .then(() => {
                            this.hideLoading()
                        })

        },
        clickFavorite()
        {
            this.form_search.category_id = null
            this.form_search.favorite = 1 // siempre que se pulse retorna los favoritos
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

            //Modo Landscape - evento para actualizar items en SaleDetail al agregar/modificar en este listado de productos
            this.$eventHub.$emit('eventSelectedItem')

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
