<script setup>

/* page */

definePageMeta({
  name: 'dashboard.home',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});

useHead({
  title: 'Dashboard',
});


/* actions */

async function handleOnboardUser() {

  const roles = await ufetch('/api/authorization-roles', {
    query: {
      sort: 'name:asc',
    },
  });


  await launchFormPickerDialog({
    icon: 'lucide:user-plus',
    title: 'Onboard User',
    subtitle: 'Create a dashboard user',
    text: 'Set the user credentials and optionally assign a role or direct permissions.',
    modalOptions: {
      scrollable: true,
      ui: {
        content: 'max-w-xl',
      },
    },
    fields: [
      {
        key: 'name',
        identifier: 'input',
        label: 'Name',
        placeholder: 'Full name',
      },
      {
        key: 'username',
        identifier: 'input',
        label: 'Username',
        autocomplete: 'off',
      },
      {
        key: 'password',
        identifier: 'input',
        label: 'Password',
        type: 'password',
      },
      {
        key: 'role',
        identifier: 'select',
        label: 'Role',
        items: roles.map(role => ({
          label: role.name,
          value: role._id,
        })),
      },
      {
        key: 'permissions',
        identifier: 'tags',
        label: 'Permissions',
      },
    ],
    submitButton: {
      icon: 'lucide:user-plus',
      label: 'Onboard User',
      disabled: form => !form.name?.trim() || !form.username?.trim() || !form.password,
      onClick: async form => {

        const response = await ufetch('/api/authentication/onboard-user', {
          method: 'post',
          body: {
            name: form.name,
            username: form.username,
            password: form.password,
            role: form.role,
            permissions: form.permissions,
          },
        });


        toastSuccess({
          title: 'User introduced successfully.',
          description: `${response.name} can now sign in as ${response.username}.`,
        });

      },
    },
  });
}

</script>


<template>
  <div>
    <u-empty
      variant="naked"
      icon="lucide:layout-dashboard"
      title="Dashboard"
      description="Welcome to the dashboard"
      :actions="[
        {
          variant: 'subtle',
          label: 'Onboard User',
          loadingAuto: true,
          onClick: handleOnboardUser,
        },
      ]"
    />
  </div>
</template>
