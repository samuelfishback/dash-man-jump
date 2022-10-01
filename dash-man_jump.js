// desktop
if (window.innerWidth > 1000) {
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = 0.995 * window.innerHeight;

const gravity = 0.5;
function isPlusOrMinus() {
    let x = Math.random();
    if (x >= 0.5) {
        return 1;
    } else return -1;
}
// FIXME: image will not draw even with onload
/* function drawPlatform() {
    const platformImage = new Image();
    platformImage.src = './img/platform.png';
    platformImage.onload = () => {
        ctx.drawImage(platformImage, this.x, this.y, this.width, this.height);
    }
} */

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.width = 30;
        this.height = 30 * 1.618 /* golden ratio */;
        this.velocity = {
            x: 0,
            y: 1
        };
        this.isFacing = {
            left: false,
            neutral: true,
            right: false
        };
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y < canvas.height) {
            this.velocity.y += gravity;
        } else this.velocity.y = 0;
    }
}

class Platform {
    constructor({x, y}) {
        this.position = {
            x: x + isPlusOrMinus() * Math.floor(Math.random() * 100),
            y: y + isPlusOrMinus() * Math.floor(Math.random() * 50),
        }
        
        this.width = 200 + isPlusOrMinus() * Math.floor(Math.random() * 50);
        this.height = 200 / (1.618 * 5);
    }
    
    draw() {
        // drawPlatform();
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
const platforms = [new Platform({x: 300, y: 550}), new Platform({x: 600, y: 550})];

const keys = {
    right: {
        isPressed: false
    },
    left: {
        isPressed: false
    },
    up: {
        isPressed: false
    },
    down: {
        isPressed: false
    },
    shift: {
        isPressed: false
    }
}

// win condition
let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    platforms.forEach(platform => {
        platform.draw();
    });

    // player movement & borders
    // player & background scroll
    // TODO: change this to a vertical scroll rather than a horizontal one & change velocity back to 10
    if (keys.right.isPressed && player.position.x < 400 /*player.width < canvas.width*/) {
        player.velocity.x = 5;
    } else if (keys.left.isPressed && player.position.x > 75 /*> 0*/) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.isPressed) {
            scrollOffset += 5;
            platforms.forEach(platform => {
                platform.position.x -= 5;
            });
        } else if (keys.left.isPressed) {
            scrollOffset -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            });
        }
    }

    if (scrollOffset > 2000) {
        console.log('YOU WIN!!!');
    }
    

    // platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
                player.velocity.y = 0;
            // player lands well above platform and slowly lowers to 1px above.
            // add decorative flora or stone to cover landings
            // may be order of drawing
        }
    });
}

animate();

window.addEventListener('keydown', ({keyCode}) => {
    console.log(keyCode);
    switch (true) {
        case keyCode==65 || keyCode==37:
            console.log('left');
            keys.right.isPressed = false;
            keys.left.isPressed = true;
            break;
        case keyCode==68 || keyCode==39:
            console.log('right');
            keys.left.isPressed = false;
            keys.right.isPressed = true;
            break;
        case keyCode==87 || keyCode==38 || keyCode==32:
            console.log('up');
            keys.up.isPressed = true;
            player.velocity.y = -15;
            break;
        case keyCode==83 || keyCode==40:
            console.log('down');
            keys.down.isPressed = true;
            break;
        case keyCode==16:
            console.log('shift');
            keys.shift.isPressed = true;
            break;
    }
});
window.addEventListener('keyup', ({keyCode}) => {
    switch (true) {
        case keyCode==65 || keyCode==37:
            keys.left.isPressed = false;
            break;
        case keyCode==68 || keyCode==39:
            keys.right.isPressed = false;
            break;
        case keyCode==87 || keyCode==38 || keyCode==32:
            keys.up.isPressed = false;
            break;
        case keyCode==83 || keyCode==40:
            keys.down.isPressed = false;
            break;
        case keyCode==16:
            keys.shift.isPressed = false;
            break;
        }
});
}
// -----------------------------------------mobile---------------------------------------------------------------------

