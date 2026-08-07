import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuthHeader } from "../utils/auth";

import { API_URL } from "../utils/config";
export default function ActualizarUsuarioScreen({ id }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        const encontrado = datos.usuarios.find((u) => u.id === Number(id));
        if (encontrado) {
          setNombre(encontrado.nombre);
          setEdad(String(encontrado.edad));
        }
      } catch (error) {
        console.log("Error API: ", error);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [id]);

  const guardarCambios = async () => {
    const nombreLimpio = nombre.trim();
    const edadLimpia = edad.trim();

    if (nombreLimpio === "" || edadLimpia === "") {
      mostrarMensaje("Vacíos", "Completa el formulario");
      return;
    }

    const edadNumerica = Number(edadLimpia);
    if (Number.isNaN(edadNumerica)) {
      mostrarMensaje("Dato inválido", "La edad debe ser un número");
      return;
    }

    try {
      setGuardando(true);
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({ nombre: nombreLimpio, edad: edadNumerica }),
      });

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      mostrarMensaje("Éxito", "Usuario actualizado correctamente");
      router.back();
    } catch (error) {
      console.log("Error API: ", error);
      mostrarMensaje("Error", "No se pudo actualizar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Actualizar Usuario</Text>

      <Text style={estilos.etiqueta}>Nombre</Text>
      <TextInput
        style={estilos.input}
        value={nombre}
        onChangeText={setNombre}
        editable={!guardando}
      />

      <Text style={estilos.etiqueta}>Edad</Text>
      <TextInput
        style={estilos.input}
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
        editable={!guardando}
      />

      <Pressable
        style={estilos.boton}
        onPress={guardarCambios}
        disabled={guardando}
      >
        <Text style={estilos.textoBoton}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  contenedor: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F2937",
  },
  etiqueta: { fontSize: 12, color: "#888", marginBottom: 4 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#facc15",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: { fontWeight: "700", fontSize: 16 },
});
