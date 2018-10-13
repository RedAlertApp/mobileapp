import React from "react"
import { StyleSheet, View } from "react-native"
import { MapView, Location, Permissions } from "expo"
import { updateRegion, updateReports, updateSocket } from "./actions"
import { connect } from "react-redux"
import io from "socket.io-client"

class Map extends React.Component {
  componentDidMount() {
    const socket = io(process.env.SERVER_URL)
    this.props.dispatch(updateSocket(socket))

    socket.on("reports", reports => {
      this.props.dispatch(updateReports(reports))
    })

    this.watchLocation()
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
          region={{
            latitude: this.props.region.latitude,
            longitude: this.props.region.longitude,
            latitudeDelta: this.props.region.latitudeDelta,
            longitudeDelta: this.props.region.longitudeDelta
          }}
          showsUserLocation
        >
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
        </MapView>
      </View>
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

  async watchLocation() {
    if (!this.isLocationPermitted()) {
      console.log("Permission to access location was denied")
    } else {
      Location.watchPositionAsync({}, location => {
        let newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }
        this.props.dispatch(updateRegion(newRegion))
      })
    }
  }

  async isLocationPermitted() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    return status === "granted"
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    flex: 1
  }
})

const mapStateToProps = state => {
  return {
    region: state.appReducer.region,
    reports: state.appReducer.reports
  }
}

export default connect(mapStateToProps)(Map)
