<script setup>

/* seo */

useSeoMeta({
  robots: 'noindex, nofollow',
});


/* navigation */

const user = useUser();


const navigationItems = computed(() => {
  return [
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
        {
          icon: 'lucide:user',
          label: 'Authorization Tokens',
          to: {
            name: 'dashboard.resources.single',
            params: {
              resourceName: 'authorization-tokens',
            },
          },
        },
        {
          icon: 'lucide:user',
          label: 'Authorization Roles',
          to: {
            name: 'dashboard.resources.single',
            params: {
              resourceName: 'authorization-roles',
            },
          },
        },
        {
          icon: 'lucide:rail-symbol',
          label: 'User API Keys',
          to: {
            name: 'dashboard.resources.single',
            params: {
              resourceName: 'user-api-keys',
            },
          },
        },
      ],
    },
    {
      icon: 'lucide:book',
      label: 'Education',
      children: [
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
            {
              icon: 'lucide:history',
              label: 'Flash Card Sessions',
              to: {
                name: 'dashboard.resources.single',
                params: {
                  resourceName: 'flash-card-sessions',
                },
              },
            },
          ],
        },
      ],
    },
    {
      icon: 'lucide:container',
      label: 'Content',
      children: [
        {
          icon: 'lucide:image',
          label: 'Media',
          to: {
            name: 'dashboard.resources.single',
            params: {
              resourceName: 'media',
            },
          },
        },
      ],
    },
  ];
});

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
            :ui="{ content: 'min-w-xs' }"
            :items="[
              {
                icon: 'lucide:user',
                label: user?.name,
                description: user?.username,
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

    <main class="w-440 max-w-[calc(100vw-16px)] mx-auto bg-default border border-default shadow-lg shadow-neutral-200 rounded-xl -mt-14.5 overflow-clip mb-3">

      <div class="flex items-center gap-2 p-2 border-b border-default">
        <template v-for="item of navigationItems" :key="item.label">
          <template v-if="!item.children">
            <u-button
              variant="subtle"
              v-bind="item"
            />
          </template>
          <template v-else>
            <u-dropdown-menu :items="item.children">
              <u-button
                variant="subtle"
                trailing-icon="lucide:chevron-down"
                v-bind="radOmit(item, ['children'])"
              />
            </u-dropdown-menu>
          </template>
        </template>
      </div>

      <div class="p-3">
        <slot />
      </div>

    </main>

  </div>
</template>
