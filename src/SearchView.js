import React, { Component } from 'react';
import { withRouter } from "react-router";
import Loader from 'react-loader-spinner'
import "./forms.css"
const MakeItem = function(X) {
    return <option>{X}</option>;
};

class Select extends Component{    

    render(){

        return(
            <React.Fragment>
            <label>{this.props.label}</label>
            <select className="custom-select" name ={this.props.name}>
                {this.props.options.map(MakeItem)}
            </select>
        </React.Fragment>
        )}
}



class SearchView extends React.Component{

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectRoute = this.handleSelectRoute.bind(this);
        this.state = {
            stops : [],
            coords : [],
            routes : [],
            componentRender : "stops"
        }
    }

    componentDidMount(){
        const query = "http://feed.opendata.imet.gr:23577/itravel/devices.json"

        this.setState  ({componentRender : "load" }) 
        fetch(query).then((response) => response.json())
        .then(json => {
            var returnedStops = []
            var returnedCoords = []
            for (var i in json){
                returnedStops.push(json[i]["device_Name"])
                returnedCoords.push([parseFloat(json[i]["lat"]), parseFloat(json[i]["lon"])])
            }
            this.setState({stops: returnedStops })
            this.setState({coords: returnedCoords })
            this.setState({componentRender : "stops" }) 
        });

    }

    handleSubmit(event){
        event.preventDefault()
        this.setState({componentRender : "load" })
        var selection = event.target.elements.stops.value
        
        const stopNum = this.state.stops.indexOf(selection)
        const stopPosition = this.state.coords[stopNum]
        console.log(stopPosition)

        const query = "http://feed.opendata.imet.gr:23577/itravel/paths.json"
        fetch(query).then((response) => response.json())
        .then(json => {
            
            var routesContainingStop = []
            for (var i in json){
                
                json[i]["polyline"].split(" ").map(x => x.split(",")).forEach(pos => {
                
                    //console.log(`pos = ${stopPosition[0]}, linePos = ${Math.abs(parseFloat(pos[0]))}, diff = ${parseFloat(pos[0])-stopPosition[0]}`)
                    if((Math.abs(parseFloat(pos[0])-stopPosition[1])<0.0001) && (Math.abs(parseFloat(pos[1])-stopPosition[0])<0.0001) ){
                        routesContainingStop.push(json[i]["Path_Name"])
                        return;
                    } 
                });
            }
        this.setState({routes : routesContainingStop.filter((v, i, a) => a.indexOf(v) === i)})
        this.setState({componentRender : "routes" })
        });
    }




    handleSelectRoute(event){
        //this.setState({componentRender : "redirect" }) 
        this.props.history.push({
            pathname: '/result?route=1'
            })
        }


    render(){
        if(this.state.componentRender==="load"){
            return (
                    <Loader type="Oval"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        />

            )
        }else if(this.state.componentRender==="stops"){
            return (
                
                <form className="booking-form" onSubmit = {this.handleSubmit}>
                
                    <Select label = "Select Stop" name = "stops" options = {this.state.stops}/>
                    <span className="input-grp">
                            <button type="submit" className="btn btn-primary flight">Show Results</button>
                    </span>
                </form>

        )}else if(this.state.componentRender === "routes"){
            return(
                <form className="booking-form" onSubmit = {this.handleSelectRoute} >
                    
                        <Select label = "Select Route" name = "routes" options = {this.state.routes}/>
                        <span className="input-grp">
                                <button type="submit" className="btn btn-primary flight">Show Results</button>
                        </span>
                </form>
            )
        }
    }
}

export default withRouter(SearchView);
