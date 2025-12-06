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
     static unauthorized(message =`You don't have required permission`, status = 403) {
    return new this(message, status);
  }
  static unauthenticated(message = "You need to login first in order to have access.", status = 401) { 
    return new this(message, status);
  }
}

export default APIError;