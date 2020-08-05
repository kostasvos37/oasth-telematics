import React, { Component } from 'react';
import { withRouter } from "react-router";
import qs from 'query-string';
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

<div className="input-grp">
        <button type="submit" className="btn btn-primary flight">Show Results</button>
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
            <div className="input-grp">
            <label>{this.props.label}</label>
            <select className="custom-select" name ={this.props.name}>
                {this.props.options.map(MakeItem)}
            </select>
        </div>
        )}
}



class SearchView extends React.Component{

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSubmit.bind(this);
        this.state = {
            stops : []
        }
    }

    componentDidMount(){
        const query = "http://feed.opendata.imet.gr:23577/itravel/devices.json"
        fetch(query).then((response) => response.json())
        .then(json => {
            var returnedStops = []
            for (var i in json){
                returnedStops.push(json[i]["device_Name"])}
                console.log(returnedStops)
                this.setState({stops: returnedStops })
        });
    }

    handleSubmit(event){

        //TODO Implement

    }




    handleSelect(event){
        console.log(event)
    }


    render(){
        return (
            
        <div className="booking-form-box">
        <form className="booking-form" onSubmit = {this.handleSubmit}>
        
        <Select label = "Stops" name = "stops" options = {this.state.stops}/>
      
            
        </form>
        </div>
        )
    }
}

export default withRouter(SearchView);
