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


/* captcha */

const captchaChallengeEl = ref();
const captchaId = ref('');
const captchaCode = ref('');


async function handleRegister() {
  try {

    const registerResponse = await ufetch('/api/authentication/register', {
      silent: true,
      method: 'post',
      headers: {
        'x-captcha-id': captchaId.value,
        'x-captcha-code': captchaCode.value,
      },
      body: {
        name: registerForm.value.name,
        username: registerForm.value.username,
        password: registerForm.value.password,
      },
    });


    const identityResponse = await ufetch('/api/authentication/identity', {
      silent: true,
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
  catch {

    await captchaChallengeEl.value?.refresh();

    toastError({
      title: 'Could not register. Check your details and captcha.',
    });

  }
}

</script>


<template>
  <window-base
    pito="briefcase"
    title="Register"
    :actions="[
      {
        label: 'Register',
        disabled: !registerForm.name || !registerForm.username || !registerForm.password || !captchaId || !captchaCode,
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

      <captcha-challenge
        ref="captchaChallengeEl"
        v-model:id="captchaId"
        v-model:code="captchaCode"
      />

    </div>
  </window-base>
</template>
