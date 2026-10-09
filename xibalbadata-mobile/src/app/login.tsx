import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

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
      console.log('LOGIN ERROR:', e?.message, e?.code, e?.response?.status, e?.config?.baseURL, e?.config?.url);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>XibalbaData</Text>
      <Text style={styles.subtitulo}>Monitoreo de mantos acuíferos</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        autoCapitalize="none"
        autoCorrect={false}
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
        onSubmitEditing={entrar}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.boton} onPress={entrar} disabled={enviando}>
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Entrar</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b1f2a' },
  titulo: { fontSize: 32, fontWeight: '700', color: '#fff', textAlign: 'center' },
  subtitulo: { color: '#9bb8c7', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 12, fontSize: 16,
  },
  error: { color: '#ff8a80', marginBottom: 12, textAlign: 'center' },
  boton: {
    backgroundColor: '#1e88e5', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 4,
  },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});