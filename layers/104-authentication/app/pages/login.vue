<script setup>

/* page */

definePageMeta({
  name: 'authentication.login',
});

useHead({
  title: 'Login',
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


/* captcha */

const captchaChallengeEl = ref();
const captchaId = ref('');
const captchaCode = ref('');


async function handleLogin() {
  try {

    const loginResponse = await ufetch('/api/authentication/login', {
      silent: true,
      method: 'post',
      headers: {
        'x-captcha-id': captchaId.value,
        'x-captcha-code': captchaCode.value,
      },
      body: {
        username: loginForm.value.username,
        password: loginForm.value.password,
      },
    });

    const identityResponse = await ufetch('/api/authentication/identity', {
      silent: true,
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
  catch {

    await captchaChallengeEl.value?.refresh();

    toastError({
      title: 'Invalid username, password, or captcha.',
    });

  }
}

</script>


<template>
  <window-base
    pito="briefcase"
    title="Login"
    :actions="[
      {
        label: 'Login',
        disabled: !loginForm.username || !loginForm.password || !captchaId || !captchaCode,
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

      <captcha-challenge
        ref="captchaChallengeEl"
        v-model:id="captchaId"
        v-model:code="captchaCode"
      />

    </div>
  </window-base>
</template>
