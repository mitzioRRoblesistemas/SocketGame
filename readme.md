# Servidor Socket

### Este es el servidor Socket intermediaron entre el servidor principal de API Rest y las diferentes aplicaciones, por ejemplo: Desarrollo de aplicacion en Flutter.

## Funcionamiento: 

Al iniciar el servidor se pone a escuchar las conexiones al mismo. Cuando entra una conexion el analiza si la mismo en el apartado auth (socket.handshake.auth.token) envia un token para su autorizacion, asi poder realizar una conexion segura con el servidor. 
Si obtiene un token, se analiza el mismo haciendo un POST al servidor de API Rest para validar el estado del mismo URL del POST: https://desarrollo.api.cdmisiones.net.ar/auth/validaToken.
Si el servidor devuelve que está todo bien le deja conectarse al cliente al servidor Socket.
