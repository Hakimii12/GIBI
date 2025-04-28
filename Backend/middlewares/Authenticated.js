import jwt from 'jsonwebtoken';
function Authenticated(){
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) throw new Error('Authentication required');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) throw new Error('User not found');
      if (user.role !== 'admin' && !user.isApproved) {
        throw new Error('Account needs pending approval');
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
};
export default Authenticated;