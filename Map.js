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

    this.getLocation()

    setInterval(() => {
      this.getLocation()
    }, 5000)
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
              let distance = this.calculateDistance(
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

  calculateDistance(lat, lng) {
    return this.getDistanceFromLatLonInMetres(
      Number(lat),
      Number(lng),
      Number(this.props.region.latitude),
      Number(this.props.region.longitude)
    )
  }

  getDistanceFromLatLonInMetres(lat1, lon1, lat2, lon2) {
    var R = 6371 // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1) // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1)
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c * 1000 // Distance in m
    return d
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  async getLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== "granted") {
      console.log("Permission to access location was denied")
    } else {
      let location = await Location.getCurrentPositionAsync({})
      let newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
      this.props.dispatch(updateRegion(newRegion))
    }
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
