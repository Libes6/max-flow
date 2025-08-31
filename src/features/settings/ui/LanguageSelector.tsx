import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../../../shared/theme';
import { useSettingsStore, Language } from '../../../shared/lib/stores/useSettingsStore';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
];

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === language && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <View style={styles.languageInfo}>
        <Text style={[
          styles.languageName,
          item.code === language && styles.selectedText
        ]}>
          {item.nativeName}
        </Text>
        <Text style={[
          styles.languageCode,
          item.code === language && styles.selectedText
        ]}>
          {item.name}
        </Text>
      </View>
      {item.code === language && (
        <Ionicons 
          name="checkmark" 
          size={20} 
          color={colors.primary} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.settingIcon}>
          <Ionicons name="language-outline" size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{t('settings.language')}</Text>
          <Text style={styles.settingSubtitle}>
            {currentLanguage?.nativeName || t('languages.ru')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              style={styles.languagesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  languagesList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedLanguageItem: {
    backgroundColor: colors.primaryLight,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  languageCode: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
