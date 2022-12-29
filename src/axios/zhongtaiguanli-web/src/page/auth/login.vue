<template>
    <div class="page">
        <div class="content">
            <div class="prefix">
                <div class="tag">
                    <img class="logo" src="./img/logo.png" alt />
                    <span class="name">九吨数据中台</span>
                </div>
            </div>
            <div class="focus">
                <el-form :model="form" :rules="rule" ref="form">
                    <el-form-item prop="username" class="form-item">
                        <el-input class="input" v-model="form.username" placeholder="请输入用户名" maxlength="30">
                            <template slot="suffix">
                                <div class="input-icon">
                                    <img src="./img/icon-username.png" alt />
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="form-item">
                        <el-input class="input" type="password" v-model="form.password" autocomplete="off"
                            placeholder="请输入密码" maxlength="30">
                            <template slot="suffix">
                                <div class="input-icon">
                                    <img src="./img/icon-password.png" alt />
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="submit-btn" type="primary" @click="onSubmitForm" :loading="loading">
                            {{ loading ? '登录中' : '登录' }}</el-button>
                    </el-form-item>
                </el-form>
                <div class="reset" @click="onResetForm">重置</div>
            </div>
        </div>

        <canvas ref="bg" class="bg"></canvas>
    </div>
</template>

<script>
import {
    validator_username
} from '@/config/rule'
import {
    mapActions,
    mapMutations
} from 'vuex'
import algorithm from '@/util/encryption.js'  // 加密解密
import {
    getDevice
} from '@/util/getDevice'
import {
    reject
} from 'q'
import {
    resolve
} from 'path'

