const { io } = require('../models/server');

// servidor del chat dentro del juego 
const chatServer = io.of("/chat");
chatServer.on('connection', async socket => {
    //console.log('Cliente conectado', socket.id);

    socket.userData = {
        name: "",
    };

    socket.on("disconnect", () => {
        console.log(`${socket.id} desconectado`);
    });

    // evento para cargar el nombre del usuario en el servidor
    socket.on("setName", (name) => {
        socket.userData.name = name;
    });

    // evento para enviar el mensaje a todos los usuarios conectados
    socket.on("send-message", (message, time) => {
        socket.broadcast.emit(
            "recieved-message",
            socket.userData.name,
            message,
            time
        );
    });
})

// servidor del juego

let jugadoresConectados = new Map();


const gameServer = io.of("/game");
gameServer.on('connection', async socket => {

    socket.userData = {
        position: { x: 0, y: 0.02, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 0 },
        animation: "idle",
        name: "",
        avatarSkin: "personaje.fbx",
    };

    jugadoresConectados.set(socket.id, socket);

//    console.log('Jugador conectado', socket.id);

    socket.on("setID", () => {
        gameServer.emit("setID", socket.id);
    });

    socket.on("setName", (name) => {
        console.log(name);
        socket.userData.name = name;
    });

    // falta implementar
    // socket.on("setAvatar", (avatarSkin) => {
    //     console.log("setting avatar " + avatarSkin);
    //     gameServer.emit("setAvatarSkin", avatarSkin, socket.id);
    // });

    socket.on("disconnect", () => {
        console.log(`Jugador ${socket.id} desconectado`);
        jugadoresConectados.delete(socket.id);
        gameServer.emit("removePlayer", socket.id);
    });


    socket.on("initPlayer", (player) => {
        // console.log(player);
    });

    // escucha los eventos que emite el jugador
    socket.on("updatePlayer", (player) => {
        socket.userData.position.x = player.position.x;
        socket.userData.position.y = player.position.y;
        socket.userData.position.z = player.position.z;
        socket.userData.quaternion.x = player.quaternion._x;
        socket.userData.quaternion.y = player.quaternion._y;
        socket.userData.quaternion.z = player.quaternion._z;
        socket.userData.quaternion.w = player.quaternion._w;
        socket.userData.animation = player.animation;
        socket.userData.avatarSkin = player.avatarSkin;
    });


    setInterval(() => {
        const playerData = [];
        for (const socket of jugadoresConectados.values()) {
            // pregunta si el usuario tiene un nombre y un avatar, quiere decir que ya está creado
            if (socket.userData.name !== "" && socket.userData.avatarSkin !== "") {
                playerData.push({
                    id: socket.id,
                    name: socket.userData.name,
                    position_x: socket.userData.position.x,
                    position_y: socket.userData.position.y,
                    position_z: socket.userData.position.z,
                    quaternion_x: socket.userData.quaternion.x,
                    quaternion_y: socket.userData.quaternion.y,
                    quaternion_z: socket.userData.quaternion.z,
                    quaternion_w: socket.userData.quaternion.w,
                    animation: socket.userData.animation,
                    avatarSkin: socket.userData.avatarSkin,
                });
            }
        }
        if (socket.userData.name === "" || socket.userData.avatarSkin === "") {
            return;
        } else {
            // emite a todos los jugadores el movimiento de todos los jugador
            gameServer.emit("playerData", playerData);
        }
    }, 20);

})