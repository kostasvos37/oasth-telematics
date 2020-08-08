import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { UserConsumer } from './UserContext';


const NavLink = props => {    
    if (props.to === props.location) {
        return <li> <Link className="active" to={props.to}>{props.label}</Link></li>
    }
    else {
        return <li> <Link to={props.to}>{props.label}</Link></li>
    }    
}

class NavMenu extends Component {
    render() {
            return (
                    <ul>               
                        <NavLink label="• Home" to="/" location={this.props.location.pathname} />           
                        <NavLink label="• Search" to="/main" location={this.props.location.pathname} />               
                    </ul>                         
            );
        }
}


class Header extends Component {    
    render() {
        return (            
            <React.Fragment>
                <h1>Internet and Applications 2020 Project</h1>
                <h2>National Technical University of Athens</h2>
                <nav>
                    <UserConsumer>
                    { context => 
                        <React.Fragment>
                            <NavMenu 
                                location={this.props.location} 
                                context={context}
                            />
                        </React.Fragment>
                    }
                    </UserConsumer>
                </nav>
                </React.Fragment>
        );
    }
    
}


export default withRouter(Header);


