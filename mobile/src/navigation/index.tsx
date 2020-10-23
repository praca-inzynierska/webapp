import SwitchNavigator from './navigation'
import { createAppContainer } from 'react-navigation'
import { enableScreens } from 'react-native-screens'

enableScreens()

const RootNavigator = createAppContainer(SwitchNavigator)
export default RootNavigator
