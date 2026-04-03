const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode
  let msg = err.message || 'Server Error'

  if (err.name === 'CastError') {
    status = 400
    msg = 'Invalid ID format'
  }

  // duplicate key
  if (err.code === 11000) {
    status = 400
    const field = Object.keys(err.keyValue)[0]
    msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  if (err.name === 'ValidationError') {
    status = 400
    msg = Object.values(err.errors).map(e => e.message).join(', ')
  }

  res.status(status).json({
    message: msg,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler
