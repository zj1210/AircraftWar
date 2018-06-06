// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {


        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        reviveBtn: {
            default: null,
            type: cc.Node
        },

        reviveCountLabel: {
            default: null,
            type: cc.Node
        },

        ggBtn: {
            default: null,
            type: cc.Node
        },

        scoreLabel: {
            default: null,
            type: cc.Node
        },



        onWho: null,//在哪个页面上面，当当前页面消失时使得那个页面可点击
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.startFadeIn();

        //1 读取分数到分数label 2 读取复活卡个数 到复活卡个数label  根据复活个数 来设置复活按钮的开启与否 
        //另外一个免费按钮将来再说，需要对接之后
        //将来还需获得 下个超越的好友的 头像， 相差的分数 。  目前之做1

        let reviveCount = cc.sys.localStorage.setItem('reviveCount', 0);

        this.scoreLabel.getComponent(cc.Label).string = cc.sys.localStorage.getItem("currentScore");
        this.reviveCountLabel.getComponent(cc.Label).string = "X" + reviveCount;

        if (reviveCount > 0) {
            this.reviveBtn.getComponent(cc.Button).enabled = true;
        } else {
            this.reviveBtn.getComponent(cc.Button).enabled = false;
        }

    },

    countdownFUN: function () {

        this.dxLQ = this.dxLQ - 1;

        this.setTimeToLabel(this.dxLQ, this.countdownLQ);
        if (this.dxLQ <= 0) {
            this.lqBtn.getComponent(cc.Button).enabled = true;
            this.countdownLQ.active = false;
            this.unschedule(this.countdownFUN);
        }
    },

    countdownFUNGG: function () {

        this.dxGG = this.dxGG - 1;

        this.setTimeToLabel(this.dxGG, this.countdownGG);
        if (this.dxGG <= 0) {
            this.ggBtn.getComponent(cc.Button).enabled = true;
            this.countdownGG.active = false;
            this.unschedule(this.countdownFUNGG);
        }
    },

    setTimeToLabel: function (dx, labelNode) {
        let label = labelNode.getComponent(cc.Label);
        //dx-->3:50:49 
        //小时
        let h = parseInt(dx / 3600);
        let m = parseInt((dx - (3600 * h)) / 60);
        let s = parseInt(dx - h * 3600 - m * 60);
        //转为两位数
        //小时必然是，m<10,
        let sh = "0" + h;
        let sm = m;
        if (m < 10) {
            sm = "0" + m;
        }
        let ss = s;
        if (s < 10) {
            ss = "0" + s;
        }

        label.string = sh + ":" + sm + ":" + ss;
    },


    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.position = cc.p(0, 0);
        this.node.setScale(2);
        this.node.opacity = 0;

        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        let actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 1.0)), cbFadeIn);
        this.node.runAction(actionFadeIn);
    },
    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },





    onReviveClick: function () {
        cc.log("onReviveClick");
        cc.audioEngine.playEffect(this.buttonAudio, false);
        cc.eventManager.pauseTarget(this.node, true);




        let rc = parseInt(cc.sys.localStorage.getItem('reviveCount')) - 1;
        cc.sys.localStorage.setItem('reviveCount', rc);

        this.onWho.getComponent("Game").revive();


        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },

    onGuangGaoClick: function () {
        cc.log("onGuangGaoClick");
        cc.audioEngine.playEffect(this.buttonAudio, false);
        cc.eventManager.pauseTarget(this.node, true);


        this.onWho.getComponent("Game").revive();


        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(0.3, 0), cc.scaleTo(0.3, 2.0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },

    onFadeOutFinish: function () {
        cc.eventManager.resumeTarget(this.onWho, true);
        this.node.destroy();
    },


    onCancelClick: function () {
        cc.log("onCancelClick");
        cc.audioEngine.playEffect(this.buttonAudio, false);
        cc.eventManager.pauseTarget(this.node, true);

        cc.director.loadScene('end');
    },



});


