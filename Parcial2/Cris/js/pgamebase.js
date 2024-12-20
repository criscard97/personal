// ============= 4 ETAPAS ===================
// 1) Variables y funciones comunes a todas las clases
// 2) Las clases que componen a nuestro videojuego (lógica del juego)
let isDead = false;
let jugadores = 2;
let score = 0; // Variable para llevar el puntaje
class Nivel1 extends Phaser.Scene /*NIVEL 1*/ {
    constructor()/*NIVEL 1*/ {
        super('gameScene');
    }

    preload()/*NIVEL 1*/ {
        // Multimedia
        this.load.baseURL = './';
        this.load.audio('music_level1', './audios/3-NinjaGaiden_Nivel1.mp3');
        this.load.audio('jump', './audios/7-Jump.mp3');
        this.load.audio('orb_sound', './audios/9-orbsound.mp3');
        this.load.image('fondo1', './img/background1.png');
        this.load.image('mensaje', './img/extras/message-square.png');
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
        for (let i = 1; i <= 8; i++) {
            const key = `jum${i}`;
            const path = `./img/prota/Jump__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 6; i++) {
            const key = `orb${i}`;
            const path = `./img/blueorb/frame__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }

        //Seccion Jugador 2
        for (let i = 1; i <= 10; i++) {
            const key = `player2-${i}`; // Cambié p2_ por Idle
            const path = `./img/prota2/Idle${i}.png`; // Cambié el nombre de la imagen a Idle{n}
            this.load.image(key, path);
        }
        for (let i = 1; i <=8; i++) {
            const key = `p2run${i}`; // Cambié p2_ por Idle
            const path = `./img/prota2/Run${i}.png`; // Cambié el nombre de la imagen a Idle{n}
            this.load.image(key, path);
        }
        //Fin Jugador 2
        this.load.image('sensei1', './img/sensei/samurai1.png');
        this.load.image('sensei2', './img/sensei/samurai2.png');
        this.load.image('sensei3', './img/sensei/samurai3.png');
        this.load.image('pisolv1', './img/stonefloor.png');
    }

