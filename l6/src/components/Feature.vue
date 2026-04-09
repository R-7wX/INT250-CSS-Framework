<template>
  <section>
    <div class="relative flex flex-col md:flex-row max-w-6xl mx-auto my-24 px-6 md:px-0 text-gray-900">

      <!-- Image — 60% width on desktop -->
      <img
        src="@/assets/desktop/image-interactive.jpg"
        alt="interactive VR"
        class="w-full md:w-[60%] object-cover"
      />

      <!-- Text panel — overlays bottom-right on desktop -->
      <div class="md:absolute md:right-0 md:bottom-0 bg-white md:py-20 md:pl-20 md:w-[55%] pr-0">
        <h2
          class="font-['Josefin_Sans'] max-w-lg mt-10 md:mt-0 mb-6
                 text-4xl md:text-5xl text-center md:text-left
                 text-gray-900 uppercase tracking-wider font-light"
        >
          The Leader In<br />Interactive VR
        </h2>
        <p class="max-w-md text-gray-500 text-center md:text-left font-['Alata'] leading-relaxed text-sm">
          Founded in 2011, Loopstudios has been producing world-class virtual reality
          projects for some of the best companies around the globe. Our award-winning
          creations have transformed businesses through digital experiences that bind
          to their brand.
        </p>
      </div>

    </div>
  </section>
</template>
