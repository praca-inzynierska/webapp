import { createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import HomeScreen from '../screens/Home/HomeScreen'
import SplashScreen from '../screens/splash/SplashScreen'
import LoginScreen from '../screens/Authentication/LoginScreen'
import ClassSessionsScreen from '../screens/ClassSession/ClassSessionsScreen'
import TaskSessionsScreen from '../screens/TaskSession/TaskSessionsScreen'
import TaskSessionScreen from '../screens/TaskSession/TaskSessionScreen'
import WhiteboardScreen from '../screens/TaskSession/Tools/WhiteBoardScreen'

const TaskSessionStackNavigator = createStackNavigator(
  {
    TaskSessions: TaskSessionsScreen,
    TaskSession: TaskSessionScreen,
    Whiteboard: WhiteboardScreen
  }
)

const ClassSessionStackNavigator = createStackNavigator(
  {
    Zajęcia: ClassSessionsScreen,
    Zadania: TaskSessionStackNavigator
  }
)

const BottomMenuNavigator = createBottomTabNavigator(
  {
    Zajęcia: ClassSessionStackNavigator,
    Home: HomeScreen
  }
)

const SwitchNavigator = createSwitchNavigator(
  {
    routeSplash: SplashScreen,
    routeLogin: LoginScreen,
    routeHome: BottomMenuNavigator
  },
  {
    defaultNavigationOptions: 'routeSplash'
  }
)

// const

export default SwitchNavigator
