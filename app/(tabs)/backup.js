import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NAV = [
  ["home-outline", "ion"],
  ["bar-chart-outline", "ion"],
  ["swap-horizontal", "material"],
  ["layers-outline", "material"],
  ["person-outline", "ion"],
];

const BackupScreen = () => {
  const [autoBackup, setAutoBackup] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(false);
  const [useMobileData, setUseMobileData] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(false);

  const renderNavIcon = (name, type, size = 28, color = "#FFFFFF") => {
    if (type === "ion") {
      return <IonIcon name={name} size={size} color={color} />;
    }
    return <Icon name={name} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Backup</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.successHeader}>
            <Icon name="shield-check" size={28} color="#000000" />
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

        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Icon name="calendar-clock" size={22} color="#FFFFFF" />
            <Text style={styles.infoLabel}>Last Backup</Text>
            <Text style={styles.infoValue}>11/10/2025</Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="database" size={22} color="#FFFFFF" />
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>268 MB</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Backup Settings</Text>

          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Save a backup of your data in the cloud

            To Ensure You Don't Lose Your Data When You Get A New Phone
            With Android/Apple.
          </Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Automatic Backups</Text>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#555', true: '#081023' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Include Videos</Text>
            <Switch
              value={includeVideos}
              onValueChange={setIncludeVideos}
              trackColor={{ false: '#555', true: '#081023' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Use Mobile Data</Text>
            <Switch
              value={useMobileData}
              onValueChange={setUseMobileData}
              trackColor={{ false: '#555', true: '#081023' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.encryptionSection}>
            <Text style={styles.encryptionTitle}>End-to-End Encryption</Text>

            <Text style={styles.encryptionDescription}>
              For More Security, You Can Protect Your Backup
              With End-to-End Encryption
            </Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Disabled</Text>
              <Switch
                value={endToEndEncryption}
                onValueChange={setEndToEndEncryption}
                trackColor={{ false: '#555', true: '#081023' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomTabBar}>
        {NAV.map(([name, type], index) => (
          <TouchableOpacity key={index} style={styles.tabItem}>
            {renderNavIcon(name, type)}
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: '#093030',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 14,
    backgroundColor: '#ACADAD',
    borderRadius: 50,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#25B7D3',
    borderRadius: 50,
  },
  progressText: {
    color: '#25B7D3',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#25B7D3',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '48%',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 6,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#093030',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#546E7A',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingLeft: 18,
  },
  settingLabel: {
    color: '#263238',
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
  encryptionSection: {

  },
  encryptionTitle: {
    color: '#093030',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  encryptionDescription: {
    color: '#546E7A',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  divider: {
    height: 14,
    borderRadius: 50,
    backgroundColor: '#ACADAD',
    marginVertical: 12,
  },
  saveButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomTabBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#25B7D3',
  paddingVertical: 18,
  paddingBottom: 28,               
  borderTopLeftRadius: 60,         
  borderTopRightRadius: 0,         
  elevation: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  height: 95,
  position: 'absolute',            
  bottom: 0,
  left: 0,
  right: 0,
},
  tabItem: {
    padding: 8,
  },
});

export default BackupScreen;