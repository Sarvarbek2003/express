export const PUT = (req:any, callback:Function) => {
    let body:string = ''
    req.on('data', (buffer: string) => body += buffer )
    req.on('end', () => {
        req.body = JSON.parse(body || "{}")
        callback(req)
    })
}