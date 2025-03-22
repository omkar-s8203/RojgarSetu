import { Redirect } from "expo-router";
import { useEffect } from "react";
import Notifications from "expo-notifications";

export default function Index() {
  useEffect(() => {
    const init = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    init();
  }, []);

  return <Redirect href="/home/(tabs)/explore" />;
}
