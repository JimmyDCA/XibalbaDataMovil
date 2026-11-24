import { Platform, Pressable, Text, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Campo, { estilosEntrada } from './Campo';
import { colores } from '../../theme';
import { formatearFecha } from '../../utils/fecha';

type Props = {
  etiqueta: string;
  valor: Date;
  onCambio: (d: Date) => void;
  /** Fecha máxima permitida (por defecto: ahora). */
  maxima?: Date;
  obligatorio?: boolean;
  error?: string;
};

/** Fecha y hora. En Android abre el diálogo de fecha y luego el de hora; en iOS usa el selector compacto. */
export default function CampoFechaHora({ etiqueta, valor, onCambio, maxima, obligatorio, error }: Props) {
  const limite = maxima ?? new Date();

  const abrirAndroid = () => {
    DateTimePickerAndroid.open({
      value: valor,
      mode: 'date',
      maximumDate: limite,
      onChange: (evento, fecha) => {
        if (evento.type !== 'set' || !fecha) return;
        DateTimePickerAndroid.open({
          value: fecha,
          mode: 'time',
          is24Hour: true,
          onChange: (evHora, hora) => {
            if (evHora.type !== 'set' || !hora) return;
            const final = new Date(fecha);
            final.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
            onCambio(final);
          },
        });
      },
    });
  };

  return (
    <Campo etiqueta={etiqueta} obligatorio={obligatorio} error={error}>
      {Platform.OS === 'ios' ? (
        <View style={[estilosEntrada.entrada, styles.ios]}>
          <DateTimePicker
            value={valor}
            mode="datetime"
            display="compact"
            maximumDate={limite}
            themeVariant="light"
            accentColor={colores.primario}
            locale="es-MX"
            onChange={(_, fecha) => fecha && onCambio(fecha)}
          />
        </View>
      ) : (
        <Pressable
          onPress={abrirAndroid}
          style={[estilosEntrada.entrada, styles.boton, !!error && estilosEntrada.entradaError]}
          accessibilityRole="button"
        >
          <Text style={estilosEntrada.texto}>{formatearFecha(valor)}</Text>
          <Ionicons name="calendar-outline" size={22} color={colores.primario} />
        </Pressable>
      )}
    </Campo>
  );
}

const styles = StyleSheet.create({
  ios: { alignItems: 'flex-start', justifyContent: 'center' },
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
