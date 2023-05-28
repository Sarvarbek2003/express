import express from './lib/express'
import path from 'path'

const PORT = process.env.PORT || 4000
const app = new express()

app.set('static', path.join(process.cwd(), 'files'))

app.use('/', (req:any, res:any) => {
    res.sendFile('express.png')
})

app.get('/path', (req:any, res:any)=>{
    let params = req.params
    let query = req.query
    console.log('get => params: ', params);
    console.log('get => query: ', query);
    // res.send('salom')
    // res.sendFile('static.json')
    
    res.status(200).json({'status':200, "message":"OK"})
})

app.get('/path/:id', (req:any, res:any)=>{
    let params = req.params
    let query = req.query
    console.log('get => params: ', params);
    console.log('get => query: ', query);
    res.send('salom')
    // res.status(200).json({'status':200, "message":"OK"})
})

app.post('/path', (req:any, res:any)=>{
    let params = req.params
    let query = req.query
    let body = req.body
    console.log('post => params: ', params);
    console.log('post => query: ', query);
    console.log('post => body: ', body);
    res.send('salom')
    res.status(200).json({'status':200, "message":"OK"})
})

app.put('/path/:id', (req:any, res:any)=>{
    let params = req.params
    let query = req.query
    let body = req.body
    console.log('put => params: ', params);
    console.log('put => query: ', query);
    console.log('put => body: ', body);
    // res.send('salom')
    res.status(200).json({'status':200, "message":"OK"})
})

app.delete('/path/:id', (req:any, res:any)=>{
    let params = req.params
    let query = req.query
    console.log('delete => params: ', params);
    console.log('delete => query: ', query);
    // res.send('salom')
    res.status(200).json({'status':200, "message":"OK"})
})



app.listen(Number(PORT),  () => console.log(`Server is running on http://localhost:${PORT}`))