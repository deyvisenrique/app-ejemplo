export const functions_theme_premiun = {

    data: function () {
        return {
            external_functions_theme_premium: null
        }
    },
    methods: {
        setThemePremiun()
        {
            this.general_theme.theme_color = this.external_functions_theme_premium.getThemePremiun()
        },
        getValuesThemePremiun()
        {
            return this.external_functions_theme_premium.getDataThemePremiun()
        },
        setValuesThemePremiun()
        {
            const values = this.getValuesThemePremiun()

            this.general_theme.css_color_fill = values.css_color_fill
            this.general_theme.class_menu_text_color = values.class_menu_text_color
            this.general_theme.class_header_text_color = values.class_header_text_color
            this.general_theme.class_text_color = values.class_text_color
            this.general_theme.css_color_fill_dark = values.css_color_fill_dark
            this.general_theme.class_bg_header = values.class_bg_header
            this.general_theme.class_bg_body = values.class_bg_body
            this.general_theme.class_waves_color_fill = values.class_waves_color_fill
            this.general_theme.class_box_color = values.class_box_color
            this.general_theme.class_box_color_shade = values.class_box_color_shade
            this.general_theme.class_box_color_tint = values.class_box_color_tint
            this.general_theme.name_color_theme = values.name_color_theme
            this.general_theme.class_button_color = values.class_button_color
        },
        existThemePremiun()
        {
            try
            {
                this.external_functions_theme_premium = require(`assets/premium_assets/theme_premium.js`)

                return {
                    success: true,
                    data: this.external_functions_theme_premium
                }
            }
            catch(error)
            {
                return this.generalResponse(false, 'No existe el tema')
            }

        },
        allowedThemePremiun(exist_theme_premiun)
        {
            return exist_theme_premiun.success && !_.isEmpty(exist_theme_premiun.data)
        },
    }
}
