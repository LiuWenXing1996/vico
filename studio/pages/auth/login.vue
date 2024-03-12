<template>
    <n-card :bordered="false" style="height: 100%" content-style="padding:0;height:100%">
        <div class="login-set">
            <n-space>
                <n-switch v-model:value="darkTheme" size="medium">
                    <template #checked-icon>
                        <n-icon :size="14">
                            <NuxtIcon name="moon-outline" />
                        </n-icon>
                    </template>
                    <template #unchecked-icon>
                        <n-icon :size="14">
                            <NuxtIcon name="sunny-outline" />
                        </n-icon>
                    </template>
                </n-switch>
            </n-space>
        </div>
        <div class="login">
            <div class="login-content">
                <n-h1>欢迎👏🏻</n-h1>
                <n-form autocomplete="off" :rules="rules" ref="formRef" layout="vertical" :model="model">
                    <n-form-item label="用户名" path="name">
                        <n-input size="large" :maxlength="20" autocomplete="off" v-model:value="model.name"
                            :placeholder="'输入你的用户名'">
                        </n-input>
                    </n-form-item>
                    <template v-if="!isLogin">
                        <n-form-item label="账号" path="email">
                            <n-input-group>
                                <n-input size="large" :maxlength="30" autocomplete="off" v-model:value="model.email"
                                    placeholder="输入邮箱">
                                </n-input>
                                <n-input size="large" :style="{ width: '43%' }" :maxlength="8" autocomplete="off"
                                    v-model:value="model.code" placeholder="输入验证码">
                                </n-input>
                                <n-button size="large" type="primary" ghost>发送验证码</n-button>
                            </n-input-group>
                        </n-form-item>
                    </template>
                    <n-form-item label="你的密码" path="password">
                        <n-input size="large" :maxlength="30" :show-password-on="'click'" type="password"
                            autocomplete="off" v-model:value="model.password" placeholder="输入你的密码">
                        </n-input>
                    </n-form-item>
                </n-form>
                <n-space style="margin-bottom: 10px" justify="space-between">
                    <n-text depth="3">忘记密码? 找回密码</n-text>
                </n-space>
                <n-space justify="space-between" :size="[10, 15]" vertical>
                    <n-button size="large" style="width: 100%" @click="handleLogin">
                        {{ isLogin ? "登录" : "注册" }}
                    </n-button>
                    <n-text style="text-align: right;cursor: pointer" @click="isLogin = !isLogin" depth="3">
                        {{ isLogin ? "没有账号? 注册账号" : "已有账户? 前往登录" }}
                    </n-text>
                </n-space>
            </div>
        </div>
    </n-card>
</template>
<script setup lang="ts">
import { type FormItemRule, NCard, NSpace, NSwitch, NIcon, NH1, NText, NForm, NFormItem, NInput, NInputGroup, NButton, type FormRules, type FormInst, type FormValidationError, useMessage } from "naive-ui"

const darkTheme = ref(false)
const isLogin = ref(true)
const message = useMessage();
const model = ref<{
    name: string,
    password: string,
    email?: string,
    code?: string
}>({
    name: "",
    password: "",
    email: "",
    code: "",
})

const rules: FormRules = {
    name: [
        { required: true, message: "请输入你的用户", trigger: "blur" },
    ],
    email: [
        { required: true, message: "请输入你的邮箱", trigger: "blur" },
    ],
    code: [
        { required: true, message: "请输入验证码", trigger: "blur" },
    ],
    password: [{ required: true, message: "输入用户名密码", trigger: "blur" }],
}

const route = useRoute()
const formRef = ref<FormInst | null>(null)

const handleLogin = async () => {
    try {
        await formRef.value?.validate()
    } catch (error) {
        const errors = error as FormValidationError[]
        errors.map(es => {
            es.map(e => {
                if (e.message) {
                    message.error(e.message);
                }
            })
        })
        return
    }
    try {
        if (isLogin.value) {
            await $fetch("/api/auth/login", {
                method: "post",
                body: {
                    name: model.value.name,
                    password: model.value.password
                }
            })
        } else {
            await $fetch("/api/auth/register", {
                method: "post",
                body: {
                    name: model.value.name,
                    password: model.value.password,
                    email: model.value.email
                }
            })
        }

    } catch (error: any) {
        message.error(error?.data?.message || `${isLogin ? "登录" : "注册"}失败，请检查输入的用户名和密码`);
        return
    }

    message.success(`${isLogin ? "登录" : "注册"}成功`)
    const redirectUrl = (Array.isArray(route.query.callbackUrl) ? route.query.callbackUrl[0] : route.query.callbackUrl) || "/"
    navigateTo(redirectUrl, { external: true })
}
definePageMeta({ disableAuth: true })

</script>
<style lang="less">
.login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-content {
        max-width: 500px;
        flex: 1;
    }
}

.login-set {
    position: fixed;
    top: 10px;
    right: 15px;
    color: #333333;
    z-index: 10;
}
</style>
