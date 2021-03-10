window.addEventListener('DOMContentLoaded', DOMContentLoaded => {
    
    // CANVAS INIT, we have to resize the window to fit the screen based on the different screen sizes.
    const render = document.querySelector('canvas').getContext('2d');
    let w, h;
    const resize = () => {
        w = render.canvas.width = render.canvas.clientWidth * window.devicePixelRatio;
        h = render.canvas.height = render.canvas.clientHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    // APPLY PHYSICS shows how the x and y directions are being used with motion like acceleration and velocity
    // all being a the main reason for how the ball moves
    let player_x = 0, player_y = 0;
    let player_r = 0.2;
    let player_vx = 0, player_vy = 0;
    let player_ax = 0, player_ay = 0;
    let arrow_right = false;
    let arrow_left = false;
    // shows the key press and what direction the ball should move in since its either an increase in acceleration
    // or a decrease in some direction.
    document.addEventListener('keydown', keydown =>{
        if(keydown.key === 'ArrowRight'){
            arrow_right = true;
        }
        if(keydown.key === 'ArrowLeft'){
            arrow_left = true;
        }
        if(keydown.key === 'ArrowUp'){
            player_ay += 0.01;
        }
    });
    document.addEventListener('keyup', keyup =>{
        if(keyup.key === 'ArrowRight'){
            arrow_right = false;
        }
        if(keyup.key === 'ArrowLeft'){
            arrow_left = false;
        }
    });
    //PLATFORM
    class Platform{
        constructor(x, y, w, h){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
    }
    const platforms = []
    platforms.push(new Platform(-0.25, -0.25, 3, 0.25));
    platforms.push(new Platform(3, -0.25, 3, 0.25));
    platforms.push(new Platform(0.125, 0.25, 4, 0.125));

    // ANIMATION LOOP, most of this top stuff is background
    const animation = timestamp => {
        const PLAYER_ACCELERATION_X = 0.001;
        if(arrow_right){
            player_ax += PLAYER_ACCELERATION_X;
        }
        if(arrow_left){
            player_ax -= PLAYER_ACCELERATION_X;
        }
        player_vx += player_ax;
        player_x += player_vx;
        player_ax = 0;
        player_vx *= 0.98;
        player_vy += player_ay;
        player_ay -= 0.00098;
        
        //Similar to moving left and right the up key would have the ball rise forever while this adds a force
        // of gravity which pulls it back down. Without the else part the ball would continue to fall since it
        //has no base or stopping point. This is where the else comes in as the ball hits 0 in all these points
        // at the base which stops the ball from continuing further down.
        let player_grounded = false;
        platforms.forEach(platform => {
            if(platform.x <= player_x && player_x <= platform.x + platform.w && platform.y <= player_y && player_y + player_vy <= platform.y) {
                player_grounded = true;
                player_ay = 0;
                player_vy = 0;
                player_y = platform.y;
            }
        });
        if (!player_grounded){
            player_y += player_vy;
        }
    
        
        render.save();
        render.translate(-player_x * w/2, player_y * h/2);
        render.clearRect(player_x * w/2, -player_y * h/2, render.canvas.width, render.canvas.height);

        render.fillStyle = '#0f0';
        render.fillRect(-10000, render.canvas.height / 2, 10000 *render.canvas.width, render.canvas.height / 2);

        render.fillStyle = '#0ff';
        render.fillRect(-10000, 0, 10000 * render.canvas.width, render.canvas.height / 2);

        render.fillStyle = '#00F';
        platforms.forEach(platform => {
            render.fillRect(platform.x * w/2 + w/2, -platform.y * h/2 + h/2, platform.w * h/2, platform.h * h/2);
        })
        
        //we see the increase in certain variables as others decrease which gives us our view that the ball
        //has a sort of friction beneath it. With the velocity being higher than the acceleration this helps
        //to allow the ball to not continue to accelerate like it did before as well as us setting it to 0.
        render.fillStyle = '#f00';
        render.beginPath();
        render.arc(player_x * w/2 + w/2, -player_y * h/2 + h/2 - player_r * h/2, player_r * h/2, 0, 2 * Math.PI);
        render.fill();
        render.restore();

        window.requestAnimationFrame(animation);
    }
    window.requestAnimationFrame(animation);
})