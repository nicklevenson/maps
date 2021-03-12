import React from 'react'
import {addMarker} from '../actions/addMarker.js'
import {connect} from 'react-redux'

class MarkerForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.props.newMarkerInfo)
    console.log(e.target.title.value)
  }
   render() {
    return (
      <div id="newMarkerForm">
        <h1>New Marker</h1>
        <form onSubmit={e=>this.handleSubmit(e)}>
          <label>Marker Title</label>
          <input type="text" name="title"></input>
          <label>Marker Info</label>
          <input type="textarea" name="info"></input>
          <input type="submit"></input>
        </form>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addMarker: (marker) => dispatch(addMarker(marker))
  }
}

export default connect(null, mapDispatchToProps)(MarkerForm)