 

export interface PaymentDetailsResponse {
    status: string
    session: PaymentDetails
  }
  
  export interface PaymentDetails {
    url: string
    success_url: string
    cancel_url: string
  }
  