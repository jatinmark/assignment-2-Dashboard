import { useEffect, useState } from 'react'
import axios from "axios"
import Tempcard from './component/Tempcard';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  const fetchdata =async(page)=>{
    try{
     const response = await axios.get(`https://assignment-2-dashboard.onrender.com/api/users`, {
      params: { page, search }
    }) ;
     console.log(response.data) ;
     // setData(response.data) ;
     setUsers(response.data.users);
     setTotalPages(response.data.totalPages);
    }catch(err){
     console.log(err) ;
    }
 }


 useEffect(() => {
  fetchdata(page , search);
}, [page , search]);

const handleSearchChange = (e) => {
  setSearch(e.target.value);
  setPage(1); // Reset to page 1 when new search happens
};

  return (
    <div style={{display : "flex", flexDirection: "column", alignItems: 'center'}}>
       <h2 style={{marginTop : "40px",marginBottom:"20px" }}>Users List</h2>
       {/* search field */}
       <InputGroup className="mb-3 w-50">
        <InputGroup.Text id="inputGroup-sizing-default">
        Search
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
      </InputGroup>

        {/* User Cards */}
        <div className='d-flex  p-3'>
        {
        users.map((ele,i)=>(
          <div className='p-3'>         
             <Tempcard key={i} id={ele.id} name={ele.name} email={ele.website} phone={ele.phone} />
          </div>
        ))
       }
        </div>
      

       {/* pagination */}
       <div style={{ marginTop: '20px' }}>
       <Pagination>
       <Pagination.Prev onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} />
       <span style={{ margin: '5px 15px',  }}>Page {page} of {totalPages}</span>
       <Pagination.Next onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
       </Pagination>
      </div>
       
    </div>
  )
}

export default App

      