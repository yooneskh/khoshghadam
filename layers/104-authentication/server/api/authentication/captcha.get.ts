
/* responsibility */

// Issues a new captcha challenge
// and stores its code for later checks.


export default defineEventHandler(async event => {

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
