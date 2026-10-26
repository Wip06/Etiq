import { router, useLocalSearchParams } from 'expo-router';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Alternatives } from '@/components/Alternatives';
import { Button } from '@/components/Button';
import { CategoryComparison } from '@/components/CategoryComparison';
import { ImpactEquivalents } from '@/components/ImpactEquivalents';
import { MaterialInfoButton } from '@/components/MaterialInfo';
import { OfficialCostLabel } from '@/components/OfficialCostLabel';
import { categories, type Category } from '@/data/categories';
import { COUNTRY_NAMES, MATERIAL_NAMES } from '@/data/ecobalyse';
import { syntheticGrams } from '@/data/equivalents';
import { compareToCategory, findAlternatives } from '@/data/portalStats';
import { estimateCost } from '@/services/ecobalyse';
import { getPhoto } from '@/services/photoStore';
import { LabelReaderError, readLabel, type Label, type LabelMaterial } from '@/services/labelReader';
import { scoreLabelImageUrl } from '@/services/portal';
import { colors } from '@/theme/colors';

// Taille maximale envoyée au service de lecture : au-delà, l'image est réduite sans gain de lecture.
const MAX_SIDE = 1568;
// La méthode ne calcule pas un vêtement dont 20 % ou plus de la masse est une matière non modélisée.
const MAX_UNKNOWN_SHARE = 0.2;

type Step =
  | { name: 'reading' }
  | { name: 'error'; message: string }
  | { name: 'review'; label: Label }
  | { name: 'computing'; label: Label }
  | { name: 'result'; label: Label; category: Category; cost: number; massKg: number };

// Parts Ecobalyse (somme = 1). Une matière non modélisée de moins de 20 % est ignorée et les
// autres sont ramenées à 100 %, à défaut d'équivalent dans la méthode.
function toEcobalyseMaterials(materials: LabelMaterial[]) {
  const total = materials.reduce((sum, material) => sum + material.percent, 0);
  const unknown = materials.filter((m) => m.id === 'autre').reduce((sum, m) => sum + m.percent, 0);
  if (total <= 0 || unknown / total >= MAX_UNKNOWN_SHARE) return null;

  const merged = new Map<string, number>();
  for (const material of materials) {
    if (material.id !== 'autre') merged.set(material.id, (merged.get(material.id) ?? 0) + material.percent);
  }
  const known = total - unknown;
  return [...merged].map(([id, percent]) => ({ id, share: percent / known }));
}

async function photoToBase64(uri: string, width: number, height: number): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  if (Math.max(width, height) > MAX_SIDE) {
    context.resize(height >= width ? { height: MAX_SIDE } : { width: MAX_SIDE });
  }
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
  if (!saved.base64) throw new Error('Photo illisible');
  return saved.base64;
}

