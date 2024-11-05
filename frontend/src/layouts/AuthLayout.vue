<template>
  <div class="flex flex-col">
    <img
      src="/images/abstract-space.jpg"
      alt=""
      class="fixed -z-10 hidden h-[100vh] w-screen select-none object-cover sm:block xl:w-[50vw]"
      loading="eager"
    />
    <div class="px-6 md:px-10">
      <div
        class="container relative mx-auto flex min-h-dvh max-w-xl flex-col justify-center xl:max-w-7xl xl:flex-row xl:justify-between"
      >
        <div
          class="flex flex-col rounded-2xl bg-white py-6 sm:p-12 xl:flex-1 xl:flex-row xl:bg-transparent xl:p-0"
        >
          <div
            class="mx-auto mb-5 w-full max-w-lg xl:mb-0 xl:max-w-none xl:flex-1"
          >
            <a href="/" class="text-lg font-bold tracking-tight text-zinc-300">
              ALTLOC
            </a>
          </div>
          <div
            class="flex items-center justify-center bg-white xl:relative xl:w-2/3 p-3"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