export default {
    data() {
        return {
            form: {
                username: '',
                pass: '',
            },
            ztMac_H5: null, // 从h5发送过来的校验参数
            authfrom: null, // 插件校验参数来源
            rule: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur',
                },
                {
                    validator: validator_username,
                    trigger: 'blur',
                },
                ],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur',
                },],
            },
            loading: false,
        }
    },
    created() {
        this.checkH5()  // 校验h5的安全性

        this['RESET_MENU']

        document.onkeydown = () => {
            const key = window.event.keyCode

            if (key === 13) {
                this.onSubmitForm()
            }
        }
    },
    mounted() {
        this.renderBg()

    },
    methods: {
        ...mapMutations(['RESET_MENU']),
        ...mapActions(['LOGIN', 'getApp', 'GET_AUTH_MENU']),
        checkH5() {
            // 判断是否嵌套在h5，只有15s前端才会被识别为来源是H5验证
            const query = this.$route.query
            // 解码from 
            if (!query.from) return
            let unicode_from = algorithm.reconvert(query.from)
            let from_h5 = algorithm.decrypt(unicode_from) || null
            if (query.key && from_h5 == 'h5') {
                const { sendid, key } = query
                // 解码key
                let unicode_key = algorithm.reconvert(key)
                let ztMac = algorithm.decrypt(unicode_key) || null
                // 解码sendid  sendid其实就是时间戳
                let unicode_t = algorithm.reconvert(sendid)
                let t_h5 = algorithm.decrypt(unicode_t) || null
                const time = new Date().getTime()
                if ((time - t_h5) / 1000 < 13 && ztMac) {
                    this.ztMac_H5 = JSON.parse(ztMac)
                    this.authfrom = from_h5
                } else {
                    this.$message.warning('请重新从H5插件中进入后台系统！')
                }
            }
        },
        onSubmitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) return false
                let chromePluginId = localStorage.getItem('chromePluginId')
                const whitelle = ['zhongtai','gaohaoyu','zhaorenjie','admin'] // 登录校验白名单 
                if (whitelle.indexOf(this.form.username)>-1 || this.authfrom == 'h5') {
                    this.loginFun()
                } else if (!chromePluginId) {
                    this.$notify.info({
                        title: '操作提示',
                        message: `<br>1、请确保安装了辅助工具，未安装请联系项目中台相关同事；<br><br>2、请在辅助工具发起授权申请，联系项目中台相关同事进行授权认证！<br><br>3、如均已经完成上述操作，请<span style="color:red;font-size:16px;font-weight:bold">刷新当前页面</span>或<span style="color:red;font-size:16px;font-weight:bold">重新打开辅助工具</span>后再登陆操作！<br><br>4、移动端请从H5插件中发起授权并进入！<a href="http://pluginweb.chucitech.cn" target="_blank">点击进入H5插件</a> <br><br>5、错误提示处理方法：<a href="https://shimo.im/docs/gXqme9Ed8wtzNOqo" target="_blank">点击跳转</a><br>`,
                        dangerouslyUseHTMLString: true,
                        duration: 10000
                    })
                } else {
                    // 需要插件先校验
                    this.detectExtension(chromePluginId, response => {
                        if (response) {
                            // 调用插件的方法
                            try {
                                sendMessageToContentScriptByPostMessage(chromeResult => {
                                    if (chromeResult && chromeResult.mac_key) {
                                        // 已授权
                                        this.loginFun(chromeResult)
                                    } else if (chromeResult && chromeResult.err) {
                                        this.$message.error('请刷新当前页面！')
                                    } else {
                                        // 安装了插件未授权
                                        this.loginFun()
                                    }
                                })
                            } catch (error) {
                                // 不能调用插件里面的方法
                                this.$message.error('请刷新当前页面或重新打开辅助工具！')
                            }
                        } else {
                            // 卸载了插件又重新安装或者没有安装，浏览器缓存里面的插件id和新的id对不上
                            this.$message.error('辅助工具被卸载，请刷新当前页面！')
                            localStorage.removeItem('chromePluginId')
                        }
                    })
                }

            })
        },

        async loginFun(chromeResult = {}) {
            let {
                form
            } = this
            this.loading = true
            /**
             * 现在校验分为H5校验和pc端谷歌插件校验
             */
            if (this.authfrom == 'h5' && this.ztMac_H5 && this.ztMac_H5.mac_key) {
                form = Object.assign(form, this.ztMac_H5)
            } else {
                form = Object.assign(form, chromeResult)
            }
            const [err1, res1] = await this.LOGIN(form)
            if (err1) {
                this.loading = false
                return
            }

            const [err2, app] = await this.getApp()

            if (err2) {
                this.$notify.error({
                    title: '获取权限出错',
                    message: err1,
                })
                this.loading = false
                return
            }

            const [err3, menu] = await this.GET_AUTH_MENU({
                id: ''
            })

            this.loading = false

            if (err3) {
                this.$notify.error({
                    title: '获取权限出错',
                    message: err3,
                })
                return
            }

            this.$http.post('Action_Log/addAction', {
                target_name: '登录'
            })
            console.log(menu);
            if (menu.length) {
                this.$router.push({
                    path: menu[0].path
                })
            }else{
                this.$router.push({
                    path: "/count_center/all/home"
                })
            }
        },


        detectExtension(extensionId, callback) {
            let res = document.createElement('script');
            res.src = 'chrome-extension://' + extensionId + '/js/inject.js';
            document.body.appendChild(res);
            res.onload = () => {
                callback(true)
            };
            res.onerror = () => {
                callback(false)
            };

        },
        onResetForm() {
            this.$refs['form'].resetFields()
        },
        renderBg() {
            if (getDevice().mobile) {
                return
            }

            // 定义画布宽高和生成点的个数
            const WIDTH = window.innerWidth
            const HEIGHT = window.innerHeight
            const POINT = 25

            let canvas = this.$refs['bg']
            let context = canvas.getContext('2d')
            let circleArr = []

                ;
            (canvas.width = WIDTH), (canvas.height = HEIGHT)

            context.strokeStyle = 'rgba(0, 0, 0,0.8)'
            context.strokeWidth = 1
            context.fillStyle = 'rgba(0, 0, 0,0.1)'

            // 线条：开始xy坐标，结束xy坐标，线条透明度
            function Line(x, y, _x, _y, o) {
                this.beginX = x
                this.beginY = y
                this.closeX = _x
                this.closeY = _y
                this.o = o
            }

            // 点：圆心xy坐标，半径，每帧移动xy的距离
            function Circle(x, y, r, moveX, moveY) {
                this.x = x
                this.y = y
                this.r = r
                this.moveX = moveX
                this.moveY = moveY
            }

            // 生成max和min之间的随机数
            function num(max, _min) {
                let min = arguments[1] || 0

                return Math.floor(Math.random() * (max - min + 1) + min)
            }

            // 绘制原点
            function drawCricle(cxt, x, y, r, moveX, moveY) {
                let circle = new Circle(x, y, r, moveX, moveY)
                cxt.beginPath()
                cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
                cxt.closePath()
                cxt.fill()
                return circle
            }

            // 绘制线条
            function drawLine(cxt, x, y, _x, _y, o) {
                let line = new Line(x, y, _x, _y, o)
                cxt.beginPath()
                cxt.strokeStyle = 'rgba(0, 0, 0,' + o + ')'
                cxt.moveTo(line.beginX, line.beginY)
                cxt.lineTo(line.closeX, line.closeY)
                cxt.closePath()
                cxt.stroke()
            }

            // 初始化生成原点
            function init() {
                circleArr = []
                for (let i = 0; i < POINT; i++) {
                    circleArr.push(
                        drawCricle(
                            context,
                            num(WIDTH),
                            num(HEIGHT),
                            num(15, 2),
                            num(10, -10) / 40,
                            num(10, -10) / 40
                        )
                    )
                }
                draw()
            }

            // 每帧绘制
            function draw() {
                context.clearRect(0, 0, canvas.width, canvas.height)

                for (let i = 0; i < POINT; i++) {
                    drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
                }

                for (let i = 0; i < POINT; i++) {
                    for (let j = 0; j < POINT; j++) {
                        if (i + j < POINT) {
                            let A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                                B = Math.abs(circleArr[i + j].y - circleArr[i].y)
                            let lineLength = Math.sqrt(A * A + B * B)
                            let C = (1 / lineLength) * 7 - 0.009
                            let lineOpacity = C > 0.03 ? 0.03 : C

                            if (lineOpacity > 0) {
                                drawLine(
                                    context,
                                    circleArr[i].x,
                                    circleArr[i].y,
                                    circleArr[i + j].x,
                                    circleArr[i + j].y,
                                    lineOpacity
                                )
                            }
                        }
                    }
                }
            }

            // 调用执行
            init()

            this.renderTimer = setInterval(function () {
                for (let i = 0; i < POINT; i++) {
                    let cir = circleArr[i]
                    cir.x += cir.moveX
                    cir.y += cir.moveY
                    if (cir.x > WIDTH) cir.x = 0
                    else if (cir.x < 0) cir.x = WIDTH
                    if (cir.y > HEIGHT) cir.y = 0
                    else if (cir.y < 0) cir.y = HEIGHT
                }
                draw()
            }, 16)
        },
    },
}
</script>

