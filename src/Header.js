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
                        <NavLink label="• Πληροφοριες" to="/" location={this.props.location.pathname} />           
                        <NavLink label="• Αναζητηση (Ολες οι στασεις)" to="/main" location={this.props.location.pathname} /> 
                        <NavLink label="• Αναζητηση (Τοποθεσια)" to="/location" location={this.props.location.pathname} />               
              
                    </ul>                         
            );
        }
}


class Header extends Component {    
    render() {
        return (            
            <React.Fragment>
                <h1>Διαδίκτυο και Εφαρμογές - Πρότζεκτ 2020</h1>
                <h2>Εθνικό Μετσόβιο Πολυτεχνείο</h2>
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