<template>
    学習設定
    <nav class="panel mt-3">
        <p class="panel-block is-size-7">
            使用するオプションを選択してください
        </p>
        <label class="panel-block">
            <input type="checkbox" v-model="config.qa">
            答えを表示して問題を隠す
        </label>
        <label class="panel-block">
            <input type="checkbox" v-model="config.random">
            ランダムに出題
        </label>
        <div class="panel-block">
            <button class="button is-info is-fullwidth" @click="start">学習開始</button>
        </div>
    </nav>
</template>
<style scoped>
.panel{
    box-shadow:none;
}
</style>
<script>
export default {
    setup(){
        const route = VueRouter.useRoute();
        const router = VueRouter.useRouter();

        const config = Vue.reactive({
            qa:false,
            random: true
        })
        const start = function(){
            router.replace(`/learn/${route.params.fileId}/?qa=${config.qa}&random=${config.random}`);
        }

        return {start, config}
    }
    
}
</script>