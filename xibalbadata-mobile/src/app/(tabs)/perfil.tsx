import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import FondoPantalla from '../../components/FondoPantalla';
import { colores, fuentes, radios, superficies, tipografia } from '../../theme';

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
    <FondoPantalla>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.contenido}>
          <View style={styles.cabecera}>
            <View style={styles.avatar}>
              <Text style={styles.inicial}>{inicial}</Text>
            </View>
            <Text style={tipografia.tituloPantalla}>{usuario?.nombre}</Text>
            <Text style={[tipografia.subtitulo, styles.rol]}>{usuario?.rol}</Text>
          </View>

          <View style={[superficies.tarjetaBlanca, styles.tarjeta]}>
            <Text style={styles.tituloTarjeta}>Datos de la cuenta</Text>
            <Dato etiqueta="Correo" valor={usuario?.correo} />
            <Dato etiqueta="Matrícula" valor={usuario?.matricula} />
            <Dato etiqueta="Teléfono" valor={usuario?.telefono ? String(usuario.telefono) : undefined} />
          </View>

          <Pressable
            style={({ pressed }) => [
              superficies.botonPrimario,
              styles.salir,
              pressed && { backgroundColor: '#b02a37' },
            ]}
            onPress={signOut}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={tipografia.boton}>Cerrar sesión</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 16, gap: 20, flexGrow: 1 },
  cabecera: { alignItems: 'center', marginTop: 16, gap: 6 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: colores.superficie, borderWidth: 2, borderColor: colores.superficie,
    alignItems: 'center', justifyContent: 'center',
  },
  inicial: { fontFamily: fuentes.heavy, color: colores.primario, fontSize: 42 },
  rol: { textTransform: 'capitalize', opacity: 0.9 },
  tarjeta: { padding: 20 },
  tituloTarjeta: {
    fontFamily: fuentes.heavy, fontSize: 18, color: colores.primario,
    paddingBottom: 10, marginBottom: 4, borderBottomWidth: 2, borderBottomColor: colores.divisor,
  },
  dato: {
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colores.borde, borderStyle: 'dashed',
  },
  etiqueta: {
    fontFamily: fuentes.heavy, color: colores.textoTenue, fontSize: 12,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2,
  },
  valor: { fontFamily: fuentes.book, color: colores.textoFuerte, fontSize: 16 },
  salir: { backgroundColor: colores.peligro, marginTop: 'auto', borderRadius: radios.control },
});
