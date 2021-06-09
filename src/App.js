import './App.css';
import React, {useState, useEffect}from 'react'
import Axios from 'axios'

function App() {

  // sign up
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState({password: ''});
  const [birth, setBirth] = useState('');
  const [country, setCountry] = useState('Germani');
  const [agree, setAgree] = useState(false);

  const [isEmpty, setIsEmpty] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [clickAgree, setClickAgree] = useState('');

  const [form, setForm] = useState ({
        email: '',
        login: '',
        password: '',
        })

  const [currentUser, setCurrentUser] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  const [errAuth, setErrAuth] = useState (false)

    // authentication

    const [authentication, setAuthentication] = useState (false)
    const [authWrong, setAuthWrong] = useState ('')

  const [renderForm, setRenderForm] = useState (true)
 
  const [city, setCity] = useState ([])

  
  // fet country for db
  useEffect(() => {getCountry()}, [])

  const getCountry = () => {
    Axios.get("/country").then ((res) =>{
      const data = res.data

      setCity ([...data])
      console.log(data)

    })
  }


let Check = () => setAgree (!agree)


let pass = (e) => {
  setPassword({password:e.target.value})
  console.log (password)
}

let checkValid = () => {
  let emailErr = ''
  let emptyFild = ''

  if (!email.includes('@')) {emailErr = 'Invalid email'}
  if (!login || !password.password || !name || !birth || !country || !agree) {emptyFild ='Please, fill in form fields and check \" I agree\"'}
  if (emailErr) {
    setEmailErr (emailErr)
    return false
  }
  if (emptyFild) {
    setIsEmpty (emptyFild)
    return false
  }
  if (password === '') {return false}

  return true
}

const submit = (event) => {
  event.preventDefault()

  let formInfo = {
    email:email,
    login:login,
    name:name,
    password:password.password,
    birth:birth,
    country:country     
  }
  console.log ('для бэка', formInfo)

  const isValidOk = checkValid ()
  if (isValidOk) {
    setIsEmpty ('')
    setEmailErr('')

    Axios.post("/create", formInfo).then ((res) => {
      // console.log ('данные отправлены с фронта')
      console.log(res.data)
      if (res.data.code == "ER_DUP_ENTRY") {setAuthWrong('This user already exists') }
      else {
      
        setAuthWrong('')
        setAuthentication (true)       
        setCurrentUser (name)
        setCurrentEmail (email)
        setErrAuth (false)

      }
    })

    // auth()
  } else {
    setPassword ({password:''})}
  

}

    const handleChande = (event) => {
    const target = event.target
    const aname = target.name
    const avalue = target.value

      setForm ( prev => {
        return {...prev,
          [aname]: avalue}
        })
      }

  const auth = (event) => {
    
  event.preventDefault()
  // console.log ('dd', form)

  let authInfo = {
    email:form.email,
    login:form.login,
    password:form.password, 
  }
    // console.log ('ауф', authInfo)

  Axios.post("/auth",  authInfo).then ((res) => {
    console.log (res.data)
    
    if (res.data) {
      setAuthentication (true) 
      console.log (res.data)
      setCurrentUser (res.data)
      setCurrentEmail (form.email)
      setErrAuth (false)
    } else { setErrAuth (true) 
      setAuthentication (false) 
    }
    

  })

}


  return (
    <div className="App">

      {authentication ? 
      <div className='authBlock'>
        <div className='authText'>Hello, {currentUser} {currentEmail}</div>
        <div><button className='btn btnBlue' onClick={() => setAuthentication(false)}>Log out</button></div>
      </div> 
      
      : null}
      

      <div className='container'>
        <div className={renderForm ?'postBox' : 'postBox hide'}>
          <p className='err'>{isEmpty} </p>
          <p className='err'>{emailErr}</p>
          <p className='err'>{clickAgree}</p>
          {authWrong ? <p className='err'>{authWrong}</p> : null}

            <div className='registration-block'>
              <div className='header-block'>
                <div className='headerTitle'>Registration</div>
                <div className='headerText'> 
                  Already have an account? <span className='headerLog' onClick={() => setRenderForm(false)}>Log in</span>
                </div>
              </div>
              

              <form className='postForm' onSubmit={submit}>
                <input 
                type='text' 
                name='email' 
                placeholder='Email' 
                onChange={(event) => {setEmail(event.target.value)}}/>

                <input 
                type='text' 
                name='login' 
                placeholder='Login' 
                onChange={(event) => {setLogin(event.target.value)}}/>

                <input 
                type='text' 
                name='password' 
                value={password.password} 
                placeholder='Password' onChange={pass}/>

                <input 
                type='text' 
                name='name' 
                placeholder='Your name' 
                onChange={(event) => {setName(event.target.value)}}/> 

                <input 
                type='date' 
                name='birth' 
                placeholder='Date of Birth' 
                onChange={(event) => {setBirth(event.target.value)}}/>
          
                <select name="country" onChange={(event) => {
                  setCountry(event.target.value)}}>
                  {city.map ((val) => <option key={val.id} name={val.countryname}>{val.countryname}</option>)}
                </select>

                <div className='agree'>
                  <div>
                    <input type='checkbox' name='check' placeholder='check' onChange={(event) => {
                    Check(event.target.value)}}/>
                  </div>
                  <div>I agree</div>
                </div>
                      
                <button className='btn btnBlue'>Sign up</button>

              </form>
            
            </div>
        </div>
        
        {/* <div className={!renderForm ?'authentication-block' : 'authentication-block hide'}> */}
        <div className={!renderForm ?'authentication-block' : 'authentication-block hide'}>
            <div className='header-block'>
                <div className='headerTitle'>Log in</div>
                <div className='headerText'> 
                Need an account? <span className='headerLog' onClick={() => setRenderForm(true)}>Sign up</span>
                </div>
              </div>
          {errAuth ? <p>error, user not found</p> : null}
          <form className='postForm' onSubmit={auth}>
            <input 
              type='text' 
              name='login' 
              placeholder='Login' 
              onChange={handleChande}/>

            <input 
              type='text' 
              name='email' 
              placeholder='Email' 
              onChange={handleChande}/>  

            <input type='text' 
              name='password' 
              placeholder='Password' 
              onChange={handleChande}/>


            <button className='btn btnBlue'>Log in</button>
          </form>

        </div>
      </div>        
    </div>
  );
}

export default App;