var canvas1 = document.getElementById("canvas1");
var context = canvas1.getContext('2d');
var canvasbig = document.getElementsByClassName("canvasbig")[0];
//背景图片
var bg = new Image();
bg.src = "img/bg.jpg";
//全民飞机大战标题
var starthead = new Image();
starthead.src = "img/starthead.png";
//我方战斗机
var myplane = new Image();
myplane.src = "img/myplane1.png";
var myplaneX = canvas1.width / 2,
    myplaneY = 730;
//战斗机子弹
var bullet = new Image();
bullet.src = "img/bullet.png";
var bullettime = 0,
    bulletnum = 0,
    bulletarr = [];
// 敌方子弹
var enemyBulletArr = [];

//敌机
var enemytime = 0,
    enemyarr = [];
var enemy1 = new Image();
enemy1.src = `img/enemy1.png`;
var enemy2 = new Image();
enemy2.src = `img/enemy2.png`;
var enemy3 = new Image();
enemy3.src = `img/enemy3.png`;
var enemy4 = new Image();
enemy4.src = `img/enemy4.png`;
var enemyall = [enemy1, enemy2, enemy3, enemy4];
//战斗机爆炸
var myplane1boom = new Image();
var myboomnum = 1,
    myboomtime = 0;
//敌机爆炸
var enemychangearr = [];
//boss警告
var warning1 = new Image();
warning1.src = "img/warning1.png"
var warning2 = new Image();
warning2.src = "img/warning2.png";
var warningtime = 0,
    warningchange = 0;
//boss出场背景
var bossbg = new Image();
bossbg.src = "img/bg2.jpg";
var boss = new Image();
boss.src = "img/planeboss.png";
//boss改变飞机速度
var bossattacktime = 0;
var bossattacknum = 1;

// ========== 10秒弹窗（使用原生confirm）==========
var gameStartTime = null;
var adShown = false;
var isPaused = false;

function showAdModal() {
    if (adShown) return;
    adShown = true;
    isPaused = true;
    
    var result = confirm("🎁 恭喜获得游戏大礼包！\n\n点击「确定」跳转百度领取福利");
    
    if (result) {
        window.location.href = "https://www.baidu.com";
    } else {
        isPaused = false;
    }
}

function checkAndShowAd() {
    if (adShown) return;
    if (gameStartTime === null) return;
    if ((Date.now() - gameStartTime) / 1000 >= 10) {
        showAdModal();
    }
}
// ================================================

