# 移动端扫二维码



::: code-group
```bash [npm]
npm install html5-qrcode
```
```bash [pnpm]
pnpm add html5-qrcode
```
```bash [yarn]
yarn add html5-qrcode
```
:::

### 简单实现demo

```html
<div id="qr-reader" style="width: 300px"></div> 
<div id="qr-reader-results"></div>
```



```js
const html5QrCodeInstance = ref<any>(null);

// 打开扫描
const openScanQr = async () => {
	showOverlay.value = true;
	await nextTick();
	Html5Qrcode.getCameras()
		.then((devices) => {
			if (devices && devices.length) {
				html5QrCodeInstance.value || (html5QrCodeInstance.value = new Html5Qrcode('scan-qr-render'));
				startScan();
			}
		})
		.catch((err) => {
			showToast({
				message: '摄像头无访问权限！',
				duration: 2000
			});
			console.log('请注意开发环境中，只有在https协议下，才能调起摄像头权限！！！');
			showOverlay.value = false;
		});
};

// 
```





```vue
<script setup lang="ts" name="Profile">
import { showDialog } from 'vant';
import { useRouter } from 'vue-router';
import { Html5Qrcode } from 'html5-qrcode';
import { useUserStore } from '@/frame/store';
import defaultAvatar from '@/assets/img/default-avatar.png';
import * as Storage from '@/frame/utils/storage';
import TARGET_CONFIG from '@/frame/config/config';
import { Icon } from 'vant';

const {
	TOKEN_STORAGE,
	LOGIN_PATH,
	CONST: { ACCESS_TOKEN }
} = TARGET_CONFIG;

const router = useRouter();
const userStore = useUserStore();
const userInfo = computed(() => userStore.info);
const isLogin = computed(() => userStore.isLogin);
const accessToken = computed(() => Storage[TOKEN_STORAGE].get(ACCESS_TOKEN));

const showOverlay = ref(false);
const html5QrCodeInstance = ref<any>(null);

const login = () => {
	if (isLogin.value && accessToken.value) {
		router.push({ path: '/userInfo' });
	} else {
		router.push({ path: LOGIN_PATH, query: { redirect: '/profile' } });
	}
};

const spreadDialog = async () => {
	showDialog({
		message: '前期推广火热进行中，为回馈广大用户的支持，会员免费试用，无需任何费用，即可畅享会员专属服务。',
		theme: 'round-button',
		teleport: document.querySelector('#profile'),
		className: 'profile-custom-dialog',
		messageAlign: 'left',
		confirmButtonColor: '#E50E03',
		confirmButtonText: '确定',
		closeOnPopstate: false
	})
};

const userMenuList = [
	{
		title: "我的简历",
		path: "/resume",
		icon: h("i", {
			class: "icon iconfont-sys iconsys-tickets",
			style: {
				color: "#19a0f5"
			}
		 })
	},
	{
		title: "选职要求",
		path: "/requirement",
		icon: h("i", {
			class: "icon iconfont-sys iconsys-list-disorder",
			style: {
				color: "#ff9300"
			}
		})
	},
	{
		title: "我的消息",
		path: "/message",
		icon: h("i", {
			class: "icon iconfont-sys iconsys-pinglun_3",
			style: {
				color: "#f24444"
			}
		})
	},
	{
		title: "人工客服",
		path: "/service",
		icon: h("i", {
			class: "icon iconfont-sys iconsys-kefu_2",
			style: {
				color: "#45a0fa"
			}
		})	
	},
	{
		title: "我的定位",
		path: "/location",
		icon: h("i", {
			class: "icon iconfont-sys iconsys-dingwei1",
			style: {
				color: "#ffb100"
			}
		})
	},
	{
		title: "设置",
		path: "/settings",
		icon: h(Icon, {
			class: "icon",
			color: "#26a8f8",
			name: "setting-o"
		}),
		handle() {
			router.push({ path: '/settings' });
		}
	}
]

const openScanQr = async () => {
	showOverlay.value = true;
	await nextTick();
	Html5Qrcode.getCameras()
		.then((devices) => {
			if (devices && devices.length) {
				html5QrCodeInstance.value || (html5QrCodeInstance.value = new Html5Qrcode('scan-qr-render'));
				startScan();
			}
		})
		.catch((err) => {
			showToast({
				message: '摄像头无访问权限！',
				duration: 2000
			});
			console.log('请注意开发环境中，只有在https协议下，才能调起摄像头权限！！！');
			showOverlay.value = false;
		});
};

const startScan = () => {
	html5QrCodeInstance.value
		.start(
			{ facingMode: 'environment' },
			{
				fps: 1,
				qrbox: { width: 250, height: 250 }
			},
			(decodedText: any) => {
				stopScan();
				try {		
					new URL(decodedText);
					const result = window.open(decodedText, '_blank');
					if (!result) {
						showDialog({
							title: '结果被拦截是否打开？',
							message: decodedText,
							confirmButtonText: '确定'
						}).then(() => {
							window.open(decodedText, '_blank');
						})
					}
				} catch {
					showDialog({
						title: '扫描结果',
						message: decodedText,
						confirmButtonText: '确定'
					});
				}
			}
		)
		.catch((err: any) => {
			showDialog({
				title: '扫描失败',
				message: JSON.stringify(err),
				confirmButtonText: '确定'
			});
		});
};

const stopScan = () => {
	html5QrCodeInstance.value.stop().then(() => {
		showOverlay.value = false;
	});
};

onUnmounted(() => {
	if (html5QrCodeInstance.value && html5QrCodeInstance.value.isScanning) {
		stopScan();
	}
});
</script>

<template>
	<div class="page-content container" id="profile">
		<div class="header">
			<div class="avatar" @click="login">
				<img :src="userInfo.avatar || defaultAvatar" alt="用户头像" class="avatarImg" v-if="accessToken" />
				<img :src="defaultAvatar" alt="默认用户头像" class="avatarImg" v-else />
			</div>
			<div class="info">
				<div class="info-content">
					<div class="name" @click="login">{{ userInfo.name ?? '管理员' }}</div>
					<div class="role">
						<div class="goldVip">
							<img src="@/demo/assets/img/profile/vip.png" alt="黄金会员">
							<span>黄金会员</span>
						</div>
					</div>
				</div>
				<div class="vipEndTime">
					会员有效期至{{ '2025-09-02'}}
				</div>
			</div>
			<div class="scan-qr" @click="openScanQr">
				<van-icon name="scan" size="18" />
			</div>
		</div>
		<div class="spread" @click="spreadDialog">
			<img class="bg" src="@/demo/assets/img/profile/组 34572.png">
			<div class="spread-content">
				<div class="icon">
					<img src="@/demo/assets/img/profile/vip.png" alt="黄金会员">
				</div>
				<div class="content">
					<div class="vip"><b>VIP</b><span>Suitex移动端会员</span></div>
					<div class="desc">尊享12项专属特权</div>
				</div>
				<div class="open-vip-btn">
					<div>立即开通</div>
				</div>
			</div>
		</div>

		<van-row gutter="10" class="function-list">
			<van-col span="8">
				<div class="item notice">
					<div class="content">
						<div class="icon"><img src="@/demo/assets/img/profile/组 34545.png" alt="关注公告" /></div>
						<span>关注公告</span>
					</div>
				</div>
			</van-col>
			<van-col span="8">
				<div class="item job">
					<div class="content">
						<div class="icon"><img src="@/demo/assets/img/profile/组 34547.png" alt="意向职位" /></div>
						<span>意向职位</span>
					</div>
				</div>
			</van-col>
			<van-col span="8">
				<div class="item plan">
					<div class="content">
						<div class="icon"><img src="@/demo/assets/img/profile/组 34549.png" alt="备考计划" /></div>
						<span>备考计划</span>
					</div>
				</div>
			</van-col>
		</van-row>

		<div class="user-menu">
			<VanCellGroup :inset="true" class="user-menu-group">
				<van-cell is-link v-for="item in userMenuList" :title="item.title" @click="item.handle">
					<template #icon>
						<component :is="item.icon"></component>
					</template>
				</van-cell>
			</VanCellGroup>
		</div>

		<van-overlay :show="showOverlay" @click="stopScan">
			<div class="wrapper">
				<div id="scan-qr-render"></div>
			</div>
		</van-overlay>
	</div>
</template>
<style lang="scss" scoped>
#profile {
	background: url('@/demo/assets/img/profile/bj.png') no-repeat;
	background-size: 100%;
	display: flex;
	flex-direction: column;
	* {
		user-select: none;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 15px;
		margin-top: 8px;
		margin-bottom: 20px;
		.avatar {
			width: 70px;
			height: 70px;
			box-sizing: border-box;
			border-radius: 50%;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		.info {
			flex: 1;
			padding-left: 20px;
			display: flex;
			flex-direction: column;
			column-gap: 14px;
			.info-content {
				display: flex;
				align-items: center;
				.name {
					font-size: 20px;
					font-weight: 600;
					margin-right: 8px;
				}
				.role {
					.goldVip {
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 4px 9px;
						color: #999;
						background: url("@/demo/assets/img/profile/组 20878.png") no-repeat;
						background-size: cover;
						// 从左到右的线性渐变
						border-radius: 20px;
						color: #724B00;
						font-size: 10px;
						img {
							width: 12px;
							height: 12px;
						}
					}
				}
			}
			.vipEndTime {
				font-size: 12px;
				color: #393F55;
			}
		}
		.scan-qr {
			display: flex;
			align-items: center;
		}
	}
	.spread {
		position: relative;
		margin-bottom: 14px;
		.bg {
			width: 100%;
		}
		.spread-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			align-items: stretch;
			column-gap: 6px;
			padding: 15px 20px;
			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				row-gap: 4px;
				.vip {
					display: flex;
					column-gap: 8px;
					color: #fff;
					b {
						line-height: 1;
						font-size: 29px;
						font-family:
							Alibaba PuHuiTi,
							Alibaba PuHuiTi;
					}
				}
				.desc {
					font-size: 12px;
					color: #969AAF;
					display: flex;
					align-items: center;
					line-height: 1;
				}
			}
			.open-vip-btn { 
				display: flex;
				justify-content: end;
				align-items: center;
				div {
					background: linear-gradient( 90deg, #FCE6BE 0%, #EBCA7B 100%);
					border-radius: 6px;
					color: #403316;
					font-size: 13px;
					padding: 7px 14px;
				}
			}	
		}
		
	}
	.function-list {
		margin-bottom: 16px;
		.item {
			position: relative;
			border-radius: 12px;
			.bg {
				width: 100%;
			}
			.content {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				transform: translateY(-12%);
			}
			&.notice {
					background: linear-gradient( 180deg, #FFF4D9 0%, #FDFDEE 100%);
					border: 2px solid #FFF0CD;
			}
			&.job {
					background: linear-gradient( 180deg, #E3F0FE 0%, #ECFCFF 100%);
					border: 2px solid #D6EBFF;
			}
			&.plan {
					background: linear-gradient( 180deg, #F4EBFF 0%, #FBF5FF 100%);
					border: 2px solid #F1DEFC; 
			}
		}
	}
	.user-menu {
		:deep(.icon) {
			margin-right: 12px;
			display: flex;
			align-items: center;
		}
	}
}

:deep(.profile-custom-dialog) {
	.van-dialog__message {
		background: url('@/demo/assets/img/profile/蒙版组 362.png') no-repeat;
		background-size: 100%;
		padding: 42px 40px;
		font-size: 16px;
		line-height: 26px;
		letter-spacing: 1px;
	}
	.van-dialog__footer {
		padding-left: 68px;
		padding-right: 68px;
		.van-dialog__confirm {
			height: 42px;
			.van-button__text {
				font-size: 16px;
				letter-spacing: 2px;
			}
		}
	}
}
.wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	#scan-qr-render {
		width: 80%;
		height: 80%;
	}
}
</style>
```



