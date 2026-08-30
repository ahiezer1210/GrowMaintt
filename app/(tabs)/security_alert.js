import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SecurityAlertScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1C2D" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Security Alert</Text>

        <View style={styles.headerRight}>
          <View style={styles.checkCircle}>
            <Icon name="notifications" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.warningTriangle}>
              <Text style={styles.exclamation}>!</Text>
            </View>
          </View>
          <View style={[styles.decorLine, styles.lineTopLeft]} />
          <View style={[styles.decorLine, styles.lineTopRight]} />
          <View style={[styles.decorLine, styles.lineBottomLeft]} />
          <View style={[styles.decorLine, styles.lineBottomRight]} />
        </View>

        <Text style={styles.mainTitle}>New Login Attempt</Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="smartphone" size={75} color="#333" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Device</Text>
            <Text style={styles.infoValue}>Samsung Galaxy A06</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="location-outline" size={30} color="#333" />
          <Text style={styles.locationText}>San Salvador, El Salvador</Text>
        </View>

        <Text style={styles.question}>Was this you?</Text>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Yes, It Was Me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>No, It Was Not Me</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bar-chart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="swap-horizontal-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="library-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1C2D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0B1C2D',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTriangle: {
    width: 72,
    height: 72,
    backgroundColor: '#2B6CE5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '0deg' }],
  },
  exclamation: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  decorLine: {
    position: 'absolute',
    width: 16,
    height: 3,
    backgroundColor: '#2B6CE5',
    borderRadius: 2,
  },
  lineTopLeft: {
    top: 18,
    left: 12,
    transform: [{ rotate: '-40deg' }],
  },
  lineTopRight: {
    top: 18,
    right: 12,
    transform: [{ rotate: '40deg' }],
  },
  lineBottomLeft: {
    bottom: 22,
    left: 12,
    transform: [{ rotate: '40deg' }],
  },
  lineBottomRight: {
    bottom: 22,
    right: 12,
    transform: [{ rotate: '-40deg' }],
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 28,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  locationText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    paddingLeft: 12,
  },
  question: {
    fontSize: 16,
    color: '#555',
    marginTop: 12,
    marginBottom: 24,
  },
  primaryButton: {
    width: '65%',
    backgroundColor: '#0B1C2D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '65%',
    backgroundColor: '#0B1C2D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0B1C2D',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#00B4D8',
    paddingVertical: 14,
    paddingBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
});

export default SecurityAlertScreen;