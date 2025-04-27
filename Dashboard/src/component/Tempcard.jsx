import React from 'react'
import Card from 'react-bootstrap/Card';
import "bootstrap/dist/css/bootstrap.min.css";

function Tempcard({id,name , email , phone ,i}) {
  return (
    <>
    <Card bg={"info"}
          text={ 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
         >
    <Card.Header>{id}</Card.Header>
    <Card.Body>
    <Card.Title>Name : {name}</Card.Title>
      <Card.Text>
       Email : {email}
      </Card.Text>
      <Card.Text>
        Phone : {phone}
      </Card.Text>
    </Card.Body>
  </Card>
  </>
  )
}

export default Tempcard