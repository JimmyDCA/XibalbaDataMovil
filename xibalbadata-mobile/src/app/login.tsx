import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import FondoPantalla from '../components/FondoPantalla';
import Logos from '../components/Logos';
import { colores, fuentes, superficies, tipografia } from '../theme';

export default function Login() {
  const { signIn } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    if (!correo || !contrasena) {
      setError('Ingresa correo y contraseña');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      await signIn(correo.trim(), contrasena);
    } catch (e: any) {
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <FondoPantalla>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
            <Logos alto={44} />

            <View>
              <Text style={tipografia.tituloPantalla}>XibalbaData</Text>
              <Text style={[tipografia.subtitulo, styles.subtitulo]}>Monitoreo de mantos acuíferos</Text>
            </View>

            <View style={[superficies.panelVidrio, styles.panel]}>
              <Text style={tipografia.tituloTarjeta}>Iniciar sesión</Text>

              <View style={styles.campo}>
                <Text style={tipografia.etiquetaFormulario}>Correo</Text>
                <TextInput
                  style={[superficies.entrada, styles.entrada]}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colores.textoTenue}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={correo}
                  onChangeText={setCorreo}
                />
              </View>

              <View style={styles.campo}>
                <Text style={tipografia.etiquetaFormulario}>Contraseña</Text>
                <TextInput
                  style={[superficies.entrada, styles.entrada]}
                  placeholder="••••••••"
                  placeholderTextColor={colores.textoTenue}
                  secureTextEntry
                  value={contrasena}
                  onChangeText={setContrasena}
                  onSubmitEditing={entrar}
                />
              </View>

              {!!error && (
                <View style={styles.error}>
                  <Ionicons name="alert-circle" size={18} color={colores.aviso} />
                  <Text style={styles.errorTexto}>{error}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  superficies.botonPrimario,
                  pressed && { backgroundColor: colores.primarioPresionado },
                ]}
                onPress={entrar}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={22} color="#fff" />
                    <Text style={tipografia.boton}>Ingresar</Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { flexGrow: 1, justifyContent: 'center', padding: 16, gap: 24 },
  subtitulo: { textAlign: 'center', marginTop: 4, opacity: 0.9 },
  panel: { padding: 20, gap: 18 },
  campo: { gap: 6 },
  entrada: { fontFamily: fuentes.book, fontSize: 16, color: colores.primario },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorTexto: { fontFamily: fuentes.heavy, color: colores.aviso, fontSize: 14 },
});
