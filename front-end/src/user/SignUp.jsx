import React, {Component} from "react";
import {signUp} from "../auth";

class SignUp extends Component{
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        }
    }

    handleChange = (name) => (event) =>{
        this.setState({error:""});
        this.setState({[name]: event.target.value})
    };

    clickSubmit = (event) => {
      event.preventDefault();
      const {name, email, password} = this.state;
      const user = {
          name,
          email,
          password
      };

      signUp(user)
          .then(data=>{
              if(data.error){
                  this.setState({error: data.error})
              }else {
                  this.setState({
                      error: "",
                      name:"",
                      email:"",
                      password:"",
                      open: true
                  })
              }
          })
    };

    signUpForm = (name, email, password)=>(
        <form>
            <div className={'form-group'}>
                <label className={'text-muted'} >Profile Photo</label>
                <input type={'file'} className={'form-control'} onChange={this.handleChange('photo')} accept={"image/*"}/>
            </div>
            <div className={'form-group'}>
                <label className={'text-muted'} >Name</label>
                <input type={'text'} className={'form-control'} onChange={this.handleChange('name')} value={name}/>
            </div>
            <div className={'form-group'}>
                <label className={'text-muted'} >E-mail</label>
                <input type={'email'} className={'form-control'} onChange={this.handleChange('email')} value={email}/>
            </div>
            <div className={'form-group'}>
                <label className={'text-muted'} >Password</label>
                <input type={'password'} className={'form-control'} onChange={this.handleChange('password')} value={password}/>
            </div>
            <button className={'btn btn-raised btn-primary'} onClick={this.clickSubmit}>Submit</button>
        </form>
    );

    render(){
        const {name, email, password, error, open} = this.state;
        return (
            <div className={'container'}>
                <h2 className={'mt-5 mb-5'}>Sign up</h2>
                {/*validation*/}
                <div className={"alert alert-danger"} style={{display:error ? "":"none"}}>{error}</div>
                <div className={"alert alert-info"} style={{display:open ? "":"none"}}>New account is successfully created!! Please Sign In.</div>
                {/*end of validation*/}
                {this.signUpForm(name, email, password)}
            </div>
        )
    }
}

export default SignUp;