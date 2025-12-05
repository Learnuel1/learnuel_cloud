class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status; 
    }  
    static notFound(message = "Resource not found", status = 404) {
        return new this(message, 404);
    }
    static badRequest(message = "Bad request", status = 400) {
        return new this(message, 400);
    }
     static unauthorized(message, status = 403) {
    const message = message || `You don't have required permission`;
    return new this(message, status);
  }
  static unauthenticated(message, status = 401) {
    const message = message || `You need to login first in order to have access.`;
    return new this(message, status);
  }
}