<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">6. Responsive Layout Example</h2>
    <p class="text-sm text-gray-500 mb-4">A reusable section layout with content on the left and summary panel on the right.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Main Content Area -->
      <div class="md:col-span-2 border border-gray-200 rounded-xl p-5">
        <h3 class="font-bold text-gray-700 text-sm mb-2">Main Content Area</h3>
        <p class="text-xs text-gray-500 leading-relaxed">
          This area can be used for dashboard content, a feature section, course details, or product descriptions.
          It demonstrates a simple reusable container pattern with consistent padding, rounded corners, and spacing.
        </p>
      </div>

      <!-- Summary Panel -->
      <div class="bg-blue-600 rounded-xl p-5 flex flex-col gap-3">
        <h3 class="font-bold text-white text-sm">Summary Panel</h3>
        <p class="text-xs text-blue-100 leading-relaxed">
          This panel can be reused for quick stats, announcements, or call-to-action content.
        </p>
        <button class="mt-auto self-start px-4 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-50 transition cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  </section>
</template>
