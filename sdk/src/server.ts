import {
  SPL402PaymentPayload,
  SPL402PaymentRequirement,
  ServerConfig,
  RoutePrice,
  SPL402_VERSION,
  ServerMetadata,
} from './types';
import { verifyPayment } from './verify';

export class SPL402Server {
  private config: ServerConfig;
  private routeMap: Map<string, RoutePrice>;
  private allRoutes: RoutePrice[];

  constructor(config: ServerConfig) {
    this.config = config;
    this.routeMap = new Map();

    const standardRoutes: RoutePrice[] = [
      { path: '/health', price: 0, method: 'GET' },
      { path: '/status', price: 0, method: 'GET' },
      { path: '/.well-known/spl402.json', price: 0, method: 'GET' },
    ];

    this.allRoutes = [...standardRoutes, ...config.routes];

    this.allRoutes.forEach(route => {
      const key = `${route.method || 'GET'}:${route.path}`;
      this.routeMap.set(key, route);
    });
  }

  private matchRoute(path: string, method: string = 'GET'): RoutePrice | null {
    // First try exact match (faster)
    const exactKey = `${method}:${path}`;
    const exactMatch = this.routeMap.get(exactKey);
    if (exactMatch) {
      return exactMatch;
    }

    // Then try pattern matching for dynamic routes
    for (const route of this.allRoutes) {
      const routeMethod = route.method || 'GET';
      if (routeMethod !== method) continue;

      // Convert route pattern to regex
      // Example: /v1/games/:code -> /v1/games/([^/]+)
      const pattern = route.path
        .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')  // Escape all special regex chars
        .replace(/:[^/]+/g, '([^/]+)');           // Replace :param with regex group

      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(path)) {
        return route;
      }
    }

    return null;
  }

  getPaymentRequirement(path: string, method: string = 'GET'): SPL402PaymentRequirement | null {
    const route = this.matchRoute(path, method);

    if (!route) {
      return null;
    }

    return {
      amount: route.price,
      recipient: this.config.recipientAddress,
      network: this.config.network,
      scheme: this.config.scheme || 'transfer',
      mint: this.config.mint,
      decimals: this.config.decimals,
    };
  }

  async verifyPayment(payment: SPL402PaymentPayload, expectedAmount: number): Promise<{
    valid: boolean;
    reason?: string;
  }> {
    const result = await verifyPayment(
      payment,
      expectedAmount,
      this.config.recipientAddress,
      this.config.network,
      this.config.decimals
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

    if (requirement.amount === 0) {
      return { authorized: true };
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

  getServerMetadata(): ServerMetadata {
    return {
      version: '1.0',
      server: this.config.serverInfo ? {
        name: this.config.serverInfo.name,
        description: this.config.serverInfo.description,
        contact: this.config.serverInfo.contact,
      } : undefined,
      wallet: this.config.recipientAddress,
      network: this.config.network,
      scheme: this.config.scheme || 'transfer',
      mint: this.config.mint,
      decimals: this.config.decimals,
      routes: this.config.routes.map(route => ({
        path: route.path,
        method: route.method || 'GET',
        price: route.price,
      })),
      capabilities: this.config.serverInfo?.capabilities,
    };
  }

  createHealthResponse(): {
    status: number;
    headers: Record<string, string>;
    body: { status: string; timestamp: number };
  } {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        status: 'ok',
        timestamp: Date.now(),
      },
    };
  }

  createMetadataResponse(): {
    status: number;
    headers: Record<string, string>;
    body: ServerMetadata;
  } {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: this.getServerMetadata(),
    };
  }
}

export function createServer(config: ServerConfig): SPL402Server {
  return new SPL402Server(config);
}

export function createExpressMiddleware(server: SPL402Server) {
  return async (req: any, res: any, next: any) => {
    // Use baseUrl + path to handle Express routers correctly
    // Example: if router mounted at /api and route is /premium
    // - req.baseUrl = '/api', req.path = '/premium'
    // - fullPath = '/api/premium' ✓
    const fullPath = (req.baseUrl || '') + req.path;

    if (fullPath === '/health' || fullPath === '/status') {
      const response = server.createHealthResponse();
      return res.status(response.status)
        .set(response.headers)
        .json(response.body);
    }

    if (fullPath === '/.well-known/spl402.json') {
      const response = server.createMetadataResponse();
      return res.status(response.status)
        .set(response.headers)
        .json(response.body);
    }

    const result = await server.handleRequest(
      fullPath,
      req.method,
      req.headers
    );

    if (!result.authorized) {
      if (result.reason === 'Payment required') {
        const response = server.createPaymentRequiredResponse(fullPath, req.method);
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

    if (url.pathname === '/health' || url.pathname === '/status') {
      const response = server.createHealthResponse();
      return new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: response.headers,
      });
    }

    if (url.pathname === '/.well-known/spl402.json') {
      const response = server.createMetadataResponse();
      return new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: response.headers,
      });
    }

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
