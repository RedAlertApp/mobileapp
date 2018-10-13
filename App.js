import React from "react"
import Ui from "./src/Ui.js"
import Reports from "./src/Reports.js"
import { Provider } from "react-redux"
import store from "./src/store.js"
import ScrollableTabView from "react-native-scrollable-tab-view"
import CustomTabBar from "./src/CustomTabBar"

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ScrollableTabView
          renderTabBar={() => <CustomTabBar />}
          initialPage={1}
          tabBarPosition="bottom"
          style={{ backgroundColor: "#FAFAFA" }}
        >
          <Ui tabLabel="Profil" />
          <Ui tabLabel="Zgłoś problem" />
          <Reports tabLabel="Lista zgłoszeń" />
        </ScrollableTabView>
      </Provider>
    )
  }
}
export default App
