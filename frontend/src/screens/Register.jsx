import { useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "../config/axios";
import { UserContext } from "../contexts/user.context";

export default function Register() {
    const navigate = useNavigate();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setUser } = useContext(UserContext);
  
    const submitHanler = useCallback(async () => {
      axios.post('/users/register', {
        email,
        password
      }).then((res) => {
        console.log(res.data);

        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);

        navigate("/")
      }).catch((error) => {
        console.log(error.response.data);
      })
    }, [email, password, navigate])

  return (
    <div className='flex items-center justify-center bg-slate-300 h-screen'>
      <div className='flex flex-col justify-center items-center rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
        <h2 className="text-4xl font-bold mt-5">Sign Up</h2>
        <p className="text-mb px-4 pt-1 pb-4 mb-9 text-gray-500">Enter your information to create an account.</p>

        <div className="flex flex-col gap-5 w-full px-3">
          <div className="flex flex-col w-full">
            <div className="flex">
              <label className="bg-white px-2">Email</label>
            </div>
            <input onChange={(e) => setEmail(e.target.value)} className="border border-slate-300 px-2 h-9 rounded" type="text" placeholder="tejas@gmail.com"></input>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex">
              <label className="bg-white px-2">Password</label>
            </div>
            <input onChange={(e) => setPassword(e.target.value)} className="border border-slate-300 px-2 h-9 rounded" type="password" placeholder="********"></input>
          </div>
          <button onClick={submitHanler} className="bg-black text-white h-[36px] border rounded font-semibold hover:bg-white hover:text-black">Submit</button>
        </div>
        
        <div className="flex text-sm py-2">
          <div>Already have an account?</div>
          <Link className="pl-1 underline" to={"/login"}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}


