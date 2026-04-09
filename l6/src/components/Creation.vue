<template>
  <section>
    <div class="container max-w-6xl mx-auto my-32 px-6 md:px-0 text-gray-900">

      <!-- Header Row -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
        <h2 class="font-['Josefin_Sans'] text-4xl md:text-5xl text-center md:text-left uppercase tracking-wider font-light">
          Our Creations
        </h2>
        <!-- Top button — desktop only -->
        <button class="hidden md:inline-block px-10 py-2 my-0 font-['Alata'] font-bold tracking-widest uppercase border-2 border-black hover:bg-black hover:text-white transition-colors duration-200">
          See All
        </button>
      </div>

      <!-- 4-column grid on desktop, single column on mobile -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-2xl text-white uppercase">
        <div
          v-for="item in creations"
          :key="item.title"
          class="group relative overflow-hidden cursor-pointer"
        >
          <!-- Desktop image (hidden on mobile) -->
          <img
            :src="item.desktop"
            :alt="item.title"
            class="hidden md:block w-full transition-transform duration-200 group-hover:scale-110"
          />
          <!-- Mobile image (hidden on desktop) -->
          <img
            :src="item.mobile"
            :alt="item.title"
            class="block md:hidden w-full"
          />

          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800
                   group-hover:from-white/20 group-hover:to-white/70
                   transition-all duration-200"
          ></div>

          <!-- Card title -->
          <h5
            class="absolute bottom-4 md:bottom-8 left-6 md:left-10 w-52
                   font-['Josefin_Sans'] font-light tracking-widest leading-tight
                   transition-all duration-200
                   group-hover:scale-110 group-hover:text-black"
          >
            {{ item.title }}
          </h5>
        </div>
      </div>

      <!-- Bottom button — mobile only -->
      <div class="flex justify-center mt-10 md:hidden">
        <button class="w-full px-10 py-2 my-0 font-['Alata'] font-bold tracking-widest uppercase border-2 border-black hover:bg-black hover:text-white transition-colors duration-200">
          See All
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import deepEarthDesktop    from '@/assets/desktop/image-deep-earth.jpg'
import nightArcadeDesktop  from '@/assets/desktop/image-night-arcade.jpg'
import soccerDesktop       from '@/assets/desktop/image-soccer-team.jpg'
import gridDesktop         from '@/assets/desktop/image-grid.jpg'
import fromAboveDesktop    from '@/assets/desktop/image-from-above.jpg'
import borealisDesktop     from '@/assets/desktop/image-pocket-borealis.jpg'
import curiosityDesktop    from '@/assets/desktop/image-curiosity.jpg'
import fisheyeDesktop      from '@/assets/desktop/image-fisheye.jpg'

import deepEarthMobile    from '@/assets/mobile/image-deep-earth.jpg'
import nightArcadeMobile  from '@/assets/mobile/image-night-arcade.jpg'
import soccerMobile       from '@/assets/mobile/image-soccer-team.jpg'
import gridMobile         from '@/assets/mobile/image-grid.jpg'
import fromAboveMobile    from '@/assets/mobile/image-from-above.jpg'
import borealisMobile     from '@/assets/mobile/image-pocket-borealis.jpg'
import curiosityMobile    from '@/assets/mobile/image-curiosity.jpg'
import fisheyeMobile      from '@/assets/mobile/image-fisheye.jpg'

const creations = [
  { title: 'Deep Earth',       desktop: deepEarthDesktop,   mobile: deepEarthMobile   },
  { title: 'Night Arcade',     desktop: nightArcadeDesktop, mobile: nightArcadeMobile },
  { title: 'Soccer Team VR',   desktop: soccerDesktop,      mobile: soccerMobile      },
  { title: 'The Grid',         desktop: gridDesktop,        mobile: gridMobile        },
  { title: 'From Up Above VR', desktop: fromAboveDesktop,   mobile: fromAboveMobile   },
  { title: 'Pocket Borealis',  desktop: borealisDesktop,    mobile: borealisMobile    },
  { title: 'The Curiosity',    desktop: curiosityDesktop,   mobile: curiosityMobile   },
  { title: 'Make It Fisheye',  desktop: fisheyeDesktop,     mobile: fisheyeMobile     },
]
</script>
