import React from "react"
import { MapView } from "expo"
import { connect } from "react-redux"

class MarkersList extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.reports
          .filter(report => {
            let distance = this.calculateDistanceTo(
              report.latitude,
              report.longitude
            ).toFixed(0)
            return distance < 2000
          })
          .map((report, key) => (
            <MapView.Marker
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude
              }}
              title={report.description}
              description={report.extra}
              key={key}
            />
          ))}
      </React.Fragment>
    )
  }

  calculateDistanceTo(lat, lng) {
    return this.getDistanceFromLatLonInMetres(
      +lat,
      +lng,
      +this.props.region.latitude,
      +this.props.region.longitude
    )
  }

  getDistanceFromLatLonInMetres(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295 // Math.PI / 180
    var c = Math.cos
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

    return 12742000 * Math.asin(Math.sqrt(a)) // 2 * R * 1000; R = 6371 km
  }
}

const mapStateToProps = state => {
  return {
    region: state.appReducer.region,
    reports: state.appReducer.reports
  }
}

export default connect(mapStateToProps)(MarkersList)
