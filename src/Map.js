import React from "react"
import { StyleSheet, View } from "react-native"
import { MapView, Location, Permissions } from "expo"
import { updateRegion, updateReports, updateSocket } from "./actions"
import { connect } from "react-redux"
import io from "socket.io-client"
import MarkersList from "./MarkersList"

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
          <MarkersList />
        </MapView>
      </View>
    )
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
    region: state.appReducer.region
  }
}

export default connect(mapStateToProps)(Map)
