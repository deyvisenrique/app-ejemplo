<template>
    <div>
        <f7-block-title>Notificaciones</f7-block-title>
        <f7-list v-if="notifications.documents_not_sent > 0 || notifications.documents_regularize_shipping > 0">
            <template v-show="notifications.documents_not_sent > 0"">
                <f7-list-item title="Comprobantes pendiente de envío">
                    <template #title>
                        <span class="badge color-red">{{ notifications.documents_not_sent }}</span>
                    </template>
                </f7-list-item>
            </template>
            <template v-show="notifications.documents_regularize_shipping > 0"">
                <f7-list-item title="Comprobantes pendientes de rectificación">
                    <template #title>
                        <span class="badge color-red">{{ notifications.documents_regularize_shipping }}</span>
                    </template>
                </f7-list-item>
            </template>
        </f7-list>
    </div>
</template>

<script>
export default {
    props: ['theme', 'notifications'],
}
</script>