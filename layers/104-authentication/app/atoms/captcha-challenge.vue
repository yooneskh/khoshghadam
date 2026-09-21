<script setup>

/* interface */

const captchaId = defineModel('id', {
  type: String,
});

const captchaCode = defineModel('code', {
  type: String,
  default: '',
});


/* captcha */

const captcha = ref();


async function refresh() {

  captchaCode.value = '';

  captcha.value = await ufetch('/api/authentication/captcha', {
    silent: true,
  });

  captchaId.value = captcha.value._id;

}


refresh();


/* outlets */

defineExpose({
  refresh,
});

</script>


<template>
  <div class="space-y-3">

    <div class="flex items-center gap-2">

      <template v-if="captcha">
        <img
          :src="`data:image/png;base64,${captcha.image}`"
          alt="Captcha"
          class="h-14 rounded-md border border-default bg-elevated"
        />
      </template>

      <u-button
        variant="subtle"
        icon="lucide:refresh-ccw"
        @click="refresh"
      />

    </div>

    <u-form-field label="Captcha">
      <u-input
        class="w-full"
        v-model="captchaCode"
      />
    </u-form-field>

  </div>
</template>
