// Simple chat server with MongoDB and Socket.io
import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Chat server is running")
})

// app.post("/api", async(req, res) => {
//   try{
//    const {title , data, data1 ,data2} = req.body ;
//    console.log(title , data ,data1 , data2) ;
//    res.status(200).json({ message: "Data received successfully!" });
//   }catch(err){
//     res.status(500).json({ error: "Something went wrong" });
//   }
// })

let users = [] ;

const fetchdata = async()=>{
    try{
     const response  = await axios.get("https://jsonplaceholder.typicode.com/users") ;
     users = response.data ;
    }catch(err){
      console.log(err) ;
    }
  }

  fetchdata() ;


  app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 3; // Hamara limit 3 users per page fix hai

    const search = req.query.search || ''; // search query

   // Filter users by search (case insensitive)
    let filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  
   // Pagination on filtered users
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
    res.json({
      totalUsers: filteredUsers.length,
      page,
      totalPages: Math.ceil(filteredUsers.length / limit),
      users: paginatedUsers,
    });
  
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
  
    // const paginatedUsers = users.slice(startIndex, endIndex);
  
    // res.json({
    //   totalUsers: users.length,
    //   page,
    //   totalPages: Math.ceil(users.length / limit),
    //   users: paginatedUsers,
    // });
  });






    // app.get("/users" , async(req , res)=>{}



// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
