import jsonwebtoken from 'jsonwebtoken'

export const signToken = ({ payload, privateOrSecretKey, options} : { payload: object | string | Buffer, privateOrSecretKey: jsonwebtoken.Secret, options: jsonwebtoken.SignOptions }): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jsonwebtoken.sign(payload, privateOrSecretKey, options , (err, token) => {
            if(err){
                reject(err)
            }
            resolve(token as string)
        })
    })
}


export const verifyToken = ({ token, publicOrSecretKey }: { token: string, publicOrSecretKey: jsonwebtoken.Secret }) => {
    return new Promise<string | object>((resolve, reject) => {
        jsonwebtoken.verify(token, publicOrSecretKey, (err, payload) => {
            if(err){
                reject(err)
            }
            resolve(payload as string | object)
        })
    })
}

