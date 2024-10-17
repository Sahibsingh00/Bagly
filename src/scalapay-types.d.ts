declare module 'scalapay' {
  export interface ScalapayOptions {
    amount: number;
    currency: string;
    // Add other relevant options here
  }

  export interface Scalapay {
    init(options: ScalapayOptions): void;
    on(event: string, callback: (data: any) => void): void;
  }

  const scalapay: Scalapay;
  export default scalapay;
}