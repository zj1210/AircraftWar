// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var heroPlaneID = require("heroPlaneID").heroPlaneID;
cc.Class({
    extends: cc.Component,

    properties: {
     

        spriteCoin:null,
        labelCoin:null,

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        soundSetting: {
            default: null,
            type: cc.Prefab,
        },

        settingButton:null,

        display: cc.Sprite,
    },

    start () {
       // this._isShow = true;
        this.tex = new cc.Texture2D();
    },

    // onClick () {
    //     this._isShow = !this._isShow;
    //     // 发消息给子域
    //     wx.postMessage({
    //         message: this._isShow ? 'Show' : 'Hide'
    //     })
    // },

    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update () {
        this._updaetSubDomainCanvas();
    },

  

   
    onLoad () {

         //适配
        //  let wx = cc.director.getVisibleSize().width*0.5;
        //  let hy = cc.director.getVisibleSize().height*0.5;
        //  this.spriteCoin = this.node.getChildByName("spriteCoin");
        //  this.spriteCoin.setPosition(this.spriteCoin.getContentSize().width/2-wx,hy-(this.spriteCoin.getContentSize().height/2));
        //  this.labelCoin = this.node.getChildByName("spriteCoin").getChildByName("coinLabel").getComponent(cc.Label);
        //  this.labelCoin.string = cc.sys.localStorage.getItem("jinBiCount");

        //  this.settingButton = this.node.getChildByName("soundSetting");
        //  this.settingButton.setPosition(this.settingButton.getContentSize().width / 2-wx,hy - this.spriteCoin.getContentSize().height-10 -(this.settingButton.getContentSize().height / 2));
       
        wx.postMessage({
                    message: "friendRank",
                });
     },



    goMain:function() {
        cc.audioEngine.playEffect(this.buttonAudio,false);
      
        cc.director.loadScene('start');
       

    },

    onSoundButtonClick:function() {
        cc.audioEngine.playEffect(this.buttonAudio,false);

        cc.eventManager.pauseTarget(this.node, true);
        let ss = cc.instantiate(this.soundSetting);
        ss.setPosition(0,0);

        ss.getComponent("sound").onWho = this.node;
        this.node.addChild(ss);

    },

});
