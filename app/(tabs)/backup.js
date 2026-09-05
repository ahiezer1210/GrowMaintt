import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NAV = [
  ['home-outline', 'ion', 'Home', 'home'],
  ['bar-chart-outline', 'ion', 'Reports', 'reports'],
  ['swap-horizontal', 'material', 'Transactions', 'swap'],
  ['layers-outline', 'material', 'Savings', 'layers'],
  ['person-outline', 'ion', 'Profile', 'account'],
];

const BackupScreen = ({ navigation }) => {
  const [autoBackup, setAutoBackup] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(false);
  const [useMobileData, setUseMobileData] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const renderNavIcon = (name, type, size = 26, color = '#FFFFFF') => {
    if (type === 'ion') {
      return <Ionicons color={color} name={name} size={size} />;
    }
    return <MaterialCommunityIcons color={color} name={name} size={size} />;
  };

  const handleNavPress = (screenName, tabKey) => {
    setActiveTab(tabKey);
    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar backgroundColor="#0D1B2A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons color="#FFFFFF" name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Backup</Text>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Bloque Superior */}
      <View style={styles.topSection}>
        {/* Card 1: Estado del Backup */}
        <View style={styles.successCard}>
          <View style={styles.successHeader}>
            <MaterialCommunityIcons color="#000000" name="shield-check-outline" size={26} />
            <Text style={styles.successTitle}>
              Backup Completed
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>100%</Text>
          </View>
        </View>

        {/* Card 2: Resumen de Datos */}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCardWhite}>
            <Feather color="#23BDEE" name="arrow-up-right" size={20} style={styles.cardIcon} />
            <Text style={styles.infoLabelDark}>Last Backup</Text>
            <Text style={styles.infoValueDark}>11/10/2025</Text>
          </View>

          <View style={styles.infoCardBlue}>
            <MaterialCommunityIcons color="#FFFFFF" name="database-outline" size={20} style={styles.cardIcon} />
            <Text style={styles.infoLabelLight}>Size</Text>
            <Text style={styles.infoValueLight}>268 MB</Text>
          </View>
        </View>
      </View>

      {/* Bloque Inferior */}
      <View style={styles.whiteSheet}>
        <Text style={styles.sectionTitle}>Backup Settings</Text>

        <View style={styles.greyDivider} />

        <Text style={styles.descriptionText}>
          Save a backup of your data in the cloud To Ensure You Don't Lose Your Data When You Get A New Phone With Android/Apple.
        </Text>

        {/* Switches */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Automatic Backups</Text>
          <Switch
            value={autoBackup}
            onValueChange={setAutoBackup}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#E0E0E0', true: '#0D1B2A' }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Include Videos</Text>
          <Switch
            value={includeVideos}
            onValueChange={setIncludeVideos}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#E0E0E0', true: '#0D1B2A' }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Use Mobile Data</Text>
          <Switch
            value={useMobileData}
            onValueChange={setUseMobileData}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#E0E0E0', true: '#0D1B2A' }}
          />
        </View>

        {/* Sección Cifrado */}
        <View style={styles.encryptionSection}>
          <Text style={styles.encryptionTitle}>End-to-End Encryption</Text>
          <Text style={styles.encryptionDescription}>
            For More Security, You Can Protect Your Backup With End-to-End Encryption
          </Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Disabled</Text>
            <Switch
              value={endToEndEncryption}
              onValueChange={setEndToEndEncryption}
              thumbColor="#FFFFFF"
              trackColor={{ false: '#E0E0E0', true: '#0D1B2A' }}
            />
          </View>
        </View>

        <View style={styles.greyDivider} />

        {/* Botón Guardar */}
        <TouchableOpacity activeOpacity={0.85} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Navegación Inferior */}
      <View style={styles.bottomBarContainer}>
        <SafeAreaView edges={['bottom']} style={styles.bottomBarWrapper}>
          <View style={styles.bottomTabBar}>
            {NAV.map(([name, type, screenName, tabKey], index) => {
              const isSelected = activeTab === tabKey;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNavPress(screenName, tabKey)}
                  activeOpacity={0.7}
                  style={styles.tabItem}
                >
                  {renderNavIcon(
                    name,
                    type,
                    26,
                    isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 45,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 30,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  successTitle: {
    color: '#0D1B2A',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#23BDEE',
  },
  progressText: {
    color: '#23BDEE',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  infoCardWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '48%',
    alignItems: 'center',
  },
  infoCardBlue: {
    backgroundColor: '#23BDEE',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '48%',
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 2,
  },
  infoLabelDark: {
    color: '#546E7A',
    fontSize: 10,
  },
  infoValueDark: {
    color: '#0D1B2A',
    fontSize: 13,
    fontWeight: '700',
  },
  infoLabelLight: {
    color: '#E0F7FA',
    fontSize: 10,
  },
  infoValueLight: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  whiteSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0D1B2A',
    fontSize: 13,
    fontWeight: '700',
  },
  greyDivider: {
    height: 5,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
    marginVertical: 4,
  },
  descriptionText: {
    color: '#546E7A',
    fontSize: 9.5,
    lineHeight: 13,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 1,
  },
  settingLabel: {
    color: '#263238',
    fontSize: 11.5,
    fontWeight: '500',
  },
  encryptionSection: {
    marginTop: 2,
  },
  encryptionTitle: {
    color: '#0D1B2A',
    fontSize: 11.5,
    fontWeight: '700',
  },
  encryptionDescription: {
    color: '#546E7A',
    fontSize: 9,
    lineHeight: 12,
    marginBottom: 2,
  },
  saveButton: {
    backgroundColor: '#23BDEE',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 35,
    alignSelf: 'center',
    width: '55%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBarContainer: {
    backgroundColor: '#FFFFFF',
  },
  bottomBarWrapper: {
    backgroundColor: '#23BDEE',
    borderTopLeftRadius: 35,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
    backgroundColor: '#23BDEE',
    borderTopLeftRadius: 35,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackupScreen;