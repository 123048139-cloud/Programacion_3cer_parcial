export function getAuthHeader() {
  const credenciales = "admin:1234";
  const codificado =
    typeof btoa !== "undefined"
      ? btoa(credenciales)
      : Buffer.from(credenciales).toString("base64");

  return `Basic ${codificado}`;
}
