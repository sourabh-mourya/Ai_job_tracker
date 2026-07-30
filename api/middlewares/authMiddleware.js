export const authMiddleware = (req, res, next) => {
  const serverPassword = process.env.APP_PASSWORD;
  
  // If no password is set on the server, we can either block everything or allow everything.
  // For security, if APP_PASSWORD is not set, we will default to 'sourabh123'
  const expectedPassword = serverPassword || 'sourabh123';

  // Allow OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Check the x-app-password header
  const clientPassword = req.headers['x-app-password'];

  if (!clientPassword || clientPassword !== expectedPassword) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Invalid Password.' });
  }

  next();
};
