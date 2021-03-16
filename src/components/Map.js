import React from 'react';
import mapboxgl from 'mapbox-gl'
import {connect} from 'react-redux'
import MarkerForm from './MarkerForm.js'
import RenderMarker from './RenderMarker.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {destroyMarker, likeMarker, unlikeMarker} from '../actions/MarkerActions.js'
import Login from './Login.js'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

class Map extends React.Component {
  state = {
    map: "",
    newMarkerInfo: null,
    redirect: false
  }

  componentDidMount() {
    this.renderMap()
  }

  componentDidUpdate() {
    const els = document.querySelectorAll(".mapboxgl-marker")
    if (els.length > 0) {
      els.forEach(e=>e.remove())
    }
    this.renderMarkers()

  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.markers !== this.props.markers) {
      return true
    } else{
      return false
    }
  }

  
  render(){
    if (this.state.redirect) {
      return(
        <Login heading={'Please login to use this feature'}/>
      )
    
    } else{
      return(
        <>
          <div className="map-container">
            <div id="map"></div>
          </div>
          <div className="side-bar">
          {this.state.newMarkerInfo ? <div onClick={this.removeForm}>X</div> : null}
            <div id="newMarkerContainer">
              <h5 style={{margin:"0"}}>New Marker</h5>
              {this.props.currentUser ? <div id="newMarker" className="marker" style={{backgroundImage:`url(${this.props.currentUser.image})`}}></div> : null}
            </div>
            {this.state.newMarkerInfo ? <MarkerForm removeForm={this.removeForm} newMarkerInfo={this.state.newMarkerInfo}/> : null}
          </div>
        </>
      )
    }
  }

  removeForm = () => {
    this.setState({newMarkerInfo: null})
    document.getElementById("newMarkerContainer").style.display = "inline-block"
    document.getElementById("temp-marker").remove()
  }

  removeMap = () =>{
    this.state.map.remove()
  }

  renderMap() {
    if (this.state.map !== ""){
      this.state.map.remove()
    }
   
    mapboxgl.accessToken = process.env.REACT_APP_API_KEY;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/nicklevenson/ckm82ay4haed317r1gmlt32as', // style URL
      center: [-77.0353, 38.8895], // starting position [lng, lat]
      zoom: 1 // starting zoom
    });
    map.addControl(
      new MapboxGeocoder({
      accessToken: process.env.REACT_APP_API_KEY,
      mapboxgl: mapboxgl
      })
    );
    this.setState({map: map})
    
    this.renderNewMarkerForm(map)
    
  } 

  renderMarkers(){

    this.props.markers.forEach(marker => RenderMarker({
      marker: marker, map: this.state.map, 
      handleMarkerSelect: this.props.handleMarkerSelect, 
      destroyMarker: this.props.destroyMarker, 
      currentUser: this.props.currentUser,
      likeMarker: this.props.likeMarker,
      unlikeMarker: this.props.unlikeMarker
    }))
  }

  

  renderNewMarkerForm = (map) => {
    
    const newMarkerButton = document.getElementById("newMarkerContainer")
    
    newMarkerButton.addEventListener('mousedown', (e) => {
      
      if (this.props.currentUser.username) {
        const triggerState = (newMarkerInfo) => this.setState({newMarkerInfo: newMarkerInfo})
        const renderTempMarker = (marker) => this.renderTempMarker(marker)
        function handleMouseMove(e) {
          if (document.getElementById("temp-marker")){
            document.getElementById("temp-marker").remove()
          }
          const coords = [e.lngLat.lng, e.lngLat.lat]
          const marker = {
            title: "New Marker",
            lat: coords[1],
            lng: coords[0],
            info: "Be sure to submit me"
          }
          renderTempMarker(marker)
        }
          map.on('mousemove', handleMouseMove)        
          map.on('mouseup', function mapEvent(e){
              map.off('mousemove', handleMouseMove)
              document.getElementById("temp-marker").remove()
              const coords = [e.lngLat.lng, e.lngLat.lat]
              const marker = {
                title: "New Marker",
                lat: coords[1],
                lng: coords[0],
                info: "Be sure to submit me"
              }
              triggerState(marker)
              renderTempMarker(marker)
              map.off('mouseup',  mapEvent)
                 
        })
      }else{
        this.setState({redirect: true})
      }
    })
  }


  renderTempMarker(marker) {
    var coords = [marker.lng, marker.lat];
    var temp = document.createElement('div');
    temp.className = 'marker';
    temp.id = 'temp-marker'
    temp.style.backgroundImage = `url(${this.props.currentUser.image})`
    new mapboxgl.Marker(temp)
    .setLngLat(coords)
    .addTo(this.state.map);
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    destroyMarker: (marker) => dispatch(destroyMarker(marker)),
    likeMarker: (marker, currentUserId) => dispatch(likeMarker(marker, currentUserId)),
    unlikeMarker: (marker, currentUserId) => dispatch(unlikeMarker(marker, currentUserId))
  }
} 

const mapStateToProps = (state) => {
  return {
      currentUser: state.currentUser.currentUser
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(Map)