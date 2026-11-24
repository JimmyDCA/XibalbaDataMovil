import { useState } from 'react';
import { TextInput, type KeyboardTypeOptions } from 'react-native';
import Campo, { estilosEntrada } from './Campo';
import { colores } from '../../theme';

type Props = {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  obligatorio?: boolean;
  ayuda?: string;
  error?: string;
  teclado?: KeyboardTypeOptions;
  multilinea?: boolean;
  placeholder?: string;
};

/** Campo de texto o numérico (el teclado se elige con `teclado`). */
export default function Entrada({
  etiqueta, valor, onCambio, obligatorio, ayuda, error, teclado = 'default', multilinea, placeholder,
}: Props) {
  const [foco, setFoco] = useState(false);

  return (
    <Campo etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error}>
      <TextInput
        style={[
          estilosEntrada.entrada,
          multilinea && { minHeight: 96, paddingTop: 12, textAlignVertical: 'top' },
          foco && { borderColor: colores.foco, borderWidth: 2 },
          !!error && estilosEntrada.entradaError,
        ]}
        value={valor}
        onChangeText={onCambio}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
        keyboardType={teclado}
        multiline={multilinea}
        placeholder={placeholder}
        placeholderTextColor={colores.textoTenue}
        autoCorrect={teclado === 'default'}
        returnKeyType={multilinea ? 'default' : 'done'}
      />
    </Campo>
  );
}
