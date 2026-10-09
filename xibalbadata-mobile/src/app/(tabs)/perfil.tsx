import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor || '—'}</Text>
    </View>
  );
}

export default function Perfil() {
  const { usuario, signOut } = useAuth();
  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.cabecera}>
        <View style={styles.avatar}>
          <Text style={styles.inicial}>{inicial}</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
        <Text style={styles.rol}>{usuario?.rol}</Text>
      </View>

      <View style={styles.tarjeta}>
        <Dato etiqueta="Correo" valor={usuario?.correo} />
        <Dato etiqueta="Matrícula" valor={usuario?.matricula} />
        <Dato etiqueta="Teléfono" valor={usuario?.telefono} />
      </View>

      <Pressable style={styles.boton} onPress={signOut}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f2a', padding: 16, gap: 20 },
  cabecera: { alignItems: 'center', marginTop: 16, gap: 6 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(79,195,247,0.2)',
    borderWidth: 1, borderColor: '#4fc3f7',
    alignItems: 'center', justifyContent: 'center',
  },
  inicial: { color: '#4fc3f7', fontSize: 38, fontWeight: '700' },
  nombre: { color: '#fff', fontSize: 22, fontWeight: '700' },
  rol: { color: '#9bb8c7', fontSize: 14, textTransform: 'capitalize' },
  tarjeta: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24, padding: 8,
  },
  dato: { paddingVertical: 12, paddingHorizontal: 12 },
  etiqueta: { color: '#9bb8c7', fontSize: 12, marginBottom: 2 },
  valor: { color: '#fff', fontSize: 16 },
  boton: {
    backgroundColor: 'rgba(198,40,40,0.9)', borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 'auto',
  },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});