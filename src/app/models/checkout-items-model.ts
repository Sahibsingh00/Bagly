import { CartItem } from "./cart-item.model";

export class CheckoutItemscod {
    payment_method = 'cod'; 
    payment_method_title = "Cash on delivery";
    set_paid = false;
    customer_id = 0;
    status = "processing";
    billing = {};
    shipping= {};
    public line_items: any = new Array<CartItem>();
  };


  export class CheckoutItemspaypal {
    payment_method = 'paypal'; 
    payment_method_title = "PayPal";
    set_paid = false;
    billing = {};
    shipping= {};
    public line_items: any = new Array<CartItem>();
  }

  export class CheckoutItemsScalapay {
    payment_method = 'scalapay'; 
    payment_method_title = "Scalapay";
    set_paid = false;
    billing = {};
    shipping= {};
    public line_items: any = new Array<CartItem>();
  }

  export class updateOrder {
    set_paid = true;
    status = "processing";
    billing = {}; 
  }


  export class UpdateCustomers {
    shipping = {}
  }
  
  