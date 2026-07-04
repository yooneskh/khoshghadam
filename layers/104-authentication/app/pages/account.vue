<script setup>

/* page */

definePageMeta({
  name: 'authentication.account',
  middleware: [
    'is-authenticated',
  ],
});

useSeoMeta({
  title: 'Account',
  description: 'View and manage your account details.',
});


/* user */

const user = useUser();


const { form, formTag } = useForm({
  target: JSON.parse(JSON.stringify(user.value)),
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


async function handleSubmit() {

  await ufetch('/api/authentication/identity', {
    method: 'patch',
    body: {
      name: form.value.name,
    },
  });


  useUser().value = await ufetch('/api/authentication/identity');

}

async function handleLogout() {

  await ufetch('/api/authentication/logout', {
    method: 'delete',
  });


  useToken().value = '';
  useUser().value = undefined;


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
        color: 'error',
        label: 'Logout',
        onClick: handleLogout,
      },
      {
        type: 'spacer',
      },
      {
        label: 'Submit Information',
        onClick: handleSubmit,
      },
    ]">
    <div class="max-w-sm mx-auto space-y-4 py-8">

      <h1 class="text-2xl font-bold">
        Welcome, {{ user.name }}!
      </h1>

      <p>
        You can view and change your account details here.
      </p>

      <form-tag />

    </div>
  </window-base>
</template>
