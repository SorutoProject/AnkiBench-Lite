<template>
  <nav class="navbar is-info">
    <div class="navbar-brand">
      <span class="navbar-item">
        <button
          class="button is-outlined is-white is-small mr-3"
          @click="back"
          v-if="$route.path !== '/'"
        >
          戻る
        </button>
        AnkiBench Lite
      </span>
    </div>
  </nav>
  <div class="mt-4 ml-4 mr-4">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
<script>
export default {
  setup() {
    const back = function () {
      history.back();
    };

    return { back };
  },
};
</script>