var express = require("express");
var router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken"); // Assuming you're using jsonwebtoken for token generation
const bcrypt = require("bcrypt");
const { Op } = require('sequelize'); // Import Op here
const authMiddleware = require("../middleware/auth");
require("dotenv");

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json({ users });
});

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);

    const { firstName, lastName, email, password, isAdmin } = req.body;
    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const token = jwt.sign({ email, userId: User.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const newUser = await User.create(req.body);
    res.json({
      message: "User created",
      token,
      newUser: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
//TODO pay attention to be RESTfull , path url must be in lowercase prefe use change-username instanceof change_username _ (not recommended) less readable than - on url 
router.put("/change_userName",authMiddleware, async (req, res) => {
  try {

    //suggest:
    //user is authenticated in this route , your must not pass the id on body just retrieve the user from authenticated  session
    // if you want to pass the user id on body assure only admis can do that 
    console.log(req.body);
    const { firstName, lastName,id,email} = req.body;
    const userId = req.body.id;

    const user = await User.findByPk(userId);

    if(!user){
      return res.status(404).json({message:"user not found"});
    }
    // why search with firstName + lastname, juste id (PK) . 
    // no matter if multiple user have the same first/last name
    const userExistance = await User.findOne({
      where: {
        firstName,
        lastName,
        id: { [Op.ne]: userId }, // Exclude the user being updated
      },
    });
    if (userExistance) {
      return res.status(400).json({ message: "Author name already exists" });
    }

    // Update the user's name
    await User.update({ firstName, lastName }, { where: { id: userId } });

    // Generate a new token (optional)
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Respond with updated user information (optional)
    const updatedUser = await User.findByPk(userId);
    res.json({
      message: 'User name updated',
      token, // Optional
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});


router.post("/sign_in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    //change message , prefer something like: Bad credentials (more generic)
    // if u say user not found , as a "hacker" i can change email ... to get an existing one
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    //same, i have an existing user i can try multiple password ... 
    //Prefer for authentication to have generic message 
    if (!isPasswordValid) {
      return res.status(400).json({ message: "invalid password" });
    }
    const token = jwt.sign({ email, userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "User signed in",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete("/delete",authMiddleware, async (req, res) => {
  console.log(req.body);

  try {
    // Get the email from the request body (adjust based on your actual request structure)
    // same for change username, user is authenticated so no need to pass email from request 
    const email = req.body.email;
    // Find user index
    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    // Check if user exists
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await userExists.destroy();

    // Respond with success message
    res.json({ message: "User deleted successfully", userExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
