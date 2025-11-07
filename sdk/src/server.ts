import {
  SPL402PaymentPayload,
  SPL402PaymentRequirement,
  ServerConfig,
  RoutePrice,
  SPL402_VERSION,
} from './types';
import { verifyPaymentLocal } from './verify';

export class SPL402Server {
  private config: ServerConfig;
  private routeMap: Map<string, RoutePrice>;

  constructor(config: ServerConfig) {
    this.config = config;
    this.routeMap = new Map();

    config.routes.forEach(route => {
      const key = `${route.method || 'GET'}:${route.path}`;
      this.routeMap.set(key, route);
    });
  }

  getPaymentRequirement(path: string, method: string = 'GET'): SPL402PaymentRequirement | null {
    const key = `${method}:${path}`;
    const route = this.routeMap.get(key);

    if (!route) {
      return null;
    }

    return {
      amount: route.price,
      recipient: this.config.recipientAddress,
      network: this.config.network,
      scheme: this.config.scheme || 'transfer',
      mint: this.config.mint,
    };
  }

  async verifyPayment(payment: SPL402PaymentPayload, expectedAmount: number): Promise<{
    valid: boolean;
    reason?: string;
  }> {
    const result = await verifyPaymentLocal(
      payment,
      expectedAmount,
      this.config.recipientAddress
    );

    return {
      valid: result.valid,
      reason: result.reason,
    };
  }

  createPaymentRequiredResponse(path: string, method: string = 'GET'): {
    status: number;
    headers: Record<string, string>;
    body: { message: string; payment: SPL402PaymentRequirement };
  } {
    const requirement = this.getPaymentRequirement(path, method);

    if (!requirement) {
      return {
        status: 404,
        headers: {},
        body: { message: 'Route not found', payment: {} as SPL402PaymentRequirement },
      };
    }

    return {
      status: 402,
      headers: {
        'X-Payment-Required': JSON.stringify(requirement),
        'Content-Type': 'application/json',
      },
      body: {
        message: 'Payment required',
        payment: requirement,
      },
    };
  }

  async handleRequest(
    path: string,
    method: string = 'GET',
    headers: Record<string, string>
  ): Promise<{ authorized: boolean; reason?: string; payment?: SPL402PaymentPayload }> {
    const requirement = this.getPaymentRequirement(path, method);

    if (!requirement) {
      return { authorized: false, reason: 'Route not found' };
    }

    const paymentHeader = headers['x-payment'] || headers['X-Payment'];

    if (!paymentHeader) {
      return { authorized: false, reason: 'Payment required' };
    }

    let payment: SPL402PaymentPayload;
    try {
      payment = typeof paymentHeader === 'string'
        ? JSON.parse(paymentHeader)
        : paymentHeader;
    } catch {
      return { authorized: false, reason: 'Invalid payment format' };
    }

    const verification = await this.verifyPayment(payment, requirement.amount);

    if (!verification.valid) {
      return {
        authorized: false,
        reason: verification.reason || 'Payment verification failed',
        payment
      };
    }

    return { authorized: true, payment };
  }

  getConfig(): ServerConfig {
    return { ...this.config };
  }
}

export function createServer(config: ServerConfig): SPL402Server {
  return new SPL402Server(config);
}

export function createExpressMiddleware(server: SPL402Server) {
  return async (req: any, res: any, next: any) => {
    const result = await server.handleRequest(
      req.path,
      req.method,
      req.headers
    );

    if (!result.authorized) {
      if (result.reason === 'Payment required') {
        const response = server.createPaymentRequiredResponse(req.path, req.method);
        return res.status(response.status)
          .set(response.headers)
          .json(response.body);
      }

      return res.status(402).json({
        error: result.reason || 'Payment verification failed'
      });
    }

    req.spl402Payment = result.payment;
    next();
  };
}

export function createFetchMiddleware(server: SPL402Server) {
  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url);
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const result = await server.handleRequest(
      url.pathname,
      request.method,
      headers
    );

    if (!result.authorized) {
      if (result.reason === 'Payment required') {
        const response = server.createPaymentRequiredResponse(url.pathname, request.method);
        return new Response(JSON.stringify(response.body), {
          status: response.status,
          headers: response.headers,
        });
      }

      return new Response(
        JSON.stringify({ error: result.reason || 'Payment verification failed' }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return null;
  };
}
