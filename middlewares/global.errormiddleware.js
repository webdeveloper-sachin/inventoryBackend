const globalErrorMiddleware = (err, req, res, next) => {
    console.error('Something went wrong:', err);
  
    res.status(err.status || 500).json({
      success: false,
      msg: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = globalErrorMiddleware;
  