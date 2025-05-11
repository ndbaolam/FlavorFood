export default () => {
  const momoBaseUrl = process.env.MOMO_URL;
  const host = process.env.VITE_SERVER_URL;

  return {
    momo: {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      secretKey: process.env.MOMO_SECRET_KEY,

      redirectUrl: `${host}/payment/momo-return`,
      notifyUrl: `${host}/payment/momo-notify`,

      endpoint: `${momoBaseUrl}/create`,
      confirmEndpoint: `${momoBaseUrl}/confirm`,
      refundEndpoint: `${momoBaseUrl}/refund`,
      checkStatusEndpoint: `${momoBaseUrl}/query`,
      cancelEndpoint: `${momoBaseUrl}/cancel`,
    },
  };
};
