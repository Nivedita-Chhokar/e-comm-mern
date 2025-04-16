const roleCheck = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: "You don't have permission to perform this action" 
        });
      }
      
      next();
    };
  };
  
  module.exports = roleCheck;