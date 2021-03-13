import React from 'react'
import Map from '../components/Map.js';
import {connect} from 'react-redux'
// import {addMarker} from './actions/addMarker.js'
import MarkerInfo from '../components/MarkerInfo.js'
class PersonalMapContainer extends React.Component{
  state = {
    selectedMarker: {}
  }

  handleMarkerSelect = (marker) => {
    this.setState({selectedMarker: marker})
  }
 
  render(){
    return(
      <div className="outer-map-container">
        <h1 className="map-header">My Map</h1>
        <Map markers={this.props.markers} handleMarkerSelect={this.handleMarkerSelect}/>
        <br/>
        <div id="marker-info-container">
          {this.state.selectedMarker.title ? <MarkerInfo marker={this.state.selectedMarker} handleMarkerSelect={this.handleMarkerSelect}/> : null}
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
      markers: state.markers.markers
  }
}

export default connect(mapStateToProps)(PersonalMapContainer)