<style lang="less" scoped>
.page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .content {
        height: 327px;
        border-radius: 4px;
        z-index: 2;
        display: flex;

        .prefix {
            width: 152px;
            height: 100%;
            padding: 30px 0;
            position: relative;
            overflow: hidden;
            background-color: rgba(37, 45, 72, 1);

            .tag {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .logo {
                    width: 15px;
                    height: 20px;
                    margin-right: 5px;
                }

                .name {
                    font-size: 12px;
                    color: #fff;
                    letter-spacing: 1px;
                }
            }
        }

        .focus {
            width: 420px;
            height: 100%;
            padding: 60px 40px 0;
            background-color: #fff;

            .form-item {
                margin-bottom: 30px;

                /deep/.el-form-item__error {
                    padding-top: 8px;
                }
            }

            .input {
                /deep/.el-input__inner {
                    padding-right: 40px;
                    background-color: rgba(242, 244, 247, 0.5);
                    border-color: #e6e6e6;
                    font-size: 12px;
                }

                .input-icon {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;

                    img {
                        width: 14px;
                        height: 14px;
                    }
                }
            }

            .submit-btn {
                width: 100%;
                border-radius: 2px;
                background-color: #5291ec;
                letter-spacing: 1px;
                font-size: 14px;
            }

            .reset {
                width: 100%;
                font-size: 12px;
                color: #5291ec;
                text-align: center;
                cursor: pointer;
                transform: translateY(-10px);
                letter-spacing: 1px;
            }
        }
    }

    .bg {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
}
</style>