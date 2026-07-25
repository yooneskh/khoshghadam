<script setup>

/* page */

definePageMeta({
  name: 'authentication.register',
});

useHead({
  title: 'Register',
});


/* register */

const { form: registerForm, formTag: registerFormTag } = useForm({
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
    },
    {
      key: 'password',
      identifier: 'input',
      label: 'Password',
      type: 'password',
    },
  ],
});


async function handleRegister() {

  const registerResponse = await ufetch('/api/authentication/register', {
    method: 'post',
    body: {
      name: registerForm.value.name,
      username: registerForm.value.username,
      password: registerForm.value.password,
    },
  });


  const identityResponse = await ufetch('/api/authentication/identity', {
    headers: {
      'authorization': registerResponse.token,
    },
  });


  useToken().value = registerResponse.token;
  useUser().value = identityResponse;


  await navigateTo({
    name: 'authentication.account',
  });

}

</script>


<template>
  <window-base
    pito="briefcase"
    title="Register"
    :actions="[
      {
        label: 'Register',
        disabled: !registerForm.name || !registerForm.username || !registerForm.password,
        onClick: handleRegister,
      },
    ]">
    <div class="max-w-sm mx-auto space-y-4 py-8">

      <h1 class="text-2xl font-semibold">
        Register
      </h1>

      <p>
        Enter your account information below and click on register. If you already have an account, you can
        <nuxt-link :to="{ name: 'authentication.login' }" class="text-primary underline">
          login here.
        </nuxt-link>
      </p>

      <register-form-tag />

    </div>
  </window-base>
</template>
