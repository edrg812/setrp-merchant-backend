import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment')
  @HttpCode(200) // IMPORTANT
  async handlePaymentWebhook(
    @Headers('x-signature') signature: string,
    @Body() payload: any,
  ) {
    await this.webhookService.processPayment(payload, signature);
    return { received: true };
  }
}
