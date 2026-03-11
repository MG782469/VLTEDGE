const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // 1. If we don't pass the error to 'next', we MUST send a response here.
        // 2. ApiError uses 'statusCode', not 'code'.
        // 3. Fallback to 500 if statusCode is missing.
        
        const code = error.statusCode || error.code || 500;
        
        res.status(code).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
        
        // Note: We are NOT calling next(error) here, so the error 
        // will NOT go to the app.js error handler. It stops here.
    }
}

export { asynchandler };