import React from "react"
import { View, BackHandler } from "react-native"
import Map from "./Map"
import ReportButtons from "./ReportButtons"
import ActionButton from "react-native-action-button"
import { connect } from "react-redux"
import { START_REPORT, DELETE_REPORT } from "./actions/actionTypes"
import { updateBottomState } from "./actions"
import { View as AnimatableView } from "react-native-animatable"

class Ui extends React.Component {
  constructor() {
    super()
    this.extendAppBar = this.extendAppBar.bind(this)

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.props.level === 3) {
        this.props.dispatch(updateBottomState(this.props.category))
        return true
      } else if (this.props.level === 2) {
        this.props.dispatch(updateBottomState(START_REPORT))
        return true
      } else if (this.props.level === 1) {
        this.props.dispatch(updateBottomState(DELETE_REPORT))
        return true
      }
      return false
    })
  }
  extendAppBar() {
    this.props.dispatch(updateBottomState(START_REPORT))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />

        <AnimatableView
          transition="height"
          style={{
            height: this.props.height,
            backgroundColor: "#FAFAFA",
            justifyContent: "center"
          }}
        >
          <ReportButtons />
        </AnimatableView>

        <ActionButton
          transition
          style={{ position: "absolute" }}
          buttonColor="rgba(229, 57, 53, 1)"
          offsetY={56 - this.props.buttonSize / 2}
          onPress={this.extendAppBar}
          position="center"
          size={this.props.buttonSize}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    region: state.appReducer.region,
    reports: state.appReducer.reports,
    socket: state.appReducer.socket,
    bottomState: state.uiReducer.bottomState,
    level: state.uiReducer.level,
    height: state.uiReducer.height,
    buttonSize: state.uiReducer.buttonSize,
    category: state.uiReducer.category
  }
}

export default connect(mapStateToProps)(Ui)
