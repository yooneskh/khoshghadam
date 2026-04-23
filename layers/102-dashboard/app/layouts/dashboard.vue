<script setup>

</script>


<template>
  <div class="bg-muted min-h-dvh">

    <header class="bg-primary-950 text-inverted pb-14.5">
      <div class="w-440 max-w-[calc(100vw-16px)] mx-auto py-4">
        <div class="flex items-center gap-3 px-3">

          <img
            src="/favicon.ico"
            class="size-7"
          />
          <span class="text-xl font-semibold">
            Admin Panel
          </span>

          <div class="grow" />

          <u-dropdown-menu
            :items="[
              {
                icon: 'lucide:user',
                label: 'Admin Name',
                description: 'admin@example.com',
              },
              {
                color: 'error',
                icon: 'lucide:log-out',
                label: 'Logout',
              },
            ]">
            <u-button
              variant="subtle"
              icon="lucide:user"
            />
          </u-dropdown-menu>

        </div>
      </div>
    </header>

    <main class="w-440 max-w-[calc(100vw-16px)] mx-auto bg-default border border-default shadow-lg shadow-neutral-200 rounded-xl -mt-14.5">

      <u-navigation-menu
        :items="[
          {
            icon: 'lucide:layout-dashboard',
            label: 'Dashboard',
            to: {
              name: 'dashboard.home',
            },
          },
          {
            icon: 'lucide:users',
            label: 'Authority',
            children: [
              {
                icon: 'lucide:user',
                label: 'Users',
                to: {
                  name: 'dashboard.resources.single',
                  params: {
                    resourceName: 'users',
                  },
                },
              },
            ],
          },
          {
            icon: 'lucide:id-card-lanyard',
            label: 'Flash Cards',
            children: [
              {
                icon: 'lucide:package',
                label: 'Flash Card Categories',
                to: {
                  name: 'dashboard.resources.single',
                  params: {
                    resourceName: 'flash-card-categories',
                  },
                },
              },
              {
                icon: 'lucide:file-badge-2',
                label: 'Flash Cards',
                to: {
                  name: 'dashboard.resources.single',
                  params: {
                    resourceName: 'flash-cards',
                  },
                },
              },
            ],
          },
        ]"
        class="border-b border-default px-2 py-1"
      />

      <div class="p-3">
        <slot />
      </div>

    </main>

  </div>
</template>
