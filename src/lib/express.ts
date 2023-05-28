import http from 'http'
import url from 'url'
import qs from 'querystring'
import path from 'path'
import fs from 'fs'
import { DELETE, POST, PUT } from './methods'
import { paramsParser } from '../helpers/paramsParser'
import { ContentExtnames, ContentTypes, MethodTypes } from '../types'
let handlers:any = {}
let globalVariables:any = {}

function Server (req:any, res:any) {
    
	let queryString = qs.parse(url.parse(req.url).query || '')
	let requestUrl = url.parse(req.url).pathname!.toLowerCase()
	let method = req.method!.toUpperCase()
    console.log(method);
    
	req.query = queryString || {}

    let {params, reqUrl} = paramsParser(handlers, requestUrl)
    console.log(params, reqUrl);
    
    requestUrl = reqUrl
    req.params = params

	res.json = function (data: object) {
        if(typeof data !== 'object') throw TypeError('The parameter being included in the response is not in object')
		res.setHeader('Content-Type', ContentTypes.json)
		return res.end(JSON.stringify(data))
	}

    res.send = function (data:any) {
        if(typeof data === 'object'){
            res.setHeader('Content-Type', ContentTypes.json)
            return res.end(JSON.stringify(data))
        } else if (typeof data === 'string' || typeof data === 'number'){
            res.setHeader('Content-Type', ContentTypes.textHtml)
            return res.end(data)
        }
	}
    
	res.sendFile = function (pathname:string) {
        const extname = path.extname(pathname)
        const contentType = ContentExtnames[extname] || 'application/octet-stream'
        const pathExists = fs.existsSync(path.join(globalVariables['static'] || '', pathname))

        if(!extname || !pathExists) return res.end(`Cannot ${method} ${pathname}`)

		res.writeHead(200, { 'Content-Type': contentType })
		return res.end(
			fs.readFileSync(path.join(globalVariables['static'], pathname))
		)
	}

    res.status = function (status:number) {
		res.statusCode = status
        return res
	}

	if(handlers[requestUrl]) {
		if(handlers[requestUrl][MethodTypes.use]){
        	return handlers[requestUrl][MethodTypes.use](req, res)
        }
		else if(method === MethodTypes.post) {
			POST(req, (newReq:any)=> {
                return handlers[requestUrl][method](newReq, res)
            })
		} else if (method === MethodTypes.put && handlers[requestUrl]){
            PUT(req,  (newReq:any)=> {
                return handlers[requestUrl][method](newReq, res)
            })
        } else if (method === MethodTypes.delete && handlers[requestUrl]){
            DELETE(req, (newReq:any)=> {
                return handlers[requestUrl][method](newReq, res)
            })
        } else if (method === MethodTypes.get && handlers[requestUrl][method]){
            return handlers[requestUrl][method](req, res)
		}

	} else {
		return res.end(`Cannot ${method} ${requestUrl}`)
	}
}

class express  {
	public server = http.createServer(Server)

    public use = function (path:string, callbackHandler:Function) {
        handlers[path.toLowerCase()] = handlers[path.toLowerCase()] || {}
        handlers[path.toLowerCase()][MethodTypes.use] = callbackHandler
    }

    public set(key:string, value: string) {
		globalVariables[key] = value
	}
    
    public get = function (path:string, callbackHandler:Function) {
		handlers[path.toLowerCase()] = handlers[path.toLowerCase()] || {}
		handlers[path.toLowerCase()][MethodTypes.get] = callbackHandler
	}

	public post = function (path:string, callbackHandler:Function) {
		handlers[path.toLowerCase()] = handlers[path.toLowerCase()] || {}
		handlers[path.toLowerCase()][MethodTypes.post] = callbackHandler
	}

	public put = function (path:string, callbackHandler:Function) {
		handlers[path.toLowerCase()] = handlers[path.toLowerCase()] || {}
		handlers[path.toLowerCase()][MethodTypes.put] = callbackHandler
	}

	public delete = function (path:string, callbackHandler:Function) {
		handlers[path.toLowerCase()] = handlers[path.toLowerCase()] || {}
		handlers[path.toLowerCase()][MethodTypes.delete] = callbackHandler
	}


	public listen = (PORT:number, callback:VoidFunction) => {
		this.server.listen(PORT, undefined, undefined, callback)
	}
}

export default express
