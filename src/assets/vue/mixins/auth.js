export const auth = {
  methods: {
    getHeaderConfig() {
      let token = localStorage.api_token;
      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      return axiosConfig;
    },

    returnBaseUrl() {
      return localStorage.api_url ?  localStorage.api_url  + '/api' : 'https://demo.facturador.pro/api'
    },

    returnUrLogo()
    {
      return localStorage.url_logo ? localStorage.url_logo : null
    },

    getHttpHeadersDownload(response_type = 'blob')
    {
        return {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.api_token}`
            },
            responseType: response_type
        }
    },

  }
}
