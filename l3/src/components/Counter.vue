<script setup>
import { ref } from 'vue';

const count = ref(0);
const step = ref(1);
const previousCount = ref(null); 

const min = 0;
const max = 100;

const saveHistory = () => {
  previousCount.value = count.value;
};

function increment() {
  saveHistory();
  const nextValue = count.value + step.value;
  
  if (nextValue > max) count.value = max;
  else if (nextValue < min) count.value = min;
  else count.value = nextValue;
}

function decrement() {
  saveHistory();
  const nextValue = count.value - step.value;

  if (nextValue > max) count.value = max;
  else if (nextValue < min) count.value = min;
  else count.value = nextValue;
}

function reset() {
  saveHistory();
  count.value = 0;
}

function undo() {
  if (previousCount.value !== null) {
    count.value = previousCount.value;
    previousCount.value = null;
  }
}
</script>

<template>
  <div class="card">
    <div class="header">
      <h1>Counter App</h1>
      <p>Step can be positive or negative.</p>
    </div>

    <div class="display">{{ count }}</div>

    <div class="controls">
      <button class="btn btn-inc" @click="increment">+ Increase</button>
      
      <button 
        class="btn btn-dec" 
        @click="decrement" 
        :disabled="count <= min"
      >
        - Decrease
      </button>
    </div>

    <div class="controls">
      <button class="btn btn-res" @click="reset">Reset</button>
      <button 
        class="btn btn-undo" 
        @click="undo" 
        :disabled="previousCount === null"
      >
        Undo
      </button>
    </div>

    <div class="step-box">
      <label>Step Size:</label>
      <input type="number" v-model.number="step" />
    </div>
  </div>
</template>

<style scoped>

.card {
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
  width: 320px;
  border: 1px solid #eee;
}

h1 { margin: 0; font-size: 24px; color: #333; }
p { font-size: 12px; color: #888; margin: 5px 0 20px; }

.display {
  font-size: 70px;
  font-weight: 800;
  margin-bottom: 25px;
  color: #222;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn {
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  flex: 1;
  transition: opacity 0.2s;
}

.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-inc { background: #4ade80; color: #064e3b; }
.btn-dec { background: #fb7185; color: #4c0519; }
.btn-res { background: #e5e7eb; color: #374151; }
.btn-undo { background: #60a5fa; color: #1e3a8a; }

.step-box {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.step-box input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}
</style>