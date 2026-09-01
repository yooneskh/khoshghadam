<script setup>

/* page */

definePageMeta({
  name: 'dashboard.resources.users',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


/* seo */

useHead({
  title: 'Users',
});

useSeoMeta({
  description: 'Manage dashboard users.',
});


/* actions */

const resourceManagerEl = useTemplateRef('resourceManager');


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
        items: roles.map(it => ({
          value: it._id,
          label: it.name,
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
      disabled: form => !form.name || !form.username || !form.password,
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


        await resourceManagerEl.value?.refreshResources();

        toastSuccess({
          title: 'User onboard successfully.',
          description: `${response.name} can now sign in as ${response.username}.`,
        });

      },
    },
  });
}

async function handleResetPassword(user) {
  await launchFormPickerDialog({
    icon: 'lucide:key-round',
    title: 'Reset Password',
    subtitle: user.username,
    text: 'Set a new password for this user. All of their active sessions will be signed out.',
    fields: [
      {
        key: 'password',
        identifier: 'input',
        label: 'New Password',
        type: 'password',
        autocomplete: 'new-password',
      },
    ],
    submitButton: {
      icon: 'lucide:key-round',
      label: 'Reset Password',
      disabled: form => !form.password,
      onClick: async form => {

        await ufetch('/api/authentication/reset-password', {
          method: 'post',
          body: {
            user: user._id,
            password: form.password,
          },
        });


        toastSuccess({
          title: 'Password reset successfully.',
          description: `${user.name} can now sign in with the new password.`,
        });

      },
    },
  });
}

</script>


<template>
  <resource-manager
    ref="resourceManager"
    resource="users"
    :actions="[
      {
        icon: 'lucide:user-plus',
        label: 'Onboard User',
        onClick: handleOnboardUser,
      },
    ]"
    :resource-actions="[
      {
        icon: 'lucide:key-round',
        tooltip: 'Reset Password',
        onClick: handleResetPassword,
      },
    ]"
  />
</template>
