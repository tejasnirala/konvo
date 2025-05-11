import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user.context'
import { useNavigate } from 'react-router-dom';

export default function UserAuth({children}) {
  const {user} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  
  useEffect(() => {
    if(user) {
      setLoading(false);
    }
    
    if(!token) {
      navigate('/login')
    }
    
    if(!user) {
      navigate('/login')
    }
  }, [token, user, navigate]);

  if (loading) {
    return <div>Loading....</div>
  }


  return (
    <>{children}</>
  )
}
