<template>
  <div class="max-w-6xl mx-auto p-8 bg-white min-h-screen">
    <div class="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
      <div class="relative w-full md:w-1/3">
        <input 
          type="text" 
          placeholder="Search" 
          class="w-full border-b border-gray-300 py-2 pl-2 outline-none focus:border-black transition-all"
        >
        <span class="absolute right-2 top-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      
      <div class="flex items-center space-x-8 text-gray-500 text-sm font-semibold">
        <a href="#" class="hover:text-black transition">Vector</a>
        <a href="#" class="hover:text-black transition">Illustrations</a>
        <a href="#" class="hover:text-black transition">Images</a>
        <a href="#" class="hover:text-black transition">Icons</a>
        <button class="bg-black text-white px-10 py-2 rounded shadow-md hover:bg-gray-800 transition transform active:scale-95">
          Upload
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      
      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1566550569459-be4f296b1f98?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

      <div class="aspect-square bg-gray-100 overflow-hidden rounded-lg group shadow-sm">
        <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=500" 
             class="object-cover w-full h-full group-hover:scale-110 transition duration-500">
      </div>

    </div>


  </div>
</template>