var obj = {
    gamestart: 1,
    gamerun: 0,
    gameover: 0,
    dead: 0,
    score: 0,
    life: 3,
    bgy1: -854,
    bgy2: 0,
    warnon: 0,
    bosstime: 0,
    bossattack: 0,
    bgon: function () {
        context.drawImage(bg, 0, this.bgy1, 520, 854);
        context.drawImage(bg, 0, this.bgy2, 520, 854);
    },
    bgchange: function () {
        this.bgy1++;
        this.bgy2++;
        if (this.bgy1 == 0) {
            this.bgy1 = -854;
            this.bgy2 = 0;
        }
    },
    scoring: function () {
        var gradient = context.createLinearGradient(0, 0, 120, 60);
        gradient.addColorStop(0, '#ff9569');
        gradient.addColorStop(1, '#e92758');
        context.font = '30px  sans-serif';
        context.fillStyle = gradient;
        context.fillText("SCORE:" + this.score, 10, 50);
    },
    lifeing: function () {
        context.font = '30px  sans-serif';
        context.fillStyle = "#D28140";
        context.fillText("LIFE:" + this.life, 400, 50);
        if (obj.dead == 1 && myboomnum == 9 && obj.life > 0) {
            obj.dead = 0;
            bullettime = 0;
            bulletnum = 0;
            bulletarr = [];
            enemyBulletArr = [];
            enemytime = 0;
            enemyarr = [];
            myboomnum = 1;
            myboomtime = 0;
            enemychangearr = [];
            myplane1boom.src = `img/myplane1boom${myboomnum}.png`;
        } else if (obj.dead == 1 && obj.life == 0) {
            obj.gameover = 1;
        }
    },
    gameovering: function () {
        if (obj.gameover == 1) {
            obj.gamestart = 1;
            obj.gameover = 0;
            obj.dead = 0;
            obj.gamerun = 0;
            enemyBulletArr = [];
        }
    },
    starting: function () {
        canvasdiv.className = "canvasdiv";
        obj.life = 3;
        obj.score = 0;
        myplaneX = canvas1.width / 2;
        myplaneY = 730;
        bullettime = 0;
        bulletnum = 0;
        bulletarr = [];
        enemyBulletArr = [];
        enemytime = 0;
        enemyarr = [];
        myboomnum = 1;
        myboomtime = 0;
        enemychangearr = [];
        warningtime = 0;
        warningchange = 0;
        bossattacktime = 0;
        bossattacknum = 1;
        obj.bossbgy1 = -2420,
        obj.bossbgy2 = -1640,
        obj.bossbgy3 = -860,
        obj.bg2boss = -262,
        obj.bosstimeblur = true,
        obj.bossattack = 0;
        context.drawImage(starthead, 110, 200);
    },
    myplane: function (e) {
        var rect = canvas1.getBoundingClientRect();
        var scaleX = canvas1.width / rect.width;
        var scaleY = canvas1.height / rect.height;
        var clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        var canvasX = (clientX - rect.left) * scaleX;
        var canvasY = (clientY - rect.top) * scaleY;
        
        if (e.touches) {
            canvasY = canvasY - 50;
        }
        
        canvasX = Math.min(Math.max(canvasX, myplane.width / 2), canvas1.width - myplane.width / 2);
        canvasY = Math.min(Math.max(canvasY, myplane.height / 2), canvas1.height - myplane.height / 2);
        
        myplaneX = canvasX;
        myplaneY = canvasY;
    },
    bulleton: function () {
        bullettime++;
        var bulletX = myplaneX - bullet.width / 2;
        var bulletY = myplaneY - myplane.height / 2 - bullet.height;
        var num;
        if (obj.bossattack == 1) {
            num = 10
        }else{
            num = 20
        }
        if (bullettime >= num) {
            var changearr = [bulletX, bulletY, 0];
            bulletarr.push(changearr);
            bullettime = 0;
        }
    },
    bulletchange: function () {
        var result = [];
        for (var i = 0; i < bulletarr.length; i++) {
            if (bulletarr[i][1] - bulletarr[i][2] >= 0) {
                context.drawImage(bullet, bulletarr[i][0], bulletarr[i][1] - bulletarr[i][2]);
                bulletarr[i][2] += 4;
                result.push(bulletarr[i]);
            }
        }
        bulletarr = result;
    },
    
    enemyShoot: function() {
        for (var i = 0; i < enemyarr.length; i++) {
            var enemy = enemyarr[i];
            var shootRate = 0.003;
            if (enemy[3] == 3) {
                shootRate = 0.006;
            }
            if (Math.random() < shootRate) {
                var enemyW = enemyall[enemy[3]].width;
                var enemyH = enemyall[enemy[3]].height;
                var bulletX = enemy[0] + enemyW / 2 - 4;
                var bulletY = enemy[1] + enemy[2] + enemyH;
                enemyBulletArr.push([bulletX, bulletY, 0]);
            }
        }
    },
    
    enemyBulletChange: function() {
        var result = [];
        for (var i = 0; i < enemyBulletArr.length; i++) {
            if (enemyBulletArr[i][1] + enemyBulletArr[i][2] <= canvas1.height) {
                context.fillStyle = "#ff3300";
                context.shadowBlur = 5;
                context.shadowColor = "#ff0000";
                context.fillRect(enemyBulletArr[i][0], enemyBulletArr[i][1] + enemyBulletArr[i][2], 8, 12);
                context.fillStyle = "#ffaa66";
                context.fillRect(enemyBulletArr[i][0] + 2, enemyBulletArr[i][1] + enemyBulletArr[i][2] + 2, 4, 6);
                context.shadowBlur = 0;
                enemyBulletArr[i][2] += 5;
                result.push(enemyBulletArr[i]);
            }
        }
        enemyBulletArr = result;
    },
    
    enemyBulletHitPlayer: function() {
        if (obj.dead == 1) return;
        for (var i = 0; i < enemyBulletArr.length; i++) {
            var bullet = enemyBulletArr[i];
            var bulletX = bullet[0];
            var bulletY = bullet[1] + bullet[2];
            var playerLeft = myplaneX - myplane.width / 2;
            var playerRight = myplaneX + myplane.width / 2;
            var playerTop = myplaneY - myplane.height / 2;
            var playerBottom = myplaneY + myplane.height / 2;
            
            if (bulletX + 8 > playerLeft && bulletX < playerRight &&
                bulletY + 12 > playerTop && bulletY < playerBottom) {
                enemyBulletArr.splice(i, 1);
                obj.myplaneboom();
                break;
            }
        }
    },
    
    enemy: function () {
        enemytime++;
        var enemynum = parseInt(Math.random() * 4);
        var num;
        if (obj.bossattack == 1) {
            num = 10
        }else{
            num = 25
        }
        if (enemytime >= num) {
            if (enemynum == 3 && Math.random() < 0.9) {
                return;
            } else {
                var enemylife = 1
                if (enemynum == 3) {
                    enemylife = 5
                }
                var changearr = [Math.random() * (520 - enemyall[enemynum].width), -enemyall[enemynum].height, 0, enemynum, enemylife];
                enemyarr.push(changearr);
                enemytime = 0;
            }
        }
    },
    enemychange: function () {
        var result = [];
        if (obj.bossattack == 1) {
            bossattacktime++;
            if (bossattacktime == 80) {
                bossattacknum += 0.05;
                bossattacktime = 0;
            }
        }
        for (let i = 0; i < enemyarr.length; i++) {
            if (enemyarr[i][1] + enemyarr[i][2] <= canvas1.height) {
                context.drawImage(enemyall[enemyarr[i][3]], enemyarr[i][0], enemyarr[i][1] + enemyarr[i][2]);
                if (enemyall[enemyarr[i][3]] == enemy4) {
                    enemyarr[i][2] += 1.5 * bossattacknum;
                } else {
                    enemyarr[i][2] += 2 * bossattacknum;
                }
                result.push(enemyarr[i]);
            }
        }
        enemyarr = result;
    },
    myplaneboom: function () {
        if (obj.dead == 1) return;
        obj.dead = 1;
        myboomnum = 1;
        myboomtime = 0;
    },
    myplaneboomAnimate: function () {
        if (obj.dead == 1) {
            myboomtime++;
            if (myboomtime >= 5) {
                if (myboomnum <= 8) {
                    myplane1boom.src = `img/myplane1boom${myboomnum}.png`;
                }
                myboomnum++;
                myboomtime = 0;
            }
            if (myboomnum <= 8) {
                context.drawImage(myplane1boom, myplaneX - myplane.width / 2, myplaneY - myplane.height / 2);
            }
            if (myboomnum >= 9) {
                obj.life -= 1;
                bulletarr = [];
                enemyBulletArr = [];
                enemyarr = [];
                myplaneX = canvas1.width / 2;
                myplaneY = 750;
                obj.dead = 0;
                myboomnum = 1;
                if (obj.life <= 0) {
                    obj.gameover = 1;
                }
            }
        }
    },
    myplaneisbroke: function () {
        if (obj.dead == 1) return;
        for (let i = 0; i < enemyarr.length; i++) {
            var enemy = enemyarr[i];
            var enemyW = enemyall[enemy[3]].width;
            var enemyH = enemyall[enemy[3]].height;
            var enemyLeft = enemy[0];
            var enemyRight = enemy[0] + enemyW;
            var enemyTop = enemy[1] + enemy[2];
            var enemyBottom = enemy[1] + enemy[2] + enemyH;
            var playerLeft = myplaneX - myplane.width / 2;
            var playerRight = myplaneX + myplane.width / 2;
            var playerTop = myplaneY - myplane.height / 2;
            var playerBottom = myplaneY + myplane.height / 2;
            
            if (enemyRight > playerLeft && enemyLeft < playerRight &&
                enemyBottom > playerTop && enemyTop < playerBottom) {
                obj.myplaneboom();
                return;
            }
        }
    },
    enemyboom: function () {
        var result = [];
        for (let i = 0; i < enemychangearr.length; i++) {
            enemychangearr[i][3]++;
            if (enemychangearr[i][3] >= 10) {
                if (enemychangearr[i][4] <= 5) {
                    enemychangearr[i][5].src = `img/enemy${enemychangearr[i][2]}boom${enemychangearr[i][4]}.png`;
                }
                enemychangearr[i][4]++;
                enemychangearr[i][3] = 0;
            }
            if (enemychangearr[i][4] <= 5) {
                context.drawImage(enemychangearr[i][5], enemychangearr[i][0], enemychangearr[i][1]);
                result.push(enemychangearr[i]);
            }
        };
        enemychangearr = result;
    },
    enemyisbroke: function () {
        for (let i = 0; i < bulletarr.length; i++) {
            var bulletItem = bulletarr[i];
            var bulletLeft = bulletItem[0];
            var bulletRight = bulletItem[0] + bullet.width;
            var bulletTop = bulletItem[1] - bulletItem[2];
            var bulletBottom = bulletItem[1] - bulletItem[2] + bullet.height;
            
            for (let x = 0; x < enemyarr.length; x++) {
                var enemy = enemyarr[x];
                var enemyW = enemyall[enemy[3]].width;
                var enemyH = enemyall[enemy[3]].height;
                var enemyLeft = enemy[0];
                var enemyRight = enemy[0] + enemyW;
                var enemyTop = enemy[1] + enemy[2];
                var enemyBottom = enemy[1] + enemy[2] + enemyH;
                
                if (bulletRight > enemyLeft && bulletLeft < enemyRight &&
                    bulletBottom > enemyTop && bulletTop < enemyBottom) {
                    enemy[4]--;
                    bulletarr.splice(i, 1);
                    i--;
                    if (enemy[4] <= 0) {
                        var enemyboomImg = new Image();
                        var boomType = enemy[3] + 1;
                        enemychangearr.push([enemy[0], enemy[1] + enemy[2], boomType, 0, 1, enemyboomImg]);
                        if (enemy[3] == 3) {
                            obj.score += 10;
                        } else {
                            obj.score += 2;
                        }
                        enemyarr.splice(x, 1);
                    }
                    break;
                }
            }
        }
    },
    warning: function () {
        warningchange++;
        warningtime++;
        if (warningtime >= 20) {
            context.drawImage(warning1, 150, 200);
            context.drawImage(warning2, 190, 400);
            if (warningtime >= 80) {
                warningtime = 0;
            }
        }
        if (warningchange == 500) {
            obj.warnon = 0;
            obj.bosstime = 1;
        }
    },
    bossbgy1: -2420,
    bossbgy2: -1640,
    bossbgy3: -860,
    bg2boss: -262,
    bosstimeblur: true,
    bossbgon: function () {
        context.drawImage(bossbg, 0, this.bossbgy1)
        context.drawImage(bossbg, 0, this.bossbgy2);
        context.drawImage(bossbg, 0, this.bossbgy3);
        if (obj.bosstime == 1) {
            context.drawImage(boss, 0, this.bg2boss);
        }
    },
    bossbgchange: function () {
        this.bossbgy1 += 2;
        this.bossbgy2 += 2;
        this.bossbgy3 += 2;
        this.bg2boss += 2;
        if (this.bg2boss == 800) {
            this.bosstime = 0;
            this.bossattack = 1;
        };
        if (this.bossbgy3 == 800) {
            this.bossbgy1 = -1540;
            this.bossbgy2 = -760;
            this.bossbgy3 = 20;
        }
    },
    gua: function () {
        enemychangearr = [];
        enemyBulletArr = [];
        for (let x = 0; x < enemyarr.length; x++) {
            var enemyboom = new Image();
            enemychangearr.push([enemyarr[x][0], enemyarr[x][1] + enemyarr[x][2], enemyarr[x][3] + 1, 0, 1, enemyboom]);
        }
        enemyarr = [];
    }
}

