<script setup>

/* page */

definePageMeta({
  name: 'mini-games.list',
});


/* seo */

useHead({
  title: 'Minigames',
});

useSeoMeta({
  description: 'Tiny arcade games in the browser. First up: Runned Over. Dodge or become a pancake.',
});

useJsonld({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Minigames',
          'item': 'https://khoshghadam.com/minigames',
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      'name': 'Minigames',
      'description': 'Tiny arcade games in the browser. First up: Runned Over. Dodge or become a pancake.',
      'url': 'https://khoshghadam.com/minigames',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Runned Over',
            'url': 'https://khoshghadam.com/minigames/runned-over',
          },
        ],
      },
    },
  ],
});


/* games */

const games = [
  {
    name: 'Runned Over',
    description: 'Sky island. Speeding boxes. You vs. becoming a pancake. Don\'t get runned over.',
    pito: 'game-controller',
    to: {
      name: 'mini-games.runned-over',
    },
  },
];

</script>


<template>
  <window-base pito="game-controller" title="Minigames">
    <div class="p-3">

      <template v-if="games.length">
        <div class="grid gap-3 tablet:grid-cols-2">
          <template v-for="game of games" :key="game.name">
            <nuxt-link class="p-4 border border-default rounded-xl hover:bg-elevated" :to="game.to">
              <div class="flex items-start gap-3">

                <img
                  class="size-11 shrink-0"
                  :src="`/pitos/${game.pito}.png`"
                />

                <div class="grow min-w-0">

                  <h2 class="font-semibold">
                    {{ game.name }}
                  </h2>

                  <p class="text-sm mt-1">
                    {{ game.description }}
                  </p>

                </div>

              </div>
            </nuxt-link>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="h-full flex flex-col items-center justify-center py-12 text-center">

          <u-icon
            name="lucide:gamepad-2"
            class="size-10 text-muted"
          />

          <p class="mt-3 text-muted">
            The cabinet is empty. Come back when the next game drops.
          </p>

        </div>
      </template>

    </div>
  </window-base>
</template>
