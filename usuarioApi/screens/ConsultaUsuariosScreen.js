import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

export default function ConsultaUsuariosScreen() {
  const [usuarios, setUsuario] = useState([]);
  const router = useRouter();

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch("http://10.16.72.177:5000/v1/usuarios");
      const datos = await respuesta.json();
      console.log("Respuesta API: ", datos);
      setUsuario(datos.usuarios);
    } catch (error) {
      console.log("Error API: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerUsuarios();
    }, []),
  );

  const renderTarjeta = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <View style={styles.linea}></View>
      <Text style={styles.info}>Edad: {item.edad} años</Text>
      <Pressable onPress={() => router.push(`/detalle/${item.id}`)}>
        <Text style={styles.verDetalles}>Ver detalles →</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTarjeta}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 20 },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  nombre: { fontSize: 20, fontWeight: "bold", color: "#2563EB" },
  linea: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 },
  info: { fontSize: 16, color: "#4B5563" },
  verDetalles: {
    color: "#2563EB",
    textAlign: "right",
    marginTop: 10,
    fontWeight: "600",
  },
});
