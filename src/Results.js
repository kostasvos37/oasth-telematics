import React, { Component } from 'react'
import { Map, TileLayer,Polyline } from 'react-leaflet'
import qs from 'query-string';
import Loader from 'react-loader-spinner'
import "./Home.css"

class Results extends Component{

    constructor(props) {
        super(props);
        this.state = {
            coords : [],
            lat: 40.631003384366842,
            lng: 22.953261341104508,
            zoom: 16,
            loading1 : false,
            loading2 : false,
            pathName : ""
        }
    }
    
    componentDidMount(){
      this.setState({loading:true})
      var [ ,queryString] = window.location.href.split("?");
      queryString = qs.parse(queryString)
      
      const queryCoords = `/services/getPathPolyline/${queryString.path}`
      this.setState({loading1:true})
      this.setState({loading2:true})
      fetch(queryCoords).then((response) => response.text())
      .then(json => {
            var returnedCoords = []
            json.split(" ").map(x => x.split(",")).forEach(pos => {
                returnedCoords.push([parseFloat(pos[1]), parseFloat(pos[0])])
            })
            this.setState({coords:returnedCoords})
            this.setState({lat:returnedCoords[0][0]})
            this.setState({lng:returnedCoords[0][1]})
            this.setState({loading1:false})        
            console.log("done")        

        }).catch(error =>{
            alert(error)
            this.props.history.push({
                pathname: '/'
            })
        });
      
        // Fetching name
      const queryName = `/services/getPathName/${queryString.path}`
        fetch(queryName).then((response) => response.text())
        .then(text => {
              this.setState({pathName:text})
              this.setState({loading2:false})
              console.log("done")        
          }).catch(error =>{
              alert(error)
              this.props.history.push({
                  pathname: '/'
              })
          });

    }


    render() {
        const position = [this.state.lat, this.state.lng]
        if (this.state.loading1 || this.state.loading2){
          return (
            <div className="box-about">
                <Loader type="Oval"
                        color="#00BFFF"
                        height={100}
                        width={100}
                />
            </div>
          )  
      }else{
          return (
              <div className="box-about">
                  <h1>{this.state.pathName}</h1>
                  <Map className="map" center={position} zoom={this.state.zoom}>
                      <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Polyline key={1} positions = {this.state.coords} color={'blue'}/>
                  </Map>
              </div>
          )
        }

    }
}

export default Results;