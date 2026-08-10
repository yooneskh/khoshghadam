

export async function assertCaptchaCode(args: { event: H3Event }) {

  const captchaId = args.event.headers.get('x-captcha-id');
  const captchaCode = args.event.headers.get('x-captcha-code');

  if (!captchaId || !captchaCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'captcha required',
    });
  }


  const captcha = await app.captchaCodes.dbo.find({
    resourceId: captchaId,
  });

  if (!captcha || !captcha.isActive || captcha.expiresAt <= Date.now()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'invalid captcha',
    });
  }


  if (captcha.code.toLowerCase() !== captchaCode.toLowerCase()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'invalid captcha',
    });
  }


  await app.captchaCodes.dbo.update({
    resourceId: captcha._id,
    document: {
      isActive: false,
    },
  });

}
