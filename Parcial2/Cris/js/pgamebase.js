// ============= 4 ETAPAS ===================
// 1) Variables y funciones comunes a todas las clases
// 2) Las clases que componen a nuestro videojuego (lógica del juego)
let score = 0; // Variable para llevar el puntaje
class MainScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    preload() {
        // Multimedia
        this.load.baseURL = './';
        this.load.image('fondo1', './img/background1.png');
        this.load.image('prota', './img/prota/Idle__000.png');
        for (let i = 0; i <= 9; i++) {
            const key = `reposo${i}`;
            const path = `./img/prota/Idle__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `mov${i}`;
            const path = `./img/prota/Run__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 8; i++) {
            const key = `jum${i}`;
            const path = `./img/prota/Jump__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 6; i++) {
            const key = `orb${i}`;
            const path = `./img/blueorb/frame__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        this.load.image('sensei', './img/sensei/samurai1.png');
        this.load.image('sensei2', './img/sensei/samurai2.png');
        this.load.image('sensei3', './img/sensei/samurai3.png');
        this.load.image('pisolv1', './img/stonefloor.png');
    }

    create() {


        // Añadir el fondo
        this.add.image(640, 360, 'fondo1').setScale(0.5);

        // Crear el sensei primero para que aparezca en el fondo
        this.senseiGroup = this.physics.add.staticGroup();
        this.sensei = this.senseiGroup.create(260, 560, 'sensei').setScale(0.5);
        this.sensei.refreshBody();

        // Crear el personaje después para que quede en frente
        this.character = this.physics.add.sprite(80, 490, 'prota').setScale(0.25);



        // Crear el piso
        var piso = this.physics.add.staticGroup();
        for (let x = 50; x <= 1250; x += 100) {
            let pisoObjeto = piso.create(x, 710, 'pisolv1').setScale(0.2);
            pisoObjeto.refreshBody(); // Ajusta la hitbox al tamaño escalado
        }

        this.orb = this.physics.add.group({
            key: 'orb1',
            repeat: 9,
            setXY: { x: 160, y: 600, stepX: 120 },

        });



        this.physics.add.collider(this.orb, piso);

        // Colisiones entre el personaje y el piso
        this.physics.add.collider(this.character, piso);

        // Agregar gravedad al personaje
        this.character.body.setGravityY(100);
        this.character.setCollideWorldBounds(true);

        // Inicializar los controles
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.character, this.orb, collectStar, null, this);

        // Función para manejar la recolección de estrellas
        function collectStar(player, star) {
            score += 10;
            colliderStar(star); // Llamamos a la función que desactiva la estrella
            console.log("P1 Score: " + score);
        }

        // Función para desactivar las estrellas recolectadas
        function colliderStar(star) {
            // Desactiva el sprite visualmente
            star.setVisible(false); // Opcional, si el sprite sigue visible

            // Eliminar el cuerpo físico
            if (star.body) {
                star.body.destroy();
            }
        }

        // Crear animaciones
        this.anims.create({
            key: 'turn',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `reposo${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'run',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `mov${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'jump',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `jum${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'orbSpeen',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `orb${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 10,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        // Asegúrate de que cada orbe reproduzca la animación cuando se crea
        this.orb.children.iterate(function (orb) {
            orb.setScale(0.1);  // Cambia el tamaño del orbe
            orb.anims.play('orbSpeen', true); // Reproduce la animación
        }, this);

        this.anims.create({
            key: 'sensei_anim',
            frames: [
                { key: 'sensei' },
                { key: 'sensei2' },
                { key: 'sensei3' }
            ],
            frameRate: 5, // Cambia la velocidad de la animación
            repeat: -1 // Repetir indefinidamente
        });


    }

    update() {
        // Lógica de movimiento
        this.character.body.setVelocityX(0);  // Detener el movimiento horizontal

        // Verificar si el personaje está tocando el suelo y presionando la tecla de salto
        if (this.cursors.up.isDown && this.character.body.touching.down) {
            this.character.body.setVelocityY(-430); // Realiza el salto
            this.character.anims.play('jump', true); // Reproducir animación de salto
        } else if (this.cursors.up.isDown) {
            this.character.anims.play('jump', true); // Reproducir animación de salto
        }

        // Movimiento combinado con salto (derecha)
        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            this.character.body.setVelocityX(260); // Mover a la derecha mientras saltas
            this.character.flipX = false; // Mantener la dirección original
            this.character.anims.play('jump', true); // Animación de salto
        } // Movimiento combinado con salto (izquierda)
        else if (this.cursors.left.isDown && this.cursors.up.isDown) {
            this.character.body.setVelocityX(-260); // Mover a la izquierda mientras saltas
            this.character.flipX = true; // Invertir la dirección del personaje
            this.character.anims.play('jump', true); // Animación de salto
        } // Movimiento a la izquierda (caminar)
        else if (this.cursors.left.isDown) {
            this.character.body.setVelocityX(-260);   // Mover a la izquierda
            this.character.flipX = true;               // Invertir la dirección del personaje
            this.character.anims.play('run', true);    // Reproducir la animación de caminar
        } // Movimiento a la derecha (caminar)
        else if (this.cursors.right.isDown) {
            this.character.body.setVelocityX(260);    // Mover a la derecha
            this.character.flipX = false;              // Mantener la dirección original
            this.character.anims.play('run', true);    // Reproducir la animación de caminar
        }

        // Si no se mueve, poner al personaje en reposo
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.character.body.touching.down) {
            this.character.anims.play('turn', true);  // Reproducir animación de reposo
        }
        // Verificar si se recolectaron todas las estrellas
        if (score == 100) {
            this.scene.start('nextLevelScene'); // Cambiar a la siguiente escena (nivel)
        }
    }

}


class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}

class Level extends Phaser.Scene {
    constructor() {
        super('levelScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}

class Mode extends Phaser.Scene {
    constructor() {
        super('modeScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}

class Controls extends Phaser.Scene {
    constructor() {
        super('controlsScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}

class EndGame extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}


// 3) Configuración base del videojuego
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    // Array que indica el orden de visualización del vj
    scene: [MainScene, Menu, Level, Mode, Controls, EndGame],
    scale: {
        mode: Phaser.Scale.FIT
    }, physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 300,

            },
        },
    },
}
// 4) Inicialización de Phaser
new Phaser.Game(config);

