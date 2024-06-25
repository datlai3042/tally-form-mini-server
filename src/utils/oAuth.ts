import axios from 'axios'

export const getOAuthGoogleToken = async ({ code }: { code: string }) => {
      const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
            grant_type: 'authorization_code'
      }

      const url_origin = 'https://oauth2.googleapis.com/token'
      const options = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }

      const { data } = await axios.post(url_origin, body, options)
      console.log({ data })

      return data
}

export const getGoogleUser = async ({ id_token, access_token }: { id_token: string; access_token: string }) => {
      const url_origin = 'https://www.googleapis.com/oauth2/v1/userinfo'
      const options = {
            params: {
                  access_token,
                  alt: 'json'
            },
            headers: {
                  Authorization: `Bearer ${id_token}`
            }
      }

      const { data } = await axios.get(url_origin, options)
      console.log({ data })

      return data
}
