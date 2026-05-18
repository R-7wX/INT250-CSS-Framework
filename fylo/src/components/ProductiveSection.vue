<template>
  <section
    class="py-20 px-6 md:px-12 lg:px-20
           bg-white dark:bg-fylo-dark-blue
           transition-colors duration-300"
    aria-label="Stay productive"
  >
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
      <div class="w-full md:w-1/2 flex justify-center">
        <img
          src="/images/illustration-stay-productive.png"
          alt="Person working productively on multiple screens"
          class="w-full max-w-sm md:max-w-none"
        />
      </div>

      <div class="w-full md:w-1/2">
        <h2 class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl
                   text-gray-900 dark:text-white mb-5 leading-tight">
          Stay productive,<br />wherever you are
        </h2>
        <p class="text-gray-500 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4">
          Never let location be an issue when accessing your files. Fylo has you covered for
          all of your file storage needs.
        </p>
        <p class="text-gray-500 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6">
          Securely share files and folders with friends, family and colleagues for live
          collaboration. No email attachments required.
        </p>
        <a
          href="#"
          class="inline-flex items-center gap-2 text-fylo-cyan border-b border-fylo-cyan
                 pb-0.5 text-sm font-semibold hover:opacity-70 transition-opacity duration-200"
        >
          See how Fylo works
          <img src="/images/icon-arrow.svg" alt="" aria-hidden="true" class="w-5 h-5" />
        </a>
      </div>
    </div>
  </section>
</template>
