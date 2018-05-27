// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var generateType = require("enemyPlaneDatas").generateType;

cc.Class({
    extends: cc.Component,
    properties: {

        prizeType: -1,//决定其是什么类型的奖品
        t: 1.0,

        jinbiRunFlag:true,//由于有些敌机会掉落金币，需要先将金币炸开，
        //然后飞向本方飞机，做 一个标记 ,正常飞机都可以飞，这种飞机需要先炸开之后飞
    },

    onLoad(){
        this.jinbiRunFlag =true;
    },



    update(dt) {

        // if (this.node.getPosition().y < -this.node.parent.height / 2) {
        //     this.node.destroy();
        // }

        if(this.prizeType == generateType.jinbi&&this.jinbiRunFlag == false) {
            return;
        }

        let ePos = this.node.parent.getComponent('Game').player.getPosition();
        let bPos = this.node.getPosition();
        let dx = ePos.x - bPos.x;
        let dy = ePos.y - bPos.y;

        let dis = Math.sqrt(dx * dx + dy * dy);
        let ndx = dx / dis;
        let ndy = dy / dis;

        if (this.prizeType != generateType.jinbi) {


            // let rdx = ndx * this.t;
            // let rdy = ndy * this.t;
            if ( dis< 80) {
                let speed = 10
                let rdx = ndx * speed;
                let rdy = ndy * speed;
                this.node.setPosition(bPos.x + rdx, bPos.y + rdy);

            } else {
                let speed = 3;
                this.node.setPosition(bPos.x, bPos.y - speed);
            }

           
        } else if (this.prizeType == generateType.jinbi) {
            
           
            let speed = 10;

            let rdx = ndx * speed;
            let rdy = ndy * speed;
            this.node.setPosition(bPos.x + rdx, bPos.y + rdy);

        }

       
    },

    normalizeVector: function (x, y) {

    },



    onCollisionEnter: function (other, self) {
        if (other.node.group === "hero") {

            //根据奖品类型来触发属性，game中的引用较多，直接传给game让其处理。
            switch (this.prizeType) {
                case generateType.jinbi:
                    cc.log("get jinbi!");
                    // var jinbiPrefab = cc.instantiate(this.prizeJinBi);
                    // this.node.addChild(jinbiPrefab);
                    // jinbiPrefab.setPosition(prizePosition);
                    // jinbiPrefab.getComponent("prize").prizeType = generateType.jinbi;
                    this.node.parent.getComponent("Game").getJinBi();
                    break;
                case generateType.wudichongci:
                    //cc.log("get wudichongci!");
                    //this.node.parent.getComponent("Game").getWuDiChongCi();
                    //todo
                    //other.node.getComponent("Player").wudichongci();
                    this.node.parent.getComponent("Game").getShield();
                    break;
                case generateType.xinjiaxue:
                    cc.log("get xinjiaxue!");
                    other.node.getComponent("Player").addBlood();
                    break;
                case generateType.jisushesu:
                    cc.log("get jisushesu!");
                    // other.node.getComponent("Player").raiseTheSpeedOfFire();
                    //播放火力提升动画
                    this.node.parent.getComponent("Game").fireBoostAni();
                    other.node.getComponent("Player").upgradePlane();
                    break;
                case generateType.huojianpao:
                    cc.log("get huojianpao!");
                    this.node.parent.getComponent("Game").getHuoJianPao();
                    break;
            }

            this.node.destroy();
        }

    },
});