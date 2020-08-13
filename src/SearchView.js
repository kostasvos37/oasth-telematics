import React, { Component } from 'react';
import {getDistance} from 'geolib'
import { withRouter } from "react-router";
import Loader from 'react-loader-spinner';
import qs from 'query-string';
import "./forms.css";
const MakeItem = function(X) {
    return <option>{X}</option>;
};

class Select extends Component{    
    render(){
        return(
            <React.Fragment>
            <label>{this.props.label}</label>
            <select className="custom-select" key={1} name ={this.props.name}>
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
        this.findTenClosest = this.findTenClosest.bind(this)
        this.state = {
            stops : [],
            coords : [],
            renderStops : [],
            routes : [],
            routeIds: [],
            text : "Επιλέξτε Στάση",
            componentRender : "stops"
        }
    }

    // Polyyyyyyyyy xazos tropos alla douleuei
    findTenClosest(pos, coordinates, names){
        var dists = coordinates.map((element) =>{
            return getDistance({latitude : pos[0], longitude:pos[1]}, {latitude : element[0], longitude:element[1]}, 0.01)
        })
        var obj = []
        for (var i=0; i<names.length; i++){
            obj.push({name: names[i], dist: dists[i]});
        }
        obj = obj.sort((a,b) => (a.dist - b.dist))
        return (obj.map((a) => a.name).slice(0, 10))
    }

    componentDidMount(){
        var [ ,queryString] = window.location.href.split("?");
        const containsCoords = window.location.href.includes('?') ? true : false
        queryString = qs.parse(queryString)
        
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
            // frankly terrible
            this.setState({coords: returnedCoords })
            this.setState({stops: returnedStops })
            console.log()
            if(!containsCoords){
                this.setState({renderStops : returnedStops}) 
                this.setState({text: "Επιλέξτε Στάση"})
                
            }else{
                const closest = this.findTenClosest([parseFloat(queryString.lat), parseFloat(queryString.lng)], returnedCoords, returnedStops)
                this.setState({renderStops: closest })
                this.setState({text: "Επιλέξτε Στάση (10 Κοντινότερες)"})
            }
            
            this.setState({componentRender : "stops" }) 
        }).catch(error =>{
            alert(error)
            this.props.history.push({
                pathname: '/'
            })
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
            var ids = []
            for (var i in json){
                if(parseInt(json[i]["Path_origin_device_id"]) === (stopNum + 11)){
                    routesContainingStop.push(json[i]["Path_Name"])
                    ids.push(json[i]["Path_id"])
                }
            }
        this.setState({routes : routesContainingStop})
        this.setState({routeIds : ids})
        this.setState({componentRender : "routes" })
        }).catch(error => {
            alert(error)
            this.props.history.push({
                pathname: '/'
            })
        });
    }




    handleSelectRoute(event){
        event.preventDefault()
            var selection = event.target.elements.routes.value
            const routeId = this.state.routeIds[this.state.routes.indexOf(selection)]
            const type = event.target.elements.check.value
            
            this.props.history.push({
                pathname: '/result',
                search: qs.stringify({path: routeId, type: type})
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
                <form className="searching-form" onSubmit = {this.handleSubmit}>
                
                    <Select label = {this.state.text} name = "stops" options = {this.state.renderStops}/>
                    <span className="input-grp">
                            <button type="submit" className="btn btn-primary flight">Αναζήτηση</button>
                    </span>
                </form>

        )}else if(this.state.componentRender === "routes"){
            return(
                <form className="searching-form" onSubmit = {this.handleSelectRoute} >
                        <Select label = "Επιλέξτε Διαδρομή" name = "routes" options = {this.state.routes}/>
                        <div className="radio-btn">
                            <input type="radio" className="btn" name="check" value = "continuous" checked onChange = {() => {}}/><span>Συνεχόμενη</span>
                            <input type="radio" className="btn" name="check" value = "points"/><span>Σημεία</span> 
                        </div>
                        <span className="input-grp">
                                <button type="submit" className="btn btn-primary flight">Αναζήτηση</button>
                        </span>
                </form>
            )
        }
    }
}
export default withRouter(SearchView);