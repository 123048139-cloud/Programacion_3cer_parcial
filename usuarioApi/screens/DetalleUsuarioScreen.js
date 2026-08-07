import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getAuthHeader } from "../utils/auth";

import { API_URL } from "../utils/config";
export default function DetalleUsuarioScreen({ id }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const obtenerUsuario = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      const encontrado = datos.usuarios.find((u) => u.id === Number(id));
      setUsuario(encontrado || null);
    } catch (error) {
      console.log("Error API: ", error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerUsuario();
    }, [id]),
  );

  const confirmarEliminacion = async () => {
    try {
      setEliminando(true);
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: getAuthHeader() },
      });

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      setModalVisible(false);
      mostrarMensaje("Éxito", "Usuario eliminado correctamente");
      router.back();
    } catch (error) {
      console.log("Error API: ", error);
      mostrarMensaje("Error", "No se pudo eliminar el usuario");
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={estilos.centrado}>
        <Text>Usuario no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Detalles del Usuario</Text>

      <View style={estilos.campo}>
        <Text style={estilos.etiqueta}>Nombre</Text>
        <Text style={estilos.valor}>{usuario.nombre}</Text>
      </View>

      <View style={estilos.campo}>
        <Text style={estilos.etiqueta}>Edad</Text>
        <Text style={estilos.valor}>{usuario.edad} años</Text>
      </View>

      <Pressable
        style={estilos.botonActualizar}
        onPress={() => router.push(`/actualizar/${id}`)}
      >
        <Text style={estilos.textoBotonActualizar}>Actualizar</Text>
      </Pressable>

      <Pressable
        style={estilos.botonEliminar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={estilos.textoBotonEliminar}>Eliminar</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={estilos.fondoModal}>
          <View style={estilos.contenidoModal}>
            <Text style={estilos.tituloModal}>Confirmar eliminación</Text>
            <Text style={estilos.textoModal}>
              ¿Estás seguro de que deseas eliminar al usuario {usuario.nombre}?
            </Text>
            <View style={estilos.botonesModal}>
              <Pressable
                style={estilos.botonCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable
                style={estilos.botonConfirmar}
                onPress={confirmarEliminacion}
                disabled={eliminando}
              >
                <Text style={{ color: "#fff" }}>
                  {eliminando ? "Eliminando..." : "Sí, eliminar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  campo: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  etiqueta: { fontSize: 12, color: "#888" },
  valor: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  botonActualizar: {
    backgroundColor: "#facc15",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  textoBotonActualizar: { fontWeight: "600" },
  botonEliminar: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotonEliminar: { color: "#fff", fontWeight: "600" },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contenidoModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  tituloModal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#dc2626",
  },
  textoModal: { fontSize: 14, color: "#555", marginBottom: 16 },
  botonesModal: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  botonCancelar: { padding: 10 },
  botonConfirmar: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
