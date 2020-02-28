import React, {Component} from 'react';
import {findPeople} from './apiUser';
import {Link} from "react-router-dom";
import DefaultProfile from '../images/user.png';
import {isAuthenticated} from "../auth";
import {follow} from "./apiUser";

class FindPeople extends Component{
    constructor(){
        super();
        this.state = {
            users: [],
            error: "",
            open: false
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token).then(data => {
            if(data.err){
                console.log(data.err)
            }else {
                console.log(data);
                this.setState({users: data})
            }
        }).catch(err => {
            console.log(err);
        })
    }

    clickFollow = (user, i) =>{
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        follow(userId, token, user._id)
            .then(data=>{
                if(data.err){
                    this.setState({error: data.error});
                }else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`
                    })
                }
            })
    };

    renderUsers = users => (
        <div className="row">
            {users.map((user, i) => (
                <div className="card col-md-3 mx-md-4 my-2" key={i}>
                    <img src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                         className="card-img-top" alt={user.name}
                         style={{ height: "250px", width: "250px" }}
                         onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">
                            View Profile
                        </Link>
                        <button className={"btn btn-raised btn-info float-right btn-sm"} onClick={()=>{
                            this.clickFollow(user, i)
                        }}>Follow</button>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const {users, open, followMessage} = this.state;
        return(
            <div className={"container"}>
                <h2 className={"mt-5 mb-5"}>Find People</h2>
                {open && (<div className={"alert alert-success"}><p>{followMessage}</p></div>)}
                {this.renderUsers(users)}
            </div>
        )
    }
}


export default FindPeople;