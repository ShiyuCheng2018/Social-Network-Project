import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {signIn, authenticate} from "../auth";

class SignIn extends Component{
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = (name) => (event) =>{
        this.setState({error:""});
        this.setState({[name]: event.target.value})
    };


    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        const user = {
            email,
            password
        };

        signIn(user)
            .then(data=>{
                if(data.error){
                    this.setState({error: data.error, loading: false})
                }else {
                        // authenticate
                        authenticate(data, ()=>{
                            this.setState({redirectToReferer: true})
                        })
                }
            })
    };



    signInForm = (email, password)=>(
        <form>
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
        const {email, password, error, redirectToReferer, loading} = this.state;
        if (redirectToReferer){
            return <Redirect to={'/'}/>
        }
        return (
            <div className={'container'}>
                <h2 className={'mt-5 mb-5'}>Sign In</h2>
                {/*validation*/}
                <div className={"alert alert-danger"} style={{display:error ? "":"none"}}>{error}</div>
                {/*end of validation*/}
                {loading ? <div className={"jumbotron text-center"}><h2>loading....</h2></div> : ""}
                {this.signInForm(email, password)}
            </div>
        )
    }
}

export default SignIn;