import { Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import InicioOperador from '../../screens/InicioOperador';
import InicioAdministrador from '../../screens/InicioAdministrador';

export default function Inicio() {
  const { usuario } = useAuth();
  const rol = usuario?.rol?.toLowerCase();

  if (rol === 'operador') return <InicioOperador />;
  if (rol === 'administrador') return <InicioAdministrador />;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rol no reconocido: {usuario?.rol}</Text>
    </View>
  );
}