import { useLocalSearchParams, Stack } from "expo-router";
import ActualizarUsuarioScreen from "../../screens/ActualizarUsuarioScreen";

export default function ActualizarRoute() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: "Actualizar Usuario" }}
      />
      <ActualizarUsuarioScreen id={id} />
    </>
  );
}
