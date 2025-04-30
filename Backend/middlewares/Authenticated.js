/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
function Authenticated(){
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) throw new Error('Authentication required');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');
      // if(user.role !== 'admin'){

      // }
      if (!user.isApproved) {
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