import React, { Component } from 'react'
import { Map, TileLayer,Polyline, Marker, Popup } from 'react-leaflet'
import qs from 'query-string';
import {getCenter} from 'geolib'
import Loader from 'react-loader-spinner'
import "./Home.css"

class Results extends Component{

    constructor(props) {
        super(props);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.state = {
            coords : [],
            type: "",
            zoom: 15,
            loading1 : false,
            loading2 : false,
            loading3 : false,
            pathName : "",
            startName : "",
            endName : ""
        }
    }
    
    componentDidMount(){
      var [ ,queryString] = window.location.href.split("?");
      queryString = qs.parse(queryString)
      const queryCoords = `/services/getPathPolyline/${queryString.path}`
      this.setState({type: queryString.type})
      this.setState({loading1:true})
      this.setState({loading2:true})
      this.setState({loading3:true})
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


          //Fetching endpoints
          const queryEndNames = `/services/getPathOriginDestinationIds/${queryString.path}`
          fetch(queryEndNames).then((response) => response.text())
          .then(text => {
                var [start, end] = text.split(',')

                // Fetching endpoint names
                fetch(`/services/getDeviceName/${parseInt(start)}`).then((response) => response.text()).then(text =>{
                    this.setState({startName : text})
                    console.log(this.state.startName === "")
                })
                fetch(`/services/getDeviceName/${parseInt(end)}`).then((response) => response.text()).then(text =>{
                    this.setState({endName : text})
                    console.log(this.state.endName === "")
                })

                this.setState({loading3 : false})
                
            }).catch(error =>{
                alert(error)
                this.props.history.push({
                    pathname: '/'
                })
            });

    }

    renderMarkers(markers) {
        return markers.map(
            (marker) => {
                return <Marker  position={marker} ></Marker>
            }
        )
    }


    render() {
        const position = [this.state.lat, this.state.lng]
        if (this.state.loading1 || this.state.loading2 || this.state.loading3 || !this.state.startName || !this.state.endName){
          return (
            <div className="box-about">
                <Loader type="Oval"
                        color="#00BFFF"
                        height={100}
                        width={100}
                />
            </div>
          )  
      }else if (this.state.type === "continuous"){
          const position = getCenter([
              {latitude : this.state.coords[0][0], longitude: this.state.coords[0][1]},
              {latitude : this.state.coords[this.state.coords.length-1][0], longitude: this.state.coords[this.state.coords.length-1][1]}
          ])
          return (
              <div className="box-about">
                  <h1>{this.state.pathName}</h1>
                  <Map className="map" center={[position.latitude, position.longitude]} zoom={this.state.zoom}>
                      <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Polyline key={1} positions = {this.state.coords} color={'blue'}/>
                      <Marker position={this.state.coords[0]} >
                        <Popup>
                            Αφετηρία : {this.state.startName}
                        </Popup>
                      </Marker>
                      <Marker position={this.state.coords[this.state.coords.length -1]} >
                        <Popup>
                            Τέρμα: {this.state.endName}
                        </Popup>
                      </Marker>
                      
                  </Map>
              </div>
          )
        }else{
            return (
                <div className="box-about">
                    <h1>{this.state.pathName}</h1>
                    <Map className="map" center={[position.latitude, position.longitude]} zoom={this.state.zoom}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {this.renderMarkers(this.state.coords)}
                        <Marker position={this.state.coords[0]} >
                          <Popup>
                              Αφετηρία : {this.state.startName}
                          </Popup>
                        </Marker>
                        <Marker position={this.state.coords[this.state.coords.length -1]} >
                          <Popup>
                              Τέρμα: {this.state.endName}
                          </Popup>
                        </Marker>
                        
                    </Map>
                </div>
            )

        }

    }
}

export default Results;