if (window.innerWidth > 320 && window.innerWidth < 1000) {
if (window.innerWidth > window.innerHeight) {
    alert("Please Rotate device");
} else {

    function isPlusOrMinus() {
        let x = Math.random();
        if (x >= 0.5) {
            return 1;
        } else return -1;
    }

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.beginPath();
ctx.moveTo(canvas.width / 2, canvas.height / 1.618);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.stroke();
ctx.closePath();

// ---------------------------------------------global variables

const playable_top = 2;
const playable_left = 2;
const playable_right = canvas.width - 2;
const playable_bottom = (canvas.height / 1.618) - 1;
const buttonSize = canvas.width / 6;
const buttonSpace = (canvas.height - playable_bottom) / 16;
var jumpEnd;

// ----------------------------------------------classes
// ----------------------------------------------buttons

class Button {
    constructor(positionX, positionY, buttonID) {
        this.size = buttonSize;
        this.position = {
            x : positionX,
            y : positionY
        };
        this.action = buttonID;
    }
    draw() {
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.position.x, this.position.y, this.size, this.size);
        ctx.fillStyle = 'black';
        switch (this.action) {
            case "left":
                ctx.beginPath;
                ctx.moveTo(
                    this.position.x + this.size - 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.closePath();
                break;
            case "right":
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.closePath();
                break;
            case "jump":
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + this.size / 2,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size - 5
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.closePath();
                break;
            case "drop":
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size / 2,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.closePath();
                break;
            case "dashLeft":
                ctx.beginPath();
                ctx.strokeStyle = 'lightgrey';
                ctx.moveTo(
                    this.position.x + (this.size * 2/3),
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + (this.size * 2/3),
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + this.size - 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + (this.size / 3),
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                break;
            case "dashRight":
                ctx.strokeStyle = 'lightgrey';
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + (this.size / 3),
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + (this.size / 3),
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + (this.size * 2/3),
                    this.position.y + this.size / 2
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                break;
            case "doubleJump":
                ctx.strokeStyle = 'lightgrey';
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + this.size / 2,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + (this.size * 2/3)
                );
                ctx.lineTo(
                    this.position.x + 5,
                    this.position.y + (this.size * 2/3)
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + 5,
                    this.position.y + this.size - 5
                );
                ctx.lineTo(
                    this.position.x + this.size / 2,
                    this.position.y + (this.size / 3)
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + this.size - 5
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                break;
            case "safetyNet":
                ctx.beginPath();
                ctx.moveTo(
                    this.position.x + 5,
                    this.position.y + 5
                );
                ctx.lineTo(
                    this.position.x + this.size / 2,
                    this.position.y + (this.size * 2/3)
                );
                ctx.lineTo(
                    this.position.x + this.size - 5,
                    this.position.y + 5
                );
                ctx.fill();
                ctx.closePath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(
                    this.position.x + this.size / 2,
                    this.position.y + this.size / 4,
                    36,
                    Math.PI * 1/4,
                    Math.PI * 3/4,
                    false
                );
                ctx.stroke();
                ctx.closePath();
                break;
        }
    }
}

// -------------------------------------------------platforms
class Platform {
    constructor({x, y}) {
        this.position = {
            x: x + isPlusOrMinus() * Math.floor(Math.random() * 90),
            y: y + isPlusOrMinus() * Math.floor(Math.random() * 112),
        }
        
        this.width = 100 + isPlusOrMinus() * Math.floor(Math.random() * 50);
        this.height = 200 / (1.618 * 5);
    }
    
    draw() {
        // drawPlatform();
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// --------------------------------------------------player
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 350
        };
        this.width = 30;
        this.height = 30 * 1.618 /* golden ratio */;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.direction = {
            left: false,
            right: false,
            up: false,
            down: false,
            dashLeft: false,
            dashRight: false,
            doubleJump: false,
            safetyNet: false
        };
        this.isFacing = {
            left: false,
            neutral: true,
            right: false
        };
    }

    move() {
        if (this.direction.left && this.position.x > playable_left) {
            this.velocity.x = -5;
        } else if (this.direction.right && this.position.x + this.width < playable_right) {
            this.velocity.x = 5;
        } else this.velocity.x = 0;
    }
    
    jump() {
        if (this.direction.up && this.position.y > 100) {
            console.log(this.position.y + "\n" + jumpEnd);
            this.velocity.y = -10;
            if (this.position.y > jumpEnd) {
                this.velocity.y = -10;
            } else this.direction.up = false;
        } else this.velocity.y += 1;
        
    // -------------------------------------------scroll mechanics TODO:
        let scrollStart = this.position.y > playable_bottom * 3 / 4 ? true : false;
        if (this.velocity.y > 0 && this.position.y < playable_bottom * 3 / 4 && scrollStart) {
            console.log('scroll ' + scrollStart);
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// -------------------------------------objects

const leftButton = new Button(canvas.width / 17, playable_bottom + buttonSpace, "left");
leftButton.draw();
const rightButton = new Button(4 * canvas.width / 17, playable_bottom + buttonSpace, "right");
rightButton.draw();
const jumpButton = new Button(10 * canvas.width / 17, playable_bottom + buttonSpace, "jump");
jumpButton.draw();
const dropButton = new Button(13 * canvas.width / 17, playable_bottom + buttonSpace, "drop");
dropButton.draw();
const dashLeftButton = new Button(canvas.width / 17, playable_bottom + 1.25 * buttonSpace + buttonSize, "dashLeft");
dashLeftButton.draw();
const dashRightButton = new Button(4 * canvas.width / 17, playable_bottom + 1.25 * buttonSpace + buttonSize, "dashRight");
dashRightButton.draw();
const doubleJumpButton = new Button(10 * canvas.width / 17, playable_bottom + 1.25 * buttonSpace + buttonSize, "doubleJump");
doubleJumpButton.draw();
const safetyNetButton = new Button(13 * canvas.width / 17, playable_bottom + 1.25 * buttonSpace + buttonSize, "safetyNet");
safetyNetButton.draw();
const player = new Player();
const platforms = [new Platform({x: 180, y: 335}), new Platform({x: 180, y: 275}), new Platform({x: 180, y: 225})];

// ------------------------------------------collision detection
function isGrounded() {
    let isPlatformed;
    if (player.position.y + player.height + player.velocity.y > playable_bottom) {
        player.velocity.y = 0;
    }
    if (player.position.y + player.height > playable_bottom - 2 &&
        player.position.y + player.height < playable_bottom + 2) {
        return true;
    }
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
                player.velocity.y = 0;
        } 
        if (player.position.y + player.height > platform.position.y - 2 &&
            player.position.y + player.height < platform.position.y + 2 &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
                isPlatformed = true;
        }
    }); return isPlatformed;
}

// --------------------------------------------animate

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(playable_left, playable_top, playable_right, playable_bottom);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0,0, canvas.width, canvas.height / 1.618);
    player.update();
    player.move();
    player.jump();
    platforms.forEach(platform => {
        platform.draw();
    });
    isGrounded();
    //console.log(isGrounded());
    // scroll();
}
animate();

