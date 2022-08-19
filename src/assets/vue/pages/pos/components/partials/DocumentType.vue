<template>
    <div>
        <template v-if="document_types.length > 0">
            <f7-segmented raised>
                <template v-for="(row, index) in document_types">
                    <f7-button @click="clickChangeDocumentType(row.id)" :class="[document_type_id === row.id ? 'button-active':'', 'color-'+theme.name_color_theme]"  :key="index">{{row.text}}</f7-button>
                </template>
            </f7-segmented>
        </template>
        <template v-else>
            <f7-button class="button-active">NO TIENE PERMISOS ASIGNADOS</f7-button>
        </template>
    </div>
</template>

<script>

    import {general_functions} from 'mixins_/general_functions'
    import {auth} from 'mixins_/auth'

    export default {
        props: {
            allDocumentTypes: {
                type: Array,
                required: false,
            },
        },
        name: 'DocumentType',
        mixins: [
            general_functions,
            auth
        ],
        data: function () {
            return {
                document_types: [],
                pos_document_types: [],
                document_type_id: null,
                configuration: {},
                theme: {}
            }
        },
        computed: {
        },
        async created() {
            await this.loadConfiguration()
            await this.getDocumentTypes()
            await this.setDefaultDocumentType()
            await this.getInitialSettings()
        },
        methods: {
            loadConfiguration()
            {
                this.configuration = this.getInitialConfiguration()
            },
            setDefaultDocumentType()
            {
                if(this.configuration.default_document_type)
                {
                    this.document_type_id = (_.some(this.document_types, {id : this.configuration.default_document_type})) ? this.configuration.default_document_type : this.setInitialDefaultDocumentType()
                }
                else
                {
                    this.setInitialDefaultDocumentType()
                }

                this.clickChangeDocumentType(this.document_type_id)

            },
            setInitialDefaultDocumentType()
            {
                const document_type = _.find(this.document_types, { id : '03'})
                this.document_type_id = document_type ? document_type.id : null
            },
            async getDocumentTypes()
            {
                if(!this.allDocumentTypes)
                {
                    this.showLoading()

                    await this.$http.get(`${this.returnBaseUrl()}/documents/table/document_types`, this.getHeaderConfig())
                                .then(response => {
                                    this.document_types = this.getDocumentTypesToButtons(response.data)
                                })
                                .then(() => {
                                    this.hideLoading()
                                })
                }
                else
                {
                    this.document_types = this.getDocumentTypesToButtons(this.allDocumentTypes)
                }

            },
            getPosDocumentTypes()
            {
                const generals = this.getStorage('generals', true)
                return generals ? generals.pos_document_types : []
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
            clickChangeDocumentType(document_type_id)
            {
                this.document_type_id = document_type_id
                this.$emit('changeDocumentType', document_type_id)
            },
            getInitialSettings() {
                this.theme = this.getThemeSettings()
            },
        }
    }
</script>