// 主游戏循环
setInterval(function () {
    obj.bgon();
    obj.bgchange();
    if (obj.gamestart == 1) {
        obj.starting();
    }
    if (isPaused) return;
    
    if (obj.gamerun == 1) {
        if (obj.score >= 300 && obj.bosstimeblur == true) {
            obj.warnon = 1;
            obj.gua();
            obj.bosstimeblur = false;
        }
        if (obj.bosstime == 1 || obj.bossattack == 1) {
            obj.bossbgon();
            obj.bossbgchange();
        }
        if (obj.dead == 0) {
            context.drawImage(myplane, myplaneX - myplane.width / 2, myplaneY - myplane.height / 2);
            if (obj.bosstime == 0 && obj.warnon == 0) {
                obj.enemy();
                obj.enemychange();
                obj.enemyShoot();
            }
            obj.bulleton();
            obj.bulletchange();
            obj.enemyBulletChange();
            obj.enemyBulletHitPlayer();
            if (obj.warnon == 1) {
                obj.warning();
            }
        }
        obj.myplaneboomAnimate();
        obj.myplaneisbroke();
        obj.enemyisbroke();
        obj.enemyboom();
        obj.lifeing();
        obj.gameovering();
        obj.scoring();
        
        checkAndShowAd();
    }
}, 16)

// 事件绑定
var canvasdiv = document.getElementsByClassName("canvasdiv")[0];
canvasdiv.onclick = function () {
    canvasdiv.className = "canvasdiv none";
    obj.gamestart = 0;
    obj.gamerun = 1;
    gameStartTime = Date.now();
    adShown = false;
}

canvas1.onmousemove = function (e) {
    if (obj.gamerun == 1 && obj.dead == 0 && !isPaused) {
        obj.myplane(e);
        this.style.cursor = "none";
    } else {
        this.style.cursor = "";
    }
}

// 触摸事件（真实手机用）
canvas1.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (obj.gamerun == 1 && obj.dead == 0 && !isPaused) {
        obj.myplane(e);
    }
}, { passive: false });

canvas1.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (obj.gamerun == 1 && obj.dead == 0 && !isPaused) {
        obj.myplane(e);
    }
}, { passive: false });

document.onkeydown = function (event) {
    if (event.keyCode == 8 && obj.gamerun == 1) {
        obj.gua();
    };
}