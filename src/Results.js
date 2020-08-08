import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import "./Home.css"


class Results extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            
    lat:  40.640063,
    lng: 22.9444,
    zoom: 13,
        }
      }
    
  render() {
    const position = [this.state.lat, this.state.lng]
    return (
        <div className="box-about">
             <h1>Fluffals best deck</h1>
            <Map className="map" center={position} zoom={this.state.zoom}>
                <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker>
            </Map>
      </div>
    )
  }
}

export default Results;