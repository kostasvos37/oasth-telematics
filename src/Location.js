import React, { Component } from 'react'
import { Map, TileLayer, Marker} from 'react-leaflet'
import qs from 'query-string'
import "./Home.css"
import { withRouter } from 'react-router-dom';

class Location extends Component{

    constructor(props) {
        super(props);
        this.handlePopup = this.handlePopup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            lat: 40.631003384366842,
            lng: 22.953261341104508,
            currentPos: null,
            zoom: 13,
            loading : false
        }
    }

    handlePopup(event){
        this.setState  ({currentPos : event.latlng }) 
    }

    handleSubmit(){
        var query = this.state.currentPos;
        
        const pos = qs.stringify(query);
        this.props.history.push({
            pathname: `/main`,
            search: pos
            })
    }        
    

    render() {
        const position = [this.state.lat, this.state.lng]
        return (
              <div className="box-about">
                  <h2>Επιλέξτε Τοποθεσία {"  "} 
                  <button type="submit" className="btn btn-primary flight" onClick={this.handleSubmit} disabled={!this.state.currentPos}>Επιβεβαίωση</button></h2>
                  <Map className="map" center={position} zoom={this.state.zoom}  onClick={this.handlePopup}>
                      <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      { this.state.currentPos && 
                    <Marker position={this.state.currentPos} draggable={true}>
                    </Marker>
                    }
                  </Map>
                  
              </div>
          )
    }
}

export default withRouter(Location);