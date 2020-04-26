import { PasswordServiceInterface } from '../interfaces/password.service.interface'
export const AuthService = 3

// interface Credentials {
//   username: string,
//   password: string,
// }

// function getCredentialsFromAuthHeader(authorizationHeader: string): Credentials | null {
//   if (!authorizationHeader) return null
//   const [ authType, authValue ] = authorizationHeader.split(' ')
//   if (authType !== 'Basic') return null
//   const [ username, password ] = Buffer.from(authValue, 'base64').toString().split(':')
//   return {username, password}
// }

// interface AuthServiceConfig {
//   jwtSecret: string,
// }

// export class AuthService {
//   constructor(
//     private readonly passwordSwc: PasswordServiceInterface,
//     private readonly config: any
//   ) {
//     this.getTokenPayloadByUsrPsw = getTokenPayload
//     this.responseFieldName = responseFieldName
//     this.jwtSecret = jwtSecret
//     this.jwtOptions = jwtOptions
//     this.cookieFieldName = cookieFieldName
//   }


//     this.getTokenPayloadByUsrPsw = getTokenPayload
//     this.responseFieldName = responseFieldName
//     this.jwtSecret = jwtSecret
//     this.jwtOptions = jwtOptions
//     this.cookieFieldName = cookieFieldName

//     this.verifyCookieTokenMiddleware = (request, response, next) => {
//       const token = request.cookies[this.cookieFieldName]
//       if (!token) return next()
//       try {
//         const verifiedToken = jwt.verify(token, this.jwtSecret, this.jwtOptions)
//         this._setTokenField(request, response, verifiedToken)
//       } catch (e) {
//         console.log('Ignored error while parsing auth token')
//       }
//       next()
//     }
//     this.getTokenHandler = asyncHandler(async (request, response) => {
//       const usrPsw = getUsrPswFromAuthHeader(request.headers.authorization)
//       const payload = await this.getTokenPayloadByUsrPsw(usrPsw)
//       const token = jwt.sign({payload}, this.jwtSecret, this.jwtOptions)
//       response.cookie(this.cookieFieldName, token, {httpOnly: true})
//       response.json({token})
//     })
// }
