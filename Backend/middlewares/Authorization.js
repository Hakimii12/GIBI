/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
const allowedUsers = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      return res.status(404).json({ message: "no user found" });
    }
  
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};
export default allowedUsers;
