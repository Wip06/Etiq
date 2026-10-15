import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { normalizeGtin } from '@/utils/gtin';

type Mode = 'barcode' | 'label';

// Cadre de visée : large pour un code-barres, plus haut pour une étiquette cousue.
const FRAMES = {
  barcode: { width: 280, height: 160 },
  label: { width: 260, height: 300 },
} as const;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('barcode');
  const [isFocused, setIsFocused] = useState(false);
  // Évite d'ouvrir plusieurs fois le résultat tant que le code reste devant la caméra.
  const scanLocked = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      scanLocked.current = false;
      return () => setIsFocused(false);
    }, []),
  );

  const onBarcodeScanned = ({ data, type }: BarcodeScanningResult) => {
    if (scanLocked.current) return;
    scanLocked.current = true;
    // « scanned » distingue un vrai scan d'une ouverture depuis l'historique ou les favoris.
    router.push({ pathname: '/product/[gtin]', params: { gtin: normalizeGtin(data, type), scanned: '1' } });
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>
          Etiq a besoin de l’appareil photo pour scanner le code-barres ou l’étiquette de vos vêtements.
        </Text>
        <Button label="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
          onBarcodeScanned={mode === 'barcode' ? onBarcodeScanned : undefined}
        />
      )}

      <Viewfinder mode={mode} />

      <View style={styles.switcher}>
        <ModeButton label="Code-barres" active={mode === 'barcode'} onPress={() => setMode('barcode')} />
        <ModeButton label="Étiquette" active={mode === 'label'} onPress={() => setMode('label')} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          {mode === 'barcode'
            ? 'Placez le code-barres du vêtement dans le cadre.'
            : 'Lecture de l’étiquette : bientôt disponible.'}
        </Text>
      </View>
    </View>
  );
}

// Purement visuel : la caméra lit les codes-barres sur toute l'image, le cadre aide seulement à viser.
function Viewfinder({ mode }: { mode: Mode }) {
  return (
    <View style={styles.viewfinder}>
      <View style={styles.dim} />
      <View style={styles.viewfinderRow}>
        <View style={styles.dim} />
        <View style={FRAMES[mode]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={styles.dim} />
      </View>
      <View style={styles.dim} />
    </View>
  );
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.modeButton, active && styles.modeButtonActive]}
    >
      <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.text,
  },
  viewfinder: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  viewfinderRow: {
    flexDirection: 'row',
  },
  dim: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  switcher: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
    padding: 4,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  modeButtonActive: {
    backgroundColor: colors.accent,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modeLabelActive: {
    color: colors.onAccent,
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  hint: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.text,
  },
});
