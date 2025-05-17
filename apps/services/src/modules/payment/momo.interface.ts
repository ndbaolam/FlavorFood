export interface MomoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  redirectUrl: string;
  notifyUrl: string;
  endpoint: string;  
  confirmEndpoint: string;
  refundEndpoint: string;
  checkStatusEndpoint: string;
  cancelEndpoint: string;
}

export interface MomoPaymentQuery {
  partnerCode: string,
  orderId: string
  requestId: string,
  amount: string
  orderInfo: string,
  orderType: string,
  transId: string
  resultCode: string,
  message: string
  payType: string
  responseTime: string,
  extraData: string,
  signature: string
}
