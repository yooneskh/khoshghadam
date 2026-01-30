<script setup>

/* page */

definePageMeta({
  name: 'resume.who-am-i',
});

useSeoMeta({
  title: 'Who Am I?',
  description: 'Learn more about Yoones, a FullStack Platform Developer with 13 years of experience.',
});

</script>


<template>
  <window-base pito="my-documents" title="Who Am I?">

    <h1 class="text-4xl font-bold px-3 my-3">
      Hello, I am Yoones.
    </h1>

    <p class="px-3 my-3">
      I am a <strong>FullStack Platform Developer</strong> of <strong>13 years</strong> who likes to create. Let's create the future together.
    </p>

    <p class="px-3 my-3">
      Contact me at <strong>yooneskh[at]gmail[dot]com</strong>
      or <nuxt-link to="https://github.com/yooneskh" target="_blank" class="underline text-blue-500">github</nuxt-link>
      or <nuxt-link to="https://twitter.com/yooneskh" target="_blank" class="underline text-blue-500">twitter</nuxt-link>.
    </p>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      Important Bits
    </p>

    <ol class="list-disc px-8 my-3">
      <li>

        Expert in Web Frontend

        <ol class="list-disc px-4 my-1">
          <li>
            <strong>JavaScript</strong> (9 years), <strong>TypeScript</strong> (5 years)
          </li>
          <li>
            <strong>React.js</strong> (7 years) + <strong>Next.js</strong> (3 years)
          </li>
          <li>
            <strong>Vue.js</strong> (7 years) + <strong>Nuxt.js</strong> (4 years)
          </li>
          <li>
            <strong>HTML</strong> (9 years) + <strong>CSS</strong> (9 years)
          </li>
        </ol>

      </li>
    </ol>

    <ol class="list-disc px-8 my-3">
      <li>

        Expert in Web Backend

        <ol class="list-disc px-4 my-1">
          <li>
            <strong>Node.js</strong> (6 years), <strong>Bun</strong>
          </li>
          <li>
            <strong>MongoDB</strong>, <strong>PostgreSQL</strong>
          </li>
        </ol>

      </li>
    </ol>

    <hr />

    <p class="text-2xl font-medium px-3 my-3">
      More Bits
    </p>

    <ol class="list-disc px-8 my-3">
      <li>

        Infrastructure

        <ol class="list-disc px-4 my-1">
          <li>
            <strong>Cloudflare</strong>, <strong>AWS</strong>, <strong>VPS</strong>
          </li>
        </ol>

      </li>
    </ol>

    <ol class="list-disc px-8 my-3">
      <li>

        Testing

        <ol class="list-disc px-4 my-1">
          <li>
            Unit Testing: Vitest, Jest
          </li>
          <li>
            E2E Testing: Playwright, Cypress
          </li>
        </ol>

      </li>
    </ol>

    <ol class="list-disc px-8 my-3">
      <li>

        Expertise

        <ol class="list-disc px-4 my-1">
          <li>
            Domain Driven Design (DDD)
          </li>
          <li>
            Legacy code maintenance and migration
          </li>
          <li>
            Team Lead (4 Years)
          </li>
        </ol>

      </li>
    </ol>

    <ol class="list-disc px-8 my-3">
      <li>

        Education

        <ol class="list-disc px-4 my-1">
          <li>
            Masters in Computer Science (Ranked 1st in University)
          </li>
          <li>
            Bachelors in Computer Science (Ranked 2nd in University)
          </li>
          <li>
            4th team in national ACM programming contest
          </li>
        </ol>

      </li>
    </ol>

  </window-base>
</template>