    create()/*NIVEL 1*/ {

        console.log("Jugadores: " + jugadores);
        // Añadir el fondo
        this.musicalv1 = this.sound.add('music_level1', { loop: true });
        this.time.addEvent({
            delay: 500, // Esperar 500ms
            callback: () => {
                this.musicalv1.play({ volume: 0.3 });
            },
            loop: false // Solo se ejecuta una vez
        });
        this.jumpsound = this.sound.add('jump', { loop: false });
        this.orbsound = this.sound.add('orb_sound', { loop: false });
        this.add.image(640, 360, 'fondo1').setScale(0.5);
        let mensaje = this.add.image(340, 460, 'mensaje').setScale(0.04);
        mensaje.setVisible(false);
        this.time.addEvent({
            delay: 1500, // Esperar 500ms
            callback: () => {
                mensaje.setVisible(true);
            },
            loop: false // Solo se ejecuta una vez
        });
        //        this.add.image(340, 460, 'mensaje').setScale(0.04);

        // Crear el sensei primero para que aparezca en el fondo
        this.senseiGroup = this.physics.add.staticGroup();
        this.sensei = this.senseiGroup.create(260, 560, 'sensei1').setScale(0.5);
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
        this.teclasJugador2 = this.input.keyboard.addKeys({
            'arriba': Phaser.Input.Keyboard.KeyCodes.W,
            'izquierda': Phaser.Input.Keyboard.KeyCodes.A,
            'derecha': Phaser.Input.Keyboard.KeyCodes.D
        });

        this.physics.add.overlap(this.character, this.orb, collectOrb, null, this);

        if (jugadores == 2) {
            this.character2 = this.physics.add.sprite(80, 490, 'player2-1').setScale(0.26);
            // this.character2.setSize(250,500);
            // this.character2.setOffset(200,30);
            this.physics.add.collider(this.orb, piso);

            // Colisiones entre el personaje y el piso
            this.physics.add.collider(this.character2, piso);

            // Agregar gravedad al personaje
            this.character2.body.setGravityY(100);
            this.character2.setCollideWorldBounds(true);


            this.physics.add.overlap(this.character2, this.orb, collectOrb, null, this);

        }

        // Función para manejar la recolección de estrellas
        function collectOrb(player, orb) {
            score += 10;
            this.orbsound.play({ volume: 0.3 });
            colliderOrb(orb); // Llamamos a la función que desactiva la estrella
            console.log("P1 Score: " + score);
        }

        // Función para desactivar las estrellas recolectadas
        function colliderOrb(orb) {
            // Desactiva el sprite visualmente
            orb.setVisible(false); // Opcional, si el sprite sigue visible

            // Eliminar el cuerpo físico
            if (orb.body) {
                orb.body.destroy();
            }
        }


        // Crear animaciones personaje 2
        this.anims.create({
            key: 'turn2',
            frames: Array.from({ length: 10 }, (_, i) => ({ key: `player2-${i+1}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'run2',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `p2run${i+1}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });


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
            frames: Array.from({ length: 8 }, (_, i) => ({ key: `jum${i + 1}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'orbSpeen',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `orb${i + 1}` })), // Los frames de reposo0 a reposo9
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

        this.anims.create({
            key: 'sensei',
            frames: Array.from({ length: 3 }, (_, i) => ({ key: `sensei${i + 1}` })), // Los frames de reposo0 a reposo9
            frameRate: 3,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.sensei.anims.play('sensei', true);

    }

    update() {
        // Detener el movimiento horizontal de ambos jugadores
        this.character.body.setVelocityX(0);  
        this.character2.body.setVelocityX(0);  
    
        // Lógica de movimiento y animaciones para el jugador 2 (si hay 2 jugadores)
        if (jugadores == 2) {
            // Movimiento y animaciones del jugador 2
            if (this.teclasJugador2.arriba.isDown && this.character2.body.touching.down) {
                this.character2.body.setVelocityY(-430); // Salto del jugador 2
                this.character2.anims.play('jump2', true); // Animación de salto del jugador 2
            } else if (this.teclasJugador2.izquierda.isDown) {
                this.character2.body.setVelocityX(-260);  // Mover a la izquierda
                this.character2.flipX = true;             // Invertir dirección del jugador 2
                this.character2.anims.play('run2', true); // Animación de correr hacia la izquierda
            } else if (this.teclasJugador2.derecha.isDown) {
                this.character2.body.setVelocityX(260);   // Mover a la derecha
                this.character2.flipX = false;            // Mantener dirección original
                this.character2.anims.play('run2', true); // Animación de correr hacia la derecha
            } else {
                if (this.character2.body.touching.down) {
                    this.character2.anims.play('turn2', true);  // Animación de reposo para el jugador 2
                } else {
                    this.character2.anims.play('jump2', true); // Animación de caída para el jugador 2
                }
            }
        }
    
        // Lógica de movimiento y animaciones para el jugador 1
        if (this.cursors.up.isDown && this.character.body.touching.down) {
            this.jumpsound.play({ volume: 0.5 });
            this.character.body.setVelocityY(-430);  // Salto del jugador 1
            this.character.anims.play('jump', true); // Animación de salto del jugador 1
        } else if (this.cursors.up.isDown && !this.character.body.touching.down) {
            this.character.anims.play('jump', true); // Animación de salto en el aire del jugador 1
        }
    
        // Movimiento combinado con salto (derecha) para el jugador 1
        if (this.cursors.right.isDown && this.cursors.up.isDown) {
            this.character.body.setVelocityX(260);  // Mover a la derecha mientras saltas
            this.character.flipX = false;           // Mantener dirección original
            this.character.anims.play('jump', true); // Animación de salto para el jugador 1
        }
        // Movimiento combinado con salto (izquierda) para el jugador 1
        else if (this.cursors.left.isDown && this.cursors.up.isDown) {
            this.character.body.setVelocityX(-260);  // Mover a la izquierda mientras saltas
            this.character.flipX = true;              // Invertir la dirección del jugador 1
            this.character.anims.play('jump', true);  // Animación de salto para el jugador 1
        }
    
        // Movimiento a la izquierda (caminar) para el jugador 1
        else if (this.cursors.left.isDown) {
            this.character.body.setVelocityX(-260);   // Mover a la izquierda
            this.character.flipX = true;               // Invertir la dirección del jugador 1
            this.character.anims.play('run', true);    // Animación de caminar para el jugador 1
        }
    
        // Movimiento a la derecha (caminar) para el jugador 1
        else if (this.cursors.right.isDown) {
            this.character.body.setVelocityX(260);    // Mover a la derecha
            this.character.flipX = false;              // Mantener la dirección original
            this.character.anims.play('run', true);    // Animación de caminar para el jugador 1
        } else {
            if (this.character.body.touching.down) {
                this.character.anims.play('turn', true);  // Animación de reposo para el jugador 1
            } else {
                this.character.anims.play('jump', true);  // Animación de caída para el jugador 1
            }
        }
    
        // Verificar si se recolectaron todas las estrellas
        if (score == 100) {
            this.musicalv1.stop();
            this.scene.start('nextLevelScene'); // Cambiar a la siguiente escena (nivel)
        }
    }
    
    
    

}


class Nivel2 extends Phaser.Scene/*NIVEL 2*/ {
    constructor() {
        super('nextLevelScene');
    }

    preload()/*NIVEL 2*/ {
        // Multimedia
        this.load.baseURL = './';
        this.load.image('fondo', './img/background2.jpg');

        this.load.audio('music_level2', './audios/4-NinjaGaiden_Nivel2.mp3');
        this.load.audio('jump', './audios/7-Jump.mp3');
        this.load.audio('dead', './audios/6-DeadSound.mp3');
        this.load.audio('hurtsound', './audios/5-BeingHurt.mp3');
        this.load.audio('orb_sound', './audios/9-orbsound.mp3');

        this.load.image('platform', './img/platform.png');
        this.load.image('prota', './img/prota/Idle__000.png');
        for (let i = 0; i <= 9; i++) {
            const key = `ataque${i}`;
            const path = `./img/prota/Attack__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
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
        for (let i = 1; i <= 8; i++) {
            const key = `jum${i}`;
            const path = `./img/prota/Jump__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 6; i++) {
            const key = `orb${i}`;
            const path = `./img/blueorb/frame__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `dead${i}`;
            const path = `./img/prota/Dead__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        this.load.image('enemy', './img/enemies/demon-mask.png');
        this.load.image('sensei2', './img/sensei/samurai2.png');
        this.load.image('sensei3', './img/sensei/samurai3.png');
        this.load.image('pisolv2', './img/stonefloor.png');
    }

    create()/*NIVEL 2*/ {

        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        // Añadir el fondo
        this.hurtsound = this.sound.add('hurtsound', { loop: false });
        this.jumpsound = this.sound.add('jump', { loop: false });
        this.deadsound = this.sound.add('dead', { loop: false });
        this.musicalv2 = this.sound.add('music_level2', { loop: true });
        this.musicalv2.play({ volume: 0.1 });
        this.orbsound = this.sound.add('orb_sound', { loop: false });
        this.add.image(640, 360, 'fondo');

        this.contadorOrbeslv2 = 0;
        this.character = this.physics.add.sprite(80, 490, 'prota').setScale(0.22);
        // Ajuste de la colisión (antes de la animación)
        this.character.body.setSize(300, 500);  // Tamaño adecuado del cuadro de colisión
        this.character.body.setOffset(0, 0);  // Alinea el cuadro de colisión con el sprite
        // Inicializar los controles
        this.cursors = this.input.keyboard.createCursorKeys();


        // Crear el piso
        let piso = this.physics.add.staticGroup();
        for (let x = 50; x <= 1250; x += 100) {
            let pisoObjeto = piso.create(x, 710, 'pisolv2').setScale(0.2);
            pisoObjeto.refreshBody(); // Ajusta la hitbox al tamaño escalado
        }

        // Colisiones entre el personaje y el piso
        this.physics.add.collider(this.character, piso);

        // Agregar gravedad al personaje
        this.character.body.setGravityY(125);
        this.character.setCollideWorldBounds(true);

        let plataforma = new Array();
        plataforma[0] = piso.create(200, 300, 'platform').setScale(0.8);  // Crear plataforma 1
        plataforma[1] = piso.create(600, 500, 'platform').setScale(0.8);  // Crear plataforma 2
        plataforma[2] = piso.create(900, 300, 'platform').setScale(0.8);  // Crear plataforma 3

        // Ajuste del cuadro de colisión para cada plataforma
        for (let index = 0; index < plataforma.length; index++) {
            // Ajustar el tamaño del cuadro de colisión
            // Asegúrate de que la altura sea más pequeña y la misma que el sprite visual
            let width = plataforma[index].width;  // Usamos el ancho del sprite
            let height = 10; // Ajusta la altura de la colisión (puedes cambiarlo si es necesario)

            plataforma[index].body.setSize(240, 20);  // Cambia el tamaño de la colisión

            // Ajustar la posición del cuadro de colisión
            // Si el cuadro de colisión está demasiado abajo, ajustamos el offset para moverlo hacia arriba
            let offsetY = -5;  // Ajuste del desplazamiento hacia arriba (ajusta según sea necesario)

            plataforma[index].body.setOffset(40, 20);  // Ajustar el desplazamiento en Y

            // Finalmente, actualizamos el cuerpo físico para reflejar los cambios

        }

        let enemigoGrupo = this.physics.add.group();
        let enemigo = [];
        enemigo[0] = enemigoGrupo.create(600, 300, 'enemy');
        enemigo[1] = enemigoGrupo.create(900, 200, 'enemy');
        enemigo[2] = enemigoGrupo.create(200, 200, 'enemy');

        this.physics.add.collider(enemigoGrupo, piso);
        enemigo[0].setBounce(1);
        enemigo[0].setGravityY(100);
        enemigo[0].setCollideWorldBounds(true);
        enemigo[1].setBounce(1);
        enemigo[1].setGravityY(10);
        enemigo[1].setCollideWorldBounds(true);
        enemigo[2].setBounce(1);
        enemigo[2].setGravityY(10);
        enemigo[2].setCollideWorldBounds(true);

        this.orb = this.physics.add.group({
            key: 'orb1',
            repeat: 9,
            setXY: { x: 160, y: 100, stepX: 120 },

        });

        this.physics.add.collider(this.orb, piso);

        this.physics.add.overlap(this.character, this.orb, collectOrb, null, this);

        // Función para manejar la recolección de estrellas
        function collectOrb(player, orb) {
            this.contadorOrbeslv2++;
            score += 25;
            this.orbsound.play({ volume: 0.3 });
            colliderOrb(orb); // Llamamos a la función que desactiva la estrella
            console.log("P1 Score: " + score);
        }

        // Función para desactivar las estrellas recolectadas
        function colliderOrb(orb) {
            // Desactiva el sprite visualmente
            orb.setVisible(false); // Opcional, si el sprite sigue visible

            // Eliminar el cuerpo físico
            if (orb.body) {
                orb.body.destroy();
            }
        }


        this.physics.add.overlap(this.character, enemigo[0], makeDamage, null, this);
        this.physics.add.overlap(this.character, enemigo[1], makeDamage2, null, this);
        this.physics.add.overlap(this.character, enemigo[2], makeDamage3, null, this);
        //this.physics.add.overlap(this.character, enemigo[1], makeDamage, null, this);

        function makeDamage(player) {
            // Verificar si el personaje está invulnerable
            if (this.invulnerable) {
                return; // Si está invulnerable, no hacer nada
            }

            // Si no está invulnerable, aplicar daño
            //console.log("Score: " + score);
            score -= 50;
            if (score < 0) {
                score = 0;
                console.log("Score: " + score);
                console.log("Game Over");
                this.musicalv2.stop();
                this.physics.pause();
                isDead = true;
                //this.characterObject.setPosition(this.characterObject.x, this.characterObject.y + 25);
                this.deadsound.play({ volume: 0.5 });
                this.character.setTint(0xAE445A); // Cambio de color para mostrar que ha perdido
                this.character.anims.play('dead', true);
                this.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                        this.deadsound.stop();
                    }
                });
            } else {
                this.hurtsound.play({ volume: 0.5 });
                console.log("Score: " + score);
                this.character.setTint(0xff0000);
                enemigo[0].setTint(0x2f2f2f);
                // Usar el temporizador para esperar 500ms antes de restaurar el color
                this.time.addEvent({
                    delay: 500, // Esperar 500ms
                    callback: () => {
                        this.character.clearTint(); // Restaurar el color original
                    },
                    loop: false // Solo se ejecuta una vez
                });
                this.time.addEvent({
                    delay: 3000, // Esperar 2000ms antes de restaurar el color de enemigo
                    callback: () => {
                        this.character.clearTint();
                        enemigo[0].clearTint();
                        this.hurtsound.stop();
                    },
                    loop: false // Solo se ejecuta una vez
                });
            }

            // Activar la invulnerabilidad
            this.invulnerable = true;

            // Desactivar la invulnerabilidad después de un tiempo (1.5 segundos, por ejemplo)
            this.time.addEvent({
                delay: 3000,  // 2 segundos de invulnerabilidad
                callback: () => {
                    this.invulnerable = false;  // Vuelve a permitir daño
                },
                loop: false
            });
        }
        function makeDamage2(player) {
            // Verificar si el personaje está invulnerable
            if (this.invulnerable2) {
                return; // Si está invulnerable, no hacer nada
            }

            // Si no está invulnerable, aplicar daño
            //console.log("Score: " + score);
            score -= 50;
            if (score < 0) {
                score = 0;
                console.log("Score: " + score);
                console.log("Game Over");
                this.musicalv2.stop();
                this.physics.pause();
                isDead = true;
                //this.characterObject.setPosition(this.characterObject.x, this.characterObject.y + 25);
                this.deadsound.play({ volume: 0.5 });
                this.character.setTint(0xAE445A); // Cambio de color para mostrar que ha perdido
                this.character.anims.play('dead', true);
                this.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                        this.deadsound.stop();
                    }
                });
            } else {
                this.hurtsound.play({ volume: 0.5 });
                console.log("Score: " + score);
                this.character.setTint(0xff0000);
                enemigo[1].setTint(0x2f2f2f);
                // Usar el temporizador para esperar 500ms antes de restaurar el color
                this.time.addEvent({
                    delay: 500, // Esperar 500ms
                    callback: () => {
                        this.character.clearTint(); // Restaurar el color original
                    },
                    loop: false // Solo se ejecuta una vez
                });
                this.time.addEvent({
                    delay: 2500, // Esperar 2000ms antes de restaurar el color de enemigo
                    callback: () => {
                        this.character.clearTint();
                        enemigo[1].clearTint();
                        this.hurtsound.stop();
                    },
                    loop: false // Solo se ejecuta una vez
                });
            }

            // Activar la invulnerabilidad
            this.invulnerable2 = true;

            // Desactivar la invulnerabilidad después de un tiempo (1.5 segundos, por ejemplo)
            this.time.addEvent({
                delay: 2500,  // 2 segundos de invulnerabilidad
                callback: () => {
                    this.invulnerable2 = false;  // Vuelve a permitir daño
                },
                loop: false
            });
        }
        function makeDamage3(player) {
            // Verificar si el personaje está invulnerable
            if (this.invulnerable2) {
                return; // Si está invulnerable, no hacer nada
            }

            // Si no está invulnerable, aplicar daño
            //console.log("Score: " + score);
            score -= 50;
            if (score < 0) {
                score = 0;
                console.log("Score: " + score);
                console.log("Game Over");
                this.musicalv2.stop();
                this.physics.pause();
                isDead = true;
                //this.characterObject.setPosition(this.characterObject.x, this.characterObject.y + 25);
                this.deadsound.play({ volume: 0.3 });
                this.character.setTint(0xAE445A); // Cambio de color para mostrar que ha perdido
                this.character.anims.play('dead', true);
                this.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                        this.deadsound.stop();
                    }
                });
            } else {
                this.hurtsound.play({ volume: 0.3 });
                console.log("Score: " + score);
                this.character.setTint(0xff0000);
                enemigo[2].setTint(0x2f2f2f);
                // Usar el temporizador para esperar 500ms antes de restaurar el color
                this.time.addEvent({
                    delay: 500, // Esperar 500ms
                    callback: () => {
                        this.character.clearTint(); // Restaurar el color original
                    },
                    loop: false // Solo se ejecuta una vez
                });
                this.time.addEvent({
                    delay: 2500, // Esperar 2000ms antes de restaurar el color de enemigo
                    callback: () => {
                        this.character.clearTint();
                        enemigo[2].clearTint();
                        this.hurtsound.stop();
                    },
                    loop: false // Solo se ejecuta una vez
                });
            }

            // Activar la invulnerabilidad
            this.invulnerable2 = true;

            // Desactivar la invulnerabilidad después de un tiempo (1.5 segundos, por ejemplo)
            this.time.addEvent({
                delay: 2500,  // 2 segundos de invulnerabilidad
                callback: () => {
                    this.invulnerable2 = false;  // Vuelve a permitir daño
                },
                loop: false
            });
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
            frames: Array.from({ length: 8 }, (_, i) => ({ key: `jum${i + 1}` })), // Ajuste de índices
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'attack',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `ataque${i + 1}` })), // Ajuste de índices
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'orbSpeen',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `orb${i + 1}` })), // Los frames de reposo0 a reposo9
            frameRate: 10,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'dead',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `dead${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 15,
            repeat: 0  // Esto hará que la animación se repita indefinidamente
        });



        // Asegúrate de que cada orbe reproduzca la animación cuando se crea
        this.orb.children.iterate(function (orb) {
            orb.setScale(0.1);  // Cambia el tamaño del orbe
            orb.anims.play('orbSpeen', true); // Reproduce la animación
        }, this);

        // this.attackFlag = false;
        // this.input.keyboard.on('keydown-J', () => {
        //     console.log('Tecla J presionada');
        //     this.character.anims.play('attack', true);
        //     this.attackFlag = true;
        // });



    }

    update()/*NIVEL 2*/ {

        // Lógica de movimiento
        this.character.body.setVelocityX(0);  // Detener el movimiento horizontal

        if (isDead) {

        } else {
            // Verificar si el personaje está tocando el suelo y presionando la tecla de salto
            if (this.cursors.up.isDown && this.character.body.touching.down) {
                this.jumpsound.play({ volume: 0.5 });
                this.character.body.setVelocityY(-430); // Realiza el salto
                this.character.anims.play('jump', true); // Reproducir animación de salto
            }

            // Verificar si ya no está tocando el suelo (en el aire) y reproducir la animación de salto
            else if (this.cursors.up.isDown && !this.character.body.touching.down) {
                this.character.anims.play('jump', true); // Reproducir animación de salto
            }

            // Movimiento combinado con salto (derecha)
            if (this.cursors.right.isDown && this.cursors.up.isDown) {
                this.character.body.setVelocityX(260); // Mover a la derecha mientras saltas
                this.character.flipX = false; // Mantener la dirección original
                this.character.anims.play('jump', true); // Animación de salto
            }
            // Movimiento combinado con salto (izquierda)
            else if (this.cursors.left.isDown && this.cursors.up.isDown) {
                this.character.body.setVelocityX(-260); // Mover a la izquierda mientras saltas
                this.character.flipX = true; // Invertir la dirección del personaje
                this.character.anims.play('jump', true); // Animación de salto
            }
            // Movimiento a la izquierda (caminar)
            else if (this.cursors.left.isDown) {
                this.character.body.setVelocityX(-260);   // Mover a la izquierda
                this.character.flipX = true;               // Invertir la dirección del personaje
                this.character.anims.play('run', true);    // Reproducir la animación de caminar
            }
            // Movimiento a la derecha (caminar)
            else if (this.cursors.right.isDown) {
                this.character.body.setVelocityX(260);    // Mover a la derecha
                this.character.flipX = false;              // Mantener la dirección original
                this.character.anims.play('run', true);    // Reproducir la animación de caminar
            }

            // Si no se mueve, poner al personaje en reposo
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.character.body.touching.down) {
                if (!this.attackFlag == true) {
                    this.character.anims.play('turn', true);  // Reproducir animación de reposo

                } else {
                    this.time.addEvent({
                        delay: 300, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.attackFlag = false;
                        },
                    });
                }

            }

            // Si el personaje está cayendo (no está tocando el suelo), activar animación de caída
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.character.body.touching.down) {
                // Aquí se puede agregar una animación de caída, si la tienes
                this.character.anims.play('jump', true);  // Reproducir animación de caída
            }
        }

        if (this.contadorOrbeslv2 == 10) {
            this.musicalv2.stop();
            this.orbsound.stop();
            this.contadorOrbeslv2 = 0;
            this.scene.start('levelScene'); // Cambiar a la siguiente escena (nivel)
        }




    }


}

class Nivel3 extends Phaser.Scene {
    constructor() {
        super('levelScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.audio('jump', './audios/7-Jump.mp3');
        this.load.image('platformlv3', './img/level3platform1.png');
        this.load.image('level3', './img/background3.jpg');
        this.load.image('pisolv3', './img/wood_floor.png');
        this.load.image('prota', './img/prota/Idle__000.png');
        this.load.image('boss', './img/finalboss/Idle__000.png');

        for (let i = 0; i <= 9; i++) {
            const key = `ataque${i}`;
            const path = `./img/prota/Attack__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
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
        for (let i = 1; i <= 8; i++) {
            const key = `jum${i}`;
            const path = `./img/prota/Jump__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 6; i++) {
            const key = `orb${i}`;
            const path = `./img/blueorb/frame__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `dead${i}`;
            const path = `./img/prota/Dead__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `throw${i}`;
            const path = `./img/prota/Throw__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `throwJump${i}`;
            const path = `./img/prota/Jump_Throw__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        //Para el final boss
        for (let i = 0; i <= 9; i++) {
            const key = `reposoBoss${i}`;
            const path = `./img/finalboss/Idle__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        /*
        for (let i = 0; i <= 9; i++) {
            const key = `movBoss${i}`;
            const path = `./img/prota/Run__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 8; i++) {
            const key = `jumBoss${i}`;
            const path = `./img/prota/Jump__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 6; i++) {
            const key = `orbBoss${i}`;
            const path = `./img/blueorb/frame__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        for (let i = 0; i <= 9; i++) {
            const key = `deadBoss${i}`;
            const path = `./img/prota/Dead__${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        */

    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        this.add.image(640, 260, 'level3').setScale(0.25);
        this.jumpsound = this.sound.add('jump', { loop: false });
        this.character = this.physics.add.sprite(80, 490, 'prota').setScale(0.22);
        this.boss = this.physics.add.sprite(1200, 490, 'boss').setScale(0.3);
        this.boss.setFlipX(true);
        // Ajuste de la colisión (antes de la animación)
        this.character.body.setSize(300, 500);  // Tamaño adecuado del cuadro de colisión
        this.character.body.setOffset(0, 0);  // Alinea el cuadro de colisión con el sprite
        //this.boss.body.setSize(300, 500);  // Tamaño adecuado del cuadro de colisión
        //this.boss.body.setOffset(0, 0);  // Alinea el cuadro de colisión con el sprite
        // Inicializar los controles
        this.cursors = this.input.keyboard.createCursorKeys();
        // Agregar gravedad al personaje
        this.character.body.setGravityY(125);
        this.character.setCollideWorldBounds(true);
        this.boss.body.setGravityY(125);
        this.boss.setCollideWorldBounds(true);
        // Colisiones entre el personaje y el piso




        let piso = this.physics.add.staticGroup();
        for (let x = 50; x <= 1350; x += 119) {
            let pisoObjeto = piso.create(x, 740, 'pisolv3').setScale(0.15);
            pisoObjeto.refreshBody(); // Ajusta la hitbox al tamaño escalado
        }
        this.physics.add.collider(this.character, piso);
        this.physics.add.collider(this.boss, piso);

        let plataformalv3 = new Array();
        // plataformalv3[0] = piso.create(200, 300, 'platformlv3').setScale(0.2);  // Crear plataforma 1
        plataformalv3[0] = piso.create(600, 500, 'platformlv3').setScale(0.2);  // Crear plataforma 2
        for (let index = 0; index < plataformalv3.length; index++) {

            plataformalv3[index].body.setSize(380, 50);
            // plataformalv3[index].refreshBody();
            plataformalv3[index].body.setOffset(810, 95);  // Ajustar el desplazamiento en Y
        }


        // Crear animaciones del boss
        this.anims.create({
            key: 'turnBoss',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `reposoBoss${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 6,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.boss.anims.play('turnBoss', true);



        // Crear animaciones del prota
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
            frames: Array.from({ length: 8 }, (_, i) => ({ key: `jum${i + 1}` })), // Ajuste de índices
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'throwJump',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `throwJump${i}` })), // Ajuste de índices
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'throw',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `throw${i}` })), // Ajuste de índices
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'orbSpeen',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `orb${i + 1}` })), // Los frames de reposo0 a reposo9
            frameRate: 10,
            repeat: -1  // Esto hará que la animación se repita indefinidamente
        });

        this.anims.create({
            key: 'dead',
            frames: Array.from({ length: 9 }, (_, i) => ({ key: `dead${i}` })), // Los frames de reposo0 a reposo9
            frameRate: 15,
            repeat: 0  // Esto hará que la animación se repita indefinidamente
        });



        // Asegúrate de que cada orbe reproduzca la animación cuando se crea
        // this.orb.children.iterate(function (orb) {
        //     orb.setScale(0.1);  // Cambia el tamaño del orbe
        //     orb.anims.play('orbSpeen', true); // Reproduce la animación
        // }, this);

        this.attackFlag = false;
        this.input.keyboard.on('keydown-J', () => {
            console.log('Tecla J presionada');
            this.attackFlag = true;
        });

    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        // Lógica de movimiento
        this.character.body.setVelocityX(0);  // Detener el movimiento horizontal

        if (isDead == true) {

        } else {
            // Verificar si el personaje está tocando el suelo y presionando la tecla de salto
            if (this.cursors.up.isDown && this.character.body.touching.down) {
                this.jumpsound.play();
                this.character.body.setVelocityY(-430); // Realiza el salto
                this.character.anims.play('jump', true); // Reproducir animación de salto
            }

            // Verificar si ya no está tocando el suelo (en el aire) y reproducir la animación de salto
            else if (this.cursors.up.isDown && !this.character.body.touching.down) {
                if (!this.attackFlag == true) {
                    this.character.anims.play('jump', true); // Reproducir animación de salto
                } else {
                    this.character.anims.play('throwJump', true);
                    this.time.addEvent({
                        delay: 400, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.attackFlag = false;
                        },
                    });
                }

            }


            // Movimiento combinado con salto (derecha)
            if (this.cursors.right.isDown && this.cursors.up.isDown) {
                if (!this.attackFlag == true) {
                    this.character.body.setVelocityX(260); // Mover a la derecha mientras saltas
                    this.character.flipX = false; // Mantener la dirección original
                    this.character.anims.play('jump', true); // Animación de salto

                } else {
                    this.character.body.setVelocityX(260); // Mover a la derecha mientras saltas
                    this.character.flipX = false; // Mantener la dirección original
                    this.character.anims.play('throwJump', true);
                    this.time.addEvent({
                        delay: 400, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.attackFlag = false;
                        },
                    });
                }

            }
            // Movimiento combinado con salto (izquierda)
            else if (this.cursors.left.isDown && this.cursors.up.isDown) {
                if (!this.attackFlag == true) {
                    this.character.body.setVelocityX(-260); // Mover a la izquierda mientras saltas
                    this.character.flipX = true; // Invertir la dirección del personaje
                    this.character.anims.play('jump', true); // Animación de salto

                } else {
                    this.character.body.setVelocityX(-260); // Mover a la izquierda mientras saltas
                    this.character.flipX = true; // Invertir la dirección del personaje
                    this.character.anims.play('throwJump', true);
                    this.time.addEvent({
                        delay: 400, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.attackFlag = false;
                        },
                    });
                }

            }
            // Movimiento a la izquierda (caminar)
            else if (this.cursors.left.isDown) {
                this.character.body.setVelocityX(-260);   // Mover a la izquierda
                this.character.flipX = true;               // Invertir la dirección del personaje
                this.character.anims.play('run', true);    // Reproducir la animación de caminar
            }
            // Movimiento a la derecha (caminar)
            else if (this.cursors.right.isDown) {
                this.character.body.setVelocityX(260);    // Mover a la derecha
                this.character.flipX = false;              // Mantener la dirección original
                this.character.anims.play('run', true);    // Reproducir la animación de caminar
            }

            // Si no se mueve, poner al personaje en reposo
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.character.body.touching.down) {
                if (!this.attackFlag == true) {
                    this.character.anims.play('turn', true);  // Reproducir animación de reposo

                } else {
                    this.character.anims.play('throw', true);
                    this.time.addEvent({
                        delay: 400, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.attackFlag = false;
                        },
                    });
                }

            }

            // Si el personaje está cayendo (no está tocando el suelo), activar animación de caída
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.character.body.touching.down) {
                // Aquí se puede agregar una animación de caída, si la tienes
                this.character.anims.play('jump', true);  // Reproducir animación de caída
            }
        }
    }

}

