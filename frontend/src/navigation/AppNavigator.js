import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "../screens/AuthScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";  // Placeholder for now
import ReportIssueScreen from "../screens/ReportIssueScreen";  // Will implement later
import StatisticsScreen from "../screens/StatisticsScreen"; 

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: "Statistics" }} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} options={{ title: "Report Issue" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
