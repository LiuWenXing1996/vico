<template>
  <nuxt-icon v-if="!loggedIn || !user" name="user" />
  <img class="user-icon" v-else="!loggedIn" :src="user.avatar_url" />
</template>
<script setup lang="ts">
const { loggedIn, user } = useUserSession();
</script>
<style lang="less" scoped>
.user-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #1f232826;
}
</style>