class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainMenu');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('mainmenu', './img/screens/mainmenu.png');
        this.load.audio('sound_mainmenu', './audios/2-NinjaGaiden_MainMenu.mp3');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del 
        this.add.image(640, 360, 'mainmenu').setScale(0.15);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.music_mainmenu = this.sound.add('sound_mainmenu', { loop: true });
        this.music_mainmenu.play({ volume: 0.1 });
        this.rectangulo = this.add.graphics();
        this.rectangulo2 = this.add.graphics();


        this.rectangulo.lineStyle(4, 0x000000, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo.strokeRect(540, 480, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
        //this.rectangulo2.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo2.strokeRect(540, 550, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
        this.selection = 1;
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        if (this.enter.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown)) {
            if (this.selection == 1) {
                this.scene.start('selectPlayer');
                this.music_mainmenu.stop();
            } else if (this.selection == 2) {
                this.scene.start('controlsScene');
                this.music_mainmenu.stop();
            }
        }
        if (this.cursors.up.isDown) {
            // Establecer el color y grosor del borde (lineStyle)
            this.selection = 1;
            console.log(this.selection);
            this.rectangulo.setVisible(true);
            this.rectangulo2.setVisible(false);  // Coordenadas (100, 100), 200px de ancho y 150px de alto

        } else if (this.cursors.down.isDown) {
            this.selection = 2;
            console.log(this.selection);
            // Dibujar solo el borde del rectángulo (x, y, ancho, alto)
            this.rectangulo2.setVisible(true);
            this.rectangulo2.strokeRect(540, 550, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
            this.rectangulo2.lineStyle(4, 0x000000, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
            this.rectangulo.setVisible(false);
        }

    }

}
class SelectPlayer extends Phaser.Scene {
    constructor() {
        super('selectPlayer');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('playerselect', './img/screens/selectplayer.png');
        this.load.audio('sound_mainmenu', './audios/2-NinjaGaiden_MainMenu.mp3');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del 
        this.add.image(640, 360, 'playerselect').setScale(0.15);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.rectangulo = this.add.graphics();
        this.rectangulo2 = this.add.graphics();


        this.rectangulo.lineStyle(4, 0x000000, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo.strokeRect(540, 480, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
        //this.rectangulo2.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo2.strokeRect(540, 550, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
        this.selection = 1;
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        if (this.enter.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown)) {
            if (this.selection == 1) {
                this.scene.start('gameScene');
                jugadores = 1;
            } else if (this.selection == 2) {
                this.scene.start('gameScene');
                jugadores = 2;
            }
        }
        if (this.cursors.up.isDown) {
            // Establecer el color y grosor del borde (lineStyle)
            this.selection = 1;
            console.log(this.selection);
            this.rectangulo.setVisible(true);
            this.rectangulo2.setVisible(false);  // Coordenadas (100, 100), 200px de ancho y 150px de alto

        } else if (this.cursors.down.isDown) {
            this.selection = 2;
            console.log(this.selection);
            // Dibujar solo el borde del rectángulo (x, y, ancho, alto)
            this.rectangulo2.setVisible(true);
            this.rectangulo2.strokeRect(540, 550, 200, 60);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
            this.rectangulo2.lineStyle(4, 0x000000, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
            this.rectangulo.setVisible(false);
        }

    }

}

class Controls extends Phaser.Scene {
    constructor() {
        super('controlsScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('controls', './img/screens/controls.png');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        this.add.image(640, 360, 'controls').setScale(0.14);
        this.rectangulo = this.add.graphics();

        this.rectangulo.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo.strokeRect(500, 545, 240, 60);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);



    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        if (this.enter.isDown) {
            this.scene.start('mainMenu');
        }
    }

}

class EndGame extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('gameover', './img/screens/gameover.png');
        this.load.audio('music_gameover', './audios/1-NinjaGaiden_GameOver.mp3');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        this.imagen = this.add.image(640, 360, 'gameover').setScale(0.2).setAlpha(0);
        this.music_gameover = this.sound.add('music_gameover', { loop: false });
        this.music_gameover.play({ volume: 0.1 });

        // Usar un "tween" para aumentar la opacidad gradualmente


    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia

        this.time.addEvent({
            delay: 2500, // Esperar 500ms
            callback: () => {
                this.tweens.add({
                    targets: this.imagen,
                    alpha: 1,         // El valor final de opacidad (totalmente visible)
                    duration: 2000,   // Tiempo en milisegundos (2 segundos en este caso)
                    ease: 'EaseIn',   // Tipo de easing, ajusta para un efecto diferente
                });
            },
            loop: false // Solo se ejecuta una vez
        });

        if (this.enter.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown)) {

            //this.scene.start('mainMenu');
            this.music_gameover.stop();
            window.location.reload();

        }

    }

}