// ---------------------------------------event listeners

canvas.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    window.navigator.vibrate(0);
});
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
});
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    [...e.changedTouches].forEach(touch => {
        console.log("X", e.touches.length, touch.pageX);
        console.log("Y", e.touches.length, touch.pageY);
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.style.top = `${touch.clientY}px`;
        dot.style.left = `${touch.clientX}px`;
        dot.id = touch.identifier;
        document.body.append(dot);
        if (touch.pageX > leftButton.position.x && touch.pageX < leftButton.position.x + leftButton.size &&
            touch.pageY > leftButton.position.y && touch.pageY < leftButton.position.y + leftButton.size) {
                console.log('left');
                player.direction.left = true;
            }
        if (touch.pageX > rightButton.position.x && touch.pageX < rightButton.position.x + rightButton.size &&
            touch.pageY > rightButton.position.y && touch.pageY < rightButton.position.y + rightButton.size) {
                console.log('right');
                player.direction.right = true;
            }
        if (touch.pageX > jumpButton.position.x && touch.pageX < jumpButton.position.x + jumpButton.size &&
            touch.pageY > jumpButton.position.y && touch.pageY < jumpButton.position.y + jumpButton.size) {
                console.log('jump');
                if (isGrounded()) {
                    player.direction.up = true;
                }
                jumpEnd = player.position.y - 100;
            }
        if (touch.pageX > dropButton.position.x && touch.pageX < dropButton.position.x + dropButton.size &&
            touch.pageY > dropButton.position.y && touch.pageY < dropButton.position.y + dropButton.size) {
                console.log('down');
                player.direction.down = true;
            }
        if (touch.pageX > dashLeftButton.position.x && touch.pageX < dashLeftButton.position.x + dashLeftButton.size &&
            touch.pageY > dashLeftButton.position.y && touch.pageY < dashLeftButton.position.y + dashLeftButton.size) {
                console.log('dashLeft');
                player.direction.dashLeft = true;
            }
        if (touch.pageX > dashRightButton.position.x && touch.pageX < dashRightButton.position.x + dashRightButton.size &&
            touch.pageY > dashRightButton.position.y && touch.pageY < dashRightButton.position.y + dashRightButton.size) {
                console.log('dashRight');
                player.direction.dashRight = true;
            }
        if (touch.pageX > doubleJumpButton.position.x && touch.pageX < doubleJumpButton.position.x + doubleJumpButton.size &&
            touch.pageY > doubleJumpButton.position.y && touch.pageY < doubleJumpButton.position.y + doubleJumpButton.size) {
                console.log('doubleJump');
                player.direction.doubleJump = true;
            }
        if (touch.pageX > safetyNetButton.position.x && touch.pageX < safetyNetButton.position.x + safetyNetButton.size &&
            touch.pageY > safetyNetButton.position.y && touch.pageY < safetyNetButton.position.y + safetyNetButton.size) {
                console.log('safetyNet');
                player.direction.safetyNet = true;
            }
    });
});
addEventListener('touchend', e => {
    e.preventDefault();
    [...e.changedTouches].forEach(touch => {
        const dot = document.getElementById(touch.identifier);
        dot.remove();
        if (touch.pageX < canvas.width / 2) {
                console.log('no right OR left OR dash');
                player.direction.right = false;
                player.direction.left = false;
                player.direction.dashLeft = false;
                player.direction.dashRight = false;
            }
        if (touch.pageX > canvas.width / 2) {
                console.log('no jump OR drop OR doubleJump OR net');
                player.direction.up = false;
                player.direction.down = false;
                player.direction.doubleJump = false;
                player.direction.safetyNet = false;
            }
    });
});

}}