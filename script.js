document.addEventListener('DOMContentLoaded', () => {
    const move_speed = 2; // Aumenta a velocidade do jogo
    const gravity = 0.6; // Ajusta a gravidade para um jogo mais desafiador
    const bird = document.querySelector('.bird');
    const img = document.getElementById('bird-1');
    const sound_point = new Audio('sounds/novo_som_ponto.mp3');
    const sound_die = new Audio('sounds/novo_som_morte.mp3');

    let bird_props = bird.getBoundingClientRect();
    const background1 = document.getElementById('background1');
    const background2 = document.getElementById('background2');
    let background_props = background1.getBoundingClientRect();

    const score_val = document.querySelector('.score_val');
    const message = document.querySelector('.message');
    const score_title = document.querySelector('.score_title');

    let game_state = 'Start';
    img.style.display = 'none';
    message.classList.add('messageStyle');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && game_state !== 'Play') {
            document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
            img.style.display = 'block';
            bird.style.top = '40vh';
            game_state = 'Play';
            message.innerHTML = '';
            score_title.innerHTML = 'Score : ';
            score_val.innerHTML = '0';
            message.classList.remove('messageStyle');
            background1.classList.remove('paused');
            background2.classList.remove('paused');
            play();
        }
    });

    function play() {
        function move() {
            if (game_state !== 'Play') return;

            let pipe_sprite = document.querySelectorAll('.pipe_sprite');
            pipe_sprite.forEach((element) => {
                let pipe_sprite_props = element.getBoundingClientRect();
                bird_props = bird.getBoundingClientRect();

                if (pipe_sprite_props.right <= 0) {
                    element.remove();
                } else {
                    if (
                        bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                        bird_props.left + bird_props.width > pipe_sprite_props.left &&
                        bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                        bird_props.top + bird_props.height > pipe_sprite_props.top
                    ) {
                        game_state = 'End';
                        message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                        message.classList.add('messageStyle');
                        img.style.display = 'none';
                        sound_die.play();
                        background1.classList.add('paused');
                        background2.classList.add('paused');
                        return;
                    } else {
                        if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score === '1') {
                            score_val.innerHTML = +score_val.innerHTML + 1;
                            sound_point.play();
                        }
                        element.style.left = pipe_sprite_props.left - move_speed + 'px';
                    }
                }
            });
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);

        function moveBackground() {
            if (game_state !== 'Play') return;

            let bg1_pos = background1.getBoundingClientRect();
            let bg2_pos = background2.getBoundingClientRect();

            if (bg1_pos.right <= 0) {
                background1.style.left = bg2_pos.right + 'px';
            } else {
                background1.style.left = bg1_pos.left - move_speed + 'px';
            }

            if (bg2_pos.right <= 0) {
                background2.style.left = bg1_pos.right + 'px';
            } else {
                background2.style.left = bg2_pos.left - move_speed + 'px';
            }

            requestAnimationFrame(moveBackground);
        }
        requestAnimationFrame(moveBackground);

        let bird_dy = 0;
        function apply_gravity() {
            if (game_state !== 'Play') return;
            bird_dy = bird_dy + gravity;
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === ' ') {
                    img.src = 'img/abelhaofinal.gif';
                    bird_dy = -7.6;
                }
            });

            document.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowUp' || e.key === ' ') {
                    img.src = 'img/abelhaofinal.gif';
                }
            });

            if (bird_props.top <= 0 || bird_props.bottom >= background_props.bottom) {
                game_state = 'End';
                message.style.left = '28vw';
                window.location.reload();
                message.classList.remove('messageStyle');
                background1.classList.add('paused');
                background2.classList.add('paused');
                return;
            }
            bird.style.top = bird_props.top + bird_dy + 'px';
            bird_props = bird.getBoundingClientRect();
            requestAnimationFrame(apply_gravity);
        }
        requestAnimationFrame(apply_gravity);

        let pipe_separation = 0;
        let pipe_gap = 35;

        function create_pipe() {
            if (game_state !== 'Play') return;

            if (pipe_separation > 85) { // Reduz o intervalo entre os obstáculos
                pipe_separation = 0;

                let pipe_posi = Math.floor(Math.random() * 43) + 8;
                let pipe_sprite_inv = document.createElement('div');
                pipe_sprite_inv.className = 'pipe_sprite top';
                pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
                pipe_sprite_inv.style.left = '100vw';

                document.body.appendChild(pipe_sprite_inv);
                let pipe_sprite = document.createElement('div');
                pipe_sprite.className = 'pipe_sprite';
                pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
                pipe_sprite.style.left = '100vw';
                pipe_sprite.increase_score = '1';

                document.body.appendChild(pipe_sprite);
            }
            pipe_separation++;
            requestAnimationFrame(create_pipe);
        }
        requestAnimationFrame(create_pipe);
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
        }
    });

    window.addEventListener('resize', () => {
        bird_props = bird.getBoundingClientRect();
        background_props = background1.getBoundingClientRect();
    });
});