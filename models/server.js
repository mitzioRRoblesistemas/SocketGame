const express = require('express')
const cors = require('cors')
///const SocketController = require('../socket/controller')


class server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT

/*         this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server,{
            cors:{
                origen:'*',
                allowedHeaders:['cdmDesarrollo-token'],
                credentials:true
            }
        });
 */
        this.middlwares()
        this.routes()
        //this.socket()
    }
    middlwares(){
        this.app.use(cors())
        this.app.use(express.json())
    }
    
    routes(){
        
    }

    /* socket()  {
        this.io.use;

        this.io.on ('connection', (socket)  =>  SocketController(socket, this.io))
    } */

    listen(){
        const serverChat = require('http').createServer( this.app);
        module.exports.io = require('socket.io')(serverChat,{
            cors:{
                origen:'*',
                allowedHeaders:['cdmDesarrollo-token'],
                credentials:true
            }

        })
        //console.log(io)
        require('../socket/controller');


        serverChat.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
    }
}
module.exports = server