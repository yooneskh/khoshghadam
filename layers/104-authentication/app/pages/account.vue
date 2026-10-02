<script setup>

/* responsibility */

// Lets the signed-in user update
// their account details or log out.


/* page */

definePageMeta({
  name: 'authentication.account',
  middleware: [
    'is-authenticated',
  ],
});


/* seo */

useHead({
  title: 'Account',
});

useSeoMeta({
  description: 'View and update your account details.',
});


/* account */

const user = useUser();


const { form, formTag } = useForm({
  target: radCloneDeep(user.value),
  fields: [
    {
      key: 'name',
      identifier: 'input',
      label: 'Name',
    },
    {
      key: 'username',
      identifier: 'input',
      label: 'Username',
      disabled: true,
    },
  ],
});


/* handlers */

async function handleSubmit() {

  await ufetch('/api/authentication/identity', {
    method: 'patch',
    body: {
      name: form.value.name,
    },
  });


  user.value = await ufetch('/api/authentication/identity');

}

async function handleLogout() {

  await ufetch('/api/authentication/logout', {
    method: 'delete',
  });


  useToken().value = '';
  user.value = undefined;


  await navigateTo({
    name: 'authentication.login',
  });

}

</script>


<template>
  <window-base
    pito="briefcase"
    title="Account"
    :actions="[
      {
        variant: 'subtle',
        color: 'error',
        label: 'Logout',
        onClick: handleLogout,
      },
      {
        type: 'spacer',
      },
      {
        variant: 'subtle',
        label: 'Submit Information',
        onClick: handleSubmit,
      },
    ]">
    <div class="max-w-sm mx-auto space-y-4 py-8">

      <h1 class="text-2xl font-semibold">
        Welcome, {{ user.name }}!
      </h1>

      <p>
        You can view and change your account details here.
      </p>

      <form-tag />

    </div>
  </window-base>
</template>
