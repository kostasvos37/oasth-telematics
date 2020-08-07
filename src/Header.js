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

/*
class Header extends React.Component{
    render(){
        return (
            <React.Fragment>
            <h1>WattErloo</h1>
                <h2>National Technical University of Athens</h2>
                <nav>
                    <ul>
                    <li align="right"><a href="#ΗΟΜΕ" className="active">ΗΟΜΕ</a></li>
                    <li>
                        <a href="#books">• Actual Total Load</a>
                    </li>
                    <li><a href="#categories">• Day Ahead Total Load Forecast</a>
                    </li>
                    <li>
                        <a href="#athors">• Aggregated Generation Per Type</a>
                    
                    </li>
                </ul>
		    </nav>
        </React.Fragment>
        )
    }
}
*/

export default withRouter(Header);


