import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundLight,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
          height: 65,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: (props) => (
            <Ionicons
              name={props.focused ? "home" : "home-outline"}
              size={24}
              color={props.color}
            />
          ),
          tabBarLabel: (props) => (
            <Text style={{ opacity: props.focused ? 1 : 0.7 }}>Home</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: (props) => (
            <Ionicons
              name={props.focused ? "compass" : "compass-outline"}
              size={24}
              color={props.color}
            />
          ),
          tabBarLabel: (props) => (
            <Text style={{ opacity: props.focused ? 1 : 0.7 }}>Explore</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: (props) => (
            <Ionicons
              name={props.focused ? "person" : "person-outline"}
              size={24}
              color={props.color}
            />
          ),
          tabBarLabel: (props) => (
            <Text style={{ opacity: props.focused ? 1 : 0.7 }}>Profile</Text>
          ),
        }}
      />
    </Tabs>
  );
}
