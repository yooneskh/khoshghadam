

export default defineEventHandler(async () => {

  const captcha = await generateCaptcha();


  const document = await app.captchaCodes.dbo.create({
    document: {
      code: captcha.code,
      isActive: true,
      expiresAt: Date.now() + 1000 * 60 * 5,
    },
  });


  return {
    _id: document._id,
    image: captcha.image,
  };

});
