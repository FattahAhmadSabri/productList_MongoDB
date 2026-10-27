const User = require("../model/userSchema");
const bcrypt = require("bcrypt")

const createUserService = async(name, email, mobile, password) => {
    const hashedPassword =await bcrypt.hash(password,10)
  const response =await new User({ name, email, mobile, password : hashedPassword });
 await response.save();
  return response;
};

const loginService = async(email,password)=>{
    const response =await User.findOne({email})
    if(!response){
        throw new Error("Invalid credentials");
    }
      const isMatch = bcrypt.compare(password,response.password)
      if(!isMatch){
        throw new Error("Invalid credentials");
      }
    
      return response

}

const updateUserService = (id, name, email, mobile, password) => {
  const response = User.findByIdAndUpdate(
    id,
    { name, email, mobile, password },
    { new: true },
  );
  return response;
};

const deleteUserService = (id) => {
  const response = User.findByIdAndDelete(id);
  return response;
};

const getAllUserService = ()=>{
     const response = User.find()
     return response
}

const getUserByIdService = (id) => {
  const response = User.findById(id);
  return response;
};

module.exports = {
  createUserService,
  getUserByIdService,
  getAllUserService,
  updateUserService,
  loginService,
  deleteUserService,
};
