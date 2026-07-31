import { useLocalSearchParams, Stack } from "expo-router";
import DetalleUsuarioScreen from "../../screens/DetalleUsuarioScreen";

export default function DetalleRoute() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: "Detalle del usuario" }}
      />
      <DetalleUsuarioScreen id={id} />
    </>
  );
}
