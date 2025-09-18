/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Инициализация Firebase
import './src/shared/lib/firebase';

AppRegistry.registerComponent(appName, () => App);
