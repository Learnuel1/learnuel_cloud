class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode; 
    }  
    static notFound(message = "Resource not found", statusCode = 404) {
        return new this(message, 404);
    }
    static badRequest(message = "Bad request", statusCode = 400) {
        return new this(message, 400);
    }
    
}