export default function LabelScreen() {
  const params = useLocalSearchParams<{ photo: string }>();
  // Absente si l'app a été rechargée depuis la photo : elle n'est gardée qu'en mémoire.
  const photo = getPhoto(params.photo);
  const [step, setStep] = useState<Step>({ name: 'reading' });
  const [category, setCategory] = useState<Category | null>(null);
  const [massText, setMassText] = useState('');
  const [priceText, setPriceText] = useState('');

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    photoToBase64(photo.uri, photo.width || MAX_SIDE, photo.height || MAX_SIDE)
      .then(readLabel)
      .then((label) => !cancelled && setStep({ name: 'review', label }))
      .catch((error) => {
        if (cancelled) return;
        // Une autre erreur vient de la préparation de la photo (redimensionnement), avant tout envoi.
        const message =
          error instanceof LabelReaderError
            ? error.message
            : `Impossible de préparer la photo.${__DEV__ && error instanceof Error ? `\n\n${error.message}` : ''}`;
        setStep({ name: 'error', message });
      });
    return () => {
      cancelled = true;
    };
  }, [photo]);

  // Masse médiane de la catégorie proposée par défaut, tant que l'utilisateur ne l'a pas changée.
  const chooseCategory = (next: Category) => {
    if (!massText || massText === String(category?.defaultMassGrams)) setMassText(String(next.defaultMassGrams));
    setCategory(next);
  };

  if (!photo) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>Photo introuvable. Reprenez la photo de l’étiquette.</Text>
        <Button label="Reprendre la photo" onPress={() => router.back()} />
      </View>
    );
  }

  if (step.name === 'reading' || step.name === 'computing') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.message}>
          {step.name === 'reading' ? 'Lecture de l’étiquette…' : 'Calcul du coût environnemental…'}
        </Text>
      </View>
    );
  }

  if (step.name === 'error') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>{step.message}</Text>
        <Button label="Reprendre la photo" onPress={() => router.back()} />
      </View>
    );
  }

  const { label } = step;
  const materials = toEcobalyseMaterials(label.materials);

  if (!label.readable || label.materials.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Étiquette illisible</Text>
        <Text style={styles.message}>
          Photographiez l’étiquette de composition (« 100 % coton… ») de près, bien à plat et sans reflet.
        </Text>
        <Button label="Reprendre la photo" onPress={() => router.back()} />
      </View>
    );
  }

  if (step.name === 'result') {
    const per100g = step.cost / (step.massKg * 10);
    const comparison = compareToCategory(step.category.name, per100g);
    const alternatives = findAlternatives(step.category.name, { per100g, massGrams: step.massKg * 1000 });
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.badge}>Estimation Etiq</Text>
        <Text style={styles.title}>{step.category.name}</Text>
        <View>
          {label.materials.map((material) => (
            <View key={`${material.text}-${material.percent}`} style={styles.materialRow}>
              <Text style={styles.meta}>
                {material.percent} % {material.text}
              </Text>
              <MaterialInfoButton text={material.text} ecobalyseId={material.id} />
            </View>
          ))}
          {label.countryText ? <Text style={styles.meta}>{label.countryText}</Text> : null}
        </View>

        <View style={styles.costLabel}>
          <OfficialCostLabel imageUrl={scoreLabelImageUrl(step.cost, step.massKg)} cost={step.cost} per100g={per100g} />
        </View>
        <Text style={styles.costHint}>Plus le chiffre est bas, moins le vêtement a d’impact.</Text>

        {comparison && <CategoryComparison comparison={comparison} />}

        <ImpactEquivalents cost={step.cost} plastic={syntheticGrams(label.materials, step.massKg * 1000)} />

        <Alternatives alternatives={alternatives} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pourquoi une estimation ?</Text>
          <Text style={styles.text}>
            La marque n’a pas déclaré ce vêtement. Nous l’avons calculé avec la méthode officielle, à partir de son
            étiquette. Ce qui n’y figure pas (pays de tissage et de teinture, gamme de la marque, service de
            réparation) prend les valeurs par défaut de la méthode, qui sont défavorables : si la marque déclarait ses
            données, le coût serait souvent plus bas.
          </Text>
        </View>
        <Text style={styles.source}>
          Prototype : ce calcul n’est pas encore publié sur le portail officiel, une obligation avant tout affichage
          public.
        </Text>
        <Button label="Scanner un autre vêtement" onPress={() => router.back()} />
      </ScrollView>
    );
  }

  const mass = Number(massText.replace(',', '.'));
  const price = Number(priceText.replace(',', '.'));
  const canCompute = materials !== null && category !== null && mass >= 10;

  const compute = async () => {
    if (!materials || !category) return;
    setStep({ name: 'computing', label });
    try {
      const massKg = mass / 1000;
      const cost = await estimateCost({
        product: category.id,
        massKg,
        materials,
        countryMaking: label.countryOfMaking,
        priceEuros: price > 0 ? price : undefined,
      });
      setStep({ name: 'result', label, category, cost, massKg });
    } catch {
      setStep({ name: 'error', message: 'Le calculateur officiel ne répond pas. Réessayez dans un instant.' });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Étiquette lue</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Composition</Text>
        {label.materials.map((material) => (
          <View key={`${material.text}-${material.percent}`} style={styles.materialRow}>
            <Text style={[styles.text, styles.flex]}>
              {material.percent} % {material.text}
              {material.id === 'autre' ? ' (non modélisée)' : ` → ${MATERIAL_NAMES[material.id] ?? material.id}`}
            </Text>
            <MaterialInfoButton text={material.text} ecobalyseId={material.id} />
          </View>
        ))}
        <Text style={styles.cardTitle}>Confection</Text>
        <Text style={styles.text}>
          {label.countryText || 'Non indiquée'}
          {label.countryOfMaking !== '---' ? ` → ${COUNTRY_NAMES[label.countryOfMaking]}` : ''}
        </Text>
        {label.notes ? <Text style={styles.meta}>{label.notes}</Text> : null}
      </View>
      <Text style={styles.meta}>Une erreur de lecture ? Reprenez la photo de plus près.</Text>

      {materials === null ? (
        <Text style={styles.message}>
          Ce vêtement contient trop de matières que la méthode officielle ne sait pas encore calculer (soie, cuir...).
        </Text>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Type de vêtement</Text>
          <View style={styles.chips}>
            {categories.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: category?.id === item.id }}
                onPress={() => chooseCategory(item)}
                style={[styles.chip, category?.id === item.id && styles.chipSelected]}
              >
                <Text style={[styles.chipLabel, category?.id === item.id && styles.chipLabelSelected]}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Masse (g)</Text>
          <TextInput
            style={styles.input}
            value={massText}
            onChangeText={setMassText}
            keyboardType="number-pad"
            placeholder="Choisissez d’abord le type"
            placeholderTextColor={colors.secondary}
            accessibilityLabel="Masse du vêtement en grammes"
          />
          <Text style={styles.meta}>
            {category
              ? `Par défaut, la masse médiane d’un vêtement « ${category.name} » déclaré sur le portail. Pesez-le pour un calcul plus juste.`
              : 'La masse compte beaucoup dans le calcul.'}
          </Text>

          <Text style={styles.sectionTitle}>Prix (€, facultatif)</Text>
          <TextInput
            style={styles.input}
            value={priceText}
            onChangeText={setPriceText}
            keyboardType="decimal-pad"
            placeholder="Sur l’étiquette de prix"
            placeholderTextColor={colors.secondary}
            accessibilityLabel="Prix du vêtement en euros"
          />
          <Text style={styles.meta}>Le prix entre dans l’estimation de la durabilité du vêtement.</Text>

          <Button label="Calculer le coût environnemental" onPress={compute} disabled={!canCompute} />
        </>
      )}
    </ScrollView>
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
  content: {
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '600',
    color: colors.onAccent,
    backgroundColor: colors.secondary,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  // Ligne d'une matière, suivie du bouton qui ouvre sa fiche.
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 28,
  },
  flex: {
    flex: 1,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipLabel: {
    fontSize: 14,
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.onAccent,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  costHint: {
    marginTop: -4,
    fontSize: 14,
    textAlign: 'center',
    color: colors.secondary,
  },
  costLabel: {
    alignItems: 'center',
    marginVertical: 8,
  },
  source: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
