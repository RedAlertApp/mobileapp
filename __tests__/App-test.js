import "react-native"
import React from "react"
import App from "../App"
import renderer from "react-test-renderer"

describe("App component", () => {
  jest.useFakeTimers()

  it("renders without crashing", async () => {
    const tree = renderer.create(<App />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
