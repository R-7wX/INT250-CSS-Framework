<script setup>
/** * Note: If the terminal still shows a "Module Resolution" error, 
 * verify 'diet.jpg' is in 'src/assets/'.
 */
</script>

<template>
  <div class="flex items-center justify-center bg-zinc-700 h-screen">
    
    <div class="bg-zinc-800 p-2 mx-6 rounded-2xl shadow-2xl">
      
      <div class="flex flex-col md:flex-row rounded-l-xl bg-zinc-900 overflow-hidden">
        
        <div class="overflow-hidden md:rounded-l-xl">
          <img 
            src="../assets/diet.png" 
            alt="Diet and Fitness" 
            class="object-cover h-80 w-full md:h-64 md:w-80 transform hover:scale-105 duration-200 transition-transform"
          >
        </div>

        <div class="p-6 md:p-12 text-white">
          <h2 class="font-serif text-xl font-medium text-center md:text-left">
            Get diet and fitness tips in your inbox
          </h2>

          <p class="max-w-xs my-4 text-xs leading-5 tracking-wide text-center md:text-left text-zinc-300">
            Eat better and exercise better. Sign up for the Diet&Fitness newsletter.
          </p>

          <div class="flex flex-col mt-5 space-y-4 md:space-x-3 md:flex-row md:space-y-0">
             <input 
               type="text" 
               placeholder="Enter your email address" 
               class="p-2 px-4 text-center text-white bg-zinc-800 border border-zinc-600 placeholder:text-xs placeholder:text-center md:text-left placeholder:md:text-left focus:outline-none" 
             />
             
             <button class="px-5 py-3 text-xs font-bold rounded-md text-zinc-800 bg-lime-500 hover:bg-lime-700 hover:text-white transition-colors duration-500">
               Subscribe
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>