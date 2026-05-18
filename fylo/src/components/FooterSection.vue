<template>
  <footer
    class="bg-white dark:bg-fylo-dark-blue-2 text-gray-600 dark:text-gray-300
           py-16 px-6 md:px-12 lg:px-20 transition-colors duration-300"
    aria-label="Site footer"
  >
    <div class="max-w-6xl mx-auto">
      <div class="mb-10">
        <img src="/images/logo-light-mode.svg" alt="Fylo" class="h-7 dark:hidden" />
        <img src="/images/logo-dark-mode.svg"  alt="Fylo" class="h-7 hidden dark:block" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div class="space-y-4">
          <p class="flex items-start gap-3 text-sm">
            <img src="/images/icon-phone.svg" alt="" aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0" />
            +1-543-123-4567
          </p>
          <p class="flex items-start gap-3 text-sm">
            <img src="/images/icon-email.svg" alt="" aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0" />
            example@fylo.com
          </p>
        </div>

        <nav aria-label="About links">
          <ul class="space-y-3 list-none">
            <li><a href="#" class="footer-link">About</a></li>
            <li><a href="#" class="footer-link">Jobs</a></li>
            <li><a href="#" class="footer-link">Press</a></li>
            <li><a href="#" class="footer-link">Blog</a></li>
          </ul>
        </nav>

        <nav aria-label="Support links">
          <ul class="space-y-3 list-none">
            <li><a href="#" class="footer-link">Contact Us</a></li>
            <li><a href="#" class="footer-link">Terms</a></li>
            <li><a href="#" class="footer-link">Privacy</a></li>
          </ul>
        </nav>

        <div class="flex items-start gap-4" aria-label="Social media links">
          <a href="#" aria-label="Facebook"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-500
                   hover:border-fylo-cyan transition-colors duration-200">
            <img src="/images/facebook.svg" alt="" aria-hidden="true"
                 class="w-4 h-4 invert dark:invert-0" />
          </a>
          <a href="#" aria-label="Twitter"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-500
                   hover:border-fylo-cyan transition-colors duration-200">
            <img src="/images/twitter.svg" alt="" aria-hidden="true"
                 class="w-4 h-4 invert dark:invert-0" />
          </a>
          <a href="#" aria-label="Instagram"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-500
                   hover:border-fylo-cyan transition-colors duration-200">
            <img src="/images/instagram.svg" alt="" aria-hidden="true"
                 class="w-4 h-4 invert dark:invert-0" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
