export const paramsParser = (handlers:object, requestUrl:string) => {
    let params:any = {}
    let request_url:any
    Object.keys(handlers).map( path => {
        let query = requestUrl.split('/')
        let condition = path.split('/')
        condition.filter( (el, i) => {
            if(/:/g.test(el)) {
                params[el.replace(":", "")] = query[i] || ''
                request_url = path
            }  
        } )
    })
    return {params, reqUrl:requestUrl.split('/').length === request_url.split('/').length ? request_url : requestUrl }
}