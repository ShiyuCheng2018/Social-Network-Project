import React, {Component} from "react";
import {isAuthenticated} from "../auth";
import {Redirect, Link} from 'react-router-dom';
import {read} from './apiUser';
import DefaultProfile from '../images/user.png';
import UserDelete from "./UserDelete";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import {list, listByUser} from "../post/apiPost";

class Profile extends Component{
    constructor(){
        super();
        this.state = {
            user: {following: [], followers: []},
            redirectToSignIn: false,
            following: false,
            error: " ",
            posts: []
        }

    };

    // check follow
    checkFollow = user =>{
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id;
        });

        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if(data.error){
                    this.setState({error: data.error});
                }else {
                    this.setState({user: data, following: !this.state.following});
                }
            })
    };

    loadPosts = (userId, token) => {
        listByUser(userId, token)
            .then(data=>{
                if(data.error){
                    console.log(data.error)
                }else {
                    this.setState({posts: data})
                }
            })
    };

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if(data.error){
                this.setState({redirectToSignIn: true})
            }else {
                let following = this.checkFollow(data);
                this.setState({user:data, following});
                this.loadPosts(data._id, token)

            }
        });
    };

    componentDidMount(){
        const userId = this.props.match.params.userId;
        this.init(userId)
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        const {redirectToSignIn, user, following, posts} = this.state;
        // Get the latest image or set it to default avatar
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;
        // If authentication failed
        if(redirectToSignIn) return <Redirect to={"/signin"} />;

        return (
            <div className={"container"}>
                <h2 className={"mt-5 mb-5"}>Profile</h2>
                <div className={"row"}>
                    <div className={"col-md-6"}>
                        <img src={photoUrl}
                             className="card-img-top" alt={user.name}
                             style={{ height: "250px", width: "250px" }}
                             onError={i => (i.target.src = `${DefaultProfile}`)}
                        />
                    </div>

                    <div className={"col-md-6"}>
                        <div className={"lead "}>
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(this.state.user.created).toDateString()}`}</p>
                        </div>
                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id
                        ? (
                            <div className={"row"}>
                                <Link to={`/post/new/create/${isAuthenticated().user._id}`}
                                      className={"btn btn-raised btn-info mr-5 ml-3"}>
                                    Create Post
                                </Link>
                                <Link to={`/user/edit/${user._id}`} className={"btn btn-raised btn-success mr-5 ml-3"}>
                                      Edit Profile
                                </Link>
                                <UserDelete userId={user._id}/>
                            </div>
                        ) : (<FollowProfileButton following={following} onButtonClick={this.clickFollowButton}/>)}

                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col md-12 mt-5 mb-5"}>
                        <hr/>
                        <p className={"lead"}>{user.about}</p>
                        <hr/>
                        <ProfileTabs following={user.following} followers={user.followers} posts={posts}/>
                    </div>
                </div>

            </div>
        )
    }
}

export default Profile;