class EndGame2 extends Phaser.Scene {
    constructor() {
        super('endScene2');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('thanks', './img/screens/thanksforplaying.png');
        this.load.audio('music_gameover', './audios/1-NinjaGaiden_GameOver.mp3');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        this.imagen = this.add.image(640, 360, 'thanks').setScale(0.2).setAlpha(0);
        this.music_gameover = this.sound.add('music_gameover', { loop: false });
        this.music_gameover.play({ volume: 0.1 });

        // Usar un "tween" para aumentar la opacidad gradualmente


    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia

        this.time.addEvent({
            delay: 2500, // Esperar 500ms
            callback: () => {
                this.tweens.add({
                    targets: this.imagen,
                    alpha: 1,         // El valor final de opacidad (totalmente visible)
                    duration: 2000,   // Tiempo en milisegundos (2 segundos en este caso)
                    ease: 'EaseIn',   // Tipo de easing, ajusta para un efecto diferente
                });
            },
            loop: false // Solo se ejecuta una vez
        });

        if (this.enter.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown)) {

            //this.scene.start('mainMenu');
            this.music_gameover.stop();
            window.location.reload();

        }

    }

}


// 3) Configuración base del videojuego
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    // Array que indica el orden de visualización del vj
    scene: [ MainMenu, SelectPlayer, Nivel1, Nivel3,  Nivel2, Controls, EndGame, EndGame2],
    scale: {
        mode: Phaser.Scale.FIT
    }, physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 300,

            },
        },
    },
}
// 4) Inicialización de Phaser
new Phaser.Game(config);

