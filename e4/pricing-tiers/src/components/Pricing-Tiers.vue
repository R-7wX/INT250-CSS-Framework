<template>
  <div class="bg-[#1a1c2c] min-h-screen flex items-center justify-center p-10">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-white">
      
      <div class="bg-[#252839] p-8 rounded-lg border border-gray-700 flex flex-col items-center">
        <span class="text-xs tracking-widest text-gray-400 mb-6">BASIC</span>
        <h3 class="text-4xl font-bold mb-2">100GB</h3>
        <p class="text-gray-400 text-sm mb-8">$1.99/month</p>
        <button class="w-full border border-blue-500 text-blue-400 py-2 rounded mb-10 hover:bg-blue-500 hover:text-white transition">
          Purchase
        </button>
        <ul class="text-xs text-gray-300 space-y-2 w-full">
          <li>✓ 100 GB storage</li>
          <li>✓ Option to add members</li>
          <li>✓ Extra member benefits</li>
        </ul>
      </div>

      <div class="bg-[#252839] p-8 rounded-lg border-4 border-purple-600 flex flex-col items-center transform scale-105 shadow-2xl z-10">
        <span class="text-xs tracking-widest text-gray-400 mb-6 font-bold">STANDARD</span>
        <h3 class="text-4xl font-bold mb-2">200GB</h3>
        <p class="text-gray-400 text-sm mb-8">$3.99/month</p>
        <button class="w-full bg-purple-600 text-white py-2 rounded mb-10 shadow-lg hover:bg-purple-700 transition font-bold">
          Purchase
        </button>
        <ul class="text-xs text-gray-300 space-y-2 w-full">
          <li>✓ 200 GB storage</li>
          <li>✓ Option to add members</li>
          <li>✓ Extra member benefits</li>
        </ul>
      </div>

      <div class="bg-[#252839] p-8 rounded-lg border border-gray-700 flex flex-col items-center">
        <span class="text-xs tracking-widest text-gray-400 mb-6">PREMIUM</span>
        <h3 class="text-4xl font-bold mb-2">2TB</h3>
        <p class="text-gray-400 text-sm mb-8">$8.99/month</p>
        <button class="w-full border border-blue-500 text-blue-400 py-2 rounded mb-10 hover:bg-blue-500 hover:text-white transition">
          Purchase
        </button>
        <ul class="text-xs text-gray-300 space-y-2 w-full">
          <li>✓ 2 TB storage</li>
          <li>✓ Option to add members</li>
          <li>✓ Extra member benefits</li>
        </ul>
      </div>

    </div>
  </div>
</template>