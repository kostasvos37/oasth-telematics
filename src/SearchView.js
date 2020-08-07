import React, { Component } from 'react';
import { withRouter } from "react-router";
import Loader from 'react-loader-spinner'
import "./forms.css"
const MakeItem = function(X) {
    return <option>{X}</option>;
};


/*
<Text label = "Country" placeholder="Test" name = "test"/>
        
<Text label = "Year/Month/Day" placeholder="YYYY-MM-DD" name = "date"/>

<Select label = "Resolution" name = "resolution" options = {["15", "30", "60"]}/>

<div className="radio-btn">
<input type="radio" className="btn" name="check" value = "Choice 1" checked onChange = {() => {}}/><span>Table</span>
<input type="radio" className="btn" name="check" value = "Choice 2"/><span>Graph</span>

</div>

*/


class Text extends Component{    
    render(){
        return(
            <React.Fragment>
                <label>{this.props.label}</label>
                <input type="text" className="form-control" required = "required" placeholder={this.props.placeholder} name = {this.props.name}/>
            </React.Fragment>
        )}
}


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
        this.handleSelect = this.handleSubmit.bind(this);
        this.state = {
            stops : [],
            coords : [],
            fetchInProgress : false
        }
    }

    componentDidMount(){
        const query = "http://feed.opendata.imet.gr:23577/itravel/devices.json"

        this.setState  ({fetchInProgress : true }) 
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
            this.setState  ({fetchInProgress : false }) 
        });

    }

    handleSubmit(event){
        event.preventDefault()
        this.setState({fetchInProgress : true })
        var selection = event.target.elements.stops.value
        
        const stopNum = this.state.stops.indexOf(selection)
        const stopPosition = this.state.coords[stopNum]
        console.log(stopPosition)

        const routesContainingStop = []
        const query = "http://feed.opendata.imet.gr:23577/itravel/paths.json"
        fetch(query).then((response) => response.json())
        .then(json => {
            for (var i in json){
                const coordsPath = json[i]["polyline"].split(" ").map(x => x.split(",")).forEach(pos => {
                   
                    //console.log(`pos = ${stopPosition[0]}, linePos = ${Math.abs(parseFloat(pos[0]))}, diff = ${parseFloat(pos[0])-stopPosition[0]}`)
                    if((Math.abs(parseFloat(pos[0])-stopPosition[1])<0.0001) && (Math.abs(parseFloat(pos[1])-stopPosition[0])<0.0001) ){
                        console.log(json[i]["Path_Name"])
  
                    } 
                });
            }
        this.setState({fetchInProgress : false })
        });
    }




    handleSelect(event){
        console.log(event)
    }


    render(){
        if(this.state.fetchInProgress===true){
            return (
                <div className="booking-form-box">
                    <Loader type="Oval"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                        />
                </div>

            )
        }else{
            return (
                
            <div className="booking-form-box">
                <form className="booking-form" onSubmit = {this.handleSubmit}>
                
                    <Select label = "Stops" name = "stops" options = {this.state.stops}/>
                    <span className="input-grp">
                            <button type="submit" className="btn btn-primary flight">Show Results</button>
                    </span>
                </form>
            </div>

        )}
    }
}

export default withRouter(SearchView);
