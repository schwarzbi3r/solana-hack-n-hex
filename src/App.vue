<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <nav class="bg-white py-2 md:py-4 py-8 bg-slate-100">
    <div class="px-4 mx-auto flex-row md:items-center bg-slate-100">
        <h1>Hack N Hex</h1>
    </div>
  </nav>
  <div class="mx-8 flex md:items-center">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
