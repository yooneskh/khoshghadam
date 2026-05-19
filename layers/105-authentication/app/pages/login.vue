<script setup>

/* page */

definePageMeta({
  name: 'authentication.login',
});

useSeoMeta({
  title: 'Login',
  description: 'Login to your account.',
});


/* login */

const { form: loginForm, formTag: loginFormTag } = useForm({
  fields: [
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


async function handleLogin() {

  const loginResponse = await ufetch('/api/authentication/login', {
    method: 'post',
    body: {
      username: loginForm.value.username,
      password: loginForm.value.password,
    },
  });

  const identityResponse = await ufetch('/api/authentication/identity', {
    headers: {
      'authorization': loginResponse.token,
    },
  });


  useToken().value = loginResponse.token;
  useUser().value = identityResponse;


  await navigateTo({
    name: 'authentication.account',
  });

}

</script>


<template>
  <window-base
    pito="briefcase"
    title="Login"
    :actions="[
      {
        label: 'Login',
        disabled: !loginForm.username || !loginForm.password,
        onClick: handleLogin,
      },
    ]">
    <div class="max-w-sm mx-auto space-y-4 py-8">

      <h1 class="text-2xl font-semibold">
        Login
      </h1>

      <p>
        Enter your account information below and click on login. If you don't have an account, you can
        <nuxt-link :to="{ name: 'authentication.register' }" class="text-primary underline">
          register a new account here.
        </nuxt-link>
      </p>

      <login-form-tag />

    </div>
  </window-base>
</template>
