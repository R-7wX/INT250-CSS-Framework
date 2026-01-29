<script setup>
import Counter from './components/Counter.vue';
</script>

<template>
  <main class="app-container">
    <Counter />
  </main>
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Kanit:wght@300;500&display=swap');

body {
  margin: 0;

  font-family: 'Inter', 'Kanit', sans-serif; 
  background-color: #f0f2f5;
  -webkit-font-smoothing: antialiased; 
}

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>